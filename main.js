// --- Global Variables ---
let searchInput, patientSidebar, contentArea, openSidebarButton, closeSidebarButton, sidebarOverlay, navBackButton, navForwardButton;
let medicationDataMap = {};
let allDisplayableTopicsMap = {};
let paramedicCategories = []; // This must be a global var!

// Assigns key UI elements to global variables for easy access.
function assignDomElements() {
    searchInput = document.getElementById('searchInput');
    contentArea = document.getElementById('content-area');
    patientSidebar = document.getElementById('patient-sidebar');
    openSidebarButton = document.getElementById('open-sidebar-button');
    closeSidebarButton = document.getElementById('close-sidebar-button');
    sidebarOverlay = document.getElementById('sidebar-overlay');
    navBackButton = document.getElementById('nav-back-button');
    navForwardButton = document.getElementById('nav-forward-button');
}

// Kick off the application once DOM is ready
if (document.readyState === 'loading') { 
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp(); 
}

// Initializes the application, setting up UI event handlers and loading data.
function initApp() {
    // Initialize header elements (they are already defined in index.html)
    assignDomElements();
    // Ensure overlay starts hidden
    if (sidebarOverlay) {
        sidebarOverlay.classList.add('hidden');
        sidebarOverlay.classList.remove('active');
    }
    // Sidebar toggle handlers
    if (openSidebarButton) {
        addTapListener(openSidebarButton, () => {
            patientSidebar.classList.remove('hidden');
            patientSidebar.classList.add('open');
            sidebarOverlay.classList.add('active');
            sidebarOverlay.classList.remove('hidden');
        });
    }
    if (closeSidebarButton) {
        addTapListener(closeSidebarButton, () => {
            patientSidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
            sidebarOverlay.classList.add('hidden');
        });
    }
    if (sidebarOverlay) {
        addTapListener(sidebarOverlay, () => {
            patientSidebar.classList.remove('open');
            // Wait for slide-out transition (0.3s) to complete, then hide the sidebar
            setTimeout(() => patientSidebar.classList.add('hidden'), 300);
            sidebarOverlay.classList.remove('active');
            sidebarOverlay.classList.add('hidden');
        });
    }

    attachSearchHandlers();  // Calls the function from Features/search/Search.js
    attachNavHandlers();

    // Now initialize data structures from globals   // These should be loaded BEFORE this script runs (by script order in index.html)
    if (window.ParamedicCategoriesData && window.MedicationDetailsData) {
        initializeData(window.ParamedicCategoriesData, window.MedicationDetailsData);
    } else {
        // Defensive: Wait until both globals are present
        setTimeout(() => { 
            if (window.ParamedicCategoriesData && window.MedicationDetailsData) {
                initializeData(window.ParamedicCategoriesData, window.MedicationDetailsData);
            } else { 
                console.error("Category or medication data not loaded!"); 
            }
        }, 200); 
    }      // /fallback: try again after short delay
    // Initialize autocomplete for Patient Info fields
    setupAutocomplete('pt-pmh','pt-pmh-suggestions', pmhSuggestions);
    setupAutocomplete('pt-allergies','pt-allergies-suggestions', allergySuggestions);
    setupAutocomplete('pt-medications','pt-medications-suggestions', medicationNameSuggestions);
    setupAutocomplete('pt-indications','pt-indications-suggestions', indicationSuggestions);
    setupAutocomplete('pt-symptoms','pt-symptoms-suggestions', symptomSuggestions);

    // Add focus highlight to all textareas and inputs
    document.querySelectorAll('textarea, input').forEach(el => {
        el.addEventListener('focus', () => el.classList.add('ring', 'ring-blue-300'));
        el.addEventListener('blur', () => el.classList.remove('ring', 'ring-blue-300')); 
    });
    // Finally, render the initial category list view
    renderInitialView(true); 
}

