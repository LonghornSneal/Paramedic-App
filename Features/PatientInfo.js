/*
 * Handles the Patient Info sidebar functionality in the Paramedic Quick Reference app.
 * Manages the patientData object (age, weight, medical history, vitals, etc.) and updates the app UI based on these inputs.
 * This module opens/closes the Patient Info sidebar and dynamically adjusts treatment content (e.g., strikethrough irrelevant info, auto-calc dosages, display warnings) according to the entered patient information.
 * By separating this logic, the app can easily manage patient context and apply it across other features (diagnosis suggestions, warnings, etc.).
 */
        // --- Patient Data Object & Sidebar Inputs ---
        let patientData = {
            age: null, weight: null, weightUnit: 'kg', pmh: [], allergies: [], currentMedications: [], indications: [],
            symptoms: [], // Changed to array for consistency if S/S also becomes tag-based
            vitalSigns: { bp: '', hr: null, spo2: null, etco2: null, rr: null, bgl: '', eyes: '', gcs: null, aoStatus: '', lungSounds: '' },
            ekg: ''
        };
        const ptInputIds = [ /* IDs of all patient data inputs */
            'pt-age', 'pt-weight', 'pt-weight-unit', 'pt-pmh', 'pt-allergies', 'pt-medications', 'pt-indications', 'pt-symptoms',
            'vs-bp', 'vs-hr', 'vs-spo2', 'vs-etco2', 'vs-rr', 'vs-bgl', 'vs-eyes', 'vs-gcs',
            'vs-ao-status', 'vs-lung-sounds', 'pt-ekg'
        ];
        const ptInputs = ptInputIds.map(id => document.getElementById(id));

        // --- Navigation History ---
        let navigationHistory = [];
        let currentHistoryIndex = -1;
        let isNavigatingViaHistory = false;

        // --- Hierarchical Data, Flat Search List, Medication Details ---
        let paramedicCategories = [];
        let allSearchableTopics = [];
        let allDisplayableTopicsMap = {};
        let medicationDetailsData = {};
        const PEDIATRIC_AGE_THRESHOLD = 18;
        const PDE5_INHIBITORS = ["sildenafil", "viagra", "revatio", "vardenafil", "levitra", "tadalafil", "cialis", "adcirca"];

        // --- Autocomplete Data Stores ---
        let pmhSuggestions = new Set();
        let allergySuggestions = new Set();
        let medicationNameSuggestions = new Set(); // For "Current Medications" field
        let indicationSuggestions = new Set();
        let symptomSuggestions = new Set([
            "chest pain", "shortness of breath", "sob", "dyspnea", "nausea", "vomiting", "diarrhea", "abdominal pain",
            "headache", "dizziness", "syncope", "altered mental status", "ams", "weakness", "fatigue", "fever",
            "chills", "rash", "seizure", "palpitations", "edema", "cough", "anxiety", "depression", "back pain", "trauma"
        ]); // Basic list, can be expanded


        // --- Utility Function ---
        // slugify is loaded from slugify.js
        // You can also generate branch names with this helper:
        //   node slugify.js "Administrative & Legal Essentials"
        // yields "administrative-legal-essentials"

        // --- Sidebar Logic ---
        function openSidebar() { patientSidebar.classList.add('open'); sidebarOverlay.classList.add('active'); }
        function closeSidebar() { patientSidebar.classList.remove('open'); sidebarOverlay.classList.remove('active'); }

        function updatePatientData() {
            patientData.age = document.getElementById('pt-age').value ? parseInt(document.getElementById('pt-age').value) : null;
            patientData.weight = document.getElementById('pt-weight').value ? parseFloat(document.getElementById('pt-weight').value) : null;
            patientData.weightUnit = document.getElementById('pt-weight-unit').value;
            const getArrayFromTextarea = (id) => document.getElementById(id).value.trim() ? document.getElementById(id).value.split(',').map(item => item.trim().toLowerCase()).filter(item => item) : [];
            patientData.pmh = getArrayFromTextarea('pt-pmh');
            patientData.allergies = getArrayFromTextarea('pt-allergies');
            patientData.currentMedications = getArrayFromTextarea('pt-medications');
            // Capture indications from textarea using same helper
            patientData.indications = getArrayFromTextarea('pt-indications');
            patientData.symptoms = getArrayFromTextarea('pt-symptoms'); // Now an array
            patientData.vitalSigns = {
                bp: document.getElementById('vs-bp').value.trim(),
                hr: document.getElementById('vs-hr').value ? parseInt(document.getElementById('vs-hr').value) : null,
                spo2: document.getElementById('vs-spo2').value ? parseInt(document.getElementById('vs-spo2').value) : null,
                etco2: document.getElementById('vs-etco2').value ? parseInt(document.getElementById('vs-etco2').value) : null,
                rr: document.getElementById('vs-rr').value ? parseInt(document.getElementById('vs-rr').value) : null,
                bgl: document.getElementById('vs-bgl').value.trim(),
                eyes: document.getElementById('vs-eyes').value.trim(),
                gcs: document.getElementById('vs-gcs').value ? parseInt(document.getElementById('vs-gcs').value) : null,
                aoStatus: document.getElementById('vs-ao-status').value.trim(),
                lungSounds: document.getElementById('vs-lung-sounds').value.trim()
            };
            patientData.ekg = document.getElementById('pt-ekg').value.trim();

            // Filter medication list by selected indications
            const topicLinks = document.querySelectorAll('a.topic-link-item');
            topicLinks.forEach(link => {
                const medId = link.dataset.topicId;
                const med = allDisplayableTopicsMap[medId];
                if (patientData.indications.length > 0 && med && med.details && med.details.indications) {
                    const medIndications = med.details.indications.map(i => i.toLowerCase());
                    const hasIndication = patientData.indications.some(ind => medIndications.includes(ind));
                    if (!hasIndication) link.classList.add('strikethrough');
                    else link.classList.remove('strikethrough');
                } else {
                    link.classList.remove('strikethrough');
                }
            });

            const currentTopicTitleEl = contentArea.querySelector('h2.topic-main-title');
            if (currentTopicTitleEl) {
                const currentTopicId = currentTopicTitleEl.dataset.topicId;
                if (currentTopicId && allDisplayableTopicsMap[currentTopicId]) {
                    renderDetailPage(currentTopicId, false, false);
                }
                // Strike out age-inappropriate dose sections in an open medication detail
                if (patientData.age) {
                    if (patientData.age >= PEDIATRIC_AGE_THRESHOLD) {
                        // Patient is adult – strike out pediatric doses
                        document.querySelectorAll('.pediatric-section .detail-section-title, .pediatric-section .detail-text, .pediatric-section .detail-list')
                                .forEach(el => el.classList.add('strikethrough'));
                    } else {
                        // Patient is pediatric – strike out adult doses
                        document.querySelectorAll('.adult-section .detail-section-title, .adult-section .detail-text, .adult-section .detail-list')
                                .forEach(el => el.classList.add('strikethrough'));
                    }
                } else {
                    // If age not specified, ensure no strikeouts
                    document.querySelectorAll('.adult-section .strikethrough, .pediatric-section .strikethrough')
                            .forEach(el => el.classList.remove('strikethrough'));
                }
            }
        }
        ptInputs.forEach(input => { if (input) input.addEventListener('input', updatePatientData); });
