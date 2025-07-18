/**
 * Handles the Patient Info sidebar functionality in the Paramedic Quick Reference app.
 * Manages the patientData object (age, weight, medical history, vitals, etc.) and updates the app UI based on these inputs.
 * Opens/closes the Patient Info sidebar and adjusts content (strikethrough irrelevant info, auto-calc dosages, warnings) according to entered patient information.
 */
// Features/patient/PatientInfo.js – Patient Info sidebar functionality
export const patientData = {
    age: null, weight: null, weightUnit: 'kg',
    pmh: [], allergies: [], currentMedications: [], indications: [], symptoms: [],
    vitalSigns: {
        bp: '', hr: null, spo2: null, etco2: null, rr: null, bgl: '', eyes: '', gcs: null, aoStatus: '', lungSounds: ''
    },
    ekg: ''
};

const ptInputIds = [ 'pt-age', 'pt-weight', 'pt-weight-unit', 'pt-pmh', 'pt-allergies', 'pt-medications', 'pt-indications', 'pt-symptoms',
                     'vs-bp', 'vs-hr', 'vs-spo2', 'vs-etco2', 'vs-rr', 'vs-bgl', 'vs-eyes', 'vs-gcs', 'vs-ao-status', 'vs-lung-sounds', 'pt-ekg' ];
const ptInputs = ptInputIds.map(id => document.getElementById(id));

export const PEDIATRIC_AGE_THRESHOLD = 18;
export const PDE5_INHIBITORS = ["sildenafil","viagra","revatio","vardenafil","levitra","tadalafil","cialis","adcirca"];

export const pmhSuggestions = new Set();
export const allergySuggestions = new Set();
export const medicationNameSuggestions = new Set();
export const indicationSuggestions = new Set();
export const symptomSuggestions = new Set([ 
    "chest pain","shortness of breath","sob","dyspnea","nausea","vomiting","diarrhea","abdominal pain","headache",
    "dizziness","syncope","altered mental status","ams","weakness","fatigue","fever","chills","rash","seizure",
    "palpitations","edema","cough","anxiety","depression","back pain","trauma"
]);

function getInputValue(id) {
    return document.getElementById(id)?.value?.trim() ?? '';
}
function getParsedInt(id) {
    const val = getInputValue(id);
    return val ? parseInt(val, 10) : null;
}
function getParsedFloat(id) {
    const val = getInputValue(id);
    return val && !isNaN(parseFloat(val)) ? parseFloat(val) : null;
}
function getArrayFromTextarea(id) {
    const value = getInputValue(id);
    return value ? value.split(',').map(v => v.trim().toLowerCase()).filter(Boolean) : [];
}

function updatePatientData() {
    patientData.age = getParsedInt('pt-age');
    patientData.weight = getParsedFloat('pt-weight');
    patientData.weightUnit = getInputValue('pt-weight-unit');
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
    // If any indications are entered, strike through irrelevant topics in list
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
    // If a detail page is open, re-render it to update warnings/dosages based on new patient info
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

// Attach input event listeners for live updates
ptInputs.forEach(input => {
    input?.addEventListener('input', updatePatientData);
});

// Global exposure for compatibility
if (typeof window !== 'undefined') {
    window.patientData = patientData;
    window.PEDIATRIC_AGE_THRESHOLD = PEDIATRIC_AGE_THRESHOLD;
    window.PDE5_INHIBITORS = PDE5_INHIBITORS;
    // We don't strictly need to expose suggestion sets or updatePatientData globally, 
    // because main will import suggestions and detail uses window.patientData already.
}
