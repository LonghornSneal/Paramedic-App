// Features/list/ListView.js - Category list rendering
import { addHistoryEntry, updateNavButtonsState } from '../navigation/Navigation.js';
import { renderDetailPage } from '../detail/DetailPage.js';
import { addTapListener } from '../../Utils/addTapListener.js';

const LIST_VIEW_STATE_KEY = '__paramedicListViewMotionState';

function getListViewState() {
    if (typeof window === 'undefined') return null;
    if (!window[LIST_VIEW_STATE_KEY]) {
        window[LIST_VIEW_STATE_KEY] = {
            activePath: [],
            activeTopicId: null,
            activeHue: 208,
            activeSaturation: 78,
            pulseStart: 0,
            pulseFrameId: 0,
            heightFrameId: 0
        };
    }
    return window[LIST_VIEW_STATE_KEY];
}

function normalizePath(path = []) {
    return Array.isArray(path) ? path.filter(Boolean) : [];
}

function pathKey(path = []) {
    return normalizePath(path).join('>');
}

function isPathPrefix(candidatePath = [], fullPath = []) {
    const candidate = normalizePath(candidatePath);
    const full = normalizePath(fullPath);
    if (candidate.length > full.length) return false;
    return candidate.every((part, index) => part === full[index]);
}

function getContentArea() {
    return window.contentArea || document.getElementById('content-area');
}

function isVisibleBranch(node) {
    if (!node || !node.getClientRects().length) return false;
    return !node.closest('.category-children[data-expanded="false"]');
}

function captureBranchRects(contentArea) {
    const rects = new Map();
    if (!contentArea) return rects;
    contentArea.querySelectorAll('[data-branch-group="true"]').forEach(node => {
        if (!isVisibleBranch(node)) return;
        const key = node.dataset.branchPath;
        if (!key) return;
        const rect = node.getBoundingClientRect();
        if (!rect.width && !rect.height) return;
        rects.set(key, {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });
    });
    return rects;
}

function stopPulseLoop() {
    const state = getListViewState();
    if (!state) return;
    if (state.pulseFrameId) {
        cancelAnimationFrame(state.pulseFrameId);
        state.pulseFrameId = 0;
    }
}

function cancelPendingHeightRefresh() {
    const state = getListViewState();
    if (!state) return;
    if (state.heightFrameId) {
        cancelAnimationFrame(state.heightFrameId);
        state.heightFrameId = 0;
    }
}

function syncExpandedBranch(items, activePath = [], currentPath = []) {
    const normalizedActivePath = normalizePath(activePath);
    items.forEach(item => {
        if (item.type !== 'category') return;
        const nextPath = [...currentPath, item.id];
        const shouldExpand = normalizedActivePath.length > 0 && isPathPrefix(nextPath, normalizedActivePath);
        item.expanded = shouldExpand;
        if (item.children?.length) {
            syncExpandedBranch(item.children, normalizedActivePath, nextPath);
        }
    });
}

function applyMotionFallback(el, previousRect, currentRect, isNew = false) {
    if (!el || !currentRect) return;
    if (previousRect) {
        const dx = previousRect.left - currentRect.left;
        const dy = previousRect.top - currentRect.top;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.opacity = '0.24';
        return;
    }
    if (isNew) {
        el.style.transform = 'translateY(-10px)';
        el.style.opacity = '0';
    }
}

function animateBranchMotion(contentArea, previousRects) {
    if (!contentArea || !previousRects?.size) return;
    const elements = [...contentArea.querySelectorAll('[data-branch-group="true"]')].filter(isVisibleBranch);
    elements.forEach(el => {
        const key = el.dataset.branchPath;
        const currentRect = el.getBoundingClientRect();
        const previousRect = previousRects.get(key);
        el.style.transition = 'none';
        el.style.transformOrigin = 'top left';
        el.style.willChange = 'transform, opacity';
        applyMotionFallback(el, previousRect, currentRect, !previousRect);
    });

    requestAnimationFrame(() => {
        elements.forEach(el => {
            el.style.transition = 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease';
            el.style.transform = '';
            el.style.opacity = '';
        });
    });
}

