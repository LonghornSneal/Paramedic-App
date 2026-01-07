const { chromium } = require("playwright");
const path = require("path");

const items = [
  {
    file: "notes/experiments/adult-protocol-detail-v9-option-01-stacked-triage-rail.html",
    slug: "stacked-triage-rail",
  },
  {
    file: "notes/experiments/adult-protocol-detail-v9-option-02-split-focus-columns.html",
    slug: "split-focus-columns",
  },
  {
    file: "notes/experiments/adult-protocol-detail-v9-option-03-command-card-deck.html",
    slug: "command-card-deck",
  },
  {
    file: "notes/experiments/adult-protocol-detail-v9-option-04-signal-ladder.html",
    slug: "signal-ladder",
  },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1800 } });

  for (const item of items) {
    const filePath = path.resolve(item.file);
    const baseUrl = "file:///" + filePath.replace(/\\/g, "/");

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `notes/screenshots/adult-detail-v9-${item.slug}-before.png`, fullPage: true });

    await page.goto(`${baseUrl}?expanded=1`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `notes/screenshots/adult-detail-v9-${item.slug}-after.png`, fullPage: true });
  }

  await browser.close();
})();
