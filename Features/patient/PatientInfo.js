/**
 * Handles the Patient Info sidebar functionality in the Paramedic Quick Reference app.
 *
 * This module manages the patientData object (age, weight, medical history, vitals, etc.) and updates
 * the app UI based on these inputs. It exposes the patientData object globally for backward
 * compatibility but also exports it for ES module consumers. A major improvement in this version
 * is support for dual weight inputs (kilograms and pounds). When the user enters a weight in one
 * unit, the other field automatically updates to the equivalent value. Internally we always store
 * weight in kilograms. See updatePatientData() and synchronizeWeights() for details.
 */

// The central patient data object. All fields are initialized to null or sensible defaults. The
// weightUnit property remains for potential future use but the code currently always stores weight
// in kilograms.
import { renderPatientSnapshot } from './PatientSnapshot.js';
import { splitSegments, normalizeCommittedValues } from './patientTerminology.js';

export const patientData = {
    age: null, weight: null, weightUnit: 'kg', gender: '', heightIn: null,
    pmh: [], pmhDisplay: [],
    allergies: [], allergyDisplay: [],
    currentMedications: [], medicationsDisplay: [], medicationClasses: [],
    indications: [], indicationsDisplay: [],
    symptoms: [], symptomsDisplay: [],
    vitalSigns: {
        bp: '', hr: null, spo2: null, etco2: null, rr: null, bgl: '', eyes: '', gcs: null, aoStatus: '', lungSounds: ''
    },
    ekg: '', ekgDisplay: ''
};
// IDs of inputs we want to monitor for changes. Exclude the weight unit select (no longer used) and
// include the new kilogram and pound inputs. When any of these inputs fires an input event, we call
// updatePatientData() to refresh patientData and update the UI.
const ptInputIds = [ 'pt-age', 
    'pt-weight-kg', 'pt-weight-lb', // dual weight inputs
    'pt-height-ft','pt-height-in','pt-height-inches',
    'pt-pmh', 
    'pt-allergies', 
    'pt-medications', 
    'pt-indications', 
    'pt-symptoms',
        'vs-bp', 
        'vs-hr', 
        'vs-spo2', 
        'vs-etco2', 
        'vs-rr', 
        'vs-bgl', 
        'vs-eyes', 
        'vs-gcs', 
        'vs-ao-status', 
        'vs-lung-sounds', 
        'pt-ekg' 
];
const ptInputs = ptInputIds.map(id => document.getElementById(id));
const genderInputEl = document.getElementById('pt-gender');
const sexButtons = Array.from(document.querySelectorAll('.sex-option'));
const weightSummaryEl = document.getElementById('weight-summary');
const ekgHelpButton = document.getElementById('ekg-help-button');
const ekgHelpModal = document.getElementById('ekg-help-modal');
const ekgHelpBackdrop = document.getElementById('ekg-help-backdrop');
const ekgHelpClose = document.getElementById('ekg-help-close');

function openEkgHelp() {
  if (!ekgHelpModal || !ekgHelpBackdrop) return;
  ekgHelpModal.classList.remove('hidden');
  ekgHelpBackdrop.classList.remove('hidden');
}

function closeEkgHelp() {
  if (!ekgHelpModal || !ekgHelpBackdrop) return;
  ekgHelpModal.classList.add('hidden');
  ekgHelpBackdrop.classList.add('hidden');
}


// Constants related to warnings and suggestions. PEDIATRIC_AGE_THRESHOLD defines the minimum age
// considered adult for protocol purposes. PDE5_INHIBITORS lists medications that may interact
// dangerously with nitroglycerin and similar treatments.
export const PEDIATRIC_AGE_THRESHOLD = 18;
export const PDE5_INHIBITORS = ["sildenafil","viagra","revatio","vardenafil","levitra","tadalafil","cialis","adcirca"];
// Suggestion sets used by the autocomplete component. These sets are populated elsewhere (see
// main.js) with common terms, allergies, medications, indications and symptoms.
export const pmhSuggestions = new Set();
export const allergySuggestions = new Set();
export const medicationNameSuggestions = new Set();
// Features/patient/PatientInfo.js – after existing symptomSuggestions
export const indicationSuggestions = new Set([
    // previously existing suggestions …
    "chest pain","shortness of breath","syncope","seizure",
    // 🆕 common indications
    "mi", "acs", "bronchospasm", "hypoglycemia", "asthma"
]);