function getGroupCard(group) {
    const firstChild = group?.firstElementChild;
    if (!firstChild) return null;
    if (firstChild.classList?.contains('category-card') || firstChild.classList?.contains('topic-link-item')) {
        return firstChild;
    }
    return null;
}

function findItemById(items, nodeId) {
    for (const item of items || []) {
        if (item.id === nodeId) return item;
        if (item.children?.length) {
            const match = findItemById(item.children, nodeId);
            if (match) return match;
        }
    }
    return null;
}

function getCategoryItem(nodeId) {
    return findItemById(window.paramedicCategories || [], nodeId);
}

function setChildContainerExpanded(childContainer, expanded) {
    if (!childContainer) return;
    childContainer.dataset.expanded = expanded ? 'true' : 'false';
    childContainer.style.pointerEvents = expanded ? 'auto' : 'none';
    childContainer.style.opacity = expanded ? '1' : '0';
    childContainer.style.maxHeight = expanded ? '240rem' : '0px';
}

function refreshExpandedHeights(contentArea) {
    if (!contentArea) return;
    contentArea.querySelectorAll('.category-children').forEach(childContainer => {
        setChildContainerExpanded(childContainer, childContainer.dataset.expanded === 'true');
    });
}

function queueExpandedHeightRefresh(contentArea) {
    const state = getListViewState();
    if (!state || !contentArea) return;
    if (state.heightFrameId) {
        cancelAnimationFrame(state.heightFrameId);
    }
    state.heightFrameId = requestAnimationFrame(() => {
        refreshExpandedHeights(contentArea);
        state.heightFrameId = requestAnimationFrame(() => {
            refreshExpandedHeights(contentArea);
        });
    });
}

function applyBranchEmphasis(contentArea) {
    const state = getListViewState();
    if (!contentArea || !state) return;

    const activePath = normalizePath(state.activePath);
    const activePathSet = new Set();
    activePath.forEach((_, index) => {
        activePathSet.add(pathKey(activePath.slice(0, index + 1)));
    });

    contentArea.querySelectorAll('[data-branch-group="true"]').forEach(group => {
        const card = getGroupCard(group);
        if (!card) return;

        const nodePath = normalizePath((group.dataset.branchPath || '').split('>').filter(Boolean));
        const nodeKey = pathKey(nodePath);
        const isCategory = group.dataset.nodeType === 'category';
        const isSelectedCategory = isCategory && nodeKey === pathKey(activePath);
        const isAncestorCategory = isCategory && activePathSet.has(nodeKey) && !isSelectedCategory;
        const isActiveTopic = !isCategory && card.dataset.topicId === state.activeTopicId;

        if (isActiveTopic) {
            card.dataset.activeBranch = 'topic';
            group.dataset.activeBranch = 'topic';
        } else if (isSelectedCategory) {
            card.dataset.activeBranch = 'selected';
            group.dataset.activeBranch = 'selected';
        } else if (isAncestorCategory) {
            card.dataset.activeBranch = 'ancestor';
            group.dataset.activeBranch = 'ancestor';
        } else {
            card.removeAttribute('data-active-branch');
            group.removeAttribute('data-active-branch');
            card.style.removeProperty('--branch-hue');
            card.style.removeProperty('--branch-saturation');
            card.style.removeProperty('--branch-lightness');
            card.style.removeProperty('--branch-glow');
        }
    });
}

