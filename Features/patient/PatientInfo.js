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
import { EkgRhythmAssets, EkgModifierAssets } from '../../Data/EkgAssetsData.js';

export const patientData = {
    age: null, ageUnit: 'years', ageInputValue: null, weight: null, weightUnit: 'kg', weightInputValue: null, gender: '', heightIn: null,
    pmh: [], pmhDisplay: [],
    allergies: [], allergyDisplay: [],
    currentMedications: [], medicationsDisplay: [], medicationClasses: [],
    indications: [], indicationsDisplay: [],
    symptoms: [], symptomsDisplay: [],
    vitalSigns: {
        bp: '', bpSystolic: null, bpDiastolic: null, map: null, hr: null, spo2: null, spo2Source: '', etco2: null, rr: null, bgl: '', eyes: '', gcs: null, aoStatus: '', lungSounds: ''
    },
    ekg: '', ekgDisplay: '', ekgSecondary: ''
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
    'vs-bp-systolic',
    'vs-bp-diastolic',
    'vs-bp-select',
    'vs-hr-value',
    'vs-hr-select',
    'vs-spo2-value',
    'vs-spo2-source',
    'vs-etco2',
    'vs-rr',
    'vs-bgl-value',
    'vs-bgl-select',
    'vs-pupils-value',
    'vs-pupils-select',
    'vs-gcs-value',
    'vs-gcs-select',
    'vs-ao-status',
    'vs-lung-sounds',
    'pt-ekg',
    'pt-ekg-select',
    'pt-ekg-secondary'
];
const ptInputs = ptInputIds.map(id => document.getElementById(id));
const ageInputEl = document.getElementById('pt-age');
const ageUnitButtons = Array.from(document.querySelectorAll('.age-unit-toggle'));
const ageUnitWrapper = document.querySelector('.age-unit-input');
const ageUnitSuffixEl = document.querySelector('.age-unit-suffix');
let selectedAgeUnit = 'years';
const genderInputEl = document.getElementById('pt-gender');
const sexButtons = Array.from(document.querySelectorAll('.sex-option'));
const weightSummaryEl = document.getElementById('weight-summary');
const weightInputEl = document.getElementById('pt-weight-value');
const weightUnitButtons = Array.from(document.querySelectorAll('.weight-unit-toggle'));
const weightUnitWrapper = document.querySelector('.weight-unit-input');
const weightUnitSuffixEl = document.querySelector('.weight-unit-suffix');
const chipListElements = {
  pmh: document.getElementById('pt-pmh-chips'),
  allergies: document.getElementById('pt-allergies-chips'),
  medications: document.getElementById('pt-medications-chips'),
  indications: document.getElementById('pt-indications-chips'),
  symptoms: document.getElementById('pt-symptoms-chips')
};
const ekgSummaryEl = document.getElementById('ekg-summary-text');
const unitInputElements = Array.from(document.querySelectorAll('.unit-input .sidebar-input'));
let selectedWeightUnit = 'kg';
unitInputElements.forEach(input => {
  if (!input) return;
  const updateState = () => syncUnitSuffixState(input);
  input.addEventListener('input', updateState);
  input.addEventListener('change', updateState);
  updateState();
});
let currentRhythmAssetId = '';
let currentModifierAssetId = '';
const ekgHelpButton = document.getElementById('ekg-help-button');
const ekgHelpModal = document.getElementById('ekg-help-modal');
const ekgHelpBackdrop = document.getElementById('ekg-help-backdrop');
const ekgHelpClose = document.getElementById('ekg-help-close');
const ekgHelpTitle = document.getElementById('ekg-help-title');
const ekgModalGeneral = document.getElementById('ekg-modal-general');
const ekgModalDetail = document.getElementById('ekg-modal-detail');
const ekgModalDetailTitle = document.getElementById('ekg-modal-detail-title');
const ekgModalDetailImage = document.getElementById('ekg-modal-detail-image');
const ekgModalDetailDefinition = document.getElementById('ekg-modal-detail-definition');
const ekgModalBack = document.getElementById('ekg-modal-back');
const ekgRhythmPreviewImg = document.getElementById('ekg-rhythm-preview');
const ekgModifierPreviewImg = document.getElementById('ekg-modifier-preview');
const ekgRhythmInfoButton = document.getElementById('ekg-rhythm-info');
const ekgModifierInfoButton = document.getElementById('ekg-modifier-info');