// Initializes global data structures for categories and medications.
function initializeData(categoriesData, medDetailsData) { 
    paramedicCategories = categoriesData;    // /Assign the global category array
    // Wipe/prepare lookup maps
    allDisplayableTopicsMap = {};
//    /allSearchableTopics = []; //maybe need still maybe not

    // Build med details map for quick lookups
    medicationDataMap = {};
    if (Array.isArray(medDetailsData)) { 
        medDetailsData.forEach(med => { 
            medicationDataMap[med.id] = med; 
        });
    } else if (medDetailsData && typeof medDetailsData === 'object') { 
        Object.assign(medicationDataMap, medDetailsData); 
    }
    categoriesData.forEach(cat => processItem(cat)); 
    // Load common suggestion terms into suggestion sets
    const commonPmh = ["hypertension","htn","diabetes","dm","asthma","copd","heart failure","hf","cad","stroke","cva","seizure disorder","renal insufficiency","ckd","hypothyroidism","hyperthyroidism","glaucoma","peptic ulcer","anxiety","depression"];
    const commonAllergies = ["penicillin","sulfa","aspirin","nsaids","morphine", "codeine","iodine","shellfish","latex","peanuts","tree nuts"];
    const commonMedNames  = ["lisinopril","metformin","atorvastatin","amlodipine","hydrochlorothiazide","hctz","simvastatin","albuterol","levothyroxine","gabapentin","omeprazole","losartan","sertraline","furosemide","lasix","insulin","warfarin","coumadin","aspirin","clopidogrel","plavix"];
    // Add these common terms to the suggestion sets (defined in PatientInfo.js)
    commonPmh.forEach(term => pmhSuggestions.add(term));
    commonAllergies.forEach(term => allergySuggestions.add(term));
    commonMedNames.forEach(term => medicationNameSuggestions.add(term));
    PDE5_INHIBITORS.forEach(term => medicationNameSuggestions.add(term));
    // Extract additional allergy keywords from medication contraindications
    Object.values(medicationDataMap).forEach(med => {
        if (med.contraindications && Array.isArray(med.contraindications)) {
            med.contraindications.forEach(ci => { 
                const ciLower = ci.toLowerCase();
                if (ciLower.includes("hypersensitivity") || ciLower.includes("allergy to")) {    // Derive a generalized allergen term from text
                    let allergen = ciLower.replace("known hypersensitivity to", "")
                                          .replace("allergy to any nsaid (including asa)", "nsaid allergy")
                                          .replace("allergy to", "").trim();
                    if (allergen.includes("local anesthetic allergy in the amide class")) { 
                        allergen = "amide anesthetic allergy";
                    } else if (allergen.includes("nsaid (including asa)")) {
                        allergen = "nsaid allergy";
                    } else { 
                        allergen = allergen.split('(')[0].trim(); 
                    }
                    if (allergen && allergen.length > 2 && allergen.length < 30) { 
                        allergySuggestions.add(allergen); 
                    } 
                }
            }); 
        }
    });
}

// Renders the main category list view (home screen) and highlights a topic if provided.
function renderInitialView(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    contentArea.innerHTML = '';  // Clear

    // Render the hierarchical list of categories
    const listContainer = document.createElement('div');
    createHierarchicalList(paramedicCategories, listContainer, 0);
    contentArea.appendChild(listContainer);

    // Optionally expand/highlight
    openCategoriesAndHighlight(categoryPath, highlightId);
    if (shouldAddHistory) {
        addHistoryEntry({ 
            viewType: 'list', 
            contentId: '', 
            highlightTopicId: highlightId, 
            categoryPath 
        });
    }
    updateNavButtonsState();
}


// Expands categories along the given path and highlights the specified topic (then re-renders the list).
// Note: We also ensure contentArea is defined locally. The category list items still need a way to be identified by category ID if we ever wanted to manipulate them directly, so as an additional improvement, we can modify createHierarchicalList to set a data-category-id attribute on category rows: // Inside createHierarchicalList, in the category branch: row.dataset.categoryId = item.id;
function openCategoriesAndHighlight(categoryPath = [], highlightId = null) { 
    // Mark each category in the path as expanded
    categoryPath.forEach(catId => { 
        const catItem = allDisplayableTopicsMap[catId];
        if (catItem) catItem.expanded = true; 
    });
    // Re-render the category list with updated expansion states
    contentArea.innerHTML = ''; 
    const listContainer = document.createElement('div');
    createHierarchicalList(paramedicCategories, listContainer, 0);
    contentArea.appendChild(listContainer);
    // Highlight the specified topic, if provided
    if (highlightId) { 
        const topicEl = contentArea.querySelector(`[data-topic-id="${highlightId}"]`);
        if (topicEl) topicEl.classList.add('recently-viewed'); 
    } 
}

