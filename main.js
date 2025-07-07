// --- Global Variables ---
let searchInput, patientSidebar, openSidebarButton, closeSidebarButton, sidebarOverlay, navBackButton, navForwardButton, patientSidebarOverlay, opensidebar, closesidebar;
let medicationDataMap = {};
let navigationHistory = [];
let currentHistoryIndex = -1;
let isNavigatingViaHistory = false;
let allSearchableTopics = [];
let allDisplayableTopicsMap = {};
let paramedicCategories = []; // This must be a global var!

// --- Main App Initialization ---
function initApp() {
        if (!searchInput || !navBackButton || !navForwardButton) { ensureHeaderUI(); assignDomElements(); } // re-assign now that we possibly created elements

 // Inside initApp(), after other UI initialization:
if (searchInput) {
    searchInput.addEventListener('input', () => handleSearch(true));  // Filter as user types // /.addEventListener('input', function() { handleSearch(true); });
    searchInput.addEventListener('keypress', e => {    // Trigger search on Enter key  // /.addEventListener('keyp', function(e)
        if (e.key === 'Enter') handleSearch(true); }); }

// Navigation
    if (navBackButton && navForwardButton) {
        addTapListener(navBackButton, () => navigateViaHistory(-1));
        addTapListener(navForwardButton, () => navigateViaHistory(1)); }

    // Now initialize data structures from globals
    // These should be loaded BEFORE this script runs (by script order in index.html)
    if (window.ParamedicCategoriesData && window.MedicationDetailsData) {
        initializeData(window.ParamedicCategoriesData, window.MedicationDetailsData);
    } else {
        // Defensive: Wait until both globals are present
        setTimeout(() => { if (window.ParamedicCategoriesData && window.MedicationDetailsData) {
                initializeData(window.ParamedicCategoriesData, window.MedicationDetailsData);
            } else { console.error("Category or medication data not loaded!"); } }, 200); }    // /fallback: try again after short delay
    renderInitialView(true); }

// --- Data Initialization (run ONCE) ---
function initializeData(categoriesData, medDetailsData) {    // /Assign the global category array
    paramedicCategories = categoriesData;
    // Wipe/prepare lookup maps
    allDisplayableTopicsMap = {};
    allSearchableTopics = [];

    // Build med details map for quick lookups
    medicationDataMap = {};       //    /const medicationDataMap = {};
    if (Array.isArray(medDetailsData)) { medDetailsData.forEach(med => { medicationDataMap[med.id] = med; });
    } else if (medDetailsData && typeof medDetailsData === 'object') { Object.assign(medicationDataMap, medDetailsData); }

    // Recursively walk all categories/topics to flatten for search and lookup
    function processItem(item, parentPath = '', parentIds = []) {       // Add to searchable list (for quick search by title/path)
        let currentPath = parentPath ? parentPath + ' > ' + item.title : item.title;
        let currentIds = (item.type === 'category') ? parentIds.concat([item.id]) : parentIds;
        const detailsObj = medicationDataMap[item.id];
        const fullItem = { ...item, path: currentPath,
            details: detailsObj || null,
            categoryPath: parentIds };
        allDisplayableTopicsMap[item.id] = fullItem;
        if (item.type === 'topic') {     // /if (item.type === 'topic')
            allSearchableTopics.push({ id: item.id, title: item.title, path: currentPath,
                categoryPath: parentIds }); }
        if (item.children) { item.children.forEach(child => processItem(child, currentPath, currentIds)); } }
    paramedicCategories.forEach(cat => processItem(cat)); }

// --- Initial View Rendering ---
function renderInitialView(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    contentArea = document.getElementById('content-area');
    contentArea.innerHTML = ''; // Clear

    // Render the hierarchical list of categories
    const listContainer = document.createElement('div');
    createHierarchicalList(paramedicCategories, listContainer, 0);
    contentArea.appendChild(listContainer);

    // Optionally expand/highlight
    openCategoriesAndHighlight(categoryPath, highlightId);
    if (shouldAddHistory) addHistoryEntry({ viewType: 'list', contentId: '', highlightTopicId: highlightId, categoryPath });
    updateNavButtonsState(); }

