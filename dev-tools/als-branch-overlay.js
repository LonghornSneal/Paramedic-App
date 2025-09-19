const path = require('path');
const httpServer = require('http-server');
const { chromium } = require('playwright');

(async () => {
  const projectRoot = path.resolve(__dirname, '..');
  const outPath = path.join(projectRoot, 'mockups', 'als-branch-overlay.png');
  const fs = require('fs');
  if (!fs.existsSync(path.dirname(outPath))) fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const server = httpServer.createServer({ root: projectRoot, cache: -1 });
  await new Promise((resolve, reject) => server.listen(0, err => err ? reject(err) : resolve()));
  const port = server.server.address().port;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await page.locator('span:has-text("ALS Medications")').first().click();
  const medLink = page.locator('a.topic-link-item:has-text("10% Calcium Chloride")').first();
  await medLink.waitFor({ state: 'visible' });
  await medLink.click();
  await page.locator('h2.topic-h2:has-text("10% Calcium Chloride")').waitFor({ state: 'visible' });

  const inject = await page.evaluate(() => {
    const content = document.getElementById('content-area');
    if (!content) return { ok:false, reason:'no content' };
    const adultHeader = content.querySelector('#adult-rx');
    const adultList = content.querySelector('ul.rx-list.rx-adult');
    if (!adultHeader || !adultList) return { ok:false, reason:'missing adult rx' };

    const rect = content.getBoundingClientRect();
    const overlayId = 'branch-overlay';
    const existing = document.getElementById(overlayId);
    if (existing) existing.remove();

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', overlayId);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    svg.setAttribute('width', rect.width);
    svg.setAttribute('height', rect.height);
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    content.style.position = 'relative';
    content.appendChild(svg);

    const mkLine = (x1,y1,x2,y2,width,color) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',x1);
      line.setAttribute('y1',y1);
      line.setAttribute('x2',x2);
      line.setAttribute('y2',y2);
      line.setAttribute('stroke',color);
      line.setAttribute('stroke-width',width);
      line.setAttribute('stroke-linecap','square');
      svg.appendChild(line);
      return line;
    };

    const BLUE = '#1f3fb8';
    const DARK = '#10246d';

    const listRect = adultList.getBoundingClientRect();
    const headerRect = adultHeader.getBoundingClientRect();
    const spineX = Math.max(14, listRect.left - rect.left - 60);
    const spineTop = headerRect.bottom - rect.top + 6;
    const spineBottom = listRect.bottom - rect.top + 12;
    mkLine(spineX, spineTop, spineX, spineBottom, 18, BLUE);
    mkLine(spineX-6, spineTop+6, spineX-6, spineBottom-6, 4, DARK);

    const items = Array.from(adultList.querySelectorAll('li.rx-item'));
    items.forEach((li, idx) => {
      const r = li.getBoundingClientRect();
      const midY = r.top - rect.top + r.height/2;
      const left = r.left - rect.left;
      mkLine(spineX, midY, left - 16, midY, 16, BLUE);
      if (idx === 0) {
        const top = r.top - rect.top;
        const h = r.height;
        const elbowY = top + h*0.45;
        const elbowX = left + 90;
        mkLine(left+12, elbowY, elbowX, elbowY, 12, BLUE);
        mkLine(elbowX, elbowY, elbowX, elbowY+80, 12, BLUE);
        const pill = document.createElementNS('http://www.w3.org/2000/svg','rect');
        pill.setAttribute('x', elbowX + 24);
        pill.setAttribute('y', elbowY + 42);
        pill.setAttribute('width', 320);
        pill.setAttribute('height', 74);
        pill.setAttribute('rx', 12);
        pill.setAttribute('ry', 12);
        pill.setAttribute('fill', '#e6efff');
        pill.setAttribute('stroke', BLUE);
        pill.setAttribute('stroke-width', 6);
        svg.appendChild(pill);
      }
    });

    return { ok:true, count: items.length };
  });

  console.log('overlay status', inject);

  await page.locator('#content-area').screenshot({ path: outPath });
  await browser.close();
  server.close();
  console.log('Saved', outPath);
})();
