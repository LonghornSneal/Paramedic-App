// Features/patient/Autocomplete.js - Autocomplete suggestions for Patient Info fields
import { addTapListener } from '../../Utils/addTapListener.js';
import { splitSegments, getSuggestionValues, getCanonicalValue, getDisplayLabel } from './patientTerminology.js';

export function setupAutocomplete(textareaId, suggestionsContainerId, suggestionSourceSet, fieldKey) {
  const textarea = document.getElementById(textareaId);
  const suggestionsContainer = document.getElementById(suggestionsContainerId);
  if (!textarea || !suggestionsContainer) return;

  const normalizedField = (fieldKey || '').toLowerCase();
  const baseValues = suggestionSourceSet ? Array.from(suggestionSourceSet) : [];

  const renderSuggestions = () => {
    const { committed, current } = splitSegments(textarea.value);
    const currentLower = current.toLowerCase();
    if (currentLower.length === 0) {
      suggestionsContainer.classList.add('hidden');
      suggestionsContainer.innerHTML = '';
      return;
    }
    const committedCanonical = new Set(
      committed.map(value => getCanonicalValue(normalizedField, value).toLowerCase())
    );
    const options = getSuggestionValues(normalizedField, baseValues);
    const rows = [];
    const seenCanonicals = new Set();
    options.forEach(option => {
      const optionLower = option.toLowerCase();
      if (!optionLower.includes(currentLower)) return;
      const canonical = getCanonicalValue(normalizedField, option);
      const canonicalLower = canonical.toLowerCase();
      if (committedCanonical.has(canonicalLower)) return;
      if (seenCanonicals.has(canonicalLower)) return;
      const display = getDisplayLabel(normalizedField, option);
      rows.push({ canonical, display });
      seenCanonicals.add(canonicalLower);
    });
    if (rows.length === 0) {
      suggestionsContainer.classList.add('hidden');
      suggestionsContainer.innerHTML = '';
      return;
    }
    suggestionsContainer.innerHTML = rows.map(entry => (
      `<div class="autocomplete-suggestion-item" data-canonical="${entry.canonical}" data-display="${entry.display}">${entry.display}</div>`
    )).join('');
    suggestionsContainer.classList.remove('hidden');
  };

  textarea.addEventListener('input', renderSuggestions);

  addTapListener(suggestionsContainer, e => {
    const item = e.target.closest('.autocomplete-suggestion-item');
    if (!item) return;
    const { committed } = splitSegments(textarea.value);
    const nextValues = committed.slice();
    const displayValue = item.dataset.display || item.dataset.canonical || '';
    if (displayValue) {
      nextValues.push(displayValue);
    }
    textarea.value = nextValues.join(', ') + (nextValues.length ? ', ' : '');
    suggestionsContainer.classList.add('hidden');
    suggestionsContainer.innerHTML = '';
    textarea.focus();
    textarea.dispatchEvent(new Event('input'));
  });

  textarea.addEventListener('blur', () => {
    setTimeout(() => { suggestionsContainer.classList.add('hidden'); }, 150);
  });

  textarea.addEventListener('focus', renderSuggestions);
}

export function setupSingleValueAutocomplete(inputId, suggestionsContainerId, suggestionSourceSet) {
  const input = document.getElementById(inputId);
  const suggestionsContainer = document.getElementById(suggestionsContainerId);
  if (!input || !suggestionsContainer) return;

  const baseValues = suggestionSourceSet ? Array.from(suggestionSourceSet) : [];

  const renderSuggestions = () => {
    const current = (input.value || '').trim().toLowerCase();
    if (!current) {
      suggestionsContainer.classList.add('hidden');
      suggestionsContainer.innerHTML = '';
      return;
    }
    const rows = baseValues.filter(option => option.toLowerCase().includes(current));
    if (!rows.length) {
      suggestionsContainer.classList.add('hidden');
      suggestionsContainer.innerHTML = '';
      return;
    }
    suggestionsContainer.innerHTML = rows.map(option => (
      `<div class="autocomplete-suggestion-item" data-value="${option}">${option}</div>`
    )).join('');
    suggestionsContainer.classList.remove('hidden');
  };

  input.addEventListener('input', renderSuggestions);

  addTapListener(suggestionsContainer, e => {
    const item = e.target.closest('.autocomplete-suggestion-item');
    if (!item) return;
    const value = item.dataset.value || '';
    input.value = value;
    suggestionsContainer.classList.add('hidden');
    suggestionsContainer.innerHTML = '';
    input.focus();
    input.dispatchEvent(new Event('input'));
  });

  input.addEventListener('blur', () => {
    setTimeout(() => { suggestionsContainer.classList.add('hidden'); }, 150);
  });

  input.addEventListener('focus', renderSuggestions);
}