function startPulseLoop(contentArea) {
    const state = getListViewState();
    if (!contentArea || !state) return;
    stopPulseLoop();

    const activeNodes = () => [...contentArea.querySelectorAll('[data-active-branch]')].filter(isVisibleBranch);
    if (!activeNodes().length) return;

    state.pulseStart = performance.now();

    const tick = now => {
        const nodes = activeNodes();
        if (!nodes.length) {
            state.pulseFrameId = 0;
            return;
        }

        const elapsed = (now - state.pulseStart) / 1000;
        const baseHue = 204 + Math.sin(elapsed * 0.92) * 18;
        const baseSaturation = 72 + Math.sin(elapsed * 1.18 + 0.5) * 10;
        state.activeHue = baseHue;
        state.activeSaturation = baseSaturation;

        nodes.forEach((node, index) => {
            const intensity = node.dataset.activeBranch === 'selected' || node.dataset.activeBranch === 'topic' ? 1 : 0.7;
            const hue = baseHue + (index * 3.5);
            const saturation = baseSaturation + (intensity * 10);
            const lightness = node.dataset.activeBranch === 'topic' ? 90 : (node.dataset.activeBranch === 'selected' ? 92 : 96);
            const glow = 0.18 + (intensity * 0.1);
            node.style.setProperty('--branch-hue', `${hue.toFixed(1)}`);
            node.style.setProperty('--branch-saturation', `${saturation.toFixed(1)}%`);
            node.style.setProperty('--branch-lightness', `${lightness.toFixed(1)}%`);
            node.style.setProperty('--branch-glow', glow.toFixed(2));
        });

        state.pulseFrameId = requestAnimationFrame(tick);
    };

    state.pulseFrameId = requestAnimationFrame(tick);
}

function scrollHighlightIntoView(contentArea, highlightId) {
    if (!highlightId || !contentArea) return;
    const topicEl = contentArea.querySelector(`[data-topic-id="${highlightId}"]`);
    if (!topicEl) return;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            topicEl.classList.add('recently-viewed');
            topicEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
    });
}

function renderSuggestedTopics(contentArea) {
    const suggested = Array.isArray(window.patientSuggestedTopics) ? window.patientSuggestedTopics : [];
    if (!suggested.length) return;

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
        addTapListener(link, event => {
            event.preventDefault();
            renderDetailPage(topic.id);
        });
        link.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                renderDetailPage(topic.id);
            }
        });
        const meta = [];
        if (entry.matchedIndications?.length) meta.push('Indications');
        if (entry.matchedSymptoms?.length) meta.push('Symptoms');
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

function syncRenderedTree(contentArea, previousRects = new Map(), animate = true) {
    if (!contentArea) return;

    contentArea.querySelectorAll('[data-branch-group="true"]').forEach(group => {
        const card = getGroupCard(group);
        if (!card) return;

        const nodeId = group.dataset.nodeId;
        const item = getCategoryItem(nodeId);
        if (!item) return;

        if (item.type === 'category') {
            const expanded = Boolean(item.expanded && item.children?.length);
            card.classList.toggle('is-expanded', expanded);
            card.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            const indicator = card.querySelector('.category-card-indicator');
            if (indicator) {
                indicator.textContent = expanded ? 'Hide' : 'Show';
            }
            const childContainer = group.querySelector(':scope > .category-children');
            setChildContainerExpanded(childContainer, expanded);
        }
    });

    applyBranchEmphasis(contentArea);

    if (typeof window.applyTopicStrikethroughs === 'function') {
        window.applyTopicStrikethroughs();
    }

    queueExpandedHeightRefresh(contentArea);
    startPulseLoop(contentArea);
    if (animate) {
        animateBranchMotion(contentArea, previousRects);
    }
}

function handleCategoryToggle(item, itemPath, ancestorPath) {
    const contentArea = getContentArea();
    if (!contentArea) return;

    const previousRects = captureBranchRects(contentArea);
    const nextPath = item.expanded ? ancestorPath : itemPath;
    syncExpandedBranch(window.paramedicCategories, nextPath);

    const state = getListViewState();
    if (state) {
        state.activePath = normalizePath(nextPath);
        state.activeTopicId = null;
    }

    syncRenderedTree(contentArea, previousRects, true);
    updateNavButtonsState();
}

function renderBranchTree(contentArea, previousRects) {
    const listContainer = document.createElement('div');
    listContainer.className = 'category-tree-root';
    createHierarchicalList(window.paramedicCategories, listContainer, 0, []);
    contentArea.appendChild(listContainer);
    syncRenderedTree(contentArea, previousRects, previousRects.size > 0);
}