function showEkgGeneral() {
  if (ekgModalGeneral) ekgModalGeneral.classList.remove('hidden');
  if (ekgModalDetail) ekgModalDetail.classList.add('hidden');
  if (ekgHelpTitle) ekgHelpTitle.textContent = 'EKG Interpretation';
  if (ekgModalBack) ekgModalBack.classList.add('hidden');
  if (ekgModalDetailTitle) ekgModalDetailTitle.textContent = '';
  if (ekgModalDetailDefinition) ekgModalDetailDefinition.textContent = '';
  ekgModalDetailImage?.removeAttribute('src');
}

function openEkgHelp(detail) {
  if (!ekgHelpModal || !ekgHelpBackdrop) return;
  if (detail && detail.asset && ekgModalDetail && ekgModalDetailTitle && ekgModalDetailImage && ekgModalDetailDefinition) {
    const asset = detail.asset;
    if (ekgModalGeneral) ekgModalGeneral.classList.add('hidden');
    ekgModalDetail.classList.remove('hidden');
    if (ekgHelpTitle) ekgHelpTitle.textContent = detail.heading || 'EKG Detail';
    ekgModalDetailTitle.textContent = asset.name;
    ekgModalDetailImage.src = asset.dataUri;
    ekgModalDetailImage.alt = `${asset.name} waveform`;
    ekgModalDetailDefinition.textContent = asset.definition;
    if (ekgModalBack) ekgModalBack.classList.remove('hidden');
  } else {
    showEkgGeneral();
  }
  ekgHelpModal.classList.remove('hidden');
  ekgHelpBackdrop.classList.remove('hidden');
}

function closeEkgHelp() {
  if (!ekgHelpModal || !ekgHelpBackdrop) return;
  showEkgGeneral();
  ekgModalDetailImage?.removeAttribute('src');
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
    'normal sinus rhythm',
    'sinus tachycardia',
    'sinus bradycardia',
    'atrial fibrillation',
    'atrial flutter',
    'supraventricular tachycardia',
    'svt',
    'junctional rhythm',
    'first degree av block',
    'second degree av block type i',
    'second degree av block type ii',
    'third degree av block',
    'ventricular tachycardia',
    'torsades de pointes',
    'ventricular fibrillation',
    'paced rhythm',
    'wolff-parkinson-white',
    'asystole',
    'pea',
    'pulseless electrical activity'
]);

const rhythmAssetsByName = new Map(EkgRhythmAssets.map(asset => [asset.name.toLowerCase(), asset]));
const rhythmAssetsById = new Map(EkgRhythmAssets.map(asset => [asset.id, asset]));
const modifierAssetsByName = new Map(EkgModifierAssets.map(asset => [asset.name.toLowerCase(), asset]));
const modifierAssetsById = new Map(EkgModifierAssets.map(asset => [asset.id, asset]));

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

function syncUnitSuffixState(inputEl) {
    if (!inputEl) return;
    const wrapper = inputEl.closest('.unit-input');
    if (!wrapper) return;
    const hasValue = Boolean(inputEl.value && inputEl.value.toString().trim().length);
    wrapper.dataset.hasValue = hasValue ? 'true' : 'false';
}

