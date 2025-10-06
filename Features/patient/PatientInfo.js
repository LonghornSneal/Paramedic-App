/**
 * Handles the Patient Info sidebar functionality in the Paramedic Quick Reference app.
 *
 * This module manages the patientData object (age, weight, medical history, vitals, etc.) and updates
 * the app UI based on these inputs. It exposes the patientData object globally for backward
 * compatibility but also exports it for ES module consumers. A major improvement in this version
 * adds a single weight input with unit toggles. Users can enter kilograms or pounds, and the
 * value automatically converts so the underlying data continues to store kilograms for calculations.
 * Internally we always store weight in kilograms. See updatePatientData() and unit toggle helpers for details.
 */

// The central patient data object. All fields are initialized to null or sensible defaults. The
// weightUnit tracks the user's selected unit for display while weightInputValue stores the raw entry.
// Weight continues to be stored internally in kilograms for dosing calculations.
import { renderPatientSnapshot } from './PatientSnapshot.js';
import { splitSegments, normalizeCommittedValues } from './patientTerminology.js';

export const patientData = {
    age: null, ageUnit: 'years', ageInputValue: null, weight: null, weightUnit: 'kg', weightInputValue: null, gender: '', heightIn: null,
    pmh: [], pmhDisplay: [],
    allergies: [], allergyDisplay: [],
    currentMedications: [], medicationsDisplay: [], medicationClasses: [],
    indications: [], indicationsDisplay: [],
    symptoms: [], symptomsDisplay: [],
    vitalSigns: {
        bp: '', bpSystolic: null, bpDiastolic: null, map: null, hr: null, spo2: null, etco2: null, rr: null, bgl: '', eyes: '', gcs: null, aoStatus: '', lungSounds: ''
    },
    ekg: '', ekgDisplay: ''
};
// IDs of inputs we want to monitor for changes. Weight toggles manipulate the same input, so we only
// track the shared weight field alongside the rest of the sidebar inputs. When any of these inputs fires an input event, we call
// updatePatientData() to refresh patientData and update the UI.
const ptInputIds = [ 'pt-age', 
    'pt-weight-value',
    'pt-height-ft','pt-height-in',
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
const ageInputEl = document.getElementById('pt-age');
const ageUnitButtons = Array.from(document.querySelectorAll('.age-unit-toggle'));
let selectedAgeUnit = 'years';
const genderInputEl = document.getElementById('pt-gender');
const sexButtons = Array.from(document.querySelectorAll('.sex-option'));
const weightSummaryEl = document.getElementById('weight-summary');
const weightInputEl = document.getElementById('pt-weight-value');
const weightUnitButtons = Array.from(document.querySelectorAll('.weight-unit-toggle'));
let selectedWeightUnit = 'kg';
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
function clampNumber(value, min, max) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  let clamped = value;
  if (typeof min === 'number' && clamped < min) clamped = min;
  if (typeof max === 'number' && clamped > max) clamped = max;
  return clamped;
}

function getNormalizedBloodPressure(id) {
  const el = document.getElementById(id);
  const raw = el?.value?.trim() ?? '';
  if (!raw) {
    return { value: '', systolic: null, diastolic: null, map: null };
  }
  const bpPattern = /^(\d{1,3})(?:\s*\/\s*(\d{1,3}))?$/;
  const match = raw.match(bpPattern);
  if (!match) {
    return { value: raw, systolic: null, diastolic: null, map: null };
  }
  const systolicParsed = parseInt(match[1], 10);
  const diastolicParsed = match[2] ? parseInt(match[2], 10) : null;
  const systolic = clampNumber(systolicParsed, 0, 400);
  const diastolic = diastolicParsed != null ? clampNumber(diastolicParsed, 0, 300) : null;
  if (systolic == null) {
    return { value: raw, systolic: null, diastolic, map: null };
  }
  const formatted = diastolic != null ? `${systolic}/${diastolic}` : `${systolic}`;
  if (el && formatted !== raw) el.value = formatted;
  const map = diastolic != null ? Math.round((systolic + 2 * diastolic) / 3) : null;
  return { value: formatted, systolic, diastolic, map };
}

