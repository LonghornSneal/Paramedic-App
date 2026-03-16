import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';

const mobileViewports = [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 480, height: 1040 }
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

async function openSidebar(page, viewport) {
  await page.setViewportSize(viewport);
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('#open-sidebar-button');
  await page.locator('#open-sidebar-button').click();
  await expect(page.locator('#patient-sidebar')).toHaveClass(/open/);
}

function selectors(line) {
  const row = `#patient-sidebar .patient-line[data-line="${line}"]`;
  return {
    row,
    shell: `${row} .ekg-preview-shell`,
    info: `${row} .ekg-info-button`
  };
}

async function expectRowFitsSidebar(page, line) {
  const result = await page.evaluate(targetLine => {
    const sidebar = document.getElementById('patient-sidebar');
    const row = document.querySelector(`#patient-sidebar .patient-line[data-line="${targetLine}"]`);
    if (!sidebar || !row) return null;
    const sidebarRect = sidebar.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const children = Array.from(row.children)
      .filter(child => getComputedStyle(child).display !== 'none')
      .map(child => {
        const rect = child.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right
        };
      });

    return {
      rowWithinSidebar: rowRect.left >= sidebarRect.left - 1 && rowRect.right <= sidebarRect.right + 1,
      childrenWithinSidebar: children.every(child => child.left >= sidebarRect.left - 1 && child.right <= sidebarRect.right + 1)
    };
  }, line);

  expect(result).not.toBeNull();
  expect(result.rowWithinSidebar).toBe(true);
  expect(result.childrenWithinSidebar).toBe(true);
}

async function expectCollapsedEmptyState(page) {
  const rhythm = selectors(12);
  const modifier = selectors(13);

  await expect(page.locator(rhythm.row)).toHaveAttribute('data-preview-state', 'empty');
  await expect(page.locator(rhythm.shell)).toBeHidden();
  await expect(page.locator(rhythm.info)).toBeHidden();

  await expect(page.locator(modifier.row)).toHaveAttribute('data-preview-state', 'empty');
  await expect(page.locator(modifier.shell)).toBeHidden();
  await expect(page.locator(modifier.info)).toBeHidden();
  await expect(page.locator('#ekg-summary-text')).toBeHidden();

  await expectRowFitsSidebar(page, 12);
  await expectRowFitsSidebar(page, 13);
}

async function expectPreviewReady(page, line) {
  const rowSelectors = selectors(line);
  await expect(page.locator(rowSelectors.row)).toHaveAttribute('data-preview-state', 'ready');
  await expect(page.locator(rowSelectors.shell)).toBeVisible();
  await expect(page.locator(rowSelectors.info)).toBeVisible();
  await expectRowFitsSidebar(page, line);
}

test('EKG preview empty state stays collapsed on phone widths', async ({ page }) => {
  for (const viewport of mobileViewports) {
    await openSidebar(page, viewport);
    await expectCollapsedEmptyState(page);
  }
});

test('EKG preview appears only when useful rhythm or modifier content exists in either order', async ({ page }) => {
  for (const viewport of mobileViewports) {
    await openSidebar(page, viewport);
    await page.locator('#pt-ekg-select').selectOption('Sinus Tachycardia');
    await expectPreviewReady(page, 12);
    await expect(page.locator(selectors(13).row)).toHaveAttribute('data-preview-state', 'empty');
    await expect(page.locator(selectors(13).shell)).toBeHidden();
    await expect(page.locator('#ekg-summary-text')).toContainText('Rhythm:');

    await page.locator('#pt-ekg-secondary').selectOption('Inferior MI');
    await expectPreviewReady(page, 13);
    await expect(page.locator('#ekg-summary-text')).toContainText('Modifier:');

    await openSidebar(page, viewport);
    await page.locator('#pt-ekg-secondary').selectOption('Inferior MI');
    await expect(page.locator(selectors(12).row)).toHaveAttribute('data-preview-state', 'empty');
    await expect(page.locator(selectors(12).shell)).toBeHidden();
    await expectPreviewReady(page, 13);
    await expect(page.locator('#ekg-summary-text')).toContainText('Modifier:');

    await page.locator('#pt-ekg-select').selectOption('Sinus Tachycardia');
    await expectPreviewReady(page, 12);
    await expect(page.locator('#ekg-summary-text')).toContainText('Rhythm:');
  }
});

test('EKG preview remains intentional after navigating away and back', async ({ page }) => {
  for (const viewport of mobileViewports) {
    await openSidebar(page, viewport);
    await page.locator('#pt-ekg-select').selectOption('Sinus Tachycardia');
    await page.locator('#pt-ekg-secondary').selectOption('Inferior MI');
    await expectPreviewReady(page, 12);
    await expectPreviewReady(page, 13);

    await page.locator('#close-sidebar-button').click();
    await page.getByRole('button', { name: 'Adult Protocols' }).click();
    await expect(page.locator('main')).toContainText('Airway/Breathing');
    await page.locator('#nav-home-button').click();
    await expect(page.locator('main')).toContainText('Pediatric Protocols');

    await page.locator('#open-sidebar-button').click();
    await expectPreviewReady(page, 12);
    await expectPreviewReady(page, 13);
    await expect(page.locator('#ekg-summary-text')).toContainText('Rhythm:');
    await expect(page.locator('#ekg-summary-text')).toContainText('Modifier:');
  }
});
