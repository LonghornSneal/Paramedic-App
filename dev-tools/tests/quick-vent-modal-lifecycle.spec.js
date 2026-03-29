import { test, expect } from '@playwright/test';
import { ensurePreviewServer, shutdownPreviewServer } from './utils/previewServer.cjs';

test.beforeAll(async () => {
  await ensurePreviewServer();
});

test.afterAll(async () => {
  await shutdownPreviewServer();
});

async function openQuickVent(page) {
  await page.goto('/');
  await page.waitForFunction(() => typeof window.renderDetailPage === 'function');
  await page.evaluate(() => window.renderDetailPage('zoll-quick-vent-zoll-setup', false, false));
  await page.locator('#qv-weight-kg').fill('70');
  await page.locator('#qv-ards button[data-val="unsure"]').click();
  await expect(page.locator('#qv-tv')).toBeVisible();
}

test('Quick Vent modal keeps a single instance and releases drag listeners after close', async ({ page }) => {
  await page.addInitScript(() => {
    const tracker = {
      mousemove: new Set(),
      mouseup: new Set(),
    };
    const addEventListener = window.addEventListener.bind(window);
    const removeEventListener = window.removeEventListener.bind(window);

    window.__quickVentListenerTracker = tracker;

    window.addEventListener = function patchedAddEventListener(type, listener, options) {
      if (type === 'mousemove' || type === 'mouseup') {
        tracker[type].add(listener);
      }
      return addEventListener(type, listener, options);
    };

    window.removeEventListener = function patchedRemoveEventListener(type, listener, options) {
      if (type === 'mousemove' || type === 'mouseup') {
        tracker[type].delete(listener);
      }
      return removeEventListener(type, listener, options);
    };
  });

  await openQuickVent(page);

  const baselineState = await page.evaluate(() => ({
    modalCount: document.querySelectorAll('#qv-modal').length,
    mousemove: window.__quickVentListenerTracker.mousemove.size,
    mouseup: window.__quickVentListenerTracker.mouseup.size,
  }));

  expect(baselineState.modalCount).toBe(0);

  for (let iteration = 0; iteration < 3; iteration += 1) {
    await page.locator('#qv-tv').click();

    await expect(page.locator('#qv-modal')).toHaveCount(1);
    await expect(page.locator('#qv-modal')).toBeVisible();

    const openState = await page.evaluate(() => ({
      modalCount: document.querySelectorAll('#qv-modal').length,
      mousemove: window.__quickVentListenerTracker.mousemove.size,
      mouseup: window.__quickVentListenerTracker.mouseup.size,
    }));

    expect(openState).toEqual({
      modalCount: 1,
      mousemove: baselineState.mousemove + 1,
      mouseup: baselineState.mouseup + 1,
    });

    await page.locator('#qv-close').click();
    await expect(page.locator('#qv-modal')).toHaveCount(0);

    const closedState = await page.evaluate(() => ({
      modalCount: document.querySelectorAll('#qv-modal').length,
      mousemove: window.__quickVentListenerTracker.mousemove.size,
      mouseup: window.__quickVentListenerTracker.mouseup.size,
    }));

    expect(closedState).toEqual(baselineState);
  }
});
