import { MedicationDetailsData } from '../../Data/MedicationDetailsData.js';
import { addTapListener } from '../../Utils/addTapListener.js';
import { setupAutocomplete } from './Autocomplete.js';
import {
    pmhSuggestions,
    allergySuggestions,
    medicationNameSuggestions,
    indicationSuggestions,
    symptomSuggestions,
    ekgSuggestions,
    PDE5_INHIBITORS
} from './PatientInfo.js';
import { renderPatientSnapshot } from './PatientSnapshot.js';

const AUTOCOMPLETE_FIELDS = [
    { inputId: 'pt-pmh', containerId: 'pt-pmh-suggestions', source: pmhSuggestions, fieldKey: 'pmh' },
    { inputId: 'pt-allergies', containerId: 'pt-allergies-suggestions', source: allergySuggestions, fieldKey: 'allergies' },
    { inputId: 'pt-medications', containerId: 'pt-medications-suggestions', source: medicationNameSuggestions, fieldKey: 'medications' },
    { inputId: 'pt-indications', containerId: 'pt-indications-suggestions', source: indicationSuggestions, fieldKey: 'indications' },
    { inputId: 'pt-symptoms', containerId: 'pt-symptoms-suggestions', source: symptomSuggestions, fieldKey: 'symptoms' },
    { inputId: 'pt-ekg', containerId: 'pt-ekg-suggestions', source: ekgSuggestions, fieldKey: 'ekg' }
];

// NOTE: When entering PMH / Allergies / Current Rx's / Indications / S/S, the text boxes remain fixed because patientData.*Display arrays
//       (maintained in PatientInfo.js) feed the chip lists rendered beside each textarea. If you ever need to force a chip to appear after typing,
//       push the formatted value into the relevant display array before dispatching the render, e.g.:
//       /*
//       // Example: add PMH entry manually before chips render
//       patientData.pmhDisplay = [...patientData.pmhDisplay, 'Chronic Migraine'];
//       buildTextareaChipList('pmh', patientData.pmhDisplay);
//       */
//       To widen the dropdown suggestion panel while keeping the input compact, edit styles/sidebar/patient-autocomplete.css and override
//       `.autocomplete-suggestions` width. For instance:
//       /*
//       .autocomplete-suggestions { width: clamp(18ch, 24vw, 28ch); }
//       */
//       When you need to move categories onto different numbered lines (e.g., to guarantee BP/HR/%SpO₂ share line 8),
//       update the `data-line` attribute in index.html and keep the CSS order rules in sync. Example markup adjustment:
//       /*
//       <!-- Original vitals row -->
//       <div class="patient-line patient-line--vitals" data-line="9">
//       <!-- Move the same row to line 8 -->
//       <div class="patient-line patient-line--vitals" data-line="8">
//       */

const COMMON_PMH_TERMS = [
    'hypertension', 'htn',
    'diabetes', 'dm',
    'asthma', 'copd',
    'heart failure', 'hf',
    'cad',
    'stroke', 'cva',
    'seizure disorder',
    'renal insufficiency', 'ckd',
    'hypothyroidism',
    'hyperthyroidism',
    'glaucoma',
    'peptic ulcer',
    'anxiety',
    'depression'
];

const COMMON_ALLERGY_TERMS = [
    'penicillin', 'sulfa',
    'aspirin', 'nsaids',
    'morphine', 'codeine',
    'iodine', 'shellfish', 'latex',
    'peanuts', 'tree nuts'
];

const COMMON_MEDICATION_NAMES = [
    'lisinopril', 'metformin',
    'atorvastatin',
    'amlodipine',
    'hydrochlorothiazide', 'hctz',
    'simvastatin',
    'albuterol',
    'levothyroxine',
    'gabapentin',
    'omeprazole',
    'losartan',
    'sertraline',
    'furosemide', 'lasix',
    'insulin',
    'warfarin', 'coumadin', 'aspirin', 'clopidogrel', 'plavix'
];

const SIDEBAR_HIDE_DELAY_MS = 200;

let patientSidebarEl = null;
let sidebarOverlayEl = null;
let openSidebarButtonEl = null;
let closeSidebarButtonEl = null;
let settingsPanelEl = null;

export function seedPatientSuggestionSets(medicationDataMap) {
    COMMON_PMH_TERMS.forEach(term => pmhSuggestions.add(term));
    COMMON_ALLERGY_TERMS.forEach(term => allergySuggestions.add(term));
    COMMON_MEDICATION_NAMES.forEach(term => medicationNameSuggestions.add(term));
    PDE5_INHIBITORS.forEach(term => medicationNameSuggestions.add(term));

    if (!medicationDataMap || typeof medicationDataMap !== 'object') return;

    Object.values(medicationDataMap).forEach(med => {
        if (!Array.isArray(med.contraindications)) return;
        med.contraindications.forEach(ci => {
            const ciLower = (ci || '').toLowerCase();
            if (!ciLower.includes('hypersensitivity') && !ciLower.includes('allergy to')) return;
            let allergen = ciLower
                .replace('known hypersensitivity to', '')
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
        });
    });
}

