// --- Diagnostic Logging ---
console.log("ParamedicCategoriesData:", window.ParamedicCategoriesData);
console.log("MedicationDetailsData:", window.MedicationDetailsData);

// --- DOM Elements ---
const searchInput       = document.getElementById('searchInput');
const contentArea       = document.getElementById('content-area');
const patientSidebar    = document.getElementById('patient-sidebar');
const openSidebarButton = document.getElementById('open-sidebar-button');
const closeSidebarButton= document.getElementById('close-sidebar-button');
const sidebarOverlay    = document.getElementById('sidebar-overlay');
const navBackButton     = document.getElementById('nav-back-button');
const navForwardButton  = document.getElementById('nav-forward-button');

// --- Event Utility ---
function addTapListener(element, handler) {
    if (!element) return;
    const activate = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        handler(e);
    };
    element.addEventListener('click', activate);
    element.addEventListener('keypress', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            activate(e);
        }
    });
}

// --- Autocomplete Functionality ---
function setupAutocomplete(textareaId, suggestionsContainerId, suggestionSourceSet) {
    const textarea = document.getElementById(textareaId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);
    let currentInputValueBeforeSelection = "";

    textarea.addEventListener('input', e => {
        const inputText = e.target.value;
        const currentSegment = inputText.split(',').pop().trim().toLowerCase();
        currentInputValueBeforeSelection = inputText.substring(0, inputText.lastIndexOf(',') + 1).trim();
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

    addTapListener(suggestionsContainer, e => {
        if (e.target.classList.contains('autocomplete-suggestion-item')) {
            const selectedValue = e.target.dataset.value;
            let existingValues = textarea.value.split(',').map(v => v.trim()).filter(v => v);
            // Remove the segment currently being typed
            if (existingValues.length > 0 && textarea.value.trim().slice(-1) !== ',') {
                existingValues.pop();
            }
            // Avoid duplicate entries (case-insensitive)
            if (!existingValues.map(v => v.toLowerCase()).includes(selectedValue.toLowerCase())) {
                existingValues.push(selectedValue);
            }
            textarea.value = existingValues.join(', ') + (existingValues.length > 0 ? ", " : "");
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = '';
            textarea.focus();
            updatePatientData(); // Update patient data after selection
        }
    });

    textarea.addEventListener('blur', () => {
        // Delay hiding to allow click on suggestions
        setTimeout(() => { suggestionsContainer.classList.add('hidden'); }, 150);
    });
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

// --- Navigation History Management ---
function updateNavButtonsState() {
    navBackButton.disabled    = currentHistoryIndex <= 0;
    navForwardButton.disabled = currentHistoryIndex >= navigationHistory.length - 1;
}
function addHistoryEntry(entry) {
    if (isNavigatingViaHistory) return;
    if (currentHistoryIndex < navigationHistory.length - 1) {
        navigationHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
    }
    navigationHistory.push(entry);
    currentHistoryIndex = navigationHistory.length - 1;
    updateNavButtonsState();
}
function navigateViaHistory(direction) {
    if ((direction === -1 && currentHistoryIndex <= 0) ||
        (direction === 1 && currentHistoryIndex >= navigationHistory.length - 1)) return;
    isNavigatingViaHistory = true;
    currentHistoryIndex += direction;
    const state = navigationHistory[currentHistoryIndex];
    if (state.viewType === 'list') {
        searchInput.value = state.contentId || '';
        handleSearch(false, state.highlightTopicId, state.categoryPath || []);
    } else if (state.viewType === 'detail') {
        renderDetailPage(state.contentId, true, false);
    }
    updateNavButtonsState();
    isNavigatingViaHistory = false;
}
addTapListener(navBackButton,    () => navigateViaHistory(-1));
addTapListener(navForwardButton, () => navigateViaHistory(1));

// --- Global Data Structures --- 
// (Moved here from PatientInfo.js to ensure single source of truth)
   // all categories/topics hierarchy
let allSearchableTopics    = [];    // flat list of all topics for search
let allDisplayableTopicsMap = {};   // map from topic id -> topic object (with details)
/* Note: patientData and suggestion Sets (pmhSuggestions, allergySuggestions, 
   medicationNameSuggestions, etc.) are defined in PatientInfo.js and used below. */

// --- Data Initialization Function --- 
function initializeData(categoriesData, medDetailsData) {
    // Populate global structures from raw data files
    paramedicCategories = categoriesData || [];
    allSearchableTopics = [];
    allDisplayableTopicsMap = {};

    // Convert MedicationDetailsData (array or object) into a dictionary for quick lookup
    const medicationDataMap = {};
    if (Array.isArray(medDetailsData)) {
        medDetailsData.forEach(med => { 
            medicationDataMap[med.id] = med; 
        });
    } else if (medDetailsData && typeof medDetailsData === 'object') {
        Object.assign(medicationDataMap, medDetailsData);
    }

    // --- Preload common suggestions (Past Medical History, Allergies, Med Names) ---
    const commonPmh       = ["hypertension","htn","diabetes","dm","asthma","copd",
                             "heart failure","hf","cad","stroke","cva","seizure disorder",
                             "renal insufficiency","ckd","hypothyroidism","hyperthyroidism",
                             "glaucoma","peptic ulcer disease","gerd","schizophrenia",
                             "anxiety","depression"];
    const commonAllergies = ["penicillin","sulfa","aspirin","nsaids","morphine",
                             "codeine","iodine","shellfish","latex","peanuts","tree nuts"];
    const commonMedNames  = ["lisinopril","metformin","atorvastatin","amlodipine",
                             "hydrochlorothiazide","hctz","simvastatin","albuterol",
                             "levothyroxine","gabapentin","omeprazole","losartan",
                             "sertraline","furosemide","lasix","insulin","warfarin",
                             "coumadin","aspirin","clopidogrel","plavix"];
    // Add these common terms to the suggestion sets (defined in PatientInfo.js)
    commonPmh.forEach(term       => pmhSuggestions.add(term));
    commonAllergies.forEach(term => allergySuggestions.add(term));
    commonMedNames.forEach(term  => medicationNameSuggestions.add(term));
    PDE5_INHIBITORS.forEach(term => medicationNameSuggestions.add(term));  // from PatientInfo.js

    // --- Extract additional allergy keywords from medication contraindications ---
    Object.values(medicationDataMap).forEach(med => {
        if (med.contraindications && Array.isArray(med.contraindications)) {
            med.contraindications.forEach(ci => {
                const ciLower = ci.toLowerCase();
                if (ciLower.includes("hypersensitivity") || ciLower.includes("allergy to")) {
                    // Derive a generalized allergen term from text
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

    // --- Build topic list and attach details ---
    function processItem(item, parentPath = '', parentIds = []) {
        const currentPath = parentPath ? `${parentPath} > ${item.title}` : item.title;
        const currentIds  = (item.type === 'category') 
                              ? [...parentIds, item.id] 
                              : parentIds;
        // Attach corresponding detail info if this item is a topic with a matching ID
        const detailsObj = medicationDataMap[item.id];
        const fullItem = {
            ...item,
            path: currentPath,
            details: detailsObj || null,      // attach medication details if available
            categoryPath: parentIds
        };
        // Add to master map
        allDisplayableTopicsMap[item.id] = fullItem;
        if (item.type === 'topic') {
            // Add to searchable list (for quick search by title/path)
            allSearchableTopics.push({
                id: item.id, 
                title: item.title, 
                path: currentPath, 
                categoryPath: parentIds 
            });
        }
        // Recurse into children if this is a category
        if (item.children) {
            item.children.forEach(child => 
                processItem(child, currentPath, currentIds)
            );
        }
    }
    paramedicCategories.forEach(category => processItem(category, '', []));

    // Data initialization complete. Now paramedicCategories, allSearchableTopics, 
    // and allDisplayableTopicsMap are ready for use.
}

// --- Hierarchical List Rendering ---
function createHierarchicalList(items, container) {
    items.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'py-1';
        if (item.type === 'category') {
            listItem.classList.add('category-item');
            listItem.dataset.categoryId = item.id;
            const header = document.createElement('div');
            header.className = 'category-header';
            header.innerHTML = `
                <span>${item.title}</span>
                <span class="icon-toggle">
                    <svg class="w-5 h-5 icon-toggle-closed" ...>/* SVG plus icon */</svg>
                    <svg class="w-5 h-5 icon-toggle-open" ...>/* SVG minus icon */</svg>
                </span>`;
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('tabindex', '0');
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'category-children';
            childrenContainer.classList.add('hidden');  // start hidden, toggle on click
            addTapListener(header, () => {
                // Toggle expand/collapse
                listItem.classList.toggle('expanded');
                const expanded = listItem.classList.contains('expanded');
                header.setAttribute('aria-expanded', expanded.toString());
                // Show/hide children
                if (expanded) {
                    childrenContainer.classList.remove('hidden');
                } else {
                    childrenContainer.classList.add('hidden');
                }
            });
            header.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });
            listItem.appendChild(header);
            listItem.appendChild(childrenContainer);
            if (item.children && item.children.length > 0) {
                createHierarchicalList(item.children, childrenContainer);
            }
        } else if (item.type === 'topic') {
            const topicLink = document.createElement('a');
            topicLink.className = 'topic-link-item';
            topicLink.textContent = item.title;
            topicLink.href = `#${item.id}`;
            topicLink.dataset.topicId = item.id;
            topicLink.setAttribute('role', 'button');
            topicLink.setAttribute('tabindex', '0');
            // When a topic is clicked, load its detail page
            addTapListener(topicLink, e => {
                e.preventDefault();
                renderDetailPage(item.id);
            });
            topicLink.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    renderDetailPage(item.id);
                }
            });
            listItem.appendChild(topicLink);
        }
        container.appendChild(listItem);
    });
}

function openCategoriesAndHighlight(categoryPath = [], highlightId = null) {
    // Expand all categories in the given path (to reveal the highlighted topic)
    categoryPath.forEach(catId => {
        const catEl = contentArea.querySelector(`[data-category-id="${catId}"]`);
        if (catEl && !catEl.classList.contains('expanded')) {
            catEl.classList.add('expanded');
            const header = catEl.querySelector('.category-header');
            if (header) header.setAttribute('aria-expanded', 'true');
            // Ensure children container is visible
            const childList = catEl.querySelector('.category-children');
            if (childList) childList.classList.remove('hidden');
        }
    });
    // Remove any existing highlight
    contentArea.querySelectorAll('.topic-link-item.recently-viewed').forEach(el => {
        el.classList.remove('recently-viewed');
    });
    // Highlight the recently viewed topic, if specified
    if (highlightId) {
        const topicEl = contentArea.querySelector(`[data-topic-id="${highlightId}"]`);
        if (topicEl) topicEl.classList.add('recently-viewed');
    }
}

// --- Detail Page Rendering ---
function renderDetailPage(topicId, scrollToTop = true, shouldAddHistory = true) {
    const topic = allDisplayableTopicsMap[topicId];
    if (!topic) {
        // If topic not found (ID mismatch or missing data)
        contentArea.innerHTML = `
            <p class="text-red-600 text-center py-4">
                Error: Topic not found (ID: ${topicId}).</p>
            <button id="backButtonDetailError" 
                    class="mt-4 block mx-auto px-6 py-2 bg-blue-500 text-white rounded-lg">
                Back to List
            </button>`;
        addTapListener(document.getElementById('backButtonDetailError'), () => {
            handleSearch(true);
        });
        return;
    }
    // If coming from a list view, update that history entry with this topic highlight
    if (navigationHistory[currentHistoryIndex] && navigationHistory[currentHistoryIndex].viewType === 'list') {
        navigationHistory[currentHistoryIndex].highlightTopicId = topicId;
        navigationHistory[currentHistoryIndex].categoryPath    = topic.categoryPath || [];
    }
    if (scrollToTop) {
        contentArea.scrollTop = 0;
        window.scrollTo(0, Math.max(0, contentArea.offsetTop - 80));
    }

    // Generate any dynamic warnings based on patient info
    let collectedWarnings = [];
    if (topic.details) {
        // Pediatric dose warning if no pediatric dose or contraindicated for peds
        if (patientData.age !== null && patientData.age < PEDIATRIC_AGE_THRESHOLD) {
            const pedsText = (topic.details.pediatricRx || []).join('').toLowerCase();
            if (!topic.details.pediatricRx || pedsText.length === 0 ||
                pedsText.includes("don’t give") || pedsText.includes("not approved")) {
                collectedWarnings.push({ 
                    type: 'orange', 
                    text: `<strong>PEDIATRIC NOTE:</strong> No pediatric dosage listed or not recommended for pediatrics. Age: ${patientData.age}.`
                });
            }
        }
        // Contraindication warnings based on Patient Info
        if (topic.details.contraindications) {
            topic.details.contraindications.forEach(ci => {
                const ciLower = ci.toLowerCase();
                // Past Medical History matches
                patientData.pmh.forEach(hist => {
                    if (ciLower.includes(hist)) {
                        collectedWarnings.push({ 
                            type: 'red', 
                            text: `<strong>CONTRAINDICATION:</strong> History of <strong>${hist}</strong> (relevant to "${ci}").` 
                        });
                    }
                });
                // Current Medications interactions
                patientData.currentMedications.forEach(currMed => {
                    if (ciLower.includes(currMed) && !PDE5_INHIBITORS.includes(currMed)) {
                        collectedWarnings.push({ 
                            type: 'red', 
                            text: `<strong>CONTRAINDICATION:</strong> Patient is on <strong>${currMed}</strong> (conflicts with "${ci}").` 
                        });
                    }
                });
                // Specific NTG (Nitroglycerin) checks
                if (topic.id === 'ntg') {
                    if (ciLower.includes("sbp <100") && patientData.vitalSigns.bp) {
                        const sbp = parseInt(patientData.vitalSigns.bp.split('/')[0]);
                        if (!isNaN(sbp) && sbp < 100) {
                            collectedWarnings.push({
                                type: 'red',
                                text: `<strong>CONTRAINDICATION:</strong> SBP is ${sbp} (NTG contraindicated if SBP < 100).`
                            });
                        }
                    }
                    if (ciLower.includes("phosphodiesterase") || 
                        PDE5_INHIBITORS.some(drug => ciLower.includes(drug))) {
                        const onPDE5 = patientData.currentMedications.find(med =>
                            PDE5_INHIBITORS.includes(med.toLowerCase())
                        );
                        if (onPDE5) {
                            collectedWarnings.push({
                                type: 'red',
                                text: `<strong>CONTRAINDICATION:</strong> Patient uses <strong>${onPDE5}</strong> (PDE5 inhibitor) – cannot give NTG.`
                            });
                        }
                    }
                }
                // Allergy warning (if "hypersensitivity" listed and med name matches an allergy)
                patientData.allergies.forEach(allergy => {
                    if (ciLower.includes("hypersensitivity") && 
                        topic.title.toLowerCase().includes(allergy)) {
                        collectedWarnings.push({ 
                            type: 'yellow', 
                            text: `<strong>ALLERGY ALERT:</strong> Patient is allergic to <strong>${allergy}</strong> – use caution with this medication.` 
                        });
                    }
                });
            });
        }
    }
    // Remove duplicate warnings and sort by severity
    const uniqueWarnings = [];
    const seenTexts = new Set();
    collectedWarnings.forEach(w => {
        if (!seenTexts.has(w.text)) {
            uniqueWarnings.push(w);
            seenTexts.add(w.text);
        }
    });
    const severityRank = { red: 3, orange: 2, yellow: 1 };
    uniqueWarnings.sort((a,b) => severityRank[b.type] - severityRank[a.type]);
    const topSeverity = uniqueWarnings[0] ? uniqueWarnings[0].type : null;
    let warningsHtml = "";
    if (uniqueWarnings.length > 0) {
        warningsHtml = `<div class="warning-box ${ topSeverity === 'red'
                         ? 'warning-box-red' 
                         : (topSeverity === 'orange' ? 'warning-box-orange' : 'warning-box-yellow') }">` +
            uniqueWarnings.map(w => {
                const iconColor = w.type === 'red' ? 'text-red-600' 
                                : w.type === 'orange' ? 'text-orange-600' 
                                : 'text-yellow-700';
                return `<div>${createWarningIcon(iconColor)}<span>${w.text}</span></div>`;
            }).join('<hr class="my-1 border-gray-300">') + 
        `</div>`;
    }

    // Dose calculation (for weight-based doses in certain meds)
    let weightInKg = patientData.weight;
    if (patientData.weight && patientData.weightUnit === 'lbs') {
        weightInKg = patientData.weight / 2.20462;
    }
    let calculatedDoseInfo = "", weightDosePlaceholder = "";
    if (weightInKg && topic.details && topic.details.concentration) {
        // Example: Fentanyl dose helper
        if (topic.id === 'fentanyl-sublimaze' && topic.details.adultRx &&
            topic.details.adultRx.some(rx => rx.toLowerCase().includes("1mcg/kg"))) {
            const dosePerKg = 1;
            const match = topic.details.concentration.match(/(\d+)mcg\/(\d+)ml/);
            if (match) {
                const drugAmount = parseFloat(match[1]), volume = parseFloat(match[2]);
                const concMcgPerMl = drugAmount / volume;
                const totalDoseMcg = weightInKg * dosePerKg;
                const volumeToDraw  = totalDoseMcg / concMcgPerMl;
                calculatedDoseInfo = 
                  `<p class="text-sm text-green-700 bg-green-50 p-2 rounded-md">
                      Calculated for ${weightInKg.toFixed(1)} kg: 
                      <strong>Dose: ${totalDoseMcg.toFixed(1)} mcg; Volume: ${volumeToDraw.toFixed(2)} mL.</strong>
                   </p>`;
            }
        }
        // Example: Etomidate dose helper (0.3mg/kg with max)
        if (topic.id === 'etomidate-amidate' && topic.details.adultRx &&
            topic.details.adultRx.some(rx => rx.toLowerCase().includes("0.3mg/kg"))) {
            const dosePerKg = 0.3;
            const match = topic.details.concentration.match(/(\d+)mg\/(\d+)ml/);
            if (match) {
                const drugAmount = parseFloat(match[1]), volume = parseFloat(match[2]);
                const concMgPerMl = drugAmount / volume;
                let totalDoseMg = weightInKg * dosePerKg;
                // Check if a max dose is mentioned in text (e.g. "Max = 20mg")
                const maxMatch = topic.details.adultRx.join(' ').match(/Max\s*=\s*(\d+)mg/i);
                const maxDose = maxMatch ? parseFloat(maxMatch[1]) : null;
                if (maxDose && totalDoseMg > maxDose) totalDoseMg = maxDose;
                const volumeToDraw = totalDoseMg / concMgPerMl;
                calculatedDoseInfo = 
                  `<p class="text-sm text-green-700 bg-green-50 p-2 rounded-md">
                      Calculated for ${weightInKg.toFixed(1)} kg: 
                      <strong>Dose: ${totalDoseMg.toFixed(1)} mg; Volume: ${volumeToDraw.toFixed(2)} mL.</strong>
                   </p>`;
            }
        }
    }
    if (!calculatedDoseInfo && weightInKg) {
        weightDosePlaceholder = 
            `<p class="text-sm text-gray-600 italic">
                (Patient weight ${weightInKg.toFixed(1)} kg – no auto-calculation for this drug.)
             </p>`;
    }

    // Patient info summary (snapshot box)
    let patientInfoSummary = '';
    if (patientData.age || patientData.weight || patientData.allergies.length > 0 || patientData.currentMedications.length > 0) {
        patientInfoSummary = `
          <div class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
            <h4 class="font-semibold text-blue-700 mb-1">Current Patient Snapshot:</h4>
            ${ patientData.age ? `<p><strong>Age:</strong> ${patientData.age} yrs</p>` : '' }
            ${ patientData.weight ? `<p><strong>Weight:</strong> ${patientData.weight} ${patientData.weightUnit} 
                                      ${ weightInKg ? `(~${weightInKg.toFixed(1)} kg)` : '' }</p>` : '' }
            ${ patientData.allergies.length ? `<p><strong>Allergies:</strong> 
                                      <span class="font-medium text-red-600">${patientData.allergies.join(', ')}</span></p>` : '' }
            ${ patientData.currentMedications.length ? `<p><strong>Current Meds:</strong> 
                                      ${patientData.currentMedications.join(', ')}</p>` : '' }
          </div>`;
    }

    // Build the detail content HTML
    let detailContentHtml = '';
    if (topic.details) {
        const d = topic.details;
        detailContentHtml = `
            ${d.class ? `<div class="detail-section">
                           <h3 class="detail-section-title toggle-category">Class: 
                             <span class="text-blue-600 arrow">&#x25BC;</span>
                           </h3>
                           <div class="detail-section-content hidden">
                             ${createDetailText(d.class)}
                           </div>
                         </div>` : ''}
            ${d.indications ? `<div class="detail-section">
                                  <h3 class="detail-section-title toggle-category">Indications: 
                                    <span class="text-blue-600 arrow">&#x25BC;</span>
                                  </h3>
                                  <div class="detail-section-content hidden">
                                    ${createDetailList(d.indications)}
                                  </div>
                                </div>` : ''}
            ${d.contraindications ? `<div class="detail-section">
                                        <h3 class="detail-section-title toggle-category">Contraindications: 
                                          <span class="text-blue-600 arrow">&#x25BC;</span>
                                        </h3>
                                        <div class="detail-section-content hidden">
                                          ${createDetailList(d.contraindications)}
                                        </div>
                                      </div>` : ''}
            ${d.precautions ? `<div class="detail-section">
                                  <h3 class="detail-section-title toggle-category">Precautions: 
                                    <span class="text-blue-600 arrow">&#x25BC;</span>
                                  </h3>
                                  <div class="detail-section-content hidden">
                                    ${createDetailText(d.precautions)}
                                  </div>
                                </div>` : ''}
            ${d.sideEffects ? `<div class="detail-section">
                                  <h3 class="detail-section-title toggle-category">Significant Adverse/Side Effects: 
                                    <span class="text-blue-600 arrow">&#x25BC;</span>
                                  </h3>
                                  <div class="detail-section-content hidden">
                                    ${createDetailList(d.sideEffects)}
                                  </div>
                                </div>` : ''}
            ${(calculatedDoseInfo || weightDosePlaceholder) ? 
                `<div class="detail-section mt-3">${calculatedDoseInfo}${weightDosePlaceholder}</div>` : ''}
            ${d.adultRx ? `<div class="detail-section adult-section">
                             <h3 class="detail-section-title toggle-category">Adult Rx: 
                               <span class="text-blue-600 arrow">&#x25BC;</span>
                             </h3>
                             <div class="detail-section-content hidden">
                               ${createDetailText(d.adultRx.join('\n\n'))}
                             </div>
                           </div>` : ''}
            ${d.pediatricRx ? `<div class="detail-section pediatric-section">
                                 <h3 class="detail-section-title toggle-category">Pediatric Rx: 
                                   <span class="text-blue-600 arrow">&#x25BC;</span>
                                 </h3>
                                 <div class="detail-section-content hidden">
                                   ${createDetailText(d.pediatricRx.join('\n\n'))}
                                 </div>
                               </div>` : ''}`;
    } else {
        // Placeholder if no details available (should not happen for ALS meds after data fix)
        detailContentHtml = `<p class="text-lg italic">This is a placeholder for <strong>${topic.title}</strong>.</p>
                              <p class="text-sm text-gray-600">Detailed information coming soon.</p>`;
    }

    // --- Anchor Navigation Helpers ---
function generateSectionSlugs(topic) {
    // Use slugList.js if available, else fallback to static mapping
    if (window.slugList && window.slugList[topic.id]) {
        return window.slugList[topic.id];
    }
    // Fallback: generate slugs for standard sections
    return [
        { id: 'indications', label: 'Indications' },
        { id: 'contraindications', label: 'Contraindications' },
        { id: 'precautions', label: 'Precautions' },
        { id: 'sideEffects', label: 'Side Effects' },
        { id: 'adultRx', label: 'Adult Rx' },
        { id: 'pediatricRx', label: 'Pediatric Rx' }
    ];
}

function createAnchorNavMenu(slugs) {
    if (!slugs || slugs.length < 2) return '';
    return `<nav class="anchor-nav-menu fixed right-4 top-24 z-40 bg-white shadow-lg rounded-lg p-2 hidden md:block">
        <ul class="space-y-1">
            ${slugs.map(s => `<li><a href="#${s.id}-section" class="anchor-link text-blue-600 hover:underline">${s.label}</a></li>`).join('')}
        </ul>
    </nav>`;
}

function scrollToAnchor(anchorId) {
    const el = document.getElementById(anchorId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('anchor-highlight');
        setTimeout(() => el.classList.remove('anchor-highlight'), 1200);
    }
}

// --- Patch renderDetailPage to add anchors and nav menu ---
const origRenderDetailPage = renderDetailPage;
renderDetailPage = function(topicId, scrollToTop = true, shouldAddHistory = true) {
    const topic = allDisplayableTopicsMap[topicId];
    if (!topic) return origRenderDetailPage(topicId, scrollToTop, shouldAddHistory);
    const slugs = generateSectionSlugs(topic);
    // Build anchor nav menu
    let anchorNavHtml = createAnchorNavMenu(slugs);
    // Build detail content with anchor ids
    let detailContentHtml = '';
    if (topic.details) {
        const d = topic.details;
        detailContentHtml = `
            ${ d.notes ? `<div class="detail-section" id="notes-section">${d.notes.map(n => `<p class="text-red-600 font-semibold">${n}</p>`).join('')}</div>` : '' }
            ${ d.class ? `<div class="detail-section" id="class-section"><h3>Class</h3>${createDetailText(d.class)}</div>` : '' }
            ${ d.indications ? `<div class="detail-section" id="indications-section"><h3>Indications</h3>${createDetailList(d.indications)}</div>` : '' }
            ${ d.contraindications ? `<div class="detail-section" id="contraindications-section"><h3>Contraindications</h3>${createDetailList(d.contraindications)}</div>` : '' }
            ${ d.precautions ? `<div class="detail-section" id="precautions-section"><h3>Precautions</h3>${createDetailText(d.precautions)}</div>` : '' }
            ${ d.sideEffects ? `<div class="detail-section" id="sideEffects-section"><h3>Side Effects</h3>${createDetailList(d.sideEffects)}</div>` : '' }
            ${ d.adultRx ? `<div class="detail-section" id="adultRx-section"><h3>Adult Rx</h3>${createDetailText(d.adultRx.join('\n\n'))}</div>` : '' }
            ${ d.pediatricRx ? `<div class="detail-section" id="pediatricRx-section"><h3>Pediatric Rx</h3>${createDetailText(d.pediatricRx.join('\n\n'))}</div>` : '' }
        `;
    } else {
        detailContentHtml = `<p class="text-lg italic">This is a placeholder for <strong>${topic.title}</strong>.</p>`;
    }
    // Inject anchor nav and detail content
    contentArea.innerHTML = `
        ${anchorNavHtml}
        <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-3 border-b border-gray-200">
            <h2 class="text-xl md:text-2xl font-bold text-blue-700 mb-2 sm:mb-0 topic-main-title" data-topic-id="${topic.id}">
                ${topic.title} ${topic.details && topic.details.concentration ? `<span class="med-concentration">${topic.details.concentration}</span>` : ''}
            </h2>
            <button id="backToListButton" class="w-full sm:w-auto px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                Back to List View
            </button>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-inner space-y-3 text-gray-800">
            ${detailContentHtml}
        </div>`;
    // Attach anchor link listeners
    contentArea.querySelectorAll('.anchor-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const anchorId = link.getAttribute('href').replace('#', '');
            scrollToAnchor(anchorId);
        });
    });
    // Show/hide anchor nav menu based on scroll
    const anchorNav = contentArea.querySelector('.anchor-nav-menu');
    if (anchorNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                anchorNav.classList.remove('hidden');
            } else {
                anchorNav.classList.add('hidden');
            }
        });
    }
    // ...existing code for warnings, patient info, etc. (call origRenderDetailPage for those)...
    origRenderDetailPage(topicId, scrollToTop, shouldAddHistory);
};

    attachToggleInfoHandlers(contentArea);
    attachToggleCategoryHandlers(contentArea);
    addTapListener(document.getElementById('backToListButton'), () => {
        // Navigate back to last list view in history, or fall back to initial view
        for (let i = currentHistoryIndex - 1; i >= 0; i--) {
            if (navigationHistory[i] && navigationHistory[i].viewType === 'list') {
                isNavigatingViaHistory = true;
                currentHistoryIndex = i;
                searchInput.value = navigationHistory[i].contentId || '';
                handleSearch(false, navigationHistory[i].highlightTopicId, navigationHistory[i].categoryPath || []);
                updateNavButtonsState();
                isNavigatingViaHistory = false;
                return;
            }
        }
        renderInitialView(true, null, []);
    });
}

