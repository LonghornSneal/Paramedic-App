import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { resolve } from "path";
import { pathToFileURL } from "url";

const variants = [
  { slug: "violet-grid", file: "notes/experiments/adult-protocol-detail-v11-option-01-violet-grid.html" },
  { slug: "crimson-shift", file: "notes/experiments/adult-protocol-detail-v11-option-02-crimson-shift.html" },
  { slug: "indigo-fog", file: "notes/experiments/adult-protocol-detail-v11-option-03-indigo-fog.html" },
  { slug: "royal-veil", file: "notes/experiments/adult-protocol-detail-v11-option-04-royal-veil.html" },
  { slug: "ember-prism", file: "notes/experiments/adult-protocol-detail-v11-option-05-ember-prism.html" },
  { slug: "sapphire-haze", file: "notes/experiments/adult-protocol-detail-v11-option-06-sapphire-haze.html" },
  { slug: "magenta-arc", file: "notes/experiments/adult-protocol-detail-v11-option-07-magenta-arc.html" },
  { slug: "cobalt-bloom", file: "notes/experiments/adult-protocol-detail-v11-option-08-cobalt-bloom.html" },
  { slug: "plum-strata", file: "notes/experiments/adult-protocol-detail-v11-option-09-plum-strata.html" },
  { slug: "ruby-aurora", file: "notes/experiments/adult-protocol-detail-v11-option-10-ruby-aurora.html" }
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
    path: resolve(outDir, `adult-detail-v11-${variant.slug}-before.png`),
    fullPage: true
  });

  await page.goto(`${fileUrl}?expanded=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: resolve(outDir, `adult-detail-v11-${variant.slug}-after.png`),
    fullPage: true
  });
}

await browser.close();