export const symptomSuggestions = new Set([ 
    "chest pain","shortness of breath","sob","dyspnea","nausea","vomiting","diarrhea","abdominal pain","headache",
    "dizziness","syncope","altered mental status","ams","weakness","fatigue","fever","chills","rash","seizure",
    "palpitations","edema","cough","anxiety","depression","back pain","trauma"
]);

export const ekgSuggestions = new Set([
    'sinus tachycardia','sinus bradycardia','atrial fibrillation','atrial flutter','supraventricular tachycardia','ventricular tachycardia','junctional rhythm','asystole'
]);

/**
 * Retrieves the trimmed string value of an input by its DOM id. Returns an empty string if the
 * element does not exist. This helper ensures updatePatientData() can safely read values even if
 * some inputs haven’t been rendered yet.
 *
 * @param {string} id The id of the input element to read.
 * @returns {string} The trimmed value of the input or an empty string.
 */
function getInputValue(id) {
    return document.getElementById(id)?.value?.trim() ?? '';
}
/**
 * Parses an integer value from the input with the given id. Returns null if parsing fails or
 * the value is empty. This helps avoid NaN creeping into patientData.
 *
 * @param {string} id The id of the input element to parse.
 * @returns {number|null} The parsed integer or null.
 */
function getParsedInt(id, min, max) {
    const el = document.getElementById(id);
    const val = el?.value?.trim();
    if (!val) return null;
    const parsed = parseInt(val, 10);
    if (Number.isNaN(parsed)) return null;
    let clamped = parsed;
    if (typeof min === 'number' && clamped < min) clamped = min;
    if (typeof max === 'number' && clamped > max) clamped = max;
    if (el && clamped !== parsed) el.value = clamped.toString();
    return clamped;
}
/**
 * Parses a floating point value from the input with the given id. Returns null if parsing fails
 * or the value is empty. This helper is used for weight inputs where decimals are allowed.
 *
 * @param {string} id The id of the input element to parse.
 * @returns {number|null} The parsed float or null.
 */
function getParsedFloat(id) {
    const val = getInputValue(id);
    return val && !isNaN(parseFloat(val)) ? parseFloat(val) : null;
}
function getNormalizedNumberOrText(id, min, max) {
  const el = document.getElementById(id);
  const raw = el?.value?.trim() ?? '';
  if (!raw) return '';
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed)) return raw;
  let clamped = parsed;
  if (typeof min === 'number' && clamped < min) clamped = min;
  if (typeof max === 'number' && clamped > max) clamped = max;
  if (el && clamped !== parsed) el.value = clamped.toString();
  return clamped;
}

/**
 * Splits a comma‑separated textarea into an array of lower‑cased values. Returns an empty
 * array if the textarea is empty. This normalization step ensures that matching against
 * medication indications and allergies is case‑insensitive.
 *
 * @param {string} id The id of the textarea to process.
 * @returns {string[]} An array of trimmed, lower‑cased strings.
 */
function getFieldValues(field, id) {
  const node = document.getElementById(id);
  const rawValue = node?.value ?? '';
  const segments = splitSegments(rawValue);
  return normalizeCommittedValues(field, segments.committed);
}
// Weight conversion factor used when synchronizing kilogram and pound inputs. 1 kilogram equals
// 2.20462 pounds. We round converted values to one decimal place for display purposes.
const WEIGHT_CONVERSION_FACTOR = 2.20462;

