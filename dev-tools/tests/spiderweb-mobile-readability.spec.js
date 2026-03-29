import { test, expect } from '@playwright/test';
import {
  ensurePreviewServer,
  shutdownPreviewServer,
  gotoApp,
  clickBranchPath,
  measureBranchGeometry,
  sampleNodeTimeline
} from './spiderwebGeometry.js';

test.beforeAll(ensurePreviewServer);
test.afterAll(shutdownPreviewServer);

test.describe.configure({ mode: 'serial' });

test('mobile active branches stay bright and readable while the layout stays compact', async ({ page }) => {
  test.setTimeout(120000);
  await gotoApp(page, { width: 390, height: 844 });
  await clickBranchPath(page, 'adult-protocols');
  await page.waitForTimeout(320);

  const branchBefore = await page.locator('[data-branch-path="adult-protocols>adult-circulation-cardiology"] > .category-card').evaluate(node => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    const title = node.querySelector('.category-card-title');
    return {
      width: rect.width,
      height: rect.height,
      borderColor: style.borderColor,
      backgroundImage: style.backgroundImage,
      fontSize: getComputedStyle(title).fontSize
    };
  });

  await clickBranchPath(page, 'adult-protocols>adult-circulation-cardiology');
  const branchMotion = await sampleNodeTimeline(page, { branchPath: 'adult-protocols>adult-circulation-cardiology' }, [0, 80, 160, 320, 520]);
  expect(branchMotion.every(sample => sample)).toBe(true);
  const branchAfter = branchMotion.at(-1);
  expect(branchAfter.width).toBeGreaterThan(branchBefore.width);
  expect(branchAfter.height).toBeGreaterThan(branchBefore.height);
  expect(new Set(branchMotion.map(sample => sample.borderColor)).size).toBeGreaterThan(2);
  expect(new Set(branchMotion.map(sample => sample.backgroundImage)).size).toBeGreaterThan(2);
  expect(parseFloat(branchAfter.fontSize)).toBeGreaterThan(parseFloat(branchBefore.fontSize));

  const geometry = await measureBranchGeometry(page);
  expect(geometry.anyOverlap).toBe(false);
  expect(geometry.anyHorizontalClip).toBe(false);
  expect(geometry.minLeft).toBeGreaterThanOrEqual(0);
  expect(geometry.maxRight).toBeLessThanOrEqual(geometry.contentWidth + 2);
  expect(geometry.minFontSize).toBeGreaterThanOrEqual(14);
  expect(geometry.maxVerticalGap).toBeLessThanOrEqual(20);

  await clickBranchPath(page, 'adult-protocols>adult-airway-breathing');
  await page.waitForTimeout(220);
  await page.getByRole('button', { name: /CPAP or BiPAP/i }).first().click();
  await expect(page.locator('.topic-h2')).toHaveText(/CPAP or BiPAP/i);
  await page.click('#nav-back-button');
  await page.waitForTimeout(220);

  const returnGeometry = await measureBranchGeometry(page);
  expect(returnGeometry.anyOverlap).toBe(false);
  expect(returnGeometry.anyHorizontalClip).toBe(false);
  expect(returnGeometry.maxVerticalGap).toBeLessThanOrEqual(20);
  expect(returnGeometry.visibleCount).toBeGreaterThan(10);
});
