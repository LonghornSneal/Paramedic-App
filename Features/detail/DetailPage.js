// Detailed topic view rendering

// (warning toggles, text formatting, etc.):

// (since the search calls renderDetailPage).
import { addHistoryEntry } from '../navigation/Navigation.js';
import { addTapListener } from '../../Utils/addTapListener.js';
import { appendTopicWarnings } from '../Warnings.js';
import { setupSlugAnchors } from '../anchorNav/slugAnchors.js';
// Import slugify for use in setting section IDs
import { slugify } from '../../Utils/slugify.js';
// Converts special markup in text (e.g. **bold**, [[display|info]]) into formatted HTML, and escapes HTML characters.
function parseTextMarkup(text) {
    let safeText = text.replace(/&/g, "&amp;")
                       .replace(/</g, "&lt;")
                       .replace(/>/g, "&gt;");
    safeText = safeText.replace(/\n/g, "<br>");
    // Replace [[display|info]] with a toggle-able info span including an arrow icon and hidden info text
    safeText = safeText.replace(/\[\[(.+?)\|(.+?)\]\]/g,
        (_, display, info) => `<span class="toggle-info"><svg class="arrow h-4 w-4 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>${display}<span class="info-text hidden">${info}</span></span>`);
    // Replace custom markup for colored/underlined text
    safeText = safeText.replace(/\{\{red:(.+?)\}\}/g, (_, t) => `<span class="text-red-600 font-semibold">${t}</span>`);
    safeText = safeText.replace(/\{\{redul:(.+?)\}\}/g, (_, t) => `<span class="text-red-600 font-semibold underline decoration-red-600">${t}</span>`);
    safeText = safeText.replace(/\{\{orange:(.+?)\}\}/g, (_, t) => `<span class="text-orange-600">${t}</span>`);
    safeText = safeText.replace(/\{\{blackul:(.+?)\}\}/g, (_, t) => `<span class="font-bold underline decoration-black">${t}</span>`);
    return safeText;
}

// Generates an HTML `<ul>` list for an array of detail items, or a placeholder if none.
function createDetailList(itemsArray) {
    if (!itemsArray || itemsArray.length === 0) {
        return '<p class="text-gray-500 italic">None listed.</p>'; 
    }
    const listItemsHtml = itemsArray.map(it => `<li>${parseTextMarkup(it)}</li>`).join('');
    return `<ul class="detail-list">${listItemsHtml}</ul>`; 
}

// Returns an HTML snippet for a detail text block, or a default "Not specified" message if empty.
function createDetailText(textBlock) {
    if (!textBlock || textBlock.toString().trim() === '') {
        return '<p class="text-gray-500 italic">Not specified.</p>'; 
    }
    const safeText = parseTextMarkup(textBlock.toString());
    return `<div class="detail-text">${safeText}</div>`; 
}

// Attaches click handlers to elements with class `.toggle-info` (additional info spans) to show or hide their hidden text.
function attachToggleInfoHandlers(container) {
    container.querySelectorAll('.toggle-info').forEach(el => { 
        el.onclick = e => { 
            e.stopPropagation();
            const info = el.querySelector('.info-text');
            const arrow = el.querySelector('.arrow'); 
            arrow?.classList.toggle('rotate');
            info?.classList.toggle('hidden'); 
        }; 
    }); 
}

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
}

// Appends all detail sections for a topic into the content area, including “Class”, “Indications”, “Contraindications”, etc.
// If the topic has no details, a placeholder message is inserted.
function appendTopicDetails(topic) {
    // If the topic has an alternate ID (e.g., "123-Name"), use its base ID to find details
    let details = topic.details;
    if (!details && topic.id?.match(/^\d+-/)) {
        const baseId = topic.id.replace(/^\d+-/, '');
        details = window.allDisplayableTopicsMap?.[baseId]?.details;
    } else if (!details && topic.id) {
        const altIdKey = Object.keys(window.allDisplayableTopicsMap || {}).find(k => k.endsWith(topic.id));
        if (altIdKey) details = window.allDisplayableTopicsMap[altIdKey]?.details;
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
            const titleEl = document.createElement('div');
            titleEl.className = 'detail-section-title toggle-category cursor-pointer flex items-center';
            titleEl.innerHTML = `<svg class="arrow h-4 w-4 text-blue-600 transition-transform duration-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>${sec.label}`; // blue arrows within main page categories
            // Use slugify to set an ID on the section header for anchor navigation:
            titleEl.id = slugify(sec.label);  // Assign unique ID for anchor navigation
            wrapper.appendChild(titleEl);
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
}

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
}

// Renders the detailed view for a given topic, including the title, any warning alerts, and detail sections. 
// Also updates history (unless disabled) and scrolls to top if requested.
export function renderDetailPage(topicId, shouldAddHistory = true, scrollToTop = true) {
    if (!window.allDisplayableTopicsMap[topicId]) { 
        contentArea.innerHTML = `<div class="text-gray-500 italic">Not found.</div>`; 
        return; 
    }
    const topic = window.allDisplayableTopicsMap[topicId];
    contentArea.innerHTML = '';
    // Header (topic title)
    const headerEl = document.createElement('h2');
    headerEl.textContent = topic.title || topic.name || topic.id;
    headerEl.className = 'topic-h2 font-semibold text-lg mb-4';
    headerEl.dataset.topicId = topic.id;
    contentArea.appendChild(headerEl);
    // Insert any warning alerts at the top of the page
    const warningsHtml = appendTopicWarnings(topic, window.patientData);
    if (warningsHtml) {
        contentArea.insertAdjacentHTML('beforeend', warningsHtml);
    }
    // Detail sections for this topic
    appendTopicDetails(topic);
    // Attach toggle handlers for collapsible info and category sections
    attachToggleInfoHandlers(contentArea);
    attachToggleCategoryHandlers(contentArea);
    // Insert table of contents for detail sections (if any sections exist)
    const tocSections = Array.from(contentArea.querySelectorAll('.detail-section-title'))
                        .map(el => ({ id: el.id, label: el.textContent }));
    if (tocSections.length > 0) {
        setupSlugAnchors(tocSections);
    }
    // Description text (if any)
    if (topic.description) { 
        const desc = document.createElement('div');
        desc.className = 'mb-4'; 
        desc.textContent = topic.description; 
        contentArea.appendChild(desc); 
    }
    // Add history entry for this detail view
    if (shouldAddHistory) {
        addHistoryEntry({ viewType: 'detail', contentId: topicId });
    }
    // Scroll to top of content area if requested
    if (scrollToTop) { 
        contentArea.scrollIntoView({ behavior: 'auto', block: 'start' }); 
    }
}


// Temporary global exposure for compatibility
if (typeof window !== 'undefined') {
    window.renderDetailPage = renderDetailPage;
}