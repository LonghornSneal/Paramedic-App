import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';

const VIEWPORTS = [
  { name: '360x640', width: 360, height: 640 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
  { name: '414x896', width: 414, height: 896 }
];

let serverProc;

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

async function gotoApp(page, viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('#content-area .category-card');
  await page.waitForTimeout(600);
}

async function commitSearch(page, term) {
  await page.fill('#searchInput', term);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(900);
}

async function goHome(page) {
  await page.click('#nav-home-button');
  await page.waitForTimeout(800);
  await page.waitForSelector('#content-area .category-card');
}

async function openQuickVent(page) {
  await page.getByRole('button', { name: /Skills\/Equipment/i }).click();
  await page.waitForTimeout(350);
  await page.getByRole('button', { name: /Zoll EMV731/i }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /Quick Vent Guide/i }).click();
  await page.waitForTimeout(750);
}

async function readTreeMetrics(page) {
  return await page.evaluate(() => {
    const content = document.getElementById('content-area');
    const contentRect = content.getBoundingClientRect();
    const nodeMetrics = Array.from(content.querySelectorAll('.category-card, .topic-link-item'))
      .filter(el => el.offsetParent && el.getClientRects().length)
      .map(el => {
        const rect = el.getBoundingClientRect();
        const label = el.matches('.category-card') ? el.querySelector('.category-card-title') : el;
        return {
          text: (el.textContent || '').trim(),
          left: rect.left - contentRect.left,
          right: rect.right - contentRect.left,
          scrollWidth: label?.scrollWidth ?? 0,
          clientWidth: label?.clientWidth ?? 0
        };
      });
    return {
      contentWidth: contentRect.width,
      leftClipped: nodeMetrics.filter(node => node.left < -1).map(node => node.text),
      rightClipped: nodeMetrics.filter(node => node.right > contentRect.width + 2).map(node => node.text),
      wrappedOverflow: nodeMetrics
        .filter(node => node.scrollWidth > node.clientWidth + 1)
        .map(node => node.text)
    };
  });
}

async function expectTreeInsideContent(page) {
  const metrics = await readTreeMetrics(page);
  expect(metrics.leftClipped).toEqual([]);
  expect(metrics.rightClipped).toEqual([]);
  expect(metrics.wrappedOverflow).toEqual([]);
}

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

test.describe.configure({ mode: 'serial' });

test('search-first order keeps mobile branches inside the content area', async ({ page }) => {
  test.setTimeout(120000);
  for (const viewport of VIEWPORTS) {
    await test.step(viewport.name, async () => {
      await gotoApp(page, viewport);

      await commitSearch(page, 'seizure');
      await expectTreeInsideContent(page);

      await page.getByRole('button', { name: 'Seizure' }).first().click();
      await page.waitForTimeout(900);
      await page.click('#nav-back-button');
      await page.waitForTimeout(900);
      await expectTreeInsideContent(page);

      await goHome(page);
      await openQuickVent(page);
      await expectTreeInsideContent(page);

      await page.getByRole('button', { name: 'Zoll Set Up', exact: true }).click();
      await page.waitForTimeout(1000);
      await page.click('#nav-back-button');
      await page.waitForTimeout(900);
      await expectTreeInsideContent(page);
    });
  }
});

test('quick-vent-first order stays stable through nav cycles and viewport changes', async ({ page }) => {
  test.setTimeout(120000);
  await gotoApp(page, VIEWPORTS[1]);

  await openQuickVent(page);
  await expectTreeInsideContent(page);

  await page.getByRole('button', { name: 'Zoll Set Up', exact: true }).click();
  await page.waitForTimeout(1000);
  await page.click('#nav-back-button');
  await page.waitForTimeout(900);
  await page.click('#nav-forward-button');
  await page.waitForTimeout(1000);
  await page.click('#nav-back-button');
  await page.waitForTimeout(900);
  await expectTreeInsideContent(page);

  await goHome(page);
  await commitSearch(page, 'seizure');
  await expectTreeInsideContent(page);

  for (const viewport of [VIEWPORTS[2], VIEWPORTS[0], VIEWPORTS[1]]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(700);
    await expectTreeInsideContent(page);
  }
});
