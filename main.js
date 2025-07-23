import { ParamedicCategoriesData } from './Data/ParamedicCategoriesData.js';
import { MedicationDetailsData } from './Data/MedicationDetailsData.js';
import { VentilationDetailsData } from './Data/VentilationDetailsData.js';
import { addTapListener } from './Utils/addTapListener.js';
import { attachNavHandlers } from './Features/navigation/Navigation.js';
import { attachHomeHandler } from './Features/navigation/Home.js';
import { renderInitialView } from './Features/list/ListView.js';
import { renderDetailPage } from './Features/detail/DetailPage.js';
import { pmhSuggestions, allergySuggestions, medicationNameSuggestions, indicationSuggestions, symptomSuggestions, PDE5_INHIBITORS } from './Features/patient/PatientInfo.js';
import { setupAutocomplete } from './Features/patient/Autocomplete.js';
import { attachSearchHandlers, processItem } from './Features/search/Search.js';
import './Features/History.js';
import './Features/settings.js';
import { escapeHTML } from './Utils/escapeHTML.js';
import { setupSlugAnchors } from './Features/anchorNav/slugAnchors.js';

// --- Global Variables ---
let searchInput, patientSidebar, contentArea, openSidebarButton, closeSidebarButton, sidebarOverlay, navBackButton, navForwardButton, navHomeButton, settingsButton, settingsPanel;
let medicationDataMap = {};
let allDisplayableTopicsMap = {};
let paramedicCategories = []; // This must be a global var!




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

    attachSearchHandlers();  // Calls the function from Features/search/Search.js
    attachHomeHandler();
    // Now initialize data structures from globals   // These should be loaded BEFORE this script runs (by script order in index.html)
    if (ParamedicCategoriesData && MedicationDetailsData) {
        initializeData(ParamedicCategoriesData, MedicationDetailsData);
    } else {
        console.error("Category or medication data not loaded!");
    } 
        // After data initialization, expose data maps globally for now
    window.paramedicCategories = paramedicCategories;
    window.medicationDataMap = medicationDataMap;
    window.allDisplayableTopicsMap = allDisplayableTopicsMap;

    // Initialize autocomplete suggestions
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
    // Finally, render the initial category list view
    renderInitialView(true); 
}

// Initializes global data structures for categories and medications.
function initializeData(categoriesData, medDetailsData) { 
    paramedicCategories = categoriesData;    // /Assign the global category array
    // Wipe/prepare lookup maps
    allDisplayableTopicsMap = {};
    // Make sure the global map exists BEFORE processItem uses it
    window.allDisplayableTopicsMap = allDisplayableTopicsMap;
//    /allSearchableTopics = []; //maybe need still maybe not
    // Build med details map for quick lookups
//    medicationDataMap = {};
//    if (Array.isArray(medDetailsData)) { 
//        medDetailsData.forEach(med => { 
//            medicationDataMap[med.id] = med; 
//        });


    // Merge medication and ventilation details into a single map.  This ensures that
    // topics defined under the ventilation category have matching details entries.
    const detailsDataMap = {};
    [...MedicationDetailsData, ...VentilationDetailsData].forEach(item => {
      detailsDataMap[item.id] = item;
    });
    } else if (medDetailsData && typeof medDetailsData === 'object') { 
        Object.assign(medicationDataMap, medDetailsData); 
    }
    // ✅ Ensure the global map is set *before* processing items
    window.medicationDataMap = medicationDataMap; 
    // populate allDisplayableTopicsMap safely
    categoriesData.forEach(cat => processItem(cat));
    // Load common suggestion terms into suggestion sets
    const commonPmh = ["hypertension","htn","diabetes","dm","asthma","copd","heart failure","hf","cad","stroke","cva","seizure disorder","renal insufficiency","ckd","hypothyroidism","hyperthyroidism","glaucoma","peptic ulcer","anxiety","depression"];
    const commonAllergies = ["penicillin","sulfa","aspirin","nsaids","morphine", "codeine","iodine","shellfish","latex","peanuts","tree nuts"];
    const commonMedNames  = ["lisinopril","metformin","atorvastatin","amlodipine","hydrochlorothiazide","hctz","simvastatin","albuterol","levothyroxine","gabapentin","omeprazole","losartan","sertraline","furosemide","lasix","insulin","warfarin","coumadin","aspirin","clopidogrel","plavix"];
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
                if (ciLower.includes("hypersensitivity") || ciLower.includes("allergy to")) {    // Derive a generalized allergen term from text
                    let allergen = ciLower.replace("known hypersensitivity to", "")
                                          .replace("allergy to any nsaid (including asa)", "nsaid allergy")
                                          .replace("allergy to", "").trim();
                    if (allergen.includes("local anesthetic allergy in the amide class")) { 
                        allergen = "amide anesthetic allergy";
                    } else if (allergen.includes("nsaid (including asa)")) {
                        allergen = "nsaid allergy";
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
