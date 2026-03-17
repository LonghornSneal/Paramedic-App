import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 480, height: 932 }
];

const CUSTOM_SETTINGS = {
  mainBackground: '#111111',
  mainText: '#f8fafc',
  categoryBackground: '#0b7285',
  categoryText: '#f8fafc',
  warnings: '#c92a2a',
  popupComments: '#7c2d12',
  popups: '#4c1d95',
  textScale: 1.15,
  brightness: 1.1
};

test.describe.configure({ mode: 'serial' });

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '').trim();
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16)
  };
}

function blendColor(source, target, amount) {
  const nextAmount = clamp(amount, 0, 1);
  return {
    r: Math.round(source.r + ((target.r - source.r) * nextAmount)),
    g: Math.round(source.g + ((target.g - source.g) * nextAmount)),
    b: Math.round(source.b + ((target.b - source.b) * nextAmount))
  };
}

function tintedPalette(hex, isDarkMode) {
  const source = hexToRgb(hex);
  const target = hexToRgb(isDarkMode ? '#0f172a' : '#ffffff');
  const background = blendColor(source, target, isDarkMode ? 0.68 : 0.84);
  const surface = blendColor(source, target, isDarkMode ? 0.58 : 0.92);
  const border = blendColor(source, target, isDarkMode ? 0.44 : 0.68);
  return {
    background: `rgb(${background.r}, ${background.g}, ${background.b})`,
    surface: `rgb(${surface.r}, ${surface.g}, ${surface.b})`,
    border: `rgb(${border.r}, ${border.g}, ${border.b})`
  };
}

async function gotoApp(page, viewport) {
  await page.setViewportSize(viewport);
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('#settings-button')).toBeVisible();
}

async function openSettings(page) {
  await page.click('#settings-button');
  await expect(page.locator('#settings-panel')).toBeVisible();
}

async function closeSettings(page) {
  await page.click('#close-settings-button');
  await expect(page.locator('#settings-panel')).toBeHidden();
}

