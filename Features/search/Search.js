// Features/search/Search.js – Search functionality
import { addTapListener } from '../../Utils/addTapListener.js';
import { escapeHTML } from '../../Utils/escapeHTML.js';
import { renderInitialView } from '../list/ListView.js';
import { renderDetailPage } from '../detail/DetailPage.js';
import { addHistoryEntry, updateNavButtonsState } from '../navigation/Navigation.js';

let allSearchableTopics = [];

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
    if (item.type === 'topic') {
        allSearchableTopics.push({
            id: item.id,
            title: item.title,
            path: currentPath,
            categoryPath: parentIds
        });
    }
    if (item.children) {
        item.children.forEach(child => processItem(child, currentPath, currentIds));
    }
}

function renderSearchResults(filteredTopics, searchTerm, shouldAddHistory = true, highlightId = null, categoryPath = []) {
    if (shouldAddHistory) {
        addHistoryEntry({
            viewType: 'list',
            contentId: searchTerm,
            highlightTopicId: highlightId,
            categoryPath
        });
    }
    updateNavButtonsState();
    const contentArea = window.contentArea || document.getElementById('content-area');
    contentArea.classList.remove('detail-space', 'detail-space-anaphylaxis');
    contentArea.innerHTML = `<div class="flex justify-between items-center mb-3">
        <p class="text-gray-700 font-medium">Results for "${escapeHTML(searchTerm)}":</p>
        <button id="clear-search-button" class="text-sm text-blue-600 hover:underline">Show All Categories</button>
    </div>
    <div id="results-container" class="space-y-2"></div>`;
    const resultsContainer = document.getElementById('results-container');
    if (filteredTopics.length > 0) {
        filteredTopics.forEach(topic => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'search-topic-item';
            itemDiv.textContent = topic.title;
            if (topic.path) {
                const pathEl = document.createElement('div');
                pathEl.className = 'text-xs text-gray-500 mt-1';
                pathEl.textContent = topic.path.split(' > ').slice(0, -1).join(' > ');
                itemDiv.appendChild(pathEl);
            }
            itemDiv.dataset.topicId = topic.id;
            itemDiv.setAttribute('role', 'button');
            itemDiv.setAttribute('tabindex', '0');
            // Clicking or pressing Enter/Space navigates to detail
            addTapListener(itemDiv, () => renderDetailPage(topic.id));
            itemDiv.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    renderDetailPage(topic.id);
                }
            });
            resultsContainer.appendChild(itemDiv);
        });
    } else {
        resultsContainer.innerHTML = 
            '<p class="text-gray-500 text-center py-4">No topics found matching your search.</p>';
    }
    // "Show All" button to clear search
    addTapListener(document.getElementById('clear-search-button'), () => {
        window.searchInput.value = '';
        renderInitialView();  // show full list again
    });
}

// Perform a search based on the current input value
export function handleSearch(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    const term = window.searchInput.value.trim().toLowerCase();
    if (!term) {
        // If no search term, restore the full list view
        renderInitialView(false, highlightId, categoryPath);
        return;
    }
    const results = allSearchableTopics.filter(topic =>
        (topic.title || topic.id).toLowerCase().includes(term) ||
        (topic.path || '').toLowerCase().includes(term)
    );
    renderSearchResults(results, term, shouldAddHistory, highlightId, categoryPath);
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