// Escapes special HTML characters in a string (e.g. `&`, `<`, `>`, quotes).
function escapeHTML(str) {
    const escapeMap = { 
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' 
    };
    return str.replace(/[&<>"']/g, char => escapeMap[char] || char); 
}


// Builds a nested list of categories/topics and appends it to the given container (handles expandable categories).
function createHierarchicalList(items, container, level = 0) {
    container.innerHTML = '';
    items.forEach(item => { 
        const row = document.createElement('div');
        row.className = 'flex items-center py-1 pl-' + (level * 4) + ' group';
        if (item.type === 'category') {     // Collapsible blue arrow
            const arrow = document.createElement('button');
            arrow.setAttribute('aria-label', 'Expand/collapse');
            arrow.className = 'arrow mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400';
            arrow.innerHTML = `<svg class="h-4 w-4 text-blue-600 transition-transform duration-200" style="transform: rotate(${item.expanded ? 90 : 0}deg);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>`;
            addTapListener(arrow, () => { 
                item.expanded = !item.expanded;
                createHierarchicalList(items, container, level); 
            });
            row.appendChild(arrow);
            // Category label
            const label = document.createElement('span');
            label.className = 'cursor-pointer hover:underline flex-1 font-semibold';
            label.textContent = item.title;
            addTapListener(label, () => { 
                item.expanded = !item.expanded;
                createHierarchicalList(items, container, level); 
            });
            row.appendChild(label);
            container.appendChild(row);
            if (item.expanded && item.children && item.children.length > 0) { 
                const childContainer = document.createElement('div');
                childContainer.className = 'ml-4 border-l border-blue-100 pl-2';
                createHierarchicalList(item.children, childContainer, level + 1);
                container.appendChild(childContainer); 
            }
        } else if (item.type === 'topic') { 
            const topicLink = document.createElement('a');
            topicLink.className = 'topic-link-item flex-1';
            topicLink.textContent = item.title;
            topicLink.href = `#${item.id}`;
            topicLink.dataset.topicId = item.id;
            topicLink.setAttribute('role', 'button');
            topicLink.setAttribute('tabindex', '0');
            addTapListener(topicLink, e => { 
                e.preventDefault();
                renderDetailPage(item.id); 
            });
            row.appendChild(document.createElement('span')); // spacer for arrow alignment
            row.appendChild(topicLink);
            container.appendChild(row); 
        }
    });
}

// Renders the detailed view for a given topic (with all detail sections and warnings), and updates history if needed. 
// Collapsible sections for details (ALS Medications)
function renderDetailPage(topicId, shouldAddHistory = true, scrollToTop = true) {
    if (!allDisplayableTopicsMap[topicId]) { 
        contentArea.innerHTML = `<div class="text-gray-500 italic">Not found.</div>`; 
        return; 
    }
    const topic = allDisplayableTopicsMap[topicId];
    contentArea.innerHTML = '';
    const headerEl = document.createElement('h2'); // Header/title
    headerEl.textContent = topic.title || topic.name || topic.id;
    headerEl.className = 'topic-h2 font-semibold text-lg mb-4';
    headerEl.dataset.topicId = topic.id; 
    contentArea.appendChild(headerEl); 
    // Insert warning alerts (if any) at the top of the detail page
    const warningsHtml = appendTopicWarnings(topic);
    if (warningsHtml) {
        contentArea.insertAdjacentHTML('beforeend', warningsHtml);
    }
    appendTopicDetails(topic);

   
    attachToggleInfoHandlers(contentArea);   // Attach click handlers for any toggleable info sections (if present)
    // Attach handlers to enable collapsing/expanding of the new detail sections (blue arrow rotation and content toggle).
    attachToggleCategoryHandlers(contentArea);

    
    // Description & History block: append topic description if present, update history state, and scroll to top if requested
    if (topic.description) { 
        const desc = document.createElement('div');    // If a topic description exists and no slug anchors were added, show the description
        desc.className = 'mb-4'; 
        desc.textContent = topic.description; 
        contentArea.appendChild(desc); 
    }
    if (shouldAddHistory) {
        addHistoryEntry({ 
            viewType: 'detail', contentId: topicId 
        }); 
    }
    if (scrollToTop) { 
        contentArea.scrollIntoView({ 
            behavior: 'auto', block: 'start' 
        }); 
    }
    
}

function findAlsMedTopicIndex(children, topicId) {
    let idx = children.findIndex(child => child.id === topicId);
    if (idx !== -1) return idx;
    if (/^\d+-/.test(topicId)) {
        const altId = topicId.replace(/^\d+-/, '');
        idx = children.findIndex(child => child.id === altId);
        if (idx !== -1) return idx;
    }
    const altId = Object.keys(allDisplayableTopicsMap).find(k => k.endsWith(topicId));
    if (altId) {
        idx = children.findIndex(child => child.id === altId);
        if (idx !== -1) return idx;
    }
    return -1;
}

// Attaches click handlers to elements with class `.toggle-info` to show or hide their hidden info text.
function attachToggleInfoHandlers(container) {
    container.querySelectorAll('.toggle-info').forEach(el => { 
        el.onclick = function(e) { 
            e.stopPropagation();
            const info = el.querySelector('.info-text');
            const arrow = el.querySelector('.arrow'); 
            if (arrow) arrow.classList.toggle('rotate');
            if (info) info.classList.toggle('hidden'); 
        }; 
    }); 
}

// Attaches click handlers to collapsible category headers in the detail view to toggle their visibility.
function attachToggleCategoryHandlers(container) {      
    container.querySelectorAll('.toggle-category').forEach(header => {
        addTapListener(header, () => {
            const arrow = header.querySelector('.arrow');
            if (arrow) arrow.classList.toggle('rotate');
            const content = header.nextElementSibling;
            if (content) content.classList.toggle('hidden'); 
        }); 
    }); 
}

// Converts special markup in a text (e.g. `**bold**`, `[[display|info]]`) into formatted HTML.
function parseTextMarkup(text) {   // Escape HTML and replace special markup with styled spans
    let safeText = text.replace(/&/g, "&amp;")
                       .replace(/</g, "&lt;")
                       .replace(/>/g, "&gt;");
    safeText = safeText.replace(/\n/g, "<br>");
    // AFTER: includes an arrow span with icon SVG before the display text
    safeText = safeText.replace(/\[\[(.+?)\|(.+?)\]\]/g,
        (_, display, info) => `<span class="toggle-info"><span class="arrow"></span>${display}<span class="info-text hidden">${info}</span></span>`);
    safeText = safeText.replace(/\{\{red:(.+?)\}\}/g, 
                (_, t) => `<span class="text-red-600 font-semibold">${t}</span>`);
    safeText = safeText.replace(/\{\{redul:(.+?)\}\}/g, 
                (_, t) => `<span class="text-red-600 font-semibold underline decoration-red-600">${t}</span>`);
    safeText = safeText.replace(/\{\{orange:(.+?)\}\}/g, 
                (_, t) => `<span class="text-orange-600">${t}</span>`);
    safeText = safeText.replace(/\{\{blackul:(.+?)\}\}/g, 
                (_, t) => `<span class="font-bold underline decoration-black">${t}</span>`);
    safeText = safeText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return safeText; 
}


function appendTopicDetails(topic) {
//** Details block: retrieve topic details (including alternate ID fallback) and render each detail section or show a placeholder if none
        let details = topic.details;
        if (!details && topic.id?.match(/^\d+-/)) {
            const altId = topic.id.replace(/^\d+-/, '');
            details = allDisplayableTopicsMap[altId]?.details;
        } else if (!details && topic.id && !topic.id.match(/^\d+-/)) {
            const altId = Object.keys(allDisplayableTopicsMap).find(k => k.endsWith(topic.id));
            if (altId) details = allDisplayableTopicsMap[altId]?.details;
        }
        // Render details sections if available
        if (details) {
            const sections = [ 
                { key: 'class', label: 'Class' },
                { key: 'indications', label: 'Indications' },
                { key: 'contraindications', label: 'Contraindications' },
                { key: 'precautions', label: 'Precautions' },
                { key: 'sideEffects', label: 'Significant Adverse/Side Effects' },
                { key: 'adultRx', label: 'Adult Rx' },
                { key: 'pediatricRx', label: 'Pediatric Rx' } 
            ]; 
            sections.forEach(sec => { 
                if (!details[sec.key]) return; 
                const wrapper = document.createElement('div');
                wrapper.className = 'detail-section mb-3';
                if (sec.key === 'adultRx') wrapper.classList.add('adult-section');
                if (sec.key === 'pediatricRx') wrapper.classList.add('pediatric-section');
                const title = document.createElement('div');
                // Added 'toggle-category' class and pointer/flex styling to make section headers clickable for collapsing.
                title.className = 'detail-section-title toggle-category cursor-pointer flex items-center'; 
                // Inserted a blue arrow SVG icon and then the section label text (replacing the plain text title) to indicate collapsible section.
                title.innerHTML = `<svg class="arrow h-4 w-4 text-blue-600 transition-transform duration-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>${sec.label}`; 
                wrapper.appendChild(title);
                let body; 
                if (Array.isArray(details[sec.key])) {
                    body = document.createElement('ul'); 
                    body.className = 'detail-list';
                    details[sec.key].forEach(line => {
                        const li = document.createElement('li');
                        li.innerHTML = parseTextMarkup ? parseTextMarkup(line) : line;
                        body.appendChild(li);
                    });
                } else {
                    body = document.createElement('div');
                    body.className = 'detail-text';
                    // set innerHTML...
                    body.innerHTML = parseTextMarkup ? parseTextMarkup(details[sec.key]) : details[sec.key];
                }
                // Hide the section content by default; it will be revealed when the section header is clicked.
                body.classList.add('hidden'); 
                wrapper.appendChild(body);
                contentArea.appendChild(wrapper); 
            });  
        } else { 
            contentArea.insertAdjacentHTML('beforeend', `<div class="text-gray-500 italic">No detail information found for this item.</div>`);
        }
}


// Generates an HTML `<ul>` list for an array of detail items, or a placeholder if the array is empty.
function createDetailList(itemsArray) {
    if (!itemsArray || itemsArray.length === 0) {
        return '<p class="text-gray-500 italic">None listed.</p>'; 
    }
    const listItemsHtml = itemsArray.map(it => {
        return `<li>${parseTextMarkup(it)}</li>`;
    })
    .join('');
    return `<ul class="detail-list">${listItemsHtml}</ul>`; 
}

// Returns an HTML snippet for a detail text block, or a default "Not specified" message if empty.
function createDetailText(textBlock) {
    if (!textBlock || textBlock.toString().trim() === '') {
        return '<p class="text-gray-500 italic">Not specified.</p>'; 
    }
    const safeText = parseTextMarkup(textBlock.toString());
    return `<div class="detail-text">${
        safeText
    }</div>`; 
}
    

// Adds a universal click/keypress listener to an element to trigger the given handler.
function addTapListener(element, handler) { 
    if (!element) return;
    // Merged the activate logic into this function to ensure proper scope; both clicks and 'Enter/Space' keypresses will trigger the handler (fixes previously broken implementation).**
    const activate = (e) => { 
        if (e.type === 'click' || (e.type === 'keypress' && (e.key === 'Enter' || e.key === ' '))) {
            e.preventDefault();
            handler(e); 
        } 
    };
    element.addEventListener('click', activate);
    element.addEventListener('keypress', activate); 
}

// Enables autocomplete suggestions for a textarea input field.
function setupAutocomplete(textareaId, suggestionsContainerId, suggestionSourceSet) {
    const textarea = document.getElementById(textareaId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);
    textarea.addEventListener('input', function(e) { 
        const inputText = e.target.value;
        const currentSegment = inputText.split(',').pop().trim().toLowerCase();
        if (currentSegment.length === 0) { 
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = ''; return; 
        }
        const filtered = Array.from(suggestionSourceSet)
        .filter(function(s) { return s.toLowerCase().includes(currentSegment); });
        if (filtered.length > 0) { 
            suggestionsContainer.innerHTML = filtered.map(function(s) {
                return '<div class="autocomplete-suggestion-item" data-value="' + s + '">' + s + '</div>';
            })
            .join(''); 
            suggestionsContainer.classList.remove('hidden');
        } else { 
            suggestionsContainer.classList.add('hidden'); 
        }
   });
    addTapListener(suggestionsContainer, function(e) {
        if (e.target.classList.contains('autocomplete-suggestion-item')) { 
            const selectedValue = e.target.dataset.value;
            let existingValues = textarea.value.split(',').map(function(v) { 
                return v.trim(); 
            })
            .filter(function(v) { 
                return v; 
            });
            // Remove the segment currently being typed
            if (existingValues.length > 0 && textarea.value.trim().slice(-1) !== ',') { 
                existingValues.pop(); 
            }
            // Avoid duplicate entries (case-insensitive)
            if (!existingValues.map(function(v) { 
                return v.toLowerCase(); 
            })
            .includes(selectedValue.toLowerCase())) {
                existingValues.push(selectedValue); 
            }
            textarea.value = existingValues.join(', ') + (existingValues.length > 0 ? ", " : "");
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = '';
            textarea.focus(); updatePatientData(); 
        } // Update patient data after selection
    });
    textarea.addEventListener('blur', function() {
        // Delay hiding to allow click on suggestions
        setTimeout(function() { 
            suggestionsContainer.classList.add('hidden'); 
        }, 150); 
    });
    textarea.addEventListener('focus', function(e) { 
        const inputText = e.target.value;
        const currentSegment = inputText.split(',').pop().trim().toLowerCase();
        if (currentSegment.length > 0) { 
            const filtered = Array.from(suggestionSourceSet)
            .filter(function(s) { 
                return s.toLowerCase().includes(currentSegment); 
            });
            if (filtered.length > 0) {
                suggestionsContainer.innerHTML = filtered.map(function(s) { 
                    return '<div class="autocomplete-suggestion-item" data-value="' + s + '">' + s + '</div>'; 
                })
                .join('');
                suggestionsContainer.classList.remove('hidden'); 
            };
        };
    }); 
}
