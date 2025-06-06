<!DOCTYPE html>
<!-- Run `npm install` once, then `npm test` to execute Jest. -->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paramedic Quick Reference</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            overscroll-behavior-y: contain; /* Prevents pull-to-refresh on mobile */
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        #patient-sidebar {
            position: fixed; top: 0; left: 0; width: 300px; max-width: 80%; height: 100vh;
            background-color: #f9fafb; /* gray-50 */ border-right: 1px solid #e5e7eb; /* gray-200 */
            padding: 1rem; overflow-y: auto; z-index: 100; transform: translateX(-100%);
            transition: transform 0.3s ease-in-out; box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }
        #patient-sidebar.open { transform: translateX(0); }
        #sidebar-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.5); z-index: 99;
            opacity: 0; visibility: hidden;
            transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
        }
        #sidebar-overlay.active { opacity: 1; visibility: visible; }
        #app-container { display: flex; flex-direction: column; flex-grow: 1; width: 100%; transition: margin-left 0.3s ease-in-out; }

        /* Hierarchical List Styles */
        .category-item > .category-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 0.75rem 1rem; background-color: #f3f4f6; /* gray-100 */
            border: 1px solid #e5e7eb; /* gray-200 */ border-radius: 0.375rem; cursor: pointer;
            font-weight: 500; transition: background-color 0.2s;
        }
        .category-item > .category-header:hover { background-color: #e5e7eb; /* gray-200 */ }
        .category-children {
            display: none; padding-left: 1rem; /* Indentation */ margin-top: 0.25rem;
            border-left: 2px solid #d1d5db; /* gray-300 */
        }
        .category-item.expanded > .category-children { display: block; }
        .category-item.expanded > .category-header .icon-toggle-open { display: inline-block; }
        .category-item.expanded > .category-header .icon-toggle-closed { display: none; }
        .icon-toggle-open { display: none; } .icon-toggle-closed { display: inline-block; }

        .topic-link-item {
            display: block; padding: 0.6rem 1rem; background-color: #ffffff;
            border: 1px solid #e5e7eb; border-radius: 0.375rem; margin-top: 0.25rem;
            cursor: pointer; transition: background-color 0.2s, transform 0.1s;
        }
        .topic-link-item:hover { background-color: #e0f2fe; /* sky-100 */ }
        .topic-link-item:active { transform: scale(0.98); }
        .search-topic-item {
            padding: 0.75rem 1rem; background-color: #f9fafb; border-radius: 0.375rem;
            cursor: pointer; border: 1px solid #e5e7eb; margin-bottom: 0.5rem;
        }
        .search-topic-item:hover { background-color: #e0f2fe; }

        .sidebar-input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #d1d5db; /* gray-300 */
            border-radius: 0.375rem; /* rounded-md */
            font-size: 0.875rem; /* text-sm */
            line-height: 1.25rem;
            outline: none;
        }
        .sidebar-input:focus {
            box-shadow: 0 0 0 2px #3b82f6; /* ring-2 ring-blue-500 */
            border-color: #3b82f6; /* border-blue-500 */
        }
        .sidebar-label {
            display: block;
            font-size: 0.875rem; /* text-sm */
            line-height: 1.25rem;
            font-weight: 500; /* font-medium */
            color: #374151; /* gray-700 */
            margin-bottom: 0.25rem; /* mb-1 */
        }
        .sidebar-section {
            margin-top: 1rem; /* mt-4 */
            padding-top: 1rem; /* pt-4 */
            border-top: 1px solid #e5e7eb; /* border-gray-200 */
        }
        .sidebar-section-title {
            font-size: 1.125rem; /* text-lg */
            font-weight: 600; /* font-semibold */
            color: #2563eb; /* blue-600 */
            margin-bottom: 0.5rem; /* mb-2 */
        }

        /* Autocomplete Styles */
        .autocomplete-container { position: relative; }
        .autocomplete-suggestions {
            position: absolute; border: 1px solid #d1d5db; /* gray-300 */
            border-top: none; z-index: 101; /* Above sidebar content, below modal if any */
            max-height: 150px; overflow-y: auto;
            background-color: white; width: 100%;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 0 0 0.375rem 0.375rem;
        }
        .autocomplete-suggestion-item {
            padding: 0.5rem; cursor: pointer;
            font-size: 0.875rem; /* text-sm */
        }
        .autocomplete-suggestion-item:hover { background-color: #e0f2fe; /* sky-100 */ }
        .hidden { display: none !important; }


        /* Medication Detail Page Styles */
        .detail-section { margin-bottom: 1rem; }
        .detail-section-title {
            font-size: 1rem; /* text-base */
            font-weight: 600; /* font-semibold */
            color: #1d4ed8; /* blue-700 */
            border-bottom: 1px solid #bfdbfe; /* border-blue-200 */
            padding-bottom: 0.25rem; /* pb-1 */
            margin-bottom: 0.5rem; /* mb-2 */
        }
        .detail-list {
            list-style-type: disc;
            list-style-position: inside;
            padding-left: 0.5rem; /* pl-2 */
            color: #374151; /* gray-700 */
        }
        .detail-list li + li { margin-top: 0.25rem; /* space-y-1 */ }
        .detail-text {
            color: #374151; /* gray-700 */
            white-space: pre-line;
        }
        .med-concentration {
            font-size: 0.875rem; /* text-sm */
            line-height: 1.25rem;
            color: #6b7280; /* gray-500 */
            margin-left: 0.5rem; /* ml-2 */
        }

        .toggle-info {
            color: #15803d;
            cursor: pointer;
            text-decoration-line: underline;
            text-decoration-color: #15803d;
            text-underline-offset: 2px;
        }
        .toggle-info:hover {
            color: #065f46;
            background-color: #d1fae5;
        }
        .toggle-info .info-text { margin-left: 0.25rem; }

        /* Header Navigation Buttons */
        .header-nav-button {
            padding: 0.5rem; /* p-2 */
            border-radius: 0.375rem; /* rounded-md */
            color: #ffffff; /* text-white */
        }
        .header-nav-button:hover { background-color: #1d4ed8; /* bg-blue-700 */ }
        .header-nav-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        /* Warning Messages Styling */
        .warning-box {
            margin-top: 1rem; /* my-4 */
            margin-bottom: 1rem;
            padding: 0.75rem; /* p-3 */
            border: 1px solid #d1d5db; /* border */
            border-radius: 0.375rem; /* rounded-md */
            font-size: 0.875rem; /* text-sm */
        }
        .warning-box > * + * { margin-top: 0.5rem; /* space-y-2 */ }
        .warning-box-red {
            border-color: #f87171; /* border-red-400 */
            background-color: #fef2f2; /* bg-red-50 */
            color: #b91c1c; /* text-red-700 */
        }
        .warning-box-orange {
            border-color: #fb923c; /* border-orange-400 */
            background-color: #fff7ed; /* bg-orange-50 */
            color: #c2410c; /* text-orange-700 */
        }
        .warning-box-yellow {
            border-color: #facc15; /* border-yellow-400 */
            background-color: #fefce8; /* bg-yellow-50 */
            color: #713f12; /* text-yellow-800 */
        }
        .warning-box div { display: flex; align-items: flex-start; }
        .warning-box svg {
            width: 1.25rem; /* w-5 */
            height: 1.25rem; /* h-5 */
            margin-right: 0.5rem; /* mr-2 */
            flex-shrink: 0;
        }


        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-gray-100">

    <aside id="patient-sidebar">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-blue-700">Patient Info</h2>
            <button id="close-sidebar-button" class="p-1 rounded-md hover:bg-gray-200" aria-label="Close Patient Info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-600"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <div><label for="pt-age" class="sidebar-label">Age (Years):</label><input type="number" id="pt-age" class="sidebar-input" placeholder="e.g., 35"></div>
        <div class="mt-3">
            <label for="pt-weight" class="sidebar-label">Weight:</label>
            <div class="flex space-x-2"><input type="number" id="pt-weight" class="sidebar-input w-2/3" placeholder="e.g., 70"><select id="pt-weight-unit" class="sidebar-input w-1/3"><option value="kg">kg</option><option value="lbs">lbs</option></select></div>
        </div>
        <div class="mt-3 autocomplete-container">
            <label for="pt-pmh" class="sidebar-label">Past Medical History (PMH):</label>
            <textarea id="pt-pmh" class="sidebar-input" rows="2" placeholder="Type or select, comma separated..."></textarea>
            <div id="pt-pmh-suggestions" class="autocomplete-suggestions hidden"></div>
        </div>
        <div class="mt-3 autocomplete-container">
            <label for="pt-allergies" class="sidebar-label">Allergies:</label>
            <textarea id="pt-allergies" class="sidebar-input" rows="2" placeholder="Type or select, comma separated..."></textarea>
            <div id="pt-allergies-suggestions" class="autocomplete-suggestions hidden"></div>
        </div>
         <div class="mt-3 autocomplete-container">
            <label for="pt-medications" class="sidebar-label">Current Medications:</label>
            <textarea id="pt-medications" class="sidebar-input" rows="2" placeholder="Type or select, comma separated..."></textarea>
            <div id="pt-medications-suggestions" class="autocomplete-suggestions hidden"></div>
        </div>
        <div class="mt-3 autocomplete-container">
            <label for="pt-symptoms" class="sidebar-label">Signs/Symptoms (S/S):</label>
            <textarea id="pt-symptoms" class="sidebar-input" rows="3" placeholder="Type or select, comma separated..."></textarea>
            <div id="pt-symptoms-suggestions" class="autocomplete-suggestions hidden"></div>
        </div>
        <div class="sidebar-section">
            <h3 class="sidebar-section-title">Vital Signs (VS)</h3>
            <div class="grid grid-cols-2 gap-x-3 gap-y-2">
                <div><label for="vs-bp" class="sidebar-label">BP (e.g. 120/80):</label><input type="text" id="vs-bp" class="sidebar-input" placeholder="120/80"></div>
                <div><label for="vs-hr" class="sidebar-label">HR:</label><input type="number" id="vs-hr" class="sidebar-input" placeholder="70"></div>
                <div><label for="vs-spo2" class="sidebar-label">SpO2 (%):</label><input type="number" id="vs-spo2" class="sidebar-input" placeholder="98"></div>
                <div><label for="vs-etco2" class="sidebar-label">ETCO2:</label><input type="number" id="vs-etco2" class="sidebar-input" placeholder="38"></div>
                <div><label for="vs-rr" class="sidebar-label">RR:</label><input type="number" id="vs-rr" class="sidebar-input" placeholder="16"></div>
                <div><label for="vs-bgl" class="sidebar-label">BGL:</label><input type="text" id="vs-bgl" class="sidebar-input" placeholder="90 or HI"></div>
                <div><label for="vs-eyes" class="sidebar-label">Eyes:</label><input type="text" id="vs-eyes" class="sidebar-input" placeholder="PERRL"></div>
                <div><label for="vs-gcs" class="sidebar-label">GCS:</label><input type="number" id="vs-gcs" class="sidebar-input" placeholder="15"></div>
            </div>
            <div class="mt-2"><label for="vs-ao-status" class="sidebar-label">A&O Status:</label><input type="text" id="vs-ao-status" class="sidebar-input" placeholder="x4, Confused"></div>
            <div class="mt-2"><label for="vs-lung-sounds" class="sidebar-label">Lung Sounds:</label><textarea id="vs-lung-sounds" class="sidebar-input" rows="2" placeholder="Clear B/L, Wheezes"></textarea></div>
        </div>
        <div class="sidebar-section">
            <h3 class="sidebar-section-title">EKG</h3><textarea id="pt-ekg" class="sidebar-input" rows="3" placeholder="Placeholder for EKG findings..."></textarea>
        </div>
    </aside>
    <div id="sidebar-overlay"></div>

    <div id="app-container">
        <header class="bg-blue-600 text-white p-4 sticky top-0 z-40 shadow-md">
            <div class="container mx-auto flex items-center justify-between">
                <button id="open-sidebar-button" class="header-nav-button" aria-label="Open Patient Info Sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </button>
                <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-center flex-grow px-2">Paramedic Quick Ref</h1>
                <div class="flex items-center space-x-1">
                    <button id="nav-back-button" class="header-nav-button" aria-label="Navigate Back" title="Back" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    </button>
                    <button id="nav-forward-button" class="header-nav-button" aria-label="Navigate Forward" title="Forward" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </button>
                </div>
            </div>
            <div class="mt-3">
                <input type="search" id="searchInput" placeholder="Search topics or medications..." class="w-full p-3 rounded-lg border-2 border-blue-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300" aria-label="Search Treatment Information"/>
            </div>
        </header>

        <main class="container mx-auto p-4 flex-grow">
            <div id="content-area" class="bg-white p-3 md:p-6 rounded-lg shadow-lg min-h-[calc(100vh-200px)]">
                <p class="text-gray-500 text-center">Loading categories...</p>
            </div>
        </main>

        <footer class="text-center p-4 text-gray-500 text-sm mt-2">App Version 0.7</footer>
    </div>

    <script src="slugify.js"></script>
    <script>
        // --- DOM Elements ---
        const searchInput = document.getElementById('searchInput');
        const contentArea = document.getElementById('content-area');
        const patientSidebar = document.getElementById('patient-sidebar');
        const openSidebarButton = document.getElementById('open-sidebar-button');
        const closeSidebarButton = document.getElementById('close-sidebar-button');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const navBackButton = document.getElementById('nav-back-button');
        const navForwardButton = document.getElementById('nav-forward-button');

        // --- Patient Data Object & Sidebar Inputs ---
        let patientData = {
            age: null, weight: null, weightUnit: 'kg', pmh: [], allergies: [], currentMedications: [],
            symptoms: [], // Changed to array for consistency if S/S also becomes tag-based
            vitalSigns: { bp: '', hr: null, spo2: null, etco2: null, rr: null, bgl: '', eyes: '', gcs: null, aoStatus: '', lungSounds: '' },
            ekg: ''
        };
        const ptInputIds = [ /* IDs of all patient data inputs */
            'pt-age', 'pt-weight', 'pt-weight-unit', 'pt-pmh', 'pt-allergies', 'pt-medications', 'pt-symptoms',
            'vs-bp', 'vs-hr', 'vs-spo2', 'vs-etco2', 'vs-rr', 'vs-bgl', 'vs-eyes', 'vs-gcs',
            'vs-ao-status', 'vs-lung-sounds', 'pt-ekg'
        ];
        const ptInputs = ptInputIds.map(id => document.getElementById(id));

        // --- Navigation History ---
        let navigationHistory = [];
        let currentHistoryIndex = -1;
        let isNavigatingViaHistory = false;

        // --- Hierarchical Data, Flat Search List, Medication Details ---
        let paramedicCategories = [];
        let allSearchableTopics = [];
        let allDisplayableTopicsMap = {};
        let medicationDetailsData = {};
        const PEDIATRIC_AGE_THRESHOLD = 18;
        const PDE5_INHIBITORS = ["sildenafil", "viagra", "revatio", "vardenafil", "levitra", "tadalafil", "cialis", "adcirca"];

        // --- Autocomplete Data Stores ---
        let pmhSuggestions = new Set();
        let allergySuggestions = new Set();
        let medicationNameSuggestions = new Set(); // For "Current Medications" field
        let symptomSuggestions = new Set([
            "chest pain", "shortness of breath", "sob", "dyspnea", "nausea", "vomiting", "diarrhea", "abdominal pain",
            "headache", "dizziness", "syncope", "altered mental status", "ams", "weakness", "fatigue", "fever",
            "chills", "rash", "seizure", "palpitations", "edema", "cough", "anxiety", "depression", "back pain", "trauma"
        ]); // Basic list, can be expanded


        // --- Utility Function ---
        // slugify is loaded from slugify.js
        // You can also generate branch names with this helper:
        //   node slugify.js "Administrative & Legal Essentials"
        // yields "administrative-legal-essentials"

        // --- Sidebar Logic ---
        function openSidebar() { patientSidebar.classList.add('open'); sidebarOverlay.classList.add('active'); }
        function closeSidebar() { patientSidebar.classList.remove('open'); sidebarOverlay.classList.remove('active'); }
        openSidebarButton.addEventListener('click', openSidebar);
        closeSidebarButton.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);

        function updatePatientData() {
            patientData.age = document.getElementById('pt-age').value ? parseInt(document.getElementById('pt-age').value) : null;
            patientData.weight = document.getElementById('pt-weight').value ? parseFloat(document.getElementById('pt-weight').value) : null;
            patientData.weightUnit = document.getElementById('pt-weight-unit').value;
            const getArrayFromTextarea = (id) => document.getElementById(id).value.trim() ? document.getElementById(id).value.split(',').map(item => item.trim().toLowerCase()).filter(item => item) : [];
            patientData.pmh = getArrayFromTextarea('pt-pmh');
            patientData.allergies = getArrayFromTextarea('pt-allergies');
            patientData.currentMedications = getArrayFromTextarea('pt-medications');
            patientData.symptoms = getArrayFromTextarea('pt-symptoms'); // Now an array
            patientData.vitalSigns = {
                bp: document.getElementById('vs-bp').value.trim(),
                hr: document.getElementById('vs-hr').value ? parseInt(document.getElementById('vs-hr').value) : null,
                spo2: document.getElementById('vs-spo2').value ? parseInt(document.getElementById('vs-spo2').value) : null,
                etco2: document.getElementById('vs-etco2').value ? parseInt(document.getElementById('vs-etco2').value) : null,
                rr: document.getElementById('vs-rr').value ? parseInt(document.getElementById('vs-rr').value) : null,
                bgl: document.getElementById('vs-bgl').value.trim(),
                eyes: document.getElementById('vs-eyes').value.trim(),
                gcs: document.getElementById('vs-gcs').value ? parseInt(document.getElementById('vs-gcs').value) : null,
                aoStatus: document.getElementById('vs-ao-status').value.trim(),
                lungSounds: document.getElementById('vs-lung-sounds').value.trim()
            };
            patientData.ekg = document.getElementById('pt-ekg').value.trim();

            const currentTopicTitleEl = contentArea.querySelector('h2.topic-main-title');
            if (currentTopicTitleEl) {
                const currentTopicId = currentTopicTitleEl.dataset.topicId;
                if (currentTopicId && allDisplayableTopicsMap[currentTopicId]) {
                    renderDetailPage(currentTopicId, false, false);
                }
            }
        }
        ptInputs.forEach(input => { if (input) input.addEventListener('input', updatePatientData); });

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

            suggestionsContainer.addEventListener('click', function(e) {
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
        function navigateViaHistory(direction) { if ((direction === -1 && currentHistoryIndex <= 0) || (direction === 1 && currentHistoryIndex >= navigationHistory.length - 1)) return; isNavigatingViaHistory = true; currentHistoryIndex += direction; const state = navigationHistory[currentHistoryIndex]; if (state.viewType === 'list') { searchInput.value = state.contentId || ''; handleSearch(false); } else if (state.viewType === 'detail') { renderDetailPage(state.contentId, true, false); } updateNavButtonsState(); isNavigatingViaHistory = false; }
        navBackButton.addEventListener('click', () => navigateViaHistory(-1));
        navForwardButton.addEventListener('click', () => navigateViaHistory(1));

        // --- Hierarchical List Rendering (same as v0.6) ---
        function createHierarchicalList(items, container) { /* ... same as v0.6 ... */
             items.forEach(item => {
                const listItem = document.createElement('div'); listItem.className = 'py-1';
                if (item.type === 'category') {
                    listItem.classList.add('category-item');
                    const header = document.createElement('div'); header.className = 'category-header';
                    header.innerHTML = `<span>${item.title}</span><span class="icon-toggle"><svg class="w-5 h-5 icon-toggle-closed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg><svg class="w-5 h-5 icon-toggle-open" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" /></svg></span>`;
                    header.setAttribute('role', 'button'); header.setAttribute('aria-expanded', 'false'); header.setAttribute('tabindex', '0');
                    const childrenContainer = document.createElement('div'); childrenContainer.className = 'category-children';
                    header.addEventListener('click', () => { listItem.classList.toggle('expanded'); header.setAttribute('aria-expanded', listItem.classList.contains('expanded').toString()); });
                    header.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); listItem.classList.toggle('expanded'); header.setAttribute('aria-expanded', listItem.classList.contains('expanded').toString()); }});
                    listItem.appendChild(header); listItem.appendChild(childrenContainer);
                    if (item.children && item.children.length > 0) createHierarchicalList(item.children, childrenContainer);
                } else if (item.type === 'topic') {
                    const topicLink = document.createElement('a'); topicLink.className = 'topic-link-item';
                    topicLink.textContent = item.title; topicLink.href = `#${item.id}`; topicLink.dataset.topicId = item.id;
                    topicLink.setAttribute('role', 'button'); topicLink.setAttribute('tabindex', '0');
                    topicLink.addEventListener('click', (e) => { e.preventDefault(); renderDetailPage(item.id); });
                    topicLink.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); renderDetailPage(item.id); }});
                    listItem.appendChild(topicLink);
                }
                container.appendChild(listItem);
            });
        }


        // --- View Rendering Functions ---
        function renderInitialView(shouldAddHistory = true) { /* ... same as v0.6 ... */
            if (shouldAddHistory) addHistoryEntry({ viewType: 'list', contentId: '' });
            contentArea.innerHTML = `<p class="text-gray-600 text-center mb-4 text-sm md:text-base">Use the <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block align-text-bottom"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg> button for patient info. Browse categories below or use search.</p><div id="hierarchical-list-container" class="space-y-2"></div>`;
            const listContainer = document.getElementById('hierarchical-list-container');
            if (paramedicCategories.length > 0) createHierarchicalList(paramedicCategories, listContainer);
            else listContainer.innerHTML = '<p class="text-gray-500 text-center">No categories available.</p>';
        }
        function renderSearchResults(filteredTopics, searchTerm, shouldAddHistory = true) { /* ... same as v0.6 ... */
            if (shouldAddHistory) addHistoryEntry({ viewType: 'list', contentId: searchTerm });
            contentArea.innerHTML = `<div class="flex justify-between items-center mb-3"><p class="text-gray-700 font-medium">Results for "${searchTerm}":</p><button id="clear-search-button" class="text-sm text-blue-600 hover:text-blue-800 hover:underline">Show All Categories</button></div><div id="results-container" class="space-y-2"></div>`;
            const resultsContainer = document.getElementById('results-container');
            if (filteredTopics.length > 0) {
                 filteredTopics.forEach(topic => {
                    const item = document.createElement('div'); item.className = 'search-topic-item'; item.textContent = topic.title;
                    if (topic.path) { const pathEl = document.createElement('div'); pathEl.className = 'text-xs text-gray-500 mt-1'; pathEl.textContent = topic.path.split(' > ').slice(0, -1).join(' > '); item.appendChild(pathEl); }
                    item.dataset.topicId = topic.id; item.setAttribute('role', 'button'); item.setAttribute('tabindex', '0');
                    item.addEventListener('click', () => renderDetailPage(topic.id));
                    item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); renderDetailPage(topic.id); }});
                    resultsContainer.appendChild(item);
                });
            } else resultsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No topics found matching your search.</p>';
            document.getElementById('clear-search-button').addEventListener('click', () => { searchInput.value = ''; renderInitialView(); });
        }
        function createDetailList(itemsArray) { /* ... same as v0.6 ... */
            if (!itemsArray || itemsArray.length === 0) return '<p class="text-gray-500 italic">None listed.</p>';
            return `<ul class="detail-list">${itemsArray.map(item => `<li>${item}</li>`).join('')}</ul>`;
        }
        function createDetailText(textBlock) { /* enhanced to support toggle-info and red text */
            if (!textBlock || textBlock.trim() === '') return '<p class="text-gray-500 italic">Not specified.</p>';
            let safeText = textBlock.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            safeText = safeText.replace(/\n/g, "<br>");
            safeText = safeText.replace(/\[\[(.+?)\|(.+?)\]\]/g, (m, disp, info) =>
                `<span class="toggle-info">${disp}<span class="info-text hidden">${info}</span></span>`);
            safeText = safeText.replace(/\{\{red:(.+?)\}\}/g, (m, text) =>
                `<span class="text-red-600 font-semibold">${text}</span>`);
            safeText = safeText.replace(/\{\{redul:(.+?)\}\}/g, (m, text) =>
                `<span class="text-red-600 font-semibold underline decoration-red-600">${text}</span>`);
            safeText = safeText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            return `<div class="detail-text">${safeText}</div>`;
        }
        function createWarningIcon(colorClass = 'text-yellow-600') { /* ... same as v0.6 ... */
            return `<svg class="${colorClass} w-5 h-5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>`;
        }

        function attachToggleInfoHandlers(container) {
            container.querySelectorAll('.toggle-info').forEach(el => {
                el.addEventListener('click', () => {
                    const info = el.querySelector('.info-text');
                    if (info) info.classList.toggle('hidden');
                });
            });
        }

        function renderDetailPage(topicId, scrollToTop = true, shouldAddHistory = true) { /* ... warning logic updated ... */
            if (shouldAddHistory) addHistoryEntry({ viewType: 'detail', contentId: topicId });
            const topic = allDisplayableTopicsMap[topicId];
            if (!topic) { /* ... error handling ... */
                contentArea.innerHTML = `<p class="text-red-600 text-center py-4">Error: Topic not found (ID: ${topicId}).</p><button id="backButtonDetailError" class="mt-4 block mx-auto px-6 py-2 bg-blue-500 text-white rounded-lg">Back to List</button>`;
                document.getElementById('backButtonDetailError').addEventListener('click', () => handleSearch(true));
                return;
            }

            if (scrollToTop) { contentArea.scrollTop = 0; window.scrollTo(0, Math.max(0, contentArea.offsetTop - 80));}

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
                            if (ciLower.includes(allergy) || (ciLower.includes("hypersensitivity") && topic.details.title.toLowerCase().includes(allergy))) {
                                 collectedWarnings.push({type: 'yellow', text: `<strong>ALLERGY ALERT:</strong> Patient has a listed allergy to <strong>${allergy}</strong>. This medication may be contraindicated or require caution.`});
                            }
                        });
                    });
                }
            }
             // Deduplicate warnings
            const uniqueWarnings = []; const seenTexts = new Set();
            collectedWarnings.forEach(w => { if (!seenTexts.has(w.text)) { uniqueWarnings.push(w); seenTexts.add(w.text); }});
            if (uniqueWarnings.length > 0) {
                warningsHtml = `<div class="warning-box ${uniqueWarnings.sort((a,b) => (a.type === 'red' ? -1 : b.type === 'red' ? 1 : 0))[0].type === 'red' ? 'warning-box-red' : (uniqueWarnings[0].type === 'orange' ? 'warning-box-orange' : 'warning-box-yellow')}">
                    ${uniqueWarnings.map(w => `<div>${createWarningIcon(w.type === 'red' ? 'text-red-600' : (w.type === 'orange' ? 'text-orange-600' : 'text-yellow-700'))}<span>${w.text}</span></div>`).join('<hr class="my-1 border-gray-300">')}
                </div>`;
            }

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
                detailContentHtml = `
                    ${d.notes ? `<div class="detail-section"><p class="text-red-600 font-semibold">${d.notes.join('<br>')}</p></div>` : ''}
                    ${d.class ? `<div class="detail-section"><h3 class="detail-section-title">Class:</h3>${createDetailText(d.class)}</div>` : ''}
                    ${d.indications ? `<div class="detail-section"><h3 class="detail-section-title">Indications:</h3>${createDetailList(d.indications)}</div>` : ''}
                    ${d.contraindications ? `<div class="detail-section"><h3 class="detail-section-title">Contraindications:</h3>${createDetailList(d.contraindications)}</div>` : ''}
                    ${d.precautions ? `<div class="detail-section"><h3 class="detail-section-title">Precautions:</h3>${createDetailText(d.precautions)}</div>` : ''}
                    ${d.sideEffects ? `<div class="detail-section"><h3 class="detail-section-title">Significant Adverse/Side Effects:</h3>${createDetailList(d.sideEffects)}</div>` : ''}
                    ${calculatedDoseInfo || weightDosePlaceholder ? `<div class="detail-section mt-3">${calculatedDoseInfo}${weightDosePlaceholder}</div>` : ''}
                    ${d.adultRx ? `<div class="detail-section"><h3 class="detail-section-title">Adult Rx:</h3>${createDetailText(d.adultRx.join('\n\n'))}</div>` : ''}
                    ${d.pediatricRx ? `<div class="detail-section"><h3 class="detail-section-title">Pediatric Rx:</h3>${createDetailText(d.pediatricRx.join('\n\n'))}</div>` : ''}`;
            } else {
                detailContentHtml = `<p class="text-lg italic">This is a placeholder for <strong>${topic.title}</strong>.</p><p class="text-sm text-gray-600">Detailed information to be added.</p>`;
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
            document.getElementById('backToListButton').addEventListener('click', () => { /* ... same as v0.6 ... */
                for (let i = currentHistoryIndex -1 ; i >= 0; i--) {
                    if (navigationHistory[i] && navigationHistory[i].viewType === 'list') {
                        isNavigatingViaHistory = true; currentHistoryIndex = i;
                        searchInput.value = navigationHistory[i].contentId || '';
                        handleSearch(false); updateNavButtonsState(); isNavigatingViaHistory = false; return;
                    }
                }
                renderInitialView();
            });
        }

        // --- Event Handler ---
        function handleSearch(shouldAddHistory = true) { /* ... same as v0.6 ... */
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (contentArea.offsetWidth > 0) window.scrollTo(0, Math.max(0, contentArea.offsetTop - 80));
            if (!searchTerm) { renderInitialView(shouldAddHistory); return; }
            const filteredTopics = allSearchableTopics.filter(topic =>
                topic.title.toLowerCase().includes(searchTerm) || (topic.path && topic.path.toLowerCase().includes(searchTerm))
            );
            renderSearchResults(filteredTopics, searchTerm, shouldAddHistory);
        }


        // --- Initialization ---
        function initializeData(categoriesData, medDetails) {
            paramedicCategories = categoriesData;
            medicationDetailsData = medDetails;
            allSearchableTopics = []; allDisplayableTopicsMap = {};

            // Predefined suggestion lists (can be expanded)
            const commonPmh = ["hypertension", "htn", "diabetes", "dm", "asthma", "copd", "heart failure", "hf", "cad", "coronary artery disease", "stroke", "cva", "seizure disorder", "renal insufficiency", "ckd", "hypothyroidism", "hyperthyroidism", "glaucoma", "peptic ulcer disease", "gerd", "schizophrenia", "anxiety", "depression"];
            const commonAllergies = ["penicillin", "sulfa", "aspirin", "nsaids", "morphine", "codeine", "iodine", "shellfish", "latex", "peanuts", "tree nuts"];
            const commonMedNames = ["lisinopril", "metformin", "atorvastatin", "amlodipine", "hydrochlorothiazide", "hctz", "simvastatin", "albuterol", "levothyroxine", "gabapentin", "omeprazole", "losartan", "sertraline", "furosemide", "lasix", "insulin", "warfarin", "coumadin", "aspirin", "clopidogrel", "plavix"];

            commonPmh.forEach(term => pmhSuggestions.add(term));
            commonAllergies.forEach(term => allergySuggestions.add(term));
            commonMedNames.forEach(term => medicationNameSuggestions.add(term));
            PDE5_INHIBITORS.forEach(term => medicationNameSuggestions.add(term));


            // Extract terms from medication contraindications
            Object.values(medDetails).forEach(med => {
                if (med.contraindications) {
                    med.contraindications.forEach(ci => {
                        const ciLower = ci.toLowerCase();
                        // Simple keyword extraction for PMH/Allergies/Meds
                        // This is basic and can be improved with more sophisticated NLP or tagging
                        if (ciLower.includes("hypersensitivity") || ciLower.includes("allergy to")) {
                            // Attempt to extract the substance of allergy
                            let allergen = ciLower.replace("known hypersensitivity to", "").replace("allergy to any nsaid (including asa)", "nsaid allergy").replace("allergy to", "").trim();
                            if (allergen.includes("local anesthetic allergy in the amide class")) allergen = "amide anesthetic allergy";
                            else if (allergen.includes("nsaid (including asa)")) allergen = "nsaid allergy";
                            else allergen = allergen.split('(')[0].trim(); // Remove details in parentheses
                            if (allergen && allergen.length > 2 && allergen.length < 30) allergySuggestions.add(allergen);
                        } else if (ciLower.includes("sbp <") || ciLower.includes("hr <")) {
                            pmhSuggestions.add("hypotension");
                            if(ciLower.includes("hr <")) pmhSuggestions.add("bradycardia");
                        } else if (ciLower.includes("glaucoma")) pmhSuggestions.add("glaucoma");
                        else if (ciLower.includes("renal insufficiency")) pmhSuggestions.add("renal insufficiency");
                        else if (ciLower.includes("peptic ulcer") || ciLower.includes("gi bleeding")) pmhSuggestions.add("peptic ulcer disease/gi bleed");
                        else if (ciLower.includes("asthma")) pmhSuggestions.add("asthma");
                        else if (ciLower.includes("heart failure")) pmhSuggestions.add("heart failure");
                        else if (ciLower.includes("cardiac ischemia") || ciLower.includes("infarction") || ciLower.includes("cad")) pmhSuggestions.add("cardiac ischemia/cad");
                        else if (ciLower.includes("schizophrenia")) pmhSuggestions.add("schizophrenia");
                        else if (ciLower.includes("digitalis toxicity")) medicationNameSuggestions.add("digitalis");
                        else if (ciLower.includes("phosphodiesterase")) {
                            pmhSuggestions.add("PDE5 inhibitor use"); // As a condition/history
                            PDE5_INHIBITORS.forEach(pde => medicationNameSuggestions.add(pde));
                        }
                        // Add more specific term extractions here
                    });
                }
            });


            function processItem(item, parentPath = '') { /* ... same as v0.6 ... */
                const currentPath = parentPath ? `${parentPath} > ${item.title}` : item.title;
                let fullItemDetails = { ...item, path: currentPath };
                if (item.type === 'topic' && medicationDetailsData[item.id]) {
                    fullItemDetails.details = medicationDetailsData[item.id];
                }
                allDisplayableTopicsMap[item.id] = fullItemDetails;
                if (item.type === 'topic') allSearchableTopics.push({ id: item.id, title: item.title, path: currentPath });
                if (item.children) item.children.forEach(child => processItem(child, currentPath));
            }
            paramedicCategories.forEach(category => processItem(category));
        }


        document.addEventListener('DOMContentLoaded', () => {
            const medicationDetails = { /* ... All medication details from v0.6 ... */
                '10-calcium-chloride': { title: "10% Calcium Chloride", concentration: "(1,000mg/10ml)", class: "Electrolyte", indications: ["Hyperkalemia", "Symptomatic ↑HR", "Toxic Ingestion"], contraindications: ["Known hypersensitivity", "Digitalis toxicity"], precautions: "Rx slowly unless: Cardiac Arrest.", sideEffects: ["↓HR", "VF", "Extravasation Necrosis", "Abdominal Pain", "N/V"], adultRx: ["[[Mg OD|from Bronchospasm in Eclampsia]] Rx: 1g IV", "Hyperkalemia Rx: 1g IVP/IO", "[[↓BP + Wide-QRS symptomatic rhythm|Implies Hyperkalemia]] Rx: Consult to give 1g IVP", "RRWCT >5mm c̅ HR <150 Rx: 1g IVP", "Repeat Rx if QRS Narrows p̄ Ca **do not give Lidocaine**", "Ca/β-Blocker OD c̅ ↓HR Rx: Consult to give 1g slow IVP"], pediatricRx: ["{{red:Don’t give Calcium Chloride to Pediatric pts}}"] },
                '2-lidocaine-xylocaine': { title: "2% Lidocaine (Xylocaine)", concentration: "(100mg/5ml)", class: "Antiarrhythmic", indications: ["Symptomatic ↑HR & VF/pVT"], contraindications: ["Hypersensitivity or Local anesthetic allergy in the amide class", "AV block >1º in the absence of a pacemaker", "Idioventricular escape rhythm s̄ pacemaker", "Stokes-Adams syndrome", "WPW syndrome"], precautions: "[[Give ↓ Maintenance Infusions for:|Prolonged Plasma half-life]] >70yo, CHF, or hepatic failure.\nDon’t Rx if Idioventricular escape rhythm s̄ a pacemaker is Present.", sideEffects: ["Drowsiness", "Paresthesia", "Slurred speech", "[[Nystagmus|early sign of toxicity]]", "[[Seizures|severe toxicity]]"], adultRx: ["VT Rx: 1-1.5mg/kg slow IVP over 2-3min,\n      If n/c p̄ 5min, [[then give 0.5-0.75mg/kg|Max = 3mg/kg]]", "P̄-ROSC Stabilization Rx: Consult to give 2mg/min IV Maintenance Infusion", "EZ-IO Rx: 2ml over 60-90sec\n      → Flush c̅ 5-10ml NS rapidly over 5sec\n            → Then give 1ml over 30sec"] },
                '8-4-sodium-bicarbonate-nahco3': { title: "8.4% Sodium Bicarbonate (NaHCO₃)", concentration: "(50mEq/50ml)", notes: ["***Given separately from other drugs***"], class: "[[Alkalizing|buffering]] agent", indications: ["[[Fall or Weakness|probably only for suspected hyperkalemia]]", "Hyperkalemia", "Symptomatic ↑HR", "Toxic Ingestion"], precautions: "Bicarb precipitates/Interacts c̅ multiple Rx’s\n      {{red:Don’t Mix}}\n            Flush IV-line ā & p̄ administration.\nNeonates & children <2yo → [[4.2% given slowly instead|Bicarb may cause tissue necrosis, ulceration, & sloughing]]", sideEffects: ["Metabolic alkalosis", "Paradoxical acidosis", "Exacerbation of HF", "Hypernatremia", "Hypokalemia", "Hypocalcemia"], adultRx: ["[[Dead + Bed Sores from Immobility|Suggests Hyperkalemia]] Rx: Consult to give 1mEq/kg", "Hyperkalemia Rx: 50mEq IVP/IO", "[[RRWCT >5mm c̅ HR <150|Suggests Hyperkalemia]] Rx: 50mEq IVP\n      If QRS narrows → Give 2nd dose", "Tricyclic OD c̅ Wide-QRS & ↓BP or Pulseless Rx: [[Consult to give 1mEq/kg IVP|Several doses may be needed]]"], pediatricRx: ["{{redul:Neonates & Children <2yo = 4.2% Bicarb given slowly}}", "Propranolol OD c̅ Widened QRS Rx: Consult to give 1-2mEq/kg IV/IO Bolus", "Tricyclic OD c̅ ↓BP or Pulseless or Wide-QRS Rx: Consult to give 1-2mEq/kg IV/IO"] },
                'adenosine-adenocard': { title: "Adenosine (Adenocard)", concentration: "(6mg/2ml)", class: "Antiarrhythmic", indications: ["SVT"], contraindications: ["Known hypersensitivity", "A-Fib associated  c̅  WPW Syndrome"], precautions: "Rx in a pt c̅ A-Fib & WPW may result in VF\nRx may induce Airway Hyperresponsiveness & should be used c̅ caution in pts c̅ [[RAD Hx|asthma]]", sideEffects: ["H/A", "Cx pn", "Flushing", "Dyspnea/Bronchoconstriction", "↓HR", "AV block", "Sinus Pause/Asystole"], adultRx: ["SVT Rx: 6mg Fast IVP c̅ 10ml Flush\n      If n/c → 12mg Fast IVP c̅ 10ml Flush\n            If n/c → 12mg Fast IVP c̅ 10ml Flush\n                If n/c → Consult to give 12mg Fast IVP during transport\n                [[Note:|n/c =Stable Pt & Rhythm is unchanged]]"] },
                'albuterol': { title: "Albuterol", concentration: "(2.5mg/3cc)", class: "[[Beta Adrenergic Agonist|β₂ selective]]", indications: ["Bronchospasm"], contraindications: ["Known hypersensitivity"], sideEffects: ["↑HR", "Palpitations/Cardiac Ectopy", "Tremor", "H/A", "N/V"], adultRx: ["Bronchospasm Rx: 2.5mg in 3cc Neb c̅ O₂ ≥6LPM\n      Consult to Repeat Dose or Give Duo-Neb", "Hyperkalemia Rx: 2.5mg Neb given p̄ Ca & Bicarb"], pediatricRx: ["Bronchospasm Rx: 2.5mg Neb c̅ O₂ ≥6LPM\n      Consult to repeat dose"] },
                'asa': { title: "ASA", concentration: "(81mg/tab)", class: "NSAID", indications: ["MI or ACS"], contraindications: ["Known hypersensitivity", "Environmental hyperthermia", "[[Peptic ulcer disease|relative for cardiac indications]]", "Pediatric/Adolescent → Due to Reye’s Syndrome"], precautions: "[[Reye’s Syndrome S/S|CNS damage, liver injury, & ↓BGL]]", sideEffects: ["Gastritis", "N/V", "Upper GI bleeding", "↑ Bleeding"], adultRx: ["MI or ACS Rx 324mg PO"] },
                'atropine-sulfate': { title: "Atropine Sulfate", concentration: "(1mg/10ml)", class: "Anticholinergic & more specifically → Antimuscarinic", indications: ["Symptomatic ↓HR", "Organophosphate Poisoning"], contraindications: ["Known hypersensitivity", "Glaucoma (relative c̅  life threatening ↓HR)"], precautions: "Caution c̅ MI & Hypoxia → ↑O₂ Heart Demand\nRx should not delay external pacing for pts c̅ poor perfusion\nMay not be effective for Type II AV block & new 3º block c̅ Wide QRS where the location of block is likely to be in the bundle of His or more distal conduction system\nDonor hearts are denervated & are not responsive to Atropine", sideEffects: ["↑HR (may worsen myocardial ischemia)", "Blurred vision c̅ high doses", "Confusion c̅ high doses", "Acute angle closure glaucoma (relative)"], adultRx: ["Intervention: Symptomatic ↓HR c̅  IV Access = 1mg IVP/IO \n   If n/c p̄ 5min → Repeat Rx", "Intervention: SLUDGEM Pt S/S = 2mg IVP/IO\n   If Initial IV attempt is unsuccessful → May be given IO/IM", "Continuity: Plant Ingestion c̅ ↓HR = 2mg IVP → Repeat prn"], pediatricRx: ["Intervention: SLUDGEM Pt S/S = 0.05mg/kg  IV   ( IM prn )\n   → Repeat prn", "Continuity: Plant Ingestion c̅ ↓HR:\n   <12yo → 0.02-0.05mg/kg  IV/IO  q̄ 20-30min  until Pt Dries up\n   ≥12yo -----→ 0.05mg/kg  IV/IO  q̄ 20-30min  until Pt Dries up"] },
                'd5': { title: "D5", concentration: "(5g/100ml bag)", class: "Carbohydrate", indications: ["↓BGL/Insulin Shock"], contraindications: ["Avoid D5W c̅ ↑ICP"], precautions: "Use D10% for the management of ↓BGL.\nHigher concentration are hypertonic and extravasation may lead to tissue injury.\nVerify Patency & Function of IV line ā Rx\nCheck BGL p̄ giving Rx", sideEffects: ["Local skin irritation", "Thrombophlebitis", "Extravasation c̅ subsequent tissue necrosis", "↑BGL", "Osmotic diuresis"], adultRx: ["Give D10 in 10g increments until BGL >100mg/dL (Note: This refers to D10, D5 primarily for fluid)"] },
                'd10': { title: "D10", concentration: "(25g/250ml bag)", class: "Carbohydrate", indications: ["↓BGL/Insulin Shock"], contraindications: ["Avoid D5W c̅ ↑ICP (General Dextrose precaution)"], precautions: "Use D10% for the management of ↓BGL.\nHigher concentration are hypertonic and extravasation may lead to tissue injury.\nVerify Patency & Function of IV line ā Rx\nCheck BGL p̄ giving Rx", sideEffects: ["Local skin irritation", "Thrombophlebitis", "Extravasation c̅ subsequent tissue necrosis", "↑BGL", "Osmotic diuresis"], adultRx: ["Give D10 in 10g increments until BGL >100mg/dL"] },
                'dexamethasone-decadron': { title: "Dexamethasone (Decadron)", concentration: "(10mg/ml)", class: "corticosteroid, anti-inflammatory", indications: ["Anaphylaxis", "Bronchospasm"], contraindications: ["Known hypersensitivity"], precautions: "Give Slowly", sideEffects: ["Agitation", "Perineal/body burning sensation", "Pruritis", "N/V"], adultRx: ["Intervention: Anaphylaxis = 10mg IV/IM/PO   *Oral tastes bitter*", "Intervention: Bronchospasm = 10mg IVP/IM"], pediatricRx: ["Intervention: Anaphylaxis = 0.6mg/kg IV/IM", "Intervention: Bronchospasm = 0.6mg/kg IV/IM/PO"] },
                'diphenhydramine-benadryl': { title: "Diphenhydramine (Benadryl)", concentration: "(50mg/ml)", class: "Antihistamine (H1)", indications: ["Allergic Reaction", "Anaphylaxis", "Toxic Ingestion (probable about treating dystonic reactions)"], contraindications: ["Known hypersensitivity", "Narrow angle glaucoma", "Prostatic hypertrophy or bladder neck obstruction"], precautions: "The drug of choice for anaphylaxis is Epi, not Benadryl", sideEffects: ["Sedation", "↓BP (rare)", "May cause paradoxical excitation in young children"], adultRx: ["Intervention: Allergic RXN or c̅ Anaphylaxis p̄ Epi = 50mg IVP", "Continuity: Extrapyramidal RXN from Haldol use = 50mg IVP/IM"], pediatricRx: ["Intervention: Allergic RXN or c̅ Anaphylaxis p̄ Epi = 1mg/kg IVP", "Continuity: Extrapyramidal RXN from Haldol= 1mg/kg IV/IM/IO"] },
                'droperidol-inapsine': { title: "Droperidol (Inapsine)", concentration: "(5mg/2ml)", class: "Sedative/Hypnotic/Antiemetic", indications: ["N/V", "Pain Management", "Violent/Agitated/ &/or Anxious pt"], contraindications: ["Known hypersensitivity", "SBP <100mmHg"], precautions: "(might need to do an EKG due to QT elongation)", sideEffects: ["Transient ↓BP", "Hyperactivity/Anxiety", "Neuroleptic Malignant Syndrome"], adultRx: ["Intervention: N/V = 1.25mg IV/IM → Consultation for a 2nd dose*", "Intervention: H/A or abdominal pain = 2.5mg IV", "Intervention: RASS+1 = 5mg IM", "Intervention: RASS+2/3 =10mg IM → Repeat once prn p̄ 10min\n   >65yo = 5mg IM"], pediatricRx: ["Not approved for Pediatric Pts"] },
                'epi-1-1000-adrenaline': { title: "Epi 1:1,000 (Adrenaline)", concentration: "(10mg/10ml)", class: "Endogenous Catecholamine", indications: ["Anaphylaxis", "Bronchospasm"], contraindications: ["Known hypersensitivity"], sideEffects: ["Tachycardia and arrhythmias", "Myocardial ischemia/infarction", "HTN", "Tremor", "Anxiety", "H/A", "N/V"], adultRx: ["Intervention: Anaphylaxis = 0.5mg IM \n   n/c p̄ 5min → Repeat once\n   Consultation → May give 3rd dose 5min p̄ the 2nd dose", "Consultation:Bronchospasm c̅ severe asthmatics =0.5mg IM"], pediatricRx: ["Intervention: Anaphylaxis <10kg = 0.01mg/kg IM  (0.01ml/kg IM)\n   10-25kg = 0.15mg IM   (0.15ml IM)\n   25-60kg = 0.3mg IM   (0.3ml IM)\n   >60kg = 0.5mg IM   (0.5ml IM)", "*All weight classes: give prn every 5-15min   (max = 3 doses)", "Consultation → Epi IV Infusion p̄ 3rd does of Epi", "Consultation:Bronchospasm = 0.3mg IM (0.3ml IM)"] },
                'epi-1-10000': { title: "Epi 1:10,000", concentration: "(1mg/10ml)", class: "Endogenous Catecholamine", indications: ["VF or pVT", "Symptomatic ↓HR", "Cardiogenic Shock", "Post-ROSC Stabilization"], contraindications: ["Known hypersensitivity", "≥ 50yo (asthma) usually for the 1:1,000 for bronchospasm"], sideEffects: ["↑HR & arrhythmias", "Myocardial ischemia/infarction", "HTN", "Tremor", "Anxiety", "H/A", "N/V"], adultRx: ["Intervention: VF/VT 1mg IVP during CPR"], pediatricRx: ["Cardiogenic Shock/Post Arrest Stabilization PEDIATRIC p157- epinephrine 1mcg/kg IO or IVP"] },
                'epi-1-100000-push-dose-epi': { title: "Epi 1:100,000 \"Push-Dose Epi\"", concentration: "(100mcg/10ml)", class: "Endogenous Catecholamine", indications: ["Symptomatic ↓HR", "Cardiogenic Shock", "Post-ROSC Stabilization"], contraindications: ["Known hypersensitivity", "≥50yo (asthma)usually for the 1:1,000 for bronchospam"], sideEffects: ["↑HR & arrhythmias", "Myocardial ischemia/infarction", "HTN", "Tremor", "Anxiety", "H/A", "N/V"], adultRx: ["Push-Dose Epi Preparation: \n   Waste 1ml from NS Flush \n   → Draw 1ml Epi 1:10,000 into NS Flush \n   Concentration = 10mcg/ml & total Epi = 100mcg/Flush", "Epi Continuous Infusion: \n   Waste 10ml from 250ml NS bag \n   → Add 10ml of 1:10,000 Epi into the NS bag \n   = 4mcg/ml Epi Concentration", "Epi Continuous Infusion Drip Rates c̅ 60-Drip (Micro-Drip):\n   2mcg/min = 1gtt/2sec\n   4mcg/min = 1gtt/sec\n   8mcg/min = 2gtts/sec\n   12mcg/min = 3gtts/sec\n   16mcg/min = 4gtts/sec", "Intervention: Symptomatic ↓HR (En route & s̄ hypovolemia) \n   = 10mcg IVP followed by 2mcg/min Infusion\n   Consultation:Titrate up by 2mcg/min q̄ min prn    Max= 16mcg/min", "Intervention: Cardiogenic Shock 10mcg IVP followed by \n   → 2mcg/min Infusion → Titrate up 2mcg/min q̄ min\n   Max = 10mcg/min     SBP Goal ≥90", "Intervention: Post-ROSC Stabilization Infused at 2mcg/min \n   → Titrate up by 2mcg/min q̄ min    Max = 16mcg/min"], pediatricRx: ["Consultation:Cardiogenic Shockor Post-ROSC Stabilization\n   = 1mcg/kg IVP/IO  → From Push-Dose Epi", "10kg child =1ml    → From Push-Dose Epi", "15kg child =1.5ml   → From Push-Dose Epi"] },
                'etomidate-amidate': { title: "Etomidate (Amidate)", concentration: "(40mg/20ml)", class: "Sedative-hypnotic", indications: ["SAI"], contraindications: ["Known allergy or hypersensitivity"], sideEffects: ["Pain on injection (secondary to propylene glycol diluent, may be ↓ by administering through a rapidly flowing IV placed in a large vein).", "Myoclonus (not of clinical significance), can be ↓ or mitigated by the co-Rx of an opioid or benzodiazepine."], adultRx: ["Intervention: SAI for >10yo = 0.3mg/kg IVP      Max = 40mg"] },
                'fentanyl-sublimaze': { title: "Fentanyl (Sublimaze)", concentration: "(100mcg/2ml)", class: "Synthetic opioid", indications: ["MI", "Pain Management", "Sickle Cell Crisis"], contraindications: ["Known hypersensitivity &  SBP <100"], precautions: "Fentanyl should be administered slowly.\nCareful monitoring (including the use of waveform capnography) is warranted when co- administering c̅ benzodiazepines or to pts who have consumed alcohol as these pts are at risk for ventilatory depression.", sideEffects: ["Respiratory depression", "↓BP", "Cx Rigidity (Extremely rare c̅ Rapid Rx + Dose >5mcg/kg)"], adultRx: ["Intervention: MI/ACS 1mcg/kg slow over 3-5min IVP \n   →Consultation needed for repeated doses", "Intervention: Pain 1mcg/kg slow IVP/IM/IN    Max= 150mcg", "Intervention: Sickle Cell Crisis 1mcg/kg slow IVP   Max = 150mcg"], pediatricRx: ["Intervention: Pain 0.5-1mcg/kg IV/IN     Max = 50mcg\n   → Consultation needed for repeated doses", "Consultation: Sickle Cell Crisis 1mcg/kg slow IVP/SQ \n   Max= 50mcg"] },
                'ipratropium': { title: "Ipratropium", concentration: "(0.5mg/3cc)", class: "Anticholinergic\nParasympatholytic used in the Tx of respiratory emergencies.\nCauses bronchodilation & dries Respiratory tract secretions.\nBlocks Acetylcholine. 15% of dose reaches lower airway.", indications: ["Bronchospasm"], contraindications: ["Known Hypersensitivity"], sideEffects: ["Palpitation", "Anxiety", "Dizziness", "H/A", "N/V"], adultRx: ["Continuity: Bronchospasm = 0.5mg orDuo-Neb"] },
                'ketamine-ketalar': { title: "Ketamine (Ketalar)", concentration: "(500mg/5ml)", class: "Dissociative general anesthetic", indications: ["SAI", "Bronchospasm", "Pain Management", "Violent/Combative Pt"], contraindications: ["Cardiac ischemia/infarction or Hx of CAD (relative)", "Penetrating ocular injury", "Pt ≤ 3 months of age", "Schizophrenia"], precautions: "IV ketamine should be administered over 60sec\nWhen not used in conjunction c̅ a neuromuscular blocking agent, the most common respiratory side effect associated c̅ ketamine is laryngeal spasm. It is usually transitory and easily managed c̅ PPV.", sideEffects: ["Emergence reaction", "↑HR", "↓BP/HTN", "Hypersalivation", "Laryngospasm", "↑ Intraocular Pressure", "N/V", "Transient apnea (if given rapidly via IV route)"], adultRx: ["Intervention: Combative pt = 4mg/kg IM      >65yo = 2mg/kg IM\n   Max = 500mg IM       RASS score q̄ 5min", "Intervention: SAI/Bronchospasm = 2mg/kg IV/IO", "Intervention: Pain = 0.2mg/kg IV/IO      Max = 25mg"], pediatricRx: ["Intervention: Combative = 4mg/kg IM \n   Don’t exceed Entire Vial/Site", "Intervention: SAI/Bronchospasm = 2mg/kg IV/IO", "Intervention: SAI c̅ ↓BP s̄ Cardiogenic Shock = 1mg/kg IV", "Intervention: SAI c̅ suspected Cardiogenic Shock = 0.5mg/kg IV"] },
                'ketorolac-tromethamine-toradol': { title: "Ketorolac Tromethamine (Toradol)", concentration: "(30mg/ml)", class: "NSAID", indications: ["Pain Control for pts >17yo"], contraindications: ["Known hypersensitivity", "Allergy to any NSAID (including ASA)", "Asthma", "Renal insufficiency", "Peptic ulcer disease or GI bleeding", "Pregnancy", "Hypovolemia", "Trauma other than isolated extremity trauma", "Anticipated major surgery (within 7 days)"], precautions: "Ketorolac Tx is not indicated for abdominal/Cx pain.\n↓ By 50% in pts >65yo due to ↓ Renal Function Concerns", sideEffects: ["GI bleeding", "H/A", "Drowsiness", "Abdominal pain", "Dyspepsia"], adultRx: ["Intervention: For Pain = 15mg IV/IM       If >65yo = 7.5mg IV/IM \n   (Not for abdominal/Chest pain)\n   May be given off-label with med control approval for <17yo"] },
                'magnesium-sulfate-mgso4': { title: "Magnesium sulfate (MgSO₄)", concentration: "(1g/2ml)", class: "Electrolyte", indications: ["Bronchospasm", "Childbirth", "Symptomatic ↑HR"], contraindications: ["Known hypersensitivity"], precautions: "↓BP, ↓HR, & Conduction issues may occur if given too fast.  \nRx c̅ caution c̅ ↓HR.\nToxicity is associated c̅ CNS & neuromuscular depression.\nA ↓ in deep tendon reflexes (DTRs) = Early Toxicity sign & may indicate impending respiratory depression.\nCa⁺ reverses respiratory depression associated c̅ Mg toxicity.", sideEffects: ["↓BP", "↓HR/Conduction disturbance (Rx c̅ caution in pts c̅ ↓HR)", "Respiratory depression", "Flushing"], adultRx: ["Intervention: Bronchospasm → for Severe Asthmatics or c̅ PMH of Intubation for asthma = 2g slow IV drip", "Slow IV Drip = 1gtt/(1-2sec) c̅ a 10-Drip Set & 250ml NS bag", "Intervention: Eclampsia = 4g  slow IVP over 3-5min c̅ NS \n   → followed by IV piggyback Drip at 1-2g/hr", "IV piggyback Drip at 1-2g/hr = 0.7gtts/sec \n   or ≈ 2gtts/3sec c̅ a 10-Drip Set & 250ml NS bag", "Intervention: Torsades = 2g IV Infusion over 2min \n   → Followed by 5mg/min Infusion", "2g IV Infusion over 2min = 1g in 10ml Flush over 1min \n   → repeat once", "5mg/min Infusion = Mix 1g in c̅  250ml NS bag c̅ 60-Drip Micro Set \n   → Ran at 1.25gtts/sec or 5gtts/4sec"], pediatricRx: ["Consultation: Bronchospasm → For >2yo c̅ Severe Asthmatics \n   or c̅ PMH of Intubation for asthma \n   = 40mg/kg diluted c̅ NS to a concentration of 100mg/ml \n   → Infuse over 20min c̅ rate <150mg/min       Max =2g", "“Prepared Syringe” c̅ a concentration of 100mg/ml: \n   = Draw 10ml out of 250ml NS bag c̅ 10cc syringe \n   → Waste 2ml from syringe \n   → Draw up into the syringe 1g (2ml) of MgSO₄", "(Pediatric Weight (in kg))/2.5 = # of ml’s added \n   to our 250ml NS bag from our “prepared syringe”", "Run MgSO₄ Infused NS bag over 20min c̅  10-Drip Set at 2gtts/sec", "Note: 50kg Child = 2g MgSO₄ (our max dose) = 2 Vials of MgSO₄\n   25kg child = 1g MgSO₄ = 1 Vial of MgSO₄\n   Never exceed 3gtts/sec\n   Never exceed 2 Vials of our 1g/2ml MgSO₄"] },
                'metoprolol-tartrate-lopressor': { title: "Metoprolol tartrate (Lopressor)", concentration: "(5mg/5ml)", class: "Beta antagonist (β1 selective)", indications: ["Symptomatic ↑HR"], contraindications: ["Known hypersensitivity", "HR < 60", "AV block >1º s̄ a pacemaker", "SBP <100", "Acute decompensated heart failure"], sideEffects: ["↓BP", "↓HR", "AV block", "Dizziness", "Bronchospasm", "Heart failure"], adultRx: ["Intervention: A-Fib c̅ RVR or A-Flutter \n   = 0.15mg/kg  slow IVP  over 2min       Max = 10mg", "Consultation: Stable SVT \n   → Discuss for use as an additionally used dose for SVT"] },
                'midazolam-versed': { title: "Midazolam (Versed)", concentration: "(10mg/2ml)", class: "Benzo", indications: ["SAI", "Symptomatic ↓HR", "Seizure", "Symptomatic ↑HR", "Vent Pt", "Violent/Combative Pt"], contraindications: ["Known hypersensitivity", "Hypotension (SBP <100 mmHg) probabky relative??", "Acute angle glaucoma (relative)"], precautions: "Respiratory Depression Risk c̅ Opioids, old age, or c̅ Respiratory Conditions. ↓ Rx c̅ in these pts.\nRx c̅ a non-intubated pt → Monitor the airway & ventilation \n   → Use Capno.\n↓BP may occur c̅ fast Rx to low volume pts, or to pts c̅ hemodynamic instability.", sideEffects: ["Respiratory depression", "↓BP", "Confusion"], adultRx: ["Intervention: ↓HR c̅ ↓BP If → Pacing Works + Uncomfortable pt \n   = 5mg  IV/IO", "Intervention: ↑HR c̅ ↓BP = 5mg IV/IO ā Cardioversion  if  IV", "Intervention: Vent pt c̅ ↓BP = 5mg IV/IO", "Intervention: RASS +1 Adult ≤65yo = 0.02mg/kg IV\n   Single Max Dose = 2.5mg IV or 5mg IM", "Consultation: RASS+4 p̄ Ketamine or RASS+1 Adult ≤65yo \n   = 5mg IM", "Intervention: SAI = 2.5-5mg IV", "Intervention: Seizure = 10mg IM or 0.1mg/kg IV/IN \n   Max = 5mg IV & 10mg IM", "Intervention: Seizure from Organophosphate OD = 5mg IV/IN"], pediatricRx: ["Intervention: SAI = 0.1mg/kg IV       Max = 5mg", "Intervention: Seizure = 0.5mg/kg  IN \n   Initial Max =10mg & Total Dose Max = 20mg\n   or 0.2mg/kg  IV/IO  c̅  Max = 5mg & prn until Total Max = 10mg IV", "Intervention: Seizure from Organophosphate OD \n   = 0.2mg/kg  IV/IO      Max = 5mg\n   or 0.5mg/kg  IN", "Intervention: RASS+3 “safety or ↑ physical restraint” \n   =   0.1-0.2mg/kg  IM        Max = 5mg  IM\n   or 0.05-0.1mg/kg  IV      Max = 10mg  IV\n   or    0.02mg/kg  IN        Max= 20mg  IN\n   prn until Max Dose is Reached"] },
                'morphine': { title: "Morphine", concentration: "(4mg/2ml)", class: "", indications: [], contraindications: [], precautions: "", sideEffects: [], adultRx: ["Intervention: MI/ACS = 4mg  Slow IVP \n   Only if  Fentanyl  is Unavailableor Contraindicated", "Intervention: Pain = 2-4mg  IVP"], pediatricRx: ["Intervention: Pain = 0.1mg/kg  IV/SQ     Max = 4mg \n   → Consult for further doses", "Consultation: Sickle Cell Crisis = 0.1mg/kg  IV/SQ    Max =4mg"] },
                'naloxone-narcan': { title: "Naloxone (Narcan)", concentration: "(2mg/2ml)", class: "", indications: [], contraindications: [], precautions: "", sideEffects: [], adultRx: ["Intervention: Coma/Opioid OD = 2mg  IM/IN \n   or 0.4mg  IVP"], pediatricRx: ["Intervention: AMS/Opioid OD = 0.1mg/kg  IV/IO/ETT/IM \n   Max = 2.0mg", "Continuity: Methadone OD = 0.2mg/kg       Max = 2.0mg"] },
                'ntg': { title: "NTG", concentration: "(0.4mg/spray)", class: "Organic nitrate", indications: ["MI or ACS", "Pulmonary Edema"], contraindications: ["Known hypersensitivity", "SBP <100", "Recent use of a phosphodiesterase type 5 inhibitor (sildenafil [Viagra, Revatio] or vardenafil [Levitra] within 24 hours or tadalafil [Cialis, Adcirca]) c̅in 36 hours.", "Right ventricular infarction (RVI)", "Tachycardia (HR>100) in the absence of HF (not universal)", "↑ICP"], precautions: "Pts c̅ RVI are preload sensitive & can develop severe ↓BP in response to Preload-reducing agents. If ↓BP develops following Rx → IVF may be necessary.\nInferior STEMI → Do right sided EKG to look for RVI evidence\nPts c̅ aortic stenosis are very preload dependent to maintain cardiac output. NTG c̅ aortic stenosis or murmur should be judicious & carefully titrated.", sideEffects: ["Hypotension", "H/A", "Tachycardia (reflex)", "Bradycardia", "Methmemoglobinemia → nitrate ions oxidize hemoglobin\n   long term effect & unlikely seen in EMS setting"], adultRx: ["Don’t give if pt had Viagra/Cialis within the past 48hrs", "NTG is NOT contraindicated c̅ Inferior STEMI \n   → Should the pt become profoundly Hypotensive\n   → Infuse NS until BP >90", "Be cautious c̅ Aortic Stenosis or Murmurs", "Intervention: MI/ACS = 0.4mg SL q̄ 5min prn only if BP >100 \n   or  >110 if pt Never had NTG ā\n   Max = 3 doses", "Continuity: Repeat  q̄  5min  if → SBP >100 & pain still present", "Intervention: Pulmonary Edema = 0.4mg  SL  if BP  >100\n   or  >120  if pt Never had NTG ā", "Intervention: Flash Pulm-Edema from Hypertensive Crisis  s̄  IV \n   = 0.4mg  SL", "Consultation: 0.8-1.2mg  SL & Inform Med-Control if no IV yet"] },
                'ondansetron-zofran': { title: "Ondansetron (Zofran)", concentration: "(4mg/2ml)", class: "Antiemetic", indications: ["N/V"], contraindications: ["Known hypersensitivity", "Prolonged QTI (male >440msec, female >450msec (probably more of a precaution)", "Pregnancy (1st trimester)"], precautions: "Use c̅ caution c̅ other agents that may cause QTI prolongation.", sideEffects: ["H/A (particularly in those prone to migraine headaches)", "QTI prolongation", "AV conduction disturbance (associated c̅ rapid Rx)", "Sedation", "Diarrhea", "Dry mouth", "Serotonin syndrome"], adultRx: ["Intervention: N/V = 4mg  IVP over  60sec"], pediatricRx: ["Intervention: N/V = 0.15mg/kg  IVP over 60sec     Max = 4mg", "Intervention: N/V s̄  IV →  4-11yo = 4mg tab PO\n   ≥12yo = 8mg tab PO"] }
            };
            const newCategoriesData = [ /* ... All categories from v0.6 ... */
                {id: slugify("Abbreviations & References"), title: "Abbreviations & References", type: "category", children: [{ id: slugify("Abbott Approved Abbreviations"), title: "Abbott Approved Abbreviations", type: "topic" },{ id: slugify("Other Abbreviations"), title: "Other Abbreviations", type: "topic" }]},
                {id: slugify("Introduction & Core Principles"), title: "Introduction & Core Principles", type: "category", children: [{ id: slugify("Introduction to Abbott"), title: "Introduction to Abbott", type: "topic" },{ id: slugify("Core Principles – Safety & Well-Being"), title: "Core Principles – Safety & Well-Being", type: "topic" },{ id: slugify("General Important Information"), title: "General Important Information", type: "topic" }]},
                {id: slugify("Administrative & Legal Essentials"), title: "Administrative & Legal Essentials", type: "category", children: [{ id: slugify("ALS Ground Rules"), title: "ALS Ground Rules", type: "topic" },{ id: slugify("Scope Violations & Possible Consequences"), title: "Scope Violations & Possible Consequences", type: "topic" },{ id: slugify("Suspension/Revocation"), title: "Suspension/Revocation", type: "topic" },{ id: slugify("On-Scene Authority"), title: "On-Scene Authority", type: "topic" },{ id: slugify("On-Scene Healthcare Professionals"), title: "On-Scene Healthcare Professionals", type: "topic" },{ id: slugify("Dispatching MD [200]"), title: "Dispatching MD [200]", type: "topic" },{ id: slugify("Consulting OLMC"), title: "Consulting OLMC", type: "topic" },{ id: slugify("Transfer to Lesser Credential"), title: "Transfer to Lesser Credential", type: "topic" },{ id: slugify("EMR Accompanying Critically Ill"), title: "EMR Accompanying Critically Ill", type: "topic" },{ id: slugify("Response Mode"), title: "Response Mode", type: "topic" },{ id: slugify("AIR AMBULANCE UTILIZATION"), title: "AIR AMBULANCE UTILIZATION", type: "topic" },{ id: slugify("Applicability of the COG"), title: "Applicability of the COG", type: "topic" },{ id: slugify("Mandatory Reporting"), title: "Mandatory Reporting", type: "topic" },{ id: slugify("Crime Scene"), title: "Crime Scene", type: "topic" },{ id: slugify("Worker’s Compensation Process"), title: "Worker’s Compensation Process", type: "topic" }]},
                {id: slugify("Operational Protocols"), title: "Operational Protocols", type: "category", children: [{ id: slugify("Restraint of Agitated/Combative Patients"), title: "Restraint of Agitated/Combative Patients", type: "topic" },{ id: slugify("Richmond Agitation Sedation Scale (RASS)"), title: "Richmond Agitation Sedation Scale (RASS)", type: "topic" },{ id: slugify("Rule of 9’s & Rule of Palms (BSA Burn Estimation)"), title: "Rule of 9’s & Rule of Palms (BSA Burn Estimation)", type: "topic" },{ id: slugify("Smith-Modified Sgarbossa Criteria"), title: "Smith-Modified Sgarbossa Criteria", type: "topic" },{ id: slugify("PCR Requirements"), title: "PCR Requirements", type: "topic" },{ id: slugify("Clinical Errors & Reporting"), title: "Clinical Errors & Reporting", type: "topic" },{ id: slugify("Medication Administration Cross Check (MACC)"), title: "Medication Administration Cross Check (MACC)", type: "topic" },{ id: slugify("CDC Field Triage Guidelines (Trauma)"), title: "CDC Field Triage Guidelines (Trauma)", type: "topic" },{ id: slugify("Rehabilitation: Emergency Incidents & Municipal Partners"), title: "Rehabilitation: Emergency Incidents & Municipal Partners", type: "topic" }]},
                {id: slugify("Skills & Equipment"), title: "Skills & Equipment", type: "category", children: [{ id: slugify("Ventilator Set-Up (ParaPAC Plus)"), title: "Ventilator Set-Up (ParaPAC Plus)", type: "topic" },{ id: slugify("I-gel Supraglottic Airway (SGA)"), title: "I-gel Supraglottic Airway (SGA)", type: "topic" },{ id: slugify("Thermometer (Braun ThermoScan)"), title: "Thermometer (Braun ThermoScan)", type: "topic" },{ id: slugify("Glucometer (McKesson True Metrix Pro)"), title: "Glucometer (McKesson True Metrix Pro)", type: "topic" },{ id: slugify("Diltiazem Add-Vantage Directions"), title: "Diltiazem Add-Vantage Directions", type: "topic" },{ id: slugify("EZ-IO Insertion"), title: "EZ-IO Insertion", type: "topic" },{ id: slugify("PUSH-DOSE EPI"), title: "PUSH-DOSE EPI", type: "topic" },{ id: slugify("Mucosal Atomization Device (M.A.D.)"), title: "Mucosal Atomization Device (M.A.D.)", type: "topic" },{ id: slugify("Minutes of Oxygen by Cylinder Size"), title: "Minutes of Oxygen by Cylinder Size", type: "topic" },{ id: slugify("Understanding Ratios, Percentages & Solution Mixtures"), title: "Understanding Ratios, Percentages & Solution Mixtures", type: "topic" }]},
                {id: slugify("Adult Protocols"), title: "Adult Protocols", type: "category", children: [{ id: slugify("Adult Airway & Breathing"), title: "Airway & Breathing", type: "category", children: [{ id: slugify("Adult Bronchospasm"), title: "Bronchospasm", type: "topic" },{ id: slugify("Adult CPAP-BiPAP"), title: "CPAP/BiPAP", type: "topic" },{ id: slugify("Adult SAI"), title: "SAI", type: "topic" },{ id: slugify("Adult Nasal Intubation"), title: "Nasal Intubation", type: "topic" },{ id: slugify("Adult Ventilator pt Intubated & Sedated"), title: "Ventilator pt: Intubated & Sedated", type: "topic" },]},{ id: slugify("Adult Circulation-Cardiology"), title: "Circulation/Cardiology", type: "category", children: [{ id: slugify("Adult Bradycardia"), title: "Bradycardia", type: "topic" },{ id: slugify("Adult Cardiogenic Shock (not post arrest)"), title: "Cardiogenic Shock (not post arrest)", type: "topic" },{ id: slugify("Adult LVAD pt"), title: "LVAD pt", type: "topic" },{ id: slugify("Adult Pulmonary Edema"), title: "Pulmonary Edema", type: "topic" },{ id: slugify("Adult MI-ACS"), title: "MI/ACS", type: "topic" },{ id: slugify("Adult PEA-Asystole"), title: "PEA/Asystole", type: "topic" },{ id: slugify("Adult ROSC Stabilization"), title: "ROSC Stabilization", type: "topic" },{ id: slugify("Adult VF-pVT"), title: "VF/pVT", type: "topic" },{ id: slugify("Adult Hyperkalemia"), title: "Hyperkalemia", type: "topic" },{ id: slugify("Adult SVT-Mono-VT (unstable)"), title: "SVT/Mono-VT (unstable)", type: "topic" },{ id: slugify("Adult SVT (stable)"), title: "SVT (stable)", type: "topic" },{ id: slugify("Adult A-Fib RVR or A-Flutter (stable symptomatic)"), title: "A-Fib RVR or A-Flutter (stable symptomatic)", type: "topic" },{ id: slugify("Adult MAT (stable)"), title: "MAT (stable)", type: "topic" },{ id: slugify("Adult Mono-VT (stable)"), title: "Mono-VT (stable)", type: "topic" },{ id: slugify("Adult Poly-VT-Torsades (stable)"), title: "Poly-VT/Torsades (stable)", type: "topic" },{ id: slugify("Adult Poly-VT-Torsades (unstable)"), title: "Poly-VT/Torsades (unstable)", type: "topic" },]},{ id: slugify("Adult Medical Emergencies"), title: "Medical Emergencies", type: "category", children: [{ id: slugify("Adult Allergic Reaction"), title: "Allergic Reaction", type: "topic" },{ id: slugify("Adult Anaphylaxis"), title: "Anaphylaxis", type: "topic" },{ id: slugify("Adult Fall or Weakness"), title: "Fall or Weakness", type: "topic" },{ id: slugify("Adult Hyperglycemia"), title: "Hyperglycemia", type: "topic" },{ id: slugify("Adult Hypoglycemia"), title: "Hypoglycemia", type: "topic" },{ id: slugify("Adult N-V"), title: "N/V", type: "topic" },{ id: slugify("Adult SLUDGEM pt"), title: "SLUDGEM pt", type: "topic" },{ id: slugify("Adult Pain"), title: "Pain", type: "topic" },{ id: slugify("Adult H-A or Abdominal pain"), title: "H/A or Abdominal pain", type: "topic" },{ id: slugify("Adult Sickle Cell Crisis"), title: "Sickle Cell Crisis", type: "topic" },{ id: slugify("Adult Seizure"), title: "Seizure", type: "topic" },{ id: slugify("Adult Sepsis"), title: "Sepsis", type: "topic" },{ id: slugify("Adult Stroke"), title: "Stroke", type: "topic" },{ id: slugify("Adult Toxic Ingestion with serious S-S"), title: "Toxic Ingestion with serious S/S", type: "topic" },{ id: slugify("Adult RASS 1 through 4"), title: "RASS +1 through +4", type: "topic" },]},{ id: slugify("Adult OBGYN"), title: "OB/GYN", type: "category", children: [{ id: slugify("Adult Normal Delivery"), title: "Normal Delivery", type: "topic" },{ id: slugify("Adult Shoulder Dystocia"), title: "Shoulder Dystocia", type: "topic" },{ id: slugify("Adult Breech"), title: "Breech", type: "topic" },{ id: slugify("Adult Frank-Complete Breech Presentation"), title: "Frank/Complete Breech Presentation", type: "topic" },{ id: slugify("Adult Prolapsed Cord"), title: "Prolapsed Cord", type: "topic" },{ id: slugify("Adult Eclampsia"), title: "Eclampsia", type: "topic" },]},{ id: slugify("Adult Trauma"), title: "Trauma", type: "category", children: [{ id: slugify("Adult Cardiac Arrest - Pressure Sores from Immobility"), title: "Cardiac Arrest + Pressure Sores from Immobility", type: "topic" },{ id: slugify("Adult Mace-Pepper-Spray"), title: "Mace/Pepper-Spray", type: "topic" },{ id: slugify("Adult SMR"), title: "SMR", type: "topic" },{ id: slugify("Adult Taser"), title: "Taser", type: "topic" },{ id: slugify("Adult Major Level 1 Trauma"), title: "Major Level 1 Trauma", type: "topic" },]},{ id: slugify("Adult Refusals"), title: "Refusals", type: "topic" }]},
                {id: slugify("Pediatric Protocols"), title: "Pediatric Protocols", type: "category", children: [{ id: slugify("Pediatric Assessment & VS"), title: "Pediatric Assessment & VS", type: "topic" },{ id: slugify("Pediatric Airway & Breathing"), title: "Airway & Breathing", type: "topic" },{ id: slugify("Pediatric Circulation-Cardiac"), title: "Circulation/Cardiac", type: "topic" },{ id: slugify("Pediatric Medical"), title: "Medical", type: "topic" },{ id: slugify("Pediatric Trauma"), title: "Trauma", type: "topic" },{ id: slugify("Pediatric Special Needs Children"), title: "Special Needs Children", type: "topic" },{ id: slugify("Pediatric Refusals"), title: "Refusals", type: "topic" }]},
                {id: slugify("ALS Medications"), title: "ALS Medications", type: "category", children: [
                        { id: '10-calcium-chloride', title: "10% Calcium Chloride", type: "topic" }, { id: '2-lidocaine-xylocaine', title: "2% Lidocaine (Xylocaine)", type: "topic" },
                        { id: '8-4-sodium-bicarbonate-nahco3', title: "8.4% Sodium Bicarbonate (NaHCO₃)", type: "topic" }, { id: 'adenosine-adenocard', title: "Adenosine (Adenocard)", type: "topic" },
                        { id: 'albuterol', title: "Albuterol", type: "topic" }, { id: 'asa', title: "ASA", type: "topic" }, { id: 'atropine-sulfate', title: "Atropine Sulfate", type: "topic" },
                        { id: 'd10', title: "D10", type: "topic" }, { id: 'd5', title: "D5", type: "topic" }, { id: 'dexamethasone-decadron', title: "Dexamethasone (Decadron)", type: "topic" },
                        { id: 'diphenhydramine-benadryl', title: "Diphenhydramine (Benadryl)", type: "topic" }, { id: 'droperidol-inapsine', title: "Droperidol (Inapsine)", type: "topic" },
                        { id: 'epi-1-1000-adrenaline', title: "Epi 1:1,000 (Adrenaline)", type: "topic" }, { id: 'epi-1-10000', title: "Epi 1:10,000", type: "topic" },
                        { id: 'epi-1-100000-push-dose-epi', title: "Epi 1:100,000 \"Push-Dose Epi\"", type: "topic" }, { id: 'etomidate-amidate', title: "Etomidate (Amidate)", type: "topic" },
                        { id: 'fentanyl-sublimaze', title: "Fentanyl (Sublimaze)", type: "topic" }, { id: 'ipratropium', title: "Ipratropium", type: "topic" },
                        { id: 'ketamine-ketalar', title: "Ketamine (Ketalar)", type: "topic" }, { id: 'ketorolac-tromethamine-toradol', title: "Ketorolac Tromethamine (Toradol)", type: "topic" },
                        { id: 'magnesium-sulfate-mgso4', title: "Magnesium sulfate (MgSO₄)", type: "topic" }, { id: 'metoprolol-tartrate-lopressor', title: "Metoprolol tartrate (Lopressor)", type: "topic" },
                        { id: 'midazolam-versed', title: "Midazolam (Versed)", type: "topic" }, { id: 'morphine', title: "Morphine", type: "topic" },
                        { id: 'naloxone-narcan', title: "Naloxone (Narcan)", type: "topic" }, { id: 'ntg', title: "NTG", type: "topic" }, { id: 'ondansetron-zofran', title: "Ondansetron (Zofran)", type: "topic" }
                    ]}
            ];

            initializeData(newCategoriesData, medicationDetails);

            // Setup autocomplete for relevant fields
            setupAutocomplete('pt-pmh', 'pt-pmh-suggestions', pmhSuggestions);
            setupAutocomplete('pt-allergies', 'pt-allergies-suggestions', allergySuggestions);
            setupAutocomplete('pt-medications', 'pt-medications-suggestions', medicationNameSuggestions);
            setupAutocomplete('pt-symptoms', 'pt-symptoms-suggestions', symptomSuggestions);


            searchInput.addEventListener('input', () => handleSearch(true));
            // Use keydown to reliably capture Enter key presses across browsers
            searchInput.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSearch(true);
                }
            });
            renderInitialView(true);
            updateNavButtonsState();
        });
    </script>
<div class="hidden">
  <span class="toggle-info">Example<span class="info-text hidden">info</span></span>
</div>
</body>
</html>
