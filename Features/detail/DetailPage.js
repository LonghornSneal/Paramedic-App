// Features/detail/DetailPage.js – Detailed topic view rendering

// group the logic for rendering a topic’s detailed view and associated helpers 
// (warning toggles, text formatting, etc.):

// Note: 
// appendTopicWarnings(topic) is already defined in Features/Warnings.js, 
// and functions like addHistoryEntry and updateNavButtonsState are in Navigation.js. 
// Ensure those scripts are loaded beforehand.
// Placement in HTML: 
// Include this script before main.js and before Features/search/Search.js 
// (since the search module calls renderDetailPage).

// Converts special markup in text (e.g. **bold**, [[display|info]]) into formatted HTML, and escapes HTML characters.
function parseTextMarkup(text) {
    let safeText = text.replace(/&/g, "&amp;")
                       .replace(/</g, "&lt;")
                       .replace(/>/g, "&gt;");
    safeText = safeText.replace(/\n/g, "<br>");
    // Replace [[display|info]] with a toggle-able info span
    safeText = safeText.replace(/\[\[(.+?)\|(.+?)\]\]/g,
        (_, display, info) => `<span class="toggle-info"><span class="arrow"></span>${display}<span class="info-text hidden">${info}</span></span>`);
    // Replace custom markup for colored/underlined text
    safeText = safeText.replace(/\{\{red:(.+?)\}\}/g, (_, t) => `<span class="text-red-600 font-semibold">${t}</span>`);
    safeText = safeText.replace(/\{\{redul:(.+?)\}\}/g, (_, t) => `<span class="text-red-600 font-semibold underline decoration-red-600">${t}</span>`);
    safeText = safeText.replace(/\{\{orange:(.+?)\}\}/g, (_, t) => `<span class="text-orange-600">${t}</span>`);
    safeText = safeText.replace(/\{\{blackul:(.+?)\}\}/g, (_, t) => `<span class="font-bold underline decoration-black">${t}</span>`);
    safeText = safeText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return safeText; 
}//:contentReference[oaicite:16]{index=16}:contentReference[oaicite:17]{index=17}:contentReference[oaicite:18]{index=18}

// Generates an HTML `<ul>` list for an array of detail items, or a placeholder if none.
function createDetailList(itemsArray) {
    if (!itemsArray || itemsArray.length === 0) {
        return '<p class="text-gray-500 italic">None listed.</p>'; 
    }
    const listItemsHtml = itemsArray.map(it => `<li>${parseTextMarkup(it)}</li>`).join('');
    return `<ul class="detail-list">${listItemsHtml}</ul>`; 
}//:contentReference[oaicite:19]{index=19}:contentReference[oaicite:20]{index=20}

// Returns an HTML snippet for a detail text block, or a default "Not specified" message if empty.
function createDetailText(textBlock) {
    if (!textBlock || textBlock.toString().trim() === '') {
        return '<p class="text-gray-500 italic">Not specified.</p>'; 
    }
    const safeText = parseTextMarkup(textBlock.toString());
    return `<div class="detail-text">${safeText}</div>`; 
}//:contentReference[oaicite:21]{index=21}

// Attaches click handlers to elements with class `.toggle-info` (additional info spans) to show or hide their hidden text.
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
}//:contentReference[oaicite:22]{index=22}:contentReference[oaicite:23]{index=23}

// Attaches click handlers to collapsible detail section headers (elements with `.toggle-category` class) to toggle their visibility.
function attachToggleCategoryHandlers(container) {      
    container.querySelectorAll('.toggle-category').forEach(header => {
        addTapListener(header, () => {
            const arrow = header.querySelector('.arrow');
            if (arrow) arrow.classList.toggle('rotate');
            const content = header.nextElementSibling;
            if (content) content.classList.toggle('hidden'); 
        }); 
    }); 
}//:contentReference[oaicite:24]{index=24}:contentReference[oaicite:25]{index=25}