/*
NEW CODE:
const nextDisplay = Array.from(new Set([...patientData.pmhDisplay, committedValue]));
patientData.pmhDisplay = nextDisplay;
renderChipList(chipListElements.pmh, patientData.pmhDisplay);
%%%%
renderChipList(chipListElements.pmh, patientData.pmhDisplay);
%%%%
Explanation:
- After you capture a dropdown selection (for PMH, Allergies, Current Rx's, Indications, or S/S), push the formatted string into the matching `patientData.*Display` array before re-calling `renderChipList`. That array is what feeds the chips that appear to the right of the textarea.
- Wrapping the new values in `new Set` maintains uniqueness so the chip list does not show duplicates when the same term is picked twice.
Override notes:
- If you run this snippet but chips still fail to show on the right, make sure the markup in index.html uses the `.sidebar-field-textarea--chips-right` modifier and the CSS grid comment in `patient-sidebar-forms.css`; without that layout update, the chip container will continue to drop beneath the input.
- When no chips appear even though the array has values, inspect the console for `renderChipList` errors—missing container references (null) will short-circuit the function early.
*/
function renderChipList(container, values) {
  if (!container) return;
  container.replaceChildren();
  const hasValues = Array.isArray(values) && values.some(value => typeof value === 'string' && value.trim().length);
  if (!hasValues) {
    container.classList.add('is-empty');
    container.removeAttribute('data-count');
    return;
  }
  container.classList.remove('is-empty');
  const fragment = document.createDocumentFragment();
  values.forEach(value => {
    if (typeof value !== 'string') return;
    const trimmed = value.trim();
    if (!trimmed) return;
    const chip = document.createElement('span');
    chip.className = 'sidebar-chip';
    chip.textContent = trimmed;
    fragment.appendChild(chip);
  });
  container.appendChild(fragment);
  container.setAttribute('data-count', container.childElementCount.toString());
}

function updateEkgSummary(rhythmText, modifierValue) {
  if (!ekgSummaryEl) return;
  const rhythm = typeof rhythmText === 'string' ? rhythmText.trim() : '';
  let modifierLabel = '';
  if (modifierValue) {
    const optionLabel = ekgModifierSelectEl?.selectedOptions?.[0]?.textContent ?? '';
    modifierLabel = optionLabel.trim() || modifierValue.trim();
  }
  const parts = [];
  if (rhythm) parts.push(`Rhythm: ${rhythm}`);
  if (modifierLabel) parts.push(`Modifier: ${modifierLabel}`);
  if (!parts.length) {
    ekgSummaryEl.textContent = '';
    ekgSummaryEl.classList.add('is-empty');
    return;
  }
  ekgSummaryEl.textContent = parts.join(' • ');
  ekgSummaryEl.classList.remove('is-empty');
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

function getIntegerFromInput(el, min, max) {
  if (!el) return null;
  const raw = typeof el.value === 'string' ? el.value.trim() : '';
  if (!raw) return null;
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed)) return null;
  const clamped = clampNumber(parsed, min, max);
  if (clamped == null) return null;
  if (clamped !== parsed) el.value = clamped.toString();
  syncUnitSuffixState(el);
  return clamped;
}

function sanitizeNumericInput(el, maxLength) {
  if (!el) return '';
  const raw = typeof el.value === 'string' ? el.value : '';
  const digitsOnly = raw.replace(/\D/g, '').slice(0, maxLength);
  if (digitsOnly !== raw) el.value = digitsOnly;
  syncUnitSuffixState(el);
  return digitsOnly;
}

function getBloodPressureDetails() {
  const systolicEl = document.getElementById('vs-bp-systolic');
  const diastolicEl = document.getElementById('vs-bp-diastolic');
  const presetEl = document.getElementById('vs-bp-select');
  const systolic = getIntegerFromInput(systolicEl, 0, 400);
  const diastolic = getIntegerFromInput(diastolicEl, 0, 300);
  const preset = presetEl?.value?.trim() ?? '';
  let formatted = '';
  if (systolic != null && diastolic != null) {
    formatted = systolic + '/' + diastolic;
  } else if (systolic != null) {
    formatted = systolic.toString();
  }
  if (formatted && presetEl && preset) {
    presetEl.value = '';
  } else if (!formatted && preset) {
    formatted = preset;
  }
  let map = null;
  if (systolic != null && diastolic != null) {
    map = Math.round((systolic + (2 * diastolic)) / 3);
    if (systolicEl) systolicEl.dataset.mapValue = map.toString();
    if (diastolicEl) diastolicEl.dataset.mapValue = map.toString();
  } else {
    if (systolicEl) delete systolicEl.dataset.mapValue;
    if (diastolicEl) delete diastolicEl.dataset.mapValue;
  }
  return { value: formatted, systolic, diastolic, preset, map };
}

