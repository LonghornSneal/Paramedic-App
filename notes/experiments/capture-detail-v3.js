const { chromium } = require('playwright');
const path = require('path');

const options = [
  { file: 'notes/experiments/adult-protocol-detail-v3-option-01-critical-beacon.html', slug: 'critical-beacon' },
  { file: 'notes/experiments/adult-protocol-detail-v3-option-02-barricade-tabs.html', slug: 'barricade-tabs' }
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1100, height: 1600 } });

  for (const item of options) {
    const filePath = path.resolve(item.file);
    const baseUrl = 'file:///' + filePath.replace(/\\/g, '/');

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `notes/screenshots/adult-detail-v3-${item.slug}-before.png`, fullPage: true });

    await page.goto(`${baseUrl}?expanded=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `notes/screenshots/adult-detail-v3-${item.slug}-after.png`, fullPage: true });
  }

  await browser.close();
})();
