import './tracing/initTracing.js';
import { ParamedicCategoriesData } from './Data/ParamedicCategoriesData.js';
import { MedicationDetailsData } from './Data/MedicationDetailsData.js';
import { VentilationDetailsData } from './Data/VentilationDetailsData.js';
import { ProtocolMarkdownMap } from './Data/ProtocolMarkdownMap.js';
import { attachNavHandlers } from './Features/navigation/Navigation.js';
import { attachHomeHandler } from './Features/navigation/Home.js';
import { renderInitialView } from './Features/list/ListView.js';
import { attachSearchHandlers, processItem } from './Features/search/Search.js';
import './Features/History.js';
import './Features/settings.js';
import { escapeHTML } from './Utils/escapeHTML.js';
import { initPatientSidebar, seedPatientSuggestionSets } from './Features/patient/PatientSidebar.js';

// --- Global Variables ---
let searchInput,
    contentArea,
    navBackButton,
    navForwardButton,
    navHomeButton,
    settingsButton,
    settingsPanel;
let medicationDataMap = {};
let allDisplayableTopicsMap = {};
let paramedicCategories = [];

// Assigns key UI elements to global variables for easy access.
function assignDomElements() {
    searchInput = document.getElementById('searchInput');
    contentArea = document.getElementById('content-area');
    navBackButton = document.getElementById('nav-back-button');
    navForwardButton = document.getElementById('nav-forward-button');
    navHomeButton = document.getElementById('nav-home-button');
    settingsButton = document.getElementById('settings-button');
    settingsPanel = document.getElementById('settings-panel');
}
// Kick off the application once DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Initializes the application, setting up UI event handlers and loading data.
function initApp() {
    // Warn if loaded from file:// which breaks ES module imports in browsers
    if (location.protocol === 'file:') {
        const el = document.getElementById('content-area');
        if (el) {
            el.innerHTML = `<div class="p-4 text-red-700 bg-red-50 border border-red-200 rounded">
                This app must be opened over HTTP due to browser module security.
                Please run a local server (e.g., <code>python -m http.server</code>)
                and open <code>http://localhost:3001/</code>.
            </div>`;
        }
        return;
    }
    // Initialize header elements (they are already defined in index.html)
    assignDomElements();
    // Make these DOM element references global for other modules/scripts to use
    window.searchInput = searchInput;
    window.contentArea = contentArea;
    window.navBackButton = navBackButton;
    window.navForwardButton = navForwardButton;
    window.navHomeButton = navHomeButton;
    window.settingsButton = settingsButton;
    window.settingsPanel = settingsPanel;

    attachNavHandlers();

    // Global error surface to help catch runtime issues
    window.addEventListener('error', (e) => {
        try {
            const area = window.contentArea || document.getElementById('content-area');
            if (area) {
                area.innerHTML = `<div class="p-4 text-red-700 bg-red-50 border border-red-200 rounded">
                    A runtime error occurred: ${escapeHTML(e.message || 'Unknown error')}
                </div>`;
            }

            console.error('Runtime error:', e.error || e.message, e);
        } catch { /* ignore */ }
    }, { once: true });

    attachSearchHandlers();  // Calls the function from Features/search/Search.js
    attachHomeHandler();
    // Now initialize data structures from globals   // These should be loaded BEFORE this script runs (by script order in index.html)
    if (ParamedicCategoriesData && MedicationDetailsData) {
        initializeData(ParamedicCategoriesData, MedicationDetailsData);
    } else {
        console.error('Category or medication data not loaded!');
    }
        // After data initialization, expose data maps globally for now
    window.paramedicCategories = paramedicCategories;
    window.medicationDataMap = medicationDataMap;
    window.allDisplayableTopicsMap = allDisplayableTopicsMap;

    initPatientSidebar({ settingsPanel });

    // Add focus highlight to all textareas and inputs
    document.querySelectorAll('textarea, input').forEach(el => {
        el.addEventListener('focus', () => el.classList.add('ring', 'ring-blue-300'));
        el.addEventListener('blur', () => el.classList.remove('ring', 'ring-blue-300'));
    });
    // Finally, render the initial category list view
    if (Array.isArray(paramedicCategories) && paramedicCategories.length > 0) {
        renderInitialView(true);
    } else {
        contentArea.innerHTML = `<div class="p-4 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded">
            No categories available to display.
        </div>`;
    }
}

// insertMedicationClassDropdown relocated to Features/patient/PatientSidebar.js

// stripMarkup and cleanClassName relocated to Features/patient/PatientSidebar.js

// Initializes global data structures for categories and medications.
function applyMarkdownDetails(nodes) {
    if (!Array.isArray(nodes)) return;
    nodes.forEach(node => {
        if (node.type === 'topic') {
            const mdPath = ProtocolMarkdownMap[node.id];
            if (mdPath && !node.details) {
                node.details = { mdPath };
            }
        }
        if (Array.isArray(node.children) && node.children.length) {
            applyMarkdownDetails(node.children);
        }
    });
}
function initializeData(categoriesData, medDetailsData) { // /Assign the global category array
    paramedicCategories = categoriesData;
    applyMarkdownDetails(paramedicCategories);
    // Reset maps
    allDisplayableTopicsMap = {};
    // Make sure the global map exists BEFORE processItem uses it
    window.allDisplayableTopicsMap = allDisplayableTopicsMap;
//allSearchableTopics = []; //  //maybe need still maybe not
     //Build med details map for quick lookups
    medicationDataMap = {};
      // Build the medicationDataMap by merging medication and ventilation details.  This map
    // is used by the search/indexing code to attach detail information to each topic.
    [...MedicationDetailsData, ...VentilationDetailsData].forEach(item => {
        medicationDataMap[item.id] = item;
    });
    // Ensure the global map is set *before* processing items
    window.medicationDataMap = medicationDataMap;
    // Build the searchable index and allDisplayableTopicsMap using the provided categories
//    categoriesData.forEach(cat => processItem(cat));

        // Details merged above; no separate map required.

    // Populate allDisplayableTopicsMap safely and build the searchable index
    categoriesData.forEach(cat => processItem(cat));
    seedPatientSuggestionSets(medicationDataMap);
}
/*
  main.js
  Purpose: Application bootstrap. Wires core UI elements, loads data (categories, meds, vent),
  attaches navigation/search/settings handlers, and renders the initial ListView.

  Functional coverage:
  - DOM readiness + global references (window.*)
  - Sidebar open/close and focus rings
  - Navigation buttons, History panel, Settings panel
  - Initializes searchable maps (allDisplayableTopicsMap, medicationDataMap)
  - Renders initial categories via ListView

  Tests:
  - End-to-end checks live in Playwright tests under dev-tools/tests (see ventilation.spec.js for Quick Vent flows).
  - No unit test harness present for this file.
*/
