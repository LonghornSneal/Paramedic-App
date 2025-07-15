/* Features/navigation/settings.js
 * Manages the Settings button and panel (including dark mode toggle).
 * The Settings button in the footer blinks between two colors (see CSS animation).
 * Clicking the Settings button opens a modal panel with user settings.
 * Currently includes a Dark Mode toggle which persists across sessions.
 */

// Get references to relevant DOM elements

const settingsButton = document.getElementById('settings-button');
const settingsPanel = document.getElementById('settings-panel');
const closeSettingsButton = document.getElementById('close-settings-button');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const overlay = document.getElementById('sidebar-overlay');
const patientSidebarEl = document.getElementById('patient-sidebar');

// Load any saved dark mode preference and apply it on startup
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle?.checked = true;
}

// Open the Settings panel when the Settings button is clicked
settingsButton?.addEventListener('click', () => {
    // If the Patient Info sidebar is open, close it to avoid overlap
    if (patientSidebarEl?.classList.contains('open')) {
        patientSidebarEl.classList.remove('open');
        setTimeout(() => patientSidebarEl?.classList.add('hidden'), 300);
    }
    // Show the Settings panel and overlay
    settingsPanel?.classList.remove('hidden');
    overlay?.classList.add('active');
    overlay?.classList.remove('hidden');
});

// Close the Settings panel when the close (X) button is clicked
closeSettingsButton?.addEventListener('click', () => {
    settingsPanel?.classList.add('hidden');
    overlay?.classList.remove('active');
    overlay?.classList.add('hidden');
});
//    /darkModeToggle.checked = true;
//if (settingsButton) { addTapListener(settingsButton, () => {
//        if (patientSidebarEl && patientSidebarEl.classList.contains('open')) { patientSidebarEl.classList.remove('open'); setTimeout(() => patientSidebarEl.classList.add('hidden'), 300); }
//        if (settingsPanel) { settingsPanel.classList.remove('hidden'); }
//        if (overlay) { overlay.classList.add('active'); overlay.classList.remove('hidden'); } }); }

// Close the Settings panel when the close (X) button is clicked
//if (closeSettingsButton) { addTapListener(closeSettingsButton, () => { if (settingsPanel) { settingsPanel.classList.add('hidden'); }
//        if (overlay) { overlay.classList.remove('active'); overlay.classList.add('hidden'); } }); }

// Toggle Dark Mode on or off when the checkbox is changed
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    });
}
