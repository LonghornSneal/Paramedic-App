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

async function collectCommittedSearchState(page, topicId = 'adult-seizure') {
  return await page.evaluate(currentTopicId => {
    const visibleTopics = Array.from(document.querySelectorAll('.topic-link-item')).filter(el => el.offsetParent);
    const overlaps = [];
    for (let i = 0; i < visibleTopics.length; i += 1) {
      const currentRect = visibleTopics[i].getBoundingClientRect();
      for (let j = i + 1; j < visibleTopics.length; j += 1) {
        const nextRect = visibleTopics[j].getBoundingClientRect();
        const overlapX = Math.max(0, Math.min(currentRect.right, nextRect.right) - Math.max(currentRect.left, nextRect.left));
        const overlapY = Math.max(0, Math.min(currentRect.bottom, nextRect.bottom) - Math.max(currentRect.top, nextRect.top));
        if (overlapX > 1 && overlapY > 1) {
          overlaps.push({
            a: visibleTopics[i].dataset.topicId,
            b: visibleTopics[j].dataset.topicId,
            overlapX,
            overlapY
          });
        }
      }
    }

    const target = visibleTopics.find(el => el.dataset.topicId === currentTopicId) || null;
    if (!target) {
      return {
        overlaps,
        hitTopicId: null,
        hitText: null,
        targetFound: false,
        searchValue: document.getElementById('searchInput')?.value ?? '',
        locationHash: window.location.hash
      };
    }

    const rect = target.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);
    const hitTarget = document.elementFromPoint(centerX, centerY)?.closest('.topic-link-item, .category-card');

    return {
      overlaps,
      hitTopicId: hitTarget?.dataset.topicId ?? hitTarget?.dataset.categoryId ?? null,
      hitText: hitTarget?.textContent?.trim() ?? null,
      rect: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      },
      targetFound: true,
      searchValue: document.getElementById('searchInput')?.value ?? '',
      locationHash: window.location.hash
    };
  }, topicId);
}

async function expectCommittedSearchReady(page, topicId = 'adult-seizure') {
  await expect.poll(async () => {
    const topic = page.locator(`.topic-link-item[data-topic-id="${topicId}"]`);
    return await topic.count();
  }, {
    message: `Expected committed search topic ${topicId} to render`,
    timeout: 10000
  }).toBeGreaterThan(0);
}

async function assertCommittedSeizureSearch(page) {
  await expectCommittedSearchReady(page, 'adult-seizure');
  const state = await collectCommittedSearchState(page, 'adult-seizure');
  expect(state.targetFound).toBe(true);
  expect(state.searchValue.toLowerCase()).toBe('seizure');
  expect(state.locationHash).toBe('');
  expect(state.overlaps).toEqual([]);
  expect(state.hitTopicId).toBe('adult-seizure');
  return state;
}

async function openAdultSeizureDetail(page) {
  const topic = page.locator('.topic-link-item[data-topic-id="adult-seizure"]');
  await topic.click();
  await expect(page.locator('.topic-h2[data-topic-id="adult-seizure"]')).toBeVisible();
  await expect(page.locator('.topic-h2[data-topic-id="adult-seizure"]')).toHaveText(/Seizure/i);
}

