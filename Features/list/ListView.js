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

const CATEGORY_TREE_LINE_THICKNESS = 4;
const CATEGORY_TREE_LINE_GAP = 8;
const CATEGORY_TREE_DRAG_THRESHOLD = 4;
const HEADER_ELEMENT_DEFS = [
    { key: 'search', label: 'Search Bar', selector: '#searchInput' },
    { key: 'menu', label: 'Menu Button', selector: '#open-sidebar-button' },
    { key: 'back', label: 'Back Button', selector: '#nav-back-button' },
    { key: 'forward', label: 'Forward Button', selector: '#nav-forward-button' },
    { key: 'home', label: 'Home Button', selector: '#nav-home-button' },
    { key: 'history', label: 'History Button', selector: '#history-button' }
];
const FOOTER_ELEMENT_DEFS = [
    { key: 'version', label: 'App Version', selector: '#app-version' },
    { key: 'settings', label: 'Settings Button', selector: '#settings-button' }
];

function getCategoryTreeState() {
    if (typeof window === 'undefined') return {};
    if (!window.categoryTreeState) {
        const overlayPref = typeof localStorage !== 'undefined' ? localStorage.getItem('devOverlay') : null;
        const overlayEnabled = overlayPref !== 'false';
        window.categoryTreeState = {
            dragOffsets: new Map(),
            dragActive: null,
            suppressClickId: null,
            lineLayer: null,
            activeLineLayer: null,
            baseLines: new Map(),
            highlightPool: [],
            animationId: null,
            lineUpdateHandle: null,
            fitScale: 1,
            pathSteps: [],
            lineThickness: CATEGORY_TREE_LINE_THICKNESS,
            centeringTimer: null,
            pillScaleByLevel: new Map(),
            columnShiftByLevel: new Map(),
            rowGapScaleByLevel: new Map(),
            overlayLevelsKey: '',
            overlayHidden: !overlayEnabled,
            manualColumnShift: false,
            headerScale: 1,
            headerContentScale: 1,
            headerOffsetX: 0,
            headerOffsetY: 0,
            footerScale: 1,
            headerElementScale: new Map(),
            headerElementOffsetX: new Map(),
            headerElementOffsetY: new Map(),
            footerElementScale: new Map(),
            footerElementOffsetX: new Map(),
            footerElementOffsetY: new Map()
        };
    }
    return window.categoryTreeState;
}

