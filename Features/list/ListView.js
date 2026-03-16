// Features/list/ListView.js – Category list rendering
//import './Features/navigation/Navigation.js';
//import './Features/detail/DetailPage.js';
//import './Utils/addTapListener'
import { addHistoryEntry, updateNavButtonsState } from '../navigation/Navigation.js';
import { renderDetailPageFromPill } from '../detail/DetailPage.js';
import { resetDetailSpaceClasses } from '../detail/detailSpaceUtils.js';
import { addTapListener } from '../../Utils/addTapListener.js';
import { buildSpiderwebContext, getSpiderwebNodeState } from './spiderwebContext.js';
// import { addHistoryEntry, updateNavButtonsState, attachNavHandlers } from './Features/navigation/Navigation.js';
// import { renderDetailPage } from './Features/detail/DetailPage.js';
// import { addTapListener } from '../../Utils/addTapListener.js';

const CATEGORY_TREE_LINE_THICKNESS = 4;
const CATEGORY_TREE_LINE_GAP = 8;
const CATEGORY_TREE_DRAG_THRESHOLD = 4;
const CATEGORY_TREE_TRANSITION_MS = 360;
const ROW_GAP_PERCENT_BOOST = 2.5;
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
const DEFAULT_HEADER_ROOM_SCALE = 0.01;
const DEFAULT_FOOTER_ROOM_SCALE = 0.5;
const DEFAULT_COLUMN_SETTINGS = { scale: 1, shift: 0, spacing: 100, raise: 0 };
const OVERLAY_DEFAULTS = {
    sizePercent: 100,
    spacingPercent: 100,
    shiftPx: 0,
    raisePx: 0
};
const COLUMN_BASELINE_PROFILES = {
    1: [
        { size: 220, shift: 0, spacing: 530 }
    ],
    2: [
        { size: 160, shift: 60, spacing: 295 },
        { size: 220, shift: 0, spacing: 530 }
    ],
    3: [
        { size: 160, shift: -12, spacing: 290 },
        { size: 160, shift: -36, spacing: 295 },
        { size: 220, shift: 24, spacing: 400 }
    ],
    4: [
        { size: 125, shift: -60, spacing: 1 },
        { size: 115, shift: -24, spacing: 270 },
        { size: 120, shift: 0, spacing: 80 },
        { size: 220, shift: -12, spacing: 400 }
    ]
};

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
            lineUpdateHandle: null,
            transitionSyncId: null,
            transitionSyncUntil: 0,
            fitScale: 1,
            pathSteps: [],
            lineThickness: CATEGORY_TREE_LINE_THICKNESS,
            centeringTimer: null,
            pillScaleByLevel: new Map(),
            columnShiftByLevel: new Map(),
            columnRaiseByLevel: new Map(),
            rowGapPercentByLevel: new Map(),
            columnBaselineByLevel: new Map(),
            baselineLevelsKey: '',
            overlayLevelsKey: '',
            overlayHidden: true,
            layoutDirty: false,
            layoutKey: '',
            fitScalePass: 0,
            centeringPass: 0,
            alignPass: 0,
            alignTimer: null,
            manualColumnShift: false,
            headerScale: DEFAULT_HEADER_ROOM_SCALE,
            headerContentScale: 1,
            headerOffsetX: 0,
            headerOffsetY: 0,
            footerScale: DEFAULT_FOOTER_ROOM_SCALE,
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

function applyExplicitNavigationState(highlightId = null, categoryPath = []) {
    const hasExplicitPath = Array.isArray(categoryPath) && categoryPath.length > 0;
    if (hasExplicitPath) {
        categoryPath.forEach(catId => {
            const catItem = window.allDisplayableTopicsMap?.[catId];
            if (catItem?.type === 'category') {
                catItem.expanded = true;
            }
        });
        window.activeCategoryPath = [...categoryPath];
    }
    if (highlightId) {
        window.activeTopicId = highlightId;
    } else if (hasExplicitPath) {
        window.activeTopicId = null;
    }
}

function buildCurrentSpiderwebContext() {
    const context = buildSpiderwebContext(window.paramedicCategories, {
        patientData: window.patientData || {},
        searchTerm: window.searchInput?.value || '',
        activeCategoryPath: window.activeCategoryPath || [],
        activeTopicId: window.activeTopicId || null,
        pediatricAgeThreshold: Number(window.PEDIATRIC_AGE_THRESHOLD) || 18
    });
    window.spiderwebContext = context;
    return context;
}

