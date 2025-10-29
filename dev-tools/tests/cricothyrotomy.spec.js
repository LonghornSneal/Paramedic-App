// Playwright test covering the cricothyrotomy detail renderer.

import { test, expect } from '@playwright/test';
import previewServer from './utils/previewServer.cjs';

const { ensurePreviewServer, shutdownPreviewServer } = previewServer;

test.beforeAll(async () => {
  await ensurePreviewServer();
});

test.afterAll(async () => {
  await shutdownPreviewServer();
});

test('Procedure indication banner renders and captures screenshot', async ({ page }, testInfo) => {
  await page.goto('http://localhost:5173/');
  await page.waitForFunction(() => typeof window.renderDetailPage === 'function');
  await page.evaluate(() => window.renderDetailPage('adult-cricothyrotomy', false, false));

  const banner = page.locator('.cric-banner');
  await expect(banner).toBeVisible();

  const headline = banner.locator('.cric-banner-headline');
  await expect(headline).toContainText('Cannot intubate');

  const screenshotPath = testInfo.outputPath('procedure-indication.png');
  await banner.screenshot({ path: screenshotPath, animations: 'disabled', caret: 'hide' });
  await testInfo.attach('procedure-indication', {
    path: screenshotPath,
    contentType: 'image/png',
  });

  const toggleButtons = page.locator('.cric-toggle-button');
  const toggleCount = await toggleButtons.count();
  if (toggleCount > 1) {
    await toggleButtons.nth(1).click();
    await expect(toggleButtons.nth(1)).toHaveClass(/is-active/);
  }
});
