        // A new, consolidated main.js

//================================================================================
// 1. GLOBAL STATE & APP VARIABLES
//================================================================================

// --- DOM Elements ---
const searchInput = document.getElementById('searchInput');
const contentArea = document.getElementById('content-area');
const patientSidebar = document.getElementById('patient-sidebar');
const openSidebarButton = document.getElementById('open-sidebar-button');
const closeSidebarButton = document.getElementById('close-sidebar-button');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const navBackButton = document.getElementById('nav-back-button');
const navForwardButton = document.getElementById('nav-forward-button');

// --- App Data ---
let paramedicCategories = [];
let allSearchableTopics = [];
let allDisplayableTopicsMap = {};
let navigationHistory = [];
let currentHistoryIndex = -1;
let isNavigatingViaHistory = false;

// --- Patient Data ---
const PEDIATRIC_AGE_THRESHOLD = 18;
const PDE5_INHIBITORS = ["sildenafil", "viagra", "revatio", "vardenafil", "levitra", "tadalafil", "cialis", "adcirca"];
let patientData = {
    age: null, weight: null, weightUnit: 'kg', pmh: [], allergies: [], currentMedications: [], indications: [],
    symptoms: [],
    vitalSigns: { bp: '', hr: null, spo2: null, etco2: null, rr: null, bgl: '', eyes: '', gcs: null, aoStatus: '', lungSounds: '' },
    ekg: ''
};

// --- Autocomplete Suggestion Sets ---
let pmhSuggestions = new Set();
let allergySuggestions = new Set();
let medicationNameSuggestions = new Set();
let indicationSuggestions = new Set();
let symptomSuggestions = new Set(["chest pain", "shortness of breath", "sob", "dyspnea", "nausea", "vomiting", "diarrhea", "abdominal pain", "headache", "dizziness", "syncope", "altered mental status", "ams", "weakness", "fatigue", "fever", "chills", "rash", "seizure", "palpitations", "edema", "cough", "anxiety", "depression", "back pain", "trauma"]);


//================================================================================
// 2. CORE APPLICATION LOGIC
//================================================================================

/**
 * Processes the raw data from data files into a usable format for the app.
 */
function initializeData() {
    paramedicCategories = window.ParamedicCategoriesData || [];
    const medDetails = window.medicationDetailsData || {};

    // Build autocomplete suggestions from medication details
    Object.values(medDetails).forEach(med => {
        if (med.indications && Array.isArray(med.indications)) {
            med.indications.forEach(ind => indicationSuggestions.add(ind));
        }
        if (med.contraindications && Array.isArray(med.contraindications)) {
            med.contraindications.forEach(ci => {
                 const ciLower = ci.toLowerCase();
                 if (ciLower.includes("hypersensitivity")) {
                     allergySuggestions.add(ci.split(" to ")[1] || "unknown");
                 }
            });
        }
    });

    // Recursive function to process all items
    function processItem(item, parentPath = '', parentIds = []) {
        const currentPath = parentPath ? `${parentPath} > ${item.title}` : item.title;
        const currentIds = item.type === 'category' ? [...parentIds, item.id] : parentIds;
        
        const details = medDetails[item.id] || null;

        const fullItemDetails = {
            ...item,
            path: currentPath,
            details: details,
            categoryPath: parentIds
        };

        allDisplayableTopicsMap[item.id] = fullItemDetails;

        if (item.type === 'topic') {
            allSearchableTopics.push(fullItemDetails);
        }

        if (item.children) {
            item.children.forEach(child => processItem(child, currentPath, currentIds));
        }
    }

    paramedicCategories.forEach(category => processItem(category, '', []));
}

/**
 * Adds click and keyboard listeners to an element.
 */
function addTapListener(element, handler) {
    if (!element) return;
    const activate = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        handler(e);
    };

    element.addEventListener('click', activate);
    element.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            activate(e);
        }
    });
}

/**
 * Sets up autocomplete functionality for an input field.
 */