// Renders the main category list view (home screen) and highlights a topic if provided.
export function renderInitialView(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    const contentArea = getContentArea();
    if (!contentArea) return;

    const previousRects = captureBranchRects(contentArea);
    const state = getListViewState();
    const incomingPath = normalizePath(categoryPath);
    const targetPath = incomingPath.length ? incomingPath : normalizePath(state?.activePath || []);

    stopPulseLoop();
    cancelPendingHeightRefresh();

    if (state) {
        state.activePath = targetPath;
        state.activeTopicId = highlightId || null;
    }

    syncExpandedBranch(window.paramedicCategories, targetPath);

    contentArea.innerHTML = '';
    renderSuggestedTopics(contentArea);
    renderBranchTree(contentArea, previousRects);

    if (highlightId) {
        scrollHighlightIntoView(contentArea, highlightId);
    }

    if (shouldAddHistory) {
        addHistoryEntry({
            viewType: 'list',
            contentId: '',
            highlightTopicId: highlightId,
            categoryPath: targetPath
        });
    }

    updateNavButtonsState();
}

// Expands categories along the given path and highlights the specified topic.
function openCategoriesAndHighlight(categoryPath = [], highlightId = null) {
    renderInitialView(false, highlightId, categoryPath);
}

// Builds a nested list of categories and topics, appending it to the given container.
function createHierarchicalList(items, container, level = 0, ancestorPath = []) {
    container.innerHTML = '';

    items.forEach(item => {
        const itemPath = [...ancestorPath, item.id];
        const branchPath = pathKey(itemPath);

        const group = document.createElement('div');
        group.className = 'category-group';
        group.dataset.branchGroup = 'true';
        group.dataset.branchPath = branchPath;
        group.dataset.nodeType = item.type;
        group.dataset.nodeId = item.id;
        group.style.setProperty('--category-level', `${level}`);

        if (item.type === 'category') {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'category-card';
            card.dataset.nodeType = 'category';
            card.dataset.nodeId = item.id;
            card.dataset.branchPath = branchPath;
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
                handleCategoryToggle(item, itemPath, ancestorPath);
            });

            group.appendChild(card);

            if (item.children?.length) {
                const childContainer = document.createElement('div');
                childContainer.className = 'category-children';
                childContainer.dataset.expanded = item.expanded ? 'true' : 'false';

                const childInner = document.createElement('div');
                childInner.className = 'category-children-inner';
                childContainer.appendChild(childInner);
                createHierarchicalList(item.children, childInner, level + 1, itemPath);

                group.appendChild(childContainer);
            }

            container.appendChild(group);
        } else if (item.type === 'topic') {
            const topicLink = document.createElement('a');
            topicLink.className = 'topic-link-item';
            topicLink.textContent = item.title;
            topicLink.href = `#${item.id}`;
            topicLink.dataset.nodeType = 'topic';
            topicLink.dataset.nodeId = item.id;
            topicLink.dataset.topicId = item.id;
            topicLink.dataset.branchPath = branchPath;
            topicLink.setAttribute('role', 'button');
            topicLink.setAttribute('tabindex', '0');

            addTapListener(topicLink, event => {
                event.preventDefault();
                const state = getListViewState();
                if (state) {
                    state.activePath = normalizePath(ancestorPath);
                    state.activeTopicId = item.id;
                }
                const contentArea = getContentArea();
                if (contentArea) {
                    applyBranchEmphasis(contentArea);
                    startPulseLoop(contentArea);
                }
                renderDetailPage(item.id);
            });

            group.appendChild(topicLink);
            container.appendChild(group);
        }
    });
}

if (typeof window !== 'undefined') {
    window.renderInitialView = renderInitialView;
}

/*
  Features/list/ListView.js
  Purpose: Renders hierarchical category/topic list, updates expansion in place, and routes to details.

  Core:
  - renderInitialView(shouldAddHistory, highlightId, categoryPath)
  - createHierarchicalList(items, container, level, ancestorPath)
  - openCategoriesAndHighlight(categoryPath, highlightId)
*/
