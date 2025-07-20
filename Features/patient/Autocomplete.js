// Features/patient/Autocomplete.js – Autocomplete suggestions for Patient Info fields
import { addTapListener } from '../../Utils/addTapListener.js';
import { patientData } from './PatientInfo.js';  // to call updatePatientData if needed (we might call it via window for simplicity)

export function setupAutocomplete(textareaId, suggestionsContainerId, suggestionSourceSet) {
    const textarea = document.getElementById(textareaId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);
    // If either element does not exist, return early. This prevents a runtime error when the
    // autocomplete is initialized before its corresponding inputs have been rendered.
    if (!textarea || !suggestionsContainer) return;
    textarea.addEventListener('input', e => {
        const inputText = e.target.value;
        const currentSegment = inputText.split(',').pop().trim().toLowerCase();
        if (currentSegment.length === 0) {
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = '';
            return;
        }
        const filtered = Array.from(suggestionSourceSet)
            .filter(s => s.toLowerCase().includes(currentSegment));
        if (filtered.length > 0) {
            suggestionsContainer.innerHTML = filtered.map(s =>
                `<div class="autocomplete-suggestion-item" data-value="${s}">${s}</div>`
            ).join('');
            suggestionsContainer.classList.remove('hidden');
        } else {
            suggestionsContainer.classList.add('hidden');
        }
    });
    // Click on suggestion to accept it
    addTapListener(suggestionsContainer, e => {
        if (e.target.classList.contains('autocomplete-suggestion-item')) {
            const selectedValue = e.target.dataset.value;
            // Build array from existing comma-separated list
            let existingValues = textarea.value.split(',').map(v => v.trim()).filter(v => v);
            if (existingValues.length > 0 && textarea.value.trim().slice(-1) !== ',') {
                // Remove the last incomplete entry if it's not followed by a comma
                existingValues.pop();
            }
            // Avoid duplicate entries (case-insensitive)
            if (!existingValues.map(v => v.toLowerCase()).includes(selectedValue.toLowerCase())) {
                existingValues.push(selectedValue);
            }
            textarea.value = existingValues.join(', ') + (existingValues.length > 0 ? ", " : "");
            // Hide suggestions and refocus
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = '';
            textarea.focus();
            // Trigger input event to update patient data
            textarea.dispatchEvent(new Event('input'));  // trigger the input event to update data
        }
    });
    // Hide suggestions on blur (with slight delay to allow click selection)
    textarea.addEventListener('blur', () => {
        setTimeout(() => { suggestionsContainer.classList.add('hidden'); }, 150);
    });
    // If focusing back in and there's a segment, show suggestions again
    textarea.addEventListener('focus', e => {
        const inputText = e.target.value;
        const currentSegment = inputText.split(',').pop().trim().toLowerCase();
        if (currentSegment.length > 0) {
            const filtered = Array.from(suggestionSourceSet)
                .filter(s => s.toLowerCase().includes(currentSegment));
            if (filtered.length > 0) {
                suggestionsContainer.innerHTML = filtered.map(s =>
                    `<div class="autocomplete-suggestion-item" data-value="${s}">${s}</div>`
                ).join('');
                suggestionsContainer.classList.remove('hidden');
            }
        }
    });
}
