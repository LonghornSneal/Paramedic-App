// Features/navigation/Navigation.js
// Manages navigation history and Back/Forward button functionality (migrated from main.js).

// Import needed functions at the top:
 import { addTapListener } from '../../Utils/addTapListener.js';
// Import needed functions at the top:
import { renderDetailPage } from '../detail/DetailPage.js';
//import { addTapListener } from '../Utils/addTapListener.js';
// Navigation history state variables
export let navigationHistory = [];
export let currentHistoryIndex = -1;
let isNavigatingViaHistory = false;

// Updates the disabled state of the Back/Forward navigation buttons based on history position. 
export function updateNavButtonsState() {
    if (!window.navBackButton || !window.navForwardButton) return;
    window.navBackButton.disabled = currentHistoryIndex <= 0;
    window.navForwardButton.disabled = currentHistoryIndex >= navigationHistory.length - 1;
}  

// Adds a new entry to the navigation history and updates the current history index.
export function addHistoryEntry(entry) {
    if (isNavigatingViaHistory) return;
    if (currentHistoryIndex < navigationHistory.length - 1) {
        navigationHistory.splice(currentHistoryIndex + 1);
    }
    navigationHistory.push(entry);
    currentHistoryIndex = navigationHistory.length - 1;
    updateNavButtonsState();
}  

// Navigate history (Back/Forward)
export function navigateViaHistory(direction) {
    if ((direction === -1 && currentHistoryIndex <= 0) || 
        (direction === 1 && currentHistoryIndex >= navigationHistory.length - 1)) {
        return;
    }
    isNavigatingViaHistory = true;
    currentHistoryIndex += direction;
    const state = navigationHistory[currentHistoryIndex];
    if (state.viewType === 'list') {
        // If going back from a detail view, highlight that topic in list
        if (direction === -1 && navigationHistory[currentHistoryIndex+1]?.viewType === 'detail') {
            const prevTopicId = navigationHistory[currentHistoryIndex+1].contentId;
            const prevCatPath = window.allDisplayableTopicsMap?.[prevTopicId]?.categoryPath || [];
            window.searchInput.value = '';  // clear search
            window.handleSearch(false, prevTopicId, prevCatPath);  // will import handleSearch later
        } else {
            window.searchInput.value = state.contentId || '';
            window.handleSearch(false, state.highlightTopicId, state.categoryPath || []);
        }
    } else if (state.viewType === 'detail') {
        renderDetailPage(state.contentId, false, false);
    }
    updateNavButtonsState();
    isNavigatingViaHistory = false;
}

// Attaches event listeners to the Back and Forward navigation arrow buttons.
export function attachNavHandlers() {
    if (!window.navBackButton || !window.navForwardButton) return;
    addTapListener(window.navBackButton, () => navigateViaHistory(-1));
    addTapListener(window.navForwardButton, () => navigateViaHistory(1));
};


// Temporary global exposure (optional)
if (typeof window !== 'undefined') {
    window.addHistoryEntry = addHistoryEntry;
    window.navigateViaHistory = navigateViaHistory;
}