// --- Make Sure the DOM is ready ---
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initApp);
} else { initApp(); }

// Utility function to escape HTML
function escapeHTML(str) {
    const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return str.replace(/[&<>"']/g, char => escapeMap[char] || char); }

// Initialize data structures with categories and medications

   // --- Initial View Rendering ---
//function renderInitialView(shouldAddHistory = true, highlightId = null, categoryPath = []) {
//    if (shouldAddHistory) addHistoryEntry({ viewType: 'list', contentId: '', highlightTopicId: highlightId, categoryPath });
//    updateNavButtonsState() }

//function initializeData(categoriesData, medDetailsData) {
// Populate global structures from raw data files
//    let paramedicCategories = ParamedicCategoriesData || [];
//    paramedicCategories.forEach(category => processItem(category, '', []));
//    allSearchableTopics = [];
//    allDisplayableTopicsMap = {};
//if (!categoriesData || !medDetailsData) { console.error('Missing required data:', { categories: !!categoriesData, medications: !!medDetailsData }); }}

// Assign DOM elements on DOMContentLoaded
function assignDomElements() {
    searchInput = document.getElementById('searchInput');
    contentArea = document.getElementById('content-area');
    patientSidebar = document.getElementById('patient-sidebar');
    openSidebarButton = document.getElementById('open-sidebar-button');
    closeSidebarButton = document.getElementById('close-sidebar-button');
    sidebarOverlay = document.getElementById('sidebar-overlay');
    navBackButton = document.getElementById('nav-back-button');
    navForwardButton = document.getElementById('nav-forward-button');
}
let sidebareOverlay
// Ensure overlay is hidden on app start
    if (sidebarOverlay) { sidebarOverlay.classList.add('hidden');
        sidebarOverlay.classList.remove('active'); }
// Set up sidebar toggles
    if (openSidebarButton) { addTapListener(openSidebarButton, () => {
        patientSidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
        sidebarOverlay.classList.remove('hidden'); }); }

    if (closeSidebarButton) {addTapListener(closeSidebarButton, () => {
        patientSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        sidebarOverlay.classList.add('hidden'); }); }

    if (sidebarOverlay) {addTapListener(sidebarOverlay, () => {
        patientSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        sidebarOverlay.classList.add('hidden'); }); }

// Set up autocomplete for each Patient Info field
    setupAutocomplete('pt-pmh','pt-pmh-suggestions', pmhSuggestions);
    setupAutocomplete('pt-allergies','pt-allergies-suggestions', allergySuggestions);
    setupAutocomplete('pt-medications','pt-medications-suggestions', medicationNameSuggestions);
    setupAutocomplete('pt-indications','pt-indications-suggestions', indicationSuggestions);
    setupAutocomplete('pt-symptoms','pt-symptoms-suggestions', symptomSuggestions);
// Add focus highlight to all textareas and inputs
    document.querySelectorAll('textarea, input').forEach(el => {
        el.addEventListener('focus', () => el.classList.add('ring', 'ring-blue-300'));
        el.addEventListener('blur', () => el.classList.remove('ring', 'ring-blue-300'));
    });

 //                               // --- Build topic list and attach details ---
  //    /function processItem(item, parentPath, parentIds) { if (typeof parentPath === 'undefined') parentPath = '';
 //       if (typeof parentIds === 'undefined') parentIds = []; let currentPath = parentPath ? parentPath + ' > ' + item.title : item.title;
 //       let currentIds  = (item.type === 'category') ? parentIds.slice().concat([item.id]): parentIds;


        // Attach corresponding detail info if this item is a topic with a matching ID
//        const detailsObj = medicationDataMap[item.id]; const fullItem = { ...item, path: currentPath, details: detailsObj || null, categoryPath: parentIds };
       
function renderSearchResults(filteredTopics, searchTerm, shouldAddHistory = true, highlightId = null, categoryPath = []) {
    if (shouldAddHistory) { addHistoryEntry({ viewType: 'list', contentId: searchTerm, highlightTopicId: highlightId, categoryPath }); }
    updateNavButtonsState(); contentArea.innerHTML = `<div class="flex justify-between items-center mb-3">
            <p class="text-gray-700 font-medium">Results for "${escapeHTML(searchTerm)}":</p>
            <button id="clear-search-button" class="text-sm text-blue-600 hover:underline">Show All Categories</button> </div>
        <div id="results-container" class="space-y-2"></div>`;
    const resultsContainer = document.getElementById('results-container');
    if (filteredTopics.length > 0) { filteredTopics.forEach(topic => { const item = document.createElement('div');
            item.className = 'search-topic-item';
            item.textContent = topic.title;
            if (topic.path) { const pathEl = document.createElement('div');
                pathEl.className = 'text-xs text-gray-500 mt-1';
                pathEl.textContent = topic.path.split(' > ').slice(0, -1).join(' > ');
                item.appendChild(pathEl);
            }
            item.dataset.topicId = topic.id;
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            addTapListener(item, () => renderDetailPage(topic.id));
            item.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    renderDetailPage(topic.id); }
            });
            resultsContainer.appendChild(item);
        });
    } else {
        resultsContainer.innerHTML = 
            '<p class="text-gray-500 text-center py-4">No topics found matching your search.</p>';
    }
    addTapListener(document.getElementById('clear-search-button'), () => {
    searchInput.value = '';
    renderInitialView(); });
}

