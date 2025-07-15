// Features/navigation/Home.js – Home button event handling**
// This script manages the Home button which returns the user to the main contents (home) view.**
// It resets any expanded categories and navigates to the top-level list when the Home button is clicked.**
function collapseAllCategories() {
    // Recursively collapse all expanded categories in the main topics list**
    if (!Array.isArray(paramedicCategories)) return;
    const collapseItem = (item) => {
        if (item.type === 'category') {
            item.expanded = false;  // collapse this category**
            if (item.children) {
                item.children.forEach(child => collapseItem(child));
            }
        }
    };
    paramedicCategories.forEach(item => collapseItem(item));
}

// Handles the Home button click: clears search, resets list, and navigates to the main contents page.**
function handleHomeClick() {
    // Clear any search query and collapse all categories to default state**
    searchInput.value = '';
    collapseAllCategories();
    // Render the main category list view anew and add a new history entry for this "Home" navigation**
    renderInitialView(true);
}

// Attaches the click/tap listener to the Home button element.**
function attachHomeHandler() {
    if (!navHomeButton) return;  // Ensure the Home button exists**
    addTapListener(navHomeButton, () => handleHomeClick());
}
