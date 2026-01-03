// Playwright test covering the cricothyrotomy detail renderer.

import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';

async function waitForHttp(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function probe() {
      const req = http.get(url, res => {
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Server not reachable'));
        } else {
          setTimeout(probe, 500);
        }
      });
    })();
  });
}

let serverProc;

test.beforeAll(async () => {
  try {
    await waitForHttp('http://localhost:5173');
  } catch {
    const isWin = process.platform === 'win32';
    const serverBin = path.resolve(process.cwd(), isWin ? 'node_modules/.bin/http-server.cmd' : 'node_modules/.bin/http-server');
    const command = isWin ? 'cmd.exe' : serverBin;
    const args = isWin ? ['/c', serverBin, '-p', '5173', '-c-1'] : ['-p', '5173', '-c-1'];
    serverProc = spawn(command, args, { stdio: 'ignore', shell: false });
    await waitForHttp('http://localhost:5173');
  }
});

test.afterAll(async () => {
  if (serverProc && !serverProc.killed) {
    serverProc.kill();
  }
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