function setupAutocomplete(inputId, suggestionsContainerId, suggestionSource) {
    const input = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);
    
    if (!input || !suggestionsContainer) return;

    // A flag to check if we are dealing with comma-separated tags
    const isTagInput = input.tagName.toLowerCase() === 'textarea';

    input.addEventListener('input', function(e) {
        const inputText = e.target.value;
        const currentSegment = isTagInput ? inputText.split(',').pop().trim().toLowerCase() : inputText.trim().toLowerCase();

        if (currentSegment.length === 0) {
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = '';
            return;
        }
        
        const sourceArray = Array.from(suggestionSource);
        const filteredSuggestions = sourceArray.filter(item => {
            const suggestionText = (typeof item === 'object' ? item.title : item).toLowerCase();
            return suggestionText.includes(currentSegment);
        });

        if (filteredSuggestions.length > 0) {
            suggestionsContainer.innerHTML = filteredSuggestions.map(s => {
                const value = typeof s === 'object' ? s.title : s;
                 const id = typeof s === 'object' ? s.id : value;
                return `<div class="autocomplete-suggestion-item" data-value="${value}" data-id="${id}">${value}</div>`;
            }).join('');
            suggestionsContainer.classList.remove('hidden');
        } else {
            suggestionsContainer.classList.add('hidden');
        }
    });

    addTapListener(suggestionsContainer, function(e) {
        if (e.target.classList.contains('autocomplete-suggestion-item')) {
            if (isTagInput) {
                const selectedValue = e.target.dataset.value;
                let existingValues = input.value.split(',').map(v => v.trim()).filter(v => v);
                if (existingValues.length > 0 && input.value.trim().slice(-1) !== ',') {
                    existingValues.pop();
                }
                if (!existingValues.map(v => v.toLowerCase()).includes(selectedValue.toLowerCase())) {
                    existingValues.push(selectedValue);
                }
                input.value = existingValues.join(', ') + (existingValues.length > 0 ? ", " : "");
                updatePatientData();
            } else {
                 const topicId = e.target.dataset.id;
                 input.value = ''; // Clear search bar
                 renderDetailPage(topicId);
            }
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = '';
            input.focus();
        }
    });

    input.addEventListener('blur', function() {
        setTimeout(() => {
            suggestionsContainer.classList.add('hidden');
        }, 200);
    });
}

// All your other functions from main.js and PatientInfo.js go here...
// (renderInitialView, renderSearchResults, renderDetailPage, parseTextMarkup, etc.)
// For brevity, I am only showing the changed/new ones. The rest of your existing
// functions in main.js should be preserved below this point. The following are
// just a few key functions for context.

function renderDetailPage(topicId, scrollToTop = true, shouldAddHistory = true) {
    const topic = allDisplayableTopicsMap[topicId];
    if (!topic) {
        contentArea.innerHTML = `<p class="text-red-600 text-center py-4">Error: Topic not found (ID: ${topicId}).</p>`;
        return;
    }

    if (shouldAddHistory) {
        // ... your history logic ...
    }

    let detailContentHtml = '';
    if (topic.details) {
        const d = topic.details;
        // This part builds the detailed HTML from the topic.details object
        detailContentHtml = `
            ${d.class ? `<div class="detail-section"><h3 class="detail-section-title">Class:</h3><div class="detail-text">${createDetailText(d.class)}</div></div>` : ''}
            ${d.indications ? `<div class="detail-section"><h3 class="detail-section-title">Indications:</h3>${createDetailList(d.indications)}</div>` : ''}
            ${d.contraindications ? `<div class="detail-section"><h3 class="detail-section-title">Contraindications:</h3>${createDetailList(d.contraindications)}</div>` : ''}
            ${d.adultRx ? `<div class="detail-section"><h3 class="detail-section-title">Adult Rx:</h3><div class="detail-text">${createDetailText(Array.isArray(d.adultRx) ? d.adultRx.join('\n\n') : d.adultRx)}</div></div>` : ''}
            `;
    } else {
        detailContentHtml = `<p class="text-lg italic">This is a placeholder for <strong>${topic.title}</strong>.</p><p class="text-sm text-gray-600">Detailed information to be added.</p>`;
    }

    contentArea.innerHTML = `
        <div class="flex justify-between items-center mb-4 pb-3 border-b">
            <h2 class="text-2xl font-bold text-blue-700">${topic.title} ${topic.details?.concentration ? `<span class="text-base font-normal text-gray-500">${topic.details.concentration}</span>` : ''}</h2>
            <button id="backToListButton" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Back to List</button>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-inner space-y-3">${detailContentHtml}</div>
    `;

    addTapListener(document.getElementById('backToListButton'), () => {
        renderInitialView(false); // Go back without creating a new history entry
    });
}

