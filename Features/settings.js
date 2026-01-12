// Features/settings.js – Settings panel (dark mode toggle, etc.)

const settingsButtonEl = document.getElementById('settings-button');
const settingsPanelEl = document.getElementById('settings-panel');
const closeSettingsButton = document.getElementById('close-settings-button');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const devOverlayToggle = document.getElementById('dev-overlay-toggle');
const overlayEl = document.getElementById('sidebar-overlay');
const patientSidebarEl = document.getElementById('patient-sidebar');

// Apply a bubbly font to the Settings button.  Without this, the button
// retains the default font.  See README task "Settings Button Font."
if (settingsButtonEl) {
    settingsButtonEl.style.fontFamily = `'Comic Sans MS', 'Comic Sans', cursive`;
}

// Apply saved dark mode preference on startup
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    if (darkModeToggle) darkModeToggle.checked = true;
}

const savedDevOverlay = localStorage.getItem('devOverlay');
if (devOverlayToggle) {
    devOverlayToggle.checked = savedDevOverlay !== 'false';
}
if (typeof window.setDevOverlayVisible === 'function' && devOverlayToggle) {
    window.setDevOverlayVisible(devOverlayToggle.checked);
}

// Open Settings panel when Settings button is clicked
settingsButtonEl?.addEventListener('click', () => {
    // If patient sidebar is open, close it first
    if (patientSidebarEl?.classList.contains('open')) {
        patientSidebarEl.classList.remove('open');
        setTimeout(() => patientSidebarEl.classList.add('hidden'), 300);
    }
    // Show settings panel and overlay
    settingsPanelEl?.classList.remove('hidden');
    overlayEl?.classList.add('active');
    overlayEl?.classList.remove('hidden');
});

// Close Settings panel when close (X) is clicked
closeSettingsButton?.addEventListener('click', () => {
    settingsPanelEl?.classList.add('hidden');
    overlayEl?.classList.remove('active');
    overlayEl?.classList.add('hidden');
});

// Dark mode preference
const savedDarkMode   = localStorage.getItem('darkMode');
const savedBrightness = parseFloat(localStorage.getItem('darkModeBrightness'));

// Set brightness variable from saved preference (applies when dark mode is toggled on)
document.documentElement.style.setProperty('--brightness', (!isNaN(savedBrightness) ? savedBrightness : 1));
if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
    if (darkModeToggle) darkModeToggle.checked = true;
}

darkModeToggle?.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
        // ensure brightness persists
        const currentBrightness = parseFloat(localStorage.getItem('darkModeBrightness'));
        const val = !isNaN(currentBrightness) ? currentBrightness : 1;
        document.documentElement.style.setProperty('--brightness', val);
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
});

devOverlayToggle?.addEventListener('change', () => {
    const enabled = devOverlayToggle.checked;
    localStorage.setItem('devOverlay', enabled ? 'true' : 'false');
    if (typeof window.setDevOverlayVisible === 'function') {
        window.setDevOverlayVisible(enabled);
    }
});
function createBrightnessControl() {
    if (!settingsPanelEl) return;
    // Create wrapper and label
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-4';

    const label = document.createElement('label');
    label.textContent = 'Dark Mode Brightness';
    label.className   = 'block font-semibold mb-1';
    label.htmlFor     = 'brightness-slider';

    const slider = document.createElement('input');
    slider.type  = 'range';
    slider.id    = 'brightness-slider';
    slider.min   = '0.5';
    slider.max   = '1.5';
    slider.step  = '0.05';
    slider.value = (!isNaN(savedBrightness) ? savedBrightness : 1).toString();
    slider.className = 'w-full';

    // Preview box
    const preview = document.createElement('div');
    preview.className  = 'brightness-preview mt-2 p-2 border rounded';
    preview.textContent = 'Preview';

    function updatePreview(val) {
        const dm = document.body.classList.contains('dark-mode');
        preview.style.backgroundColor = dm ? '#111827' : '#f9fafb';
        preview.style.color           = dm ? '#f9fafb' : '#1f2937';
        preview.style.filter          = dm ? `brightness(${val})` : 'brightness(1)';
    }

    slider.addEventListener('input', () => {
        const val = parseFloat(slider.value);
        // Always update root variable so dark mode immediately reflects changes
        document.documentElement.style.setProperty('--brightness', val);
        localStorage.setItem('darkModeBrightness', val.toString());
        updatePreview(val);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(slider);
    wrapper.appendChild(preview);
    // Initialize preview to the current slider value
    updatePreview(parseFloat(slider.value));

    // Insert after the dark mode toggle container
    const darkModeContainer = darkModeToggle?.parentElement;
    if (darkModeContainer) {
        darkModeContainer.parentElement?.insertBefore(wrapper, darkModeContainer.nextSibling);
    } else {
        settingsPanelEl.appendChild(wrapper);
    }
}

// Create brightness control on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBrightnessControl);
} else {
    createBrightnessControl();
}
