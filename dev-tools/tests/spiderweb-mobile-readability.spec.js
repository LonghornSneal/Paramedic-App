import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';

const PHONE_VIEWPORTS = [
  { name: '360x640', width: 360, height: 640 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
  { name: '412x915', width: 412, height: 915 }
];

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

async function gotoApp(page, viewport) {
  await page.setViewportSize(viewport);
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
}

async function openAdultMedicalBranch(page) {
  await page.getByRole('button', { name: 'Adult Protocols' }).click();
  await page.waitForTimeout(280);
  await page.getByRole('button', { name: 'Medical' }).click();
  await page.waitForTimeout(900);
}

async function commitSearch(page, value) {
  await page.fill('#searchInput', value);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
}

async function measureSpiderweb(page) {
  return page.evaluate(() => {
    const contentEl = document.getElementById('content-area');
    const rect = contentEl.getBoundingClientRect();
    const nodes = Array.from(document.querySelectorAll('.category-card, .topic-link-item'))
      .filter(el => el.offsetParent)
      .map(el => {
        const label = el.matches('.category-card') ? el.querySelector('.category-card-title') : el;
        const box = el.getBoundingClientRect();
        return {
          left: box.left - rect.left,
          right: box.right - rect.left,
          top: box.top - rect.top + contentEl.scrollTop,
          bottom: box.bottom - rect.top + contentEl.scrollTop,
          fontSize: parseFloat(getComputedStyle(label).fontSize),
          scrollWidth: label.scrollWidth,
          clientWidth: label.clientWidth
        };
      });

    let anyOverlap = false;
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
          anyOverlap = true;
          break;
        }
      }
      if (anyOverlap) break;
    }

    return {
      count: nodes.length,
      minFontSize: Math.min(...nodes.map(node => node.fontSize)),
      minLeft: Math.min(...nodes.map(node => node.left)),
      maxRight: Math.max(...nodes.map(node => node.right)),
      contentWidth: rect.width,
      contentHeight: rect.height,
      scrollHeight: contentEl.scrollHeight,
      anyHorizontalClip: nodes.some(node => node.scrollWidth > node.clientWidth + 1),
      anyOverlap
    };
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

test('1. root spiderweb labels stay readable on required phone widths', async ({ page }) => {
  test.setTimeout(120000);
  for (const viewport of PHONE_VIEWPORTS) {
    await gotoApp(page, viewport);
    const metrics = await measureSpiderweb(page);
    expect(metrics.minFontSize, `${viewport.name} root font floor`).toBeGreaterThanOrEqual(12);
    expect(metrics.minLeft, `${viewport.name} root left edge`).toBeGreaterThanOrEqual(0);
    expect(metrics.maxRight, `${viewport.name} root right edge`).toBeLessThanOrEqual(metrics.contentWidth + 2);
    expect(metrics.anyHorizontalClip, `${viewport.name} root label clip`).toBe(false);
    expect(metrics.anyOverlap, `${viewport.name} root overlap`).toBe(false);
  }
});

test('2. branch navigation keeps mobile labels readable through back and forward', async ({ page }) => {
  test.setTimeout(120000);
  for (const viewport of PHONE_VIEWPORTS) {
    await gotoApp(page, viewport);
    await openAdultMedicalBranch(page);
    await expect(page.getByRole('button', { name: 'Seizure', exact: true })).toBeVisible();

    const branch = await measureSpiderweb(page);
    expect(branch.minFontSize, `${viewport.name} branch font floor`).toBeGreaterThanOrEqual(14);
    expect(branch.minLeft, `${viewport.name} branch left edge`).toBeGreaterThanOrEqual(0);
    expect(branch.maxRight, `${viewport.name} branch right edge`).toBeLessThanOrEqual(branch.contentWidth + 2);
    expect(branch.anyHorizontalClip, `${viewport.name} branch clip`).toBe(false);
    expect(branch.anyOverlap, `${viewport.name} branch overlap`).toBe(false);

    await page.getByRole('button', { name: 'Seizure', exact: true }).click();
    await page.waitForTimeout(1200);
    await expect(page.locator('.topic-h2')).toHaveText(/Seizure/i);

    await page.click('#nav-back-button');
    await page.waitForTimeout(1000);
    await expect(page.getByRole('button', { name: 'Seizure', exact: true })).toBeVisible();
    const branchBack = await measureSpiderweb(page);
    expect(branchBack.minFontSize, `${viewport.name} branch back font floor`).toBeGreaterThanOrEqual(14);
    expect(branchBack.anyHorizontalClip, `${viewport.name} branch back clip`).toBe(false);
    expect(branchBack.anyOverlap, `${viewport.name} branch back overlap`).toBe(false);

    await page.click('#nav-forward-button');
    await page.waitForTimeout(1200);
    await expect(page.locator('.topic-h2')).toHaveText(/Seizure/i);
    await page.click('#nav-back-button');
    await page.waitForTimeout(1000);

    const branchForwardBack = await measureSpiderweb(page);
    expect(branchForwardBack.minFontSize, `${viewport.name} branch forward-back font floor`).toBeGreaterThanOrEqual(14);
    expect(branchForwardBack.anyHorizontalClip, `${viewport.name} branch forward-back clip`).toBe(false);
    expect(branchForwardBack.anyOverlap, `${viewport.name} branch forward-back overlap`).toBe(false);
  }
});

test('3. committed search keeps mobile spiderweb labels readable', async ({ page }) => {
  test.setTimeout(120000);
  for (const viewport of PHONE_VIEWPORTS) {
    await gotoApp(page, viewport);
    await commitSearch(page, 'seizure');
    await expect(page.getByRole('button', { name: 'Medical' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Seizure', exact: true }).first()).toBeVisible();

    const search = await measureSpiderweb(page);
    expect(search.minFontSize, `${viewport.name} search font floor`).toBeGreaterThanOrEqual(14);
    expect(search.minLeft, `${viewport.name} search left edge`).toBeGreaterThanOrEqual(-20);
    expect(search.maxRight, `${viewport.name} search right edge`).toBeLessThanOrEqual(search.contentWidth + 2);
    expect(search.anyHorizontalClip, `${viewport.name} search clip`).toBe(false);
    expect(search.anyOverlap, `${viewport.name} search overlap`).toBe(false);

    await page.getByRole('button', { name: 'Seizure', exact: true }).first().click({ force: true });
    await page.waitForTimeout(1200);
    await expect(page.locator('.topic-h2')).toHaveText(/Seizure/i);

    await page.click('#nav-back-button');
    await page.waitForTimeout(1000);
    await expect(page.getByRole('button', { name: 'Seizure', exact: true }).first()).toBeVisible();

    const searchBack = await measureSpiderweb(page);
    expect(searchBack.minFontSize, `${viewport.name} search back font floor`).toBeGreaterThanOrEqual(14);
    expect(searchBack.minLeft, `${viewport.name} search back left edge`).toBeGreaterThanOrEqual(-20);
    expect(searchBack.anyHorizontalClip, `${viewport.name} search back clip`).toBe(false);
    expect(searchBack.anyOverlap, `${viewport.name} search back overlap`).toBe(false);
  }
});
