// Detailed topic view rendering
// (warning toggles, text formatting, etc.):
// (since the search calls renderDetailPage).
import { addHistoryEntry } from '../navigation/Navigation.js';
import { appendTopicWarnings } from '../Warnings.js';
import { setupSlugAnchors } from '../anchorNav/slugAnchors.js';
import { slugify } from '../../Utils/slugify.js';
import { hideEquipmentPopover, initializeEquipmentPopovers } from './equipmentPopover.js';
import { renderCricothyrotomyDetail } from './cricothyrotomyDetail.js';
import { renderAbbreviationGroupDetail } from './abbreviationDetail.js';
import { renderEquipmentFromMarkdown, renderMarkdownDetail, renderOriginalPdfSection, renderPlaceholder, insertEquipmentSection } from './markdownDetail.js';
import { renderQuickVentSetup, renderQuickVentCalculator } from './quickVent.js';
import { attachToggleInfoHandlers, attachToggleCategoryHandlers, parseTextMarkup } from './detailPageUtils.js';
import { addTapListener } from '../../Utils/addTapListener.js';

// Appends all detail sections for a topic into the content area, including “Class”, “Indications”, “Contraindications”, etc.
// If the topic has no details, a placeholder message is inserted.
function appendTopicDetails(topic, contentArea) {
    // If the topic has an alternate ID (e.g., "123-Name"), use its base ID to find details
    let details = topic.details;
    if (!details && topic.id?.match(/^\\d+-/)) {
        const baseId = topic.id.replace(/^\\d+-/, '');
        details = window.allDisplayableTopicsMap?.[baseId]?.details;
    } else if (!details && topic.id) {
        const altIdKey = Object.keys(window.allDisplayableTopicsMap || {}).find(k => k.endsWith(topic.id));
        if (altIdKey) details = window.allDisplayableTopicsMap[altIdKey]?.details;
    }
    if (details?.render === 'cricothyrotomy') {
        renderCricothyrotomyDetail(topic, details, contentArea);
        return;
    }
    if (details?.abbreviationGroup) {
        renderAbbreviationGroupDetail(details.abbreviationGroup, contentArea);
        return;
    }
    // Equipment topics:
    // - If mdPath provided: render Cheat Sheet + sections from Markdown and include PDF tools
    // - If only originalPdf provided: render a PDF-only section
    if (details?.mdPath && !details?.equipment) {
        renderMarkdownDetail(details, contentArea, topic);
        return;
    }
    if (details?.equipment) {
        if (details.mdPath) {
            renderEquipmentFromMarkdown(details, contentArea, topic);
        } else if (details.originalPdf) {
            // Prefer helper if present; otherwise inline fallback to avoid runtime errors
            if (typeof renderOriginalPdfSection === 'function') {
                renderOriginalPdfSection(details, contentArea, topic);
            } else {
                const pdfUrl = details.pdfPage ? `${details.originalPdf}#page=${details.pdfPage}` : details.originalPdf;
                const embedId = `pdf-embed-${slugify(topic.id)}-only`;
                const btnId = `pdf-toggle-${slugify(topic.id)}-only`;
                const html = `
                  <div class="mb-2">
                    <a href="${pdfUrl}" target="_blank" rel="noopener" class="text-blue-600 underline">Open Original PDF</a>
                    <button id="${btnId}" class="ml-2 text-sm px-2 py-1 border rounded text-blue-600 border-blue-300 hover:bg-blue-50">View Inline</button>
                  </div>
                  <div id="${embedId}" class="hidden w-full"><object data="${pdfUrl}" type="application/pdf" width="100%" height="640px"></object></div>
                `;
                insertEquipmentSection(contentArea, 'Original Documentation', html);
                const btn = document.getElementById(btnId);
                const embed = document.getElementById(embedId);
                if (btn && embed) {
                  addTapListener(btn, () => {
                    embed.classList.toggle('hidden');
                    btn.textContent = embed.classList.contains('hidden') ? 'View Inline' : 'Hide PDF';
                  });
                }
            }
        } else if (details.placeholder) {
            renderPlaceholder(details, contentArea, topic);
        }
        if (details.quickVent === 'setup') {
            renderQuickVentSetup(contentArea);
        } else if (details.quickVent === 'calculator') {
            renderQuickVentCalculator(contentArea);
        }
        return;
    }
    // Render each detail section if available, otherwise insert "No detail information" message
    if (details) {
        const sections = [ 
            { key: 'class', label: 'Class' },
            { key: 'concentration', label: 'Concentration' },
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
            titleEl.className = 'detail-section-title toggle-category';
            titleEl.setAttribute('role', 'button');
            titleEl.setAttribute('tabindex', '0');
            titleEl.setAttribute('aria-expanded', 'false');
            const titleLabel = document.createElement('span');
            titleLabel.className = 'detail-section-label';
            titleLabel.textContent = sec.label;
            const indicatorEl = document.createElement('span');
            indicatorEl.className = 'section-indicator';
            indicatorEl.textContent = 'Show';
            titleEl.id = slugify(sec.label);  // Assign unique ID for anchor navigation
            titleEl.append(titleLabel, indicatorEl);
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
    if (/^\\d+-/.test(topicId)) {
        const altId = topicId.replace(/^\\d+-/, '');
        idx = children.findIndex(child => child.id === altId);
        if (idx !== -1) return idx;
    }
    const altId = Object.keys(window.allDisplayableTopicsMap || {}).find(k => k.endsWith(topicId));
    if (altId) {
        idx = children.findIndex(child => child.id === altId);
        if (idx !== -1) return idx;
    }
    return -1;
}

// Renders the detailed view for a given topic, including the title, any warning alerts, and detail sections. 
// Also updates history (unless disabled) and scrolls to top if requested.
export function renderDetailPage(topicId, shouldAddHistory = true, scrollToTop = true) {
    const contentArea = window.contentArea || document.getElementById('content-area');
    if (!window.allDisplayableTopicsMap[topicId]) { 
        contentArea.innerHTML = `<div class="text-gray-500 italic">Not found.</div>`; 
        return; 
    }
    contentArea.classList.remove('detail-space', 'detail-space-anaphylaxis');
    if (topicId === 'adult-anaphylaxis') {
        contentArea.classList.add('detail-space', 'detail-space-anaphylaxis');
    }
    const topic = window.allDisplayableTopicsMap[topicId];
    hideEquipmentPopover(true, true);
    contentArea.innerHTML = '';
    // Header (topic title) - skip for Quick Vent pages (they render their own centered title)
    const isQuickVent = /^zoll-quick-vent-/.test(topicId);
    if (!isQuickVent) {
        const headerEl = document.createElement('h2');
        headerEl.textContent = topic.title || topic.name || topic.id;
        headerEl.className = 'topic-h2 title-tier font-semibold text-lg mb-4';
        headerEl.dataset.topicId = topic.id;
        contentArea.appendChild(headerEl);
    } else {
        // Still store topic id for updatePatientData refresh detection
        const hidden = document.createElement('div');
        hidden.className = 'topic-h2 hidden';
        hidden.dataset.topicId = topic.id;
        contentArea.appendChild(hidden);
    }
    // Insert any warning alerts at the top of the page
    const warningsHtml = appendTopicWarnings(topic, window.patientData);
    if (warningsHtml) {
        contentArea.insertAdjacentHTML('beforeend', warningsHtml);
    }
    // Detail sections for this topic
    appendTopicDetails(topic, contentArea);
    // Attach toggle handlers for collapsible info and category sections
    attachToggleInfoHandlers(contentArea);
    attachToggleCategoryHandlers(contentArea);
    initializeEquipmentPopovers(contentArea);
    // Insert table of contents for detail sections (if any sections exist)
    const tocSections = Array.from(contentArea.querySelectorAll('.detail-section-title'))
                        .map(el => ({ id: el.id, label: el.textContent }));
    // Only show a Table of Contents for long pages (avoid duplicate-looking headers on short pages)
    if (typeof window !== 'undefined' && window.ENABLE_DETAIL_TOC && tocSections.length >= 6) {
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
