// dev-tools/smoke.js
// Simple static server + Puppeteer smoke test to verify SPA boots and renders details

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const rootDir = path.resolve(__dirname, '..');

const MIME = new Map([
  ['.html', 'text/html; charset=UTF-8'],
  ['.js',   'text/javascript; charset=UTF-8'],
  ['.mjs',  'text/javascript; charset=UTF-8'],
  ['.css',  'text/css; charset=UTF-8'],
  ['.json', 'application/json; charset=UTF-8'],
  ['.svg',  'image/svg+xml'],
  ['.png',  'image/png'],
  ['.jpg',  'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif',  'image/gif'],
  ['.ico',  'image/x-icon'],
  ['.md',   'text/markdown; charset=UTF-8']
]);

function serveFile(filePath, res) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME.get(ext) || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let fsPath = path.normalize(path.join(rootDir, urlPath));
    if (!fsPath.startsWith(rootDir)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    if (urlPath === '/' || urlPath === '') {
      fsPath = path.join(rootDir, 'index.html');
      return serveFile(fsPath, res);
    }
    if (fs.existsSync(fsPath) && fs.statSync(fsPath).isDirectory()) {
      const indexPath = path.join(fsPath, 'index.html');
      if (fs.existsSync(indexPath)) return serveFile(indexPath, res);
    }
    return serveFile(fsPath, res);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  }
});

async function run() {
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Static server on http://localhost:${PORT}`);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#content-area');

  // Expand first category to reveal topics
  await page.click('#content-area .category-card');

  // Click first topic
  await page.waitForSelector('#content-area .topic-link-item', { timeout: 5000 });
  const topicTitle = await page.$eval('#content-area .topic-link-item', el => el.textContent);
  await page.click('#content-area .topic-link-item');

  // Detail should render
  await page.waitForSelector('#content-area .topic-h2', { timeout: 5000 });
  const h2 = await page.$eval('#content-area .topic-h2', el => el.textContent);
  console.log('Opened topic:', topicTitle, '->', h2);

  if (consoleErrors.length) {
    console.log('Console errors:\n' + consoleErrors.join('\n'));
  }

  await browser.close();
  server.close();
}

run().catch(err => {
  console.error('Smoke test failed:', err);
  try { server.close(); } catch {}
  process.exit(1);
});
