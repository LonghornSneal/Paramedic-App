import { patientData, PEDIATRIC_AGE_THRESHOLD } from './PatientInfo.js';
import { splitSegments, normalizeCommittedValues } from './patientTerminology.js';
import { MedicationDetailsData } from '../../Data/MedicationDetailsData.js';

const WEIGHT_CONVERSION_FACTOR = 2.20462;


// Abbreviations used for compact snapshot
const ABBREV = new Map([
  ['chest pain','CP'], ['shortness of breath','SOB'], ['dyspnea','SOB'],
  ['myocardial infarction','MI'], ['mi','MI'], ['acs','ACS'],
  ['congestive heart failure','CHF'], ['heart failure','CHF'], ['copd','COPD'],
  ['diabetes','DM'], ['diabetes mellitus','DM'], ['chronic kidney disease','CKD'],
  ['hypertension','HTN']
]);

const CLASS_WARNING_RULES = [
  {
    classMatchers: [
      ['beta', 'antagonist'],
      ['beta', 'blocker']
    ],
    triggers: [
      { field: 'indications', values: ['bronchospasm', 'asthma'] }
    ],
    message: 'Warning: Documented beta-blocker may reduce effectiveness of beta-agonist bronchodilators.'
  }
];

const ALLERGY_RELATED_TERMS = ['allergy', 'allergic', 'anaphylaxis', 'anaphylactic'];
const CONTEXT_TERM_ALIASES = new Map([
  ['chest pain', ['mi', 'acs', 'myocardial infarction']],
  ['shortness of breath', ['bronchospasm', 'pulmonary edema', 'dyspnea']],
  ['sob', ['bronchospasm', 'pulmonary edema', 'dyspnea']],
  ['dyspnea', ['shortness of breath', 'bronchospasm', 'pulmonary edema']]
]);

function deriveClassWarnings(data) {
  if (!data) return [];
  const classes = Array.isArray(data.medicationClasses) ? data.medicationClasses : [];
  if (!classes.length) return [];
  const normalizedClasses = classes
    .map(item => (item || '').toString().toLowerCase())
    .filter(Boolean);
  if (!normalizedClasses.length) return [];

  const fieldCache = new Map();
  const ensureFieldValues = fieldKey => {
    if (!fieldCache.has(fieldKey)) {
      const values = Array.isArray(data[fieldKey]) ? data[fieldKey] : [];
      fieldCache.set(fieldKey, values.map(value => (value || '').toString().toLowerCase()));
    }
    return fieldCache.get(fieldKey);
  };

  const warnings = new Set();

  CLASS_WARNING_RULES.forEach(rule => {
    const matchesClass = normalizedClasses.some(className =>
      rule.classMatchers.some(tokens => tokens.every(token => className.includes(token)))
    );
    if (!matchesClass) return;

    if (!Array.isArray(rule.triggers) || rule.triggers.length === 0) {
      warnings.add(rule.message);
      return;
    }

    const triggered = rule.triggers.some(trigger => {
      if (!trigger || !trigger.field) return false;
      const values = ensureFieldValues(trigger.field);
      if (!values.length) return false;
      const targets = Array.isArray(trigger.values) ? trigger.values.map(value => value.toLowerCase()) : [];
      if (!targets.length) return false;
      return targets.some(target => values.includes(target));
    });

    if (triggered) warnings.add(rule.message);
  });

  return Array.from(warnings);
}

