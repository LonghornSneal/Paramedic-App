        // --- DOM Elements ---
        const searchInput = document.getElementById('searchInput');
        const contentArea = document.getElementById('content-area');
        const patientSidebar = document.getElementById('patient-sidebar');
        const openSidebarButton = document.getElementById('open-sidebar-button');
        const closeSidebarButton = document.getElementById('close-sidebar-button');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const navBackButton = document.getElementById('nav-back-button');
        const navForwardButton = document.getElementById('nav-forward-button');

        function addTapListener(element, handler) {
            if (!element) return;
            const activate = (e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                e.preventDefault();
                handler(e);
            };

            element.addEventListener('click', activate);
            element.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    activate(e);
                }
            });
        }


        // --- Autocomplete Functionality ---
        function setupAutocomplete(textareaId, suggestionsContainerId, suggestionSourceSet) {
            const textarea = document.getElementById(textareaId);
            const suggestionsContainer = document.getElementById(suggestionsContainerId);
            let currentInputValueBeforeSelection = ""; // To manage appending correctly

            textarea.addEventListener('input', function(e) {
                const inputText = e.target.value;
                // Get the part of the input after the last comma, or the whole input if no comma
                const currentSegment = inputText.split(',').pop().trim().toLowerCase();
                currentInputValueBeforeSelection = inputText.substring(0, inputText.lastIndexOf(',') + 1).trim();
                if (currentSegment.length === 0) {
                    suggestionsContainer.classList.add('hidden');
                    suggestionsContainer.innerHTML = '';
                    return;
                }

                const filteredSuggestions = Array.from(suggestionSourceSet).filter(suggestion =>
                    suggestion.toLowerCase().includes(currentSegment)
                );

                if (filteredSuggestions.length > 0) {
                    suggestionsContainer.innerHTML = filteredSuggestions.map(s =>
                        `<div class="autocomplete-suggestion-item" data-value="${s}">${s}</div>`
                    ).join('');
                    suggestionsContainer.classList.remove('hidden');
                } else {
                    suggestionsContainer.classList.add('hidden');
                }
            });

            addTapListener(suggestionsContainer, function(e) {
                if (e.target.classList.contains('autocomplete-suggestion-item')) {
                    const selectedValue = e.target.dataset.value;
                    let existingValues = textarea.value.split(',').map(v => v.trim()).filter(v => v);
                    
                    // Remove the current typing segment before adding the new one
                    if (existingValues.length > 0 && textarea.value.trim().slice(-1) !== ',') {
                        existingValues.pop(); 
                    }

                    if (!existingValues.map(v => v.toLowerCase()).includes(selectedValue.toLowerCase())) {
                        existingValues.push(selectedValue);
                    }
                    
                    textarea.value = existingValues.join(', ') + (existingValues.length > 0 ? ", " : ""); // Add trailing comma for next entry
                    
                    suggestionsContainer.classList.add('hidden');
                    suggestionsContainer.innerHTML = '';
                    textarea.focus();
                    updatePatientData(); // Update patient data after selection
                }
            });

            textarea.addEventListener('blur', function() {
                // Delay hiding to allow click event on suggestions
                setTimeout(() => {
                    suggestionsContainer.classList.add('hidden');
                }, 150);
            });
             textarea.addEventListener('focus', function(e) { // Re-trigger suggestions on focus if there's text
                const inputText = e.target.value;
                const currentSegment = inputText.split(',').pop().trim().toLowerCase();
                 if (currentSegment.length > 0) {
                     const filteredSuggestions = Array.from(suggestionSourceSet).filter(suggestion =>
                        suggestion.toLowerCase().includes(currentSegment)
                    );
                    if (filteredSuggestions.length > 0) {
                        suggestionsContainer.innerHTML = filteredSuggestions.map(s =>
                            `<div class="autocomplete-suggestion-item" data-value="${s}">${s}</div>`
                        ).join('');
                        suggestionsContainer.classList.remove('hidden');
                    }
                 }
            });
        }


        // --- Navigation History Management (same as v0.6) ---
        function updateNavButtonsState() { navBackButton.disabled = currentHistoryIndex <= 0; navForwardButton.disabled = currentHistoryIndex >= navigationHistory.length - 1; }
        function addHistoryEntry(entry) { if (isNavigatingViaHistory) return; if (currentHistoryIndex < navigationHistory.length - 1) { navigationHistory = navigationHistory.slice(0, currentHistoryIndex + 1); } navigationHistory.push(entry); currentHistoryIndex = navigationHistory.length - 1; updateNavButtonsState(); }
        function navigateViaHistory(direction) { if ((direction === -1 && currentHistoryIndex <= 0) || (direction === 1 && currentHistoryIndex >= navigationHistory.length - 1)) return; isNavigatingViaHistory = true; currentHistoryIndex += direction; const state = navigationHistory[currentHistoryIndex]; if (state.viewType === 'list') { searchInput.value = state.contentId || ''; handleSearch(false, state.highlightTopicId, state.categoryPath || []); } else if (state.viewType === 'detail') { renderDetailPage(state.contentId, true, false); } updateNavButtonsState(); isNavigatingViaHistory = false; }
        addTapListener(navBackButton, () => navigateViaHistory(-1));
        addTapListener(navForwardButton, () => navigateViaHistory(1));

        // --- Hierarchical List Rendering (same as v0.6) ---
        function createHierarchicalList(items, container) { /* ... same as v0.6 ... */
             items.forEach(item => {
                const listItem = document.createElement('div'); listItem.className = 'py-1';
                if (item.type === 'category') {
                    listItem.classList.add('category-item');
                    listItem.dataset.categoryId = item.id;
                    const header = document.createElement('div'); header.className = 'category-header';
                    header.innerHTML = `<span>${item.title}</span><span class="icon-toggle"><svg class="w-5 h-5 icon-toggle-closed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg><svg class="w-5 h-5 icon-toggle-open" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" /></svg></span>`;
                    header.setAttribute('role', 'button'); header.setAttribute('aria-expanded', 'false'); header.setAttribute('tabindex', '0');
                    const childrenContainer = document.createElement('div'); childrenContainer.className = 'category-children';
                    addTapListener(header, () => { listItem.classList.toggle('expanded'); header.setAttribute('aria-expanded', listItem.classList.contains('expanded').toString()); });
                    header.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); listItem.classList.toggle('expanded'); header.setAttribute('aria-expanded', listItem.classList.contains('expanded').toString()); }});
                    listItem.appendChild(header); listItem.appendChild(childrenContainer);
                    if (item.children && item.children.length > 0) createHierarchicalList(item.children, childrenContainer);
                } else if (item.type === 'topic') {
                    const topicLink = document.createElement('a'); topicLink.className = 'topic-link-item';
                    topicLink.textContent = item.title; topicLink.href = `#${item.id}`; topicLink.dataset.topicId = item.id;
                    topicLink.setAttribute('role', 'button'); topicLink.setAttribute('tabindex', '0');
                    addTapListener(topicLink, (e) => { e.preventDefault(); renderDetailPage(item.id); });
                    topicLink.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); renderDetailPage(item.id); }});
                    listItem.appendChild(topicLink);
                }
                container.appendChild(listItem);
            });
        }


        // --- View Rendering Functions ---
        function renderInitialView(shouldAddHistory = true, highlightId = null, categoryPath = []) { /* ... same as v0.6 ... */
            if (shouldAddHistory) addHistoryEntry({ viewType: 'list', contentId: '', highlightTopicId: highlightId, categoryPath });
            contentArea.innerHTML = `<p class="text-gray-600 text-center mb-4 text-sm md:text-base">Use the <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block align-text-bottom"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg> button for patient info. Browse categories below or use search.</p><div id="hierarchical-list-container" class="space-y-2"></div>`;
            const listContainer = document.getElementById('hierarchical-list-container');
            if (paramedicCategories.length > 0) createHierarchicalList(paramedicCategories, listContainer);
            else listContainer.innerHTML = '<p class="text-gray-500 text-center">No categories available.</p>';
            openCategoriesAndHighlight(categoryPath, highlightId);
        }
        function renderSearchResults(filteredTopics, searchTerm, shouldAddHistory = true, highlightId = null, categoryPath = []) { /* ... same as v0.6 ... */
            if (shouldAddHistory) addHistoryEntry({ viewType: 'list', contentId: searchTerm, highlightTopicId: highlightId, categoryPath });
            contentArea.innerHTML = `<div class="flex justify-between items-center mb-3"><p class="text-gray-700 font-medium">Results for "${searchTerm}":</p><button id="clear-search-button" class="text-sm text-blue-600 hover:text-blue-800 hover:underline">Show All Categories</button></div><div id="results-container" class="space-y-2"></div>`;
            const resultsContainer = document.getElementById('results-container');
            if (filteredTopics.length > 0) {
                 filteredTopics.forEach(topic => {
                    const item = document.createElement('div'); item.className = 'search-topic-item'; item.textContent = topic.title;
                    if (topic.path) { const pathEl = document.createElement('div'); pathEl.className = 'text-xs text-gray-500 mt-1'; pathEl.textContent = topic.path.split(' > ').slice(0, -1).join(' > '); item.appendChild(pathEl); }
                    item.dataset.topicId = topic.id; item.setAttribute('role', 'button'); item.setAttribute('tabindex', '0');
                    addTapListener(item, () => renderDetailPage(topic.id));
                    item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); renderDetailPage(topic.id); }});
                    resultsContainer.appendChild(item);
                });
            } else resultsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No topics found matching your search.</p>';
            addTapListener(document.getElementById('clear-search-button'), () => { searchInput.value = ''; renderInitialView(); });
            openCategoriesAndHighlight(categoryPath, highlightId);
        }
        function parseTextMarkup(text) {
            let safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            safeText = safeText.replace(/\n/g, "<br>");
            safeText = safeText.replace(/\[\[(.+?)\|(.+?)\]\]/g, (m, disp, info) =>
                `<span class="toggle-info">${disp}<span class="info-text hidden">${info}</span></span>`);
            safeText = safeText.replace(/\{\{red:(.+?)\}\}/g, (m, text) =>
                `<span class="text-red-600 font-semibold">${text}</span>`);
            safeText = safeText.replace(/\{\{redul:(.+?)\}\}/g, (m, text) =>
                `<span class="text-red-600 font-semibold underline decoration-red-600">${text}</span>`);
            safeText = safeText.replace(/\{\{orange:(.+?)\}\}/g, (m, text) =>
                `<span class="text-orange-600">${text}</span>`);
            safeText = safeText.replace(/\{\{blackul:(.+?)\}\}/g, (m, text) =>
                `<span class="font-bold underline decoration-black">${text}</span>`);
            safeText = safeText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            return safeText;
        }
        function createDetailList(itemsArray) { /* ... same as v0.6 ... */
            if (!itemsArray || itemsArray.length === 0) return '<p class="text-gray-500 italic">None listed.</p>';
            return `<ul class="detail-list">${itemsArray.map(item => `<li>${parseTextMarkup(item)}</li>`).join('')}</ul>`;
        }
        function createDetailText(textBlock) { /* enhanced to support toggle-info and red text */
            if (!textBlock || textBlock.trim() === '') return '<p class="text-gray-500 italic">Not specified.</p>';
            const safeText = parseTextMarkup(textBlock);
            return `<div class="detail-text">${safeText}</div>`;
        }
        function createWarningIcon(colorClass = 'text-yellow-600') { /* ... same as v0.6 ... */
            return `<svg class="${colorClass} w-5 h-5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>`;
        }

        function attachToggleInfoHandlers(container) {
            container.querySelectorAll('.toggle-info').forEach(el => {
                addTapListener(el, () => {
                    const info = el.querySelector('.info-text');
                    if (info) info.classList.toggle('hidden');
                });
            });
        }

        function attachToggleCategoryHandlers(container) {
            container.querySelectorAll(".toggle-category").forEach(header => {
                addTapListener(header, () => {
                    const arrow = header.querySelector(".arrow");
                    if (arrow) arrow.classList.toggle("rotate");
                    const content = header.nextElementSibling;
                    if (content) content.classList.toggle('hidden');
                });
            });
        }

        function openCategoriesAndHighlight(categoryPath = [], highlightId = null) {
            // Expand categories along the path
            categoryPath.forEach(catId => {
                const el = contentArea.querySelector(`[data-category-id="${catId}"]`);
                if (el && !el.classList.contains('expanded')) {
                    el.classList.add('expanded');
                    const header = el.querySelector('.category-header');
                    if (header) header.setAttribute('aria-expanded', 'true');
                }
            });
            // Clear previous highlight
            contentArea.querySelectorAll('.topic-link-item.recently-viewed').forEach(el => {
                el.classList.remove('recently-viewed');
            });
            if (highlightId) {
                const topicEl = contentArea.querySelector(`[data-topic-id="${highlightId}"]`);
                if (topicEl) topicEl.classList.add('recently-viewed');
            }
        }

        function renderDetailPage(topicId, scrollToTop = true, shouldAddHistory = true) {
            const topic = allDisplayableTopicsMap[topicId];
            if (!topic) {
                contentArea.innerHTML = `<p class="text-red-600 text-center py-4">Error: Topic not found (ID: ${topicId}).</p>
                    <button id="backButtonDetailError" class="mt-4 block mx-auto px-6 py-2 bg-blue-500 text-white rounded-lg">
                    Back to List</button>`;
                addTapListener(document.getElementById('backButtonDetailError'), () => handleSearch(true));
                return;
            }
            // If coming from a list view, update that history entry with highlight and path
            if (navigationHistory[currentHistoryIndex] && navigationHistory[currentHistoryIndex].viewType === 'list') {
                navigationHistory[currentHistoryIndex].highlightTopicId = topicId;
                navigationHistory[currentHistoryIndex].categoryPath = topic.categoryPath || [];
            }

            if (scrollToTop) { contentArea.scrollTop = 0; window.scrollTo(0, Math.max(0, contentArea.offsetTop - 80))};

            let warningsHtml = '';
            let collectedWarnings = [];

            if (topic.details) { // This is a medication
                // Pediatric Rx Warning
                if (patientData.age !== null && patientData.age < PEDIATRIC_AGE_THRESHOLD) {
                    const pedsRxText = (topic.details.pediatricRx || []).join('').toLowerCase();
                    if (!topic.details.pediatricRx || pedsRxText.length === 0 || pedsRxText.includes("don’t give") || pedsRxText.includes("not approved")) {
                        collectedWarnings.push({ type: 'orange', text: `<strong>PEDIATRIC NOTE:</strong> No specific pediatric dosage listed or not recommended for pediatric use. Patient age: ${patientData.age}. Consider alternative or consult.` });
                    }
                }
                // Contraindication checks based on patient data
                if (topic.details.contraindications && topic.details.contraindications.length > 0) {
                    topic.details.contraindications.forEach(ci => {
                        const ciLower = ci.toLowerCase();
                        // Check against patient's PMH
                        patientData.pmh.forEach(historyItem => {
                            if (ciLower.includes(historyItem)) { // Simple text match
                                collectedWarnings.push({ type: 'red', text: `<strong>CONTRAINDICATION (PMH):</strong> Medication may be contraindicated due to patient history of <strong>${historyItem}</strong> (Related to: "${ci}").` });
                            }
                        });
                        // Check against patient's current medications for interactions
                        patientData.currentMedications.forEach(currentMed => {
                            if (ciLower.includes(currentMed) && !PDE5_INHIBITORS.includes(currentMed)) { // Avoid double warning for PDE5
                                collectedWarnings.push({ type: 'red', text: `<strong>CONTRAINDICATION (Med Interaction):</strong> Patient is taking <strong>${currentMed}</strong> which may interact or be contraindicated (Related to: "${ci}").` });
                            }
                        });

                        // Specific NTG checks (already present, just integrated into new warning system)
                        if (topic.id === 'ntg') {
                            if (ciLower.includes("sbp <100")) {
                                if (patientData.vitalSigns.bp) {
                                    const bpParts = patientData.vitalSigns.bp.split('/');
                                    if (bpParts.length > 0 && parseInt(bpParts[0].trim()) < 100) {
                                        collectedWarnings.push({type: 'red', text: `<strong>CONTRAINDICATION (Low BP):</strong> Patient SBP is ${bpParts[0].trim()} mmHg (Contraindicated if SBP < 100).`});
                                    }
                                }
                            }
                            if (ciLower.includes("phosphodiesterase") || PDE5_INHIBITORS.some(pde => ciLower.includes(pde))) {
                                const usedPde5 = patientData.currentMedications.find(med => PDE5_INHIBITORS.includes(med.toLowerCase()));
                                if (usedPde5) {
                                    collectedWarnings.push({type: 'red', text: `<strong>CONTRAINDICATION (Drug Interaction):</strong> Patient is taking <strong>${usedPde5}</strong>. Recent use of PDE5 inhibitors is a contraindication for NTG.`});
                                }
                            }
                        }
                        // General allergy check
                        patientData.allergies.forEach(allergy => {
                            // Before: using topic.details.title (undefined) – causes error
                            // if (ciLower.includes("hypersensitivity") && topic.details.title.toLowerCase().includes(allergy)) {
                            // After: use topic.title instead
                            if (ciLower.includes("hypersensitivity") && topic.title.toLowerCase().includes(allergy)) {
                                collectedWarnings.push({ type: 'yellow', text: `<strong>ALLERGY ALERT:</strong> Patient has a listed allergy to <strong>${allergy}</strong>. This medication may be contraindicated or require caution.` });
                            }
                        });
                    });
                }
            }
             // Deduplicate warnings
            const uniqueWarnings = []; const seenTexts = new Set();
            collectedWarnings.forEach(w => { if (!seenTexts.has(w.text)) { uniqueWarnings.push(w); seenTexts.add(w.text); }});
            // Sort warnings by severity: red (3), orange (2), yellow (1)
            const severityRank = { red: 3, orange: 2, yellow: 1 };
            uniqueWarnings.sort((a, b) => severityRank[b.type] - severityRank[a.type]);
            const topSeverity = uniqueWarnings[0].type;
            warningsHtml = `<div class="warning-box ${topSeverity === 'red' ? 'warning-box-red' : (topSeverity === 'orange' ? 'warning-box-orange' : 'warning-box-yellow')}">
                ${uniqueWarnings.map(w => `<div>${createWarningIcon(w.type === 'red' ? 'text-red-600' : (w.type === 'orange' ? 'text-orange-600' : 'text-yellow-700'))}<span>${w.text}</span></div>`).join('<hr class="my-1 border-gray-300">')}
            </div>`;

            let weightInKg = patientData.weight; if (patientData.weight && patientData.weightUnit === 'lbs') { weightInKg = patientData.weight / 2.20462; }
            let calculatedDoseInfo = "", weightDosePlaceholder = "";
            /* ... existing dose calculation logic ... */
             if (weightInKg && topic.details && topic.details.concentration) {
                if (topic.id === 'fentanyl-sublimaze' && topic.details.adultRx && topic.details.adultRx.some(rx => rx.toLowerCase().includes("1mcg/kg"))) {
                    const dosePerKg = 1; const vialConcentrationParts = topic.details.concentration.match(/(\d+)mcg\/(\d+)ml/);
                    if (vialConcentrationParts) { const drugAmountInVial = parseFloat(vialConcentrationParts[1]); const volumeInVial = parseFloat(vialConcentrationParts[2]); const concMcgPerMl = drugAmountInVial / volumeInVial; const totalDoseMcg = weightInKg * dosePerKg; const volumeToDrawMl = totalDoseMcg / concMcgPerMl; calculatedDoseInfo = `<p class="text-sm text-green-700 bg-green-50 p-2 rounded-md">Calculated for ${weightInKg.toFixed(1)} kg: <strong>Dose: ${totalDoseMcg.toFixed(1)} mcg. Volume: ${volumeToDrawMl.toFixed(2)} mL.</strong></p>`;}
                }
                if (topic.id === 'etomidate-amidate' && topic.details.adultRx && topic.details.adultRx.some(rx => rx.toLowerCase().includes("0.3mg/kg"))) {
                    const dosePerKg = 0.3; const vialConcentrationParts = topic.details.concentration.match(/(\d+)mg\/(\d+)ml/);
                    if (vialConcentrationParts) { const drugAmountInVial = parseFloat(vialConcentrationParts[1]); const volumeInVial = parseFloat(vialConcentrationParts[2]); const concMgPerMl = drugAmountInVial / volumeInVial; let totalDoseMg = weightInKg * dosePerKg; const maxDoseMatch = topic.details.adultRx.join(' ').match(/Max\s*=\s*(\d+)mg/i); const maxDose = maxDoseMatch ? parseFloat(maxDoseMatch[1]) : null; if (maxDose && totalDoseMg > maxDose) totalDoseMg = maxDose; const volumeToDrawMl = totalDoseMg / concMgPerMl; calculatedDoseInfo = `<p class="text-sm text-green-700 bg-green-50 p-2 rounded-md">Calculated for ${weightInKg.toFixed(1)} kg: <strong>Dose: ${totalDoseMg.toFixed(1)} mg. Volume: ${volumeToDrawMl.toFixed(2)} mL.</strong></p>`;}
                }
            }
            if (!calculatedDoseInfo && weightInKg) weightDosePlaceholder = `<p class="text-sm text-gray-600 italic">(Pt weight ${weightInKg.toFixed(1)} kg. Dose calcs for this drug not yet implemented.)</p>`;


            let patientInfoSummary = ''; /* ... same as v0.6 ... */
            if (patientData.age || patientData.weight || patientData.allergies.length > 0 || patientData.currentMedications.length > 0) {
                patientInfoSummary = `<div class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                    <h4 class="font-semibold text-blue-700 mb-1">Current Patient Snapshot:</h4>
                    ${patientData.age ? `<p><strong>Age:</strong> ${patientData.age} years</p>` : ''}
                    ${patientData.weight ? `<p><strong>Weight:</strong> ${patientData.weight} ${patientData.weightUnit} ${weightInKg ? `(~${weightInKg.toFixed(1)} kg)`:''}</p>` : ''}
                    ${patientData.allergies.length > 0 ? `<p><strong>Allergies:</strong> <span class="font-medium text-red-600">${patientData.allergies.join(', ')}</span></p>` : ''}
                    ${patientData.currentMedications.length > 0 ? `<p><strong>Current Meds:</strong> ${patientData.currentMedications.join(', ')}</p>` : ''}
                </div>`;
            }

            let detailContentHtml = ''; /* ... same as v0.6 ... */
            if (topic.details) {
                const d = topic.details;
                let indicationsHeading = 'Indications:';
                if (topic.id === 'atropine-sulfate') {
                    indicationsHeading += ` <span class="toggle-info" style="color:#2563eb;text-decoration-color:#2563eb">&#x25BC;<span class="info-text hidden" style="color:#15803d;text-decoration-color:#15803d">SLUDGEM pt</span></span>`;
                }
                detailContentHtml = `
                    ${d.notes ? `<div class="detail-section"><p class="text-red-600 font-semibold">${d.notes.join('<br>')}</p></div>` : ''}
                    ${d["class"] ? `<div class="detail-section">
                       <h3 class="detail-section-title toggle-category">Class: <span class="text-blue-600 arrow">&#x25BC;</span></h3>
                       <div class="detail-section-content hidden">
                         ${createDetailText(d["class"])}
                       </div>
                     </div>` : ''}
                    ${d.indications ? `<div class="detail-section">
                          <h3 class="detail-section-title toggle-category">${indicationsHeading} <span class="text-blue-600 arrow">&#x25BC;</span></h3>
                          <div class="detail-section-content hidden">
                            ${createDetailList(d.indications)}
                          </div>
                        </div>` : ''}
                    ${d.contraindications ? `<div class="detail-section">
                                <h3 class="detail-section-title toggle-category">Contraindications: <span class="text-blue-600 arrow">&#x25BC;</span></h3>
                                <div class="detail-section-content hidden">
                                  ${createDetailList(d.contraindications)}
                                </div>
                              </div>` : ''}
                    ${d.precautions ? `<div class="detail-section">
                          <h3 class="detail-section-title toggle-category">Precautions: <span class="text-blue-600 arrow">&#x25BC;</span></h3>
                          <div class="detail-section-content hidden">
                            ${createDetailText(d.precautions)}
                          </div>
                        </div>` : ''}
                    ${d.sideEffects ? `<div class="detail-section">
                          <h3 class="detail-section-title toggle-category">Significant Adverse/Side Effects: <span class="text-blue-600 arrow">&#x25BC;</span></h3>
                          <div class="detail-section-content hidden">
                            ${createDetailList(d.sideEffects)}
                          </div>
                        </div>` : ''}
                    ${calculatedDoseInfo || weightDosePlaceholder ? `<div class="detail-section mt-3">${calculatedDoseInfo}${weightDosePlaceholder}</div>` : ''}
                    ${d.adultRx ? `<div class="detail-section adult-section">
                     <h3 class="detail-section-title toggle-category">Adult Rx: <span class="text-blue-600 arrow">&#x25BC;</span></h3>
                     <div class="detail-section-content hidden">
                       ${createDetailText(d.adultRx.join('\n\n'))}
                     </div>
                   </div>` : ''}
                    ${d.pediatricRx ? `<div class="detail-section pediatric-section">
                         <h3 class="detail-section-title toggle-category">Pediatric Rx: <span class="text-blue-600 arrow">&#x25BC;</span></h3>
                         <div class="detail-section-content hidden">
                           ${createDetailText(d.pediatricRx.join('\n\n'))}
                         </div>
                       </div>` : ''}
            } else {
                detailContentHtml = <p class="text-lg italic">This is a placeholder for <strong>${topic.title}</strong>.</p><p class="text-sm text-gray-600">Detailed information to be added.</p>`;
            }

            contentArea.innerHTML = `
                <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-3 border-b border-gray-200">
                    <h2 class="text-xl md:text-2xl font-bold text-blue-700 mb-2 sm:mb-0 topic-main-title" data-topic-id="${topic.id}">
                        ${topic.title} ${topic.details && topic.details.concentration ? `<span class="med-concentration">${topic.details.concentration}</span>` : ''}
                    </h2>
                    <button id="backToListButton" class="w-full sm:w-auto px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">Back to List View</button>
                </div>
                ${patientInfoSummary}
                ${warningsHtml}
                <div class="bg-gray-50 p-4 rounded-lg shadow-inner space-y-3 text-gray-800">${detailContentHtml}</div>`;
            attachToggleInfoHandlers(contentArea);
            attachToggleCategoryHandlers(contentArea);
            addTapListener(document.getElementById('backToListButton'), () => { /* ... same as v0.6 ... */
                for (let i = currentHistoryIndex -1 ; i >= 0; i--) {
                    if (navigationHistory[i] && navigationHistory[i].viewType === 'list') {
                        isNavigatingViaHistory = true; currentHistoryIndex = i;
                        searchInput.value = navigationHistory[i].contentId || '';
                        handleSearch(false, navigationHistory[i].highlightTopicId, navigationHistory[i].categoryPath || []); updateNavButtonsState(); isNavigatingViaHistory = false; return;
                    }
                }
                renderInitialView(true, null, []);
            });
        }
    function initApp() {
    // **This is the key fix.**
    // We now directly use the global variables ParamedicCategoriesData and medicationDetailsData,
    // which are guaranteed to exist because their scripts were loaded first.
    initializeData(ParamedicCategoriesData, medicationDetailsData);

    // Attach sidebar open/close event handlers
    addTapListener(openSidebarButton, openSidebar);
    addTapListener(closeSidebarButton, closeSidebar);
    addTapListener(sidebarOverlay, closeSidebar);

    // Set up autocomplete suggestions for each Patient Info textarea
    setupAutocomplete('pt-pmh', 'pt-pmh-suggestions', pmhSuggestions);
    setupAutocomplete('pt-allergies', 'pt-allergies-suggestions', allergySuggestions);
    setupAutocomplete('pt-medications', 'pt-medications-suggestions', medicationNameSuggestions);
    setupAutocomplete('pt-indications', 'pt-indications-suggestions', indicationSuggestions);
    setupAutocomplete('pt-symptoms', 'pt-symptoms-suggestions', symptomSuggestions);

    // Attach search input "Enter" key handler to trigger search
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(true);
        }
    });

    // Render the initial hierarchical list view of categories/topics
    renderInitialView(true, null, []);
}

        // --- Event Handler ---
        function handleSearch(shouldAddHistory = true, highlightId = null, categoryPath = []) { /* ... same as v0.6 ... */
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (contentArea.offsetWidth > 0) window.scrollTo(0, Math.max(0, contentArea.offsetTop - 80));
            if (!searchTerm) { renderInitialView(shouldAddHistory, highlightId, categoryPath); return; }
            const filteredTopics = allSearchableTopics.filter(topic =>
                topic.title.toLowerCase().includes(searchTerm) || (topic.path && topic.path.toLowerCase().includes(searchTerm))
            );
            renderSearchResults(filteredTopics, searchTerm, shouldAddHistory, highlightId, categoryPath);
        }





        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp);
        else initApp();