function resetCategoryTreeAnimation() {
    const state = getCategoryTreeState();
    if (state.animationId) {
        cancelAnimationFrame(state.animationId);
    }
    state.animationId = null;
    state.fitScale = 1;
    state.pathSteps = [];
}
// Renders the main category list view (home screen) and highlights a topic if provided.
export function renderInitialView(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    const contentArea = window.contentArea || document.getElementById('content-area');
    resetDetailSpaceClasses(contentArea);
    contentArea.innerHTML = '';  // Clear current content
    resetCategoryTreeAnimation();
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
    listContainer.className = 'category-tree-container';
    createHierarchicalList(window.paramedicCategories, listContainer, 0, []);
    contentArea.appendChild(listContainer);
    ensureCategoryTreeLineLayer(contentArea);
    ensureCategorySizeOverlay(contentArea, listContainer);
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
    resetCategoryTreeAnimation();
    const listContainer = document.createElement('div');
    listContainer.className = 'category-tree-container';
    createHierarchicalList(window.paramedicCategories, listContainer, 0, []);
    contentArea.appendChild(listContainer);
    ensureCategoryTreeLineLayer(contentArea);
    ensureCategorySizeOverlay(contentArea, listContainer);
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
            prepareCategoryPill(card, item.id);
            addTapListener(card, () => { 
                if (shouldSuppressCategoryClick(item.id)) return;
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
            prepareCategoryPill(topicLink, item.id);
            addTapListener(topicLink, e => { 
                if (shouldSuppressCategoryClick(item.id)) return;
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

function getCategoryTreeRoot(container) {
    if (!container) return null;
    return container.closest('.category-tree[data-level="0"]') || (container.classList.contains('category-tree') ? container : null);
}

function ensureCategoryTreeLineLayer(contentArea) {
    if (!contentArea) return null;
    const state = getCategoryTreeState();
    if (!state.lineLayer || !state.lineLayer.isConnected || state.lineLayer.parentElement !== contentArea) {
        const existing = contentArea.querySelector(':scope > .category-tree-lines');
        state.lineLayer = existing || document.createElement('div');
        if (!existing) {
            state.lineLayer.className = 'category-tree-lines';
            contentArea.appendChild(state.lineLayer);
        }
        state.baseLines = new Map();
        state.highlightPool = [];
    }
    return state.lineLayer;
}

function prepareCategoryPill(element, id) {
    if (!element || !id) return;
    element.dataset.dragId = id;
    applyCategoryDragOffset(element, id);
    attachCategoryDragHandlers(element, id);
}

function applyCategoryDragOffset(element, id) {
    const state = getCategoryTreeState();
    const offset = state.dragOffsets.get(id);
    if (offset) {
        element.style.translate = `${offset.x}px ${offset.y}px`;
    } else {
        element.style.translate = '0px 0px';
    }
}

function attachCategoryDragHandlers(element, id) {
    if (!element || !id || element.dataset.dragBound === 'true') return;
    element.dataset.dragBound = 'true';
    element.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        const state = getCategoryTreeState();
        const offset = state.dragOffsets.get(id) || { x: 0, y: 0 };
        state.dragActive = {
            id,
            element,
            startX: event.clientX,
            startY: event.clientY,
            originX: offset.x,
            originY: offset.y,
            pointerId: event.pointerId,
            moved: false
        };
        element.setPointerCapture?.(event.pointerId);
        event.preventDefault();
    });
    element.addEventListener('pointermove', event => {
        const state = getCategoryTreeState();
        const active = state.dragActive;
        if (!active || active.id !== id || active.pointerId !== event.pointerId) return;
        const dx = event.clientX - active.startX;
        const dy = event.clientY - active.startY;
        if (!active.moved) {
            if (Math.hypot(dx, dy) < CATEGORY_TREE_DRAG_THRESHOLD) return;
            active.moved = true;
            element.classList.add('is-dragging');
        }
        const next = { x: active.originX + dx, y: active.originY + dy };
        state.dragOffsets.set(id, next);
        element.style.translate = `${next.x}px ${next.y}px`;
        scheduleCategoryTreeLineUpdate(element);
        event.preventDefault();
    });
    element.addEventListener('pointerup', event => finalizeCategoryDrag(event, element, id));
    element.addEventListener('pointercancel', event => finalizeCategoryDrag(event, element, id));
}

function finalizeCategoryDrag(event, element, id) {
    const state = getCategoryTreeState();
    const active = state.dragActive;
    if (!active || active.id !== id) return;
    if (active.pointerId !== event.pointerId) return;
    if (active.moved) {
        state.suppressClickId = id;
    }
    element.classList.remove('is-dragging');
    element.releasePointerCapture?.(event.pointerId);
    state.dragActive = null;
    scheduleCategoryTreeLineUpdate(element);
}

function shouldSuppressCategoryClick(id) {
    const state = getCategoryTreeState();
    if (state.suppressClickId && state.suppressClickId === id) {
        state.suppressClickId = null;
        return true;
    }
    return false;
}

function scheduleCategoryTreeLineUpdate(source) {
    const state = getCategoryTreeState();
    if (state.lineUpdateHandle) return;
    state.lineUpdateHandle = requestAnimationFrame(() => {
        state.lineUpdateHandle = null;
        const rootTree = getCategoryTreeRoot(source);
        if (rootTree) {
            updateCategoryTreeLines(rootTree);
        }
    });
}

function getActivePathIds() {
    const path = Array.isArray(window.activeCategoryPath) ? [...window.activeCategoryPath] : [];
    if (window.activeTopicId) path.push(window.activeTopicId);
    return path;
}

function getLineThickness(referenceEl) {
    if (!referenceEl) return CATEGORY_TREE_LINE_THICKNESS;
    const value = getComputedStyle(referenceEl).getPropertyValue('--line-thickness');
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : CATEGORY_TREE_LINE_THICKNESS;
}

function getPillScaleForLevel(level) {
    const state = getCategoryTreeState();
    const stored = state.pillScaleByLevel.get(level);
    return Number.isFinite(stored) ? stored : 1;
}

function setPillScaleForLevel(level, scale) {
    const state = getCategoryTreeState();
    const nextScale = Math.min(2.6, Math.max(0.7, scale));
    state.pillScaleByLevel.set(level, nextScale);
    return nextScale;
}

function getColumnShiftForLevel(level) {
    const state = getCategoryTreeState();
    const stored = state.columnShiftByLevel.get(level);
    return Number.isFinite(stored) ? stored : 0;
}

function updateManualColumnShiftFlag(state) {
    state.manualColumnShift = Array.from(state.columnShiftByLevel.values())
        .some(value => Number.isFinite(value) && Math.abs(value) > 0.5);
}

function setColumnShiftForLevel(level, shift) {
    const state = getCategoryTreeState();
    const nextShift = Math.min(260, Math.max(-260, shift));
    state.columnShiftByLevel.set(level, nextShift);
    updateManualColumnShiftFlag(state);
    return nextShift;
}

function getRowGapScaleForLevel(level) {
    const state = getCategoryTreeState();
    const stored = state.rowGapScaleByLevel.get(level);
    return Number.isFinite(stored) ? stored : 1;
}

function setRowGapScaleForLevel(level, scale) {
    const state = getCategoryTreeState();
    const nextScale = Math.min(2.6, Math.max(0.6, scale));
    state.rowGapScaleByLevel.set(level, nextScale);
    return nextScale;
}

function getHeaderScale() {
    const state = getCategoryTreeState();
    return Number.isFinite(state.headerScale) ? state.headerScale : 1;
}

function getHeaderContentScale() {
    const state = getCategoryTreeState();
    return Number.isFinite(state.headerContentScale) ? state.headerContentScale : 1;
}

function getHeaderOffsetX() {
    const state = getCategoryTreeState();
    return Number.isFinite(state.headerOffsetX) ? state.headerOffsetX : 0;
}

function getHeaderOffsetY() {
    const state = getCategoryTreeState();
    return Number.isFinite(state.headerOffsetY) ? state.headerOffsetY : 0;
}

function getFooterScale() {
    const state = getCategoryTreeState();
    return Number.isFinite(state.footerScale) ? state.footerScale : 1;
}

function setHeaderScale(scale) {
    const state = getCategoryTreeState();
    const nextScale = Math.min(1.8, Math.max(0.2, scale));
    state.headerScale = nextScale;
    return nextScale;
}

function setHeaderContentScale(scale) {
    const state = getCategoryTreeState();
    const nextScale = Math.min(1.8, Math.max(0.4, scale));
    state.headerContentScale = nextScale;
    return nextScale;
}

function setHeaderOffsetX(value) {
    const state = getCategoryTreeState();
    const nextValue = Math.min(160, Math.max(-160, value));
    state.headerOffsetX = nextValue;
    return nextValue;
}

function setHeaderOffsetY(value) {
    const state = getCategoryTreeState();
    const nextValue = Math.min(120, Math.max(-120, value));
    state.headerOffsetY = nextValue;
    return nextValue;
}

function setFooterScale(scale) {
    const state = getCategoryTreeState();
    const nextScale = Math.min(1.8, Math.max(0.2, scale));
    state.footerScale = nextScale;
    return nextScale;
}

function getHeaderElementScale(key) {
    const state = getCategoryTreeState();
    const stored = state.headerElementScale.get(key);
    return Number.isFinite(stored) ? stored : 1;
}

function setHeaderElementScale(key, scale) {
    const state = getCategoryTreeState();
    const nextScale = Math.min(2.6, Math.max(0.4, scale));
    state.headerElementScale.set(key, nextScale);
    return nextScale;
}

function getHeaderElementOffsetX(key) {
    const state = getCategoryTreeState();
    const stored = state.headerElementOffsetX.get(key);
    return Number.isFinite(stored) ? stored : 0;
}

function getHeaderElementOffsetY(key) {
    const state = getCategoryTreeState();
    const stored = state.headerElementOffsetY.get(key);
    return Number.isFinite(stored) ? stored : 0;
}

function setHeaderElementOffsetX(key, value) {
    const state = getCategoryTreeState();
    const nextValue = Math.min(220, Math.max(-220, value));
    state.headerElementOffsetX.set(key, nextValue);
    return nextValue;
}

function setHeaderElementOffsetY(key, value) {
    const state = getCategoryTreeState();
    const nextValue = Math.min(180, Math.max(-180, value));
    state.headerElementOffsetY.set(key, nextValue);
    return nextValue;
}

function getFooterElementScale(key) {
    const state = getCategoryTreeState();
    const stored = state.footerElementScale.get(key);
    return Number.isFinite(stored) ? stored : 1;
}

function setFooterElementScale(key, scale) {
    const state = getCategoryTreeState();
    const nextScale = Math.min(2.2, Math.max(0.4, scale));
    state.footerElementScale.set(key, nextScale);
    return nextScale;
}

function getFooterElementOffsetX(key) {
    const state = getCategoryTreeState();
    const stored = state.footerElementOffsetX.get(key);
    return Number.isFinite(stored) ? stored : 0;
}

function getFooterElementOffsetY(key) {
    const state = getCategoryTreeState();
    const stored = state.footerElementOffsetY.get(key);
    return Number.isFinite(stored) ? stored : 0;
}

function setFooterElementOffsetX(key, value) {
    const state = getCategoryTreeState();
    const nextValue = Math.min(220, Math.max(-220, value));
    state.footerElementOffsetX.set(key, nextValue);
    return nextValue;
}

function setFooterElementOffsetY(key, value) {
    const state = getCategoryTreeState();
    const nextValue = Math.min(120, Math.max(-120, value));
    state.footerElementOffsetY.set(key, nextValue);
    return nextValue;
}

function applyHeaderElementOverrides() {
    HEADER_ELEMENT_DEFS.forEach(def => {
        const element = document.querySelector(def.selector);
        if (!element) return;
        const scale = getHeaderElementScale(def.key);
        const offsetX = getHeaderElementOffsetX(def.key);
        const offsetY = getHeaderElementOffsetY(def.key);
        element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        element.style.transformOrigin = 'center';
    });
}

function applyFooterElementOverrides() {
    FOOTER_ELEMENT_DEFS.forEach(def => {
        const element = document.querySelector(def.selector);
        if (!element) return;
        const scale = getFooterElementScale(def.key);
        const offsetX = getFooterElementOffsetX(def.key);
        const offsetY = getFooterElementOffsetY(def.key);
        element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        element.style.transformOrigin = 'center';
    });
}

function applyLayoutScale() {
    const appContainer = document.getElementById('app-container');
    if (!appContainer) return;
    appContainer.style.setProperty('--header-room-scale', `${getHeaderScale()}`);
    appContainer.style.setProperty('--header-content-scale', `${getHeaderContentScale()}`);
    appContainer.style.setProperty('--header-offset-x', `${getHeaderOffsetX()}px`);
    appContainer.style.setProperty('--header-offset-y', `${getHeaderOffsetY()}px`);
    appContainer.style.setProperty('--footer-room-scale', `${getFooterScale()}`);
    applyHeaderElementOverrides();
    applyFooterElementOverrides();
    updateLayoutChromeHeight();
}

function updateLayoutChromeHeight() {
    const appContainer = document.getElementById('app-container');
    if (!appContainer || typeof window === 'undefined') return;
    const header = appContainer.querySelector('header');
    const footer = appContainer.querySelector('footer');
    const main = appContainer.querySelector('main');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const footerHeight = footer ? footer.getBoundingClientRect().height : 0;
    let mainPadding = 0;
    if (main) {
        const mainStyle = window.getComputedStyle(main);
        mainPadding = (parseFloat(mainStyle.paddingTop) || 0) + (parseFloat(mainStyle.paddingBottom) || 0);
    }
    const chromeHeight = headerHeight + footerHeight + mainPadding;
    appContainer.style.setProperty('--layout-chrome-height', `${chromeHeight}px`);
}

function getCategoryTreeLevels(rootTree) {
    if (!rootTree) return [];
    const levels = new Set();
    levels.add(Number(rootTree.dataset.level || 0));
    rootTree.querySelectorAll('.category-tree').forEach(tree => {
        levels.add(Number(tree.dataset.level || 0));
    });
    return Array.from(levels).sort((a, b) => a - b);
}

function updateCategorySizeOverlayValues(overlay) {
    if (!overlay) return;
    overlay.querySelectorAll('.category-size-row').forEach(row => {
        const level = Number(row.dataset.level || 0);
        const sizeValue = row.querySelector('[data-value="size"]');
        const shiftValue = row.querySelector('[data-value="shift"]');
        const spacingValue = row.querySelector('[data-value="spacing"]');
        const scale = getPillScaleForLevel(level);
        if (sizeValue) {
            sizeValue.textContent = `${Math.round(scale * 100)}%`;
        }
        if (shiftValue) {
            const shift = getColumnShiftForLevel(level);
            const rounded = Math.round(shift);
            shiftValue.textContent = `${rounded >= 0 ? '+' : ''}${rounded}px`;
        }
        if (spacingValue) {
            const spacing = getRowGapScaleForLevel(level);
            spacingValue.textContent = `${Math.round(spacing * 100)}%`;
        }
    });
    const headerRoomValue = overlay.querySelector('[data-value="header-room-scale"]');
    if (headerRoomValue) {
        headerRoomValue.textContent = `${Math.round(getHeaderScale() * 100)}%`;
    }
    const headerContentValue = overlay.querySelector('[data-value="header-content-scale"]');
    if (headerContentValue) {
        headerContentValue.textContent = `${Math.round(getHeaderContentScale() * 100)}%`;
    }
    const headerOffsetXValue = overlay.querySelector('[data-value="header-offset-x"]');
    if (headerOffsetXValue) {
        const value = Math.round(getHeaderOffsetX());
        headerOffsetXValue.textContent = `${value >= 0 ? '+' : ''}${value}px`;
    }
    const headerOffsetYValue = overlay.querySelector('[data-value="header-offset-y"]');
    if (headerOffsetYValue) {
        const value = Math.round(getHeaderOffsetY());
        headerOffsetYValue.textContent = `${value >= 0 ? '+' : ''}${value}px`;
    }
    const footerRoomValue = overlay.querySelector('[data-value="footer-room-scale"]');
    if (footerRoomValue) {
        footerRoomValue.textContent = `${Math.round(getFooterScale() * 100)}%`;
    }
    HEADER_ELEMENT_DEFS.forEach(def => {
        const sizeValue = overlay.querySelector(`[data-value="header-${def.key}-scale"]`);
        if (sizeValue) {
            sizeValue.textContent = `${Math.round(getHeaderElementScale(def.key) * 100)}%`;
        }
        const xValue = overlay.querySelector(`[data-value="header-${def.key}-x"]`);
        if (xValue) {
            const value = Math.round(getHeaderElementOffsetX(def.key));
            xValue.textContent = `${value >= 0 ? '+' : ''}${value}px`;
        }
        const yValue = overlay.querySelector(`[data-value="header-${def.key}-y"]`);
        if (yValue) {
            const value = Math.round(getHeaderElementOffsetY(def.key));
            yValue.textContent = `${value >= 0 ? '+' : ''}${value}px`;
        }
    });
    FOOTER_ELEMENT_DEFS.forEach(def => {
        const sizeValue = overlay.querySelector(`[data-value="footer-${def.key}-scale"]`);
        if (sizeValue) {
            sizeValue.textContent = `${Math.round(getFooterElementScale(def.key) * 100)}%`;
        }
        const xValue = overlay.querySelector(`[data-value="footer-${def.key}-x"]`);
        if (xValue) {
            const value = Math.round(getFooterElementOffsetX(def.key));
            xValue.textContent = `${value >= 0 ? '+' : ''}${value}px`;
        }
        const yValue = overlay.querySelector(`[data-value="footer-${def.key}-y"]`);
        if (yValue) {
            const value = Math.round(getFooterElementOffsetY(def.key));
            yValue.textContent = `${value >= 0 ? '+' : ''}${value}px`;
        }
    });
}

function buildCategorySizeOverlay(overlay, levels) {
    overlay.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'category-size-overlay-header';
    const title = document.createElement('div');
    title.className = 'category-size-overlay-title';
    title.textContent = 'Overlay Controls';
    const hideButton = document.createElement('button');
    hideButton.type = 'button';
    hideButton.className = 'category-size-overlay-hide';
    hideButton.dataset.action = 'hide';
    hideButton.textContent = 'Hide';
    header.append(title, hideButton);
    overlay.appendChild(header);

    const body = document.createElement('div');
    body.className = 'category-size-overlay-body';
    levels.forEach(level => {
        const row = document.createElement('div');
        row.className = 'category-size-row';
        row.dataset.level = String(level);
        const label = document.createElement('div');
        label.className = 'category-size-label';
        label.textContent = `Column ${level + 1}`;

        const controlStack = document.createElement('div');
        controlStack.className = 'category-size-control-stack';

        const sizeGroup = document.createElement('div');
        sizeGroup.className = 'category-size-control-group';
        const sizeLabel = document.createElement('span');
        sizeLabel.className = 'category-size-control-label';
        sizeLabel.textContent = 'Size';
        const downButton = document.createElement('button');
        downButton.type = 'button';
        downButton.className = 'category-size-btn';
        downButton.dataset.action = 'size';
        downButton.dataset.dir = 'down';
        downButton.dataset.level = String(level);
        downButton.setAttribute('aria-label', `Decrease column ${level + 1} pill size`);
        downButton.textContent = '-';
        const sizeValue = document.createElement('div');
        sizeValue.className = 'category-size-value';
        sizeValue.dataset.value = 'size';
        sizeValue.textContent = '100%';
        const upButton = document.createElement('button');
        upButton.type = 'button';
        upButton.className = 'category-size-btn';
        upButton.dataset.action = 'size';
        upButton.dataset.dir = 'up';
        upButton.dataset.level = String(level);
        upButton.setAttribute('aria-label', `Increase column ${level + 1} pill size`);
        upButton.textContent = '+';
        sizeGroup.append(sizeLabel, downButton, sizeValue, upButton);

        const shiftGroup = document.createElement('div');
        shiftGroup.className = 'category-size-control-group';
        const shiftLabel = document.createElement('span');
        shiftLabel.className = 'category-size-control-label';
        shiftLabel.textContent = 'Shift';
        const leftButton = document.createElement('button');
        leftButton.type = 'button';
        leftButton.className = 'category-size-btn';
        leftButton.dataset.action = 'shift';
        leftButton.dataset.dir = 'left';
        leftButton.dataset.level = String(level);
        leftButton.setAttribute('aria-label', `Move column ${level + 1} left`);
        leftButton.textContent = '<';
        const shiftValue = document.createElement('div');
        shiftValue.className = 'category-size-value';
        shiftValue.dataset.value = 'shift';
        shiftValue.textContent = '+0px';
        const rightButton = document.createElement('button');
        rightButton.type = 'button';
        rightButton.className = 'category-size-btn';
        rightButton.dataset.action = 'shift';
        rightButton.dataset.dir = 'right';
        rightButton.dataset.level = String(level);
        rightButton.setAttribute('aria-label', `Move column ${level + 1} right`);
        rightButton.textContent = '>';
        shiftGroup.append(shiftLabel, leftButton, shiftValue, rightButton);

        const spacingGroup = document.createElement('div');
        spacingGroup.className = 'category-size-control-group';
        const spacingLabel = document.createElement('span');
        spacingLabel.className = 'category-size-control-label';
        spacingLabel.textContent = 'Spacing';
        const spacingDown = document.createElement('button');
        spacingDown.type = 'button';
        spacingDown.className = 'category-size-btn';
        spacingDown.dataset.action = 'spacing';
        spacingDown.dataset.dir = 'down';
        spacingDown.dataset.level = String(level);
        spacingDown.setAttribute('aria-label', `Decrease column ${level + 1} spacing`);
        spacingDown.textContent = '-';
        const spacingValue = document.createElement('div');
        spacingValue.className = 'category-size-value';
        spacingValue.dataset.value = 'spacing';
        spacingValue.textContent = '100%';
        const spacingUp = document.createElement('button');
        spacingUp.type = 'button';
        spacingUp.className = 'category-size-btn';
        spacingUp.dataset.action = 'spacing';
        spacingUp.dataset.dir = 'up';
        spacingUp.dataset.level = String(level);
        spacingUp.setAttribute('aria-label', `Increase column ${level + 1} spacing`);
        spacingUp.textContent = '+';
        spacingGroup.append(spacingLabel, spacingDown, spacingValue, spacingUp);

        controlStack.append(sizeGroup, shiftGroup, spacingGroup);
        row.append(label, controlStack);
        body.appendChild(row);
    });
    overlay.appendChild(body);

    const layout = document.createElement('div');
    layout.className = 'category-size-layout';
    const layoutTitle = document.createElement('div');
    layoutTitle.className = 'category-size-layout-title';
    layoutTitle.textContent = 'Header/Footer Height';
    layout.appendChild(layoutTitle);

    const layoutRows = [
        {
            label: 'Header Room',
            action: 'layout-scale',
            target: 'header-room',
            valueKey: 'header-room-scale',
            controls: { down: '-', up: '+' },
            aria: { down: 'Decrease header room', up: 'Increase header room' }
        },
        {
            label: 'Header Content',
            action: 'layout-scale',
            target: 'header-content',
            valueKey: 'header-content-scale',
            controls: { down: '-', up: '+' },
            aria: { down: 'Decrease header content size', up: 'Increase header content size' }
        },
        {
            label: 'Header Move X',
            action: 'layout-move',
            target: 'header-x',
            valueKey: 'header-offset-x',
            controls: { down: '<', up: '>' },
            aria: { down: 'Move header left', up: 'Move header right' }
        },
        {
            label: 'Header Move Y',
            action: 'layout-move',
            target: 'header-y',
            valueKey: 'header-offset-y',
            controls: { down: 'v', up: '^' },
            aria: { down: 'Move header down', up: 'Move header up' }
        },
        {
            label: 'Footer Room',
            action: 'layout-scale',
            target: 'footer-room',
            valueKey: 'footer-room-scale',
            controls: { down: '-', up: '+' },
            aria: { down: 'Decrease footer room', up: 'Increase footer room' }
        }
    ];
    layoutRows.forEach(item => {
        const row = document.createElement('div');
        row.className = 'category-size-row';
        const label = document.createElement('div');
        label.className = 'category-size-label';
        label.textContent = item.label;
        const controlStack = document.createElement('div');
        controlStack.className = 'category-size-control-stack';
        const group = document.createElement('div');
        group.className = 'category-size-control-group';
        const downButton = document.createElement('button');
        downButton.type = 'button';
        downButton.className = 'category-size-btn';
        downButton.dataset.action = item.action;
        downButton.dataset.dir = 'down';
        downButton.dataset.target = item.target;
        downButton.setAttribute('aria-label', item.aria.down);
        downButton.textContent = item.controls.down;
        const value = document.createElement('div');
        value.className = 'category-size-value';
        value.dataset.value = item.valueKey;
        value.textContent = '100%';
        const upButton = document.createElement('button');
        upButton.type = 'button';
        upButton.className = 'category-size-btn';
        upButton.dataset.action = item.action;
        upButton.dataset.dir = 'up';
        upButton.dataset.target = item.target;
        upButton.setAttribute('aria-label', item.aria.up);
        upButton.textContent = item.controls.up;
        group.append(downButton, value, upButton);
        controlStack.appendChild(group);
        row.append(label, controlStack);
        layout.appendChild(row);
    });
    overlay.appendChild(layout);

    const createElementGroup = (def, actionName, labelText, controlKey, downText, upText, valueKey, ariaDown, ariaUp) => {
        const group = document.createElement('div');
        group.className = 'category-size-control-group';
        const label = document.createElement('span');
        label.className = 'category-size-control-label';
        label.textContent = labelText;
        const downButton = document.createElement('button');
        downButton.type = 'button';
        downButton.className = 'category-size-btn';
        downButton.dataset.action = actionName;
        downButton.dataset.dir = 'down';
        downButton.dataset.key = def.key;
        downButton.dataset.control = controlKey;
        downButton.setAttribute('aria-label', ariaDown);
        downButton.textContent = downText;
        const value = document.createElement('div');
        value.className = 'category-size-value';
        value.dataset.value = valueKey;
        value.textContent = controlKey === 'scale' ? '100%' : '+0px';
        const upButton = document.createElement('button');
        upButton.type = 'button';
        upButton.className = 'category-size-btn';
        upButton.dataset.action = actionName;
        upButton.dataset.dir = 'up';
        upButton.dataset.key = def.key;
        upButton.dataset.control = controlKey;
        upButton.setAttribute('aria-label', ariaUp);
        upButton.textContent = upText;
        group.append(label, downButton, value, upButton);
        return group;
    };

    const buildElementSection = (titleText, defs, actionName, valuePrefix) => {
        const section = document.createElement('div');
        section.className = 'category-size-layout';
        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'category-size-layout-title';
        sectionTitle.textContent = titleText;
        section.appendChild(sectionTitle);
        defs.forEach(def => {
            const row = document.createElement('div');
            row.className = 'category-size-row';
            const label = document.createElement('div');
            label.className = 'category-size-label';
            label.textContent = def.label;
            const controlStack = document.createElement('div');
            controlStack.className = 'category-size-control-stack';
            controlStack.append(
                createElementGroup(
                    def,
                    actionName,
                    'Size',
                    'scale',
                    '-',
                    '+',
                    `${valuePrefix}-${def.key}-scale`,
                    `Decrease ${def.label} size`,
                    `Increase ${def.label} size`
                ),
                createElementGroup(
                    def,
                    actionName,
                    'Move X',
                    'x',
                    '<',
                    '>',
                    `${valuePrefix}-${def.key}-x`,
                    `Move ${def.label} left`,
                    `Move ${def.label} right`
                ),
                createElementGroup(
                    def,
                    actionName,
                    'Move Y',
                    'y',
                    'v',
                    '^',
                    `${valuePrefix}-${def.key}-y`,
                    `Move ${def.label} down`,
                    `Move ${def.label} up`
                )
            );
            row.append(label, controlStack);
            section.appendChild(row);
        });
        return section;
    };

    overlay.appendChild(buildElementSection('Header Elements', HEADER_ELEMENT_DEFS, 'header-element', 'header'));
    overlay.appendChild(buildElementSection('Footer Elements', FOOTER_ELEMENT_DEFS, 'footer-element', 'footer'));

    const footer = document.createElement('div');
    footer.className = 'category-size-overlay-footer';
    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'category-size-reset';
    resetButton.dataset.action = 'reset';
    resetButton.textContent = 'Reset';
    footer.appendChild(resetButton);
    overlay.appendChild(footer);
}

function setDevOverlayVisible(isVisible) {
    const state = getCategoryTreeState();
    const visible = Boolean(isVisible);
    state.overlayHidden = !visible;
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('devOverlay', visible ? 'true' : 'false');
    }
    const toggle = document.getElementById('dev-overlay-toggle');
    if (toggle) {
        toggle.checked = visible;
    }
    const contentArea = window.contentArea || document.getElementById('content-area');
    if (!contentArea) return;
    const existing = contentArea.querySelector('.category-size-overlay');
    if (!visible) {
        if (existing) existing.remove();
        return;
    }
    const rootTree = contentArea.querySelector('.category-tree-container');
    if (rootTree) {
        ensureCategorySizeOverlay(contentArea, rootTree);
    }
}

function ensureCategorySizeOverlay(contentArea, rootTree) {
    const state = getCategoryTreeState();
    if (!contentArea || !rootTree || state.overlayHidden) return;
    let overlay = contentArea.querySelector('.category-size-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'category-size-overlay';
        overlay.addEventListener('click', event => {
            const button = event.target.closest('button');
            if (!button) return;
            const action = button.dataset.action;
            if (action === 'hide') {
                setDevOverlayVisible(false);
                return;
            }
            if (action === 'reset') {
                state.pillScaleByLevel.clear();
                state.columnShiftByLevel.clear();
                state.manualColumnShift = false;
                state.rowGapScaleByLevel.clear();
                state.headerScale = 1;
                state.headerContentScale = 1;
                state.headerOffsetX = 0;
                state.headerOffsetY = 0;
                state.footerScale = 1;
                state.headerElementScale.clear();
                state.headerElementOffsetX.clear();
                state.headerElementOffsetY.clear();
                state.footerElementScale.clear();
                state.footerElementOffsetX.clear();
                state.footerElementOffsetY.clear();
                applyLayoutScale();
                updateCategoryTreeMetrics(rootTree);
                updateCategorySizeOverlayValues(overlay);
                return;
            }
            if (action === 'size') {
                const level = Number(button.dataset.level || 0);
                const delta = button.dataset.dir === 'down' ? -0.05 : 0.05;
                const nextScale = setPillScaleForLevel(level, getPillScaleForLevel(level) + delta);
                const tree = contentArea.querySelector(`.category-tree[data-level="${level}"]`);
                if (tree) tree.style.setProperty('--pill-scale', `${nextScale}`);
                updateCategoryTreeMetrics(rootTree);
                updateCategorySizeOverlayValues(overlay);
                return;
            }
            if (action === 'shift') {
                const level = Number(button.dataset.level || 0);
                const delta = button.dataset.dir === 'left' ? -12 : 12;
                const nextShift = setColumnShiftForLevel(level, getColumnShiftForLevel(level) + delta);
                const tree = contentArea.querySelector(`.category-tree[data-level="${level}"]`);
                if (tree) tree.style.setProperty('--column-shift', `${nextShift}px`);
                updateCategoryTreeMetrics(rootTree);
                updateCategorySizeOverlayValues(overlay);
                return;
            }
            if (action === 'spacing') {
                const level = Number(button.dataset.level || 0);
                const delta = button.dataset.dir === 'down' ? -0.1 : 0.1;
                const nextSpacing = setRowGapScaleForLevel(level, getRowGapScaleForLevel(level) + delta);
                const tree = contentArea.querySelector(`.category-tree[data-level="${level}"]`);
                if (tree) tree.style.setProperty('--row-gap-scale', `${nextSpacing}`);
                updateCategoryTreeMetrics(rootTree);
                updateCategorySizeOverlayValues(overlay);
                return;
            }
            if (action === 'layout-scale') {
                const delta = button.dataset.dir === 'down' ? -0.05 : 0.05;
                if (button.dataset.target === 'header-room') {
                    setHeaderScale(getHeaderScale() + delta);
                }
                if (button.dataset.target === 'header-content') {
                    setHeaderContentScale(getHeaderContentScale() + delta);
                }
                if (button.dataset.target === 'footer-room') {
                    setFooterScale(getFooterScale() + delta);
                }
                applyLayoutScale();
                updateCategoryTreeMetrics(rootTree);
                updateCategorySizeOverlayValues(overlay);
                return;
            }
            if (action === 'layout-move') {
                if (button.dataset.target === 'header-x') {
                    const direction = button.dataset.dir === 'down' ? -8 : 8;
                    setHeaderOffsetX(getHeaderOffsetX() + direction);
                }
                if (button.dataset.target === 'header-y') {
                    const direction = button.dataset.dir === 'down' ? 8 : -8;
                    setHeaderOffsetY(getHeaderOffsetY() + direction);
                }
                applyLayoutScale();
                updateCategoryTreeMetrics(rootTree);
                updateCategorySizeOverlayValues(overlay);
                return;
            }
            if (action === 'header-element') {
                const key = button.dataset.key;
                const control = button.dataset.control;
                if (!key || !control) return;
                if (control === 'scale') {
                    const delta = button.dataset.dir === 'down' ? -0.05 : 0.05;
                    setHeaderElementScale(key, getHeaderElementScale(key) + delta);
                }
                if (control === 'x') {
                    const delta = button.dataset.dir === 'down' ? -8 : 8;
                    setHeaderElementOffsetX(key, getHeaderElementOffsetX(key) + delta);
                }
                if (control === 'y') {
                    const delta = button.dataset.dir === 'down' ? 8 : -8;
                    setHeaderElementOffsetY(key, getHeaderElementOffsetY(key) + delta);
                }
                applyLayoutScale();
                updateCategoryTreeMetrics(rootTree);
                updateCategorySizeOverlayValues(overlay);
                return;
            }
            if (action === 'footer-element') {
                const key = button.dataset.key;
                const control = button.dataset.control;
                if (!key || !control) return;
                if (control === 'scale') {
                    const delta = button.dataset.dir === 'down' ? -0.05 : 0.05;
                    setFooterElementScale(key, getFooterElementScale(key) + delta);
                }
                if (control === 'x') {
                    const delta = button.dataset.dir === 'down' ? -8 : 8;
                    setFooterElementOffsetX(key, getFooterElementOffsetX(key) + delta);
                }
                if (control === 'y') {
                    const delta = button.dataset.dir === 'down' ? 8 : -8;
                    setFooterElementOffsetY(key, getFooterElementOffsetY(key) + delta);
                }
                applyLayoutScale();
                updateCategoryTreeMetrics(rootTree);
                updateCategorySizeOverlayValues(overlay);
                return;
            }
        });
        contentArea.appendChild(overlay);
    }
    const levels = getCategoryTreeLevels(rootTree);
    const levelsKey = levels.join(',');
    if (levelsKey !== state.overlayLevelsKey) {
        buildCategorySizeOverlay(overlay, levels);
        state.overlayLevelsKey = levelsKey;
    }
    applyLayoutScale();
    updateCategorySizeOverlayValues(overlay);
}

function collectCategoryNodeRects(rootTree, contentRect) {
    const nodeMap = new Map();
    if (!rootTree || !contentRect) return nodeMap;
    const groups = rootTree.querySelectorAll('.category-group');
    groups.forEach(group => {
        const pill = group.querySelector(':scope > .category-card, :scope > .topic-link-item');
        if (!pill) return;
        const id = pill.dataset.categoryId || pill.dataset.topicId;
        if (!id) return;
        const rect = pill.getBoundingClientRect();
        const left = rect.left - contentRect.left;
        const top = rect.top - contentRect.top;
        const width = rect.width;
        const height = rect.height;
        nodeMap.set(id, {
            left,
            right: left + width,
            top,
            bottom: top + height,
            width,
            height,
            centerX: left + (width / 2),
            centerY: top + (height / 2),
            element: pill
        });
    });
    return nodeMap;
}

function collectCategoryColumnInfo(rootTree, nodeMap, lineGap) {
    const columnMap = new Map();
    if (!rootTree) return columnMap;
    const gap = Number.isFinite(lineGap) ? lineGap : CATEGORY_TREE_LINE_GAP;
    const groups = rootTree.querySelectorAll('.category-group');
    groups.forEach(group => {
        const parentCard = group.querySelector(':scope > .category-card');
        if (!parentCard) return;
        const parentId = parentCard.dataset.categoryId;
        if (!parentId) return;
        const childContainer = group.querySelector(':scope > .category-children');
        if (!childContainer) return;
        const parentRect = nodeMap.get(parentId);
        if (!parentRect) return;
        const childGroups = Array.from(childContainer.children).filter(child => child.classList.contains('category-group'));
        const childRects = [];
        const childCenters = new Map();
        childGroups.forEach(child => {
            const childPill = child.querySelector(':scope > .category-card, :scope > .topic-link-item');
            if (!childPill) return;
            const childId = childPill.dataset.categoryId || childPill.dataset.topicId;
            const childRect = nodeMap.get(childId);
            if (!childRect) return;
            childRects.push(childRect);
            childCenters.set(childId, childRect.centerY);
        });
        if (!childRects.length) return;
        const minChildLeft = Math.min(...childRects.map(rect => rect.left));
        const minChildCenterY = Math.min(...childRects.map(rect => rect.centerY));
        const maxChildCenterY = Math.max(...childRects.map(rect => rect.centerY));
        const trunkX = Math.max(parentRect.right + gap, minChildLeft - gap);
        columnMap.set(parentId, {
            trunkX,
            parentCenterY: parentRect.centerY,
            parentRight: parentRect.right,
            minChildCenterY,
            maxChildCenterY,
            childCenters
        });
    });
    return columnMap;
}

function buildSegmentKey(segment) {
    if (segment.orientation === 'horizontal') {
        const y = Math.round(segment.y1);
        const minX = Math.round(Math.min(segment.x1, segment.x2));
        const maxX = Math.round(Math.max(segment.x1, segment.x2));
        return `H:${y}:${minX}:${maxX}`;
    }
    const x = Math.round(segment.x1);
    const minY = Math.round(Math.min(segment.y1, segment.y2));
    const maxY = Math.round(Math.max(segment.y1, segment.y2));
    return `V:${x}:${minY}:${maxY}`;
}

function buildActiveSegmentKeys(steps) {
    const keys = new Set();
    steps.forEach(step => {
        if (step.kind === 'pill') return;
        step.segments.forEach(segment => {
            keys.add(buildSegmentKey(segment));
        });
    });
    return keys;
}

function buildBaseSegments(rootTree, nodeMap, columnInfo, activeSegmentKeys) {
    const segments = [];
    const rootGroups = Array.from(rootTree.children).filter(child => child.classList.contains('category-group'));
    const rootRects = rootGroups.map(group => {
        const card = group.querySelector(':scope > .category-card');
        if (!card) return null;
        const id = card.dataset.categoryId;
        return nodeMap.get(id) || null;
    }).filter(Boolean);
    if (rootRects.length) {
        const rootTrunkX = rootRects.reduce((sum, rect) => sum + rect.centerX, 0) / rootRects.length;
        const trunkStart = Math.min(...rootRects.map(rect => rect.centerY));
        const trunkStop = Math.max(...rootRects.map(rect => rect.centerY));
        segments.push({
            key: `root-trunk:${buildSegmentKey({ orientation: 'vertical', x1: rootTrunkX, y1: trunkStart, x2: rootTrunkX, y2: trunkStop })}`,
            orientation: 'vertical',
            x1: rootTrunkX,
            y1: trunkStart,
            x2: rootTrunkX,
            y2: trunkStop
        });
    }
    columnInfo.forEach((column, parentId) => {
        const parentRect = nodeMap.get(parentId);
        if (!parentRect) return;
        const parentSegment = {
            orientation: 'horizontal',
            x1: parentRect.right,
            y1: parentRect.centerY,
            x2: column.trunkX,
            y2: parentRect.centerY
        };
        const parentKey = buildSegmentKey(parentSegment);
        segments.push({
            key: `parent-connector:${parentId}:${parentKey}`,
            ...parentSegment,
            isActive: activeSegmentKeys.has(parentKey)
        });
        const trunkStart = column.minChildCenterY;
        const trunkStop = column.maxChildCenterY;
        const trunkSegment = {
            orientation: 'vertical',
            x1: column.trunkX,
            y1: trunkStart,
            x2: column.trunkX,
            y2: trunkStop
        };
        const trunkKey = buildSegmentKey(trunkSegment);
        segments.push({
            key: `child-trunk:${parentId}:${trunkKey}`,
            ...trunkSegment,
            isActive: activeSegmentKeys.has(trunkKey)
        });
        column.childCenters.forEach((centerY, childId) => {
            const childRect = nodeMap.get(childId);
            if (!childRect) return;
            const branchSegment = {
                orientation: 'horizontal',
                x1: column.trunkX,
                y1: centerY,
                x2: childRect.left,
                y2: centerY
            };
            const branchKey = buildSegmentKey(branchSegment);
            segments.push({
                key: `child-branch:${parentId}:${childId}:${branchKey}`,
                ...branchSegment,
                isActive: activeSegmentKeys.has(branchKey)
            });
        });
    });
    return segments;
}

function positionLineElement(element, segment, thickness) {
    if (segment.orientation === 'horizontal') {
        const left = Math.min(segment.x1, segment.x2);
        const width = Math.max(1, Math.abs(segment.x2 - segment.x1));
        const top = segment.y1 - (thickness / 2);
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
        element.style.width = `${width}px`;
        element.style.height = `${thickness}px`;
    } else {
        const top = Math.min(segment.y1, segment.y2);
        const height = Math.max(1, Math.abs(segment.y2 - segment.y1));
        const left = segment.x1 - (thickness / 2);
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
        element.style.width = `${thickness}px`;
        element.style.height = `${height}px`;
    }
}

function renderBaseSegments(lineLayer, segments, state, lineThickness) {
    const thickness = Number.isFinite(lineThickness) ? lineThickness : CATEGORY_TREE_LINE_THICKNESS;
    const used = new Set();
    segments.forEach(segment => {
        used.add(segment.key);
        let element = state.baseLines.get(segment.key);
        if (!element) {
            element = document.createElement('div');
            lineLayer.appendChild(element);
            state.baseLines.set(segment.key, element);
        }
        element.className = `category-connector ${segment.isActive ? 'is-active' : ''} ${segment.orientation === 'horizontal' ? 'is-horizontal' : 'is-vertical'}`;
        positionLineElement(element, segment, thickness);
    });
    state.baseLines.forEach((element, key) => {
        if (!used.has(key)) {
            element.remove();
            state.baseLines.delete(key);
        }
    });
}

function buildActivePathSteps(nodeMap, columnInfo, lineThickness) {
    const pathIds = getActivePathIds();
    if (!pathIds.length) return [];
    const thickness = Number.isFinite(lineThickness) ? lineThickness : CATEGORY_TREE_LINE_THICKNESS;
    const steps = [];
    for (let index = pathIds.length - 1; index >= 0; index -= 1) {
        const nodeId = pathIds[index];
        const nodeRect = nodeMap.get(nodeId);
        if (!nodeRect) break;
        const topY = nodeRect.top + (thickness / 2);
        const bottomY = nodeRect.bottom - (thickness / 2);
        const pillStep = {
            kind: 'pill',
            length: Math.max(1, nodeRect.width),
            segments: [
                {
                    orientation: 'horizontal',
                    x1: nodeRect.right,
                    y1: topY,
                    x2: nodeRect.left,
                    y2: topY
                },
                {
                    orientation: 'horizontal',
                    x1: nodeRect.right,
                    y1: bottomY,
                    x2: nodeRect.left,
                    y2: bottomY
                }
            ]
        };
        steps.push(pillStep);
        const parentId = index > 0 ? pathIds[index - 1] : null;
        if (!parentId) break;
        const parentRect = nodeMap.get(parentId);
        const column = columnInfo.get(parentId);
        if (!parentRect || !column) break;
        const branchSegment = {
            orientation: 'horizontal',
            x1: nodeRect.left,
            y1: nodeRect.centerY,
            x2: column.trunkX,
            y2: nodeRect.centerY
        };
        steps.push({
            kind: 'connector',
            length: Math.abs(branchSegment.x2 - branchSegment.x1),
            segments: [branchSegment]
        });
        const verticalSegment = {
            orientation: 'vertical',
            x1: column.trunkX,
            y1: nodeRect.centerY,
            x2: column.trunkX,
            y2: parentRect.centerY
        };
        steps.push({
            kind: 'connector',
            length: Math.abs(verticalSegment.y2 - verticalSegment.y1),
            segments: [verticalSegment]
        });
        const parentSegment = {
            orientation: 'horizontal',
            x1: column.trunkX,
            y1: parentRect.centerY,
            x2: parentRect.right,
            y2: parentRect.centerY
        };
        steps.push({
            kind: 'connector',
            length: Math.abs(parentSegment.x2 - parentSegment.x1),
            segments: [parentSegment]
        });
    }
    return steps.filter(step => step.length > 0);
}

function computeHighlightSegments(steps) {
    if (!steps.length) return [];
    const highlights = [];
    steps.forEach(step => {
        if (step.kind !== 'connector') return;
        step.segments.forEach(segment => {
            highlights.push({
                orientation: segment.orientation,
                x1: segment.x1,
                y1: segment.y1,
                x2: segment.x2,
                y2: segment.y2
            });
        });
    });
    return highlights;
}

function ensureHighlightPool(state, lineLayer, count) {
    while (state.highlightPool.length < count) {
        const element = document.createElement('div');
        element.className = 'category-connector category-connector-highlight';
        lineLayer.appendChild(element);
        state.highlightPool.push(element);
    }
}

function renderCategoryTreeHighlight(state, lineLayer) {
    const highlights = computeHighlightSegments(state.pathSteps);
    const baseThickness = Number.isFinite(state.lineThickness) ? state.lineThickness : CATEGORY_TREE_LINE_THICKNESS;
    ensureHighlightPool(state, lineLayer, highlights.length);
    highlights.forEach((segment, index) => {
        const element = state.highlightPool[index];
        element.style.display = 'block';
        element.classList.toggle('is-horizontal', segment.orientation === 'horizontal');
        element.classList.toggle('is-vertical', segment.orientation === 'vertical');
        positionLineElement(element, segment, baseThickness + 1);
    });
    for (let index = highlights.length; index < state.highlightPool.length; index += 1) {
        state.highlightPool[index].style.display = 'none';
    }
}

function updateActivePathAnimation(state, lineLayer) {
    if (!state.pathSteps.length) {
        state.highlightPool.forEach(element => {
            element.style.display = 'none';
        });
        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
            state.animationId = null;
        }
        return;
    }
    if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = null;
    }
    renderCategoryTreeHighlight(state, lineLayer);
}

