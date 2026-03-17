// Features/search/Search.js - Search functionality
import { renderInitialView } from '../list/ListView.js';
import { buildSpiderwebContext } from '../list/spiderwebContext.js';
import { addHistoryEntry, updateNavButtonsState } from '../navigation/Navigation.js';
import { renderDetailPage } from '../detail/DetailPage.js';
import { addTapListener } from '../../Utils/addTapListener.js';
import {
    ensureSearchPreviewContent,
    getSearchPreview,
    needsAsyncSearchPreview,
    resetSearchPreviewCache
} from './searchPreview.js';

const MAX_FILTERED_RESULTS = 7;
const MAX_SMART_RESULTS = 7;
const HIGH_PRIORITY_RULES = [
    { pattern: /\bcardiac arrest\b/i, boost: 28 },
    { pattern: /\bsvt\b/i, boost: 22 },
    { pattern: /\brass \+4\b/i, boost: 18 },
    { pattern: /\brass \+2\b|\brass \+3\b/i, boost: 14 },
    { pattern: /\bnarcan\b|\bnaloxone\b|\bnarcotic\b/i, boost: 14 },
    { pattern: /\bfentanyl\b|\bmorphine\b|\bketamine\b|\bmidazolam\b/i, boost: 10 }
];

const searchUiState = {
    open: false,
    filteredResults: [],
    smartResults: [],
    flatResults: [],
    activeFlatIndex: -1,
    documentBound: false
};

let allSearchableTopics = [];
let searchTitleCounts = new Map();

function normalizeSearchTerm(value) {
    return `${value ?? ''}`.replace(/\s+/g, ' ').trim();
}

function normalizeSearchKey(value) {
    return normalizeSearchTerm(value).toLowerCase();
}

function compareTitles(a, b) {
    return `${a ?? ''}`.localeCompare(`${b ?? ''}`, undefined, { sensitivity: 'base' });
}

function getSearchDom() {
    return {
        input: window.searchInput || document.getElementById('searchInput'),
        shell: document.getElementById('search-shell'),
        panel: document.getElementById('search-suggestion-panel'),
        filteredList: document.getElementById('search-filtered-list'),
        smartList: document.getElementById('search-smart-list'),
        filteredCount: document.getElementById('search-filtered-count'),
        smartCount: document.getElementById('search-smart-count')
    };
}

function getCommittedSearchTerm() {
    return normalizeSearchTerm(window.committedSearchTerm || '');
}

export function setCommittedSearchTerm(value = '') {
    window.committedSearchTerm = normalizeSearchTerm(value);
}

function syncInputToCommittedTerm() {
    const { input } = getSearchDom();
    if (!input) return;
    input.value = getCommittedSearchTerm();
}

function clearActiveSuggestion() {
    searchUiState.activeFlatIndex = -1;
}

function updateSuggestionCounts(filteredCount, smartCount) {
    const { filteredCount: filteredCountEl, smartCount: smartCountEl } = getSearchDom();
    if (filteredCountEl) filteredCountEl.textContent = String(filteredCount);
    if (smartCountEl) smartCountEl.textContent = String(smartCount);
}

function hideSearchSuggestions({ restoreCommittedTerm = false } = {}) {
    const { input, panel } = getSearchDom();
    if (restoreCommittedTerm) {
        syncInputToCommittedTerm();
    }
    searchUiState.open = false;
    searchUiState.filteredResults = [];
    searchUiState.smartResults = [];
    searchUiState.flatResults = [];
    clearActiveSuggestion();
    updateSuggestionCounts(0, 0);
    if (panel) {
        panel.hidden = true;
        panel.classList.add('hidden');
    }
    if (input) {
        input.setAttribute('aria-expanded', 'false');
    }
}

function showSearchSuggestions() {
    const { input, panel } = getSearchDom();
    if (!panel || !input) return;
    panel.hidden = false;
    panel.classList.remove('hidden');
    input.setAttribute('aria-expanded', 'true');
    searchUiState.open = true;
}

function getPriorityBoost(entry) {
    const haystack = `${entry.title || ''} ${entry.navTitle || ''} ${entry.path || ''}`;
    return HIGH_PRIORITY_RULES.reduce((boost, rule) => (
        rule.pattern.test(haystack) ? boost + rule.boost : boost
    ), 0);
}

function getContextualDisplayTitle(entry) {
    const baseTitle = entry.navTitle || entry.title || entry.id;
    const baseKey = normalizeSearchKey(baseTitle);
    if ((searchTitleCounts.get(baseKey) || 0) <= 1) {
        return baseTitle;
    }
    const pathSegments = `${entry.path || ''}`.split(' > ').filter(Boolean);
    const rootLabel = pathSegments[0] || '';
    const rootPrefix = rootLabel
        .replace(/\bprotocols\b/i, '')
        .replace(/\bmedications\b/i, 'Medication')
        .replace(/\s+/g, ' ')
        .trim();
    if (!rootPrefix) {
        return baseTitle;
    }
    if (baseTitle.toLowerCase().startsWith(rootPrefix.toLowerCase())) {
        return baseTitle;
    }
    return `${rootPrefix} ${baseTitle}`;
}