function scheduleTreeMetricsPass(rootContainer) {
    if (!rootContainer) return;
    requestAnimationFrame(() => {
        updateCategoryTreeMetrics(rootContainer);
        window.setTimeout(() => updateCategoryTreeMetrics(rootContainer), 120);
        window.setTimeout(() => updateCategoryTreeMetrics(rootContainer), 320);
    });
}
// Renders the main category list view (home screen) and highlights a topic if provided.
export function renderInitialView(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    const contentArea = window.contentArea || document.getElementById('content-area');
    resetDetailSpaceClasses(contentArea);
    contentArea.classList.add('spiderweb-mode');
    contentArea.classList.remove('detail-transition-shell', 'detail-transition-entered', 'detail-transition-out');
    contentArea.innerHTML = '';
    resetCategoryTreeAnimation();
    if (!Array.isArray(window.activeCategoryPath)) {
        window.activeCategoryPath = [];
    }
    applyExplicitNavigationState(highlightId, categoryPath);
    buildCurrentSpiderwebContext();
    // Render the hierarchical list of all categories
    const listContainer = document.createElement('div');
    listContainer.className = 'category-tree-container';
    createHierarchicalList(window.paramedicCategories, listContainer, 0, []);
    contentArea.appendChild(listContainer);
    ensureCategoryTreeLineLayer(contentArea);
    ensureCategorySizeOverlay(contentArea, listContainer);
    scheduleTreeMetricsPass(listContainer);
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

// Scroll the highlighted topic into view after the current spiderweb state renders.
function openCategoriesAndHighlight(categoryPath = [], highlightId = null) {
    const contentArea = window.contentArea || document.getElementById('content-area');
    void categoryPath;
    if (!contentArea) return;
    if (highlightId) { 
        const topicEl = contentArea.querySelector(`.topic-link-item[data-topic-id="${highlightId}"]`);
        if (topicEl) {
            topicEl.classList.add('recently-viewed'); 
            topicEl.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
    }
}

function getEffectiveCategoryExpanded(item, spiderwebContext) {
    return Boolean(item?.expanded || spiderwebContext?.autoExpandedIds?.has(item?.id));
}

function applySpiderwebPresentation(pill, group, presentation) {
    if (!pill) return;
    const scale = presentation?.scale ?? 1;
    const opacity = presentation?.opacity ?? 1;
    pill.style.setProperty('--node-scale', `${scale}`);
    pill.style.setProperty('--node-opacity', `${opacity}`);
    pill.dataset.emphasis = presentation?.tier || 'default';
    pill.classList.toggle('is-context-match', Boolean(presentation?.isRelevant || presentation?.isSearchHit));
    pill.classList.toggle('is-context-branch', Boolean(presentation?.isRelevantBranch || presentation?.isSearchBranch));
    pill.classList.toggle('is-age-mismatch', Boolean(presentation?.isAgeMismatch));
    if (!group) return;
    group.dataset.tier = presentation?.tier || 'default';
    group.classList.toggle('is-context-muted', presentation?.tier === 'muted');
    group.classList.toggle('is-context-match', Boolean(presentation?.isRelevant || presentation?.isSearchHit));
    group.classList.toggle('is-context-branch', Boolean(presentation?.isRelevantBranch || presentation?.isSearchBranch));
    group.classList.toggle('is-age-mismatch', Boolean(presentation?.isAgeMismatch));
    group.classList.toggle('is-active-path', Boolean(presentation?.isInActivePath));
    group.classList.toggle('is-focus-node', Boolean(presentation?.isFocus));
}

// Builds a nested list of categories and topics, appending it to the given container. Handles expandable categories.
function createHierarchicalList(items, container, level = 0, path = []) {
    const spiderwebContext = window.spiderwebContext || buildCurrentSpiderwebContext();
    container.innerHTML = '';
    container.classList.add('category-tree');
    container.dataset.level = String(level);
    container.style.setProperty('--category-level', level);
    const hasExpanded = items.some(item => item.type === 'category' && getEffectiveCategoryExpanded(item, spiderwebContext));
    container.classList.toggle('has-expanded', hasExpanded);
    container.classList.toggle('has-context-signal', Boolean(spiderwebContext?.hasContextSignal));
    const hasActivePath = items.some(item => spiderwebContext?.activePathIds?.includes(item.id));
    container.classList.toggle('has-active-path', hasActivePath);
    items.forEach(item => { 
        const currentPath = [...path, item.id];
        const presentation = getSpiderwebNodeState(spiderwebContext, item.id);
        const isExpanded = item.type === 'category' && getEffectiveCategoryExpanded(item, spiderwebContext);
        const group = document.createElement('div');
        group.className = 'category-group';
        if (level === 0) {
            group.classList.add('is-root');
        }
        if (isExpanded) {
            group.classList.add('is-expanded');
        }
        group.style.setProperty('--category-level', level);
        if (item.type === 'category') {  // Category with collapsible children
            group.dataset.categoryId = item.id;
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'category-card';
            card.dataset.categoryId = item.id;
            if (isExpanded) card.classList.add('is-expanded');
            if (presentation?.isInActivePath) {
                card.classList.add('is-active-path');
            }
            card.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            const label = document.createElement('span');
            label.className = 'category-card-title';
            label.textContent = item.title;
            if (item.title === 'Quick Vent Guide') {
                label.classList.add('quick-vent-title');
            }
            card.append(label);
            applySpiderwebPresentation(card, group, presentation);
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
                    buildCurrentSpiderwebContext();
                    createHierarchicalList(window.paramedicCategories, rootContainer, 0, []);
                } else {
                    buildCurrentSpiderwebContext();
                    createHierarchicalList(items, container, level, path);
                }
            });
            group.appendChild(card);
            if (isExpanded && item.children?.length) {
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
                buildCurrentSpiderwebContext();
                renderDetailPageFromPill(item.id, topicLink); 
            });
            applySpiderwebPresentation(topicLink, group, presentation);
            if (presentation?.isInActivePath) {
                topicLink.classList.add('is-active-path');
            }
            group.appendChild(topicLink);
            container.appendChild(group);
        }
    });
    if (level === 0) {
        scheduleTreeMetricsPass(container);
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
    element.style.translate = '0px 0px';
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

function updateCategoryTreeChildColumnTops(metricsRoot, contentArea) {
    if (!metricsRoot || !contentArea) return;
    const childColumns = metricsRoot.querySelectorAll('.category-group > .category-children');
    if (!childColumns.length) return;
    const contentRect = contentArea.getBoundingClientRect();
    childColumns.forEach(childContainer => {
        const group = childContainer.parentElement;
        if (!group) return;
        const groupRect = group.getBoundingClientRect();
        const childTop = Math.round(contentRect.top - groupRect.top);
        group.style.setProperty('--child-column-top', `${childTop}px`);
    });
}

function scheduleCategoryTreeTransitionSync(source) {
    if (!source || typeof window === 'undefined') return;
    const state = getCategoryTreeState();
    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const nextUntil = now + CATEGORY_TREE_TRANSITION_MS;
    state.transitionSyncUntil = Math.max(state.transitionSyncUntil || 0, nextUntil);
    if (state.transitionSyncId) return;
    const tick = () => {
        state.transitionSyncId = null;
        const rootTree = getCategoryTreeRoot(source) || source;
        if (!rootTree || !rootTree.isConnected) {
            state.transitionSyncUntil = 0;
            return;
        }
        const contentArea = document.getElementById('content-area');
        if (!contentArea) {
            state.transitionSyncUntil = 0;
            return;
        }
        updateCategoryTreeChildColumnTops(rootTree, contentArea);
        updateCategoryTreeLines(rootTree);
        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        if (state.transitionSyncUntil && now < state.transitionSyncUntil) {
            state.transitionSyncId = requestAnimationFrame(tick);
        } else {
            state.transitionSyncUntil = 0;
        }
    };
    state.transitionSyncId = requestAnimationFrame(tick);
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

function buildColumnBaselines(levels) {
    const profile = COLUMN_BASELINE_PROFILES[levels.length] || [];
    const baseline = new Map();
    levels.forEach((level, index) => {
        const entry = profile[index] || {};
        baseline.set(level, {
            scale: Number.isFinite(entry.size) ? entry.size / 100 : DEFAULT_COLUMN_SETTINGS.scale,
            shift: Number.isFinite(entry.shift) ? entry.shift : DEFAULT_COLUMN_SETTINGS.shift,
            spacing: Number.isFinite(entry.spacing) ? entry.spacing : DEFAULT_COLUMN_SETTINGS.spacing,
            raise: Number.isFinite(entry.raise) ? entry.raise : DEFAULT_COLUMN_SETTINGS.raise
        });
    });
    return baseline;
}

function ensureColumnBaselines(levels) {
    const state = getCategoryTreeState();
    if (!Array.isArray(levels) || !levels.length) {
        state.columnBaselineByLevel = new Map();
        state.baselineLevelsKey = '';
        updateManualColumnShiftFlag(state);
        return;
    }
    const levelsKey = levels.join(',');
    if (levelsKey === state.baselineLevelsKey && state.columnBaselineByLevel?.size) return;
    state.columnBaselineByLevel = buildColumnBaselines(levels);
    state.baselineLevelsKey = levelsKey;
    updateManualColumnShiftFlag(state);
}

function getColumnBaselineForLevel(level) {
    const state = getCategoryTreeState();
    const baseline = state.columnBaselineByLevel?.get(level);
    return baseline || DEFAULT_COLUMN_SETTINGS;
}

function getOverlaySizePercent(level) {
    const state = getCategoryTreeState();
    const stored = state.pillScaleByLevel.get(level);
    if (!Number.isFinite(stored)) return OVERLAY_DEFAULTS.sizePercent;
    const baseline = getColumnBaselineForLevel(level).scale || 1;
    return (stored / baseline) * 100;
}

function getOverlayShiftPx(level) {
    const state = getCategoryTreeState();
    const stored = state.columnShiftByLevel.get(level);
    if (!Number.isFinite(stored)) return OVERLAY_DEFAULTS.shiftPx;
    return stored - getColumnBaselineForLevel(level).shift;
}

function getOverlayRaisePx(level) {
    const state = getCategoryTreeState();
    const stored = state.columnRaiseByLevel.get(level);
    if (!Number.isFinite(stored)) return OVERLAY_DEFAULTS.raisePx;
    return stored - getColumnBaselineForLevel(level).raise;
}

function getOverlaySpacingPercent(level) {
    const state = getCategoryTreeState();
    const stored = state.rowGapPercentByLevel.get(level);
    if (!Number.isFinite(stored)) return OVERLAY_DEFAULTS.spacingPercent;
    const baseline = getColumnBaselineForLevel(level).spacing || 1;
    return (stored / baseline) * 100;
}

function markLayoutDirty() {
    const state = getCategoryTreeState();
    state.layoutDirty = true;
}

function applyOverlaySizePercent(level, percent) {
    const baseline = getColumnBaselineForLevel(level).scale || 1;
    markLayoutDirty();
    return setPillScaleForLevel(level, baseline * (percent / 100));
}

function applyOverlayShiftPx(level, shift) {
    const baseline = getColumnBaselineForLevel(level).shift || 0;
    markLayoutDirty();
    return setColumnShiftForLevel(level, baseline + shift);
}

function applyOverlayRaisePx(level, raise) {
    const baseline = getColumnBaselineForLevel(level).raise || 0;
    markLayoutDirty();
    return setColumnRaiseForLevel(level, baseline + raise);
}

function applyOverlaySpacingPercent(level, percent) {
    const baseline = getColumnBaselineForLevel(level).spacing || 1;
    markLayoutDirty();
    return setRowGapPercentForLevel(level, baseline * (percent / 100));
}

function getPillScaleForLevel(level) {
    const state = getCategoryTreeState();
    const stored = state.pillScaleByLevel.get(level);
    return Number.isFinite(stored) ? stored : getColumnBaselineForLevel(level).scale;
}

function setPillScaleForLevel(level, scale) {
    const state = getCategoryTreeState();
    const nextScale = Math.min(10, Math.max(0.01, scale));
    state.pillScaleByLevel.set(level, nextScale);
    return nextScale;
}

function getColumnShiftForLevel(level) {
    const state = getCategoryTreeState();
    const stored = state.columnShiftByLevel.get(level);
    return Number.isFinite(stored) ? stored : getColumnBaselineForLevel(level).shift;
}

function updateManualColumnShiftFlag(state) {
    if (!state.columnBaselineByLevel || !state.columnBaselineByLevel.size) {
        state.manualColumnShift = Array.from(state.columnShiftByLevel.values())
            .some(value => Number.isFinite(value) && Math.abs(value) > 0.5);
        return;
    }
    let manual = false;
    state.columnBaselineByLevel.forEach((baseline, level) => {
        const value = state.columnShiftByLevel.get(level);
        if (!Number.isFinite(value)) return;
        if (Math.abs(value - baseline.shift) > 0.5) {
            manual = true;
        }
    });
    state.manualColumnShift = manual;
}

function setColumnShiftForLevel(level, shift) {
    const state = getCategoryTreeState();
    const nextShift = Math.min(1000, Math.max(-1000, shift));
    state.columnShiftByLevel.set(level, nextShift);
    updateManualColumnShiftFlag(state);
    return nextShift;
}

function getColumnRaiseForLevel(level) {
    const state = getCategoryTreeState();
    const stored = state.columnRaiseByLevel.get(level);
    return Number.isFinite(stored) ? stored : getColumnBaselineForLevel(level).raise;
}

function setColumnRaiseForLevel(level, raise) {
    const state = getCategoryTreeState();
    const nextRaise = Math.min(1000, Math.max(-1000, raise));
    state.columnRaiseByLevel.set(level, nextRaise);
    return nextRaise;
}

function getRowGapPercentForLevel(level) {
    const state = getCategoryTreeState();
    const stored = state.rowGapPercentByLevel.get(level);
    return Number.isFinite(stored) ? stored : getColumnBaselineForLevel(level).spacing;
}

function setRowGapPercentForLevel(level, percent) {
    const state = getCategoryTreeState();
    const nextPercent = Math.min(1000, Math.max(1, percent));
    state.rowGapPercentByLevel.set(level, nextPercent);
    return nextPercent;
}

function getRowGapScaleForLevel(level) {
    const percent = getRowGapPercentForLevel(level);
    const base = percent / 100;
    const boosted = 1 + ((base - 1) * ROW_GAP_PERCENT_BOOST);
    return Math.max(0.01, boosted);
}

function getHeaderScale() {
    const state = getCategoryTreeState();
    return Number.isFinite(state.headerScale) ? state.headerScale : DEFAULT_HEADER_ROOM_SCALE;
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
    return Number.isFinite(state.footerScale) ? state.footerScale : DEFAULT_FOOTER_ROOM_SCALE;
}

function setHeaderScale(scale) {
    const state = getCategoryTreeState();
    const nextScale = Math.min(10, Math.max(0.001, scale));
    state.headerScale = nextScale;
    return nextScale;
}

function setHeaderContentScale(scale) {
    const state = getCategoryTreeState();
    const nextScale = Math.min(10, Math.max(0.01, scale));
    state.headerContentScale = nextScale;
    return nextScale;
}

function setHeaderOffsetX(value) {
    const state = getCategoryTreeState();
    const nextValue = Math.min(1000, Math.max(-1000, value));
    state.headerOffsetX = nextValue;
    return nextValue;
}

function setHeaderOffsetY(value) {
    const state = getCategoryTreeState();
    const nextValue = Math.min(1000, Math.max(-1000, value));
    state.headerOffsetY = nextValue;
    return nextValue;
}

function setFooterScale(scale) {
    const state = getCategoryTreeState();
    const nextScale = Math.min(10, Math.max(0.01, scale));
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
    const nextScale = Math.min(10, Math.max(0.01, scale));
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
    const nextValue = Math.min(1000, Math.max(-1000, value));
    state.headerElementOffsetX.set(key, nextValue);
    return nextValue;
}

function setHeaderElementOffsetY(key, value) {
    const state = getCategoryTreeState();
    const nextValue = Math.min(1000, Math.max(-1000, value));
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
    const nextScale = Math.min(10, Math.max(0.01, scale));
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
    const nextValue = Math.min(1000, Math.max(-1000, value));
    state.footerElementOffsetX.set(key, nextValue);
    return nextValue;
}

function setFooterElementOffsetY(key, value) {
    const state = getCategoryTreeState();
    const nextValue = Math.min(1000, Math.max(-1000, value));
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

function formatOverlayNumber(value, decimals = 1) {
    if (!Number.isFinite(value)) return '';
    const rounded = Number(value.toFixed(decimals));
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(decimals);
}

function setOverlayValue(element, value, decimals = 1) {
    if (!element) return;
    const formatted = formatOverlayNumber(value, decimals);
    if (typeof HTMLInputElement !== 'undefined' && element instanceof HTMLInputElement) {
        if (document.activeElement !== element) {
            element.value = formatted;
        }
        return;
    }
    element.textContent = formatted;
}

function updateCategorySizeOverlayValues(overlay) {
    if (!overlay) return;
    overlay.querySelectorAll('.category-size-row').forEach(row => {
        const level = Number(row.dataset.level || 0);
        const sizeValue = row.querySelector('[data-value="size"]');
        const shiftValue = row.querySelector('[data-value="shift"]');
        const raiseValue = row.querySelector('[data-value="raise"]');
        const spacingValue = row.querySelector('[data-value="spacing"]');
        setOverlayValue(sizeValue, getOverlaySizePercent(level), 2);
        setOverlayValue(shiftValue, getOverlayShiftPx(level), 1);
        setOverlayValue(raiseValue, getOverlayRaisePx(level), 1);
        setOverlayValue(spacingValue, getOverlaySpacingPercent(level), 2);
    });
    const headerRoomValue = overlay.querySelector('[data-value="header-room-scale"]');
    setOverlayValue(headerRoomValue, getHeaderScale() * 100, 2);
    const headerContentValue = overlay.querySelector('[data-value="header-content-scale"]');
    setOverlayValue(headerContentValue, getHeaderContentScale() * 100, 2);
    const headerOffsetXValue = overlay.querySelector('[data-value="header-offset-x"]');
    setOverlayValue(headerOffsetXValue, getHeaderOffsetX(), 1);
    const headerOffsetYValue = overlay.querySelector('[data-value="header-offset-y"]');
    setOverlayValue(headerOffsetYValue, getHeaderOffsetY(), 1);
    const footerRoomValue = overlay.querySelector('[data-value="footer-room-scale"]');
    setOverlayValue(footerRoomValue, getFooterScale() * 100, 2);
    HEADER_ELEMENT_DEFS.forEach(def => {
        const sizeValue = overlay.querySelector(`[data-value="header-${def.key}-scale"]`);
        setOverlayValue(sizeValue, getHeaderElementScale(def.key) * 100, 2);
        const xValue = overlay.querySelector(`[data-value="header-${def.key}-x"]`);
        setOverlayValue(xValue, getHeaderElementOffsetX(def.key), 1);
        const yValue = overlay.querySelector(`[data-value="header-${def.key}-y"]`);
        setOverlayValue(yValue, getHeaderElementOffsetY(def.key), 1);
    });
    FOOTER_ELEMENT_DEFS.forEach(def => {
        const sizeValue = overlay.querySelector(`[data-value="footer-${def.key}-scale"]`);
        setOverlayValue(sizeValue, getFooterElementScale(def.key) * 100, 2);
        const xValue = overlay.querySelector(`[data-value="footer-${def.key}-x"]`);
        setOverlayValue(xValue, getFooterElementOffsetX(def.key), 1);
        const yValue = overlay.querySelector(`[data-value="footer-${def.key}-y"]`);
        setOverlayValue(yValue, getFooterElementOffsetY(def.key), 1);
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
        sizeLabel.textContent = 'Size (%)';
        const downButton = document.createElement('button');
        downButton.type = 'button';
        downButton.className = 'category-size-btn';
        downButton.dataset.action = 'size';
        downButton.dataset.dir = 'down';
        downButton.dataset.level = String(level);
        downButton.setAttribute('aria-label', `Decrease column ${level + 1} pill size`);
        downButton.textContent = '-';
        const sizeValue = document.createElement('input');
        sizeValue.type = 'number';
        sizeValue.className = 'category-size-input category-size-value';
        sizeValue.dataset.value = 'size';
        sizeValue.dataset.action = 'size';
        sizeValue.dataset.level = String(level);
        sizeValue.setAttribute('aria-label', `Column ${level + 1} size percent`);
        sizeValue.min = '1';
        sizeValue.max = '1000';
        sizeValue.step = '0.1';
        sizeValue.value = '100';
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
        shiftLabel.textContent = 'Shift (px)';
        const leftButton = document.createElement('button');
        leftButton.type = 'button';
        leftButton.className = 'category-size-btn';
        leftButton.dataset.action = 'shift';
        leftButton.dataset.dir = 'left';
        leftButton.dataset.level = String(level);
        leftButton.setAttribute('aria-label', `Move column ${level + 1} left`);
        leftButton.textContent = '<';
        const shiftValue = document.createElement('input');
        shiftValue.type = 'number';
        shiftValue.className = 'category-size-input category-size-value';
        shiftValue.dataset.value = 'shift';
        shiftValue.dataset.action = 'shift';
        shiftValue.dataset.level = String(level);
        shiftValue.setAttribute('aria-label', `Column ${level + 1} shift in pixels`);
        shiftValue.min = '-1000';
        shiftValue.max = '1000';
        shiftValue.step = '1';
        shiftValue.value = '0';
        const rightButton = document.createElement('button');
        rightButton.type = 'button';
        rightButton.className = 'category-size-btn';
        rightButton.dataset.action = 'shift';
        rightButton.dataset.dir = 'right';
        rightButton.dataset.level = String(level);
        rightButton.setAttribute('aria-label', `Move column ${level + 1} right`);
        rightButton.textContent = '>';
        shiftGroup.append(shiftLabel, leftButton, shiftValue, rightButton);

        const raiseGroup = document.createElement('div');
        raiseGroup.className = 'category-size-control-group';
        const raiseLabel = document.createElement('span');
        raiseLabel.className = 'category-size-control-label';
        raiseLabel.textContent = 'Move Y (px)';
        const raiseDown = document.createElement('button');
        raiseDown.type = 'button';
        raiseDown.className = 'category-size-btn';
        raiseDown.dataset.action = 'raise';
        raiseDown.dataset.dir = 'down';
        raiseDown.dataset.level = String(level);
        raiseDown.setAttribute('aria-label', `Move column ${level + 1} down`);
        raiseDown.textContent = 'v';
        const raiseValue = document.createElement('input');
        raiseValue.type = 'number';
        raiseValue.className = 'category-size-input category-size-value';
        raiseValue.dataset.value = 'raise';
        raiseValue.dataset.action = 'raise';
        raiseValue.dataset.level = String(level);
        raiseValue.setAttribute('aria-label', `Column ${level + 1} vertical move in pixels`);
        raiseValue.min = '-1000';
        raiseValue.max = '1000';
        raiseValue.step = '1';
        raiseValue.value = '0';
        const raiseUp = document.createElement('button');
        raiseUp.type = 'button';
        raiseUp.className = 'category-size-btn';
        raiseUp.dataset.action = 'raise';
        raiseUp.dataset.dir = 'up';
        raiseUp.dataset.level = String(level);
        raiseUp.setAttribute('aria-label', `Move column ${level + 1} up`);
        raiseUp.textContent = '^';
        raiseGroup.append(raiseLabel, raiseDown, raiseValue, raiseUp);

        const spacingGroup = document.createElement('div');
        spacingGroup.className = 'category-size-control-group';
        const spacingLabel = document.createElement('span');
        spacingLabel.className = 'category-size-control-label';
        spacingLabel.textContent = 'Spacing (%)';
        const spacingDown = document.createElement('button');
        spacingDown.type = 'button';
        spacingDown.className = 'category-size-btn';
        spacingDown.dataset.action = 'spacing';
        spacingDown.dataset.dir = 'down';
        spacingDown.dataset.level = String(level);
        spacingDown.setAttribute('aria-label', `Decrease column ${level + 1} spacing`);
        spacingDown.textContent = '-';
        const spacingValue = document.createElement('input');
        spacingValue.type = 'number';
        spacingValue.className = 'category-size-input category-size-value';
        spacingValue.dataset.value = 'spacing';
        spacingValue.dataset.action = 'spacing';
        spacingValue.dataset.level = String(level);
        spacingValue.setAttribute('aria-label', `Column ${level + 1} spacing percent`);
        spacingValue.min = '1';
        spacingValue.max = '1000';
        spacingValue.step = '0.1';
        spacingValue.value = '100';
        const spacingUp = document.createElement('button');
        spacingUp.type = 'button';
        spacingUp.className = 'category-size-btn';
        spacingUp.dataset.action = 'spacing';
        spacingUp.dataset.dir = 'up';
        spacingUp.dataset.level = String(level);
        spacingUp.setAttribute('aria-label', `Increase column ${level + 1} spacing`);
        spacingUp.textContent = '+';
        spacingGroup.append(spacingLabel, spacingDown, spacingValue, spacingUp);

        controlStack.append(sizeGroup, shiftGroup, raiseGroup, spacingGroup);
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
            label: 'Header Room (%)',
            action: 'layout-scale',
            target: 'header-room',
            valueKey: 'header-room-scale',
            unit: 'percent',
            min: 0.1,
            step: 0.1,
            controls: { down: '-', up: '+' },
            aria: { down: 'Decrease header room', up: 'Increase header room' },
            inputAria: 'Header room percent'
        },
        {
            label: 'Header Content (%)',
            action: 'layout-scale',
            target: 'header-content',
            valueKey: 'header-content-scale',
            unit: 'percent',
            min: 1,
            step: 0.1,
            controls: { down: '-', up: '+' },
            aria: { down: 'Decrease header content size', up: 'Increase header content size' },
            inputAria: 'Header content percent'
        },
        {
            label: 'Header Move X (px)',
            action: 'layout-move',
            target: 'header-x',
            valueKey: 'header-offset-x',
            unit: 'px',
            controls: { down: '<', up: '>' },
            aria: { down: 'Move header left', up: 'Move header right' },
            inputAria: 'Header horizontal offset'
        },
        {
            label: 'Header Move Y (px)',
            action: 'layout-move',
            target: 'header-y',
            valueKey: 'header-offset-y',
            unit: 'px',
            controls: { down: 'v', up: '^' },
            aria: { down: 'Move header down', up: 'Move header up' },
            inputAria: 'Header vertical offset'
        },
        {
            label: 'Footer Room (%)',
            action: 'layout-scale',
            target: 'footer-room',
            valueKey: 'footer-room-scale',
            unit: 'percent',
            min: 1,
            step: 0.1,
            controls: { down: '-', up: '+' },
            aria: { down: 'Decrease footer room', up: 'Increase footer room' },
            inputAria: 'Footer room percent'
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
        const value = document.createElement('input');
        value.className = 'category-size-input category-size-value';
        value.dataset.value = item.valueKey;
        value.dataset.action = item.action;
        value.dataset.target = item.target;
        value.setAttribute('aria-label', item.inputAria);
        value.type = 'number';
        if (item.unit === 'percent') {
            value.min = String(item.min ?? 1);
            value.max = '1000';
            value.step = String(item.step ?? 0.1);
            value.value = '100';
        } else {
            value.min = '-1000';
            value.max = '1000';
            value.step = '1';
            value.value = '0';
        }
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
        const value = document.createElement('input');
        value.className = 'category-size-input category-size-value';
        value.dataset.value = valueKey;
        value.dataset.action = actionName;
        value.dataset.key = def.key;
        value.dataset.control = controlKey;
        value.type = 'number';
        if (controlKey === 'scale') {
            value.min = '1';
            value.max = '1000';
            value.step = '0.1';
            value.value = '100';
            value.setAttribute('aria-label', `${def.label} size percent`);
        } else {
            value.min = '-1000';
            value.max = '1000';
            value.step = '1';
            value.value = '0';
            value.setAttribute('aria-label', `${def.label} offset in pixels`);
        }
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
                    'Size (%)',
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
                    'Move X (px)',
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
                    'Move Y (px)',
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
                state.columnRaiseByLevel.clear();
                state.manualColumnShift = false;
                state.rowGapPercentByLevel.clear();
                state.headerScale = DEFAULT_HEADER_ROOM_SCALE;
                state.headerContentScale = 1;
                state.headerOffsetX = 0;
                state.headerOffsetY = 0;
                state.footerScale = DEFAULT_FOOTER_ROOM_SCALE;
                state.headerElementScale.clear();
                state.headerElementOffsetX.clear();
                state.headerElementOffsetY.clear();
                state.footerElementScale.clear();
                state.footerElementOffsetX.clear();
                state.footerElementOffsetY.clear();
                state.layoutDirty = true;
                applyLayoutScale();
                updateCategoryTreeMetrics(rootTree);
                updateCategorySizeOverlayValues(overlay);
                return;
            }
            if (action === 'size') {
                const level = Number(button.dataset.level || 0);
                const delta = button.dataset.dir === 'down' ? -5 : 5;
                const nextPercent = Math.min(1000, Math.max(1, getOverlaySizePercent(level) + delta));
                const nextScale = applyOverlaySizePercent(level, nextPercent);
                const tree = contentArea.querySelector(`.category-tree[data-level="${level}"]`);
                if (tree) tree.style.setProperty('--pill-scale', `${nextScale}`);
                updateCategoryTreeMetrics(rootTree);
                updateCategorySizeOverlayValues(overlay);
                return;
            }
            if (action === 'shift') {
                const level = Number(button.dataset.level || 0);
                const delta = button.dataset.dir === 'left' ? -12 : 12;
                const nextShift = applyOverlayShiftPx(level, getOverlayShiftPx(level) + delta);
                const tree = contentArea.querySelector(`.category-tree[data-level="${level}"]`);
                if (tree) tree.style.setProperty('--column-shift', `${nextShift}px`);
                updateCategoryTreeMetrics(rootTree);
                updateCategorySizeOverlayValues(overlay);
                return;
            }
            if (action === 'raise') {
                const level = Number(button.dataset.level || 0);
                const delta = button.dataset.dir === 'down' ? 12 : -12;
                applyOverlayRaisePx(level, getOverlayRaisePx(level) + delta);
                updateCategoryTreeMetrics(rootTree);
                updateCategorySizeOverlayValues(overlay);
                return;
            }
            if (action === 'spacing') {
                const level = Number(button.dataset.level || 0);
                const delta = button.dataset.dir === 'down' ? -5 : 5;
                const nextPercent = Math.min(1000, Math.max(1, getOverlaySpacingPercent(level) + delta));
                applyOverlaySpacingPercent(level, nextPercent);
                const tree = contentArea.querySelector(`.category-tree[data-level="${level}"]`);
                if (tree) tree.style.setProperty('--row-gap-scale', `${getRowGapScaleForLevel(level)}`);
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
        overlay.addEventListener('change', event => {
            const input = event.target.closest('input');
            if (!input) return;
            const rawValue = parseFloat(input.value);
            if (!Number.isFinite(rawValue)) {
                updateCategorySizeOverlayValues(overlay);
                return;
            }
            const action = input.dataset.action;
            let needsLayoutUpdate = false;
            if (action === 'size') {
                const level = Number(input.dataset.level || 0);
                const nextScale = applyOverlaySizePercent(level, rawValue);
                const tree = contentArea.querySelector(`.category-tree[data-level="${level}"]`);
                if (tree) tree.style.setProperty('--pill-scale', `${nextScale}`);
            }
            if (action === 'shift') {
                const level = Number(input.dataset.level || 0);
                const nextShift = applyOverlayShiftPx(level, rawValue);
                const tree = contentArea.querySelector(`.category-tree[data-level="${level}"]`);
                if (tree) tree.style.setProperty('--column-shift', `${nextShift}px`);
            }
            if (action === 'raise') {
                const level = Number(input.dataset.level || 0);
                applyOverlayRaisePx(level, rawValue);
            }
            if (action === 'spacing') {
                const level = Number(input.dataset.level || 0);
                applyOverlaySpacingPercent(level, rawValue);
                const tree = contentArea.querySelector(`.category-tree[data-level="${level}"]`);
                if (tree) tree.style.setProperty('--row-gap-scale', `${getRowGapScaleForLevel(level)}`);
            }
            if (action === 'layout-scale') {
                const nextScale = rawValue / 100;
                if (input.dataset.target === 'header-room') {
                    setHeaderScale(nextScale);
                }
                if (input.dataset.target === 'header-content') {
                    setHeaderContentScale(nextScale);
                }
                if (input.dataset.target === 'footer-room') {
                    setFooterScale(nextScale);
                }
                needsLayoutUpdate = true;
            }
            if (action === 'layout-move') {
                if (input.dataset.target === 'header-x') {
                    setHeaderOffsetX(rawValue);
                }
                if (input.dataset.target === 'header-y') {
                    setHeaderOffsetY(rawValue);
                }
                needsLayoutUpdate = true;
            }
            if (action === 'header-element') {
                const key = input.dataset.key;
                const control = input.dataset.control;
                if (!key || !control) return;
                if (control === 'scale') {
                    setHeaderElementScale(key, rawValue / 100);
                }
                if (control === 'x') {
                    setHeaderElementOffsetX(key, rawValue);
                }
                if (control === 'y') {
                    setHeaderElementOffsetY(key, rawValue);
                }
                needsLayoutUpdate = true;
            }
            if (action === 'footer-element') {
                const key = input.dataset.key;
                const control = input.dataset.control;
                if (!key || !control) return;
                if (control === 'scale') {
                    setFooterElementScale(key, rawValue / 100);
                }
                if (control === 'x') {
                    setFooterElementOffsetX(key, rawValue);
                }
                if (control === 'y') {
                    setFooterElementOffsetY(key, rawValue);
                }
                needsLayoutUpdate = true;
            }
            if (needsLayoutUpdate) {
                applyLayoutScale();
            }
            updateCategoryTreeMetrics(rootTree);
            updateCategorySizeOverlayValues(overlay);
        });
        contentArea.appendChild(overlay);
    }
    const levels = getCategoryTreeLevels(rootTree);
    ensureColumnBaselines(levels);
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
    const availableWidth = Math.max(1, contentRect.width - 32);
    const availableHeight = Math.max(1, contentRect.height - 32);
    const usedWidth = bounds.width;
    const usedHeight = bounds.height;
    const scaleX = availableWidth / usedWidth;
    const scaleY = availableHeight / usedHeight;
    return Math.min(1, scaleX, scaleY);
}

function centerCategoryTreeColumns(metricsRoot, rootTree, contentRect) {
    if (!metricsRoot || !rootTree || !contentRect) return;
    const state = getCategoryTreeState();
    if (state.manualColumnShift) return;
    const hasActivePath = getActivePathIds().length > 0;
    const hasSearch = Boolean(window.spiderwebContext?.hasSearch);
    const levels = getCategoryTreeLevels(metricsRoot);
    const visibleDepth = Math.max(0, levels.length - 1);
    const candidateTrees = Array.from(metricsRoot.querySelectorAll('.category-children'))
        .filter(tree => tree.children.length && tree.getClientRects().length);
    const rightmostTree = candidateTrees.reduce((current, tree) => {
        if (!current) return tree;
        const rect = tree.getBoundingClientRect();
        const currentRect = current.getBoundingClientRect();
        return rect.left > currentRect.left ? tree : current;
    }, null);
    const activeTree = hasActivePath ? (rightmostTree || metricsRoot) : metricsRoot;
    const activeBounds = getCategoryTreeBounds(activeTree);
    const bounds = getCategoryTreeBounds(metricsRoot);
    if (!activeBounds || !bounds) return;
    const currentShiftValue = getComputedStyle(rootTree).getPropertyValue('--tree-shift');
    const currentShift = Number.isFinite(parseFloat(currentShiftValue)) ? parseFloat(currentShiftValue) : 0;
    const margin = hasActivePath
        ? Math.min(18, Math.max(8, contentRect.width * 0.02))
        : Math.min(36, Math.max(22, contentRect.width * 0.03));
    let delta;
    if (!hasActivePath) {
        delta = (contentRect.left + margin) - bounds.left;
    } else {
        const focusRatio = Math.min(0.78, 0.24 + (visibleDepth * 0.16));
        const targetCenterX = contentRect.left + (contentRect.width * focusRatio);
        delta = targetCenterX - (activeBounds.left + (activeBounds.width / 2));
    }
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
}

function updateCategoryTreeMetrics(container) {
    if (!container) return;
    const contentArea = document.getElementById('content-area');
    const rootTree = getCategoryTreeRoot(container);
    const metricsRoot = rootTree || container;
    const state = getCategoryTreeState();
    const levels = getCategoryTreeLevels(metricsRoot);
    ensureColumnBaselines(levels);
    const layoutKey = `${getActivePathIds().join('|')}|${levels.join(',')}`;
    if (layoutKey !== state.layoutKey || state.layoutDirty) {
        state.layoutKey = layoutKey;
        state.fitScalePass = 0;
        state.centeringPass = 0;
        state.alignPass = 0;
        state.layoutDirty = false;
        if (state.centeringTimer) {
            clearTimeout(state.centeringTimer);
            state.centeringTimer = null;
        }
        if (state.alignTimer) {
            clearTimeout(state.alignTimer);
            state.alignTimer = null;
        }
    }
    const contentRect = contentArea ? contentArea.getBoundingClientRect() : null;
    let fitScale = Number.isFinite(state.fitScale) ? state.fitScale : 1;
    if (contentRect && rootTree && metricsRoot === rootTree) {
        const nextFitScale = Math.max(0.28, Math.min(1, fitScale * computeCategoryTreeFitScale(metricsRoot, contentRect)));
        if (Math.abs(nextFitScale - fitScale) > 0.02) {
            fitScale = nextFitScale;
            state.fitScale = nextFitScale;
        }
    }
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
    let rootRaiseOverride = desiredRaise(0) + getColumnRaiseForLevel(0);
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
        const columnRaise = getColumnRaiseForLevel(level);
        const rowGapScale = getRowGapScaleForLevel(level);
        const parentTree = tree.parentElement ? tree.parentElement.closest('.category-tree') : null;
        const parentLevel = parentTree ? Number(parentTree.dataset.level || 0) : null;
        const shift = level === 0
            ? rootShiftOverride
            : desiredShift(level) - desiredShift(parentLevel);
        const raise = level === 0
            ? rootRaiseOverride
            : desiredBaseRaise(level) - desiredBaseRaise(parentLevel) + columnRaise;
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
    if (contentArea) {
        updateCategoryTreeChildColumnTops(metricsRoot, contentArea);
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
    scheduleCategoryTreeTransitionSync(metricsRoot);
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
