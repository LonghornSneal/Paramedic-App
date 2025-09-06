// Playwright E2E tests for Quick Vent Guide (Zoll Set Up)
// Run with: npx playwright test dev-tools/tests/ventilation.spec.js

import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import http from 'node:http';

async function waitForHttp(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function probe() {
      const req = http.get(url, res => { res.resume(); resolve(true); });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('Server not reachable'));
        else setTimeout(probe, 500);
      });
    })();
  });
}

let serverProc;

test.beforeAll(async () => {
  // If preview not running, start a static server
  try {
    await waitForHttp('http://localhost:5173');
  } catch {
    serverProc = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['http-server', '-p', '5173', '-c-1'], {
      stdio: 'ignore', shell: false,
    });
    await waitForHttp('http://localhost:5173');
  }
});

test.afterAll(async () => {
  if (serverProc && !serverProc.killed) serverProc.kill();
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