function buildSearchContext(searchTerm) {
    return buildSpiderwebContext(window.paramedicCategories, {
        patientData: window.patientData || {},
        searchTerm,
        activeCategoryPath: [],
        activeTopicId: null,
        pediatricAgeThreshold: Number(window.PEDIATRIC_AGE_THRESHOLD) || 18
    });
}

function buildSuggestionModel(rawQuery) {
    const searchTerm = normalizeSearchTerm(rawQuery);
    const normalizedQuery = normalizeSearchKey(searchTerm);
    if (!normalizedQuery) {
        return { filteredResults: [], smartResults: [] };
    }

    const spiderwebContext = buildSearchContext(searchTerm);
    const scoredEntries = allSearchableTopics.map(entry => {
        const info = spiderwebContext.itemStateById?.get(entry.id) || {};
        const displayTitle = getContextualDisplayTitle(entry);
        const titleKey = normalizeSearchKey(displayTitle);
        const pathKey = normalizeSearchKey(entry.path);
        const priorityBoost = getPriorityBoost(entry);
        const startsWithTitle = titleKey.startsWith(normalizedQuery);
        const titleContains = titleKey.includes(normalizedQuery);
        const pathContains = pathKey.includes(normalizedQuery);
        const patientScore = Number(info.relevantSelfScore) || 0;
        const filteredScore = (info.searchSelf ? 160 : 0)
            + (startsWithTitle ? 32 : 0)
            + (titleContains ? 16 : 0)
            + (pathContains ? 8 : 0)
            + priorityBoost
            + patientScore;
        const smartScore = (info.searchSelf ? 120 : 0)
            + (startsWithTitle ? 20 : 0)
            + (titleContains ? 12 : 0)
            + (pathContains ? 6 : 0)
            + (patientScore * 18)
            + priorityBoost;

        return {
            ...entry,
            displayTitle,
            patientScore,
            isSearchHit: Boolean(info.searchSelf),
            filteredScore,
            smartScore
        };
    });

    const filteredResults = scoredEntries
        .filter(entry => entry.isSearchHit)
        .sort((a, b) => {
            if (b.filteredScore !== a.filteredScore) return b.filteredScore - a.filteredScore;
            if (b.patientScore !== a.patientScore) return b.patientScore - a.patientScore;
            return compareTitles(a.displayTitle, b.displayTitle);
        })
        .slice(0, MAX_FILTERED_RESULTS)
        .map(entry => ({
            ...entry,
            previewText: getSearchPreview(entry, searchTerm)
        }));

    const smartResults = scoredEntries
        .filter(entry => entry.smartScore > 0)
        .sort((a, b) => {
            if (b.smartScore !== a.smartScore) return b.smartScore - a.smartScore;
            if (b.patientScore !== a.patientScore) return b.patientScore - a.patientScore;
            if (Number(b.isSearchHit) !== Number(a.isSearchHit)) return Number(b.isSearchHit) - Number(a.isSearchHit);
            return compareTitles(a.displayTitle, b.displayTitle);
        })
        .slice(0, MAX_SMART_RESULTS)
        .map(entry => ({
            ...entry,
            previewText: getSearchPreview(entry, searchTerm)
        }));

    return { filteredResults, smartResults };
}

function primeSuggestionPreviews(entries) {
    const pendingLoads = [];
    const seenEntryIds = new Set();
    entries.forEach(entry => {
        if (!entry?.id || seenEntryIds.has(entry.id)) return;
        seenEntryIds.add(entry.id);
        if (needsAsyncSearchPreview(entry)) {
            pendingLoads.push(ensureSearchPreviewContent(entry));
        }
    });
    if (!pendingLoads.length) return;
    Promise.allSettled(pendingLoads).then(() => {
        refreshSearchSuggestions();
    });
}

function setActiveSuggestion(index) {
    searchUiState.activeFlatIndex = index;
    const { panel } = getSearchDom();
    if (!panel) return;
    const items = Array.from(panel.querySelectorAll('.search-suggestion-item'));
    items.forEach((itemEl, itemIndex) => {
        const isActive = itemIndex === index;
        itemEl.classList.toggle('is-active', isActive);
        if (isActive) {
            itemEl.scrollIntoView({ block: 'nearest' });
        }
    });
}

