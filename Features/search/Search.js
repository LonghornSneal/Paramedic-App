// Features/search/Search.js

// Global list of all topics (by title/path) for quick search filtering:
let allSearchableTopics = [];

// Recursively processes categories and topics to build search index and lookup map (moved from main.js):
function processItem(item, parentPath = '', parentIds = []) {
    // Construct the full path of this item (e.g., "Category > Subcategory > Topic")
    let currentPath = parentPath ? parentPath + ' > ' + item.title : item.title;
    let currentIds = (item.type === 'category') ? parentIds.concat(item.id) : parentIds;
    const detailsObj = medicationDataMap[item.id];  // associated details (if any) from MedicationDetailsData

    // Create a full item object with path and details, and add it to the display map
    const fullItem = {
        ...item,
        path: currentPath,
        details: detailsObj || null,
        categoryPath: parentIds
    };
    allDisplayableTopicsMap[item.id] = fullItem;  // Use the global map from main.js

    // If this is a final topic (not a category), add it to the searchable topics index
    if (item.type === 'topic') {
        allSearchableTopics.push({
            id: item.id,
            title: item.title,
            path: currentPath,
            categoryPath: parentIds
        });
    }

    // Recurse into children if any (for nested categories)
    if (item.children) {
        item.children.forEach(child => processItem(child, currentPath, currentIds));
    }
}

// Handles the search input: filters topics by the current search term and shows results (or full list if empty).
function handleSearch(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    const term = searchInput.value.trim().toLowerCase();
    if (!term) {
        // If no search term, show the full list (return to main view) with any requested highlight
        renderInitialView(false, highlightId, categoryPath); 
        return;
    }
    // Filter the list of all searchable topics by the search term (case-insensitive match in title or path)
    const results = allSearchableTopics.filter(topic =>
        (topic.title || topic.id || '').toLowerCase().includes(term) ||
        (topic.path || '').toLowerCase().includes(term)
    );
    // Render the filtered results in the content area
    renderSearchResults(results, term, shouldAddHistory, highlightId, categoryPath);
}

// Renders the list of topics matching the given search term in the content area.
function renderSearchResults(filteredTopics, searchTerm, shouldAddHistory = true, highlightId = null, categoryPath = []) {
    if (shouldAddHistory) {
        addHistoryEntry({ 
            viewType: 'list', contentId: searchTerm, highlightTopicId: highlightId, categoryPath 
        });
    }
    updateNavButtonsState();  // refresh back/forward button state

    // Build the results header with the search term and a "Show All" clear option
    contentArea.innerHTML = `<div class="flex justify-between items-center mb-3">
        <p class="text-gray-700 font-medium">Results for "${escapeHTML(searchTerm)}":</p>
        <button id="clear-search-button" class="text-sm text-blue-600 hover:underline">Show All Categories</button>
    </div>
    <div id="results-container" class="space-y-2"></div>`;
    const resultsContainer = document.getElementById('results-container');

    // Populate the results list
    if (filteredTopics.length > 0) {
        filteredTopics.forEach(topic => {
            const item = document.createElement('div');
            item.className = 'search-topic-item';
            item.textContent = topic.title;
            if (topic.path) {
                // Add a small path subtitle (category hierarchy) under the title
                const pathEl = document.createElement('div');
                pathEl.className = 'text-xs text-gray-500 mt-1';
                pathEl.textContent = topic.path.split(' > ').slice(0, -1).join(' > ');
                item.appendChild(pathEl);
            }
            // Mark the item with the topic ID for identification and accessibility
            item.dataset.topicId = topic.id;
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            // Clicking or pressing "Enter/Space" on a result navigates to that topic's detail page
            addTapListener(item, () => renderDetailPage(topic.id));
            item.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    renderDetailPage(topic.id);
                }
            });
            resultsContainer.appendChild(item);
        });
    } else {
        // If no topics match the search, show a friendly "no results" message
        resultsContainer.innerHTML = 
            '<p class="text-gray-500 text-center py-4">No topics found matching your search.</p>';
    }

    // Attach handler to the "Show All Categories" button to clear the search and return to full list
    addTapListener(document.getElementById('clear-search-button'), () => {
        searchInput.value = '';
        renderInitialView();  // show the main category list again
    });
}

// Attaches event listeners to the search input for real-time filtering and enter-key search.
function attachSearchHandlers() {
    if (!searchInput) return;  // Ensure the search input element is available
    // Filter as the user types:
    searchInput.addEventListener('input', () => handleSearch(true));
    // Also trigger search when the user presses Enter in the search box:
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            handleSearch(true);
        }
    });
}
