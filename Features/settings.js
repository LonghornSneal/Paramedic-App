const STORAGE_KEY = 'paramedicApp.settings.v1';
const DARK_TEXT_HEX = '#0f172a';
const LIGHT_TEXT_HEX = '#f8fafc';
const DARK_SURFACE_HEX = '#0f172a';
const LIGHT_SURFACE_HEX = '#ffffff';
const SETTINGS_STATUS_CLEAR_DELAY_MS = 1800;

const settingsButtonEl = document.getElementById('settings-button');
const settingsPanelEl = document.getElementById('settings-panel');
const closeSettingsButton = document.getElementById('close-settings-button');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const devOverlayToggle = document.getElementById('dev-overlay-toggle');
const overlayEl = document.getElementById('sidebar-overlay');
const patientSidebarEl = document.getElementById('patient-sidebar');
const settingsResetButton = document.getElementById('settings-reset-button');
const contrastWarningEl = document.getElementById('settings-contrast-warning');
const liveStatusEl = document.getElementById('settings-live-status');
const sectionContainers = {
    appearance: document.getElementById('settings-appearance-options'),
    accessibility: document.getElementById('settings-accessibility-options'),
    advanced: document.getElementById('settings-advanced-options')
};

const COLOR_SETTING_KEYS = [
    'mainBackground',
    'categoryBackground',
    'mainText',
    'categoryText',
    'warnings',
    'popupComments',
    'popups'
];

const COLOR_SETTING_DEFS = [
    {
        key: 'mainBackground',
        section: 'appearance',
        label: 'Main Background',
        description: 'Body, content, and detail surfaces.',
        pickerLabel: 'Select the main background color'
    },
    {
        key: 'mainText',
        section: 'appearance',
        label: 'Main Text',
        description: 'Primary reading text on main surfaces.',
        pickerLabel: 'Select the main text color'
    },
    {
        key: 'categoryBackground',
        section: 'appearance',
        label: 'Category Background',
        description: 'Spiderweb category and topic pills.',
        pickerLabel: 'Select the category background color'
    },
    {
        key: 'categoryText',
        section: 'appearance',
        label: 'Category Text',
        description: 'Category and topic pill text.',
        pickerLabel: 'Select the category text color'
    },
    {
        key: 'warnings',
        section: 'appearance',
        label: 'Warnings',
        description: 'Detail warning boxes and alert emphasis.',
        pickerLabel: 'Select the warning color'
    },
    {
        key: 'popupComments',
        section: 'appearance',
        label: 'Pop-up Comments',
        description: 'Inline comment and info toggles inside details.',
        pickerLabel: 'Select the pop-up comment color'
    },
    {
        key: 'popups',
        section: 'appearance',
        label: 'Other Pop-ups',
        description: 'Settings, history, search, and shared modal surfaces.',
        pickerLabel: 'Select the pop-up color'
    }
];

const CONTROL_DEFS = [
    {
        key: 'darkMode',
        section: 'appearance',
        type: 'toggle',
        label: 'Dark Mode',
        description: 'Keeps the low-light palette and brightness behavior.'
    },
    {
        key: 'darkModeBrightness',
        section: 'appearance',
        type: 'range',
        label: 'Dark Mode Brightness',
        description: 'Applies when dark mode is enabled.',
        min: 0.5,
        max: 1.5,
        step: 0.05,
        defaultValue: 1,
        formatValue: value => `${Math.round(value * 100)}%`
    },
    {
        key: 'textScale',
        section: 'accessibility',
        type: 'range',
        label: 'Text Size',
        description: 'Scales app text for quicker reading.',
        min: 0.9,
        max: 1.3,
        step: 0.05,
        defaultValue: 1,
        formatValue: value => `${Math.round(value * 100)}%`
    },
    {
        key: 'reducedMotion',
        section: 'accessibility',
        type: 'toggle',
        label: 'Reduced Motion',
        description: 'Minimizes transitions and animated emphasis.'
    },
    ...COLOR_SETTING_DEFS.map(def => ({
        ...def,
        type: 'color'
    })),
    {
        key: 'devOverlay',
        section: 'advanced',
        type: 'toggle',
        label: 'Dev Overlay',
        description: 'Keeps the existing spiderweb tuning overlay available.'
    }
];

