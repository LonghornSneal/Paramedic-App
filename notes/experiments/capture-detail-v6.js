const { chromium } = require('playwright');
const path = require('path');

const item = { file: 'notes/experiments/adult-protocol-detail-v6-option-01-generic-sequence.html', slug: 'generic-sequence' };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1180, height: 1700 } });
  const filePath = path.resolve(item.file);
  const baseUrl = 'file:///' + filePath.replace(/\\/g, '/');

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({ path: `notes/screenshots/adult-detail-v6-${item.slug}-before.png`, fullPage: true });

  await page.goto(`${baseUrl}?expanded=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({ path: `notes/screenshots/adult-detail-v6-${item.slug}-after.png`, fullPage: true });

  await browser.close();
})();