//if (document.readyState === 'loading') {
//    document.addEventListener('DOMContentLoaded', initApp);
//} else {
// Set up sidebar toggles
 //   addTapListener(openSidebarButton, () => {
        //patientSidebar.classList.add('open');
        //sidebarOverlay.classList.add('active');
        //sidebarOverlay.classList.remove('hidden'); });
    //addTapListener(closeSidebarButton, () => {
        //patientSidebar.classList.remove('open');
        //sidebarOverlay.classList.remove('active');
        //sidebarOverlay.classList.add('hidden'); });
   // addTapListener(sidebarOverlay, () => {
        //patientSidebar.classList.remove('open');
        //sidebarOverlay.classList.remove('active');
        //sidebarOverlay.classList.add('hidden'); });}


    // --- Preload common suggestions (Past Medical History, Allergies, Med Names) ---
    const commonPmh = ["hypertension","htn","diabetes","dm","asthma","copd","heart failure","hf","cad","stroke","cva","seizure disorder","renal insufficiency","ckd","hypothyroidism","hyperthyroidism","glaucoma","peptic ulcer","anxiety","depression"];
    const commonAllergies = ["penicillin","sulfa","aspirin","nsaids","morphine", "codeine","iodine","shellfish","latex","peanuts","tree nuts"];
    const commonMedNames  = ["lisinopril","metformin","atorvastatin","amlodipine",
                             "hydrochlorothiazide","hctz","simvastatin","albuterol",
                             "levothyroxine","gabapentin","omeprazole","losartan",
                             "sertraline","furosemide","lasix","insulin","warfarin",
                             "coumadin","aspirin","clopidogrel","plavix"];
    // Add these common terms to the suggestion sets (defined in PatientInfo.js)
    commonPmh.forEach(term => pmhSuggestions.add(term));
    commonAllergies.forEach(term => allergySuggestions.add(term));
    commonMedNames.forEach(term => medicationNameSuggestions.add(term));
    PDE5_INHIBITORS.forEach(term => medicationNameSuggestions.add(term));

// --- Extract additional allergy keywords from medication contraindications ---
    Object.values(medicationDataMap).forEach(med => {
        if (med.contraindications && Array.isArray(med.contraindications)) {
            med.contraindications.forEach(ci => { const ciLower = ci.toLowerCase();
                if (ciLower.includes("hypersensitivity") || ciLower.includes("allergy to")) {    // Derive a generalized allergen term from text
                    let allergen = ciLower.replace("known hypersensitivity to", "")
                                           .replace("allergy to any nsaid (including asa)", "nsaid allergy")
                                           .replace("allergy to", "").trim();
                    if (allergen.includes("local anesthetic allergy in the amide class")) { allergen = "amide anesthetic allergy";
                    } else if (allergen.includes("nsaid (including asa)")) {
                        allergen = "nsaid allergy";
                    } else { allergen = allergen.split('(')[0].trim(); }
                    if (allergen && allergen.length > 2 && allergen.length < 30) { allergySuggestions.add(allergen); } }
            }); }
    });
    // Data initialization complete. Now paramedicCategories, allSearchableTopics, 
    // and allDisplayableTopicsMap are ready for use.

