const path = require('path');
const httpServer = require('http-server');
const { chromium } = require('playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const port = 4173;
  const server = httpServer.createServer({ root, cache: -1 });
  await new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`http-server listening on http://127.0.0.1:${port}`);
        resolve();
      }
    });
  });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });

  await page.waitForSelector('span:has-text("ALS Medications")');
  await page.locator('span:has-text("ALS Medications")').first().click();
  const medLink = page.locator('a.topic-link-item:has-text("10% Calcium Chloride")');
  await medLink.first().waitFor({ state: 'visible' });
  await medLink.first().click();
  await page.locator('h2.topic-h2:has-text("10% Calcium Chloride")').waitFor({ state: 'visible' });

  const screenshotPath = path.join(root, 'dev-tools', 'als-medication-detail.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved: ${screenshotPath}`);

  await browser.close();
  server.close();
})();
