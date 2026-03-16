const { test, expect } = require('@playwright/test');

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'mobile', width: 390, height: 844 }
];

async function openAdultAirwayDetail(page) {
  await page.goto('http://127.0.0.1:5173/');
  await page.waitForSelector('.category-tree');
  await page.getByRole('button', { name: /Adult Protocols/i }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /Airway\/Breathing/i }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /Cricothyrotomy/i }).click();
  await page.waitForTimeout(1200);
  await expect(page.getByRole('heading', { name: /Cricothyrotomy/i })).toBeVisible();
}

async function sampleBackTransition(page) {
  const samples = [];
  let priorMs = 0;
  for (const ms of [0, 80, 160, 220, 280, 360, 520]) {
    await page.waitForTimeout(ms - priorMs);
    priorMs = ms;
    const snapshot = await page.evaluate(() => {
      const content = document.getElementById('content-area');
      const contentRect = content.getBoundingClientRect();
      const treeContainer = content.querySelector('.category-tree-container');
      const nodes = Array.from(document.querySelectorAll('.category-card, .topic-link-item'))
        .filter(node => node.offsetParent)
        .map(node => {
          const pillRect = node.getBoundingClientRect();
          const label = node.matches('.category-card')
            ? node.querySelector('.category-card-title')
            : node;
          const range = document.createRange();
          range.selectNodeContents(label);
          const textRect = range.getBoundingClientRect();
          return {
            text: (node.textContent || '').trim(),
            pillLeft: pillRect.left - contentRect.left,
            pillRight: pillRect.right - contentRect.left,
            pillBottom: pillRect.bottom - contentRect.top,
            textLeft: textRect.left - contentRect.left,
            textRight: textRect.right - contentRect.left,
            scrollWidth: label.scrollWidth,
            clientWidth: label.clientWidth
          };
        });

      const byLabel = Object.fromEntries(nodes.map(node => [node.text, node]));
      return {
        stabilizing: content.classList.contains('category-tree-stabilizing'),
        opacity: treeContainer ? Number(getComputedStyle(treeContainer).opacity) : 0,
        contentWidth: contentRect.width,
        contentHeight: contentRect.height,
        minTextLeft: Math.min(...nodes.map(node => node.textLeft)),
        maxTextRight: Math.max(...nodes.map(node => node.textRight)),
        maxPillBottom: Math.max(...nodes.map(node => node.pillBottom)),
        clippedLabels: nodes
          .filter(node => node.scrollWidth > node.clientWidth + 1)
          .map(node => node.text),
        rootTextLeft: byLabel['Adult Protocols']?.textLeft ?? null,
        childTextLeft: byLabel['Airway/Breathing']?.textLeft ?? null
      };
    });
    samples.push({ ms, ...snapshot });
  }
  return samples;
}

for (const viewport of VIEWPORTS) {
  test(`back navigation keeps category text stable and visible on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openAdultAirwayDetail(page);

    await page.click('#nav-back-button');
    const samples = await sampleBackTransition(page);
    const visibleSamples = samples.filter(sample => sample.opacity >= 0.2);

    expect(visibleSamples.length).toBeGreaterThan(0);
    visibleSamples.forEach(sample => {
      expect(sample.minTextLeft).toBeGreaterThanOrEqual(0);
      expect(sample.maxTextRight).toBeLessThanOrEqual(sample.contentWidth + 1);
      expect(sample.maxPillBottom).toBeLessThanOrEqual(sample.contentHeight + 2);
      expect(sample.clippedLabels).toEqual([]);
      expect(sample.stabilizing).toBe(false);
    });

    const rootPositions = visibleSamples.map(sample => sample.rootTextLeft).filter(value => value != null);
    const childPositions = visibleSamples.map(sample => sample.childTextLeft).filter(value => value != null);
    expect(Math.max(...rootPositions) - Math.min(...rootPositions)).toBeLessThanOrEqual(1);
    expect(Math.max(...childPositions) - Math.min(...childPositions)).toBeLessThanOrEqual(1);
    expect(visibleSamples.at(-1).opacity).toBeGreaterThanOrEqual(0.95);
  });
}
