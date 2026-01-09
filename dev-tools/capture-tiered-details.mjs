import playwright from '../node_modules/playwright/index.js';
import { mkdir } from 'fs/promises';
import { resolve } from 'path';

const baseUrl = 'http://127.0.0.1:5173/';
const outDir = resolve('notes', 'screenshots');
const topics = [
  { id: 'adult-seizure', slug: 'adult-seizure' },
  { id: 'adult-sepsis', slug: 'adult-sepsis' }
];
const { chromium } = playwright;

async function expandAllToggles(page) {
  for (let i = 0; i < 4; i += 1) {
    await page.evaluate(() => {
      document.querySelectorAll('.toggle-category[aria-expanded="false"]').forEach(el => el.click());
      document.querySelectorAll('.toggle-info[aria-expanded="false"]').forEach(el => el.click());
    });
    await page.waitForTimeout(150);
  }
}

async function renderTopic(page, topicId) {
  await page.evaluate(id => window.renderDetailPage(id), topicId);
  await page.waitForSelector(`.title-tier[data-topic-id="${topicId}"]`, { state: 'visible' });
  await page.waitForTimeout(250);
  await expandAllToggles(page);
}

async function captureTopic(page, topic, viewport, suffix) {
  await page.setViewportSize(viewport);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await renderTopic(page, topic.id);
  const outPath = resolve(outDir, `${topic.slug}-${suffix}.png`);
  await page.screenshot({ path: outPath, fullPage: true });
  return outPath;
}

async function run() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);

  for (const topic of topics) {
    await captureTopic(page, topic, { width: 1400, height: 900 }, 'desktop');
    await captureTopic(page, topic, { width: 390, height: 844 }, 'mobile');
  }

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
