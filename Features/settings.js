// Features/settings.js – Settings panel (dark mode toggle, etc.)

const settingsButtonEl = document.getElementById('settings-button');
const settingsPanelEl = document.getElementById('settings-panel');
const closeSettingsButton = document.getElementById('close-settings-button');
const darkModeToggle = document.getElementById('dark-mode-toggle');
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

if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
    if (darkModeToggle) darkModeToggle.checked = true;
    // Apply previously saved brightness level; default to 1 if invalid
    const brightnessVal = !isNaN(savedBrightness) ? savedBrightness : 1;
    document.documentElement.style.setProperty('--brightness', brightnessVal);
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
        if (document.body.classList.contains('dark-mode')) {
            preview.style.backgroundColor = '#111827';
            preview.style.color           = '#f9fafb';
            preview.style.filter          = `brightness(${val})`;
        } else {
            preview.style.backgroundColor = '#f9fafb';
            preview.style.color           = '#1f2937';
            preview.style.filter          = 'brightness(1)';
        }
    }

    slider.addEventListener('input', () => {
        const val = parseFloat(slider.value);
        if (document.body.classList.contains('dark-mode')) {
            document.documentElement.style.setProperty('--brightness', val);
            localStorage.setItem('darkModeBrightness', val.toString());
        }
        updatePreview(val);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(slider);
    wrapper.appendChild(preview);

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