function handleSearch(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    const term = searchInput.value.trim().toLowerCase();
    if (!term) {    // If no search term, show the full list with any requested highlight/path
        renderInitialView(false, highlightId, categoryPath); return; }
    const results = allSearchableTopics.filter(topic =>
        (topic.title || topic.id || '').toLowerCase().includes(term) ||
        (topic.path || '').toLowerCase().includes(term) );
    renderSearchResults(results, term, shouldAddHistory, highlightId, categoryPath); }

// --- Diagnostic Logging --- console.log("ParamedicCategoriesData:", window.ParamedicCategoriesData); console.log("MedicationDetailsData:", window.MedicationDetailsData);

// --- Ensure Navigation/Search Bar Exists ---
function ensureHeaderUI() { const header = document.querySelector('header');
  if (!header) return; // Add app title if missing // Always ensure nav buttons and search input are present and in correct order
  let navBar = header.querySelector('.header-nav-bar');
  if (!navBar) { navBar = document.createElement('div');
    navBar.className = 'header-nav-bar flex items-center space-x-2';
    header.appendChild(navBar); }

  // Clear navBar and re-add in correct order
  navBar.innerHTML = '';
  // Back button
  let backBtn = document.getElementById('nav-back-button');
  if (!backBtn) { backBtn = document.createElement('button');
    backBtn.id = 'nav-back-button';
    backBtn.className = 'header-nav-button p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400';
    backBtn.setAttribute('aria-label', 'Back');
    backBtn.setAttribute('title', 'Back');
    backBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>';
  }
  navBar.appendChild(backBtn);

  // Forward button
  let forwardBtn = document.getElementById('nav-forward-button');
  if (!forwardBtn) { forwardBtn = document.createElement('button');
    forwardBtn.id = 'nav-forward-button';
    forwardBtn.className = 'header-nav-button p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400';
    forwardBtn.setAttribute('aria-label', 'Forward');
    forwardBtn.setAttribute('title', 'Forward');
    forwardBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>';
  }
  navBar.appendChild(forwardBtn);

  // Search input
  let search = document.getElementById('searchInput');
  if (!search) { search = document.createElement('input');
    search.id = 'searchInput';
    search.type = 'text';
    search.placeholder = 'Search...';
    search.className = 'ml-4 px-3 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64';
    search.autocomplete = 'off'; }
  navBar.appendChild(search);
  navBackButton = backBtn;
  navForwardButton = forwardBtn;
  searchInput = search; }

function addTapListener(element, handler) { if (!element) return;
    function activate(e) { if (e.type === 'click' || (e.type === 'keypress' && (e.key === 'Enter' || e.key === ' '))) {
            e.preventDefault(); handler(e); } }
    element.addEventListener('click', activate);
    element.addEventListener('keypress', activate); }

