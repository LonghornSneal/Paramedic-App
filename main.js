import { ParamedicCategoriesData } from './Data/ParamedicCategoriesData.js';
import { MedicationDetailsData } from './Data/MedicationDetailsData.js';
import { VentilationDetailsData } from './Data/VentilationDetailsData.js';
import { ProtocolMarkdownMap } from './Data/ProtocolMarkdownMap.js';
import { addTapListener } from './Utils/addTapListener.js';
import { attachNavHandlers } from './Features/navigation/Navigation.js';
import { attachHomeHandler } from './Features/navigation/Home.js';
import { renderInitialView } from './Features/list/ListView.js';
import { renderDetailPage } from './Features/detail/DetailPage.js';
import { pmhSuggestions,
         allergySuggestions,
         medicationNameSuggestions,
         indicationSuggestions,
         symptomSuggestions,
         ekgSuggestions,
         lungSoundSuggestions,
         PDE5_INHIBITORS
        } from './Features/patient/PatientInfo.js';
import { setupAutocomplete, setupSingleValueAutocomplete } from './Features/patient/Autocomplete.js';
import { attachSearchHandlers, processItem } from './Features/search/Search.js';
import './Features/History.js';
import './Features/settings.js';
import { escapeHTML } from './Utils/escapeHTML.js';
import { setupSlugAnchors } from './Features/anchorNav/slugAnchors.js';

// --- Global Variables ---
let searchInput,
    patientSidebar,
    contentArea,
    openSidebarButton,
    closeSidebarButton,
    sidebarOverlay,
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
    patientSidebar = document.getElementById('patient-sidebar');
    openSidebarButton = document.getElementById('open-sidebar-button');
    closeSidebarButton = document.getElementById('close-sidebar-button');
    sidebarOverlay = document.getElementById('sidebar-overlay');
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
    window.patientSidebar = patientSidebar;
    window.openSidebarButton = openSidebarButton;
    window.closeSidebarButton = closeSidebarButton;
    window.sidebarOverlay = sidebarOverlay;
    window.navBackButton = navBackButton;
    window.navForwardButton = navForwardButton;
    window.navHomeButton = navHomeButton;
    window.settingsButton = settingsButton;
    window.settingsPanel = settingsPanel;

// Now that medicationDataMap exists, build the class dropdown
//insertMedicationClassDropdown();

    // Ensure overlay starts hidden
    attachNavHandlers();
    if (sidebarOverlay) {
        sidebarOverlay.classList.add('hidden');
        sidebarOverlay.classList.remove('active');
    }
    // Sidebar toggle handlers
    if (openSidebarButton) {
        addTapListener(openSidebarButton, () => {
            patientSidebar.classList.remove('hidden');
            patientSidebar.classList.add('open');
            sidebarOverlay.classList.add('active');
            sidebarOverlay.classList.remove('hidden');
        });
    }
    if (closeSidebarButton) {
        addTapListener(closeSidebarButton, () => {
            patientSidebar.classList.remove('open');
            setTimeout(() => patientSidebar.classList.add('hidden'), 200);
            sidebarOverlay.classList.remove('active');
            sidebarOverlay.classList.add('hidden');
        });
    }
    if (sidebarOverlay) {
        addTapListener(sidebarOverlay, () => {
            patientSidebar.classList.remove('open');
            // Wait for slide-out transition (0.2s) to complete, then hide the sidebar
            setTimeout(() => patientSidebar.classList.add('hidden'), 200);
            if (settingsPanel && !settingsPanel.classList.contains('hidden')) {
                settingsPanel.classList.add('hidden');
            }
                // If History panel is open, close it
            const histPanel = document.getElementById('history-panel');
            if (histPanel && !histPanel.classList.contains('hidden')) {
                histPanel.classList.add('hidden');
            }
            sidebarOverlay.classList.remove('active');
            sidebarOverlay.classList.add('hidden');
        });
    }

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

    // Initialize autocomplete suggestions
    setupAutocomplete('pt-pmh','pt-pmh-suggestions', pmhSuggestions, 'pmh');
    setupAutocomplete('pt-allergies','pt-allergies-suggestions', allergySuggestions, 'allergies');
    setupAutocomplete('pt-medications','pt-medications-suggestions', medicationNameSuggestions, 'medications');
    setupAutocomplete('pt-indications','pt-indications-suggestions', indicationSuggestions, 'indications');
    setupAutocomplete('pt-symptoms','pt-symptoms-suggestions', symptomSuggestions, 'symptoms');
    setupAutocomplete('pt-ekg','pt-ekg-suggestions', ekgSuggestions, 'ekg');
    setupSingleValueAutocomplete('vs-lung-sounds', 'vs-lung-sounds-suggestions', lungSoundSuggestions);

    // Render the initial patient snapshot once the dropdown is ready
    if (typeof window.renderPatientSnapshot === 'function') {
        window.renderPatientSnapshot();
    }

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