function updateCategoryTreeLines(container) {
    if (!container) return;
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;
    const rootTree = getCategoryTreeRoot(container);
    if (!rootTree) return;
    const lineLayer = ensureCategoryTreeLineLayer(contentArea);
    if (!lineLayer) return;
    const state = getCategoryTreeState();
    if (state.activeLineLayer !== lineLayer) {
        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
            state.animationId = null;
        }
        state.activeLineLayer = lineLayer;
    }
    const lineThickness = getLineThickness(lineLayer);
    const lineGap = Math.max(CATEGORY_TREE_LINE_GAP, lineThickness * 2);
    const contentRect = contentArea.getBoundingClientRect();
    const nodeMap = collectCategoryNodeRects(rootTree, contentRect);
    const columnInfo = collectCategoryColumnInfo(rootTree, nodeMap, lineGap);
    const activeSteps = buildActivePathSteps(nodeMap, columnInfo, lineThickness);
    const activeSegmentKeys = buildActiveSegmentKeys(activeSteps);
    const baseSegments = buildBaseSegments(rootTree, nodeMap, columnInfo, activeSegmentKeys);
    renderBaseSegments(lineLayer, baseSegments, state, lineThickness);
    state.pathSteps = activeSteps;
    state.lineThickness = lineThickness;
    updateActivePathAnimation(state, lineLayer);
}

