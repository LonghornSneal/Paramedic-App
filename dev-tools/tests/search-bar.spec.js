import { test, expect } from '@playwright/test';

async function gotoApp(page, viewport = { width: 1440, height: 1024 }) {
  await page.setViewportSize(viewport);
  await page.goto('http://127.0.0.1:5173/');
  await page.waitForTimeout(900);
}

async function commitSearch(page, value) {
  await page.fill('#searchInput', value);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(900);
}

test.describe.configure({ mode: 'serial' });

test('1. typing opens suggestions without expanding the spiderweb', async ({ page }) => {
  await gotoApp(page);
  const rootCountBefore = await page.locator('.category-tree[data-level="0"] > .category-group > .category-card').count();

  await page.fill('#searchInput', 'svt');
  await page.waitForTimeout(300);

  await expect(page.locator('#search-suggestion-panel')).toBeVisible();
  await expect(page.locator('[data-search-group="filtered"] .search-suggestion-item').first()).toBeVisible();
  await expect(page.locator('[data-search-group="smart"] .search-suggestion-item').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Stable', exact: true })).toHaveCount(0);

  const rootCountAfter = await page.locator('.category-tree[data-level="0"] > .category-group > .category-card').count();
  expect(rootCountAfter).toBe(rootCountBefore);
});

test('2. pressing Enter commits the search and reveals the matching branch', async ({ page }) => {
  await gotoApp(page);

  await commitSearch(page, 'svt');

  await expect(page.locator('#search-suggestion-panel')).toBeHidden();
  await expect(page.getByRole('button', { name: 'SVT' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Stable', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unstable', exact: true })).toBeVisible();
});

test('3. clicking a filtered suggestion opens detail and Back restores the committed search', async ({ page }) => {
  await gotoApp(page);

  await page.fill('#searchInput', 'torsades');
  await page.waitForTimeout(300);
  await page.locator('[data-search-group="filtered"] .search-suggestion-item', { hasText: 'Poly-VT/Torsades (unstable)' }).click();
  await page.waitForTimeout(900);

  await expect(page.locator('.topic-h2')).toHaveText(/Poly-VT\/Torsades \(unstable\)/i);

  await page.click('#nav-back-button');
  await page.waitForTimeout(900);

  await expect(page.locator('#searchInput')).toHaveValue(/Poly-VT\/Torsades \(unstable\)/i);
  await expect(page.getByRole('button', { name: 'Poly-VT / Torsades' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unstable', exact: true })).toBeVisible();
});

test('4. keyboard selection from suggestions opens the highlighted result', async ({ page }) => {
  await gotoApp(page);

  await page.fill('#searchInput', 'etom');
  await page.waitForTimeout(250);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(900);

  await expect(page.locator('.topic-h2')).toHaveText(/Etomidate/i);
});

test('5. draft edits do not disturb an already committed search until Enter is pressed again', async ({ page }) => {
  await gotoApp(page);

  await commitSearch(page, 'svt');
  await expect(page.getByRole('button', { name: 'Stable', exact: true })).toBeVisible();

  await page.fill('#searchInput', 'shock');
  await page.waitForTimeout(300);

  await expect(page.locator('#search-suggestion-panel')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Stable', exact: true })).toBeVisible();
});

test('6. Escape closes suggestions and restores the committed term after draft typing', async ({ page }) => {
  await gotoApp(page);

  await commitSearch(page, 'svt');
  await page.fill('#searchInput', 'shock');
  await page.waitForTimeout(250);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);

  await expect(page.locator('#search-suggestion-panel')).toBeHidden();
  await expect(page.locator('#searchInput')).toHaveValue('svt');
  await expect(page.getByRole('button', { name: 'Stable', exact: true })).toBeVisible();
});

test('7. patient context reprioritizes smart suggestions without live spiderweb mutation', async ({ page }) => {
  await gotoApp(page);

  await page.click('#open-sidebar-button');
  await page.fill('#pt-age', '12');
  await page.fill('#pt-indications', 'seizure');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(500);

  await page.fill('#searchInput', 'seiz');
  await page.waitForTimeout(300);

  const firstSmartSuggestion = page.locator('[data-search-group="smart"] .search-suggestion-item').first();
  await expect(firstSmartSuggestion).toContainText(/Pediatric Seizure/i);
  await expect(page.getByRole('button', { name: 'Pediatric Protocols', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Seizure', exact: true })).toHaveCount(0);
});

test('8. mobile suggestions stay readable and inside the viewport', async ({ page }) => {
  await gotoApp(page, { width: 390, height: 844 });

  await page.fill('#searchInput', 'svt');
  await page.waitForTimeout(300);

  await expect(page.locator('#search-suggestion-panel')).toBeVisible();

  const metrics = await page.evaluate(() => {
    const panel = document.getElementById('search-suggestion-panel');
    const rect = panel.getBoundingClientRect();
    const style = getComputedStyle(panel);
    return {
      left: rect.left,
      right: rect.right,
      width: rect.width,
      display: style.display,
      viewportWidth: window.innerWidth
    };
  });

  expect(metrics.left).toBeGreaterThanOrEqual(0);
  expect(metrics.right).toBeLessThanOrEqual(metrics.viewportWidth);
  expect(metrics.width).toBeGreaterThan(220);
  expect(metrics.display).not.toBe('none');
});