export function initPatientSidebar(options = {}) {
    patientSidebarEl = document.getElementById('patient-sidebar');
    sidebarOverlayEl = document.getElementById('sidebar-overlay');
    openSidebarButtonEl = document.getElementById('open-sidebar-button');
    closeSidebarButtonEl = document.getElementById('close-sidebar-button');
    settingsPanelEl = options.settingsPanel || document.getElementById('settings-panel');

    if (typeof window !== 'undefined') {
        window.patientSidebar = patientSidebarEl;
        window.openSidebarButton = openSidebarButtonEl;
        window.closeSidebarButton = closeSidebarButtonEl;
        window.sidebarOverlay = sidebarOverlayEl;
    }

    if (sidebarOverlayEl) {
        sidebarOverlayEl.classList.add('hidden');
        sidebarOverlayEl.classList.remove('active');
    }

    if (openSidebarButtonEl) {
        addTapListener(openSidebarButtonEl, openPatientSidebar);
    }

    if (closeSidebarButtonEl) {
        addTapListener(closeSidebarButtonEl, closePatientSidebar);
    }

    if (sidebarOverlayEl) {
        addTapListener(sidebarOverlayEl, () => {
            closePatientSidebar();
            if (settingsPanelEl && !settingsPanelEl.classList.contains('hidden')) {
                settingsPanelEl.classList.add('hidden');
            }
            const historyPanel = document.getElementById('history-panel');
            if (historyPanel && !historyPanel.classList.contains('hidden')) {
                historyPanel.classList.add('hidden');
            }
        });
    }

    AUTOCOMPLETE_FIELDS.forEach(({ inputId, containerId, source, fieldKey }) => {
        setupAutocomplete(inputId, containerId, source, fieldKey);
    });

    renderPatientSnapshot();
}

export function openPatientSidebar() {
    if (!patientSidebarEl || !sidebarOverlayEl) return;
    patientSidebarEl.classList.remove('hidden');
    patientSidebarEl.classList.add('open');
    sidebarOverlayEl.classList.add('active');
    sidebarOverlayEl.classList.remove('hidden');
}

export function closePatientSidebar() {
    if (!patientSidebarEl) return;
    patientSidebarEl.classList.remove('open');
    setTimeout(() => patientSidebarEl?.classList.add('hidden'), SIDEBAR_HIDE_DELAY_MS);
    if (sidebarOverlayEl) {
        sidebarOverlayEl.classList.remove('active');
        sidebarOverlayEl.classList.add('hidden');
    }
}

function stripMarkup(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/\[\[(.+?)\|(.+?)\]\]/g, '$1');
}

function cleanClassName(str) {
    const noMarkup = stripMarkup(String(str));
    const noParens = noMarkup.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    const cutAtDash = noParens.split(/\s[-�?"�?"]\s/)[0].trim();
    return cutAtDash;
}

export function insertMedicationClassDropdown() {
    const sidebar = document.getElementById('patient-sidebar');
    if (!sidebar) return;
    if (document.getElementById('pt-medication-class')) return;

    const classesSet = new Set();
    (MedicationDetailsData || []).forEach(med => {
        const cls = med.class;
        if (Array.isArray(cls)) {
            cls.forEach(c => classesSet.add(cleanClassName(c)));
        } else if (cls) {
            classesSet.add(cleanClassName(cls));
        }
    });
    const classes = Array.from(classesSet)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

    const section = document.createElement('div');
    section.className = 'patient-line patient-line--full patient-line--med-class';
    section.dataset.line = '5-medication-class';

    const field = document.createElement('div');
    field.className = 'sidebar-field sidebar-field-textarea';

    const heading = document.createElement('div');
    heading.className = 'sidebar-field-heading';

    const label = document.createElement('label');
    label.className = 'sidebar-label';
    label.htmlFor = 'pt-medication-class';
    label.textContent = 'Medication Class:';
    heading.appendChild(label);

    const selectContainer = document.createElement('div');
    selectContainer.className = 'sidebar-input-flex';

    const select = document.createElement('select');
    select.id = 'pt-medication-class';
    select.className = 'sidebar-input med-class-select';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select class';
    select.appendChild(defaultOption);

    classes.forEach(cls => {
        const opt = document.createElement('option');
        opt.value = cls.toLowerCase();
        opt.textContent = cls;
        select.appendChild(opt);
    });

    selectContainer.appendChild(select);
    field.appendChild(heading);
    field.appendChild(selectContainer);
    section.appendChild(field);

    const medsLine = sidebar.querySelector('#pt-medications')?.closest('.patient-line');
    if (medsLine) {
        medsLine.insertAdjacentElement('afterend', section);
    } else {
        sidebar.appendChild(section);
    }

    document.dispatchEvent(new Event('medClassInserted'));
}

/*
  Features/patient/PatientSidebar.js
  Purpose: Encapsulates Patient Info sidebar behavior (open/close controls, autocomplete wiring, snapshot render)
  and seeds quick entry suggestion sets using medication data for allergy derivations.

  Exports:
  - seedPatientSuggestionSets(medicationDataMap)
  - initPatientSidebar({ settingsPanel })
  - openPatientSidebar()
  - closePatientSidebar()
  - insertMedicationClassDropdown()

  Notes:
  - Maintains cached DOM references so other modules can call open/close helpers.
  - Keeps suggestion vocabulary synchronized with PatientInfo.js sets.
*/