function getNormalizedPupilDescription(id) {
  const el = document.getElementById(id);
  const raw = el?.value?.trim() ?? '';
  if (!raw) return '';
  const match = raw.match(/^(\d{1,2})(?:\s*mm)?(.*)$/i);
  if (!match) return raw;
  const sizeParsed = parseInt(match[1], 10);
  const size = clampNumber(sizeParsed, 0, 8);
  if (size == null) return raw;
  const remainder = match[2] ?? '';
  const trimmed = remainder.trim();
  let suffix = '';
  if (trimmed) {
    const firstChar = trimmed[0];
    if (firstChar === ',') {
      suffix = trimmed;
    } else if (firstChar === '/' || firstChar === '-') {
      suffix = ' ' + trimmed;
    } else {
      suffix = ', ' + trimmed;
    }
  }
  const formatted = `${size}mm${suffix}`;
  if (el && formatted !== raw) el.value = formatted;
  return formatted;
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
// Weight conversion factor used when converting between kilograms and pounds. 1 kilogram equals
// 2.20462 pounds. We round converted values to one decimal place for display purposes.
const WEIGHT_CONVERSION_FACTOR = 2.20462;

function convertWeightValue(value, fromUnit, toUnit) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  const normalizedFrom = fromUnit === 'lb' ? 'lb' : 'kg';
  const normalizedTo = toUnit === 'lb' ? 'lb' : 'kg';
  if (normalizedFrom === normalizedTo) return value;
  if (normalizedFrom === 'kg' && normalizedTo === 'lb') return value * WEIGHT_CONVERSION_FACTOR;
  if (normalizedFrom === 'lb' && normalizedTo === 'kg') return value / WEIGHT_CONVERSION_FACTOR;
  return value;
}

function formatWeightInputValue(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  const rounded = Math.round(value * 10) / 10;
  if (Math.abs(rounded - Math.round(rounded)) < 0.05) return Math.round(rounded).toString();
  return rounded.toFixed(1);
}

