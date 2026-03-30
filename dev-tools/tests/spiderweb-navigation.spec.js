import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { measureSpiderwebGeometry } from './spiderwebGeometry.js';

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

async function dismissTransientUi(page) {
  for (const name of [
    'Close EKG help',
    'Close Settings',
    'Close History',
    'Close Patient Info Sidebar'
  ]) {
    const button = page.getByRole('button', { name });
    if (await button.isVisible().catch(() => false)) {
      await button.click();
      await page.waitForTimeout(250);
    }
  }
}

async function gotoApp(page, viewport = { width: 1440, height: 1024 }) {
  await page.setViewportSize(viewport);
  await page.goto('http://localhost:5173/');
  await dismissTransientUi(page);
  await expect(page.getByRole('button', { name: 'Adult Protocols' })).toBeVisible();
  await page.waitForTimeout(400);
}

async function commitHeaderSearch(page, value) {
  await page.fill('#searchInput', value);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(900);
}

async function openAdultCardiologyRhythms(page) {
  await page.getByRole('button', { name: 'ADULT PROTOCOLS' }).click();
  await page.waitForTimeout(280);
  await page.getByRole('button', { name: 'CIRCULATION/CARDIOLOGY' }).click();
  await page.waitForTimeout(320);
  await page.getByRole('button', { name: 'ABNORMAL RHYTHMS' }).click();
  await page.waitForTimeout(360);
}

async function sampleVisibleNode(page, label) {
  return page.evaluate((nodeLabel) => {
    const contentArea = document.getElementById('content-area');
    const contentRect = contentArea?.getBoundingClientRect();
    const node = Array.from(document.querySelectorAll('.category-card, .topic-link-item'))
      .find(el => el.offsetParent && (el.textContent || '').includes(nodeLabel));
    if (!contentArea || !contentRect || !node) return null;
    const rect = node.getBoundingClientRect();
    return {
      stabilizing: contentArea.classList.contains('category-tree-stabilizing'),
      activePath: Array.from(document.querySelectorAll('.category-group.is-active-path'))
        .map(group => group.dataset.categoryId || group.dataset.topicId)
        .filter(Boolean),
      left: rect.left - contentRect.left,
      top: rect.top - contentRect.top,
      width: rect.width,
      height: rect.height
    };
  }, label);
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

test('1. root column has no vertical connector trunk', async ({ page }) => {
  await gotoApp(page);
  const result = await page.evaluate(() => {
    const rootCards = Array.from(document.querySelectorAll('.category-tree[data-level="0"] > .category-group > .category-card'));
    const lineLayer = document.querySelector('.category-tree-lines');
    const verticalSegments = Array.from(lineLayer?.querySelectorAll('.category-connector.is-vertical') || []).map(el => {
      const rect = el.getBoundingClientRect();
      return { left: rect.left, top: rect.top, height: rect.height };
    });
    const rootRects = rootCards.map(el => el.getBoundingClientRect());
    const rootBandLeft = Math.min(...rootRects.map(rect => rect.left));
    const rootBandRight = Math.max(...rootRects.map(rect => rect.right));
    const rootBandTop = Math.min(...rootRects.map(rect => rect.top));
    const rootBandBottom = Math.max(...rootRects.map(rect => rect.bottom));
    return verticalSegments.filter(seg =>
      seg.left >= rootBandLeft - 20
      && seg.left <= rootBandRight + 20
      && seg.top <= rootBandBottom
      && (seg.top + seg.height) >= rootBandTop
    ).length;
  });
  expect(result).toBe(0);
});

test('2. home pills stay compact and single-line', async ({ page }) => {
  await gotoApp(page);
  const result = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.category-tree[data-level="0"] .category-card-title')).map(el => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        text: el.textContent.trim(),
        width: rect.width,
        height: rect.height,
        whiteSpace: style.whiteSpace,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth
      };
    });
  });
  result.forEach(item => {
    expect(item.whiteSpace).toBe('nowrap');
    expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth + 1);
    expect(item.width).toBeLessThan(230);
    expect(item.height).toBeLessThan(30);
  });
});

