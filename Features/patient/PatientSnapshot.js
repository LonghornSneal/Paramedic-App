import { patientData, PEDIATRIC_AGE_THRESHOLD } from './PatientInfo.js';

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
function relevantAllergies(inds, allergies, displayMap){
  const indications = (inds || []).map(value => (value || '').toLowerCase());
  const allergyKeys = (allergies || []).map(value => (value || '').toLowerCase());
  const out = [];
  const chestPainLike = indications.some(t => ['chest pain','mi','acs','myocardial infarction'].includes(t));
  if (chestPainLike) {
    if (allergyKeys.includes('asa') || allergyKeys.includes('aspirin')) {
      const label = displayMap.get('asa') || displayMap.get('aspirin') || 'ASA';
      if (!out.includes(label)) out.push(label);
    }
  }
  return out;
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
  const allergiesDisplay = Array.isArray(d.allergyDisplay) ? d.allergyDisplay : [];
  const medicationsDisplay = Array.isArray(d.medicationsDisplay) ? d.medicationsDisplay : [];
  const medicationClasses = Array.isArray(d.medicationClasses) ? d.medicationClasses : [];
  const pmhDisplay = Array.isArray(d.pmhDisplay) ? d.pmhDisplay : [];
  const symptomsDisplay = Array.isArray(d.symptomsDisplay) ? d.symptomsDisplay : [];
  const hasAllergies = allergiesDisplay.length > 0;
  const hasPmh = pmhDisplay.length > 0;
  const hasIndications = indicationsDisplay.length > 0;
  const hasSymptoms = symptomsDisplay.length > 0;
  const hasVitals = Boolean(v.bp || v.hr != null || v.rr != null || v.bgl);
  const ekgLabelSource = typeof d.ekgDisplay === 'string' && d.ekgDisplay.trim().length ? d.ekgDisplay : d.ekg;
  const hasEkg = typeof ekgLabelSource === 'string' ? ekgLabelSource.trim().length > 0 : Boolean(ekgLabelSource);
  const hasMeds = medicationClasses.length > 0 || medicationsDisplay.length > 0;
  const classWarnings = deriveClassWarnings(d);

  if (!hasDemographics && !hasIndications && !hasAllergies && !hasPmh && !hasSymptoms && !hasVitals && !hasMeds && !hasEkg) {
    bar.innerHTML = '';
    return;
  }

  const allergiesInputValue = document.getElementById('pt-allergies')?.value ?? '';
  const allergiesProvided = allergiesInputValue.trim().length > 0;

  const allergyDisplayMap = new Map();
  if (Array.isArray(d.allergies)) {
    d.allergies.forEach((value, index) => {
      const key = (value || '').toLowerCase();
      if (!key) return;
      const label = allergiesDisplay[index] || value;
      if (!allergyDisplayMap.has(key)) {
        allergyDisplayMap.set(key, label);
      }
    });
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
  const relevantAllergyList = relevantAllergies(d.indications, d.allergies, allergyDisplayMap);
  if (relevantAllergyList.length) {
    parts.push(`Allergy: ${relevantAllergyList.join(', ')}`);
  } else if (hasAllergies) {
    const list = allergiesDisplay.slice(0, 3);
    parts.push(`Allergies: ${list.join(', ')}`);
  } else if (allergiesProvided) {
    parts.push('Allergies: NKA');
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
  if (v.hr != null) parts.push(`<span class="${sevHR(v.hr)}">HR ${v.hr}</span>`);
  if (v.rr != null) parts.push(`<span class="${sevRR(v.rr)}">RR ${v.rr}</span>`);
  if (v.bgl) parts.push(`<span class="${sevBGL(v.bgl)}">BGL ${v.bgl}</span>`);
  if (hasEkg) {
    const ekgText = typeof ekgLabelSource === 'string' ? ekgLabelSource : '';
    const ekgTitle = d.ekg || ekgText;
    parts.push(`<span class="${sevRhythm(d.ekg)}" title="${ekgTitle}">${abbr(ekgText)}</span>`);
  }

  const summaryHtml = parts.join(' &bull; ');
  if (classWarnings.length) {
    const warningsHtml = classWarnings.map(msg => `<div class="snapshot-warning-item" role="alert">${msg}</div>`).join('');
    bar.innerHTML = `${summaryHtml}<div class="snapshot-warning-list" role="status">${warningsHtml}</div>`;
  } else {
    bar.innerHTML = summaryHtml;
  }
}

if (typeof window !== 'undefined') { window.renderPatientSnapshot = renderPatientSnapshot; }

// Optionally expose globally
if (typeof window !== 'undefined') {
    window.renderPatientSnapshot = renderPatientSnapshot;
}