function setSelectedWeightUnit(unit, options = {}) {
  const { convertInput = false, triggerUpdate = true, force = false } = options;
  const normalized = unit === 'lb' ? 'lb' : 'kg';
  const previous = selectedWeightUnit;
  if (!force && normalized === previous) {
    if (triggerUpdate) updatePatientData();
    return;
  }
  selectedWeightUnit = normalized;
  weightUnitButtons.forEach(btn => {
    const isSelected = btn.dataset.unit === normalized;
    btn.classList.toggle('is-selected', isSelected);
    btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
  if (weightInputEl) {
    if (convertInput && weightInputEl.value && previous && previous !== normalized) {
      const parsed = parseFloat(weightInputEl.value);
      if (!Number.isNaN(parsed)) {
        const converted = convertWeightValue(parsed, previous, normalized);
        if (typeof converted === 'number' && !Number.isNaN(converted)) {
          weightInputEl.value = formatWeightInputValue(converted);
        }
      }
    }
    weightInputEl.dataset.weightUnit = normalized;
    weightInputEl.placeholder = normalized === 'kg' ? 'kg' : 'lbs';
  }
  if (triggerUpdate) updatePatientData();
}

function setSelectedSex(selected) {
  const target = selected ? selected.toLowerCase() : '';

  sexButtons.forEach(btn => {
    const isSelected = target && btn.dataset.value === target;
    btn.classList.toggle('is-selected', isSelected);
    btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
}

const AGE_UNIT_METADATA = {
  days: { label: 'Days', suffix: 'd' },
  months: { label: 'Months', suffix: 'mo' },
  years: { label: 'Years', suffix: 'yo' }
};
const MAX_AGE_YEARS = 120;
const AGE_TOOLTIP_ID = 'sidebar-age-tooltip';
const SEX_TOOLTIP_ID = 'sidebar-sex-tooltip';
let ageTooltipTimer = null;
let sexTooltipTimer = null;

function clampAgeYears(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  if (value < 0) return 0;
  if (value > MAX_AGE_YEARS) return MAX_AGE_YEARS;
  return Number(value.toFixed(2));
}

function convertAgeValue(value, fromUnit, toUnit) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  const normalizedFrom = (fromUnit === 'days' || fromUnit === 'months') ? fromUnit : 'years';
  const normalizedTo = (toUnit === 'days' || toUnit === 'months') ? toUnit : 'years';
  let years = value;
  if (normalizedFrom === 'days') years = value / 365;
  else if (normalizedFrom === 'months') years = value / 12;
  if (normalizedTo === 'days') return years * 365;
  if (normalizedTo === 'months') return years * 12;
  return years;
}

function formatAgeValueForInput(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  const rounded = Math.round(value * 10) / 10;
  if (Math.abs(rounded - Math.round(rounded)) < 0.05) return Math.round(rounded).toString();
  return rounded.toFixed(1);
}

function readAgeInputValue() {
  if (!ageInputEl) return { raw: null, years: null };
  const rawText = ageInputEl.value?.trim() ?? '';
  if (!rawText) return { raw: null, years: null };
  const parsed = parseFloat(rawText);
  if (Number.isNaN(parsed)) return { raw: null, years: null };
  const normalizedRaw = parsed < 0 ? 0 : parsed;
  if (ageInputEl && normalizedRaw !== parsed) {
    ageInputEl.value = formatAgeValueForInput(normalizedRaw);
  }
  const years = convertAgeValue(normalizedRaw, selectedAgeUnit, 'years');
  const clampedYears = clampAgeYears(years);
  if (clampedYears != null && years != null && clampedYears !== years && ageInputEl) {
    const adjusted = convertAgeValue(clampedYears, 'years', selectedAgeUnit);
    if (typeof adjusted === 'number' && !Number.isNaN(adjusted)) {
      ageInputEl.value = formatAgeValueForInput(adjusted);
    }
  }
  return { raw: normalizedRaw, years: clampedYears };
}

function positionSidebarTooltip(button, tooltip) {
  const rect = button.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const minLeft = window.scrollX + 8;
  const maxLeft = window.scrollX + Math.max(8, viewportWidth - tipRect.width - 8);
  const desiredLeft = rect.left + window.scrollX + rect.width + 8;
  const left = Math.max(minLeft, Math.min(desiredLeft, maxLeft));
  const desiredTop = rect.top + window.scrollY - tipRect.height - 10;
  const top = Math.max(window.scrollY + 8, desiredTop);
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function clearAgeTooltipTimer() {
  if (ageTooltipTimer != null) {
    window.clearTimeout(ageTooltipTimer);
    ageTooltipTimer = null;
  }
}

function hideAgeTooltip() {
  const existing = document.getElementById(AGE_TOOLTIP_ID);
  if (existing) existing.remove();
  clearAgeTooltipTimer();
}

function showAgeTooltip(button) {
  if (!button) return;
  const label = button.dataset.tooltip || '';
  if (!label) return;
  hideAgeTooltip();
  const tooltip = document.createElement('div');
  tooltip.id = AGE_TOOLTIP_ID;
  tooltip.className = 'qv-tooltip age-unit-tooltip';
  tooltip.textContent = label;
  document.body.appendChild(tooltip);
  positionSidebarTooltip(button, tooltip);
}

function scheduleAgeTooltip(button) {
  if (!button) return;
  clearAgeTooltipTimer();
  ageTooltipTimer = window.setTimeout(() => {
    showAgeTooltip(button);
  }, 400);
}

function clearSexTooltipTimer() {
  if (sexTooltipTimer != null) {
    window.clearTimeout(sexTooltipTimer);
    sexTooltipTimer = null;
  }
}

function hideSexTooltip() {
  const existing = document.getElementById(SEX_TOOLTIP_ID);
  if (existing) existing.remove();
  clearSexTooltipTimer();
}

function showSexTooltip(button) {
  if (!button) return;
  const label = button.dataset.tooltip || '';
  if (!label) return;
  hideSexTooltip();
  const tooltip = document.createElement("div");
  tooltip.id = SEX_TOOLTIP_ID;
  tooltip.className = "qv-tooltip age-unit-tooltip";
  tooltip.textContent = label;
  document.body.appendChild(tooltip);
  positionSidebarTooltip(button, tooltip);
}

function scheduleSexTooltip(button) {
  if (!button) return;
  clearSexTooltipTimer();
  sexTooltipTimer = window.setTimeout(() => {
    showSexTooltip(button);
  }, 400);
}

function setSelectedAgeUnit(unit, options = {}) {
  const { convertInput = false, triggerUpdate = true, force = false } = options;
  const normalized = AGE_UNIT_METADATA[unit] ? unit : 'years';
  const previous = selectedAgeUnit;
  if (!force && normalized === previous) {
    if (triggerUpdate) updatePatientData();
    return;
  }
  selectedAgeUnit = normalized;
  ageUnitButtons.forEach(btn => {
    const isSelected = btn.dataset.unit === normalized;
    btn.classList.toggle('is-selected', isSelected);
    btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
  if (ageInputEl) {
    if (convertInput && ageInputEl.value && previous && previous !== normalized) {
      const parsed = parseFloat(ageInputEl.value);
      if (!Number.isNaN(parsed)) {
        const converted = convertAgeValue(parsed, previous, normalized);
        if (typeof converted === 'number' && !Number.isNaN(converted)) {
          ageInputEl.value = formatAgeValueForInput(converted);
        }
      }
    }
    ageInputEl.dataset.ageUnit = normalized;
  }
  if (triggerUpdate) updatePatientData();
}

function updateWeightSummaryDisplay(weightKg) {
  if (!weightSummaryEl) return;
  let summaryText = '';
  if (typeof weightKg === 'number' && !Number.isNaN(weightKg)) {
    const pounds = weightKg * WEIGHT_CONVERSION_FACTOR;
    const kgText = Number.isInteger(weightKg) ? weightKg.toString() : weightKg.toFixed(1);
    const lbText = Math.round(pounds);
    summaryText = `Weight context: ${kgText} kg (${lbText} lb).`;
  }
  weightSummaryEl.textContent = summaryText;
  weightSummaryEl.classList.toggle('hidden', summaryText === '');
  if (weightInputEl) {
    if (summaryText) {
      weightInputEl.setAttribute('title', summaryText);
    } else {
      weightInputEl.removeAttribute('title');
    }
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
 * Updates the global patientData object by reading all current inputs. This function is called on
 * every input event for monitored fields. It also handles striking through irrelevant topics in
 * the list, re‑rendering the detail page when necessary, and applying pediatric/adult section
 * strikeouts based on the patient’s age. Weight handling uses a single input with unit toggles
 */
function updatePatientData() {
    patientData.gender = getInputValue('pt-gender');
    setSelectedSex(patientData.gender);
    const ageValues = readAgeInputValue();
    patientData.age = ageValues.years;
    patientData.ageUnit = selectedAgeUnit;
    patientData.ageInputValue = ageValues.raw;
    // Height sync: if inches given, use that; else compute from ft/in
    const ft = getParsedInt('pt-height-ft', 0);
    let inch = null;
    if (ft != null && ft > 0) {
        inch = getParsedInt('pt-height-in', 0, 11);
    } else {
        inch = getParsedInt('pt-height-in', 0);
    }
    let totalIn = null;
    if (ft != null && ft > 0) {
        const remainder = inch != null ? inch : 0;
        totalIn = ft * 12 + remainder;
    } else if (inch != null) {
        totalIn = inch;
    }
    patientData.heightIn = totalIn;
    // Weight: reads the shared input and converts to kilograms regardless of the selected unit.
    const weightRaw = getParsedFloat('pt-weight-value');
    let weightKg = null;
    if (weightRaw !== null) {
        const converted = convertWeightValue(weightRaw, selectedWeightUnit, 'kg');
        if (typeof converted === 'number' && !Number.isNaN(converted)) {
            weightKg = parseFloat(converted.toFixed(2));
        }
    }
    patientData.weight = weightKg;
    patientData.weightUnit = selectedWeightUnit;
    patientData.weightInputValue = weightRaw;
    updateWeightSummaryDisplay(patientData.weight);

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

    const bpDetails = getNormalizedBloodPressure('vs-bp');
    const bpInputNode = document.getElementById('vs-bp');
    if (bpInputNode) {
        if (typeof bpDetails.map === 'number' && !Number.isNaN(bpDetails.map)) {
            bpInputNode.dataset.mapValue = bpDetails.map.toString();
        } else {
            delete bpInputNode.dataset.mapValue;
        }
    }
    patientData.vitalSigns = {
        bp: bpDetails.value,
        bpSystolic: bpDetails.systolic,
        bpDiastolic: bpDetails.diastolic,
        map: bpDetails.map,
        hr: getNormalizedNumberOrText('vs-hr', 0, 300),
        spo2: getNormalizedNumberOrText('vs-spo2', 50, 100),
        etco2: getNormalizedNumberOrText('vs-etco2', 0, 50),
        rr: getNormalizedNumberOrText('vs-rr', 0, 80),
        bgl: getNormalizedNumberOrText('vs-bgl', 0, 900),
        eyes: getNormalizedPupilDescription('vs-eyes'),
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
  if (!input) return;
  input.addEventListener('input', updatePatientData);
  if (input.tagName === 'SELECT') {
    input.addEventListener('change', updatePatientData);
  }
});

ageUnitButtons.forEach(btn => {
  btn.setAttribute('aria-pressed', 'false');
  const hideTooltipForButton = () => hideAgeTooltip();
  btn.addEventListener('mouseenter', () => showAgeTooltip(btn));
  btn.addEventListener('mouseleave', hideTooltipForButton);
  btn.addEventListener('focus', () => showAgeTooltip(btn));
  btn.addEventListener('blur', hideTooltipForButton);
  btn.addEventListener('touchstart', () => { hideAgeTooltip(); scheduleAgeTooltip(btn); }, { passive: true });
  btn.addEventListener('touchend', hideTooltipForButton, { passive: true });
  btn.addEventListener('touchcancel', hideTooltipForButton, { passive: true });
  btn.addEventListener('touchmove', hideTooltipForButton, { passive: true });
  btn.addEventListener('click', () => {
    setSelectedAgeUnit(btn.dataset.unit, { convertInput: true });
    hideAgeTooltip();
  });
});
if (ageUnitButtons.length) {
  setSelectedAgeUnit(selectedAgeUnit, { force: true, triggerUpdate: false });
  if (ageInputEl) ageInputEl.dataset.ageUnit = selectedAgeUnit;
}

weightUnitButtons.forEach(btn => {
  btn.setAttribute('aria-pressed', 'false');
  btn.addEventListener('click', () => {
    const unit = btn.dataset.unit || 'kg';
    setSelectedWeightUnit(unit, { convertInput: true });
  });
});
if (weightUnitButtons.length) {
  setSelectedWeightUnit(selectedWeightUnit, { force: true, triggerUpdate: false });
}
if (weightInputEl) {
  weightInputEl.addEventListener('input', () => {
    updatePatientData();
  });
}

sexButtons.forEach(btn => {
  btn.setAttribute('aria-pressed', 'false');
  const hideSexTooltipHandler = () => hideSexTooltip();
  btn.addEventListener('mouseenter', () => showSexTooltip(btn));
  btn.addEventListener('mouseleave', hideSexTooltipHandler);
  btn.addEventListener('focus', () => showSexTooltip(btn));
  btn.addEventListener('blur', hideSexTooltipHandler);
  btn.addEventListener('touchstart', () => { hideSexTooltip(); scheduleSexTooltip(btn); }, { passive: true });
  btn.addEventListener('touchend', hideSexTooltipHandler, { passive: true });
  btn.addEventListener('touchcancel', hideSexTooltipHandler, { passive: true });
  btn.addEventListener('touchmove', hideSexTooltipHandler, { passive: true });
  btn.addEventListener('click', () => {
    if (!genderInputEl) return;
    const selectedValue = btn.dataset.value || '';
    genderInputEl.value = selectedValue;
    setSelectedSex(selectedValue);
    hideSexTooltip();
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













