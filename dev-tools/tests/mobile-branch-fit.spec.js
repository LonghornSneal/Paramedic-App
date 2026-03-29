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

test('mobile branch layout stays readable, compact, and unclipped', async ({ page }) => {
  test.setTimeout(120000);
  await gotoApp(page, { width: 390, height: 844 });
  await clickBranchPath(page, 'adult-protocols');
  await page.waitForTimeout(320);
  await clickBranchPath(page, 'adult-protocols>adult-circulation-cardiology');

  const motion = await sampleNodeTimeline(page, { branchPath: 'adult-protocols>adult-circulation-cardiology' }, [0, 40, 100, 200, 400]);
  expect(motion.every(sample => sample)).toBe(true);
  motion.slice(1).forEach((sample, index) => {
    const prior = motion[index];
    expect(Math.abs(sample.top - prior.top)).toBeLessThanOrEqual(40);
  });
  expect(motion.at(-1).height).toBeGreaterThan(motion[0].height);

  const geometry = await measureBranchGeometry(page);
  expect(geometry.anyOverlap).toBe(false);
  expect(geometry.anyHorizontalClip).toBe(false);
  expect(geometry.minFontSize).toBeGreaterThanOrEqual(14);
  expect(geometry.minLeft).toBeGreaterThanOrEqual(0);
  expect(geometry.maxRight).toBeLessThanOrEqual(geometry.contentWidth + 2);
  expect(geometry.maxVerticalGap).toBeLessThanOrEqual(20);
  expect(geometry.visibleCount).toBeGreaterThan(10);
});