test('3. search keeps the spiderweb visible and exposes the SVT branch', async ({ page }) => {
  await gotoApp(page);
  await commitHeaderSearch(page, 'svt');
  await expect(page.locator('.category-tree[data-level="0"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'SVT' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Stable', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unstable', exact: true })).toBeVisible();
});

test('4. desktop search layout stays within the content area', async ({ page }) => {
  await gotoApp(page);
  await commitHeaderSearch(page, 'svt');
  const metrics = await page.evaluate(() => {
    const content = document.getElementById('content-area').getBoundingClientRect();
    const nodes = Array.from(document.querySelectorAll('.category-card, .topic-link-item'))
      .filter(el => el.offsetParent)
      .map(el => el.getBoundingClientRect());
    return {
      minLeft: Math.min(...nodes.map(rect => rect.left - content.left)),
      minTop: Math.min(...nodes.map(rect => rect.top - content.top)),
      maxRight: Math.max(...nodes.map(rect => rect.right - content.left)),
      maxBottom: Math.max(...nodes.map(rect => rect.bottom - content.top)),
      contentWidth: content.width,
      contentHeight: content.height
    };
  });
  expect(metrics.minLeft).toBeGreaterThanOrEqual(-1);
  expect(metrics.minTop).toBeGreaterThanOrEqual(-1);
  expect(metrics.maxRight).toBeLessThanOrEqual(metrics.contentWidth + 2);
  expect(metrics.maxBottom).toBeLessThanOrEqual(metrics.contentHeight + 2);
});

test('5. home button keeps root pill sizes stable', async ({ page }) => {
  await gotoApp(page);
  await page.getByRole('button', { name: 'ADULT PROTOCOLS' }).click();
  await page.waitForTimeout(320);
  const before = await page.locator('.category-tree[data-level="0"] > .category-group > .category-card .category-card-title').evaluateAll(nodes =>
    nodes.map(node => ({ text: node.textContent.trim(), width: Math.round(node.getBoundingClientRect().width) }))
  );
  await page.click('#nav-home-button');
  await page.waitForTimeout(900);
  const after = await page.locator('.category-tree[data-level="0"] > .category-group > .category-card .category-card-title').evaluateAll(nodes =>
    nodes.map(node => ({ text: node.textContent.trim(), width: Math.round(node.getBoundingClientRect().width) }))
  );
  expect(after).toHaveLength(before.length);
  before.forEach((item, index) => {
    expect(Math.abs(after[index].width - item.width)).toBeLessThanOrEqual(6);
  });
});

test('6. smaller pills use thinner borders than emphasized pills', async ({ page }) => {
  await gotoApp(page);
  await openAdultCardiologyRhythms(page);
  await page.getByRole('button', { name: 'SVT' }).click();
  await page.waitForTimeout(600);
  const widths = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('.category-card-title, .topic-link-item')).filter(el => el.offsetParent);
    const borderWidths = labels.map(el => parseFloat(getComputedStyle(el).borderTopWidth));
    return {
      min: Math.min(...borderWidths),
      max: Math.max(...borderWidths)
    };
  });
  expect(widths.max).toBeGreaterThan(widths.min);
});

test('7. nested branch expansion settles smoothly', async ({ page }) => {
  await gotoApp(page);
  await openAdultCardiologyRhythms(page);
  await page.waitForFunction(() => !document.getElementById('content-area')?.classList.contains('category-tree-stabilizing'));

  const samples = [];
  for (const wait of [0, 120, 280, 520]) {
    const prior = samples.length ? samples[samples.length - 1].wait : 0;
    await page.waitForTimeout(wait - prior);
    samples.push({ wait, ...(await sampleVisibleNode(page, 'SVT')) });
  }

  expect(samples.every(sample => sample.left != null)).toBe(true);
  expect(samples.every(sample => sample.stabilizing === false)).toBe(true);
  samples.forEach(sample => {
    expect(sample.activePath).toEqual([
      'adult-protocols',
      'adult-circulation-cardiology',
      'adult-abnormal-rhythms'
    ]);
  });

  const settled = samples[samples.length - 1];
  samples.slice(0, -1).forEach(sample => {
    expect(Math.abs(sample.left - settled.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(sample.top - settled.top)).toBeLessThanOrEqual(1);
    expect(Math.abs(sample.width - settled.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(sample.height - settled.height)).toBeLessThanOrEqual(1);
  });
});

test('8. deep visible pills remain nowrap and unclipped', async ({ page }) => {
  await gotoApp(page);
  await openAdultCardiologyRhythms(page);
  await page.getByRole('button', { name: 'SVT' }).click();
  await page.waitForTimeout(700);
  const result = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.category-card-title, .topic-link-item'))
      .filter(el => el.offsetParent)
      .map(el => ({
        text: el.textContent.trim(),
        whiteSpace: getComputedStyle(el).whiteSpace,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth
      }));
  });
  result.forEach(item => {
    expect(item.whiteSpace).toBe('nowrap');
    expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth + 1);
  });
});

