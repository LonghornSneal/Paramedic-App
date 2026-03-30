// Features/navigation/Home.js - Home button handler
// This script manages the Home button which returns the user to the main contents (home) view.
// It resets any expanded categories and navigates to the top-level list when the Home button is clicked.
import { addTapListener } from '../../Utils/addTapListener.js';
import { renderInitialView } from '../list/ListView.js';

function collapseAllCategories() {
    if (!Array.isArray(window.paramedicCategories)) return;
    const collapseItem = (item) => {
        if (item.type === 'category') {
            item.expanded = false;
            if (Array.isArray(item.children)) {
                item.children.forEach(collapseItem);
            }
        }
    };
    window.paramedicCategories.forEach(collapseItem);
}

// Handles the Home button click: clears search, resets list, and navigates to the main contents page.
function handleHomeClick() {
    if (window.searchInput) {
        window.searchInput.value = '';
    }
    window.setCommittedSearchTerm?.('');
    window.hideSearchSuggestions?.();
    collapseAllCategories();
    renderInitialView(true);
    window.queueNavBranchSync?.('home');
}

// Attaches the click/tap listener to the Home button element.
export function attachHomeHandler() {
    if (!window.navHomeButton) return;  // Ensure the Home button exists
    addTapListener(window.navHomeButton, () => handleHomeClick());
}

if (typeof window !== 'undefined') {
    window.attachHomeHandler = attachHomeHandler;
}