function getPupilDetails(sizeId, descriptorId) {
  const sizeEl = document.getElementById(sizeId);
  const descriptorEl = document.getElementById(descriptorId);
  const sizeRaw = sizeEl?.value?.trim() ?? '';
  let size = null;
  if (sizeRaw) {
    const parsed = parseFloat(sizeRaw);
    if (!Number.isNaN(parsed)) {
      const clamped = clampNumber(parsed, 0, 8);
      if (clamped != null) {
        const normalized = Math.round(clamped * 2) / 2;
        size = normalized;
        if (sizeEl) sizeEl.value = Number.isInteger(normalized) ? normalized.toString() : normalized.toFixed(1);
      }
    }
  }
  const descriptor = descriptorEl?.value?.trim() ?? '';
  let combined = '';
  if (size != null) {
    combined = Number.isInteger(size) ? size.toString() + 'mm' : size.toFixed(1) + 'mm';
  }
  if (descriptor) {
    combined = combined ? combined + ', ' + descriptor : descriptor;
  }
  return { combined, size, descriptor };
}

function readNumberOrPreset(numberId, selectId, min, max, options = {}) {
  const numberEl = document.getElementById(numberId);
  const selectEl = document.getElementById(selectId);
  const numberValue = getIntegerFromInput(numberEl, min, max);
  if (numberValue != null) {
    if (selectEl) selectEl.value = '';
    return numberValue;
  }
  const preset = selectEl?.value?.trim() ?? '';
  if (!preset) return '';
  if (options.parsePresetAsNumber && /^\d+$/.test(preset)) {
    const parsed = parseInt(preset, 10);
    return clampNumber(parsed, min, max);
  }
  return preset;
}

function linkNumberAndSelect(numberIds, selectId, options = {}) {
  const ids = Array.isArray(numberIds) ? numberIds : [numberIds];
  const numberElements = ids.map(id => document.getElementById(id)).filter(Boolean);
  const selectEl = document.getElementById(selectId);
  if (!numberElements.length || !selectEl) return;
  if (options.allowCombined) return;
  numberElements.forEach(el => {
    el.addEventListener('input', () => {
      if (el.value && selectEl.value) {
        selectEl.value = '';
      }
    });
  });
  selectEl.addEventListener('change', () => {
    if (selectEl.value) {
      numberElements.forEach(el => {
        el.value = '';
        syncUnitSuffixState(el);
      });
    }
  });
}

function findRhythmAssetByName(name) {
  if (!name) return null;
  return rhythmAssetsByName.get(String(name).trim().toLowerCase()) || null;
}

function findRhythmAssetById(id) {
  if (!id) return null;
  return rhythmAssetsById.get(id) || null;
}

function findModifierAssetByName(name) {
  if (!name) return null;
  return modifierAssetsByName.get(String(name).trim().toLowerCase()) || null;
}

function findModifierAssetById(id) {
  if (!id) return null;
  return modifierAssetsById.get(id) || null;
}

function populateEkgSelect(selectEl, assets, findByName) {
  if (!selectEl || !Array.isArray(assets)) return;
  const currentValue = selectEl.value || '';
  selectEl.innerHTML = '';
  const blankOption = document.createElement('option');
  blankOption.value = '';
  blankOption.setAttribute('aria-label', 'No selection');
  selectEl.appendChild(blankOption);
  assets.forEach(asset => {
    const option = document.createElement('option');
    option.value = asset.name;
    option.dataset.assetId = asset.id;
    option.textContent = asset.name;
    selectEl.appendChild(option);
  });
  if (currentValue && typeof findByName === 'function') {
    const asset = findByName(currentValue);
    if (asset) {
      selectEl.value = asset.name;
    }
  }
}