function createDetailList(itemsArray) {
    if (!itemsArray || itemsArray.length === 0) return '<p class="text-gray-500 italic">None listed.</p>';
    return `<ul class="list-disc list-inside pl-4">${itemsArray.map(item => `<li>${parseTextMarkup(item)}</li>`).join('')}</ul>`;
}

function createDetailText(textBlock) {
    if (!textBlock || textBlock.trim() === '') return '<p class="text-gray-500 italic">Not specified.</p>';
    return `<div class="whitespace-pre-wrap">${parseTextMarkup(textBlock)}</div>`;
}

function parseTextMarkup(text) {
    // Your existing parseTextMarkup function
    let safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    safeText = safeText.replace(/\n/g, "<br>");
    safeText = safeText.replace(/\[\[(.+?)\|(.+?)\]\]/g, (m, disp, info) => `<span class="toggle-info">${disp}<span class="info-text hidden">${info}</span></span>`);
    safeText = safeText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return safeText;
}


function createHierarchicalList(items, container) {
    items.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'py-1';
        if (item.type === 'category') {
            listItem.innerHTML = `<div class="category-header bg-gray-100 p-2 rounded cursor-pointer font-semibold">${item.title}</div><div class="category-children pl-4 hidden"></div>`;
            const childrenContainer = listItem.querySelector('.category-children');
            addTapListener(listItem.querySelector('.category-header'), (e) => {
                e.currentTarget.nextElementSibling.classList.toggle('hidden');
            });
            createHierarchicalList(item.children, childrenContainer);
        } else if (item.type === 'topic') {
            listItem.innerHTML = `<a href="#" class="topic-link-item block p-2 rounded hover:bg-sky-100" data-topic-id="${item.id}">${item.title}</a>`;
            const topicLink = listItem.querySelector('a');
            addTapListener(topicLink, () => renderDetailPage(item.id));
        }
        container.appendChild(listItem);
    });
}


function renderInitialView(shouldAddHistory = true) {
    contentArea.innerHTML = `<div id="hierarchical-list-container" class="space-y-2"></div>`;
    const listContainer = document.getElementById('hierarchical-list-container');
    if (paramedicCategories.length > 0) {
        createHierarchicalList(paramedicCategories, listContainer);
    } else {
        listContainer.innerHTML = '<p class="text-gray-500 text-center">No categories available.</p>';
    }
    if (shouldAddHistory) {
        // your history logic
    }
}

function handleSearch(shouldAddHistory = true) {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (!searchTerm) {
        renderInitialView(shouldAddHistory);
        return;
    }
    const filteredTopics = allSearchableTopics.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm) || topic.path.toLowerCase().includes(searchTerm)
    );
    renderSearchResults(filteredTopics, searchTerm, shouldAddHistory);
}

function renderSearchResults(filteredTopics, searchTerm, shouldAddHistory) {
    // Your existing function
}

function updatePatientData() {
    // Your existing function
}

//================================================================================
// 3. APP INITIALIZATION
//================================================================================

/**
 * Main function to start the application.
 */
function initApp() {
    // 1. Prepare all data
    initializeData();

    // 2. Set up event listeners
    addTapListener(openSidebarButton, () => patientSidebar.classList.add('open'));
    addTapListener(closeSidebarButton, () => patientSidebar.classList.remove('open'));
    addTapListener(sidebarOverlay, () => patientSidebar.classList.remove('open'));
    
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(true);
        }
    });

    // 3. Set up all autocomplete fields
    // **This fixes the search bar autocomplete**
    // First, add a suggestions container to your index.html right after the search bar
    const searchContainer = searchInput.parentElement;
    searchContainer.style.position = 'relative'; // Required for absolute positioning of suggestions
    searchContainer.insertAdjacentHTML('beforeend', '<div id="search-suggestions" class="autocomplete-suggestions hidden"></div>');
    
    setupAutocomplete('searchInput', 'search-suggestions', allSearchableTopics);

    // Patient info autocompletes
    setupAutocomplete('pt-pmh', 'pt-pmh-suggestions', pmhSuggestions);
    setupAutocomplete('pt-allergies', 'pt-allergies-suggestions', allergySuggestions);
    setupAutocomplete('pt-medications', 'pt-medications-suggestions', medicationNameSuggestions);
    
    // 4. Render the initial view
    renderInitialView();
}

// --- Start the app once the DOM is ready ---
document.addEventListener('DOMContentLoaded', initApp);