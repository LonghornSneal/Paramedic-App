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
    const contentArea = window.contentArea || document.getElementById('content-area');
    contentArea.classList.remove('detail-space', 'detail-space-anaphylaxis');
    contentArea.innerHTML = '';  // Clear current content
    const suggested = Array.isArray(window.patientSuggestedTopics) ? window.patientSuggestedTopics : [];
    if (suggested.length) {
        const suggestedWrapper = document.createElement('div');
        suggestedWrapper.className = 'suggested-topics';
        const heading = document.createElement('h3');
        heading.className = 'suggested-heading';
        heading.textContent = 'Suggested';
        suggestedWrapper.appendChild(heading);
        const suggestedList = document.createElement('div');
        suggestedList.className = 'suggested-list';
        suggested.forEach(entry => {
            const topic = window.allDisplayableTopicsMap?.[entry.id];
            if (!topic) return;
            const link = document.createElement('a');
            link.className = 'topic-link-item suggested-topic';
            link.textContent = topic.title;
            link.href = `#${topic.id}`;
            link.dataset.topicId = topic.id;
            link.setAttribute('role', 'button');
            link.setAttribute('tabindex', '0');
            addTapListener(link, e => {
                e.preventDefault();
                renderDetailPage(topic.id);
            });
            link.addEventListener('keydown', evt => {
                if (evt.key === 'Enter' || evt.key === ' ') {
                    evt.preventDefault();
                    renderDetailPage(topic.id);
                }
            });
            const meta = [];
            if (entry.matchedIndications && entry.matchedIndications.length) meta.push('Indications');
            if (entry.matchedSymptoms && entry.matchedSymptoms.length) meta.push('Symptoms');
            if (meta.length) {
                const reason = document.createElement('div');
                reason.className = 'suggested-reason';
                reason.textContent = `Matches: ${meta.join(', ')}`;
                link.appendChild(reason);
            }
            suggestedList.appendChild(link);
        });
        if (suggestedList.children.length) {
            suggestedWrapper.appendChild(suggestedList);
            contentArea.appendChild(suggestedWrapper);
        }
    }
    // Render the hierarchical list of all categories
    const listContainer = document.createElement('div');
    createHierarchicalList(window.paramedicCategories, listContainer, 0);
    contentArea.appendChild(listContainer);
    if (typeof window.applyTopicStrikethroughs === 'function') {
        window.applyTopicStrikethroughs();
    }
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
    const contentArea = window.contentArea || document.getElementById('content-area');
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
        const group = document.createElement('div');
        group.className = 'category-group';
        group.style.setProperty('--category-level', level);
        if (item.type === 'category') {  // Category with collapsible children
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'category-card';
            if (item.expanded) card.classList.add('is-expanded');
            card.setAttribute('aria-expanded', item.expanded ? 'true' : 'false');
            const label = document.createElement('span');
            label.className = 'category-card-title';
            label.textContent = item.title;
            if (item.title === 'Quick Vent Guide') {
                label.classList.add('quick-vent-title');
            }
            const indicator = document.createElement('span');
            indicator.className = 'category-card-indicator';
            indicator.textContent = item.expanded ? 'Hide' : 'Show';
            indicator.setAttribute('aria-hidden', 'true');
            card.append(label, indicator);
            addTapListener(card, () => { 
                item.expanded = !item.expanded;
                createHierarchicalList(items, container, level); 
            });
            group.appendChild(card);
            if (item.expanded && item.children?.length) {
                const childContainer = document.createElement('div');
                childContainer.className = 'category-children';
                group.appendChild(childContainer);
                createHierarchicalList(item.children, childContainer, level + 1);
            }
            container.appendChild(group);
        } else if (item.type === 'topic') { 
            const topicLink = document.createElement('a');
            topicLink.className = 'topic-link-item';
            topicLink.textContent = item.title;
            topicLink.href = `#${item.id}`;
            topicLink.dataset.topicId = item.id;
            topicLink.setAttribute('role', 'button');
            topicLink.setAttribute('tabindex', '0');
            addTapListener(topicLink, e => { 
                e.preventDefault();
                renderDetailPage(item.id); 
            });
            group.appendChild(topicLink);
            container.appendChild(group);
        }
    });
}

// Temporary global exposure
if (typeof window !== 'undefined') {
    window.renderInitialView = renderInitialView;
}
/*
  Features/list/ListView.js
  Purpose: Renders hierarchical category/topic list, toggles expansion, and routes to details.

  Core:
  - renderInitialView(shouldAddHistory, highlightId, categoryPath)
  - createHierarchicalList(items, container, level)
  - openCategoriesAndHighlight(categoryPath, highlightId)

  Tests:
  - Indirectly validated by E2E tests that call renderDetailPage and by user navigation.
  - TODO: add a lightweight DOM test to assert expansion/collapse and deep-link highlight.
*/