function renderEkgPreview(previewImg, infoButton, asset, typeLabel) {
  const label = typeLabel || 'item';
  if (!previewImg) return;
  if (asset) {
    previewImg.src = asset.dataUri;
    previewImg.dataset.assetId = asset.id;
    previewImg.classList.remove('is-empty');
    previewImg.alt = '';
    previewImg.title = asset.name;
    if (infoButton) {
      infoButton.disabled = false;
      infoButton.dataset.assetId = asset.id;
      infoButton.setAttribute('aria-label', `View ${label.toLowerCase()} definition`);
      infoButton.title = asset.definition;
    }
  } else {
    previewImg.removeAttribute('src');
    previewImg.removeAttribute('data-asset-id');
    previewImg.removeAttribute('title');
    previewImg.classList.add('is-empty');
    if (infoButton) {
      infoButton.disabled = true;
      infoButton.removeAttribute('data-asset-id');
      infoButton.setAttribute('aria-label', `No ${label.toLowerCase()} selected`);
      infoButton.removeAttribute('title');
    }
  }
}

function updateRhythmPreview(sourceValue) {
  const asset = findRhythmAssetByName(sourceValue);
  currentRhythmAssetId = asset ? asset.id : '';
  renderEkgPreview(ekgRhythmPreviewImg, ekgRhythmInfoButton, asset, 'Rhythm');
  return asset;
}

function updateModifierPreview(sourceValue) {
  const asset = findModifierAssetByName(sourceValue);
  currentModifierAssetId = asset ? asset.id : '';
  renderEkgPreview(ekgModifierPreviewImg, ekgModifierInfoButton, asset, 'Modifier');
  return asset;
}
/**
 * Parses a floating point value from the input with the given id. Returns null if parsing fails
 * or the value is empty. This helper is used for weight inputs where decimals are allowed.
 * @param {string} id The id of the input element to parse.
 * @returns {number|null} The parsed float or null.
 */