function setSelectedSex(selected) {
  const target = selected ? selected.toLowerCase() : '';
  sexButtons.forEach(btn => {
    const isSelected = target && btn.dataset.value === target;
    btn.classList.toggle('is-selected', isSelected);
    btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
}

function updateWeightSummaryDisplay(weightKg) {
  if (!weightSummaryEl) return;
  if (typeof weightKg === 'number' && !Number.isNaN(weightKg)) {
    const pounds = weightKg * WEIGHT_CONVERSION_FACTOR;
    const kgText = Number.isInteger(weightKg) ? weightKg.toString() : weightKg.toFixed(1);
    const lbText = Math.round(pounds);
    weightSummaryEl.textContent = `Weight context: ${kgText} kg (${lbText} lb).`;
    weightSummaryEl.classList.remove('hidden');
  } else {
    weightSummaryEl.textContent = '';
    weightSummaryEl.classList.add('hidden');
  }
}

function dedupeByCanonical(canonicalValues, displayValues) {
  const canonical = [];
  const display = [];
  const seen = new Set();
  canonicalValues.forEach((value, index) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    canonical.push(value);
    display.push(displayValues[index]);
  });
  return { canonical, display };
}

let medicationClassLookup = null;

function ensureMedicationClassLookup() {
  const dataMap = (typeof window !== 'undefined' ? window.medicationDataMap : null);
  if (!dataMap) {
    medicationClassLookup = null;
    return null;
  }
  if (!medicationClassLookup || medicationClassLookup.size === 0) {
    medicationClassLookup = new Map();
    Object.values(dataMap).forEach(entry => {
      if (entry && entry.title && entry.class) {
        medicationClassLookup.set(entry.title.toLowerCase(), entry.class);
      }
    });
  }
  return medicationClassLookup;
}

function resolveMedicationClasses(medicationTitles) {
  const lookup = ensureMedicationClassLookup();
  if (!lookup) return [];
  const classes = [];
  medicationTitles.forEach(title => {
    if (!title) return;
    const className = lookup.get(title.toLowerCase());
    if (className && !classes.includes(className)) {
      classes.push(className);
    }
  });
  return classes;
}

function updateSuggestedTopics() {
  if (typeof window === 'undefined') return;
  const topicsMap = window.allDisplayableTopicsMap;
  if (!topicsMap) return;
  const indicationKeys = (patientData.indications || []).map(value => value.toLowerCase());
  const symptomKeys = (patientData.symptoms || []).map(value => value.toLowerCase());
  if (indicationKeys.length === 0 && symptomKeys.length === 0) {
    window.patientSuggestedTopics = [];
    return;
  }
  const suggestions = [];
  Object.values(topicsMap).forEach(topic => {
    if (!topic || topic.type !== 'topic') return;
    const details = topic.details || {};
    const topicIndications = (details.indications || []).map(val => val.toLowerCase());
    const topicSymptoms = (details.symptoms || []).map(val => val.toLowerCase());
    let score = 0;
    const matchedIndications = [];
    const matchedSymptoms = [];
    indicationKeys.forEach(key => {
      if (topicIndications.includes(key)) {
        score += 3;
        matchedIndications.push(key);
      }
    });
    symptomKeys.forEach(key => {
      if (topicSymptoms.includes(key)) {
        score += 1;
        matchedSymptoms.push(key);
      }
    });
    if (score > 0) {
      suggestions.push({ id: topic.id, score, matchedIndications, matchedSymptoms, title: topic.title });
    }
  });
  suggestions.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.title.localeCompare(b.title);
  });
  window.patientSuggestedTopics = suggestions.slice(0, 8);
}

function applyTopicStrikethroughs() {
  const topicLinks = document.querySelectorAll('a.topic-link-item');
  topicLinks.forEach(link => {
    const topicId = link.dataset.topicId;
    const topicObj = window.allDisplayableTopicsMap?.[topicId];
    if (patientData.indications.length > 0 && topicObj?.details?.indications) {
      const medIndications = topicObj.details.indications.map(i => i.toLowerCase());
      const hasMatch = patientData.indications.some(ind => medIndications.includes(ind.toLowerCase()));
      if (!hasMatch) {
        link.classList.add('strikethrough');
      } else {
        link.classList.remove('strikethrough');
      }
    } else {
      link.classList.remove('strikethrough');
    }
  });
}