function getCategoryTreeBounds(metricsRoot) {
    if (!metricsRoot) return null;
    const nodes = Array.from(metricsRoot.querySelectorAll('.category-card, .topic-link-item'))
        .filter(node => node.offsetParent && node.getClientRects().length);
    if (!nodes.length) return null;
    let minLeft = Infinity;
    let maxRight = -Infinity;
    let minTop = Infinity;
    let maxBottom = -Infinity;
    nodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        minLeft = Math.min(minLeft, rect.left);
        maxRight = Math.max(maxRight, rect.right);
        minTop = Math.min(minTop, rect.top);
        maxBottom = Math.max(maxBottom, rect.bottom);
    });
    if (!Number.isFinite(minLeft)) return null;
    return {
        left: minLeft,
        right: maxRight,
        top: minTop,
        bottom: maxBottom,
        width: Math.max(1, maxRight - minLeft),
        height: Math.max(1, maxBottom - minTop)
    };
}

function computeCategoryTreeFitScale(metricsRoot, contentRect) {
    if (!metricsRoot || !contentRect) return 1;
    const bounds = getCategoryTreeBounds(metricsRoot);
    if (!bounds) return 1;
    const availableWidth = Math.max(1, contentRect.width - 16);
    const availableHeight = Math.max(1, contentRect.height - 16);
    const usedWidth = bounds.width;
    const usedHeight = bounds.height;
    const scaleX = availableWidth / usedWidth;
    const scaleY = availableHeight / usedHeight;
    const nextScale = Math.min(1, scaleX, scaleY);
    return Math.max(0.55, nextScale);
}

