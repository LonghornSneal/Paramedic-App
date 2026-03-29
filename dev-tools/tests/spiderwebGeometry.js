import { expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';

const APP_URL = 'http://127.0.0.1:5173/';
let serverProc = null;
let serverPromise = null;

function waitForHttp(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const probe = () => {
      const req = http.get(url, res => {
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Server at ${url} not reachable`));
          return;
        }
        setTimeout(probe, 500);
      });
    };
    probe();
  });
}

export async function ensurePreviewServer() {
  try {
    await waitForHttp(APP_URL, 2000);
    return;
  } catch {
    // Server not running yet.
  }

  if (serverPromise) {
    await serverPromise;
    await waitForHttp(APP_URL);
    return;
  }

  serverPromise = (async () => {
    const isWin = process.platform === 'win32';
    const serverBin = path.resolve(
      process.cwd(),
      isWin ? 'node_modules/.bin/http-server.cmd' : 'node_modules/.bin/http-server'
    );
    const command = isWin ? 'cmd.exe' : serverBin;
    const args = isWin
      ? ['/c', serverBin, '-p', '5173', '-c-1']
      : ['-p', '5173', '-c-1'];
    serverProc = spawn(command, args, { stdio: 'ignore', shell: false });
    await waitForHttp(APP_URL);
  })();

  try {
    await serverPromise;
  } catch (error) {
    if (error && error.code === 'EADDRINUSE') {
      await waitForHttp(APP_URL);
      return;
    }
    throw error;
  } finally {
    serverPromise = null;
  }
}

export async function shutdownPreviewServer() {
  if (serverPromise) {
    try {
      await serverPromise;
    } catch {
      // ignore startup failures
    }
  }

  if (serverProc && !serverProc.killed) {
    serverProc.kill();
  }

  serverProc = null;
}

export async function gotoApp(page, viewport = { width: 1440, height: 1024 }) {
  await page.setViewportSize(viewport);
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(150);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function clickLabel(page, label) {
  const locator = page.getByRole('button', {
    name: new RegExp(`^${escapeRegExp(label)}(?:Show|Hide)?$`, 'i')
  }).first();
  await locator.click();
}

export async function clickBranchPath(page, branchPath) {
  await page.locator(`[data-branch-path="${branchPath}"] > .category-card`).first().click();
}

export async function measureBranchGeometry(page) {
  return page.evaluate(() => {
    const content = document.getElementById('content-area');
    if (!content) {
      return {
        contentWidth: 0,
        contentHeight: 0,
        scrollHeight: 0,
        minLeft: 0,
        minTop: 0,
        maxRight: 0,
        maxBottom: 0,
        minFontSize: 0,
        maxVerticalGap: 0,
        anyHorizontalClip: false,
        anyOverlap: false,
        visibleCount: 0,
        nodes: []
      };
    }

    const contentRect = content.getBoundingClientRect();
    const nodes = Array.from(content.querySelectorAll('.category-card, .topic-link-item'))
      .filter(el => el.offsetParent && el.getClientRects().length && !el.closest('.category-children[data-expanded="false"]'))
      .map(el => {
        const rect = el.getBoundingClientRect();
        const label = el.matches('.category-card') ? el.querySelector('.category-card-title') : el;
        const style = getComputedStyle(el);
        return {
          text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
          kind: el.classList.contains('topic-link-item') ? 'topic' : 'category',
          left: rect.left - contentRect.left,
          right: rect.right - contentRect.left,
          top: rect.top - contentRect.top,
          bottom: rect.bottom - contentRect.top,
          width: rect.width,
          height: rect.height,
          opacity: Number(style.opacity),
          transform: style.transform,
          filter: style.filter,
          borderColor: style.borderColor,
          backgroundImage: style.backgroundImage,
          animationName: style.animationName,
          animationDuration: style.animationDuration,
          whiteSpace: label ? getComputedStyle(label).whiteSpace : style.whiteSpace,
          scrollWidth: label?.scrollWidth ?? el.scrollWidth,
          clientWidth: label?.clientWidth ?? el.clientWidth,
          fontSize: parseFloat(getComputedStyle(label || el).fontSize),
          activeBranch: el.dataset.activeBranch || 'none',
          isExpanded: el.classList.contains('is-expanded')
        };
      });

    const sorted = [...nodes].sort((a, b) => a.top - b.top || a.left - b.left);
    const gaps = sorted.length > 1
      ? sorted.slice(1).map((node, index) => Math.max(0, node.top - sorted[index].bottom))
      : [0];

    let anyOverlap = false;
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const horizontal = a.left < b.right && a.right > b.left;
        const vertical = a.top < b.bottom && a.bottom > b.top;
        if (horizontal && vertical && a.text !== b.text) {
          anyOverlap = true;
          break;
        }
      }
      if (anyOverlap) break;
    }

    return {
      contentWidth: contentRect.width,
      contentHeight: contentRect.height,
      scrollHeight: content.scrollHeight,
      minLeft: nodes.length ? Math.min(...nodes.map(node => node.left)) : 0,
      minTop: nodes.length ? Math.min(...nodes.map(node => node.top)) : 0,
      maxRight: nodes.length ? Math.max(...nodes.map(node => node.right)) : 0,
      maxBottom: nodes.length ? Math.max(...nodes.map(node => node.bottom)) : 0,
      minFontSize: nodes.length ? Math.min(...nodes.map(node => node.fontSize)) : 0,
      maxVerticalGap: gaps.length ? Math.max(...gaps) : 0,
      anyHorizontalClip: nodes.some(node => node.scrollWidth > node.clientWidth + 1),
      anyOverlap,
      visibleCount: nodes.length,
      nodes
    };
  });
}

export async function sampleNodeTimeline(page, target, sampleTimes) {
  const samples = [];
  let elapsed = 0;
  for (const ms of sampleTimes) {
    if (ms > elapsed) {
      await page.waitForTimeout(ms - elapsed);
    }
    elapsed = ms;
    samples.push({
      ms,
      ...(await page.evaluate((rawTarget) => {
        const target = typeof rawTarget === 'string'
          ? { text: rawTarget }
          : rawTarget;
        const normalizedNeedle = (target.text || '').replace(/\s+/g, ' ').trim().toLowerCase();
        const content = document.getElementById('content-area');
        const node = Array.from(content?.querySelectorAll('.category-card, .topic-link-item') || [])
          .find(el => {
            if (!el.offsetParent || !el.getClientRects().length) return false;
            if (el.closest('.category-children[data-expanded="false"]')) return false;
            if (target.branchPath) {
              return el.dataset.branchPath === target.branchPath;
            }
            const text = (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
            return text.includes(normalizedNeedle);
          });
        if (!node) {
          return null;
        }
        const rect = node.getBoundingClientRect();
        const label = node.matches('.category-card') ? node.querySelector('.category-card-title') : node;
        const style = getComputedStyle(node);
        return {
          text: (node.textContent || '').replace(/\s+/g, ' ').trim(),
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          opacity: Number(style.opacity),
          transform: style.transform,
          filter: style.filter,
          borderColor: style.borderColor,
          backgroundImage: style.backgroundImage,
          animationName: style.animationName,
          animationDuration: style.animationDuration,
          fontSize: parseFloat(getComputedStyle(label || node).fontSize),
          whiteSpace: label ? getComputedStyle(label).whiteSpace : style.whiteSpace,
          scrollWidth: label?.scrollWidth ?? node.scrollWidth,
          clientWidth: label?.clientWidth ?? node.clientWidth,
          color: label ? getComputedStyle(label).color : style.color,
          activeBranch: node.dataset.activeBranch || 'none'
        };
      }, target))
    });
  }
  return samples;
}

export async function expectReadableBranchGeometry(page, options = {}) {
  const metrics = await measureBranchGeometry(page);
  const {
    minLeft = 0,
    minFontSize = 0,
    maxRightPadding = 2,
    allowHorizontalClip = false,
    allowOverlap = false,
    maxVerticalGap = Infinity
  } = options;

  expect(metrics.minLeft).toBeGreaterThanOrEqual(minLeft);
  expect(metrics.minFontSize).toBeGreaterThanOrEqual(minFontSize);
  expect(metrics.maxRight).toBeLessThanOrEqual(metrics.contentWidth + maxRightPadding);
  expect(metrics.anyHorizontalClip).toBe(allowHorizontalClip);
  expect(metrics.anyOverlap).toBe(allowOverlap);
  expect(metrics.maxVerticalGap).toBeLessThanOrEqual(maxVerticalGap);
  return metrics;
}

export { measureBranchGeometry as measureSpiderwebGeometry };
export { expectReadableBranchGeometry as expectSpiderwebGeometry };
