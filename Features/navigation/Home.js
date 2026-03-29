// Features/navigation/Home.js - Home button handler
// This script manages the Home button which returns the user to the main contents (home) view.
// It resets any expanded categories and navigates to the top-level list when the Home button is clicked.
import { addTapListener } from '../../Utils/addTapListener.js';
import { renderInitialView } from '../list/ListView.js';

// Handles the Home button click: clears search, resets list, and navigates to the main contents page.
function handleHomeClick() {
    // Clear any search query and re-render the current branch-aware list state.
    if (window.searchInput) {
        window.searchInput.value = '';
    }
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
