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
const CATEGORY_TREE_LINE_GAP = 10;
const CATEGORY_TREE_ROOT_GAP = 14;
const CATEGORY_TREE_LIGHT_SPEED = 5000;
const CATEGORY_TREE_LIGHT_RATIO = 0.12;
const CATEGORY_TREE_LIGHT_MIN = 36;
const CATEGORY_TREE_LIGHT_MAX = 160;
const CATEGORY_TREE_DRAG_THRESHOLD = 4;

function getCategoryTreeState() {
    if (typeof window === 'undefined') return {};
    if (!window.categoryTreeState) {
        window.categoryTreeState = {
            dragOffsets: new Map(),
            dragActive: null,
            suppressClickId: null,
            lineLayer: null,
            activeLineLayer: null,
            baseLines: new Map(),
            highlightPool: [],
            animationId: null,
            startTime: null,
            lineUpdateHandle: null,
            activePathSignature: '',
            pathSteps: [],
            totalLength: 0,
            lightLength: 0,
            lineThickness: CATEGORY_TREE_LINE_THICKNESS
        };
    }
    return window.categoryTreeState;
}
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
    listContainer.className = 'category-tree-container';
    createHierarchicalList(window.paramedicCategories, listContainer, 0, []);
    contentArea.appendChild(listContainer);
    ensureCategoryTreeLineLayer(contentArea);
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
    listContainer.className = 'category-tree-container';
    createHierarchicalList(window.paramedicCategories, listContainer, 0, []);
    contentArea.appendChild(listContainer);
    ensureCategoryTreeLineLayer(contentArea);
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

