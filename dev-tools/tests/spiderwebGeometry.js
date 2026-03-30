import { expect } from '@playwright/test';

export async function measureSpiderwebGeometry(page) {
  return page.evaluate(() => {
    const content = document.getElementById('content-area');
    const contentRect = content.getBoundingClientRect();
    const nodeMetrics = Array.from(content.querySelectorAll('.category-card, .topic-link-item'))
      .filter(el => el.offsetParent && el.getClientRects().length)
      .map(el => {
        const rect = el.getBoundingClientRect();
        const label = el.matches('.category-card') ? el.querySelector('.category-card-title') : el;
        return {
          text: (el.textContent || '').trim(),
          left: rect.left - contentRect.left,
          right: rect.right - contentRect.left,
          top: rect.top - contentRect.top,
          bottom: rect.bottom - contentRect.top,
          scrollWidth: label?.scrollWidth ?? 0,
          clientWidth: label?.clientWidth ?? 0,
          fontSize: parseFloat(getComputedStyle(label).fontSize)
        };
      });

    let anyOverlap = false;
    for (let i = 0; i < nodeMetrics.length; i += 1) {
      for (let j = i + 1; j < nodeMetrics.length; j += 1) {
        const a = nodeMetrics[i];
        const b = nodeMetrics[j];
        if (a.left < b.right && a.right > b.left && a.text !== b.text) {
          if (a.top < b.bottom && a.bottom > b.top) {
            anyOverlap = true;
            break;
          }
        }
      }
      if (anyOverlap) break;
    }

    return {
      contentWidth: contentRect.width,
      contentHeight: contentRect.height,
      minLeft: nodeMetrics.length ? Math.min(...nodeMetrics.map(node => node.left)) : 0,
      minTop: nodeMetrics.length ? Math.min(...nodeMetrics.map(node => node.top)) : 0,
      maxRight: nodeMetrics.length ? Math.max(...nodeMetrics.map(node => node.right)) : 0,
      maxBottom: nodeMetrics.length ? Math.max(...nodeMetrics.map(node => node.bottom)) : 0,
      minFontSize: nodeMetrics.length ? Math.min(...nodeMetrics.map(node => node.fontSize)) : 0,
      anyHorizontalClip: nodeMetrics.some(node => node.scrollWidth > node.clientWidth + 1),
      anyOverlap
    };
  });
}

export async function expectSpiderwebGeometry(page, {
  label,
  minLeft = 0,
  minFontSize = 0,
  maxRightPadding = 2,
  maxBottomPadding = 2,
  allowHorizontalClip = false,
  allowOverlap = false
} = {}) {
  const metrics = await measureSpiderwebGeometry(page);
  if (label) {
    expect(metrics.minLeft, `${label} left edge`).toBeGreaterThanOrEqual(minLeft);
    expect(metrics.minFontSize, `${label} font floor`).toBeGreaterThanOrEqual(minFontSize);
    expect(metrics.maxRight, `${label} right edge`).toBeLessThanOrEqual(metrics.contentWidth + maxRightPadding);
    expect(metrics.contentHeight, `${label} content height`).toBeGreaterThan(0);
  } else {
    expect(metrics.minLeft).toBeGreaterThanOrEqual(minLeft);
    expect(metrics.minFontSize).toBeGreaterThanOrEqual(minFontSize);
    expect(metrics.maxRight).toBeLessThanOrEqual(metrics.contentWidth + maxRightPadding);
  }
  expect(metrics.anyHorizontalClip, label ? `${label} label clip` : 'label clip').toBe(allowHorizontalClip);
  expect(metrics.anyOverlap, label ? `${label} overlap` : 'overlap').toBe(allowOverlap);
  return metrics;
}