// --- Autocomplete Functionality ---
function setupAutocomplete(textareaId, suggestionsContainerId, suggestionSourceSet) {
    const textarea = document.getElementById(textareaId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);

    textarea.addEventListener('input', function(e) { const inputText = e.target.value;
        const currentSegment = inputText.split(',').pop().trim().toLowerCase();
        if (currentSegment.length === 0) { suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = ''; return; }

        const filtered = Array.from(suggestionSourceSet)
                              .filter(function(s) { return s.toLowerCase().includes(currentSegment); });
        if (filtered.length > 0) { suggestionsContainer.innerHTML = filtered.map(function(s) {
                return '<div class="autocomplete-suggestion-item" data-value="' + s + '">' + s + '</div>';
            }).join(''); suggestionsContainer.classList.remove('hidden');
        } else { suggestionsContainer.classList.add('hidden'); }
    });

    addTapListener(suggestionsContainer, function(e) {
        if (e.target.classList.contains('autocomplete-suggestion-item')) { const selectedValue = e.target.dataset.value;
            let existingValues = textarea.value.split(',').map(function(v) { return v.trim(); }).filter(function(v) { return v; });
            // Remove the segment currently being typed
            if (existingValues.length > 0 && textarea.value.trim().slice(-1) !== ',') { existingValues.pop(); }
            // Avoid duplicate entries (case-insensitive)
            if (!existingValues.map(function(v) { return v.toLowerCase(); }).includes(selectedValue.toLowerCase())) {
                existingValues.push(selectedValue); }
            textarea.value = existingValues.join(', ') + (existingValues.length > 0 ? ", " : "");
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = '';
            textarea.focus(); updatePatientData(); } // Update patient data after selection
    });

    textarea.addEventListener('blur', function() {
        // Delay hiding to allow click on suggestions
        setTimeout(function() { suggestionsContainer.classList.add('hidden'); }, 150); });
    textarea.addEventListener('focus', function(e) { const inputText = e.target.value;
        const currentSegment = inputText.split(',').pop().trim().toLowerCase();
        if (currentSegment.length > 0) { const filtered = Array.from(suggestionSourceSet)
                                   .filter(function(s) { return s.toLowerCase().includes(currentSegment); });
            if (filtered.length > 0) {
                suggestionsContainer.innerHTML = filtered.map(function(s) { return '<div class="autocomplete-suggestion-item" data-value="' + s + '">' + s + '</div>'; }).join('');
                suggestionsContainer.classList.remove('hidden'); } }
    }); }

// --- Navigation History Management --- /let navigationHistory = []; /let currentHistoryIndex = -1; /let isNavigatingViaHistory = false;

function updateNavButtonsState() { if (!navBackButton || !navForwardButton) return;
    navBackButton.disabled = currentHistoryIndex <= 0;
    navForwardButton.disabled = currentHistoryIndex >= navigationHistory.length - 1; }

function addHistoryEntry(entry) { if (isNavigatingViaHistory) return;
    if (currentHistoryIndex < navigationHistory.length - 1) { navigationHistory = navigationHistory.slice(0, currentHistoryIndex + 1); }
    navigationHistory.push(entry);
    currentHistoryIndex = navigationHistory.length - 1;
    updateNavButtonsState(); }

function navigateViaHistory(direction) {
    if ((direction === -1 && currentHistoryIndex <= 0) ||
        (direction === 1 && currentHistoryIndex >= navigationHistory.length - 1)) return;
    isNavigatingViaHistory = true;
    currentHistoryIndex += direction;
    const state = navigationHistory[currentHistoryIndex];
    if (state.viewType === 'list') { searchInput.value = state.contentId || '';
        handleSearch(false, state.highlightTopicId, state.categoryPath || []);
    } else if (state.viewType === 'detail') { renderDetailPage(state.contentId, false, false); }
    updateNavButtonsState();
    isNavigatingViaHistory = false; }

// /if (shouldAddHistory) { addHistoryEntry({ viewType: 'detail', contentId: topicId }); }
if (navBackButton && navForwardButton) {
  addTapListener(navBackButton, () => navigateViaHistory(-1));
  addTapListener(navForwardButton, () => navigateViaHistory(1)); }