function buildBaseSegments(rootTree, nodeMap, columnInfo, activeSegmentKeys, rootGap) {
    const segments = [];
    const gap = Number.isFinite(rootGap) ? rootGap : CATEGORY_TREE_ROOT_GAP;
    const rootGroups = Array.from(rootTree.children).filter(child => child.classList.contains('category-group'));
    const rootRects = rootGroups.map(group => {
        const card = group.querySelector(':scope > .category-card');
        if (!card) return null;
        const id = card.dataset.categoryId;
        return nodeMap.get(id) || null;
    }).filter(Boolean);
    if (rootRects.length) {
        const rootTrunkX = Math.min(...rootRects.map(rect => rect.left)) - gap;
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
        rootRects.forEach((rect, index) => {
            const segment = {
                orientation: 'horizontal',
                x1: rootTrunkX,
                y1: rect.centerY,
                x2: rect.left,
                y2: rect.centerY
            };
            const key = buildSegmentKey(segment);
            segments.push({
                key: `root-branch:${index}:${key}`,
                ...segment,
                isActive: activeSegmentKeys.has(key)
            });
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

function computeHighlightSegments(steps, totalLength, progress, lightLength) {
    if (!steps.length || totalLength <= 0 || lightLength <= 0) return [];
    const windows = [];
    const end = progress + lightLength;
    if (end <= totalLength) {
        windows.push([progress, end]);
    } else {
        windows.push([progress, totalLength]);
        windows.push([0, end - totalLength]);
    }
    const highlights = [];
    let cursor = 0;
    steps.forEach(step => {
        const stepStart = cursor;
        const stepEnd = cursor + step.length;
        windows.forEach(window => {
            const overlapStart = Math.max(stepStart, window[0]);
            const overlapEnd = Math.min(stepEnd, window[1]);
            if (overlapEnd <= overlapStart) return;
            const localStart = overlapStart - stepStart;
            const localLength = overlapEnd - overlapStart;
            step.segments.forEach(segment => {
                const dx = segment.x2 - segment.x1;
                const dy = segment.y2 - segment.y1;
                const dirX = dx === 0 ? 0 : dx / Math.abs(dx);
                const dirY = dy === 0 ? 0 : dy / Math.abs(dy);
                const startX = segment.x1 + (dirX * localStart);
                const startY = segment.y1 + (dirY * localStart);
                const endX = segment.x1 + (dirX * (localStart + localLength));
                const endY = segment.y1 + (dirY * (localStart + localLength));
                highlights.push({
                    orientation: segment.orientation,
                    x1: startX,
                    y1: startY,
                    x2: endX,
                    y2: endY
                });
            });
        });
        cursor = stepEnd;
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

function renderCategoryTreeHighlight(state, lineLayer, progress) {
    const highlights = computeHighlightSegments(state.pathSteps, state.totalLength, progress, state.lightLength);
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
    if (!state.totalLength) {
        state.highlightPool.forEach(element => {
            element.style.display = 'none';
        });
        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
            state.animationId = null;
        }
        state.startTime = null;
        return;
    }
    if (state.animationId) return;
    const tick = timestamp => {
        if (!state.startTime) state.startTime = timestamp;
        const elapsed = (timestamp - state.startTime) % CATEGORY_TREE_LIGHT_SPEED;
        const progress = (elapsed / CATEGORY_TREE_LIGHT_SPEED) * state.totalLength;
        renderCategoryTreeHighlight(state, lineLayer, progress);
        state.animationId = requestAnimationFrame(tick);
    };
    state.animationId = requestAnimationFrame(tick);
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
        state.startTime = null;
        state.activeLineLayer = lineLayer;
    }
    const lineThickness = getLineThickness(rootTree);
    const lineGap = Math.max(CATEGORY_TREE_LINE_GAP, lineThickness * 2);
    const rootGap = Math.max(CATEGORY_TREE_ROOT_GAP, lineThickness * 2.5);
    const contentRect = contentArea.getBoundingClientRect();
    const nodeMap = collectCategoryNodeRects(rootTree, contentRect);
    const columnInfo = collectCategoryColumnInfo(rootTree, nodeMap, lineGap);
    const activeSteps = buildActivePathSteps(nodeMap, columnInfo, lineThickness);
    const activeSegmentKeys = buildActiveSegmentKeys(activeSteps);
    const baseSegments = buildBaseSegments(rootTree, nodeMap, columnInfo, activeSegmentKeys, rootGap);
    const activeSignature = getActivePathIds().join('|');
    if (state.activePathSignature !== activeSignature) {
        state.activePathSignature = activeSignature;
        state.startTime = null;
    }
    renderBaseSegments(lineLayer, baseSegments, state, lineThickness);
    state.pathSteps = activeSteps;
    state.totalLength = activeSteps.reduce((sum, step) => sum + step.length, 0);
    if (state.totalLength) {
        const rawLength = state.totalLength * CATEGORY_TREE_LIGHT_RATIO;
        state.lightLength = Math.max(CATEGORY_TREE_LIGHT_MIN, Math.min(CATEGORY_TREE_LIGHT_MAX, rawLength));
    } else {
        state.lightLength = 0;
    }
    state.lineThickness = lineThickness;
    updateActivePathAnimation(state, lineLayer);
}

function updateCategoryTreeMetrics(container) {
    if (!container) return;
    const contentArea = document.getElementById('content-area');
    const rootTree = getCategoryTreeRoot(container);
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
        const decay = 0.4;
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
        if (tree.classList.contains('category-children') && tree.parentElement?.classList.contains('category-group')) {
            tree.parentElement.style.setProperty('--child-shift', `${shift}px`);
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
            if (!childContainer || !contentRect) {
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
        const start = isRootLevel
            ? firstGroup.offsetTop
            : firstGroup.offsetTop + (firstGroup.offsetHeight / 2);
        const stop = isRootLevel
            ? lastGroup.offsetTop + lastGroup.offsetHeight
            : lastGroup.offsetTop + (lastGroup.offsetHeight / 2);
        tree.style.setProperty('--tree-trunk-start', `${start}px`);
        tree.style.setProperty('--tree-trunk-stop', `${stop}px`);
        const activeGroup = groups.find(child => child.classList.contains('is-active-path'));
        if (isRootLevel && activeGroup) {
            const activeStop = activeGroup.offsetTop + activeGroup.offsetHeight;
            tree.style.setProperty('--tree-trunk-active-stop', `${activeStop}px`);
        } else if (isRootLevel) {
            tree.style.setProperty('--tree-trunk-active-stop', `${start}px`);
        }
    });
    if (rootTree && contentRect) {
        const activeAnchor = getActiveAnchor(metricsRoot);
        const activeTree = activeAnchor ? activeAnchor.closest('.category-tree') : null;
        if (activeTree) {
            const activeRect = activeTree.getBoundingClientRect();
            const rootRect = rootTree.getBoundingClientRect();
            const targetCenterX = contentRect.left + (contentRect.width / 2);
            const activeCenterX = activeRect.left + (activeRect.width / 2);
            let extraShift = targetCenterX - activeCenterX;
            const margin = Math.min(32, Math.max(12, contentRect.width * 0.04));
            const minShift = (contentRect.left + margin) - rootRect.left;
            const maxShift = (contentRect.right - margin) - rootRect.right;
            if (extraShift < minShift) extraShift = minShift;
            if (extraShift > maxShift) extraShift = maxShift;
            rootShiftOverride += extraShift;
            rootTree.style.setProperty('--tree-shift', `${rootShiftOverride}px`);
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
    updateCategoryTreeLines(metricsRoot);
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