/**
 * Synchronizes the kg and lb weight inputs. When called with a source of 'kg', the function
 * converts the kilogram input into pounds and updates the pound input. When called with a
 * source of 'lb', the pound input is converted back to kilograms and the kilogram input is
 * updated. If the source input is empty or invalid, the target input is cleared as well.
 *
 * @param {string} source Either 'kg' or 'lb' indicating which input triggered the change.
 */
function synchronizeWeights(source) {
  const kgEl = document.getElementById('pt-weight-kg');
  const lbEl = document.getElementById('pt-weight-lb');
  if (!kgEl || !lbEl) return;
  if (source === 'kg') {
    const kg = parseFloat(kgEl.value);
    if (!isNaN(kg)) {
      const lb = kg * WEIGHT_CONVERSION_FACTOR;
      lbEl.value = lb ? lb.toFixed(1) : '';
    } else {
      lbEl.value = '';
    }
  } else if (source === 'lb') {
    const lb = parseFloat(lbEl.value);
    if (!isNaN(lb)) {
      const kg = lb / WEIGHT_CONVERSION_FACTOR;
      kgEl.value = kg ? kg.toFixed(1) : '';
    } else {
      kgEl.value = '';
    }
  }
}

/**
 * Updates the global patientData object by reading all current inputs. This function is called on
 * every input event for monitored fields. It also handles striking through irrelevant topics in
 * the list, re‑rendering the detail page when necessary, and applying pediatric/adult section
 * strikeouts based on the patient’s age. Weight handling has been updated to support dual inputs
 */
