const { test, expect } = require('@playwright/test');

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

test('category tree active path and layout rules', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://127.0.0.1:5173/');
  await dismissTransientUi(page);
  await expect(page.getByRole('button', { name: 'Adult Protocols' })).toBeVisible();
  await page.waitForFunction(() => !!document.querySelector('.category-tree'));

  await page.getByRole('button', { name: /Adult Protocols/i }).click();
  await page.getByRole('button', { name: 'Skills/Equipment' }).waitFor();
  await page.getByRole('button', { name: 'Skills/Equipment' }).click();
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

  const fitCheck = await page.evaluate(() => {
    const contentArea = document.getElementById('content-area');
    const contentRect = contentArea.getBoundingClientRect();
    const nodes = Array.from(contentArea.querySelectorAll('.category-card, .topic-link-item'))
      .filter(node => node.offsetParent && node.getClientRects().length);
    const overflow = nodes
      .map(node => {
        const rect = node.getBoundingClientRect();
        const clipped = rect.left < contentRect.left - 1
          || rect.right > contentRect.right + 1
          || rect.top < contentRect.top - 1
          || rect.bottom > contentRect.bottom + 1;
        return {
          label: (node.textContent || '').trim(),
          clipped
        };
      })
      .filter(item => item.clipped)
      .map(item => item.label);
    return { overflow, contentCenterX: contentRect.left + (contentRect.width / 2) };
  });
  expect(fitCheck.overflow).toEqual([]);

  const activeColumnCheck = await page.evaluate(() => {
    const contentArea = document.getElementById('content-area');
    const contentRect = contentArea.getBoundingClientRect();
    return Array.from(document.querySelectorAll('.category-tree, .category-children'))
      .filter(tree =>
        tree.children.length
        && tree.getClientRects().length
        && tree.classList.contains('has-active-path')
      )
      .map(tree => {
        const rect = tree.getBoundingClientRect();
        return {
          level: Number(tree.dataset.level || -1),
          left: rect.left - contentRect.left
        };
      })
      .sort((a, b) => a.level - b.level);
  });
  expect(activeColumnCheck.length).toBeGreaterThanOrEqual(3);
  activeColumnCheck.forEach((column, index) => {
    expect(column.level).toBe(index);
    if (index > 0) {
      expect(column.left).toBeGreaterThan(activeColumnCheck[index - 1].left);
    }
  });

  await page.waitForTimeout(300);
  const desktopPath = testInfo.outputPath('category-tree-desktop.png');
  await page.screenshot({ path: desktopPath, fullPage: true });
  await testInfo.attach('category-tree-desktop', {
    path: desktopPath,
    contentType: 'image/png'
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const mobilePath = testInfo.outputPath('category-tree-mobile.png');
  await page.screenshot({ path: mobilePath, fullPage: true });
  await testInfo.attach('category-tree-mobile', {
    path: mobilePath,
    contentType: 'image/png'
  });
});
