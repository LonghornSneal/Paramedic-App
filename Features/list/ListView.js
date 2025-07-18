// Features/list/ListView.js – Category list rendering
//import './Features/navigation/Navigation.js';
//import './Features/detail/DetailPage.js';
//import './Utils/addTapListener'
import { addHistoryEntry, updateNavButtonsState } from '../navigation/Navigation.js';
import { renderDetailPage } from '../detail/DetailPage.js';
import { addTapListener } from '../../Utils/addTapListener.js'
// import { addHistoryEntry, updateNavButtonsState, attachNavHandlers } from './Features/navigation/Navigation.js';
// import { renderDetailPage } from './Features/detail/DetailPage.js';
// import { addTapListener } from '../../Utils/addTapListener.js';
// Renders the main category list view (home screen) and highlights a topic if provided.
export function renderInitialView(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    contentArea.innerHTML = '';  // Clear current content
    // Render the hierarchical list of all categories
    const listContainer = document.createElement('div');
    createHierarchicalList(window.paramedicCategories, listContainer, 0);
    contentArea.appendChild(listContainer);
    // Expand categories along path and highlight topic if provided
    openCategoriesAndHighlight(categoryPath, highlightId);
    if (shouldAddHistory) {
        addHistoryEntry({ 
            viewType: 'list', 
            contentId: '', 
            highlightTopicId: highlightId, 
            categoryPath 
        });
    }
    updateNavButtonsState();
}

// Expands categories along the given path and highlights the specified topic, then re-renders the list.
function openCategoriesAndHighlight(categoryPath = [], highlightId = null) {
    // Collapse or expand categories along the given path
    categoryPath.forEach(catId => { 
        const catItem = window.allDisplayableTopicsMap[catId];
        if (catItem) catItem.expanded = true; 
    });
    // Re-render list with updated expansion states
    contentArea.innerHTML = '';
    const listContainer = document.createElement('div');
    createHierarchicalList(window.paramedicCategories, listContainer, 0);
    contentArea.appendChild(listContainer);
    // Highlight the specified topic, if provided
    if (highlightId) { 
        const topicEl = contentArea.querySelector(`[data-topic-id="${highlightId}\"]`);
        if (topicEl) {
            topicEl.classList.add('recently-viewed'); 
            topicEl.scrollIntoView({ block: 'center' });
        }
    }
    // Scroll highlighted topic into view (if any)**
//    if (highlightId && topicEl) {
//        topicEl.scrollIntoView({ block: 'center' });
//    }
}

// Builds a nested list of categories and topics, appending it to the given container. Handles expandable categories.
function createHierarchicalList(items, container, level = 0) {
    container.innerHTML = '';
    items.forEach(item => { 
        const row = document.createElement('div');
        row.className = 'flex items-center py-1 pl-' + (level * 4) + ' group';
        if (item.type === 'category') {  // Category with collapsible children
            const arrowBtn = document.createElement('button');
            arrowBtn.setAttribute('aria-label', 'Expand/collapse');
            arrowBtn.className = 'arrow mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400';
            arrowBtn.innerHTML = `<svg class="h-4 w-4 text-blue-600 transition-transform duration-200" style="transform: rotate(${item.expanded ? 90 : 0}deg);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M9 5l7 7-7 7" /></svg>`;  // blue arrows on homepage
            addTapListener(arrowBtn, () => { 
                item.expanded = !item.expanded;
                createHierarchicalList(items, container, level); 
            });
            row.appendChild(arrowBtn);
            // Category label
            const label = document.createElement('span');
            label.className = 'cursor-pointer hover:underline flex-1 font-semibold';
            label.textContent = item.title;
            addTapListener(label, () => { 
                item.expanded = !item.expanded;
                createHierarchicalList(items, container, level); 
            });
            row.appendChild(label);
            container.appendChild(row);
            // If expanded, render children
            if (item.expanded && item.children?.length) {
                const childContainer = document.createElement('div');
                childContainer.className = 'ml-4 border-l border-blue-100 pl-2';
                createHierarchicalList(item.children, childContainer, level + 1);
                container.appendChild(childContainer);
            }
        } else if (item.type === 'topic') { 
            // Topic item
            const topicLink = document.createElement('a');
            topicLink.className = 'topic-link-item flex-1';
            topicLink.textContent = item.title;
            topicLink.href = `#${item.id}`;
            topicLink.dataset.topicId = item.id;
            topicLink.setAttribute('role', 'button');
            topicLink.setAttribute('tabindex', '0');
            addTapListener(topicLink, e => { 
                e.preventDefault();
                renderDetailPage(item.id); 
            });
            // Add a placeholder span for alignment (for arrow spacing)
            row.appendChild(document.createElement('span'));
            row.appendChild(topicLink);
            container.appendChild(row);
        }
    });
};

// Temporary global exposure
if (typeof window !== 'undefined') {
    window.renderInitialView = renderInitialView;
}