function stripProtocolMarkup(value) {
  return `${value ?? ''}`
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$1 $2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\{\{[^:}]+:([^}]+)\}\}/g, '$1')
    .replace(/[↑↓]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSearchText(value) {
  return stripProtocolMarkup(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenizeSearchText(value) {
  const normalized = normalizeSearchText(value);
  return normalized ? normalized.split(' ').filter(Boolean) : [];
}

function textMatchesAlias(text, alias) {
  const normalizedText = normalizeSearchText(text);
  const normalizedAlias = normalizeSearchText(alias);
  if (!normalizedText || !normalizedAlias) return false;
  if (normalizedText.includes(normalizedAlias)) return true;

  const textTokens = normalizedText.split(' ').filter(Boolean);
  const aliasTokens = normalizedAlias.split(' ').filter(Boolean);
  if (!aliasTokens.length) return false;

  return aliasTokens.every(aliasToken => {
    if (aliasToken.length <= 3) return textTokens.includes(aliasToken);
    return textTokens.some(textToken => (
      textToken === aliasToken ||
      (textToken.length >= 4 && textToken.includes(aliasToken)) ||
      (textToken.length >= 4 && aliasToken.includes(textToken))
    ));
  });
}

function compactClassLabel(value) {
  const stripped = stripProtocolMarkup(value);
  if (!stripped) return '';
  const beforeParen = stripped.split('(')[0].trim();
  return beforeParen || stripped;
}

function getAllergyEntries(data, rawInputValue = null) {
  const entries = [];
  const seen = new Set();

  if (typeof rawInputValue === 'string') {
    if (!rawInputValue.trim()) return entries;

    const segments = splitSegments(rawInputValue);
    const rawValues = [...segments.committed];
    if (segments.current) rawValues.push(segments.current);
    const normalized = normalizeCommittedValues('allergies', rawValues, { register: false });
    normalized.canonical.forEach((value, index) => {
      const label = normalized.display[index] || value;
      const key = normalizeSearchText(value || label);
      if (!key || seen.has(key)) return;
      seen.add(key);
      entries.push({
        key,
        label,
        aliases: Array.from(new Set([value, label].map(item => normalizeSearchText(item)).filter(Boolean)))
      });
    });

    return entries;
  }

  const sourceAllergies = Array.isArray(data?.allergies) ? data.allergies : [];
  const sourceDisplay = Array.isArray(data?.allergyDisplay) ? data.allergyDisplay : [];

  sourceAllergies.forEach((value, index) => {
    const label = sourceDisplay[index] || value;
    const key = normalizeSearchText(value || label);
    if (!key || seen.has(key)) return;
    seen.add(key);
    entries.push({
      key,
      label,
      aliases: Array.from(new Set([value, label].map(item => normalizeSearchText(item)).filter(Boolean)))
    });
  });

  return entries;
}

function expandContextTerms(values) {
  const expanded = new Set();
  (values || []).forEach(value => {
    const normalized = normalizeSearchText(value);
    if (!normalized) return;
    expanded.add(normalized);
    const aliases = CONTEXT_TERM_ALIASES.get(normalized) || [];
    aliases.forEach(alias => {
      const normalizedAlias = normalizeSearchText(alias);
      if (normalizedAlias) expanded.add(normalizedAlias);
    });
  });
  return Array.from(expanded);
}

function isAllergyRelatedScenario(data) {
  const values = [
    ...(Array.isArray(data?.indications) ? data.indications : []),
    ...(Array.isArray(data?.symptoms) ? data.symptoms : [])
  ];
  return values.some(value => {
    const normalized = normalizeSearchText(value);
    return ALLERGY_RELATED_TERMS.some(term => textMatchesAlias(normalized, term));
  });
}

function getContextMedicationEntries(data) {
  const contextTerms = expandContextTerms([
    ...(Array.isArray(data?.indications) ? data.indications : []),
    ...(Array.isArray(data?.symptoms) ? data.symptoms : [])
  ]);
  if (!contextTerms.length) return [];

  return MedicationDetailsData.filter(medication => {
    const indicationTexts = Array.isArray(medication?.indications) ? medication.indications : [];
    if (!indicationTexts.length) return false;
    return contextTerms.some(term => indicationTexts.some(text => textMatchesAlias(text, term)));
  });
}

function medicationMatchesAllergy(medication, allergyEntry) {
  if (!medication || !allergyEntry) return false;
  const searchableValues = [
    medication.title,
    medication.class,
    ...(Array.isArray(medication.contraindications) ? medication.contraindications : [])
  ];
  return allergyEntry.aliases.some(alias => searchableValues.some(value => textMatchesAlias(value, alias)));
}

function getClassesForAllergy(allergyEntry, medications) {
  const classes = new Set();
  (medications || []).forEach(medication => {
    if (!medicationMatchesAllergy(medication, allergyEntry)) return;
    const classLabel = compactClassLabel(medication.class);
    if (!classLabel) return;
    if (textMatchesAlias(allergyEntry.label, classLabel)) return;
    classes.add(classLabel);
  });
  return Array.from(classes);
}

function formatAllergyLabel(allergyEntry, classes = []) {
  if (!classes.length) return allergyEntry.label;
  return `${allergyEntry.label} (${classes.join('/')})`;
}

function getAllergySummary(data, rawInputValue = '') {
  const allergyEntries = getAllergyEntries(data, rawInputValue);
  if (!allergyEntries.length) return rawInputValue.trim() ? 'Allergies: NKA' : '';

  const allMedications = MedicationDetailsData;
  if (isAllergyRelatedScenario(data)) {
    const labels = allergyEntries.map(entry => formatAllergyLabel(entry, getClassesForAllergy(entry, allMedications)));
    return `Allergies: ${labels.join(', ')}`;
  }

  const contextMedications = getContextMedicationEntries(data);
  const scoredEntries = allergyEntries
    .map(entry => ({
      entry,
      score: contextMedications.reduce((count, medication) => (
        medicationMatchesAllergy(medication, entry) ? count + 1 : count
      ), 0)
    }))
    .filter(item => item.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.entry.label.localeCompare(right.entry.label);
    });

  if (scoredEntries.length) {
    const labels = scoredEntries.slice(0, 2).map(item => item.entry.label);
    const suffix = allergyEntries.length > labels.length ? ', etc.' : '';
    return `Allergies: ${labels.join(', ')}${suffix}`;
  }

  const fallbackLabels = allergyEntries.slice(0, 3).map(entry => entry.label);
  const suffix = allergyEntries.length > fallbackLabels.length ? ', etc.' : '';
  return `Allergies: ${fallbackLabels.join(', ')}${suffix}`;
}


function abbr(text){
  if (!text) return '';
  const t = text.toLowerCase();
  for (const [k,v] of ABBREV) { if (t === k) return v; }
  return text.replace(/\b\w/g, c => c.toUpperCase());
}
function genderSymbol(g){ if (g === 'female') return 'F'; if (g === 'male') return 'M'; return ''; }
function formatWeightDisplay(data) {
  if (!data) return '';
  const unit = data.weightUnit === 'lb' ? 'lb' : 'kg';
  const raw = (typeof data.weightInputValue === 'number' && !Number.isNaN(data.weightInputValue)) ? data.weightInputValue : null;
  if (raw != null) {
    const rounded = Math.round(raw * 10) / 10;
    const display = Math.abs(rounded - Math.round(rounded)) < 0.05 ? Math.round(rounded).toString() : rounded.toFixed(1);
    return display + unit;
  }
  if (typeof data.weight === 'number' && !Number.isNaN(data.weight)) {
    if (unit === 'lb') {
      const pounds = data.weight * WEIGHT_CONVERSION_FACTOR;
      const roundedLb = Math.round(pounds * 10) / 10;
      const displayLb = Math.abs(roundedLb - Math.round(roundedLb)) < 0.05 ? Math.round(roundedLb).toString() : roundedLb.toFixed(1);
      return displayLb + 'lb';
    }
    const kgRounded = Math.round(data.weight * 10) / 10;
    const displayKg = Math.abs(kgRounded - Math.round(kgRounded)) < 0.05 ? Math.round(kgRounded).toString() : kgRounded.toFixed(1);
    return displayKg + 'kg';
  }
  return '';
}
function formatHeightDisplay(totalIn) {
  if (typeof totalIn !== 'number' || Number.isNaN(totalIn) || totalIn <= 0) return '';
  const inches = Math.round(totalIn);
  const feet = Math.floor(inches / 12);
  const remainder = inches % 12;
  if (feet > 0 && remainder > 0) return feet + 'ft ' + remainder + 'in';
  if (feet > 0) return feet + 'ft';
  return inches + 'in';
}
function sevHR(hr){ if (hr==null) return ''; if (hr>120||hr<50) return 'text-red-600'; if (hr>100||hr<60) return 'text-yellow-600'; return ''; }
function formatSnapshotAge(data) {
  if (!data) return '';
  const raw = typeof data.ageInputValue === 'number' && !Number.isNaN(data.ageInputValue)
    ? data.ageInputValue
    : (typeof data.age === 'number' && !Number.isNaN(data.age) ? data.age : null);
  if (raw == null) return '';
  const unit = data.ageUnit || 'years';
  const rounded = Math.round(raw * 10) / 10;
  const displayValue = Math.abs(rounded - Math.round(rounded)) < 0.05
    ? Math.round(rounded).toString()
    : rounded.toFixed(1);
  if (unit === 'days') return `${displayValue}d`;
  if (unit === 'months') return `${displayValue}mo`;
  return `${displayValue}yo`;
}

function sevRR(rr){ if (rr==null) return ''; if (rr>24||rr<10) return 'text-red-600'; if (rr>20||rr<12) return 'text-yellow-600'; return ''; }
function sevBGL(bgl){ const n=parseFloat(bgl); if (isNaN(n)) return ''; if (n>200||n<60) return 'text-red-600'; if (n>140||n<70) return 'text-yellow-600'; return ''; }
function sevRhythm(ekg){ const s=(ekg||'').toLowerCase(); if (s.includes('tachy')||s.includes('brady')) return 'text-yellow-600'; return ''; }
function hasSnapshotValue(value) {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

function buildSnapshotWarningList(warnings) {
  if (!Array.isArray(warnings) || !warnings.length) return null;
  const list = document.createElement('div');
  list.className = 'snapshot-warning-list';
  list.setAttribute('role', 'status');
  warnings.forEach(message => {
    const item = document.createElement('div');
    item.className = 'snapshot-warning-item';
    item.setAttribute('role', 'alert');
    item.textContent = message;
    list.appendChild(item);
  });
  return list;
}
// Render compact snapshot under the search bar
export function renderPatientSnapshot(){
  const bar = document.getElementById('patient-snapshot-bar');
  if (!bar) return;
  const d = patientData;
  const v = d.vitalSigns || {};
  const ageDisplay = formatSnapshotAge(d);
  const genderDisplay = genderSymbol(d.gender);
  const weightDisplay = formatWeightDisplay(d);
  const isPediatric = typeof d.age === 'number' ? d.age < PEDIATRIC_AGE_THRESHOLD : false;
  const heightDisplay = isPediatric ? formatHeightDisplay(d.heightIn) : '';
  const hasDemographics = Boolean(ageDisplay || genderDisplay || weightDisplay || heightDisplay);
  const indicationsDisplay = Array.isArray(d.indicationsDisplay) ? d.indicationsDisplay : [];
  const medicationsDisplay = Array.isArray(d.medicationsDisplay) ? d.medicationsDisplay : [];
  const medicationClasses = Array.isArray(d.medicationClasses) ? d.medicationClasses : [];
  const pmhDisplay = Array.isArray(d.pmhDisplay) ? d.pmhDisplay : [];
  const symptomsDisplay = Array.isArray(d.symptomsDisplay) ? d.symptomsDisplay : [];
  const allergiesInputEl = document.getElementById('pt-allergies');
  const allergiesInputValue = allergiesInputEl ? allergiesInputEl.value ?? '' : null;
  const allergyEntries = getAllergyEntries(d, allergiesInputValue);
  const hasAllergies = allergyEntries.length > 0;
  const hasPmh = pmhDisplay.length > 0;
  const hasIndications = indicationsDisplay.length > 0;
  const hasSymptoms = symptomsDisplay.length > 0;
  const hasVitals = Boolean(
    hasSnapshotValue(v.bp)
    || hasSnapshotValue(v.hr)
    || hasSnapshotValue(v.spo2)
    || hasSnapshotValue(v.etco2)
    || hasSnapshotValue(v.rr)
    || hasSnapshotValue(v.bgl)
  );
  const ekgLabelSource = typeof d.ekgDisplay === 'string' && d.ekgDisplay.trim().length ? d.ekgDisplay : d.ekg;
  const hasEkg = typeof ekgLabelSource === 'string' ? ekgLabelSource.trim().length > 0 : Boolean(ekgLabelSource);
  const hasMeds = medicationClasses.length > 0 || medicationsDisplay.length > 0;
  const classWarnings = deriveClassWarnings(d);

  if (!hasDemographics && !hasIndications && !hasAllergies && !hasPmh && !hasSymptoms && !hasVitals && !hasMeds && !hasEkg) {
    bar.replaceChildren();
    return;
  }

  const parts = [];
  if (hasDemographics){
    const seg = [ageDisplay, genderDisplay, weightDisplay, heightDisplay].filter(Boolean).join(' ');
    if (seg) parts.push(seg);
  }
  if (hasIndications){
    const inds = indicationsDisplay.map(ind => `<span class="underline decoration-blue-600 text-blue-600" title="${ind}">${abbr(ind)}</span>`);
    parts.push(inds.join(', '));
  }
  const allergySummary = getAllergySummary(d, allergiesInputValue);
  if (allergySummary) {
    parts.push(allergySummary);
  }
  if (hasPmh){
    const pmh = pmhDisplay.slice(0,2).map(p=>`<span title="${p}">${abbr(p)}</span>`).join(', ');
    if (pmh) parts.push(`PMH: ${pmh}`);
  }
  if (hasMeds){
    if (medicationClasses.length) {
      parts.push(`Current Meds: ${medicationClasses.join(', ')}`);
    } else if (medicationsDisplay.length) {
      parts.push(`Current Meds: ${medicationsDisplay.join(', ')}`);
    }
  }
  if (hasSymptoms){
    const summary = symptomsDisplay.slice(0,2).join(', ');
    if (summary) parts.push(`Symptoms: ${summary}`);
  }
  if (v.bp) parts.push(`BP ${v.bp}`);
  if (hasSnapshotValue(v.hr)) parts.push(`<span class="${sevHR(v.hr)}">${v.hr}HR</span>`);
  if (typeof v.spo2 === 'number') {
    parts.push(`${v.spo2}%`);
  } else if (typeof v.spo2 === 'string' && v.spo2.trim()) {
    parts.push(`SpO2 ${v.spo2.trim()}`);
  }
  if (v.etco2 != null && v.etco2 !== '') {
    const etValue = typeof v.etco2 === 'number' ? v.etco2 : v.etco2;
    parts.push(`${etValue}EtCO<sub>2</sub>`);
  }
  if (hasSnapshotValue(v.rr)) parts.push(`<span class="${sevRR(v.rr)}">${v.rr}RR</span>`);
  if (v.bgl) {
    const bglSuffix = typeof v.bgl === 'number' ? `${v.bgl}mg/dL` : v.bgl;
    parts.push(`<span class="${sevBGL(v.bgl)}">${bglSuffix}</span>`);
  }
  const ekgSecondaryNote = typeof d.ekgSecondary === 'string' ? d.ekgSecondary.trim() : '';
  if (hasEkg) {
    const ekgText = typeof ekgLabelSource === 'string' ? ekgLabelSource : '';
    const ekgTitle = d.ekg || ekgText;
    parts.push(`<span class="${sevRhythm(d.ekg)}" title="${ekgTitle}">${abbr(ekgText)}</span>`);
  }
  if (ekgSecondaryNote) {
    parts.push(ekgSecondaryNote);
  }

  const summaryHtml = parts.join(' &bull; ');
  const summaryEl = document.createElement('span');
  summaryEl.className = 'snapshot-summary';
  summaryEl.innerHTML = summaryHtml;
  bar.replaceChildren(summaryEl);
  if (classWarnings.length) {
    const warningsList = buildSnapshotWarningList(classWarnings);
    if (warningsList) bar.appendChild(warningsList);
  }
}

if (typeof window !== 'undefined') { window.renderPatientSnapshot = renderPatientSnapshot; }

// Optionally expose globally
if (typeof window !== 'undefined') {
    window.renderPatientSnapshot = renderPatientSnapshot;
}