const controlRefs = new Map();
const contrastPairDefinitions = [
    {
        bgKey: 'mainBackground',
        textKey: 'mainText',
        label: 'Main text is too close to the main background.'
    },
    {
        bgKey: 'categoryBackground',
        textKey: 'categoryText',
        label: 'Category text is too close to the category background.'
    }
];

let currentSettings = createDefaultSettings();
let settingsStatusTimer = null;

initializeSettingsFeature();

function initializeSettingsFeature() {
    if (!settingsPanelEl) return;

    buildSettingsControls();
    currentSettings = loadSettings();
    applySettings(currentSettings);
    syncControlsFromSettings();
    refreshContrastWarnings();

    settingsButtonEl?.addEventListener('click', openSettingsPanel);
    closeSettingsButton?.addEventListener('click', closeSettingsPanel);
    settingsResetButton?.addEventListener('click', handleResetToDefaults);

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !settingsPanelEl.classList.contains('hidden')) {
            closeSettingsPanel();
        }
    });
}

function createDefaultSettings() {
    return {
        darkMode: false,
        darkModeBrightness: 1,
        textScale: 1,
        reducedMotion: false,
        devOverlay: false,
        colors: {
            mainBackground: '',
            categoryBackground: '',
            mainText: '',
            categoryText: '',
            warnings: '',
            popupComments: '',
            popups: ''
        }
    };
}

function loadSettings() {
    const defaults = createDefaultSettings();
    let persisted = {};

    if (typeof localStorage !== 'undefined') {
        try {
            persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
        } catch {
            persisted = {};
        }
    }

    const settings = {
        ...defaults,
        ...persisted,
        colors: {
            ...defaults.colors,
            ...(persisted.colors || {})
        }
    };

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true' || savedDarkMode === 'false') {
        settings.darkMode = savedDarkMode === 'true';
    }

    const savedBrightness = parseFloat(localStorage.getItem('darkModeBrightness'));
    if (!Number.isNaN(savedBrightness)) {
        settings.darkModeBrightness = clamp(savedBrightness, 0.5, 1.5);
    }

    const savedDevOverlay = localStorage.getItem('devOverlay');
    if (savedDevOverlay === 'true' || savedDevOverlay === 'false') {
        settings.devOverlay = savedDevOverlay === 'true';
    }

    settings.darkMode = Boolean(settings.darkMode);
    settings.reducedMotion = Boolean(settings.reducedMotion);
    settings.devOverlay = Boolean(settings.devOverlay);
    settings.darkModeBrightness = clamp(Number(settings.darkModeBrightness) || defaults.darkModeBrightness, 0.5, 1.5);
    settings.textScale = clamp(Number(settings.textScale) || defaults.textScale, 0.9, 1.3);

    COLOR_SETTING_KEYS.forEach(key => {
        settings.colors[key] = normalizeColorValue(settings.colors[key]);
    });

    return settings;
}

