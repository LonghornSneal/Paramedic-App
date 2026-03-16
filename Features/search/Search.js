// Features/search/Search.js – Search functionality
import { renderInitialView } from '../list/ListView.js';
import { addHistoryEntry, updateNavButtonsState } from '../navigation/Navigation.js';

// Build the searchable index (called during data initialization in main.js)
export function processItem(item, parentPath = '', parentIds = []) {
    let currentPath = parentPath ? parentPath + ' > ' + item.title : item.title;
    let currentIds = (item.type === 'category') ? parentIds.concat(item.id) : parentIds;
    const medDetails = window.medicationDataMap?.[item.id] || null;
    const itemDetails = item.details ? { ...(item.details || {}) } : null;
    const combinedDetails = medDetails
        ? { ...(itemDetails || {}), ...medDetails }
        : itemDetails;
    const fullItem = {
        ...item,
        path: currentPath,
        details: combinedDetails,
        categoryPath: parentIds
    };
    window.allDisplayableTopicsMap[item.id] = fullItem;
    if (item.children) {
        item.children.forEach(child => processItem(child, currentPath, currentIds));
    }
}

function renderSearchResults(searchTerm, shouldAddHistory = true, highlightId = null, categoryPath = []) {
    if (shouldAddHistory && searchTerm) {
        addHistoryEntry({
            viewType: 'list',
            contentId: searchTerm,
            highlightTopicId: highlightId,
            categoryPath
        });
    }
    updateNavButtonsState();
    renderInitialView(false, highlightId, categoryPath);
}

// Perform a search based on the current input value
export function handleSearch(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    const term = window.searchInput.value.trim().toLowerCase();
    if (!term) {
        // If no search term, restore the full list view
        renderInitialView(false, highlightId, categoryPath);
        return;
    }
    renderSearchResults(term, shouldAddHistory, highlightId, categoryPath);
}

// Attach event listeners to the search input field
export function attachSearchHandlers() {
    if (!window.searchInput) return;
    // Typing should NOT push to navigation history
    window.searchInput.addEventListener('input', () => handleSearch(false));
    // Pressing Enter records the search in history
    window.searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(true);
        }
    });
}

// Global exposure for compatibility with Navigation (navigateViaHistory expects window.handleSearch)
if (typeof window !== 'undefined') {
    window.handleSearch = (shouldAddHistory = true, highlightId = null, categoryPath = []) => 
        handleSearch(shouldAddHistory, highlightId, categoryPath);
}
