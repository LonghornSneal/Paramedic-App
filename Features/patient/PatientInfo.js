/**
 * Handles the Patient Info sidebar functionality in the Paramedic Quick Reference app.
 * Manages the patientData object (age, weight, medical history, vitals, etc.) and updates the app UI based on these inputs.
 * Opens/closes the Patient Info sidebar and adjusts content (strikethrough irrelevant info, auto-calc dosages, warnings) according to entered patient information.
 */
    // --- Patient Data Object & Sidebar Inputs ---
let patientData = { 
    age: null, weight: null, weightUnit: 'kg', 
    pmh: [], allergies: [], currentMedications: [], indications: [], symptoms: [],
    vitalSigns: { 
        bp: '', hr: null, spo2: null, etco2: null, rr: null, bgl: '', eyes: '', gcs: null, aoStatus: '', lungSounds: '' 
    }, ekg: '' 
};

    // IDs of all patient data input fields in the sidebar:
const ptInputIds = [ 'pt-age', 'pt-weight', 'pt-weight-unit', 'pt-pmh', 'pt-allergies', 'pt-medications', 'pt-indications', 'pt-symptoms',
    'vs-bp', 'vs-hr', 'vs-spo2', 'vs-etco2', 'vs-rr', 'vs-bgl', 'vs-eyes', 'vs-gcs', 'vs-ao-status', 'vs-lung-sounds', 'pt-ekg' 
];

const ptInputs = ptInputIds.map(id => document.getElementById(id));

const PEDIATRIC_AGE_THRESHOLD = 18;
const PDE5_INHIBITORS = ["sildenafil", "viagra", "revatio", "vardenafil", "levitra", "tadalafil", "cialis", "adcirca"];

    // --- Autocomplete Data Stores ---
let pmhSuggestions = new Set();
let allergySuggestions = new Set();
let medicationNameSuggestions = new Set();
let indicationSuggestions = new Set();
let symptomSuggestions = new Set([ "chest pain", "shortness of breath", "sob", "dyspnea", "nausea", "vomiting", "diarrhea", "abdominal pain", "headache", "dizziness", "syncope", "altered mental status", "ams", "weakness", "fatigue", "fever",
    "chills", "rash", "seizure", "palpitations", "edema", "cough", "anxiety", "depression", "back pain", "trauma" 
]); // Basic list, can be expanded


// ...existing code...
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
    return value ? value.split(',').map(item => item.trim().toLowerCase()).filter(Boolean) : [];
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
        bgl: getParsedInt('vs-bgl'),
        eyes: getInputValue('vs-eyes'),
        gcs: getParsedInt('vs-gcs'),
        aoStatus: getInputValue('vs-ao-status'),
        lungSounds: getInputValue('vs-lung-sounds'),
        ekg: getInputValue('pt-ekg')
    };
    // ...refresh UI logic...

// Filter the topic list based on patient indications (strike through irrelevant topics)
    const topicLinks = document.querySelectorAll('a.topic-link-item');
    topicLinks.forEach(link => {
        const medId = link.dataset.topicId;
        const med = allDisplayableTopicsMap[medId];
        if (patientData.indications.length > 0 && med?.details?.indications) {
            const medIndications = med.details.indications.map(i => i.toLowerCase());
            const hasMatch = patientData.indications.some(ind => medIndications.includes(ind));
            if (!hasMatch) {
                link.classList.add('strikethrough');
            } else {
                link.classList.remove('strikethrough');
            }
        } else {
            // No indication filtering, ensure item is not struck out
            link.classList.remove('strikethrough');
        }
    });

    // If a detail page is currently open, re-render it with new patient context (to update warnings, dosages, etc.)
    const currentTopicTitleEl = contentArea ? contentArea.querySelector('.topic-h2') : null;
    if (currentTopicTitleEl) {
        const currentTopicId = currentTopicTitleEl.dataset.topicId;
        if (currentTopicId && allDisplayableTopicsMap[currentTopicId]) {
            renderDetailPage(currentTopicId, false, false);
        }
        // After re-render, strike out dose sections inappropriate for patient’s age
        if (patientData.age !== null) {
            if (patientData.age >= PEDIATRIC_AGE_THRESHOLD) {
                // Patient is adult – strike out pediatric sections
                document.querySelectorAll('.pediatric-section .detail-section-title, .pediatric-section .detail-text, .pediatric-section .detail-list')
                    .forEach(el => el.classList.add('strikethrough'));
            } else {
                // Patient is pediatric – strike out adult sections
                document.querySelectorAll('.adult-section .detail-section-title, .adult-section .detail-text, .adult-section .detail-list')
                    .forEach(el => el.classList.add('strikethrough'));
            }
        } else {
            // No age specified – remove any age-based strikethroughs
            document.querySelectorAll('.adult-section .strikethrough, .pediatric-section .strikethrough')
                .forEach(el => el.classList.remove('strikethrough'));
        }
    }
}

// Attach update handler to all patient info inputs (instant update on any field change)
ptInputs.forEach(input => {
    if (input) {
        input.addEventListener('input', updatePatientData);
    }
});
