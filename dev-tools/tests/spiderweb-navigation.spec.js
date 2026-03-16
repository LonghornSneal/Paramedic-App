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
        if (Date.now() - start > timeoutMs) reject(new Error('Server not reachable'));
        else setTimeout(probe, 500);
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
  if (serverProc && !serverProc.killed) serverProc.kill();
});

test('search keeps the spiderweb visible and highlights a matching branch', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.fill('#searchInput', 'seizure');
  await page.waitForTimeout(1600);

  const seizure = page.locator('.topic-link-item', { hasText: 'Seizure' }).first();
  await expect(seizure).toBeVisible();

  const metrics = await page.evaluate(() => {
    const content = document.getElementById('content-area').getBoundingClientRect();
    const nodes = Array.from(document.querySelectorAll('.category-card, .topic-link-item'))
      .map(node => node.getBoundingClientRect())
      .filter(rect => rect.width > 0 && rect.height > 0);
    let minLeft = Infinity;
    let minTop = Infinity;
    let maxRight = -Infinity;
    let maxBottom = -Infinity;
    nodes.forEach(rect => {
      minLeft = Math.min(minLeft, rect.left);
      minTop = Math.min(minTop, rect.top);
      maxRight = Math.max(maxRight, rect.right);
      maxBottom = Math.max(maxBottom, rect.bottom);
    });
    return {
      minLeft: minLeft - content.left,
      minTop: minTop - content.top,
      maxRight: maxRight - content.left,
      maxBottom: maxBottom - content.top,
      contentWidth: content.width,
      contentHeight: content.height
    };
  });

  expect(metrics.minLeft).toBeGreaterThanOrEqual(-2);
  expect(metrics.minTop).toBeGreaterThanOrEqual(-2);
  expect(metrics.maxRight).toBeLessThanOrEqual(metrics.contentWidth + 2);
  expect(metrics.maxBottom).toBeLessThanOrEqual(metrics.contentHeight + 2);
});

test('minor patient context emphasizes pediatric protocols over adult protocols', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.click('#open-sidebar-button');
  await page.fill('#pt-age', '12');
  await page.fill('#pt-indications', 'seizure');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(700);
  await page.click('#close-sidebar-button');
  await page.waitForTimeout(400);

  const sizes = await page.evaluate(() => {
    const pediatric = document.querySelector('.category-card[data-category-id="pediatric-protocols"]');
    const adult = document.querySelector('.category-card[data-category-id="adult-protocols"]');
    const pediatricRect = pediatric?.getBoundingClientRect();
    const adultRect = adult?.getBoundingClientRect();
    return {
      pediatricWidth: pediatricRect?.width || 0,
      adultWidth: adultRect?.width || 0,
      pediatricOpacity: pediatric ? Number(getComputedStyle(pediatric).opacity) : 0,
      adultOpacity: adult ? Number(getComputedStyle(adult).opacity) : 0
    };
  });

  expect(sizes.pediatricWidth).toBeGreaterThan(sizes.adultWidth);
  expect(sizes.pediatricOpacity).toBeGreaterThan(sizes.adultOpacity);
});

test('clicking a terminal pill opens the matching detail page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByText('ADULT PROTOCOLS').click();
  await page.waitForTimeout(350);
  await page.getByText('MEDICAL EMERGENCIES').click();
  await page.waitForTimeout(350);
  await page.getByText('Seizure').click();
  await expect(page.locator('.topic-h2')).toHaveText(/Seizure/i);
  await expect(page.locator('#content-area')).not.toHaveClass(/spiderweb-mode/);
});
