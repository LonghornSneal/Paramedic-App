import { test, expect } from '@playwright/test';
import {
  ensurePreviewServer,
  shutdownPreviewServer,
  gotoApp,
  clickBranchPath,
  sampleNodeTimeline
} from './spiderwebGeometry.js';

test.beforeAll(ensurePreviewServer);
test.afterAll(shutdownPreviewServer);

test.describe.configure({ mode: 'serial' });

test('expanded branches brighten, enlarge, and keep shifting hue over time', async ({ page }) => {
  await gotoApp(page, { width: 1440, height: 1024 });
  await clickBranchPath(page, 'adult-protocols');
  await page.waitForTimeout(320);

  const before = await page.locator('[data-branch-path="adult-protocols>adult-circulation-cardiology"] > .category-card').evaluate(node => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    const title = node.querySelector('.category-card-title');
    return {
      width: rect.width,
      height: rect.height,
      backgroundImage: style.backgroundImage,
      borderColor: style.borderColor,
      activeBranch: node.dataset.activeBranch || 'none',
      fontSize: getComputedStyle(title).fontSize
    };
  });

  await clickBranchPath(page, 'adult-protocols>adult-circulation-cardiology');
  const samples = await sampleNodeTimeline(page, { branchPath: 'adult-protocols>adult-circulation-cardiology' }, [0, 40, 100, 200, 400, 520]);
  expect(samples.every(sample => sample)).toBe(true);

  const last = samples.at(-1);
  expect(last.height).toBeGreaterThan(before.height);
  expect(last.activeBranch).toBe('selected');
  expect(new Set(samples.map(sample => sample.borderColor)).size).toBeGreaterThan(2);
  expect(new Set(samples.map(sample => sample.backgroundImage)).size).toBeGreaterThan(2);
  expect(parseFloat(last.fontSize)).toBeGreaterThan(parseFloat(before.fontSize));

  samples.slice(1).forEach((sample, index) => {
    const prior = samples[index];
    expect(Math.abs(sample.top - prior.top)).toBeLessThanOrEqual(40);
  });
  expect(last.opacity).toBeGreaterThanOrEqual(0.98);
});
