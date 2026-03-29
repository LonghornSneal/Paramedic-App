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

test('desktop branch expansion moves smoothly without overlap', async ({ page }) => {
  await gotoApp(page, { width: 1440, height: 1024 });
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

  const after = await measureBranchGeometry(page);
  expect(after.anyOverlap).toBe(false);
  expect(after.anyHorizontalClip).toBe(false);
  expect(after.minFontSize).toBeGreaterThanOrEqual(14);
  expect(after.maxVerticalGap).toBeLessThanOrEqual(20);
  expect(after.visibleCount).toBeGreaterThan(10);
});
