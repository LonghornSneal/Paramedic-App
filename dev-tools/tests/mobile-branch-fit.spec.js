import { test } from '@playwright/test';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { expectSpiderwebGeometry } from './spiderwebGeometry.js';

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

async function expectTreeInsideContent(page, options = {}) {
  await expectSpiderwebGeometry(page, {
    ...options,
    maxRightPadding: 2,
    allowHorizontalClip: false,
    allowOverlap: false,
    allowWrappedOverflow: false
  });
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
      await expectTreeInsideContent(page, {
        label: `${viewport.name} seizure search`,
        minLeft: -20,
        minFontSize: 14
      });

      await page.getByRole('button', { name: 'Seizure' }).first().click();
      await page.waitForTimeout(900);
      await page.click('#nav-back-button');
      await page.waitForTimeout(900);
      await expectTreeInsideContent(page, {
        label: `${viewport.name} seizure back`,
        minLeft: -20,
        minFontSize: 14
      });

      await goHome(page);
      await openQuickVent(page);
      await expectTreeInsideContent(page, {
        label: `${viewport.name} quick vent`,
        minLeft: -100,
        minFontSize: 14
      });

      await page.getByRole('button', { name: 'Zoll Set Up', exact: true }).click();
      await page.waitForTimeout(1000);
      await page.click('#nav-back-button');
      await page.waitForTimeout(900);
      await expectTreeInsideContent(page, {
        label: `${viewport.name} quick vent back`,
        minLeft: -100,
        minFontSize: 14
      });
    });
  }
});

test('quick-vent-first order stays stable through nav cycles and viewport changes', async ({ page }) => {
  test.setTimeout(120000);
  await gotoApp(page, VIEWPORTS[1]);

  await openQuickVent(page);
  await expectTreeInsideContent(page, {
    label: '390x844 quick vent-first',
    minLeft: -100,
    minFontSize: 14
  });

  await page.getByRole('button', { name: 'Zoll Set Up', exact: true }).click();
  await page.waitForTimeout(1000);
  await page.click('#nav-back-button');
  await page.waitForTimeout(900);
  await page.click('#nav-forward-button');
  await page.waitForTimeout(1000);
  await page.click('#nav-back-button');
  await page.waitForTimeout(900);
  await expectTreeInsideContent(page, {
    label: '390x844 quick vent nav cycle',
    minLeft: -100,
    minFontSize: 14
  });

  await goHome(page);
  await commitSearch(page, 'seizure');
  await expectTreeInsideContent(page, {
    label: '390x844 quick vent then search',
    minLeft: -20,
    minFontSize: 14
  });

  for (const viewport of [VIEWPORTS[2], VIEWPORTS[0], VIEWPORTS[1]]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(700);
    await expectTreeInsideContent(page, {
      label: `${viewport.name} resized quick vent/search`,
      minLeft: -30,
      minFontSize: 14
    });
  }
});