// --- Hierarchical List Rendering ---
function createHierarchicalList(items, container, level = 0) {
    container.innerHTML = '';
    items.forEach(item => { const row = document.createElement('div');
        row.className = 'flex items-center py-1 pl-' + (level * 4) + ' group';
        if (item.type === 'category') {     // Collapsible blue arrow
            const arrow = document.createElement('button');
            arrow.setAttribute('aria-label', 'Expand/collapse');
            arrow.className = 'arrow mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400';
            arrow.innerHTML = `<svg class="h-4 w-4 text-blue-600 transition-transform duration-200" style="transform: rotate(${item.expanded ? 90 : 0}deg);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>`;
            addTapListener(arrow, () => { item.expanded = !item.expanded;
                createHierarchicalList(items, container, level); });
            row.appendChild(arrow);
            // Category label
            const label = document.createElement('span');
            label.className = 'cursor-pointer hover:underline flex-1 font-semibold';
            label.textContent = item.title;
            addTapListener(label, () => { item.expanded = !item.expanded;
                createHierarchicalList(items, container, level); });
            row.appendChild(label);
            container.appendChild(row);
            if (item.expanded && item.children && item.children.length > 0) { const childContainer = document.createElement('div');
                childContainer.className = 'ml-4 border-l border-blue-100 pl-2';
                createHierarchicalList(item.children, childContainer, level + 1);
                container.appendChild(childContainer); }
        } else if (item.type === 'topic') { const topicLink = document.createElement('a');
            topicLink.className = 'topic-link-item flex-1';
            topicLink.textContent = item.title;
            topicLink.href = `#${item.id}`;
            topicLink.dataset.topicId = item.id;
            topicLink.setAttribute('role', 'button');
            topicLink.setAttribute('tabindex', '0');
            addTapListener(topicLink, e => { e.preventDefault();
                renderDetailPage(item.id); });
            row.appendChild(document.createElement('span')); // spacer for arrow alignment
            row.appendChild(topicLink);
            container.appendChild(row); }
    });
}
// Note: We also ensure contentArea is defined locally. The category list items still need a way to be identified by category ID if we ever wanted to manipulate them directly, so as an additional improvement, we can modify createHierarchicalList to set a data-category-id attribute on category rows: // Inside createHierarchicalList, in the category branch: row.dataset.categoryId = item.id;
function openCategoriesAndHighlight(categoryPath = [], highlightId = null) { contentArea = document.getElementById('content-area');
    // Mark each category in the path as expanded
    categoryPath.forEach(catId => { const catItem = allDisplayableTopicsMap[catId];
        if (catItem) catItem.expanded = true; });
    // Re-render the category list with updated expansion states
    contentArea.innerHTML = ''; 
    const listContainer = document.createElement('div');
    createHierarchicalList(paramedicCategories, listContainer, 0);
    contentArea.appendChild(listContainer);
    // Highlight the specified topic, if provided
    if (highlightId) { const topicEl = contentArea.querySelector(`[data-topic-id="${highlightId}"]`);
        if (topicEl) topicEl.classList.add('recently-viewed'); } }

    // Collapsible sections for details (ALS Medications)
    function renderDetailPage(topicId, shouldAddHistory = true, scrollToTop = true) { //function renderList(topicId, scrollToTop = true, shouldAddHistory = true) { const ul = document.createElement('ul');
    contentArea = document.getElementById('content-area');
    if (!allDisplayableTopicsMap[topicId]) { contentArea.innerHTML = `<div class="text-gray-500 italic">Not found.</div>`; return; }
    const topic = allDisplayableTopicsMap[topicId];     // /ul.id = 'ParamedicCategories-list'; const topic = allDisplayableTopicsMap[topicId]; }
    contentArea.innerHTML = '';
    const headerEl = document.createElement('h2'); // Header/title  // /const title = document.createElement('h2'); title.textContent = topic.title || topic.name || topic.id; title.dataset.topicId = topic.id; title.className = 'topic-h2';
    headerEl.textContent = topic.title || topic.name || topic.id;  // /contentArea.innerHTML = ''; contentArea.appendChild(title);
    headerEl.className = 'topic-h2 font-semibold text-lg mb-4';
    headerEl.dataset.topicId = topic.id; contentArea.appendChild(headerEl);

    let details = topic.details;  // Show details if available
    // Fallbacks for alternate IDs (numbered/un-numbered)
    if (!details && topic.id && topic.id.match(/^\d+-/)) {
        const altId = topic.id.replace(/^\d+-/, '');
        details = allDisplayableTopicsMap[altId]?.details;
    } else if (!details && topic.id && !topic.id.match(/^\d+-/)) {
        const altId = Object.keys(allDisplayableTopicsMap).find(k => k.endsWith(topic.id));
        if (altId) details = allDisplayableTopicsMap[altId]?.details; }

    if (details) {            // Render details sections if available
        const sections = [ { key: 'class', label: 'Class' },
            { key: 'indications', label: 'Indications' },
            { key: 'contraindications', label: 'Contraindications' },
            { key: 'precautions', label: 'Precautions' },
            { key: 'sideEffects', label: 'Significant Adverse/Side Effects' },
            { key: 'adultRx', label: 'Adult Rx' },
            { key: 'pediatricRx', label: 'Pediatric Rx' } ];
        sections.forEach(sec => { if (details[sec.key]) { const wrapper = document.createElement('div');
                wrapper.className = 'detail-section mb-3'; const title = document.createElement('div'); // section title
                title.className = 'font-bold mb-1'; title.textContent = sec.label; wrapper.appendChild(title);
// /const tocItems = []; sections.forEach(section => { if (d[section.key]) { const wrapper = document.createElement('div'); wrapper.className = 'detail-section mb-2'; const sectionId = typeof slugify === 'function' ? slugify(section.label) : section.label.toLowerCase().replace(/\s+/g, '-'); wrapper.id = sectionId; wrapper.dataset.label = section.label; tocItems.push({ label: section.label, id: sectionId });
// /const header = document.createElement('div'); header.className = 'flex items-center cursor-pointer select-none toggle-category'; const arrow = document.createElement('span'); arrow.className = 'arrow';
// /arrow.innerHTML = `<svg class="h-4 w-4 text-blue-600 transition-transform duration-200" style="transform: rotate(0deg);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>`; header.appendChild(arrow);
// /const labelEl = document.createElement('span'); labelEl.textContent = section.label; header.appendChild(labelEl); wrapper.appendChild(header); const body = document.createElement('div'); body.className = 'pl-6 py-2 hidden';
                let body;
                if (Array.isArray(details[sec.key])) {     // /if (Array.isArray(d[section.key])) {   /body.innerHTML = d[section.key].map(item => `<div>${item}</div>`).join('');   } else {
                    body = document.createElement('ul');   // /body.textContent = d[section.key]; }  /wrapper.appendChild(body); // addTapListener(header, () => {
                    details[sec.key].forEach(line => {     // /const isOpen = !body.classList.contains('hidden'); /body.classList.toggle('hidden');  /const svg = arrow.querySelector('svg'); // /if (svg) svg.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
                        const li = document.createElement('li');
                        li.innerHTML = parseTextMarkup ? parseTextMarkup(line) : line;
                        body.appendChild(li); });
                } else { body = document.createElement('div');
                    body.innerHTML = parseTextMarkup ? parseTextMarkup(details[sec.key]) : details[sec.key]; }
                wrapper.appendChild(body); contentArea.appendChild(wrapper); }
        });
    } else { // If no detailed info, show a fallback message
        contentArea.innerHTML += `<div class="text-gray-500 italic">No detail information found for this item.</div>`; }

    attachToggleInfoHandlers(contentArea);   // Attach click handlers for any toggleable info sections (if present)
    }
        // --- Previous/Next navigation for ALS Medications ---
        let prevId = null, nextId = null;
        const alsMedCat = paramedicCategories.find(cat => cat.title && cat.title.toLowerCase().includes('als medications'));
        if (alsMedCat && alsMedCat.children) {   // find index of current topic in ALS Medications list
            let idx = alsMedCat.children.findIndex(child => child.id === topic.id);
            if (idx === -1 && /^\d+-/.test(topic.id)) {
            const altId = topic.id.replace(/^\d+-/, '');
            idx = alsMedCat.children.findIndex(child => child.id === altId);
        } else if (idx === -1) { // try with number prefix
            const altId = Object.keys(allDisplayableTopicsMap).find(k => k.endsWith(topic.id));
            if (altId) idx = alsMedCat.children.findIndex(child => child.id === altId); }
        if (idx !== -1) {
            if (idx > 0) prevId = alsMedCat.children[idx - 1].id;
            if (idx < alsMedCat.children.length - 1) nextId = alsMedCat.children[idx + 1].id; } }
      
        if (prevId || nextId) {     // Add Prev/Next buttons if applicable
        const navRow = document.createElement('div');
        navRow.className = 'flex justify-between items-center mb-4';
        navRow.appendChild(prevId ? createNavButton('Previous', prevId) : document.createElement('span'));
        navRow.appendChild(nextId ? createNavButton('Next', nextId) : document.createElement('span'));
        contentArea.appendChild(navRow); }

    if (topic.description) { const desc = document.createElement('div');    // If a topic description exists and no slug anchors were added, show the description
        desc.className = 'mb-4'; desc.textContent = topic.description; contentArea.appendChild(desc); }

        if (shouldAddHistory) {addHistoryEntry({ viewType: 'detail', contentId: topicId }); }
        if (scrollToTop) { contentArea.scrollIntoView({ behavior: 'instant', block: 'start' }); }
  
