// Features/settings.js – Settings panel (dark mode toggle, etc.)

const settingsButtonEl = document.getElementById('settings-button');
const settingsPanelEl = document.getElementById('settings-panel');
const closeSettingsButton = document.getElementById('close-settings-button');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const overlayEl = document.getElementById('sidebar-overlay');
const patientSidebarEl = document.getElementById('patient-sidebar');

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

// Toggle dark mode on checkbox change
darkModeToggle?.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
});