function centerCategoryTreeColumns(metricsRoot, rootTree, contentRect) {
    if (!metricsRoot || !rootTree || !contentRect) return;
    const state = getCategoryTreeState();
    if (state.manualColumnShift) return;
    const candidateTrees = Array.from(metricsRoot.querySelectorAll('.category-children'))
        .filter(tree => tree.children.length && tree.getClientRects().length);
    const rightmostTree = candidateTrees.reduce((current, tree) => {
        if (!current) return tree;
        const rect = tree.getBoundingClientRect();
        const currentRect = current.getBoundingClientRect();
        return rect.left > currentRect.left ? tree : current;
    }, null);
    const activeTree = rightmostTree || metricsRoot;
    const activeBounds = getCategoryTreeBounds(activeTree);
    const bounds = getCategoryTreeBounds(metricsRoot);
    if (!activeBounds || !bounds) return;
    const currentShiftValue = getComputedStyle(rootTree).getPropertyValue('--tree-shift');
    const currentShift = Number.isFinite(parseFloat(currentShiftValue)) ? parseFloat(currentShiftValue) : 0;
    const targetCenterX = contentRect.left + (contentRect.width / 2);
    let delta = targetCenterX - (activeBounds.left + (activeBounds.width / 2));
    const margin = Math.min(18, Math.max(8, contentRect.width * 0.02));
    const minShift = (contentRect.left + margin) - bounds.left;
    const maxShift = (contentRect.right - margin) - bounds.right;
    if (delta < minShift) delta = minShift;
    if (delta > maxShift) delta = maxShift;
    const nextShift = currentShift + delta;
    rootTree.style.setProperty('--tree-shift', `${nextShift}px`);
    if (state.centeringTimer) {
        clearTimeout(state.centeringTimer);
        state.centeringTimer = null;
    }
    if (Math.abs(delta) > 1) {
        state.centeringTimer = setTimeout(() => {
            state.centeringTimer = null;
            updateCategoryTreeMetrics(rootTree);
        }, 360);
    }
}