function saveSettings(settings) {
    const payload = {
        darkMode: settings.darkMode,
        darkModeBrightness: settings.darkModeBrightness,
        textScale: settings.textScale,
        reducedMotion: settings.reducedMotion,
        devOverlay: settings.devOverlay,
        colors: { ...settings.colors }
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem('darkMode', settings.darkMode ? 'true' : 'false');
    localStorage.setItem('darkModeBrightness', String(settings.darkModeBrightness));
    localStorage.setItem('devOverlay', settings.devOverlay ? 'true' : 'false');
}

function buildSettingsControls() {
    CONTROL_DEFS.forEach(def => {
        const container = sectionContainers[def.section];
        if (!container) return;

        let control;
        if (def.type === 'toggle') {
            control = createToggleControl(def);
        } else if (def.type === 'range') {
            control = createRangeControl(def);
        } else if (def.type === 'color') {
            control = createColorControl(def);
        }

        if (control) {
            container.appendChild(control.element);
            controlRefs.set(def.key, control.refs);
        }
    });
}

function createToggleControl(def) {
    const wrapper = createSettingsOptionShell(def, 'settings-option--toggle');

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `settings-${def.key}`;
    input.className = 'settings-option__toggle';
    input.addEventListener('change', () => {
        updateSetting(def.key, input.checked, `${def.label} updated.`);
    });

    wrapper.appendChild(input);

    return {
        element: wrapper,
        refs: {
            type: 'toggle',
            input,
            wrapper
        }
    };
}

function createRangeControl(def) {
    const wrapper = createSettingsOptionShell(def, 'settings-option--range');

    const valueOutput = document.createElement('span');
    valueOutput.className = 'settings-value-output';
    valueOutput.id = `settings-${def.key}-value`;
    valueOutput.textContent = def.formatValue(def.defaultValue);
    wrapper.querySelector('.settings-option__copy')?.appendChild(valueOutput);

    const input = document.createElement('input');
    input.type = 'range';
    input.id = `settings-${def.key}`;
    input.className = 'settings-slider';
    input.min = String(def.min);
    input.max = String(def.max);
    input.step = String(def.step);
    input.value = String(def.defaultValue);

    const preview = document.createElement('div');
    preview.className = 'settings-preview';
    preview.id = `settings-${def.key}-preview`;
    preview.textContent = def.key === 'textScale' ? 'Readable in motion' : 'Dark mode preview';

    input.addEventListener('input', () => {
        const numericValue = clamp(Number(input.value), def.min, def.max);
        updateSetting(def.key, numericValue, `${def.label} updated.`);
    });

    wrapper.append(input, preview);

    return {
        element: wrapper,
        refs: {
            type: 'range',
            input,
            preview,
            valueOutput,
            wrapper,
            formatValue: def.formatValue
        }
    };
}

function createColorControl(def) {
    const wrapper = createSettingsOptionShell(def, 'settings-option--color');

    const row = document.createElement('div');
    row.className = 'settings-color-row';

    const picker = document.createElement('input');
    picker.type = 'color';
    picker.id = `settings-${def.key}-picker`;
    picker.className = 'settings-color-picker';
    picker.value = '#ffffff';
    picker.setAttribute('aria-label', def.pickerLabel);
    picker.addEventListener('input', () => {
        updateColorSetting(def.key, picker.value, `${def.label} color updated.`);
    });

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = `settings-${def.key}`;
    textInput.className = 'settings-color-value';
    textInput.autocomplete = 'off';
    textInput.spellcheck = false;
    textInput.inputMode = 'text';
    textInput.placeholder = '#ffffff';
    textInput.setAttribute('aria-label', `${def.label} color value`);
    textInput.addEventListener('input', () => {
        handleColorTextEntry(def.key, textInput.value);
    });
    textInput.addEventListener('blur', () => {
        finalizeColorTextEntry(def.key);
    });
    textInput.addEventListener('change', () => {
        finalizeColorTextEntry(def.key);
    });

    const swatch = document.createElement('span');
    swatch.className = 'settings-color-swatch';
    swatch.setAttribute('aria-hidden', 'true');

    row.append(picker, textInput, swatch);
    wrapper.appendChild(row);

    const meta = document.createElement('div');
    meta.className = 'settings-option__meta';

    const state = document.createElement('span');
    state.className = 'settings-option__state';
    state.textContent = 'Default';

    const hint = document.createElement('span');
    hint.className = 'settings-option__hint';
    hint.textContent = 'Leave blank to use the current theme default.';

    meta.append(state, hint);
    wrapper.appendChild(meta);

    return {
        element: wrapper,
        refs: {
            type: 'color',
            wrapper,
            picker,
            textInput,
            swatch,
            state
        }
    };
}

function createSettingsOptionShell(def, modifierClass) {
    const wrapper = document.createElement('div');
    wrapper.className = `settings-option ${modifierClass}`;
    wrapper.dataset.settingKey = def.key;

    const copy = document.createElement('div');
    copy.className = 'settings-option__copy';

    const label = document.createElement('label');
    label.className = 'settings-option__label';
    label.htmlFor = `settings-${def.key}`;
    label.textContent = def.label;

    const description = document.createElement('p');
    description.className = 'settings-option__description';
    description.textContent = def.description;

    copy.append(label, description);
    wrapper.appendChild(copy);
    return wrapper;
}

function openSettingsPanel() {
    if (patientSidebarEl?.classList.contains('open')) {
        patientSidebarEl.classList.remove('open');
        setTimeout(() => patientSidebarEl?.classList.add('hidden'), 300);
    }

    settingsPanelEl.classList.remove('hidden');
    overlayEl?.classList.add('active');
    overlayEl?.classList.remove('hidden');
    closeSettingsButton?.focus();
}

function closeSettingsPanel() {
    settingsPanelEl?.classList.add('hidden');
    overlayEl?.classList.remove('active');
    overlayEl?.classList.add('hidden');
    settingsButtonEl?.focus();
}

function handleResetToDefaults() {
    currentSettings = createDefaultSettings();
    applySettings(currentSettings);
    saveSettings(currentSettings);
    syncControlsFromSettings();
    refreshContrastWarnings();
    announceStatus('Defaults restored.');
}

function updateSetting(key, value, announcement) {
    if (key === 'darkMode' || key === 'reducedMotion' || key === 'devOverlay') {
        currentSettings[key] = Boolean(value);
    } else if (key === 'darkModeBrightness') {
        currentSettings.darkModeBrightness = clamp(Number(value), 0.5, 1.5);
    } else if (key === 'textScale') {
        currentSettings.textScale = clamp(Number(value), 0.9, 1.3);
    }

    applySettings(currentSettings);
    saveSettings(currentSettings);
    syncControlsFromSettings();
    refreshContrastWarnings();
    announceStatus(announcement);
}

function updateColorSetting(key, value, announcement) {
    currentSettings.colors[key] = normalizeColorValue(value);
    applySettings(currentSettings);
    saveSettings(currentSettings);
    syncControlsFromSettings();
    refreshContrastWarnings();
    announceStatus(announcement);
}

function handleColorTextEntry(key, rawValue) {
    const refs = controlRefs.get(key);
    if (!refs || refs.type !== 'color') return;

    const trimmedValue = String(rawValue || '').trim();
    if (!trimmedValue) {
        refs.wrapper.classList.remove('is-invalid');
        updateColorSetting(key, '', `${getDefinitionLabel(key)} reset to the default theme color.`);
        return;
    }

    const normalizedColor = normalizeColorValue(trimmedValue);
    refs.wrapper.classList.toggle('is-invalid', !normalizedColor);
    if (normalizedColor) {
        updateColorSetting(key, normalizedColor, `${getDefinitionLabel(key)} color updated.`);
    }
}

function finalizeColorTextEntry(key) {
    const refs = controlRefs.get(key);
    if (!refs || refs.type !== 'color') return;

    const trimmedValue = String(refs.textInput.value || '').trim();
    const normalizedColor = normalizeColorValue(trimmedValue);

    refs.wrapper.classList.toggle('is-invalid', Boolean(trimmedValue) && !normalizedColor);

    if (!trimmedValue) {
        currentSettings.colors[key] = '';
        applySettings(currentSettings);
        saveSettings(currentSettings);
        syncControlsFromSettings();
        refreshContrastWarnings();
        return;
    }

    if (!normalizedColor) {
        syncControlsFromSettings();
        announceStatus(`${getDefinitionLabel(key)} kept its previous value.`);
    }
}

function getDefinitionLabel(key) {
    return CONTROL_DEFS.find(def => def.key === key)?.label || key;
}

function applySettings(settings) {
    document.body.classList.toggle('dark-mode', settings.darkMode);
    document.body.classList.toggle('reduced-motion', settings.reducedMotion);
    document.documentElement.style.setProperty('--brightness', String(settings.darkModeBrightness));
    document.documentElement.style.setProperty('--app-text-scale', String(settings.textScale));

    applyColorOverrides(settings);

    if (typeof window.setDevOverlayVisible === 'function') {
        window.setDevOverlayVisible(settings.devOverlay);
    } else if (devOverlayToggle) {
        devOverlayToggle.checked = settings.devOverlay;
    }

    if (darkModeToggle) {
        darkModeToggle.checked = settings.darkMode;
    }
    if (devOverlayToggle) {
        devOverlayToggle.checked = settings.devOverlay;
    }
}

function applyColorOverrides(settings) {
    const rootStyle = document.documentElement.style;
    const isDarkMode = settings.darkMode;

    setOrRemoveStyleVar(rootStyle, '--app-main-bg-user', settings.colors.mainBackground);
    setOrRemoveStyleVar(rootStyle, '--app-main-text-user', settings.colors.mainText);

    if (settings.colors.categoryBackground) {
        const palette = createSolidSurfacePalette(settings.colors.categoryBackground);
        rootStyle.setProperty('--app-category-bg-user', palette.background);
        rootStyle.setProperty('--app-category-bg-accent-user', palette.accent);
        rootStyle.setProperty('--app-category-border-user', palette.border);
    } else {
        removeStyleVars(rootStyle, [
            '--app-category-bg-user',
            '--app-category-bg-accent-user',
            '--app-category-border-user'
        ]);
    }

    setOrRemoveStyleVar(rootStyle, '--app-category-text-user', settings.colors.categoryText);

    applyTintedPalette(rootStyle, {
        keyColor: settings.colors.warnings,
        isDarkMode,
        accentVar: '--app-warning-accent-user',
        backgroundVar: '--app-warning-bg-user',
        borderVar: '--app-warning-border-user',
        textVar: '--app-warning-text-user',
        mutedVar: '--app-warning-muted-user'
    });

    applyTintedPalette(rootStyle, {
        keyColor: settings.colors.popupComments,
        isDarkMode,
        accentVar: '--app-comment-accent-user',
        backgroundVar: '--app-comment-bg-user',
        borderVar: '--app-comment-border-user',
        textVar: '--app-comment-text-user',
        mutedVar: '--app-comment-muted-user',
        secondaryVar: '--app-comment-surface-user'
    });

    applyTintedPalette(rootStyle, {
        keyColor: settings.colors.popups,
        isDarkMode,
        accentVar: '--app-popup-accent-user',
        backgroundVar: '--app-popup-bg-user',
        borderVar: '--app-popup-border-user',
        textVar: '--app-popup-text-user',
        mutedVar: '--app-popup-muted-user',
        secondaryVar: '--app-popup-surface-user'
    });
}

function applyTintedPalette(rootStyle, options) {
    const paletteVars = [
        options.accentVar,
        options.backgroundVar,
        options.borderVar,
        options.textVar,
        options.mutedVar,
        options.secondaryVar
    ].filter(Boolean);

    if (!options.keyColor) {
        removeStyleVars(rootStyle, paletteVars);
        return;
    }

    const palette = createTintedPalette(options.keyColor, options.isDarkMode);
    rootStyle.setProperty(options.accentVar, palette.accent);
    rootStyle.setProperty(options.backgroundVar, palette.background);
    rootStyle.setProperty(options.borderVar, palette.border);
    rootStyle.setProperty(options.textVar, palette.text);
    rootStyle.setProperty(options.mutedVar, palette.muted);
    if (options.secondaryVar) {
        rootStyle.setProperty(options.secondaryVar, palette.surface);
    }
}

function syncControlsFromSettings() {
    CONTROL_DEFS.forEach(def => {
        const refs = controlRefs.get(def.key);
        if (!refs) return;

        if (refs.type === 'toggle') {
            refs.input.checked = Boolean(currentSettings[def.key]);
            return;
        }

        if (refs.type === 'range') {
            const value = Number(currentSettings[def.key]);
            refs.input.value = String(value);
            refs.valueOutput.textContent = refs.formatValue(value);
            updateRangePreview(def.key, refs.preview, value);
            return;
        }

        if (refs.type === 'color') {
            const customValue = currentSettings.colors[def.key];
            const effectiveValue = getEffectiveColorValue(def.key);
            refs.picker.value = effectiveValue;
            refs.textInput.value = customValue;
            refs.textInput.placeholder = effectiveValue;
            refs.swatch.style.backgroundColor = effectiveValue;
            refs.state.textContent = customValue ? 'Custom' : 'Default';
            refs.wrapper.classList.remove('is-invalid');
        }
    });
}

function updateRangePreview(key, previewEl, value) {
    if (!previewEl) return;

    if (key === 'darkModeBrightness') {
        const previewIsDark = currentSettings.darkMode;
        previewEl.style.backgroundColor = previewIsDark ? '#111827' : '#f8fafc';
        previewEl.style.color = previewIsDark ? '#f8fafc' : '#0f172a';
        previewEl.style.filter = previewIsDark ? `brightness(${value})` : 'brightness(1)';
        previewEl.textContent = previewIsDark ? 'Dark mode preview' : 'Enable dark mode to preview';
        return;
    }

    if (key === 'textScale') {
        previewEl.style.backgroundColor = getEffectiveColorValue('mainBackground');
        previewEl.style.color = getEffectiveColorValue('mainText');
        previewEl.style.fontSize = `${value}rem`;
        previewEl.style.filter = 'none';
        previewEl.textContent = 'Readable in motion';
    }
}

function refreshContrastWarnings() {
    if (!contrastWarningEl) return;

    const problems = contrastPairDefinitions.flatMap(pair => {
        const background = getEffectiveColorValue(pair.bgKey);
        const text = getEffectiveColorValue(pair.textKey);
        const ratio = calculateContrastRatio(background, text);
        const refs = [controlRefs.get(pair.bgKey), controlRefs.get(pair.textKey)].filter(Boolean);
        const hasWarning = ratio < 4.5;

        refs.forEach(ref => ref.wrapper.classList.toggle('has-contrast-warning', hasWarning));

        if (!hasWarning) return [];

        return [{
            label: pair.label,
            ratio
        }];
    });

    if (!problems.length) {
        contrastWarningEl.classList.add('hidden');
        contrastWarningEl.innerHTML = '';
        return;
    }

    contrastWarningEl.classList.remove('hidden');
    contrastWarningEl.innerHTML = `
        <strong>Contrast warning</strong>
        <ul class="settings-warning-list">
            ${problems.map(problem => `<li>${problem.label} Current contrast: ${problem.ratio.toFixed(2)}:1.</li>`).join('')}
        </ul>
    `;
}

function getEffectiveColorValue(key) {
    const colorValue = currentSettings.colors[key];
    if (colorValue) return colorValue;

    if (key === 'mainBackground') {
        return currentSettings.darkMode ? '#111827' : '#ffffff';
    }
    if (key === 'mainText') {
        return currentSettings.darkMode ? '#e5e7eb' : '#1f2937';
    }
    if (key === 'categoryBackground') {
        return currentSettings.darkMode ? '#111827' : '#ffffff';
    }
    if (key === 'categoryText') {
        return currentSettings.darkMode ? '#bfdbfe' : '#1d4ed8';
    }
    if (key === 'warnings') {
        return currentSettings.darkMode ? '#f87171' : '#ef4444';
    }
    if (key === 'popupComments') {
        return currentSettings.darkMode ? '#22c55e' : '#2563eb';
    }
    if (key === 'popups') {
        return currentSettings.darkMode ? '#93c5fd' : '#2563eb';
    }
    return '#ffffff';
}

function announceStatus(message) {
    if (!liveStatusEl) return;

    clearTimeout(settingsStatusTimer);
    liveStatusEl.textContent = message;
    settingsStatusTimer = setTimeout(() => {
        liveStatusEl.textContent = '';
    }, SETTINGS_STATUS_CLEAR_DELAY_MS);
}

function setOrRemoveStyleVar(style, name, value) {
    if (value) {
        style.setProperty(name, value);
    } else {
        style.removeProperty(name);
    }
}

function removeStyleVars(style, names) {
    names.forEach(name => style.removeProperty(name));
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function normalizeColorValue(value) {
    if (!value) return '';

    const parser = document.createElement('span');
    parser.style.color = '';
    parser.style.color = String(value).trim();
    if (!parser.style.color) {
        return '';
    }

    document.body.appendChild(parser);
    const computedColor = getComputedStyle(parser).color;
    parser.remove();

    const rgb = parseRgbString(computedColor);
    return rgb ? rgbToHex(rgb) : '';
}

function parseRgbString(value) {
    const match = String(value).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return null;

    return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3])
    };
}

