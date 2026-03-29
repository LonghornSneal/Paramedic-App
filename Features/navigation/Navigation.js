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

function normalizeEntry(entry) {
    return {
        viewType: entry?.viewType || 'list',
        contentId: entry?.contentId || '',
        highlightTopicId: entry?.highlightTopicId || null,
        categoryPath: Array.isArray(entry?.categoryPath) ? [...entry.categoryPath] : []
    };
}

function entriesMatch(left, right) {
    if (!left || !right) return false;
    if (left.viewType !== right.viewType) return false;
    if (left.contentId !== right.contentId) return false;
    if (left.highlightTopicId !== right.highlightTopicId) return false;
    if (left.categoryPath.length !== right.categoryPath.length) return false;
    return left.categoryPath.every((value, index) => value === right.categoryPath[index]);
}

// Updates the disabled state of the Back/Forward navigation buttons based on history position. 
export function updateNavButtonsState() {
    if (!window.navBackButton || !window.navForwardButton) return;
    window.navBackButton.disabled = currentHistoryIndex <= 0;
    window.navForwardButton.disabled = currentHistoryIndex >= navigationHistory.length - 1;
}  

// Adds a new entry to the navigation history and updates the current history index.
export function addHistoryEntry(entry) {
    if (isNavigatingViaHistory) return;
    const normalized = normalizeEntry(entry);
    const currentEntry = navigationHistory[currentHistoryIndex];
    if (entriesMatch(currentEntry, normalized)) {
        updateNavButtonsState();
        return;
    }
    if (currentHistoryIndex < navigationHistory.length - 1) {
        navigationHistory.splice(currentHistoryIndex + 1);
    }
    navigationHistory.push(normalized);
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
        const searchTerm = state.contentId || '';
        const adjacentState = navigationHistory[currentHistoryIndex + (direction === -1 ? 1 : -1)];
        const detailTopic = adjacentState?.viewType === 'detail'
            ? window.allDisplayableTopicsMap?.[adjacentState.contentId] || null
            : null;
        const highlightTopicId = detailTopic?.id || state.highlightTopicId || null;
        const categoryPath = Array.isArray(detailTopic?.categoryPath) && detailTopic.categoryPath.length
            ? detailTopic.categoryPath
            : (state.categoryPath || []);
        if (window.searchInput) {
            window.searchInput.value = searchTerm;
        }
        if (searchTerm) {
            window.handleSearch(false, highlightTopicId, categoryPath);
        } else if (typeof window.renderInitialView === 'function') {
            window.renderInitialView(false, highlightTopicId, categoryPath);
        }
    } else if (state.viewType === 'detail') {
        renderDetailPage(state.contentId, false, false);
    }
    updateNavButtonsState();
    window.queueNavBranchSync?.('history-navigation');
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
    if (!Object.getOwnPropertyDescriptor(window, 'navigationHistory')) {
        Object.defineProperty(window, 'navigationHistory', {
            configurable: true,
            get: () => navigationHistory
        });
    }
    if (!Object.getOwnPropertyDescriptor(window, 'currentHistoryIndex')) {
        Object.defineProperty(window, 'currentHistoryIndex', {
            configurable: true,
            get: () => currentHistoryIndex
        });
    }
}

/*
  Features/navigation/Navigation.js
  Purpose: Back/Forward/Home nav state, history stack management, and event wiring for app navigation.

  Exposed:
  - addHistoryEntry(entry)
  - updateNavButtonsState()
  - attachNavHandlers()

  Tests:
  - Currently covered indirectly by Playwright E2E flows which navigate to detail pages and back.
  - No standalone unit tests for history stack manipulation yet.
*/