// --- Utility: toggling hidden info text in detail view ---
function attachToggleInfoHandlers(container) {
    container.querySelectorAll('.toggle-info').forEach(el => {
        addTapListener(el, () => {
            const info = el.querySelector('.info-text');
            if (info) info.classList.toggle('hidden');
        });
    });
}
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

// --- Initial View Rendering ---
function renderInitialView(shouldAddHistory = true, highlightId = null, categoryPath = []) {
    if (shouldAddHistory) {
        addHistoryEntry({ viewType: 'list', contentId: '', highlightTopicId: highlightId, categoryPath });
    }
    contentArea.innerHTML = `
        <p class="text-gray-600 text-center mb-4 text-sm md:text-base">
            Use the <svg /* (menu icon SVG) */></svg> button for patient info. Browse categories below or use search.
        </p>
        <div id="hierarchical-list-container" class="space-y-2"></div>`;
    const listContainer = document.getElementById('hierarchical-list-container');
    if (paramedicCategories.length > 0) {
        createHierarchicalList(paramedicCategories, listContainer);
    } else {
        listContainer.innerHTML = '<p class="text-gray-500 text-center">No categories available.</p>';
    }
    openCategoriesAndHighlight(categoryPath, highlightId);
}

function renderSearchResults(filteredTopics, searchTerm, shouldAddHistory = true, highlightId = null, categoryPath = []) {
    if (shouldAddHistory) {
        addHistoryEntry({ viewType: 'list', contentId: searchTerm, highlightTopicId: highlightId, categoryPath });
    }
    contentArea.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <p class="text-gray-700 font-medium">Results for "${searchTerm}":</p>
            <button id="clear-search-button" class="text-sm text-blue-600 hover:underline">Show All Categories</button>
        </div>
        <div id="results-container" class="space-y-2"></div>`;
    const resultsContainer = document.getElementById('results-container');
    if (filteredTopics.length > 0) {
        filteredTopics.forEach(topic => {
            const item = document.createElement('div');
            item.className = 'search-topic-item';
            item.textContent = topic.title;
            if (topic.path) {
                const pathEl = document.createElement('div');
                pathEl.className = 'text-xs text-gray-500 mt-1';
                pathEl.textContent = topic.path.split(' > ').slice(0, -1).join(' > ');
                item.appendChild(pathEl);
            }
            item.dataset.topicId = topic.id;
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            addTapListener(item, () => renderDetailPage(topic.id));
            item.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    renderDetailPage(topic.id);
                }
            });
            resultsContainer.appendChild(item);
        });
    } else {
        resultsContainer.innerHTML = 
            '<p class="text-gray-500 text-center py-4">No topics found matching your search.</p>';
    }
    addTapListener(document.getElementById('clear-search-button'), () => {
        searchInput.value = '';
        renderInitialView();
    });
    openCategoriesAndHighlight(categoryPath, highlightId);
}

// --- Text/Markup Helpers ---
function parseTextMarkup(text) {
    // Escape HTML and replace special markup with styled spans
    let safeText = text.replace(/&/g, "&amp;")
                       .replace(/</g, "&lt;")
                       .replace(/>/g, "&gt;");
    safeText = safeText.replace(/\n/g, "<br>");
    safeText = safeText.replace(/\[\[(.+?)\|(.+?)\]\]/g, 
                (_, display, info) => `<span class="toggle-info">${display}<span class="info-text hidden">${info}</span></span>`);
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
function createDetailList(itemsArray) {
    if (!itemsArray || itemsArray.length === 0) {
        return '<p class="text-gray-500 italic">None listed.</p>';
    }
    return `<ul class="detail-list">${ itemsArray.map(it => `<li>${parseTextMarkup(it)}</li>`).join('') }</ul>`;
}
function createDetailText(textBlock) {
    if (!textBlock || textBlock.toString().trim() === '') {
        return '<p class="text-gray-500 italic">Not specified.</p>';
    }
    const safeText = parseTextMarkup(textBlock.toString());
    return `<div class="detail-text">${safeText}</div>`;
}
function createWarningIcon(colorClass = 'text-yellow-600') {
    return `<svg class="${colorClass} w-5 h-5 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
            </svg>`;
}

// --- Main App Initialization ---
function initApp() {
    // Initialize data structures with categories and medications
    initializeData(window.ParamedicCategoriesData, window.MedicationDetailsData);
    // Set up sidebar toggles
    addTapListener(openSidebarButton, openSidebar);
    addTapListener(closeSidebarButton, closeSidebar);
    addTapListener(sidebarOverlay, closeSidebar);
    // Set up autocomplete for each Patient Info field
    setupAutocomplete('pt-pmh',         'pt-pmh-suggestions',         pmhSuggestions);
    setupAutocomplete('pt-allergies',   'pt-allergies-suggestions',   allergySuggestions);
    setupAutocomplete('pt-medications','pt-medications-suggestions', medicationNameSuggestions);
    setupAutocomplete('pt-indications','pt-indications-suggestions', indicationSuggestions);
    setupAutocomplete('pt-symptoms',    'pt-symptoms-suggestions',    symptomSuggestions);
    // Enter key triggers search
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(true);
        }
    });
    // Render initial category list view
    renderInitialView(true, null, []);
    // --- UI Fixes for Modern Look ---
    document.body.style.fontFamily = 'Inter, sans-serif';
    document.body.classList.add('bg-gray-100');
    contentArea.classList.add('rounded-lg', 'shadow-lg', 'bg-white', 'p-4', 'md:p-6');
    // Ensure sidebar is styled
    patientSidebar.classList.add('bg-white', 'shadow-xl', 'p-6', 'rounded-lg', 'fixed', 'top-0', 'left-0', 'h-full', 'z-50', 'w-80', 'max-w-full', 'overflow-y-auto');
    sidebarOverlay.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-black', 'bg-opacity-40', 'z-40', 'hidden');
    // Responsive tweaks
    window.addEventListener('resize', () => {
        if (window.innerWidth < 640) {
            patientSidebar.classList.add('w-full');
        } else {
            patientSidebar.classList.remove('w-full');
        }
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
