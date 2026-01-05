const { chromium } = require('playwright');
const path = require('path');

const options = [
  { file: 'notes/experiments/adult-protocol-detail-v4-option-01-tactical-grid.html', slug: 'tactical-grid' },
  { file: 'notes/experiments/adult-protocol-detail-v4-option-02-strike-console.html', slug: 'strike-console' },
  { file: 'notes/experiments/adult-protocol-detail-v4-option-03-ladder-brief.html', slug: 'ladder-brief' },
  { file: 'notes/experiments/adult-protocol-detail-v4-option-04-radar-dock.html', slug: 'radar-dock' },
  { file: 'notes/experiments/adult-protocol-detail-v4-option-05-ops-column.html', slug: 'ops-column' }
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1180, height: 1700 } });

  for (const item of options) {
    const filePath = path.resolve(item.file);
    const baseUrl = 'file:///' + filePath.replace(/\\/g, '/');

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `notes/screenshots/adult-detail-v4-${item.slug}-before.png`, fullPage: true });

    await page.goto(`${baseUrl}?expanded=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `notes/screenshots/adult-detail-v4-${item.slug}-after.png`, fullPage: true });
  }

  await browser.close();
})();