function selectSuggestion(entry) {
    if (!entry) return;
    const { input } = getSearchDom();
    const committedTerm = entry.title || entry.displayTitle || entry.id;
    if (input) {
        input.value = committedTerm;
    }
    setCommittedSearchTerm(committedTerm);
    hideSearchSuggestions();
    window.activeCategoryPath = Array.isArray(entry.categoryPath) ? [...entry.categoryPath] : [];
    window.activeTopicId = entry.id;
    addHistoryEntry({
        viewType: 'list',
        contentId: committedTerm,
        highlightTopicId: entry.id,
        categoryPath: entry.categoryPath || []
    });
    updateNavButtonsState();
    renderDetailPage(entry.id, true, true);
}

function buildSuggestionItem(entry, flatIndex) {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = `search-suggestion-${flatIndex}`;
    button.className = 'search-suggestion-item';
    button.dataset.topicId = entry.id;
    button.dataset.flatIndex = String(flatIndex);

    const titleEl = document.createElement('span');
    titleEl.className = 'search-suggestion-title';
    titleEl.textContent = entry.displayTitle;
    button.appendChild(titleEl);

    const secondaryEl = document.createElement('span');
    secondaryEl.className = entry.previewText ? 'search-suggestion-preview' : 'search-suggestion-path';
    secondaryEl.dataset.searchSecondary = entry.previewText ? 'preview' : 'path';
    secondaryEl.textContent = entry.previewText || entry.path;
    button.appendChild(secondaryEl);

    button.addEventListener('mousedown', event => {
        event.preventDefault();
    });
    addTapListener(button, () => {
        selectSuggestion(entry);
    });

    return button;
}

function renderSuggestionColumn(listEl, entries, emptyMessage, startIndex = 0) {
    if (!listEl) return 0;
    listEl.innerHTML = '';
    if (!entries.length) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'search-suggestion-empty';
        emptyEl.textContent = emptyMessage;
        listEl.appendChild(emptyEl);
        return 0;
    }

    entries.forEach((entry, entryIndex) => {
        const itemEl = buildSuggestionItem(entry, startIndex + entryIndex);
        listEl.appendChild(itemEl);
    });
    return entries.length;
}

function renderSearchSuggestions(rawQuery) {
    const query = normalizeSearchTerm(rawQuery);
    if (!query) {
        hideSearchSuggestions();
        return;
    }

    const { filteredResults, smartResults } = buildSuggestionModel(query);
    searchUiState.filteredResults = filteredResults;
    searchUiState.smartResults = smartResults;
    searchUiState.flatResults = [...filteredResults, ...smartResults];
    clearActiveSuggestion();

    const { filteredList, smartList } = getSearchDom();
    const filteredCount = renderSuggestionColumn(
        filteredList,
        filteredResults,
        'No direct topic matches yet.',
        0
    );
    const smartCount = renderSuggestionColumn(
        smartList,
        smartResults,
        'No smart suggestions yet.',
        filteredCount
    );
    updateSuggestionCounts(filteredCount, smartCount);
    primeSuggestionPreviews(searchUiState.flatResults);

    if (!searchUiState.flatResults.length) {
        showSearchSuggestions();
        return;
    }

    showSearchSuggestions();
}

function handleDraftInput() {
    const { input } = getSearchDom();
    if (!input) return;
    renderSearchSuggestions(input.value);
}

function moveActiveSuggestion(direction) {
    if (!searchUiState.flatResults.length) return;
    const nextIndex = searchUiState.activeFlatIndex < 0
        ? (direction > 0 ? 0 : searchUiState.flatResults.length - 1)
        : (searchUiState.activeFlatIndex + direction + searchUiState.flatResults.length) % searchUiState.flatResults.length;
    setActiveSuggestion(nextIndex);
}

function handleSearchKeydown(event) {
    if (!searchUiState.open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        if (normalizeSearchTerm(event.currentTarget?.value)) {
            renderSearchSuggestions(event.currentTarget.value);
        }
    }

    if (event.key === 'ArrowDown') {
        if (!searchUiState.flatResults.length) return;
        event.preventDefault();
        moveActiveSuggestion(1);
        return;
    }

    if (event.key === 'ArrowUp') {
        if (!searchUiState.flatResults.length) return;
        event.preventDefault();
        moveActiveSuggestion(-1);
        return;
    }

    if (event.key === 'Enter') {
        event.preventDefault();
        if (searchUiState.activeFlatIndex >= 0 && searchUiState.flatResults[searchUiState.activeFlatIndex]) {
            selectSuggestion(searchUiState.flatResults[searchUiState.activeFlatIndex]);
            return;
        }
        handleSearch(true);
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        hideSearchSuggestions({ restoreCommittedTerm: true });
    }
}