function getParsedFloat(id) {
    const val = getInputValue(id);
    return val && !isNaN(parseFloat(val)) ? parseFloat(val) : null;
}
function getNormalizedNumberOrText(id, min, max) {
  const el = document.getElementById(id);
  const numeric = getIntegerFromInput(el, min, max);
  if (numeric != null) return numeric;
  return el?.value?.trim() ?? '';
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
  if (weightUnitWrapper) weightUnitWrapper.dataset.unit = normalized;
  if (weightUnitSuffixEl) weightUnitSuffixEl.textContent = normalized === 'kg' ? 'kg' : 'lbs';
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
  syncUnitSuffixState(weightInputEl);
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
    if (ageUnitWrapper) ageUnitWrapper.dataset.unit = normalized;
    if (ageUnitSuffixEl) {
      const suffixText = AGE_UNIT_METADATA[normalized]?.suffix ?? '';
      ageUnitSuffixEl.textContent = suffixText;
    }
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
      syncUnitSuffixState(ageInputEl);
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
    renderChipList(chipListElements.pmh, patientData.pmhDisplay);

    const allergyValues = getFieldValues('allergies', 'pt-allergies');
    const allergyUnique = dedupeByCanonical(allergyValues.canonical, allergyValues.display);
    patientData.allergies = allergyUnique.canonical;
    patientData.allergyDisplay = allergyUnique.display;
    renderChipList(chipListElements.allergies, patientData.allergyDisplay);

    const medicationValues = getFieldValues('medications', 'pt-medications');
    const medicationUnique = dedupeByCanonical(medicationValues.canonical, medicationValues.display);
    patientData.currentMedications = medicationUnique.canonical;
    patientData.medicationsDisplay = medicationUnique.display;
    patientData.medicationClasses = resolveMedicationClasses(medicationUnique.canonical);
    renderChipList(chipListElements.medications, patientData.medicationsDisplay);

    const indicationValues = getFieldValues('indications', 'pt-indications');
    const indicationUnique = dedupeByCanonical(indicationValues.canonical, indicationValues.display);
    patientData.indications = indicationUnique.canonical;
    patientData.indicationsDisplay = indicationUnique.display;
    renderChipList(chipListElements.indications, patientData.indicationsDisplay);

    const symptomValues = getFieldValues('symptoms', 'pt-symptoms');
    const symptomUnique = dedupeByCanonical(symptomValues.canonical, symptomValues.display);
    patientData.symptoms = symptomUnique.canonical;
    patientData.symptomsDisplay = symptomUnique.display;
    renderChipList(chipListElements.symptoms, patientData.symptomsDisplay);

    const ekgSelectValue = document.getElementById('pt-ekg-select')?.value?.trim() ?? '';
    const ekgValues = getFieldValues('ekg', 'pt-ekg');
    const ekgCanonical = Array.isArray(ekgValues.canonical) ? [...ekgValues.canonical] : [];
    const ekgDisplay = Array.isArray(ekgValues.display) ? [...ekgValues.display] : [];
    if (ekgSelectValue) {
        const normalizedSelect = normalizeCommittedValues('ekg', [ekgSelectValue]);
        if (normalizedSelect && Array.isArray(normalizedSelect.canonical) && Array.isArray(normalizedSelect.display)) {
            ekgCanonical.unshift(...normalizedSelect.canonical);
            ekgDisplay.unshift(...normalizedSelect.display);
        }
    }
    const ekgUnique = dedupeByCanonical(ekgCanonical, ekgDisplay);
    patientData.ekg = ekgUnique.canonical[0] || '';
    patientData.ekgDisplay = ekgUnique.display[0] || '';
    patientData.ekgSecondary = getInputValue('pt-ekg-secondary');
    updateEkgSummary(patientData.ekgDisplay, patientData.ekgSecondary);

    const bpDetails = getBloodPressureDetails();
    const hrValue = readNumberOrPreset('vs-hr-value', 'vs-hr-select', 0, 400);
    const spo2Value = getIntegerFromInput(document.getElementById('vs-spo2-value'), 0, 100);
    const spo2Source = getInputValue('vs-spo2-source');
    const etco2Value = getNormalizedNumberOrText('vs-etco2', 0, 50);
    const rrValue = getNormalizedNumberOrText('vs-rr', 0, 80);
    const bglValue = readNumberOrPreset('vs-bgl-value', 'vs-bgl-select', 0, 900);
    const pupilDetails = getPupilDetails('vs-pupils-value', 'vs-pupils-select');
    const gcsValue = readNumberOrPreset('vs-gcs-value', 'vs-gcs-select', 3, 15, { parsePresetAsNumber: true });

    patientData.vitalSigns = {
        bp: bpDetails.value,
        bpSystolic: bpDetails.systolic,
        bpDiastolic: bpDetails.diastolic,
        map: bpDetails.map,
        hr: hrValue,
        spo2: spo2Value,
        spo2Source,
        etco2: etco2Value,
        rr: rrValue,
        bgl: bglValue,
        eyes: pupilDetails.combined,
        gcs: gcsValue,
        aoStatus: getInputValue('vs-ao-status'),
        lungSounds: getInputValue('vs-lung-sounds')
    };
// If any indications are entered, strike through irrelevant topics in the list. We compare the
// patient’s indications against each topic’s indications to determine relevance. This logic
// originally lived in the ListView module but has been centralized here to respond to patient input changes immediately.
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
  unitInputElements.forEach(input => syncUnitSuffixState(input));
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

linkNumberAndSelect(['vs-bp-systolic', 'vs-bp-diastolic'], 'vs-bp-select');
linkNumberAndSelect('vs-hr-value', 'vs-hr-select');
linkNumberAndSelect('vs-bgl-value', 'vs-bgl-select');
linkNumberAndSelect('vs-gcs-value', 'vs-gcs-select');

const bpSystolicEl = document.getElementById('vs-bp-systolic');
const bpDiastolicEl = document.getElementById('vs-bp-diastolic');
if (bpSystolicEl && bpDiastolicEl) {
  bpSystolicEl.addEventListener('input', event => {
    const digits = sanitizeNumericInput(bpSystolicEl, 3);
    if (event.inputType !== 'deleteContentBackward' && digits.length === 3) {
      sanitizeNumericInput(bpDiastolicEl, 3);
      bpDiastolicEl.value = '';
      syncUnitSuffixState(bpDiastolicEl);
      bpDiastolicEl.focus();
      bpDiastolicEl.select();
    }
  }, { capture: true });

  bpDiastolicEl.addEventListener('input', () => {
    sanitizeNumericInput(bpDiastolicEl, 3);
  }, { capture: true });
}

const spo2InputEl = document.getElementById('vs-spo2-value');
if (spo2InputEl) {
  spo2InputEl.addEventListener('input', () => {
    sanitizeNumericInput(spo2InputEl, 3);
  }, { capture: true });

  spo2InputEl.addEventListener('blur', () => {
    const digits = sanitizeNumericInput(spo2InputEl, 3);
    if (!digits) {
      spo2InputEl.value = '';
      syncUnitSuffixState(spo2InputEl);
      updatePatientData();
      return;
    }
    const numeric = parseInt(digits, 10);
    const clamped = clampNumber(numeric, 0, 100);
    spo2InputEl.value = clamped != null ? clamped.toString() : '';
    syncUnitSuffixState(spo2InputEl);
    updatePatientData();
  });
}

const ekgSelectEl = document.getElementById('pt-ekg-select');
const ekgModifierSelectEl = document.getElementById('pt-ekg-secondary');
const ekgInputEl = document.getElementById('pt-ekg');

if (ekgSelectEl) populateEkgSelect(ekgSelectEl, EkgRhythmAssets, findRhythmAssetByName);
if (ekgModifierSelectEl) populateEkgSelect(ekgModifierSelectEl, EkgModifierAssets, findModifierAssetByName);
if (ekgSelectEl && ekgInputEl) {
  ekgSelectEl.addEventListener('change', () => {
    const selectedValue = ekgSelectEl.value || '';
    if (selectedValue) {
      ekgInputEl.value = selectedValue;
    }
    updateRhythmPreview(selectedValue || ekgInputEl.value);
    updatePatientData();
  });
  ekgInputEl.addEventListener('input', () => {
    const inputValue = ekgInputEl.value.trim();
    const asset = updateRhythmPreview(inputValue);
    if (ekgSelectEl) {
      ekgSelectEl.value = asset ? asset.name : '';
    }
    updatePatientData();
  });
  updateRhythmPreview(ekgInputEl.value);
}

if (ekgModifierSelectEl) {
  ekgModifierSelectEl.addEventListener('change', () => {
    const value = ekgModifierSelectEl.value || '';
    updateModifierPreview(value);
    updatePatientData();
  });
  updateModifierPreview(ekgModifierSelectEl.value);
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
  ekgHelpButton.addEventListener('click', () => {
    showEkgGeneral();
    openEkgHelp();
  });
  ekgHelpBackdrop.addEventListener('click', closeEkgHelp);
  ekgHelpClose?.addEventListener('click', closeEkgHelp);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeEkgHelp();
  });
  ekgModalBack?.addEventListener('click', showEkgGeneral);
}

ekgRhythmInfoButton?.addEventListener('click', () => {
  const asset = findRhythmAssetById(currentRhythmAssetId);
  if (asset) {
    openEkgHelp({ asset, heading: 'Rhythm Detail' });
  }
});

ekgModifierInfoButton?.addEventListener('click', () => {
  const asset = findModifierAssetById(currentModifierAssetId);
  if (asset) {
    openEkgHelp({ asset, heading: 'Modifier Detail' });
  }
});

// Removed Medication Class dropdown integration
// Expose our important values and functions globally for legacy scripts. This allows older code
// that references window.patientData, window.PEDIATRIC_AGE_THRESHOLD, etc. to continue working
// even though this module exports them. Once the entire app uses ES modules, these exposures can be removed.
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