function updatePatientData() {
    patientData.gender = getInputValue('pt-gender');
    setSelectedSex(patientData.gender);
    patientData.age = getParsedInt('pt-age', 0, 120);
    // Height sync: if inches given, use that; else compute from ft/in
    const ft = getParsedInt('pt-height-ft');
    const inch = getParsedInt('pt-height-in');
    const inches = getParsedInt('pt-height-inches');
    let totalIn = null;
    if (inches != null) totalIn = inches;
    else if (ft != null || inch != null) {
        totalIn = (ft || 0) * 12 + (inch || 0);
    }
    patientData.heightIn = totalIn;
    // Weight: determine which input has data. Prefer kilograms if both exist. We always store weight
    // internally in kilograms for dosing calculations. If neither field has a valid value, weight is
    // set to null.
    const kgVal = getParsedFloat('pt-weight-kg');
    const lbVal = getParsedFloat('pt-weight-lb');
    // Medication class dropdown removed; no medicationClasses in patientData

    if (kgVal !== null) {
        patientData.weight = kgVal;
        patientData.weightUnit = 'kg';
    } else if (lbVal !== null) {
        // Convert pounds to kilograms and round to two decimals
        patientData.weight = parseFloat((lbVal / WEIGHT_CONVERSION_FACTOR).toFixed(2));
        patientData.weightUnit = 'kg';
    } else {
        patientData.weight = null;
        patientData.weightUnit = 'kg';
    }
    updateWeightSummaryDisplay(patientData.weight);

    // Other patient fields
    // Removed obsolete weight inputs; weight unit is now always 'kg'.
    const pmhValues = getFieldValues('pmh', 'pt-pmh');
    const pmhUnique = dedupeByCanonical(pmhValues.canonical, pmhValues.display);
    patientData.pmh = pmhUnique.canonical;
    patientData.pmhDisplay = pmhUnique.display;

    const allergyValues = getFieldValues('allergies', 'pt-allergies');
    const allergyUnique = dedupeByCanonical(allergyValues.canonical, allergyValues.display);
    patientData.allergies = allergyUnique.canonical;
    patientData.allergyDisplay = allergyUnique.display;

    const medicationValues = getFieldValues('medications', 'pt-medications');
    const medicationUnique = dedupeByCanonical(medicationValues.canonical, medicationValues.display);
    patientData.currentMedications = medicationUnique.canonical;
    patientData.medicationsDisplay = medicationUnique.display;
    patientData.medicationClasses = resolveMedicationClasses(medicationUnique.canonical);

    const indicationValues = getFieldValues('indications', 'pt-indications');
    const indicationUnique = dedupeByCanonical(indicationValues.canonical, indicationValues.display);
    patientData.indications = indicationUnique.canonical;
    patientData.indicationsDisplay = indicationUnique.display;

    const symptomValues = getFieldValues('symptoms', 'pt-symptoms');
    const symptomUnique = dedupeByCanonical(symptomValues.canonical, symptomValues.display);
    patientData.symptoms = symptomUnique.canonical;
    patientData.symptomsDisplay = symptomUnique.display;

    const ekgValues = getFieldValues('ekg', 'pt-ekg');
    const ekgUnique = dedupeByCanonical(ekgValues.canonical, ekgValues.display);
    patientData.ekg = ekgUnique.canonical[0] || '';
    patientData.ekgDisplay = ekgUnique.display[0] || '';

    patientData.vitalSigns = {
        bp: getInputValue('vs-bp'),
        hr: getNormalizedNumberOrText('vs-hr', 0, 300),
        spo2: getNormalizedNumberOrText('vs-spo2', 50, 100),
        etco2: getNormalizedNumberOrText('vs-etco2', 0, 50),
        rr: getNormalizedNumberOrText('vs-rr', 0, 80),
        bgl: getInputValue('vs-bgl'),  // note: BGL might not be numeric (could be "High/Normal/Low")
        eyes: getInputValue('vs-eyes'),
        gcs: getNormalizedNumberOrText('vs-gcs', 3, 15),
        aoStatus: getInputValue('vs-ao-status'),
        lungSounds: getInputValue('vs-lung-sounds')
    };
     // If any indications are entered, strike through irrelevant topics in the list. We compare the
      // patient’s indications against each topic’s indications to determine relevance. This logic
      // originally lived in the ListView module but has been centralized here to respond to patient
      // input changes immediately.
    updateSuggestedTopics();
    const currentTopicTitleEl = window.contentArea?.querySelector('.topic-h2');
    const isSearchResults = Boolean(document.getElementById('results-container'));
    if (!currentTopicTitleEl && !isSearchResults && typeof window.renderInitialView === 'function') {
        window.renderInitialView(false);
    }
    applyTopicStrikethroughs();
    if (currentTopicTitleEl) {
        const currentTopicId = currentTopicTitleEl.dataset.topicId;
        if (currentTopicId && window.allDisplayableTopicsMap?.[currentTopicId]) {
            window.renderDetailPage(currentTopicId, false, false);
        }
        // After re-render, apply pediatric/adult section strikeouts
        if (patientData.age !== null) {
            if (patientData.age >= PEDIATRIC_AGE_THRESHOLD) {
                document.querySelectorAll('.pediatric-section .detail-section-title, .pediatric-section .detail-text, .pediatric-section .detail-list')
                    .forEach(el => el.classList.add('strikethrough'));
            } else {
                document.querySelectorAll('.adult-section .detail-section-title, .adult-section .detail-text, .adult-section .detail-list')
                    .forEach(el => el.classList.add('strikethrough'));
            }
        } else {
            // No age provided, remove any age-based strikethroughs
            document.querySelectorAll('.adult-section .strikethrough, .pediatric-section .strikethrough')
                    .forEach(el => el.classList.remove('strikethrough'));
        }
    }
    // Refresh the patient snapshot to reflect current data
  renderPatientSnapshot();
}

// Attach input event listeners for live updates. Each monitored input triggers updatePatientData().
ptInputs.forEach(input => {
  input?.addEventListener('input', updatePatientData);
});