function handleDocumentPointerDown(event) {
    const { shell } = getSearchDom();
    if (!shell || shell.contains(event.target)) return;
    hideSearchSuggestions({ restoreCommittedTerm: true });
}

function bindDocumentDismissal() {
    if (searchUiState.documentBound) return;
    document.addEventListener('pointerdown', handleDocumentPointerDown, true);
    searchUiState.documentBound = true;
}

function getCommittedSearchScrollTarget(searchTerm, highlightId = null) {
    if (highlightId) return highlightId;
    const { filteredResults, smartResults } = buildSuggestionModel(searchTerm);
    return filteredResults[0]?.id || smartResults[0]?.id || null;
}

function scheduleCommittedSearchScroll(targetId) {
    if (!targetId || typeof window === 'undefined' || window.innerWidth > 600) return;
    const scrollTargetIntoView = (attempt = 0) => {
        const topicEl = document.querySelector(`.topic-link-item[data-topic-id="${targetId}"]`);
        if (topicEl) {
            topicEl.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
        if (attempt < 5) {
            window.setTimeout(() => scrollTargetIntoView(attempt + 1), 120);
        }
    };
    window.requestAnimationFrame(() => {
        window.setTimeout(() => scrollTargetIntoView(0), 80);
    });
}

function renderSearchResults(searchTerm, shouldAddHistory = true, highlightId = null, categoryPath = []) {
    setCommittedSearchTerm(searchTerm);
    const scrollTargetId = getCommittedSearchScrollTarget(searchTerm, highlightId);
    if (typeof window !== 'undefined') {
        window.pendingSpiderwebScrollId = scrollTargetId;
    }
    if (shouldAddHistory && searchTerm) {
        addHistoryEntry({
            viewType: 'list',
            contentId: searchTerm,
            highlightTopicId: highlightId,
            categoryPath
        });
    }
    updateNavButtonsState();
    renderInitialView(false, highlightId, categoryPath);
    scheduleCommittedSearchScroll(scrollTargetId);
}

export function resetSearchIndex() {
    allSearchableTopics = [];
    searchTitleCounts = new Map();
    resetSearchPreviewCache();
    if (typeof window !== 'undefined') {
        window.allSearchableTopics = allSearchableTopics;
    }
}

// Build the searchable index (called during data initialization in main.js)
export function processItem(item, parentPath = '', parentIds = []) {
    const currentPath = parentPath ? `${parentPath} > ${item.title}` : item.title;
    const currentIds = (item.type === 'category') ? parentIds.concat(item.id) : parentIds;
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
        allSearchableTopics.push(fullItem);
        const titleKey = normalizeSearchKey(item.navTitle || item.title || item.id);
        searchTitleCounts.set(titleKey, (searchTitleCounts.get(titleKey) || 0) + 1);
    }
    if (item.children) {
        item.children.forEach(child => processItem(child, currentPath, currentIds));
    }
}

// Perform a committed search based on the current input value
export function handleSearch(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    const { input } = getSearchDom();
    const term = normalizeSearchTerm(input?.value);
    hideSearchSuggestions();
    if (!term) {
        setCommittedSearchTerm('');
        if (input) input.value = '';
        renderInitialView(shouldAddHistory, highlightId, categoryPath);
        return;
    }
    renderSearchResults(term, shouldAddHistory, highlightId, categoryPath);
}

export function refreshSearchSuggestions() {
    const { input } = getSearchDom();
    if (!input || !searchUiState.open) return;
    renderSearchSuggestions(input.value);
}

// Attach event listeners to the search input field
export function attachSearchHandlers() {
    const { input } = getSearchDom();
    if (!input) return;
    if (typeof window.committedSearchTerm !== 'string') {
        setCommittedSearchTerm('');
    }
    bindDocumentDismissal();
    input.addEventListener('input', handleDraftInput);
    input.addEventListener('focus', () => {
        if (normalizeSearchTerm(input.value)) {
            renderSearchSuggestions(input.value);
        }
    });
    input.addEventListener('blur', () => {
        window.setTimeout(() => {
            const { shell } = getSearchDom();
            if (shell?.contains(document.activeElement)) return;
            hideSearchSuggestions({ restoreCommittedTerm: true });
        }, 120);
    });
    input.addEventListener('keydown', handleSearchKeydown);
}

// Global exposure for compatibility with Navigation (navigateViaHistory expects window.handleSearch)
if (typeof window !== 'undefined') {
    window.handleSearch = (shouldAddHistory = true, highlightId = null, categoryPath = []) =>
        handleSearch(shouldAddHistory, highlightId, categoryPath);
    window.setCommittedSearchTerm = setCommittedSearchTerm;
    window.hideSearchSuggestions = hideSearchSuggestions;
    window.refreshSearchSuggestions = refreshSearchSuggestions;
}