test('9. adult medical navigation label is shortened to Medical', async ({ page }) => {
  await gotoApp(page);
  await page.getByRole('button', { name: 'ADULT PROTOCOLS' }).click();
  await page.waitForTimeout(320);
  await expect(page.getByRole('button', { name: 'Medical' })).toBeVisible();
  await expect(page.getByText('Medical Emergencies')).toHaveCount(0);
});

test('10. MAT pill stays short while the detail title stays long', async ({ page }) => {
  await gotoApp(page);
  await openAdultCardiologyRhythms(page);
  await expect(page.getByRole('button', { name: 'MAT' })).toBeVisible();
  await page.getByRole('button', { name: 'MAT' }).click();
  await page.waitForTimeout(1200);
  await expect(page.locator('.topic-h2')).toHaveText(/Multifocal Atrial Tachycardia \(MAT\) \(Stable Symptomatic\)/i);
});

test('11. Abnormal Rhythms contains the required rhythm shortcuts', async ({ page }) => {
  await gotoApp(page);
  await openAdultCardiologyRhythms(page);
  for (const label of [
    'Bradycardia',
    'PEA / Asystole',
    'SVT',
    'A-Fib / A-Flutter',
    'MAT',
    'Mono-VT',
    'Poly-VT / Torsades'
  ]) {
    await expect(page.getByRole('button', { name: label })).toBeVisible();
  }
});

test('12. rhythm branches expose Stable and Unstable splits where expected', async ({ page }) => {
  await gotoApp(page);
  await openAdultCardiologyRhythms(page);

  await page.getByRole('button', { name: 'SVT' }).click();
  await page.waitForTimeout(260);
  await expect(page.getByRole('button', { name: 'Stable', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unstable', exact: true })).toBeVisible();

  await page.click('#nav-home-button');
  await page.waitForTimeout(700);
  await openAdultCardiologyRhythms(page);
  await page.getByRole('button', { name: 'MONO-VT' }).click();
  await page.waitForTimeout(260);
  await expect(page.getByRole('button', { name: 'Stable', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unstable', exact: true })).toBeVisible();

  await page.click('#nav-home-button');
  await page.waitForTimeout(700);
  await openAdultCardiologyRhythms(page);
  await page.getByRole('button', { name: 'POLY-VT / TORSADES' }).click();
  await page.waitForTimeout(260);
  await expect(page.getByRole('button', { name: 'Stable', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unstable', exact: true })).toBeVisible();
});

test('13. pediatric context plus search still favors pediatric over adult without exploding the tree', async ({ page }) => {
  await gotoApp(page);
  await page.click('#open-sidebar-button');
  await page.fill('#pt-age', '12');
  await page.fill('#pt-indications', 'seizure');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(600);
  await commitHeaderSearch(page, 'pediatric');
  const result = await page.evaluate(() => {
    const visible = Array.from(document.querySelectorAll('.category-card, .topic-link-item')).filter(el => el.offsetParent);
    const pediatric = Array.from(visible).find(el => el.textContent.trim() === 'Pediatric Protocols');
    const adult = Array.from(visible).find(el => el.textContent.trim() === 'Adult Protocols');
    return {
      visibleCount: visible.length,
      pediatricOpacity: pediatric ? Number(getComputedStyle(pediatric).opacity) : 0,
      adultOpacity: adult ? Number(getComputedStyle(adult).opacity) : 0
    };
  });
  expect(result.visibleCount).toBeLessThan(40);
  expect(result.pediatricOpacity).toBeGreaterThan(result.adultOpacity);
});

test('14. mobile deep branch keeps the active branch readable and within the right edge', async ({ page }) => {
  await gotoApp(page, { width: 390, height: 844 });
  await openAdultCardiologyRhythms(page);
  await page.getByRole('button', { name: 'MONO-VT' }).click();
  await page.waitForTimeout(900);
  const metrics = await measureSpiderwebGeometry(page);
  expect(metrics.maxRight).toBeLessThanOrEqual(metrics.contentWidth + 2);
  expect(metrics.maxBottom).toBeLessThanOrEqual(metrics.contentHeight + 2);
  expect(metrics.minLeft).toBeGreaterThanOrEqual(-200);
  expect(metrics.minFontSize).toBeGreaterThanOrEqual(7.5);
});