async function setRangeValue(page, selector, value) {
  await page.locator(selector).evaluate((element, nextValue) => {
    element.value = String(nextValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

async function setRapidInputSequence(page, selector, values) {
  await page.locator(selector).evaluate((element, nextValues) => {
    nextValues.forEach(nextValue => {
      element.value = String(nextValue);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }, values);
}

async function applyCustomSettings(page) {
  await page.fill('#settings-mainBackground', '#111111');
  await page.fill('#settings-mainText', '#161616');
  await expect(page.locator('#settings-contrast-warning')).toBeVisible();

  await page.fill('#settings-mainText', CUSTOM_SETTINGS.mainText);
  await expect(page.locator('#settings-contrast-warning')).toBeHidden();

  await page.fill('#settings-categoryBackground', CUSTOM_SETTINGS.categoryBackground);
  await page.fill('#settings-categoryText', CUSTOM_SETTINGS.categoryText);
  await page.fill('#settings-warnings', CUSTOM_SETTINGS.warnings);
  await page.fill('#settings-popupComments', CUSTOM_SETTINGS.popupComments);
  await page.fill('#settings-popups', CUSTOM_SETTINGS.popups);
  await setRangeValue(page, '#settings-textScale', CUSTOM_SETTINGS.textScale);
  await page.click('#settings-reducedMotion');
  await page.click('#settings-darkMode');
  await setRangeValue(page, '#settings-darkModeBrightness', CUSTOM_SETTINGS.brightness);
}

async function openNtgWarningScenario(page) {
  await page.click('#open-sidebar-button');
  await page.fill('#vs-bp-systolic', '80');
  await page.fill('#vs-bp-diastolic', '40');
  await page.fill('#pt-medications', 'Viagra');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(300);
  await page.click('#close-sidebar-button');

  await page.fill('#searchInput', 'ntg');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(700);
  await page.locator('.topic-link-item[data-topic-id="ntg"]').click();
  await expect(page.locator('.topic-h2[data-topic-id="ntg"]')).toBeVisible();
  expect(await page.locator('.warning-box').count()).toBeGreaterThanOrEqual(2);
}

async function openAnaphylaxisDetail(page) {
  await page.fill('#searchInput', 'anaphylaxis');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(700);
  await page.locator('.topic-link-item[data-topic-id="adult-anaphylaxis"]').click();
  await expect(page.locator('.topic-h2[data-topic-id="adult-anaphylaxis"]')).toBeVisible();
  await expect(page.locator('.toggle-info').first()).toBeVisible();
}

test('1. settings modal stays usable across required phone viewports', async ({ page }) => {
  for (const viewport of VIEWPORTS) {
    await gotoApp(page, viewport);
    await openSettings(page);

    const panelMetrics = await page.locator('#settings-panel').evaluate(element => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };
    });

    expect(panelMetrics.left).toBeGreaterThanOrEqual(0);
    expect(panelMetrics.top).toBeGreaterThanOrEqual(0);
    expect(panelMetrics.right).toBeLessThanOrEqual(panelMetrics.viewportWidth);
    expect(panelMetrics.bottom).toBeLessThanOrEqual(panelMetrics.viewportHeight);

    const labels = page.locator('.settings-option__label');
    const labelCount = await labels.count();
    for (let index = 0; index < labelCount; index += 1) {
      const label = labels.nth(index);
      await label.scrollIntoViewIfNeeded();
      await expect(label).toBeVisible();
      const { labelRect, panelRect } = await label.evaluate(element => {
        const rect = element.getBoundingClientRect();
        const panel = document.getElementById('settings-panel').getBoundingClientRect();
        return {
          labelRect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom },
          panelRect: { left: panel.left, right: panel.right, top: panel.top, bottom: panel.bottom }
        };
      });
      expect(labelRect.left).toBeGreaterThanOrEqual(panelRect.left);
      expect(labelRect.right).toBeLessThanOrEqual(panelRect.right);
    }

    await page.locator('#settings-reset-button').scrollIntoViewIfNeeded();
    await expect(page.locator('#settings-reset-button')).toBeVisible();
    await closeSettings(page);
  }
});

test('2. settings persist through navigation, detail pages, and reload', async ({ page }) => {
  await gotoApp(page, VIEWPORTS[1]);
  await openSettings(page);
  await applyCustomSettings(page);
  await closeSettings(page);

  await openNtgWarningScenario(page);

  const expectedWarningPalette = tintedPalette(CUSTOM_SETTINGS.warnings, true);
  const warningStyles = await page.locator('.warning-box').first().evaluate(element => {
    const styles = getComputedStyle(element);
    return {
      background: styles.backgroundColor,
      color: styles.color,
      border: styles.borderColor
    };
  });

  expect(warningStyles.background).toBe(expectedWarningPalette.background);
  expect(warningStyles.border).toBe(expectedWarningPalette.border);
  expect(warningStyles.color).toBe('rgb(248, 250, 252)');

  await openAnaphylaxisDetail(page);

  const expectedCommentPalette = tintedPalette(CUSTOM_SETTINGS.popupComments, true);
  const commentStyles = await page.locator('.toggle-info').first().evaluate(element => {
    const styles = getComputedStyle(element);
    return {
      background: styles.backgroundColor,
      color: styles.color,
      border: styles.borderBottomColor
    };
  });

  expect(commentStyles.background).toBe(expectedCommentPalette.background);
  expect(commentStyles.border).toBe(expectedCommentPalette.border);
  expect(commentStyles.color).toBe('rgb(248, 250, 252)');

  await openSettings(page);
  await expect(page.locator('#settings-mainBackground')).toHaveValue(CUSTOM_SETTINGS.mainBackground);
  await expect(page.locator('#settings-categoryBackground')).toHaveValue(CUSTOM_SETTINGS.categoryBackground);
  await expect(page.locator('#settings-textScale')).toHaveValue(String(CUSTOM_SETTINGS.textScale));
  await expect(page.locator('#settings-reducedMotion')).toBeChecked();
  await expect(page.locator('#settings-darkMode')).toBeChecked();
  await closeSettings(page);

  await page.reload({ waitUntil: 'networkidle' });
  await openSettings(page);
  await expect(page.locator('#settings-mainBackground')).toHaveValue(CUSTOM_SETTINGS.mainBackground);
  await expect(page.locator('#settings-popups')).toHaveValue(CUSTOM_SETTINGS.popups);
  await expect(page.locator('#settings-reducedMotion')).toBeChecked();
  await expect(page.locator('#settings-darkMode')).toBeChecked();

  const pageState = await page.evaluate(() => ({
    darkMode: document.body.classList.contains('dark-mode'),
    reducedMotion: document.body.classList.contains('reduced-motion'),
    fontSize: getComputedStyle(document.documentElement).fontSize,
    brightness: document.documentElement.style.getPropertyValue('--brightness'),
    stored: JSON.parse(localStorage.getItem('paramedicApp.settings.v1'))
  }));

  expect(pageState.darkMode).toBe(true);
  expect(pageState.reducedMotion).toBe(true);
  expect(pageState.fontSize).toBe('18.4px');
  expect(pageState.brightness).toBe(String(CUSTOM_SETTINGS.brightness));
  expect(pageState.stored.colors.popupComments).toBe(CUSTOM_SETTINGS.popupComments);
  expect(pageState.stored.colors.popups).toBe(CUSTOM_SETTINGS.popups);
});

test('3. reset restores defaults after several changes in a different order', async ({ page }) => {
  await gotoApp(page, VIEWPORTS[2]);
  await openSettings(page);

  await setRangeValue(page, '#settings-textScale', 1.25);
  await page.click('#settings-darkMode');
  await setRangeValue(page, '#settings-darkModeBrightness', 1.2);
  await page.fill('#settings-popups', '#14532d');
  await page.fill('#settings-mainBackground', '#fef3c7');
  await page.fill('#settings-mainText', '#451a03');
  await page.fill('#settings-categoryBackground', '#7c2d12');
  await page.fill('#settings-categoryText', '#fefce8');
  await page.click('#settings-reducedMotion');
  await closeSettings(page);

  await page.fill('#searchInput', 'anaphylaxis');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(700);
  await page.locator('.topic-link-item[data-topic-id="adult-anaphylaxis"]').click();
  await expect(page.locator('.topic-h2[data-topic-id="adult-anaphylaxis"]')).toBeVisible();

  await openSettings(page);
  await page.click('#settings-reset-button');
  await expect(page.locator('#settings-contrast-warning')).toBeHidden();
  await expect(page.locator('#settings-mainBackground')).toHaveValue('');
  await expect(page.locator('#settings-mainText')).toHaveValue('');
  await expect(page.locator('#settings-categoryBackground')).toHaveValue('');
  await expect(page.locator('#settings-categoryText')).toHaveValue('');
  await expect(page.locator('#settings-popups')).toHaveValue('');
  await expect(page.locator('#settings-textScale')).toHaveValue('1');
  await expect(page.locator('#settings-reducedMotion')).not.toBeChecked();
  await expect(page.locator('#settings-darkMode')).not.toBeChecked();
  await closeSettings(page);

  const resetState = await page.evaluate(() => ({
    darkMode: document.body.classList.contains('dark-mode'),
    reducedMotion: document.body.classList.contains('reduced-motion'),
    fontSize: getComputedStyle(document.documentElement).fontSize,
    stored: JSON.parse(localStorage.getItem('paramedicApp.settings.v1'))
  }));

  expect(resetState.darkMode).toBe(false);
  expect(resetState.reducedMotion).toBe(false);
  expect(resetState.fontSize).toBe('16px');
  expect(resetState.stored.colors.mainBackground).toBe('');
  expect(resetState.stored.colors.popups).toBe('');

  await page.reload({ waitUntil: 'networkidle' });
  await openSettings(page);
  await expect(page.locator('#settings-mainBackground')).toHaveValue('');
  await expect(page.locator('#settings-darkMode')).not.toBeChecked();
  await expect(page.locator('#settings-reducedMotion')).not.toBeChecked();
});

test('4. escape closes settings and rapid inputs persist the final values', async ({ page }) => {
  await gotoApp(page, VIEWPORTS[0]);

  await page.locator('#settings-button').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#settings-panel')).toBeVisible();
  await expect(page.locator('#close-settings-button')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(page.locator('#settings-panel')).toBeHidden();
  await expect(page.locator('#settings-button')).toBeFocused();

  await page.locator('#settings-button').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#settings-panel')).toBeVisible();

  await setRapidInputSequence(page, '#settings-mainBackground', ['#1f1f1f', '#111111']);
  await setRapidInputSequence(page, '#settings-mainText', ['#d1d5db', '#f8fafc']);
  await setRapidInputSequence(page, '#settings-categoryBackground', ['#1d4ed8', '#0b7285']);
  await setRapidInputSequence(page, '#settings-categoryText', ['#e2e8f0', '#f8fafc']);
  await setRapidInputSequence(page, '#settings-warnings', ['#dc2626', '#c92a2a']);
  await setRapidInputSequence(page, '#settings-popupComments', ['#92400e', '#7c2d12']);
  await setRapidInputSequence(page, '#settings-popups', ['#312e81', '#4c1d95']);
  await setRapidInputSequence(page, '#settings-textScale', [1.05, 1.1, 1.15]);
  await setRapidInputSequence(page, '#settings-darkModeBrightness', [0.9, 1.05, 1.1]);

  await expect(page.locator('#settings-mainBackground')).toHaveValue('#111111');
  await expect(page.locator('#settings-mainText')).toHaveValue('#f8fafc');
  await expect(page.locator('#settings-textScale')).toHaveValue('1.15');
  await expect(page.locator('#settings-darkModeBrightness')).toHaveValue('1.1');

  await closeSettings(page);
  await page.reload({ waitUntil: 'networkidle' });

  await openSettings(page);
  await expect(page.locator('#settings-contrast-warning')).toBeHidden();
  await expect(page.locator('#settings-mainBackground')).toHaveValue('#111111');
  await expect(page.locator('#settings-mainText')).toHaveValue('#f8fafc');
  await expect(page.locator('#settings-categoryBackground')).toHaveValue('#0b7285');
  await expect(page.locator('#settings-categoryText')).toHaveValue('#f8fafc');
  await expect(page.locator('#settings-warnings')).toHaveValue('#c92a2a');
  await expect(page.locator('#settings-popupComments')).toHaveValue('#7c2d12');
  await expect(page.locator('#settings-popups')).toHaveValue('#4c1d95');
  await expect(page.locator('#settings-textScale')).toHaveValue('1.15');
  await expect(page.locator('#settings-darkModeBrightness')).toHaveValue('1.1');

  const storedSettings = await page.evaluate(() => JSON.parse(localStorage.getItem('paramedicApp.settings.v1')));
  expect(storedSettings.colors.mainBackground).toBe('#111111');
  expect(storedSettings.colors.mainText).toBe('#f8fafc');
  expect(storedSettings.colors.categoryBackground).toBe('#0b7285');
  expect(storedSettings.colors.categoryText).toBe('#f8fafc');
  expect(storedSettings.colors.warnings).toBe('#c92a2a');
  expect(storedSettings.colors.popupComments).toBe('#7c2d12');
  expect(storedSettings.colors.popups).toBe('#4c1d95');
  expect(storedSettings.textScale).toBe(1.15);
  expect(storedSettings.darkModeBrightness).toBe(1.1);
});
