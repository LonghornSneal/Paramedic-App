// Features/navigation/Navigation.js
// Manages navigation history and Back/Forward button functionality (migrated from main.js).

// Navigation history state variables
let navigationHistory = [];
let currentHistoryIndex = -1;
let isNavigatingViaHistory = false;

// Updates the disabled state of the Back/Forward navigation buttons based on history position. 
function updateNavButtonsState() {
    if (!navBackButton || !navForwardButton) return;
    navBackButton.disabled = currentHistoryIndex <= 0;
    navForwardButton.disabled = currentHistoryIndex >= navigationHistory.length - 1;
}  

// Adds a new entry to the navigation history and updates the current history index.
function addHistoryEntry(entry) {
    if (isNavigatingViaHistory) return;
    if (currentHistoryIndex < navigationHistory.length - 1) {
        navigationHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
    }
    navigationHistory.push(entry);
    currentHistoryIndex = navigationHistory.length - 1;
    updateNavButtonsState();
}  

// Moves through navigation history by the given direction (-1 for Back, 1 for Forward) and renders the appropriate view.
function navigateViaHistory(direction) {
    if ((direction === -1 && currentHistoryIndex <= 0) || (direction === 1 && currentHistoryIndex >= navigationHistory.length - 1)) return;
    isNavigatingViaHistory = true;
    currentHistoryIndex += direction;
    const state = navigationHistory[currentHistoryIndex];
    if (state.viewType === 'list') {
        // Highlight last-viewed topic when navigating Back
        if (direction === -1 && navigationHistory[currentHistoryIndex+1]?.viewType === 'detail') {
            const prevTopicId = navigationHistory[currentHistoryIndex+1].contentId;
            const prevCatPath = allDisplayableTopicsMap[prevTopicId]?.categoryPath || [];
            searchInput.value = '';
            handleSearch(false, prevTopicId, prevCatPath);
        } else {
            searchInput.value = state.contentId || '';
            handleSearch(false, state.highlightTopicId, state.categoryPath || []);
        }
    } else if (state.viewType === 'detail') {
        renderDetailPage(state.contentId, false, false);
    }
    updateNavButtonsState();
    isNavigatingViaHistory = false;
}  

// Attaches event listeners to the Back and Forward navigation arrow buttons.
function attachNavHandlers() {
    if (!navBackButton || !navForwardButton) return;
    addTapListener(navBackButton, () => navigateViaHistory(-1));
    addTapListener(navForwardButton, () => navigateViaHistory(1));
}  