function updateCategoryTreeMetrics(container) {
    if (!container) return;
    const contentArea = document.getElementById('content-area');
    const rootTree = getCategoryTreeRoot(container);
    const metricsRoot = rootTree || container;
    const state = getCategoryTreeState();
    const fitScale = Number.isFinite(state.fitScale) ? state.fitScale : 1;
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
    const baseShift = contentRect ? Math.min(84, Math.max(32, contentRect.width * 0.045)) : 52;
    const baseRaise = contentRect ? Math.min(26, Math.max(8, contentRect.height * 0.016)) : 18;
    const minShift = contentRect ? Math.max(8, contentRect.width * 0.012) : 8;
    const minRaise = contentRect ? Math.max(3, contentRect.height * 0.008) : 3;
    const shiftForSteps = steps => stepSum(steps, baseShift, 0.6, minShift);
    const raiseForSteps = steps => stepSum(steps, baseRaise, 0.65, minRaise);
    const scaleForSteps = steps => {
        const minScale = 0.5;
        const decay = 0.6;
        return minScale + ((1 - minScale) * Math.pow(decay, steps));
    };
    const desiredShift = level => (hasActiveDepth ? -shiftForSteps(Math.max(0, activeDepth - level)) : 0);
    const desiredBaseRaise = level => {
        const steps = Math.max(0, activeDepth - level);
        return hasActiveDepth ? -raiseForSteps(steps) : 0;
    };
    const desiredRaise = level => desiredBaseRaise(level);
    const desiredScale = level => (hasActiveDepth ? scaleForSteps(Math.max(0, activeDepth - level)) : 1);
    const flowDirection = 'reverse';
    const currentRootShiftValue = rootTree ? getComputedStyle(rootTree).getPropertyValue('--tree-shift') : '';
    const currentRootShift = Number.isFinite(parseFloat(currentRootShiftValue)) ? parseFloat(currentRootShiftValue) : 0;
    let rootShiftOverride = currentRootShift;
    let rootRaiseOverride = desiredRaise(0);
    if (rootTree && metricsRoot === rootTree) {
        rootTree.style.setProperty('--tree-shift', `${rootShiftOverride}px`);
        rootTree.style.setProperty('--tree-raise', `${rootRaiseOverride}px`);
        rootTree.style.setProperty('--tree-scale', `${desiredScale(0) * fitScale}`);
        rootTree.style.setProperty('--connector-flow-direction', flowDirection);
    }
    const trees = [];
    if (metricsRoot.classList.contains('category-tree')) {
        trees.push(metricsRoot);
    }
    trees.push(...metricsRoot.querySelectorAll('.category-tree'));
    trees.forEach(tree => {
        const level = Number(tree.dataset.level || 0);
        const pillScale = getPillScaleForLevel(level);
        const columnShift = getColumnShiftForLevel(level);
        const rowGapScale = getRowGapScaleForLevel(level);
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
        tree.style.setProperty('--tree-scale', `${desiredScale(level) * fitScale}`);
        tree.style.setProperty('--pill-scale', `${pillScale}`);
        tree.style.setProperty('--column-shift', `${columnShift}px`);
        tree.style.setProperty('--row-gap-scale', `${rowGapScale}`);
        tree.style.setProperty('--connector-flow-direction', flowDirection);
        if (tree.classList.contains('category-children') && tree.parentElement?.classList.contains('category-group')) {
            tree.parentElement.style.setProperty('--child-shift', `${shift + columnShift}px`);
        }
        const groups = Array.from(tree.children).filter(child => child.classList.contains('category-group'));
        if (!groups.length) return;
        let maxLabelWidth = 0;
        groups.forEach(group => {
            const directCard = group.querySelector(':scope > .category-card');
            const label = directCard
                ? directCard.querySelector('.category-card-title')
                : group.querySelector(':scope > .topic-link-item');
            group.style.setProperty('--child-shift', '0px');
            if (!label) return;
            const labelWidth = Math.ceil(label.getBoundingClientRect().width);
            group.style.setProperty('--group-label-width', `${labelWidth}px`);
            if (labelWidth > maxLabelWidth) maxLabelWidth = labelWidth;
            const childContainer = group.querySelector(':scope > .category-children');
            if (childContainer && contentRect) {
                const groupRect = group.getBoundingClientRect();
                const childTop = Math.round(contentRect.top - groupRect.top);
                group.style.setProperty('--child-column-top', `${childTop}px`);
            } else {
                group.style.removeProperty('--child-column-top');
            }
        });
        const columnWidth = Math.ceil(maxLabelWidth || 0);
        tree.style.setProperty('--tree-column-width', `${columnWidth}px`);
        groups.forEach(group => {
            group.style.setProperty('--parent-column-width', `${columnWidth}px`);
        });
        const firstGroup = groups[0];
        const lastGroup = groups[groups.length - 1];
        const isRootLevel = tree.dataset.level === '0';
        const start = firstGroup.offsetTop + (firstGroup.offsetHeight / 2);
        const stop = lastGroup.offsetTop + (lastGroup.offsetHeight / 2);
        tree.style.setProperty('--tree-trunk-start', `${start}px`);
        tree.style.setProperty('--tree-trunk-stop', `${stop}px`);
        const activeGroup = groups.find(child => child.classList.contains('is-active-path'));
        if (isRootLevel && activeGroup) {
            const activeStop = activeGroup.offsetTop + (activeGroup.offsetHeight / 2);
            tree.style.setProperty('--tree-trunk-active-stop', `${activeStop}px`);
        } else if (isRootLevel) {
            tree.style.setProperty('--tree-trunk-active-stop', `${start}px`);
        }
    });
    if (contentRect && rootTree && metricsRoot === rootTree) {
        const nextFitScale = computeCategoryTreeFitScale(metricsRoot, contentRect);
        if (Math.abs(nextFitScale - fitScale) > 0.02) {
            state.fitScale = nextFitScale;
            requestAnimationFrame(() => updateCategoryTreeMetrics(metricsRoot));
            return;
        }
    }
    const childColumns = metricsRoot.querySelectorAll('.category-group > .category-children');
    if (childColumns.length && contentArea) {
        const alignChildColumns = () => {
            const nextContentRect = contentArea.getBoundingClientRect();
            childColumns.forEach(childContainer => {
                const group = childContainer.parentElement;
                if (!group) return;
                const groupRect = group.getBoundingClientRect();
                const childTop = Math.round(nextContentRect.top - groupRect.top);
                group.style.setProperty('--child-column-top', `${childTop}px`);
            });
            updateCategoryTreeLines(metricsRoot);
        };
        alignChildColumns();
        if (window.categoryTreeAlignTimer) {
            clearTimeout(window.categoryTreeAlignTimer);
        }
        window.categoryTreeAlignTimer = setTimeout(alignChildColumns, 360);
    }
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
    if (rootTree && contentRect && metricsRoot === rootTree) {
        centerCategoryTreeColumns(metricsRoot, rootTree, contentRect);
    }
    if (contentArea && rootTree && metricsRoot === rootTree) {
        ensureCategorySizeOverlay(contentArea, rootTree);
    }
    applyLayoutScale();
    updateCategoryTreeLines(metricsRoot);
}

// Temporary global exposure
if (typeof window !== 'undefined') {
    window.renderInitialView = renderInitialView;
    window.setDevOverlayVisible = setDevOverlayVisible;
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