function hexToRgb(hex) {
    const normalized = String(hex || '').replace('#', '').trim();
    if (!/^[\da-f]{6}$/i.test(normalized)) return null;

    return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16)
    };
}

function rgbToHex(rgb) {
    const toHex = channel => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0');
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function rgbToCss(rgb) {
    return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
}

function createSolidSurfacePalette(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) {
        return {
            background: hex,
            accent: hex,
            border: hex
        };
    }

    const accent = getRelativeLuminance(rgb) > 0.45 ? darkenColor(rgb, 0.08) : lightenColor(rgb, 0.1);
    const border = getRelativeLuminance(rgb) > 0.45 ? darkenColor(rgb, 0.16) : lightenColor(rgb, 0.2);

    return {
        background: hex,
        accent: rgbToCss(accent),
        border: rgbToCss(border)
    };
}

function createTintedPalette(hex, isDarkMode) {
    const rgb = hexToRgb(hex);
    if (!rgb) {
        return {
            accent: hex,
            background: hex,
            border: hex,
            text: currentSettings.darkMode ? LIGHT_TEXT_HEX : DARK_TEXT_HEX,
            muted: currentSettings.darkMode ? 'rgba(248, 250, 252, 0.7)' : 'rgba(15, 23, 42, 0.7)',
            surface: hex
        };
    }

    const blendTarget = hexToRgb(isDarkMode ? DARK_SURFACE_HEX : LIGHT_SURFACE_HEX);
    const background = blendColor(rgb, blendTarget, isDarkMode ? 0.68 : 0.84);
    const surface = blendColor(rgb, blendTarget, isDarkMode ? 0.58 : 0.92);
    const border = blendColor(rgb, blendTarget, isDarkMode ? 0.44 : 0.68);
    const text = pickReadableText(rgbToHex(background));

    return {
        accent: hex,
        background: rgbToCss(background),
        border: rgbToCss(border),
        text,
        muted: text === LIGHT_TEXT_HEX ? 'rgba(248, 250, 252, 0.72)' : 'rgba(15, 23, 42, 0.72)',
        surface: rgbToCss(surface)
    };
}

