// Features/patient/Autocomplete.js – Autocomplete suggestion handling for Patient Info fields

// Enables autocomplete suggestions for a textarea input field.
function setupAutocomplete(textareaId, suggestionsContainerId, suggestionSourceSet) {
    const textarea = document.getElementById(textareaId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);
    textarea.addEventListener('input', function(e) { 
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
    // Handle clicks on suggestion items:
    addTapListener(suggestionsContainer, function(e) {
        if (e.target.classList.contains('autocomplete-suggestion-item')) { 
            const selectedValue = e.target.dataset.value;
            // Parse existing comma-separated values and remove the current incomplete segment
            let existingValues = textarea.value.split(',').map(v => v.trim()).filter(v => v);
            if (existingValues.length > 0 && textarea.value.trim().slice(-1) !== ',') { 
                existingValues.pop(); 
            }
            // Avoid duplicates (case-insensitive)
            if (!existingValues.map(v => v.toLowerCase()).includes(selectedValue.toLowerCase())) {
                existingValues.push(selectedValue); 
            }
            textarea.value = existingValues.join(', ') + (existingValues.length > 0 ? ", " : "");
            // Hide suggestions and refocus the textarea
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = '';
            textarea.focus();
            updatePatientData();  // Update patient data after selection
        }
    });
    // Hide suggestions on blur (with slight delay to allow click)
    textarea.addEventListener('blur', function() {
        setTimeout(() => { suggestionsContainer.classList.add('hidden'); }, 150); 
    });
    // Show suggestions again on focus if input contains a segment
    textarea.addEventListener('focus', function(e) { 
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