// Appends all detail sections for a topic into the content area, including “Class”, “Indications”, “Contraindications”, etc.
// If the topic has no details, a placeholder message is inserted.
function appendTopicDetails(topic) {
    // If the topic has an alternate ID (e.g., "123-Name"), use its base ID to find details
    let details = topic.details;
    if (!details && topic.id?.match(/^\d+-/)) {
        const altId = topic.id.replace(/^\d+-/, '');
        details = allDisplayableTopicsMap[altId]?.details;
    } else if (!details && topic.id && !topic.id.match(/^\d+-/)) {
        const altId = Object.keys(allDisplayableTopicsMap).find(k => k.endsWith(topic.id));
        if (altId) details = allDisplayableTopicsMap[altId]?.details;
    }
    // Render each detail section if available, otherwise insert "No detail information" message
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
            // Section header element (clickable to collapse/expand)
            const title = document.createElement('div');
            title.className = 'detail-section-title toggle-category cursor-pointer flex items-center';
            title.innerHTML = `<svg class="arrow h-4 w-4 text-blue-600 transition-transform duration-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />**</svg>${sec.label}`; // blue arrows within main page categories
            wrapper.appendChild(title);
            // Section body (list or text)
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
                body.innerHTML = parseTextMarkup ? parseTextMarkup(details[sec.key]) : details[sec.key];
            }
            // Hide section content by default; revealed when header is clicked
            body.classList.add('hidden');
            wrapper.appendChild(body);
            contentArea.appendChild(wrapper); 
        });  
    } else { 
        contentArea.insertAdjacentHTML('beforeend', `<div class="text-gray-500 italic">No detail information found for this item.</div>`);
    }
}//:contentReference[oaicite:26]{index=26}:contentReference[oaicite:27]{index=27}:contentReference[oaicite:28]{index=28}:contentReference[oaicite:29]{index=29}:contentReference[oaicite:30]{index=30}:contentReference[oaicite:31]{index=31}

// (Optional helper) Finds the index of a topic in a list of children by matching IDs (including alternate ID forms).
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
}//:contentReference[oaicite:32]{index=32}:contentReference[oaicite:33]{index=33}

// Renders the detailed view for a given topic, including the title, any warning alerts, and detail sections. 
// Also updates history (unless disabled) and scrolls to top if requested.
function renderDetailPage(topicId, shouldAddHistory = true, scrollToTop = true) {
    if (!allDisplayableTopicsMap[topicId]) { 
        contentArea.innerHTML = `<div class="text-gray-500 italic">Not found.</div>`; 
        return; 
    }
    const topic = allDisplayableTopicsMap[topicId];
    contentArea.innerHTML = '';
    // Header (topic title)
    const headerEl = document.createElement('h2');
    headerEl.textContent = topic.title || topic.name || topic.id;
    headerEl.className = 'topic-h2 font-semibold text-lg mb-4';
    headerEl.dataset.topicId = topic.id;
    contentArea.appendChild(headerEl);
    // Insert any warning alerts at the top of the page
    const warningsHtml = appendTopicWarnings(topic);
    if (warningsHtml) {
        contentArea.insertAdjacentHTML('beforeend', warningsHtml);
    }
    // Append all detail sections for this topic
    appendTopicDetails(topic);
    // Attach toggle handlers for collapsible info and category sections
    attachToggleInfoHandlers(contentArea);
    attachToggleCategoryHandlers(contentArea);
    // If a description exists (and no slug anchors were inserted), append it below details
    if (topic.description) { 
        const desc = document.createElement('div');
        desc.className = 'mb-4'; 
        desc.textContent = topic.description; 
        contentArea.appendChild(desc); 
    }
    // Update history state for this detail view
    if (shouldAddHistory) {
        addHistoryEntry({ viewType: 'detail', contentId: topicId });
    }
    // Scroll to top of content area if requested
    if (scrollToTop) { 
        contentArea.scrollIntoView({ behavior: 'auto', block: 'start' }); 
    }
}//:contentReference[oaicite:34]{index=34}:contentReference[oaicite:35]{index=35}:contentReference[oaicite:36]{index=36}:contentReference[oaicite:37]{index=37}:contentReference[oaicite:38]{index=38}:contentReference[oaicite:39]{index=39}