function blendColor(source, target, amount) {
    const clampedAmount = clamp(amount, 0, 1);
    return {
        r: source.r + ((target.r - source.r) * clampedAmount),
        g: source.g + ((target.g - source.g) * clampedAmount),
        b: source.b + ((target.b - source.b) * clampedAmount)
    };
}

function lightenColor(rgb, amount) {
    return blendColor(rgb, { r: 255, g: 255, b: 255 }, amount);
}

function darkenColor(rgb, amount) {
    return blendColor(rgb, { r: 0, g: 0, b: 0 }, amount);
}

function pickReadableText(backgroundHex) {
    const darkContrast = calculateContrastRatio(backgroundHex, DARK_TEXT_HEX);
    const lightContrast = calculateContrastRatio(backgroundHex, LIGHT_TEXT_HEX);
    return lightContrast >= darkContrast ? LIGHT_TEXT_HEX : DARK_TEXT_HEX;
}

function calculateContrastRatio(colorA, colorB) {
    const rgbA = hexToRgb(normalizeColorValue(colorA));
    const rgbB = hexToRgb(normalizeColorValue(colorB));
    if (!rgbA || !rgbB) return 21;

    const luminanceA = getRelativeLuminance(rgbA);
    const luminanceB = getRelativeLuminance(rgbB);
    const lighter = Math.max(luminanceA, luminanceB);
    const darker = Math.min(luminanceA, luminanceB);
    return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(rgb) {
    const linear = value => {
        const normalized = value / 255;
        return normalized <= 0.03928
            ? normalized / 12.92
            : ((normalized + 0.055) / 1.055) ** 2.4;
    };

    return (0.2126 * linear(rgb.r)) + (0.7152 * linear(rgb.g)) + (0.0722 * linear(rgb.b));
}
