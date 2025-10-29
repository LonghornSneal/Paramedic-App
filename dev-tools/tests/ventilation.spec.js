// Playwright E2E tests for Quick Vent Guide (Zoll Set Up)
// Run with: npx playwright test dev-tools/tests/ventilation.spec.js

import { test, expect } from '@playwright/test';
import previewServer from './utils/previewServer.cjs';

const { ensurePreviewServer, shutdownPreviewServer } = previewServer;

test.beforeAll(async () => {
  await ensurePreviewServer();
});

test.afterAll(async () => {
  await shutdownPreviewServer();
});

test('Not Sure shows two distinct ranges with labels; popup formulas are explicit', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForFunction(() => typeof window.renderDetailPage === 'function');
  await page.evaluate(() => window.renderDetailPage('zoll-quick-vent-zoll-setup', false, false));
  await page.locator('#qv-weight-kg').fill('70');
  await page.locator('#qv-ards button[data-val="unsure"]').click();

  const tv = page.locator('#qv-tv');
  await expect(tv).toBeVisible();
  const text = await tv.innerText();
  const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
  expect(lines.length).toBe(2);
  expect(lines[0]).toContain('(no ARDS)');
  expect(lines[1]).toContain('(ARDS)');
  expect(lines[0]).not.toEqual(lines[1]);

  // Open Calculation Details modal
  await tv.click();
  const modal = page.locator('.qv-modal');
  await expect(modal).toBeVisible();
  const modalText = (await modal.innerText()).replace(/\s+/g, ' ').toLowerCase();
  // Check key values appear for both pt types
  expect(modalText).toContain('no ards');
  expect(modalText).toContain('ards');
  expect(modalText).toContain('420 ml');
  expect(modalText).toContain('560 ml');
  expect(modalText).toContain('280 ml');
});

test('Sex icon remains visible when selected', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForFunction(() => typeof window.renderDetailPage === 'function');
  await page.evaluate(() => window.renderDetailPage('zoll-quick-vent-zoll-setup', false, false));
  const maleBtn = page.locator('#qv-sex button[data-val="male"]');
  await maleBtn.click();
  // Background should be the themed blue when selected
  const bg = await maleBtn.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe('rgba(0, 0, 0, 0)');
});

