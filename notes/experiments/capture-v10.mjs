import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { resolve } from "path";
import { pathToFileURL } from "url";

const variants = [
  { slug: "ribbon-surge", file: "notes/experiments/adult-protocol-detail-v10-option-01-ribbon-surge.html" },
  { slug: "ledger-flare", file: "notes/experiments/adult-protocol-detail-v10-option-02-ledger-flare.html" },
  { slug: "blockshift-grid", file: "notes/experiments/adult-protocol-detail-v10-option-03-blockshift-grid.html" },
  { slug: "folded-arc", file: "notes/experiments/adult-protocol-detail-v10-option-04-folded-arc.html" },
  { slug: "rail-pocket", file: "notes/experiments/adult-protocol-detail-v10-option-05-rail-pocket.html" },
  { slug: "cutline-stack", file: "notes/experiments/adult-protocol-detail-v10-option-06-cutline-stack.html" },
  { slug: "mosaic-crest", file: "notes/experiments/adult-protocol-detail-v10-option-07-mosaic-crest.html" },
  { slug: "halo-notches", file: "notes/experiments/adult-protocol-detail-v10-option-08-halo-notches.html" }
];

const outDir = resolve("notes", "screenshots");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(15000);

for (const variant of variants) {
  const fileUrl = pathToFileURL(resolve(variant.file)).href;
  await page.goto(fileUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: resolve(outDir, `adult-detail-v10-${variant.slug}-before.png`),
    fullPage: true
  });

  await page.goto(`${fileUrl}?expanded=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: resolve(outDir, `adult-detail-v10-${variant.slug}-after.png`),
    fullPage: true
  });
}

await browser.close();
