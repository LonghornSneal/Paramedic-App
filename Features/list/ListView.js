// Features/list/ListView.js – Category list rendering
//import './Features/navigation/Navigation.js';
//import './Features/detail/DetailPage.js';
//import './Utils/addTapListener'
import { addHistoryEntry, updateNavButtonsState } from '../navigation/Navigation.js';
import { renderDetailPage } from '../detail/DetailPage.js';
import { resetDetailSpaceClasses } from '../detail/detailSpaceUtils.js';
import { addTapListener } from '../../Utils/addTapListener.js'
// import { addHistoryEntry, updateNavButtonsState, attachNavHandlers } from './Features/navigation/Navigation.js';
// import { renderDetailPage } from './Features/detail/DetailPage.js';
// import { addTapListener } from '../../Utils/addTapListener.js';
// Renders the main category list view (home screen) and highlights a topic if provided.
export function renderInitialView(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    const contentArea = window.contentArea || document.getElementById('content-area');
    resetDetailSpaceClasses(contentArea);
    contentArea.innerHTML = '';  // Clear current content
    if (!Array.isArray(window.activeCategoryPath)) {
        window.activeCategoryPath = [];
    }
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
    createHierarchicalList(window.paramedicCategories, listContainer, 0, []);
    contentArea.appendChild(listContainer);
    requestAnimationFrame(() => updateCategoryTreeMetrics(listContainer));
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
    window.activeCategoryPath = Array.isArray(categoryPath) ? [...categoryPath] : [];
    window.activeTopicId = highlightId || null;
    // Re-render list with updated expansion states
    contentArea.innerHTML = '';
    const listContainer = document.createElement('div');
    createHierarchicalList(window.paramedicCategories, listContainer, 0, []);
    contentArea.appendChild(listContainer);
    requestAnimationFrame(() => updateCategoryTreeMetrics(listContainer));
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
function createHierarchicalList(items, container, level = 0, path = []) {
    container.innerHTML = '';
    container.classList.add('category-tree');
    container.dataset.level = String(level);
    container.style.setProperty('--category-level', level);
    const hasExpanded = items.some(item => item.type === 'category' && item.expanded);
    container.classList.toggle('has-expanded', hasExpanded);
    const hasActivePath = items.some(item =>
        (Array.isArray(window.activeCategoryPath) && window.activeCategoryPath.includes(item.id)) ||
        window.activeTopicId === item.id
    );
    container.classList.toggle('has-active-path', hasActivePath);
    items.forEach(item => { 
        const currentPath = [...path, item.id];
        const group = document.createElement('div');
        group.className = 'category-group';
        if (level === 0) {
            group.classList.add('is-root');
        }
        if (item.type === 'category' && item.expanded) {
            group.classList.add('is-expanded');
        }
        if (Array.isArray(window.activeCategoryPath) && window.activeCategoryPath.includes(item.id)) {
            group.classList.add('is-active-path');
        }
        group.style.setProperty('--category-level', level);
        if (item.type === 'category') {  // Category with collapsible children
            group.dataset.categoryId = item.id;
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'category-card';
            card.dataset.categoryId = item.id;
            if (item.expanded) card.classList.add('is-expanded');
            if (group.classList.contains('is-active-path')) {
                card.classList.add('is-active-path');
            }
            card.setAttribute('aria-expanded', item.expanded ? 'true' : 'false');
            const label = document.createElement('span');
            label.className = 'category-card-title';
            label.textContent = item.title;
            if (item.title === 'Quick Vent Guide') {
                label.classList.add('quick-vent-title');
            }
            card.append(label);
            addTapListener(card, () => { 
                const nextExpanded = !item.expanded;
                if (nextExpanded) {
                    items.forEach(sibling => {
                        if (sibling.type === 'category' && sibling !== item) {
                            sibling.expanded = false;
                        }
                    });
                }
                item.expanded = nextExpanded;
                if (nextExpanded) {
                    window.activeCategoryPath = currentPath;
                    window.activeTopicId = null;
                } else if (Array.isArray(window.activeCategoryPath) && window.activeCategoryPath.includes(item.id)) {
                    window.activeCategoryPath = [...path];
                    window.activeTopicId = null;
                }
                const rootContainer = container.closest('.category-tree[data-level="0"]');
                if (rootContainer && rootContainer !== container) {
                    createHierarchicalList(window.paramedicCategories, rootContainer, 0, []);
                } else {
                    createHierarchicalList(items, container, level, path);
                }
            });
            group.appendChild(card);
            if (item.expanded && item.children?.length) {
                const childContainer = document.createElement('div');
                childContainer.className = 'category-children category-tree';
                group.appendChild(childContainer);
            createHierarchicalList(item.children, childContainer, level + 1, currentPath);
        }
        container.appendChild(group);
    } else if (item.type === 'topic') { 
            group.dataset.topicId = item.id;
            const topicLink = document.createElement('a');
            topicLink.className = 'topic-link-item';
            topicLink.textContent = item.title;
            topicLink.href = `#${item.id}`;
            topicLink.dataset.topicId = item.id;
            topicLink.setAttribute('role', 'button');
            topicLink.setAttribute('tabindex', '0');
            addTapListener(topicLink, e => { 
                e.preventDefault();
                window.activeTopicId = item.id;
                renderDetailPage(item.id); 
            });
            if (window.activeTopicId === item.id) {
                topicLink.classList.add('is-active-path');
                group.classList.add('is-active-path');
            }
            group.appendChild(topicLink);
            container.appendChild(group);
        }
    });
    if (level === 0) {
        requestAnimationFrame(() => updateCategoryTreeMetrics(container));
    }
}

function updateCategoryTreeMetrics(container) {
    if (!container) return;
    const contentArea = document.getElementById('content-area');
    const rootTree = container.closest('.category-tree[data-level="0"]') || (container.classList.contains('category-tree') ? container : null);
    const metricsRoot = rootTree || container;
    const activePath = Array.isArray(window.activeCategoryPath) ? window.activeCategoryPath : [];
    const activeDepth = activePath.length;
    const hasActiveDepth = activeDepth > 0;
    const getActiveAnchor = root => {
        if (window.activeTopicId) {
            const topicLink = root.querySelector(`[data-topic-id="${window.activeTopicId}"]`);
            if (topicLink) return topicLink;
        }
        const activePath = Array.isArray(window.activeCategoryPath) ? window.activeCategoryPath : [];
        const activeCategoryId = activePath.length ? activePath[activePath.length - 1] : null;
        if (activeCategoryId) {
            const categoryCard = root.querySelector(`[data-category-id="${activeCategoryId}"]`);
            if (categoryCard) return categoryCard;
        }
        return null;
    };
    const stepSum = (steps, base, decay, minStep) => {
        let total = 0;
        for (let i = 0; i < steps; i += 1) {
            total += Math.max(minStep, base * Math.pow(decay, i));
        }
        return total;
    };
    const contentRect = contentArea ? contentArea.getBoundingClientRect() : null;
    const baseShift = contentRect ? Math.min(110, Math.max(52, contentRect.width * 0.06)) : 72;
    const baseRaise = contentRect ? Math.min(36, Math.max(10, contentRect.height * 0.02)) : 22;
    const minShift = contentRect ? Math.max(10, contentRect.width * 0.015) : 10;
    const minRaise = contentRect ? Math.max(4, contentRect.height * 0.01) : 4;
    const shiftForSteps = steps => stepSum(steps, baseShift, 0.68, minShift);
    const raiseForSteps = steps => stepSum(steps, baseRaise, 0.7, minRaise);
    const scaleForSteps = steps => {
        const minScale = 0.86;
        const decay = 0.7;
        return minScale + ((1 - minScale) * Math.pow(decay, steps));
    };
    const desiredShift = level => (hasActiveDepth ? -shiftForSteps(Math.max(0, activeDepth - level)) : 0);
    const desiredBaseRaise = level => {
        const steps = Math.max(0, activeDepth - level);
        return hasActiveDepth ? -raiseForSteps(steps) : 0;
    };
    const desiredRaise = level => desiredBaseRaise(level);
    const desiredScale = level => (hasActiveDepth ? scaleForSteps(Math.max(0, activeDepth - level)) : 1);
    const flowDirection = 'normal';
    let rootShiftOverride = desiredShift(0);
    let rootRaiseOverride = desiredRaise(0);
    if (rootTree) {
        rootTree.style.setProperty('--tree-shift', `${rootShiftOverride}px`);
        rootTree.style.setProperty('--tree-raise', `${rootRaiseOverride}px`);
        rootTree.style.setProperty('--tree-scale', `${desiredScale(0)}`);
        rootTree.style.setProperty('--connector-flow-direction', flowDirection);
    }
    const trees = [];
    if (metricsRoot.classList.contains('category-tree')) {
        trees.push(metricsRoot);
    }
    trees.push(...metricsRoot.querySelectorAll('.category-tree'));
    trees.forEach(tree => {
        const level = Number(tree.dataset.level || 0);
        const parentTree = tree.parentElement ? tree.parentElement.closest('.category-tree') : null;
        const parentLevel = parentTree ? Number(parentTree.dataset.level || 0) : null;
        const shift = level === 0
            ? rootShiftOverride
            : desiredShift(level) - desiredShift(parentLevel);
        const raise = level === 0
            ? rootRaiseOverride
            : desiredBaseRaise(level) - desiredBaseRaise(parentLevel);
        tree.style.setProperty('--tree-shift', `${shift}px`);
        tree.style.setProperty('--tree-raise', `${raise}px`);
        tree.style.setProperty('--tree-scale', `${desiredScale(level)}`);
        tree.style.setProperty('--connector-flow-direction', flowDirection);
        const groups = Array.from(tree.children).filter(child => child.classList.contains('category-group'));
        if (!groups.length) return;
        const firstGroup = groups[0];
        const lastGroup = groups[groups.length - 1];
        const start = firstGroup.offsetTop + (firstGroup.offsetHeight / 2);
        const stop = lastGroup.offsetTop + (lastGroup.offsetHeight / 2);
        tree.style.setProperty('--tree-trunk-start', `${start}px`);
        tree.style.setProperty('--tree-trunk-stop', `${stop}px`);
        const activeGroup = groups.find(child => child.classList.contains('is-active-path'));
        if (tree.dataset.level === '0' && activeGroup) {
            const activeStop = activeGroup.offsetTop + (activeGroup.offsetHeight / 2);
            tree.style.setProperty('--tree-trunk-active-stop', `${activeStop}px`);
        } else if (tree.dataset.level === '0') {
            tree.style.setProperty('--tree-trunk-active-stop', `${start}px`);
        }
    });
    const childContainers = metricsRoot.querySelectorAll('.category-children');
    childContainers.forEach(childContainer => {
        const groups = Array.from(childContainer.children).filter(child => child.classList.contains('category-group'));
        if (!groups.length) return;
        const lastGroup = groups[groups.length - 1];
        const stop = lastGroup.offsetTop + (lastGroup.offsetHeight / 2);
        childContainer.style.setProperty('--connector-stop', `${stop}px`);
        const activeGroup = groups.find(child => child.classList.contains('is-active-path'));
        if (activeGroup) {
            const activeStop = activeGroup.offsetTop + (activeGroup.offsetHeight / 2);
            childContainer.style.setProperty('--connector-active-stop', `${activeStop}px`);
            childContainer.classList.add('has-active-path');
        } else {
            childContainer.style.setProperty('--connector-active-stop', '0px');
            childContainer.classList.remove('has-active-path');
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
