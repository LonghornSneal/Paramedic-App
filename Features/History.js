// Features/History.js – Handles the History button and panel dropdown
import { renderDetailPage } from './Features/detail/DetailPage.js';
const historyButton = document.getElementById('history-button');
const historyPanel = document.getElementById('history-panel');
const closeHistoryButton = document.getElementById('close-history-button');
// /const sidebarOverlay = document.getElementById('sidebar-overlay');
const patientSidebarEl = document.getElementById('patient-sidebar');
const settingsPanelEl = document.getElementById('settings-panel');

// Populates the history list with clickable entries for each visited topic
function populateHistoryList() {
    const historyListEl = document.getElementById('history-list');
    historyListEl.innerHTML = '';  // Clear existing list
    // List items in reverse chronological order (most recent last in navigationHistory)
    navigationHistory.forEach(entry => {
        if (entry.viewType !== 'detail') return;  // only include detail page views
        const topic = allDisplayableTopicsMap[entry.contentId];
        if (!topic) return;
        const itemLink = document.createElement('a');
        itemLink.href = '#';
        itemLink.textContent = topic.title;
        itemLink.className = 'block text-blue-600 hover:underline cursor-pointer';
        // Clicking a history item navigates to that topic
        addTapListener(itemLink, () => {
            renderDetailPage(entry.contentId);
            historyPanel.classList.add('hidden');
            sidebarOverlay.classList.remove('active');
            sidebarOverlay.classList.add('hidden');
        });
        historyListEl.appendChild(itemLink);
    });
}

// Open the History panel when the History button is clicked
historyButton?.addEventListener('click', () => {
    // Close Patient Info sidebar or Settings panel if either is open
    if (patientSidebarEl?.classList.contains('open')) {
        patientSidebarEl.classList.remove('open');
        setTimeout(() => patientSidebarEl?.classList.add('hidden'), 200);
    }
    if (!settingsPanelEl?.classList.contains('hidden')) {
        settingsPanelEl?.classList.add('hidden');
    }
    populateHistoryList();
    historyPanel?.classList.remove('hidden');
    sidebarOverlay?.classList.add('active');
    sidebarOverlay?.classList.remove('hidden');
});

// Close the History panel when the close (X) button is clicked
closeHistoryButton?.addEventListener('click', () => {
    historyPanel?.classList.add('hidden');
    sidebarOverlay?.classList.remove('active');
    sidebarOverlay?.classList.add('hidden');
});
