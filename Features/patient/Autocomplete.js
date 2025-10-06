// Features/patient/Autocomplete.js – Autocomplete suggestions for Patient Info fields
import { addTapListener } from '../../Utils/addTapListener.js';
import { patientData } from './PatientInfo.js';  // to call updatePatientData if needed (we might call it via window for simplicity)

export function setupAutocomplete(textareaId, suggestionsContainerId, suggestionSourceSet) {
    const textarea = document.getElementById(textareaId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);
    if (!textarea || !suggestionsContainer) return;
    const getSegments = rawValue => {
        const segments = rawValue.split(',').map(segment => segment.trim());
        if (segments.length === 0) {
            return { committed: [], current: '' };
        }
        if (rawValue.trim().endsWith(',')) {
            return { committed: segments.filter(Boolean), current: '' };
        }
        const current = segments.pop() ?? '';
        return { committed: segments.filter(Boolean), current };
    };
    const renderSuggestions = () => {
        const { committed, current } = getSegments(textarea.value);
        const currentLower = current.toLowerCase();
        const committedLower = new Set(committed.map(value => value.toLowerCase()));
        if (currentLower.length === 0) {
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = '';
            return;
        }
        const filtered = Array.from(suggestionSourceSet)
            .filter(s => !committedLower.has(s.toLowerCase()))
            .filter(s => s.toLowerCase().includes(currentLower));
        if (filtered.length > 0) {
            suggestionsContainer.innerHTML = filtered.map(s =>
                `<div class="autocomplete-suggestion-item" data-value="${s}">${s}</div>`
            ).join('');
            suggestionsContainer.classList.remove('hidden');
        } else {
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = '';
        }
    };
    textarea.addEventListener('input', () => {
        renderSuggestions();
    });
    addTapListener(suggestionsContainer, e => {
        if (e.target.classList.contains('autocomplete-suggestion-item')) {
            const selectedValue = e.target.dataset.value;
            const rawValue = textarea.value;
            const segments = rawValue.split(',').map(v => v.trim()).filter(Boolean);
            if (!rawValue.trim().endsWith(',')) {
                segments.pop();
            }
            if (!segments.map(v => v.toLowerCase()).includes(selectedValue.toLowerCase())) {
                segments.push(selectedValue);
            }
            textarea.value = segments.join(', ') + (segments.length > 0 ? ', ' : '');
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = '';
            textarea.focus();
            textarea.dispatchEvent(new Event('input'));
        }
    });
    textarea.addEventListener('blur', () => {
        setTimeout(() => { suggestionsContainer.classList.add('hidden'); }, 150);
    });
    textarea.addEventListener('focus', () => {
        renderSuggestions();
    });
}



