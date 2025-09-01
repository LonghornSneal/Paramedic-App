// dev-tools/serve.js
// Standalone static file server for the Paramedic App

const http = require('http');
const fs = require('fs');
const path = require('path');

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

server.listen(PORT, () => {
  console.log(`[serve] Static server running at http://localhost:${PORT}/`);
});

