// Features/History.js – History panel functionality
import { navigationHistory } from './navigation/Navigation.js';
import { addTapListener } from '../Utils/addTapListener.js';
import { renderDetailPage } from './detail/DetailPage.js';

const historyButton = document.getElementById('history-button');
const historyPanel = document.getElementById('history-panel');
const closeHistoryButton = document.getElementById('close-history-button');
const patientSidebarEl = document.getElementById('patient-sidebar');
const settingsPanelEl = document.getElementById('settings-panel');
const overlay = document.getElementById('sidebar-overlay');

function populateHistoryList() {
    const historyListEl = document.getElementById('history-list');
    historyListEl.innerHTML = '';
    // List detail-view history entries in order
    navigationHistory.forEach(entry => {
        if (entry.viewType !== 'detail') return;
        const topic = window.allDisplayableTopicsMap?.[entry.contentId];
        if (!topic) return;
        const itemLink = document.createElement('a');
        itemLink.href = '#';
        itemLink.textContent = topic.title;
        itemLink.className = 'block text-blue-600 hover:underline cursor-pointer';
        addTapListener(itemLink, () => {
            renderDetailPage(entry.contentId);
            historyPanel.classList.add('hidden');
            overlay.classList.remove('active');
            overlay.classList.add('hidden');
        });
        historyListEl.appendChild(itemLink);
    });
}

// Show history panel on History button click
historyButton?.addEventListener('click', () => {
    // Close Patient Info sidebar or Settings panel if open
    if (patientSidebarEl?.classList.contains('open')) {
        patientSidebarEl.classList.remove('open');
        setTimeout(() => patientSidebarEl.classList.add('hidden'), 200);
    }
    if (!settingsPanelEl?.classList.contains('hidden')) {
        settingsPanelEl.classList.add('hidden');
    }
    populateHistoryList();
    historyPanel?.classList.remove('hidden');
    overlay?.classList.add('active');
    overlay?.classList.remove('hidden');
});

// Hide history panel on close (X) button click
closeHistoryButton?.addEventListener('click', () => {
    historyPanel?.classList.add('hidden');
    overlay?.classList.remove('active');
    overlay?.classList.add('hidden');
});