async function closeSidebar(page) {
  await page.locator('#close-sidebar-button').click();
  await expect(page.locator('#patient-sidebar')).not.toHaveClass(/open/);
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

test('9. repeated searches show matching detail previews under the existing title line', async ({ page }) => {
  await gotoApp(page);

  const searchCases = [
    'svt',
    'torsades',
    'seizure',
    'stroke',
    'anaphylaxis',
    'ketamine',
    'midazolam',
    'naloxone',
    'asa',
    'epinephrine',
    'magnesium',
    'cpap',
    'bipap',
    'bradycardia',
    'hypoglycemia',
    'ventilator'
  ];

  for (const query of searchCases) {
    await page.fill('#searchInput', query);
    await expect(page.locator('#search-suggestion-panel')).toBeVisible();

    await expect.poll(async () => {
      return await page.evaluate(currentQuery => {
        const previewNodes = Array.from(document.querySelectorAll('[data-search-secondary="preview"]'));
        const normalizedQuery = currentQuery.toLowerCase();
        return previewNodes.some(node => {
          const text = (node.textContent || '').toLowerCase();
          return text.includes(normalizedQuery) && !text.includes(' > ');
        });
      }, query);
    }, {
      message: `Expected a detail preview containing "${query}"`,
      timeout: 5000
    }).toBe(true);

    const previewLayout = await page.evaluate(() => {
      const preview = document.querySelector('[data-search-secondary="preview"]');
      if (!preview) return null;
      const item = preview.closest('.search-suggestion-item');
      const title = item?.querySelector('.search-suggestion-title');
      if (!item || !title) return null;
      const itemRect = item.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const previewRect = preview.getBoundingClientRect();
      return {
        itemHeight: itemRect.height,
        stacked: previewRect.top >= titleRect.bottom - 2,
        insideCard: previewRect.left >= itemRect.left && previewRect.right <= itemRect.right + 1
      };
    });

    expect(previewLayout).not.toBeNull();
    expect(previewLayout.itemHeight).toBeGreaterThan(40);
    expect(previewLayout.stacked).toBe(true);
    expect(previewLayout.insideCard).toBe(true);
  }
});

test('10. markdown-backed previews hydrate from title fallback to detail lines', async ({ page }) => {
  await gotoApp(page);

  await page.route('**/Content/Adult Protocols/adult-anaphylaxis.md', async route => {
    const response = await route.fetch();
    await new Promise(resolve => setTimeout(resolve, 700));
    await route.fulfill({ response });
  });

  await page.fill('#searchInput', 'anaphylaxis');

  const suggestion = page.locator('.search-suggestion-item[data-topic-id="adult-anaphylaxis"]').first();
  const secondary = suggestion.locator('[data-search-secondary]');

  await expect(suggestion).toBeVisible();
  await expect(secondary).toHaveAttribute('data-search-secondary', 'preview');
  await expect(secondary).toHaveText(/Anaphylaxis/i);

  await expect.poll(async () => {
    return await secondary.textContent();
  }, {
    message: 'Expected markdown-backed preview text to replace the title fallback',
    timeout: 6000
  }).toMatch(/criterion|recognition|consultation/i);
  await expect(secondary).not.toHaveText(/^Anaphylaxis$/i);
});

test('11. mobile committed seizure search stays non-overlapping and directly clickable across interaction orders', async ({ page }) => {
  test.setTimeout(180000);

  const viewports = [
    { width: 360, height: 640 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 480, height: 1040 }
  ];

  for (const viewport of viewports) {
    await gotoApp(page, viewport);
    await commitSearch(page, 'seizure');
    await assertCommittedSeizureSearch(page);
    await openAdultSeizureDetail(page);
    await page.click('#nav-back-button');
    await expect(page.locator('#searchInput')).toHaveValue('seizure');
    await assertCommittedSeizureSearch(page);
    await page.click('#nav-forward-button');
    await expect(page.locator('.topic-h2[data-topic-id="adult-seizure"]')).toBeVisible();
    await page.click('#nav-back-button');
    await assertCommittedSeizureSearch(page);
    await commitSearch(page, 'stroke');
    await commitSearch(page, 'seizure');
    await assertCommittedSeizureSearch(page);

    await gotoApp(page, viewport);
    await page.click('#open-sidebar-button');
    await page.fill('#pt-age', '34');
    await page.fill('#pt-indications', 'seizure');
    await closeSidebar(page);
    await commitSearch(page, 'seizure');
    await assertCommittedSeizureSearch(page);
    await openAdultSeizureDetail(page);
    await page.click('#nav-back-button');
    await assertCommittedSeizureSearch(page);

    await gotoApp(page, viewport);
    await commitSearch(page, 'stroke');
    await expectCommittedSearchReady(page, 'adult-stroke');
    await page.locator('.topic-link-item[data-topic-id="adult-stroke"]').click();
    await expect(page.locator('.topic-h2[data-topic-id="adult-stroke"]')).toBeVisible();
    await page.click('#nav-back-button');
    await expect(page.locator('#searchInput')).toHaveValue('stroke');
    await commitSearch(page, 'seizure');
    await assertCommittedSeizureSearch(page);
    await openAdultSeizureDetail(page);
    await page.click('#nav-back-button');
    await assertCommittedSeizureSearch(page);
  }
});