sexButtons.forEach(btn => {
  btn.setAttribute('aria-pressed', 'false');
  btn.addEventListener('click', () => {
    if (!genderInputEl) return;
    const selectedValue = btn.dataset.value || '';
    genderInputEl.value = selectedValue;
    setSelectedSex(selectedValue);
    updatePatientData();
  });
});
setSelectedSex(genderInputEl ? genderInputEl.value : '');

if (ekgHelpButton && ekgHelpModal && ekgHelpBackdrop) {
  ekgHelpButton.addEventListener('click', openEkgHelp);
  ekgHelpBackdrop.addEventListener('click', closeEkgHelp);
  ekgHelpClose?.addEventListener('click', closeEkgHelp);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeEkgHelp();
  });
}

// Additional listeners for weight inputs to synchronize kg and lb values. We attach these
// separately because synchronizeWeights() must be called before updatePatientData() to ensure
// patientData.weight is based on the latest conversion.
const kgInputEl = document.getElementById('pt-weight-kg');
const lbInputEl = document.getElementById('pt-weight-lb');
if (kgInputEl) {
  kgInputEl.addEventListener('input', () => {
    synchronizeWeights('kg');
    updatePatientData();
  });
}
if (lbInputEl) {
  lbInputEl.addEventListener('input', () => {
    synchronizeWeights('lb');
    updatePatientData();
  });
}

// Removed Medication Class dropdown integration

// Expose our important values and functions globally for legacy scripts. This allows older code
// that references window.patientData, window.PEDIATRIC_AGE_THRESHOLD, etc. to continue working
// even though this module exports them. Once the entire app uses ES modules, these exposures can
// be removed.
if (typeof window !== 'undefined') {
  window.patientData = patientData;
  window.PEDIATRIC_AGE_THRESHOLD = PEDIATRIC_AGE_THRESHOLD;
  window.PDE5_INHIBITORS = PDE5_INHIBITORS;
  window.applyTopicStrikethroughs = applyTopicStrikethroughs;
  window.updateSuggestedTopics = updateSuggestedTopics;
}
// Sync height inputs both ways
function syncHeightsFromFtIn() {
  const ftEl = document.getElementById('pt-height-ft');
  const inEl = document.getElementById('pt-height-in');
  const totalEl = document.getElementById('pt-height-inches');
  if (ftEl && inEl && totalEl) {
    const ft = parseInt(ftEl.value || '0', 10);
    const inc = parseInt(inEl.value || '0', 10);
    if (!isNaN(ft) && !isNaN(inc)) totalEl.value = (ft*12 + inc) || '';
  }
}
function syncHeightsFromTotal() {
  const ftEl = document.getElementById('pt-height-ft');
  const inEl = document.getElementById('pt-height-in');
  const totalEl = document.getElementById('pt-height-inches');
  if (ftEl && inEl && totalEl) {
    const total = parseInt(totalEl.value || 'NaN', 10);
    if (!isNaN(total)) {
      ftEl.value = Math.floor(total/12);
      inEl.value = total % 12;
    }
  }
}
document.getElementById('pt-height-ft')?.addEventListener('input', () => { syncHeightsFromFtIn(); updatePatientData(); });
document.getElementById('pt-height-in')?.addEventListener('input', () => { syncHeightsFromFtIn(); updatePatientData(); });
document.getElementById('pt-height-inches')?.addEventListener('input', () => { syncHeightsFromTotal(); updatePatientData(); });
/*
  Features/patient/PatientInfo.js
  Purpose: Manages patient sidebar inputs (sex, age, weight, height, PMH, allergies, meds, indications, symptoms)
  and exposes derived helpers (e.g., suggestions/autocomplete data) used across the app.

  Notes:
  - Synchronizes sidebar values with window.patientData so other features (Quick Vent) can consume them.

  Tests:
  - Sidebar synchronization is exercised by E2E tests that change sex/weight and then compute TV.
  - No unit test harness present; consider adding a small DOM test for weight lb↔kg sync.
*/
