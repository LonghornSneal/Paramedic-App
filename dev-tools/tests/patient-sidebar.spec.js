import { test, expect } from '@playwright/test';
import path from 'node:path';
import http from 'node:http';
import httpServer from 'http-server';

const ROOT_URL = 'http://127.0.0.1:5173/';
let serverInstance;

async function waitForHttp(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function probe() {
      const req = http.get(url, res => {
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('Server not reachable'));
        else setTimeout(probe, 300);
      });
    })();
  });
}

test.beforeAll(async () => {
  try {
    await waitForHttp(ROOT_URL);
  } catch {
    serverInstance = httpServer.createServer({
      root: path.resolve('.'),
      cache: -1,
      silent: true
    });
    await new Promise(resolve => {
      serverInstance.listen(5173, '127.0.0.1', () => {
        serverInstance.server.unref();
        resolve();
      });
    });
    await waitForHttp(ROOT_URL);
  }
});

test('patient sidebar renders on tablet layout without wrapping', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(ROOT_URL);
  await page.waitForSelector('#open-sidebar-button');
  await page.click('#open-sidebar-button');
  const sidebar = page.locator('#patient-sidebar');
  await expect(sidebar).toBeVisible();

  // capture snapshot for manual review
  await sidebar.screenshot({ path: 'test-results/patient-sidebar-tablet.png' });

  // ensure each vital row stays single lined
  const rows = await page.$$eval('.vital-row', els =>
    els.map(el => ({
      height: el.getBoundingClientRect().height,
      scrollHeight: el.scrollHeight,
      wrappers: Array.from(el.children).map(child => child.getBoundingClientRect().height)
    }))
  );

  // rows taller than 110px likely wrapped; record for debugging
  const problematic = rows
    .map((row, index) => ({ index, row }))
    .filter(entry => entry.row.height > 110 || entry.row.scrollHeight - entry.row.height > 1);
  expect(problematic.length, `Rows wrapping: ${JSON.stringify(problematic)}`).toBe(0);
});
