/**
 * Handles the Patient Info sidebar functionality in the Paramedic Quick Reference app.
 * Manages the patientData object (age, weight, medical history, vitals, etc.) and updates the app UI based on these inputs.
 * Opens/closes the Patient Info sidebar and adjusts content (strikethrough irrelevant info, auto-calc dosages, warnings) according to entered patient information.
 */
    // --- Patient Data Object & Sidebar Inputs ---
let patientData = { age: null, weight: null, weightUnit: 'kg', pmh: [], allergies: [], currentMedications: [], indications: [], symptoms: [],
    vitalSigns: { bp: '', hr: null, spo2: null, etco2: null, rr: null, bgl: '', eyes: '', gcs: null, aoStatus: '', lungSounds: '' }, ekg: '' };

    // IDs of all patient data input fields in the sidebar:
const ptInputIds = [ 'pt-age', 'pt-weight', 'pt-weight-unit', 'pt-pmh', 'pt-allergies', 'pt-medications', 'pt-indications', 'pt-symptoms',
    'vs-bp', 'vs-hr', 'vs-spo2', 'vs-etco2', 'vs-rr', 'vs-bgl', 'vs-eyes', 'vs-gcs', 'vs-ao-status', 'vs-lung-sounds', 'pt-ekg' ];

const ptInputs = ptInputIds.map(id => document.getElementById(id));

const PEDIATRIC_AGE_THRESHOLD = 18;
const PDE5_INHIBITORS = ["sildenafil", "viagra", "revatio", "vardenafil", "levitra", "tadalafil", "cialis", "adcirca"];

    // --- Autocomplete Data Stores ---
let pmhSuggestions = new Set();
let allergySuggestions = new Set();
let medicationNameSuggestions = new Set();
let indicationSuggestions = new Set();
let symptomSuggestions = new Set([ "chest pain", "shortness of breath", "sob", "dyspnea", "nausea", "vomiting", "diarrhea", "abdominal pain", "headache", "dizziness", "syncope", "altered mental status", "ams", "weakness", "fatigue", "fever",
    "chills", "rash", "seizure", "palpitations", "edema", "cough", "anxiety", "depression", "back pain", "trauma" ]); // Basic list, can be expanded

function openSidebar() { patientSidebar.classList.add('open'); sidebarOverlay.classList.add('active'); }

// Closes the Patient Info sidebar and hides the overlay. // Is this code just redundant and could be deleted??????????????
function closeSidebar() { patientSidebar.classList.remove('open'); sidebarOverlay.classList.remove('active'); }

    // --- Update Patient Data and UI ---
function updatePatientData() {      // Read and parse inputs from the sidebar fields
    patientData.age = document.getElementById('pt-age').value ? parseInt(document.getElementById('pt-age').value, 10) : null;
    const weightVal = document.getElementById('pt-weight') ? document.getElementById('pt-weight').value.trim() : '';
    patientData.weight = weightVal && !isNaN(parseFloat(weightVal)) ? parseFloat(weightVal) : null;
    patientData.weightUnit = document.getElementById('pt-weight-unit').value;
    const getArrayFromTextarea = (id) => { const value = document.getElementById(id).value.trim();
    return value ? value.split(',').map(item => item.trim().toLowerCase()).filter(item => item) : []; };
        patientData.pmh = getArrayFromTextarea('pt-pmh');
        patientData.allergies = getArrayFromTextarea('pt-allergies');
        patientData.currentMedications = getArrayFromTextarea('pt-medications');
        patientData.indications = getArrayFromTextarea('pt-indications');
        patientData.symptoms = getArrayFromTextarea('pt-symptoms'); // Now an array
        patientData.vitalSigns = {
            bp: document.getElementById('vs-bp').value.trim(),
            hr: document.getElementById('vs-hr').value ? parseInt(document.getElementById('vs-hr').value, 10) : null,
            spo2: document.getElementById('vs-spo2').value ? parseInt(document.getElementById('vs-spo2').value, 10) : null,
            etco2: document.getElementById('vs-etco2').value ? parseInt(document.getElementById('vs-etco2').value, 10) : null,
            rr: document.getElementById('vs-rr').value ? parseInt(document.getElementById('vs-rr').value, 10) : null,
            bgl: document.getElementById('vs-bgl').value.trim(), eyes: document.getElementById('vs-eyes').value.trim(),
            gcs: document.getElementById('vs-gcs').value ? parseInt(document.getElementById('vs-gcs').value, 10) : null,
            aoStatus: document.getElementById('vs-ao-status').value.trim(),
            lungSounds: document.getElementById('vs-lung-sounds').value.trim() };
            patientData.ekg = document.getElementById('pt-ekg').value.trim(); }

    const topic = contentarea;
    // Filter the medication/topic list based on selected indications
    const topicLinks = document.querySelectorAll('a.topic-link-item');
    topicLinks.forEach(link => { const medId = link.dataset.topicId; const med = allDisplayableTopicsMap[medId];
        if (patientData.indications.length > 0 && med?.details?.indications) {
    // If patient has indications and this topic has an indications list, check for overlap
    const medIndications = med.details.indications.map(i => i.toLowerCase());
    const hasIndication = patientData.indications.some(ind => medIndications.includes(ind));
        if (!hasIndication) { link.classList.add('strikethrough'); } else { link.classList.remove('strikethrough'); }
        } else { link.classList.remove('strikethrough'); } } )     // No patient indications given or no indications data on this topic – ensure it's not struck out
      
    const currentTopicTitleEl = contentArea ? contentArea.querySelector('.topic-h2') : null; 
    
    if (currentTopicTitleEl) { const currentTopicId = currentTopicTitleEl.dataset.topicId;
    if (currentTopicId && allDisplayableTopicsMap[currentTopicId]) { // Re-render the detail page for the current topic without altering history or scroll
        renderDetailPage(currentTopicId, false, false); }
    // Strike out dose sections that are inappropriate for the patient’s age
    if (patientData.age !== null) { if (patientData.age >= PEDIATRIC_AGE_THRESHOLD) { // Patient is an adult – strike out pediatric dose sections
    document.querySelectorAll('.pediatric-section .detail-section-title, .pediatric-section .detail-text, .pediatric-section .detail-list')
        .forEach(el => el.classList.add('strikethrough'));
        } else { // Patient is pediatric – strike out adult dose sections
    document.querySelectorAll('.adult-section .detail-section-title, .adult-section .detail-text, .adult-section .detail-list')
        .forEach(el => el.classList.add('strikethrough')); }
        } else { // No age specified – remove any age-based strikethroughs
    document.querySelectorAll('.adult-section .strikethrough, .pediatric-section .strikethrough')
        .forEach(el => el.classList.remove('strikethrough')); } }

// Attach update handler to all patient info inputs
ptInputs.forEach(input => { if (input) { input.addEventListener('input', updatePatientData); } });