function insertMedicationClassDropdown() {
    const sidebar = document.getElementById('patient-sidebar');
    if (!sidebar) return;
    if (document.getElementById('pt-medication-class')) return; // avoid duplicates

    // Collect unique classes (stripped of markup)
    // IMPORTANT: Only use MedicationDetailsData (drugs). Do NOT include
    // classes from equipment/ventilation data to avoid polluting the list.
    const classesSet = new Set();
    (MedicationDetailsData || []).forEach(med => {
        const cls = med.class;
        if (Array.isArray(cls)) {
            cls.forEach(c => classesSet.add(cleanClassName(c)));
        } else if (cls) {
            classesSet.add(cleanClassName(cls));
        }
    });
    const classes = Array.from(classesSet).filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

    // Build the section
    const section = document.createElement('div');
    section.className = 'sidebar-section';
    const title = document.createElement('div');
    title.className = 'sidebar-section-title';
    title.textContent = 'Medication Class';
    const select = document.createElement('select');
    select.id    = 'pt-medication-class';
    select.className = 'sidebar-input w-full mt-1';

    const defaultOption    = document.createElement('option');
    defaultOption.value    = '';
    defaultOption.textContent = 'Select class';
    select.appendChild(defaultOption);

    classes.forEach(cls => {
        const opt = document.createElement('option');
        opt.value = cls.toLowerCase();
        opt.textContent = cls;
        select.appendChild(opt);
    });

    section.appendChild(title);
    section.appendChild(select);

    // Insert the new section right after the current medications section, if present
    const medsSection = sidebar.querySelector('#pt-medications')?.closest('.sidebar-section');
    if (medsSection) {
        medsSection.insertAdjacentElement('afterend', section);
    } else {
        sidebar.appendChild(section);
    }

    // Dispatch custom event so PatientInfo can attach the change listener
    document.dispatchEvent(new Event('medClassInserted'));
}

function stripMarkup(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/\[\[(.+?)\|(.+?)\]\]/g, '$1');
}

// Clean up a medication class string to remove markup and extra notes.
// - Removes wiki-style [[display|info]] markup (keeping display)
// - Trims whitespace
// - Drops trailing parenthetical notes
// - Drops trailing dashes/em-dashes notes
function cleanClassName(str) {
    const noMarkup = stripMarkup(String(str));
    // Remove parenthetical notes
    const noParens = noMarkup.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    // Cut at common separators that indicate extra description
    const cutAtDash = noParens.split(/\s[-â€“â€”]\s/)[0].trim();
    return cutAtDash;
}

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
    // âœ… Ensure the global map is set *before* processing items
    window.medicationDataMap = medicationDataMap;
    // Build the searchable index and allDisplayableTopicsMap using the provided categories
//    categoriesData.forEach(cat => processItem(cat));

        // Details merged above; no separate map required.

    // Populate allDisplayableTopicsMap safely and build the searchable index
    categoriesData.forEach(cat => processItem(cat));
    // Removed: Medication Class dropdown (no longer part of Patient Info sidebar)

/**
 * Insert the Medication Class dropdown into the patient sidebar.  Gathers all
 * unique classes from `window.medicationDataMap` and dispatches a custom
 * event once inserted so that PatientInfo can attach listeners.
 */

    // Load common suggestion terms into suggestion sets
    const commonPmh = ['hypertension','htn',
                       'diabetes','dm',
                       'asthma','copd',
                       'heart failure','hf',
                       'cad',
                       'stroke','cva',
                       'seizure disorder',
                       'renal insufficiency','ckd',
                       'hypothyroidism',
                       'hyperthyroidism',
                       'glaucoma',
                       'peptic ulcer',
                       'anxiety',
                       'depression'];
    const commonAllergies = ['penicillin','sulfa',
                             'aspirin','nsaids',
                             'morphine', 'codeine',
                             'iodine','shellfish','latex',
                             'peanuts','tree nuts'];
    const commonMedNames  = ['lisinopril','metformin',
                             'atorvastatin',
                             'amlodipine',
                             'hydrochlorothiazide','hctz',
                             'simvastatin',
                             'albuterol',
                             'levothyroxine',
                             'gabapentin',
                             'omeprazole',
                             'losartan',
                             'sertraline',
                             'furosemide','lasix',
                             'insulin',
                             'warfarin','coumadin','aspirin','clopidogrel','plavix'];
    // Add these common terms to the suggestion sets (defined in PatientInfo.js)
    commonPmh.forEach(term => pmhSuggestions.add(term));
    commonAllergies.forEach(term => allergySuggestions.add(term));
    commonMedNames.forEach(term => medicationNameSuggestions.add(term));
    PDE5_INHIBITORS.forEach(term => medicationNameSuggestions.add(term));
    // Extract additional allergy keywords from medication contraindications
    Object.values(medicationDataMap).forEach(med => {
        if (med.contraindications && Array.isArray(med.contraindications)) {
            med.contraindications.forEach(ci => {
                const ciLower = ci.toLowerCase();
                if (ciLower.includes('hypersensitivity') || ciLower.includes('allergy to')) {    // Derive a generalized allergen term from text
                    let allergen = ciLower.replace('known hypersensitivity to', '')
                                          .replace('allergy to any nsaid (including asa)', 'nsaid allergy')
                                          .replace('allergy to', '')
                                          .trim();
                    if (allergen.includes('local anesthetic allergy in the amide class')) {
                        allergen = 'amide anesthetic allergy';
                    } else if (allergen.includes('nsaid (including asa)')) {
                        allergen = 'nsaid allergy';
                    } else {
                        allergen = allergen.split('(')[0].trim();
                    }
                    if (allergen && allergen.length > 2 && allergen.length < 30) {
                        allergySuggestions.add(allergen);
                    }
                }
            });
        }
    });
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
