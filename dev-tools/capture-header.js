const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function main() {
  const [, , url, outPath, widthArg, heightArg] = process.argv;
  if (!url || !outPath) {
    console.error('Usage: node dev-tools/capture-header.js <url> <outputPath> [width] [height]');
    process.exit(1);
  }

  const width = widthArg ? parseInt(widthArg, 10) : 1280;
  const height = heightArg ? parseInt(heightArg, 10) : 720;

  if (Number.isNaN(width) || Number.isNaN(height)) {
    console.error('Width and height must be numbers.');
    process.exit(1);
  }

  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width, height } });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.main-header', { state: 'visible', timeout: 15000 });

    const headerLocator = page.locator('.main-header');
    const bounding = await headerLocator.boundingBox();

    if (!bounding) {
      throw new Error('Failed to measure header bounding box.');
    }

    await headerLocator.screenshot({ path: outPath });

    const rowMetrics = await page.evaluate(() => {
      const selectors = [
        '.main-header-top',
        '.main-header-bottom',
        '.main-header-snapshot'
      ];

      return selectors.map(selector => {
        const element = document.querySelector(selector);
        return {
          selector,
          height: element ? Math.round(element.getBoundingClientRect().height * 100) / 100 : null
        };
      });
    });

    const headerHeight = Math.round(bounding.height * 100) / 100;

    const result = {
      url,
      screenshot: path.resolve(outPath),
      viewport: { width, height },
      headerHeight,
      rowMetrics
    };

    console.log(JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
