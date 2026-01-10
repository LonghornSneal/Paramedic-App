const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

test('category tree active path and layout rules', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');
  await page.waitForFunction(() => !!document.querySelector('.category-tree'));

  await page.getByRole('button', { name: /Adult Protocols/i }).click();
  await page.getByRole('button', { name: /Skills & Equipment/i }).waitFor();
  await page.getByRole('button', { name: /Skills & Equipment/i }).click();
  await page.getByRole('button', { name: /Zoll EMV731/i }).waitFor();
  await page.getByRole('button', { name: /Zoll EMV731/i }).click();

  await page.waitForFunction(() => typeof window.renderDetailPage === 'function');
  await page.evaluate(() => { window.renderDetailPage = () => {}; });

  await page.getByRole('button', { name: /Quick Vent Guide/i }).waitFor();
  await page.getByRole('button', { name: /Quick Vent Guide/i }).click();
  await page.waitForTimeout(700);

  const activeState = await page.evaluate(() => {
    const path = Array.isArray(window.activeCategoryPath) ? [...window.activeCategoryPath] : [];
    if (window.activeTopicId) path.push(window.activeTopicId);
    const activeGroups = Array.from(document.querySelectorAll('.category-group.is-active-path'))
      .map(group => group.dataset.categoryId || group.dataset.topicId)
      .filter(Boolean);
    return { path, activeGroups };
  });
  expect(activeState.path.length).toBe(activeState.activeGroups.length);
  expect(activeState.activeGroups.sort()).toEqual(activeState.path.sort());
  expect(activeState.path).toContain('zoll-emv731-quick-vent-guide');

  const expandedCounts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.category-tree')).map(tree =>
      tree.querySelectorAll(':scope > .category-group.is-expanded').length
    );
  });
  expandedCounts.forEach(count => expect(count).toBeLessThanOrEqual(1));

  const alignmentChecks = await page.evaluate(() => {
    const contentArea = document.getElementById('content-area');
    const contentRect = contentArea.getBoundingClientRect();
    return Array.from(document.querySelectorAll('.category-group'))
      .filter(group => group.querySelector(':scope > .category-children'))
      .map(group => {
        const groupRect = group.getBoundingClientRect();
        const value = parseFloat(getComputedStyle(group).getPropertyValue('--child-column-top'));
        return {
          value,
          expected: Math.round(contentRect.top - groupRect.top)
        };
      });
  });
  alignmentChecks.forEach(item => {
    expect(Math.abs(item.value - item.expected)).toBeLessThanOrEqual(1);
  });

  const flowDirection = await page.evaluate(() => {
    const rootTree = document.querySelector('.category-tree[data-level="0"]');
    return rootTree ? getComputedStyle(rootTree).getPropertyValue('--connector-flow-direction').trim() : '';
  });
  expect(flowDirection).toBe('reverse');

  const screenshotDir = path.resolve(process.cwd(), 'dev-tools/screenshots');
  fs.mkdirSync(screenshotDir, { recursive: true });

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(screenshotDir, 'category-tree-desktop.png'), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(screenshotDir, 'category-tree-mobile.png'), fullPage: true });
});
