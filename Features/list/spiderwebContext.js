const MINOR_FOCUS_PATTERN = /\b(pediatric|child|children|minor|minors|adolescent|adolescents|infant|infants|newborn|newborns|neonatal|neonate|special needs children|stars pt)\b/i;
const ADULT_FOCUS_PATTERN = /\badult(?:s)?\b/i;
const FEMALE_FOCUS_PATTERN = /\b(ob\/gyn|pregnan|delivery|breech|eclampsia|prolapsed cord|shoulder dystocia)\b/i;
const OB_GYN_PATTERN = /\b(ob\/gyn|eclampsia|delivery|breech|prolapsed cord|shoulder dystocia)\b/i;

const itemTextCache = new Map();
const itemSearchCache = new Map();

function resolveItem(item) {
  if (typeof window === 'undefined' || !item?.id) return item;
  return window.allDisplayableTopicsMap?.[item.id] || item;
}

function normalizeText(value) {
  return `${value ?? ''}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenize(value) {
  return normalizeText(value)
    .split(' ')
    .filter(token => token.length >= 3);
}

function flattenDetailValue(value) {
  if (Array.isArray(value)) {
    return value
      .map(entry => flattenDetailValue(entry))
      .filter(Boolean)
      .join(' ');
  }
  if (value && typeof value === 'object') {
    return Object.values(value)
      .map(entry => flattenDetailValue(entry))
      .filter(Boolean)
      .join(' ');
  }
  return `${value ?? ''}`;
}

function buildItemText(item) {
  const sourceItem = resolveItem(item);
  if (!sourceItem?.id) return '';
  if (itemTextCache.has(sourceItem.id)) return itemTextCache.get(sourceItem.id);
  const details = sourceItem.details || {};
  const text = normalizeText([
    sourceItem.id,
    sourceItem.title,
    sourceItem.path,
    sourceItem.description,
    flattenDetailValue(details.class),
    flattenDetailValue(details.concentration),
    flattenDetailValue(details.indications),
    flattenDetailValue(details.contraindications),
    flattenDetailValue(details.precautions),
    flattenDetailValue(details.sideEffects),
    flattenDetailValue(details.adultRx),
    flattenDetailValue(details.pediatricRx),
    flattenDetailValue(details.notes)
  ].filter(Boolean).join(' '));
  itemTextCache.set(sourceItem.id, text);
  return text;
}

function buildSearchText(item) {
  const sourceItem = resolveItem(item);
  if (!sourceItem?.id) return '';
  if (itemSearchCache.has(sourceItem.id)) return itemSearchCache.get(sourceItem.id);
  const text = normalizeText([
    sourceItem.id,
    sourceItem.title,
    sourceItem.path,
    sourceItem.description
  ].filter(Boolean).join(' '));
  itemSearchCache.set(sourceItem.id, text);
  return text;
}

function textMatches(text, candidate) {
  const normalized = normalizeText(candidate);
  if (!normalized) return false;
  if (text.includes(normalized)) return true;
  const tokens = tokenize(normalized);
  return tokens.length > 1 && tokens.every(token => text.includes(token));
}

function pushWeightedTerm(target, value, weight) {
  const normalized = normalizeText(value);
  if (!normalized) return;
  target.push({ value: normalized, weight });
}

function pushWeightedTerms(target, values, weight) {
  if (!Array.isArray(values)) return;
  values.forEach(value => pushWeightedTerm(target, value, weight));
}

function deriveVitalTerms(vitalSigns = {}) {
  const derived = [];
  const hr = typeof vitalSigns.hr === 'number' ? vitalSigns.hr : null;
  if (hr != null && hr >= 150) {
    ['tachycardia', 'svt', 'mono vt', 'torsades', 'a fib', 'a flutter'].forEach(term => pushWeightedTerm(derived, term, 4));
  } else if (hr != null && hr >= 100) {
    pushWeightedTerm(derived, 'tachycardia', 3);
  } else if (hr != null && hr < 60) {
    pushWeightedTerm(derived, 'bradycardia', 4);
  }

  const systolic = typeof vitalSigns.bpSystolic === 'number' ? vitalSigns.bpSystolic : null;
  if (systolic != null && systolic < 90) {
    ['shock', 'hypotension', 'sepsis', 'anaphylaxis'].forEach(term => pushWeightedTerm(derived, term, 3));
  } else if (systolic != null && systolic >= 160) {
    ['stroke', 'eclampsia', 'hypertension'].forEach(term => pushWeightedTerm(derived, term, 3));
  }

  const spo2 = typeof vitalSigns.spo2 === 'number' ? vitalSigns.spo2 : null;
  if (spo2 != null && spo2 < 94) {
    ['hypoxia', 'bronchospasm', 'pulmonary edema', 'cpap', 'bipap', 'airway'].forEach(term => pushWeightedTerm(derived, term, 2));
  }

  const rr = typeof vitalSigns.rr === 'number' ? vitalSigns.rr : null;
  if (rr != null && rr >= 30) {
    ['respiratory distress', 'bronchospasm', 'cpap', 'bipap'].forEach(term => pushWeightedTerm(derived, term, 2));
  } else if (rr != null && rr <= 8) {
    ['airway', 'sai', 'coma', 'od'].forEach(term => pushWeightedTerm(derived, term, 2));
  }

  const bgl = typeof vitalSigns.bgl === 'number' ? vitalSigns.bgl : null;
  const bglText = normalizeText(vitalSigns.bgl);
  if ((bgl != null && bgl < 70) || bglText.includes('low') || bglText.includes('critical')) {
    ['hypoglycemia', 'insulin od'].forEach(term => pushWeightedTerm(derived, term, 4));
  } else if ((bgl != null && bgl > 250) || bglText.includes('high')) {
    ['hyperglycemia', 'dka', 'hhs'].forEach(term => pushWeightedTerm(derived, term, 4));
  }

  const lungSounds = normalizeText(vitalSigns.lungSounds);
  if (lungSounds.includes('wheeze')) {
    ['bronchospasm', 'anaphylaxis', 'cpap', 'bipap'].forEach(term => pushWeightedTerm(derived, term, 3));
  }
  if (lungSounds.includes('stridor')) {
    ['airway', 'pediatric airway', 'tracheostomy'].forEach(term => pushWeightedTerm(derived, term, 3));
  }
  if (lungSounds.includes('crackle') || lungSounds.includes('rales')) {
    ['pulmonary edema', 'cpap', 'bipap'].forEach(term => pushWeightedTerm(derived, term, 3));
  }

  const gcs = typeof vitalSigns.gcs === 'number' ? vitalSigns.gcs : null;
  if (gcs != null && gcs <= 8) {
    ['coma', 'sai', 'airway', 'seizure', 'stroke'].forEach(term => pushWeightedTerm(derived, term, 3));
  }

  const pupils = normalizeText(vitalSigns.eyes);
  if (pupils.includes('pinpoint')) {
    ['od', 'opioid', 'sludgem'].forEach(term => pushWeightedTerm(derived, term, 3));
  }

  return derived;
}

function buildPatientContext(patientData = {}, pediatricAgeThreshold = 18) {
  const terms = [];
  pushWeightedTerms(terms, patientData.pmh, 3);
  pushWeightedTerms(terms, patientData.currentMedications, 4);
  pushWeightedTerms(terms, patientData.medicationClasses, 3);
  pushWeightedTerms(terms, patientData.allergies, 2);
  pushWeightedTerms(terms, patientData.indications, 6);
  pushWeightedTerms(terms, patientData.symptoms, 3);
  pushWeightedTerm(terms, patientData.ekg, 5);
  pushWeightedTerm(terms, patientData.ekgSecondary, 3);
  terms.push(...deriveVitalTerms(patientData.vitalSigns));
  if (typeof patientData.weight === 'number') {
    ['dosage', 'calculator', 'medication'].forEach(term => pushWeightedTerm(terms, term, 1));
  }
  if (typeof patientData.heightIn === 'number') {
    ['tidal volume', 'quick vent', 'ventilator', 'ibw'].forEach(term => pushWeightedTerm(terms, term, 2));
  }

  const age = typeof patientData.age === 'number' ? patientData.age : null;
  const ageGroup = age == null
    ? null
    : (age < pediatricAgeThreshold ? 'minor' : 'adult');
  const gender = normalizeText(patientData.gender);

  return {
    terms,
    hasAny: Boolean(
      terms.length ||
      age != null ||
      gender
    ),
    age,
    ageGroup,
    gender
  };
}

function computePatientScore(item, text, context) {
  let score = 0;
  const isMinorFocused = MINOR_FOCUS_PATTERN.test(text);
  const isAdultFocused = ADULT_FOCUS_PATTERN.test(text);

  if (context.ageGroup === 'minor') {
    if (isMinorFocused) score += 10;
    if (item.path?.includes('Pediatric Protocols')) score += 8;
  } else if (context.ageGroup === 'adult') {
    if (isAdultFocused) score += 6;
    if (item.path?.includes('Adult Protocols')) score += 4;
  }

  if (context.gender === 'female' && FEMALE_FOCUS_PATTERN.test(text)) {
    score += 4;
  }

  context.terms.forEach(term => {
    if (textMatches(text, term.value)) {
      score += term.weight;
    }
  });

  if (context.gender === 'female' && item.path?.includes('Adult Protocols') && OB_GYN_PATTERN.test(text)) {
    score += 2;
  }

  return score;
}

function buildPresentationState(itemId, info, activePathIds, hasContextSignal) {
  const activeIndex = activePathIds.indexOf(itemId);
  const isInActivePath = activeIndex !== -1;
  const activeDistance = isInActivePath ? (activePathIds.length - 1) - activeIndex : null;
  const isFocus = activeDistance === 0;
  const selfRelevant = info.relevantSelfScore > 0;
  const strongRelevant = info.relevantSelfScore >= 6;
  const searchSignal = info.searchSelf || info.searchAny;
  const relevanceSignal = strongRelevant || info.relevantAny;

  let scale = 1;
  let opacity = 1;
  let tier = 'default';

  if (isFocus) {
    scale = 1.28;
    opacity = 1;
    tier = 'focus';
  } else if (isInActivePath) {
    scale = Math.max(1.02, 1.18 - (activeDistance * 0.1));
    opacity = 0.98;
    tier = 'active';
  } else if (info.searchSelf || strongRelevant) {
    scale = 1.08;
    opacity = 0.95;
    tier = 'match';
  } else if (searchSignal || relevanceSignal) {
    scale = 0.98;
    opacity = 0.84;
    tier = 'branch';
  } else if (hasContextSignal) {
    scale = info.ageMismatch ? 0.8 : 0.86;
    opacity = info.ageMismatch ? 0.42 : 0.55;
    tier = 'muted';
  }

  return {
    scale,
    opacity,
    tier,
    isInActivePath,
    isFocus,
    isSearchHit: info.searchSelf,
    isSearchBranch: info.searchAny,
    isRelevant: selfRelevant,
    isRelevantBranch: info.relevantAny,
    isAgeMismatch: info.ageMismatch
  };
}

export function getSpiderwebNodeState(context, itemId) {
  return context?.presentationById?.get(itemId) || null;
}

export function buildSpiderwebContext(categories, options = {}) {
  const {
    patientData = {},
    searchTerm = '',
    activeCategoryPath = [],
    activeTopicId = null,
    pediatricAgeThreshold = 18
  } = options;

  const normalizedSearch = normalizeText(searchTerm);
  const hasSearch = Boolean(normalizedSearch);
  const activePathIds = Array.isArray(activeCategoryPath) ? [...activeCategoryPath] : [];
  if (activeTopicId) activePathIds.push(activeTopicId);
  const patientContext = buildPatientContext(patientData, pediatricAgeThreshold);
  const itemStateById = new Map();
  const presentationById = new Map();
  const autoExpandedIds = new Set();

  function visit(item) {
    const sourceItem = resolveItem(item);
    const searchText = buildSearchText(sourceItem);
    const text = buildItemText(sourceItem);
    const searchSelf = hasSearch ? textMatches(searchText, normalizedSearch) : false;
    const relevantSelfScore = patientContext.hasAny ? computePatientScore(sourceItem, text, patientContext) : 0;
    const isMinorFocused = MINOR_FOCUS_PATTERN.test(text);
    const isAdultFocused = ADULT_FOCUS_PATTERN.test(text);
    let searchAny = searchSelf;
    let relevantAny = relevantSelfScore > 0;
    let maxScore = relevantSelfScore;

    if (Array.isArray(item.children) && item.children.length) {
      item.children.forEach(child => {
        const childState = visit(child);
        if (childState.searchAny) searchAny = true;
        if (childState.relevantAny) relevantAny = true;
        if (childState.maxScore > maxScore) maxScore = childState.maxScore;
      });
    }

    const ageMismatch = patientContext.ageGroup === 'minor'
      ? Boolean(isAdultFocused && !isMinorFocused)
      : patientContext.ageGroup === 'adult'
        ? Boolean(isMinorFocused && !isAdultFocused)
        : false;

    const info = {
      searchSelf,
      searchAny,
      relevantSelfScore,
      relevantAny,
      maxScore,
      isMinorFocused,
      isAdultFocused,
      ageMismatch
    };

    itemStateById.set(item.id, info);

    if (item.type === 'category' && hasSearch && searchAny) {
      autoExpandedIds.add(item.id);
    }

    return info;
  }

  (categories || []).forEach(visit);

  const hasPatientSignal = Array.from(itemStateById.values()).some(info => info.relevantAny);
  const hasContextSignal = Boolean(hasSearch || hasPatientSignal || activePathIds.length);

  itemStateById.forEach((info, itemId) => {
    presentationById.set(itemId, buildPresentationState(itemId, info, activePathIds, hasContextSignal));
  });

  return {
    searchTerm: normalizedSearch,
    hasSearch,
    hasPatientSignal,
    hasContextSignal,
    activePathIds,
    autoExpandedIds,
    itemStateById,
    presentationById
  };
}
