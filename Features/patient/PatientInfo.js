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
export const patientData = {
    age: null, weight: null, weightUnit: 'kg',
    pmh: [], allergies: [], currentMedications: [], indications: [], symptoms: [],
    vitalSigns: {
        bp: '', hr: null, spo2: null, etco2: null, rr: null, bgl: '', eyes: '', gcs: null, aoStatus: '', lungSounds: ''
    },
    ekg: ''
};
// IDs of inputs we want to monitor for changes. Exclude the weight unit select (no longer used) and
// include the new kilogram and pound inputs. When any of these inputs fires an input event, we call
// updatePatientData() to refresh patientData and update the UI.
const ptInputIds = [ 'pt-age', 
    'pt-weight-kg', 'pt-weight-lb', // dual weight inputs
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
function getParsedInt(id) {
    const val = getInputValue(id);
    return val ? parseInt(val, 10) : null;
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
/**
 * Splits a comma‑separated textarea into an array of lower‑cased values. Returns an empty
 * array if the textarea is empty. This normalization step ensures that matching against
 * medication indications and allergies is case‑insensitive.
 *
 * @param {string} id The id of the textarea to process.
 * @returns {string[]} An array of trimmed, lower‑cased strings.
 */
function getArrayFromTextarea(id) {
    const value = getInputValue(id);
    return value ? value.split(',').map(v => v.trim().toLowerCase()).filter(Boolean) : [];
}
// Weight conversion factor used when synchronizing kilogram and pound inputs. 1 kilogram equals
// 2.20462 pounds. We round converted values to one decimal place for display purposes.
const WEIGHT_CONVERSION_FACTOR = 2.20462;

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
    patientData.age = getParsedInt('pt-age');
    // Weight: determine which input has data. Prefer kilograms if both exist. We always store weight
    // internally in kilograms for dosing calculations. If neither field has a valid value, weight is
    // set to null.
    const kgVal = getParsedFloat('pt-weight-kg');
    const lbVal = getParsedFloat('pt-weight-lb');
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
    // Other patient fields
    // Removed obsolete weight inputs; weight unit is now always 'kg'.
    patientData.pmh = getArrayFromTextarea('pt-pmh');
    patientData.allergies = getArrayFromTextarea('pt-allergies');
    patientData.currentMedications = getArrayFromTextarea('pt-medications');
    patientData.indications = getArrayFromTextarea('pt-indications');
    patientData.symptoms = getArrayFromTextarea('pt-symptoms');
    patientData.vitalSigns = {
        bp: getInputValue('vs-bp'),
        hr: getParsedInt('vs-hr'),
        spo2: getParsedInt('vs-spo2'),
        etco2: getParsedInt('vs-etco2'),
        rr: getParsedInt('vs-rr'),
        bgl: getInputValue('vs-bgl'),  // note: BGL might not be numeric (could be "High/Normal/Low")
        eyes: getInputValue('vs-eyes'),
        gcs: getParsedInt('vs-gcs'),
        aoStatus: getInputValue('vs-ao-status'),
        lungSounds: getInputValue('vs-lung-sounds')
    };
     // If any indications are entered, strike through irrelevant topics in the list. We compare the
      // patient’s indications against each topic’s indications to determine relevance. This logic
      // originally lived in the ListView module but has been centralized here to respond to patient
      // input changes immediately.
    const topicLinks = document.querySelectorAll('a.topic-link-item');
    topicLinks.forEach(link => {
        const topicId = link.dataset.topicId;
        const topicObj = window.allDisplayableTopicsMap?.[topicId];
        if (patientData.indications.length > 0 && topicObj?.details?.indications) {
            const medIndications = topicObj.details.indications.map(i => i.toLowerCase());
            const hasMatch = patientData.indications.some(ind => medIndications.includes(ind));
            if (!hasMatch) {
                link.classList.add('strikethrough');
            } else {
                link.classList.remove('strikethrough');
            }
        } else {
            // No filtering, ensure nothing is struck out
            link.classList.remove('strikethrough');
        }
    });
    // If a detail page is open, re-render it to update warnings/dosages based on new patient info. We
    // identify a detail page by checking for an element with class .topic-h2 which stores the topic id.
    const currentTopicTitleEl = window.contentArea?.querySelector('.topic-h2');
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
}

// Attach input event listeners for live updates. Each monitored input triggers updatePatientData().
ptInputs.forEach(input => {
  input?.addEventListener('input', updatePatientData);
});

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

// Expose our important values and functions globally for legacy scripts. This allows older code
// that references window.patientData, window.PEDIATRIC_AGE_THRESHOLD, etc. to continue working
// even though this module exports them. Once the entire app uses ES modules, these exposures can
// be removed.
if (typeof window !== 'undefined') {
  window.patientData = patientData;
  window.PEDIATRIC_AGE_THRESHOLD = PEDIATRIC_AGE_THRESHOLD;
  window.PDE5_INHIBITORS = PDE5_INHIBITORS;
}