function createNavButton(label, targetId) {  // Helper to create Prev/Next nav buttons:
    const btn = document.createElement('button');
    btn.className = 'p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center';
btn.innerHTML = (label === 'Previous')
    ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" 
           viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                 d="M15 19l-7-7 7-7" /></svg>${label}`
    : `${label}<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" 
           viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                 d="M9 5l7 7-7 7" /></svg>`;

    addTapListener(btn, () => renderDetailPage(targetId));
    return btn; }
  // if (tocItems.length > 0 && typeof window.setupSlugAnchors === 'function') { // window.setupSlugAnchors(tocItems);

function attachToggleInfoHandlers(container) {
    container.querySelectorAll('.toggle-info').forEach(el => {
        el.onclick = function(e) {
            e.stopPropagation();
            const info = el.querySelector('.info-text');
            if (info) info.classList.toggle('hidden'); }; }); }
 //   container.querySelectorAll('.toggle-info').forEach(el => { addTapListener(el, () => { const info = el.querySelector('.info-text');

function attachToggleCategoryHandlers(container) {      // --- Utility: toggling hidden info text in detail view ---
    container.querySelectorAll('.toggle-category').forEach(header => {
        addTapListener(header, () => {
            const arrow = header.querySelector('.arrow');
            if (arrow) arrow.classList.toggle('rotate');
            const content = header.nextElementSibling;
            if (content) content.classList.toggle('hidden'); }); }); }

function parseTextMarkup(text) {   // Escape HTML and replace special markup with styled spans
    let safeText = text.replace(/&/g, "&amp;")
                       .replace(/</g, "&lt;")
                       .replace(/>/g, "&gt;");
    safeText = safeText.replace(/\n/g, "<br>");
    safeText = safeText.replace(/\[\[(.+?)\|(.+?)\]\]/g, 
                (_, display, info) => `<span class="toggle-info">${display}<span class="info-text hidden">${info}</span></span>`);
    safeText = safeText.replace(/\{\{red:(.+?)\}\}/g, 
                (_, t) => `<span class="text-red-600 font-semibold">${t}</span>`);
    safeText = safeText.replace(/\{\{redul:(.+?)\}\}/g, 
                (_, t) => `<span class="text-red-600 font-semibold underline decoration-red-600">${t}</span>`);
    safeText = safeText.replace(/\{\{orange:(.+?)\}\}/g, 
                (_, t) => `<span class="text-orange-600">${t}</span>`);
    safeText = safeText.replace(/\{\{blackul:(.+?)\}\}/g, 
                (_, t) => `<span class="font-bold underline decoration-black">${t}</span>`);
    safeText = safeText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return safeText; }

function createDetailList(itemsArray) {
    if (!itemsArray || itemsArray.length === 0) {
        return '<p class="text-gray-500 italic">None listed.</p>'; }
    const listItemsHtml = itemsArray.map(it => {
        return `<li>${parseTextMarkup(it)}</li>`;
    }).join('');
    return `<ul class="detail-list">${listItemsHtml}</ul>`; }

function createDetailText(textBlock) {
    if (!textBlock || textBlock.toString().trim() === '') {
        return '<p class="text-gray-500 italic">Not specified.</p>'; }
    const safeText = parseTextMarkup(textBlock.toString());
    return `<div class="detail-text">${safeText}</div>`; }

function createWarningIcon(colorClass = 'text-yellow-600') {
    return `<svg class="${colorClass} w-5 h-5 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
            </svg>`; }
