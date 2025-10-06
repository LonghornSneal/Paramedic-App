import { buildSynonymLookup } from '../../Data/patientInfoSynonyms.js';

const LEARNED_STORAGE_KEY = 'patientInfoLearned';

function safeParse(jsonText) {
  if (!jsonText) return {};
  try {
    const parsed = JSON.parse(jsonText);
    return (parsed && typeof parsed === 'object') ? parsed : {};
  } catch (_) {
    return {};
  }
}

function loadLearnedTerms() {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  return safeParse(window.localStorage.getItem(LEARNED_STORAGE_KEY));
}

function saveLearnedTerms(terms) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(LEARNED_STORAGE_KEY, JSON.stringify(terms));
  } catch (_) {
    /* ignore quota errors */
  }
}

const synonymLookup = buildSynonymLookup();
let learnedTermsCache = loadLearnedTerms();

export function refreshLearnedTermsCache() {
  learnedTermsCache = loadLearnedTerms();
}

export function registerLearnedTerm(field, value) {
  if (!value) return;
  const normalizedField = field.toLowerCase();
  learnedTermsCache[normalizedField] = learnedTermsCache[normalizedField] || [];
  const lowerValue = value.toLowerCase();
  if (!learnedTermsCache[normalizedField].includes(lowerValue)) {
    learnedTermsCache[normalizedField].push(lowerValue);
    saveLearnedTerms(learnedTermsCache);
  }
}

export function getCanonicalEntry(field, value) {
  if (!value) return null;
  const lowerValue = value.toLowerCase();
  const lookup = synonymLookup[field];
  if (lookup) {
    const match = lookup.get(lowerValue);
    if (match) return match;
  }
  return null;
}

export function getDisplayLabel(field, value) {
  const entry = getCanonicalEntry(field, value);
  if (!entry) return value;
  return entry.display || entry.canonical;
}

export function getCanonicalValue(field, value) {
  const entry = getCanonicalEntry(field, value);
  if (!entry) return value;
  return entry.canonical;
}

export function getSuggestionValues(field, baseValues = []) {
  const lookup = synonymLookup[field] || new Map();
  const suggestions = new Set();
  baseValues.forEach(val => suggestions.add(val));
  lookup.forEach(entry => {
    suggestions.add(entry.canonical);
    entry.synonyms.forEach(term => suggestions.add(term));
  });
  const learned = learnedTermsCache[field] || [];
  learned.forEach(term => suggestions.add(term));
  return Array.from(suggestions);
}

export function splitSegments(rawValue) {
  const value = rawValue || '';
  const segments = value.split(',').map(segment => segment.trim());
  if (segments.length === 0) {
    return { committed: [], current: '' };
  }
  if (value.trim().endsWith(',')) {
    return { committed: segments.filter(Boolean), current: '' };
  }
  const current = segments.pop() || '';
  return { committed: segments.filter(Boolean), current };
}

export function normalizeCommittedValues(field, rawValues, options = {}) {
  const opts = options || {};
  const register = opts.register !== false;
  const canonical = [];
  const display = [];
  const original = [];
  rawValues.forEach(value => {
    if (!value) return;
    const entry = getCanonicalEntry(field, value);
    if (entry) {
      canonical.push(entry.canonical);
      display.push(entry.display || entry.canonical);
    } else {
      const trimmed = value.trim();
      if (!trimmed) return;
      if (register) registerLearnedTerm(field, trimmed);
      canonical.push(trimmed);
      display.push(trimmed);
    }
    original.push(value);
  });
  return { canonical, display, original };
}
