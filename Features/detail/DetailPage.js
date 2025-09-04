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
    let safeText = text
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    safeText = safeText.replace(/\n/g, ' ');
    // Replace [[display|info]] with a toggle-able info span including an arrow icon and hidden info text
    safeText = safeText.replace(/\[\[(.+?)\|(.+?)\]\]/g,
        (_, display, info) => {
            return `<span class="toggle-info"><svg class="arrow h-4 w-4 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>${display}<span class="info-text hidden">${info}</span></span>`;
        });
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
function appendTopicDetails(topic, contentArea) {
    // If the topic has an alternate ID (e.g., "123-Name"), use its base ID to find details
    let details = topic.details;
    if (!details && topic.id?.match(/^\d+-/)) {
        const baseId = topic.id.replace(/^\d+-/, '');
        details = window.allDisplayableTopicsMap?.[baseId]?.details;
    } else if (!details && topic.id) {
        const altIdKey = Object.keys(window.allDisplayableTopicsMap || {}).find(k => k.endsWith(topic.id));
        if (altIdKey) details = window.allDisplayableTopicsMap[altIdKey]?.details;
    }
    // Equipment topics:
    // - If mdPath provided: render Cheat Sheet + sections from Markdown and include PDF tools
    // - If only originalPdf provided: render a PDF-only section
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
    const topic = window.allDisplayableTopicsMap[topicId];
    contentArea.innerHTML = '';
    // Header (topic title) — skip for Quick Vent pages (they render their own centered title)
    const isQuickVent = /^zoll-quick-vent-/.test(topicId);
    if (!isQuickVent) {
        const headerEl = document.createElement('h2');
        headerEl.textContent = topic.title || topic.name || topic.id;
        headerEl.className = 'topic-h2 font-semibold text-lg mb-4';
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

// -- Equipment (ZOLL EMV731) rendering helpers --
function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

async function renderEquipmentFromMarkdown(details, contentArea, topic){
  try {
    const res = await fetch(details.mdPath);
    if (!res.ok) throw new Error(`Failed to load ${details.mdPath}`);
    const md = await res.text();
    const { cheat, sections } = parseMdSections(md, topic.id);
    if (details.originalPdf) {
      const pdfUrl = details.pdfPage ? `${details.originalPdf}#page=${details.pdfPage}` : details.originalPdf;
      const embedId = `pdf-embed-${slugify(topic.id)}`;
      const btnId = `pdf-toggle-${slugify(topic.id)}`;
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

function renderOriginalPdfSection(details, contentArea, topic){
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
    // Insert Cheat Sheet first (prefer curated if present on details)
    const cheatHtml = details.cheat && Array.isArray(details.cheat) && details.cheat.length
      ? renderMdBlock(details.cheat)
      : cheat;
    insertEquipmentSection(contentArea, 'Cheat Sheet', cheatHtml);
    // Then other sections
    sections.forEach(sec => insertEquipmentSection(contentArea, sec.title, sec.html));
    // Bind expand/collapse after insertion
    attachToggleCategoryHandlers(contentArea);
    // Build TOC for long pages
    const tocSections = [
      { id: slugify('Cheat Sheet'), label: 'Cheat Sheet' },
      ...sections.map(s => ({ id: slugify(s.title), label: s.title }))
    ];
    if (tocSections.length >= 6) {
      setupSlugAnchors(tocSections);
    }
  } catch(err){
    contentArea.insertAdjacentHTML('beforeend', `<div class="text-red-700">Unable to load content: ${escapeHtml(err.message)}</div>`);
  }
}

function insertEquipmentSection(container, title, html){
  const wrapper = document.createElement('div');
  wrapper.className = 'detail-section mb-3';
  const titleEl = document.createElement('div');
  titleEl.className = 'detail-section-title toggle-category cursor-pointer flex items-center';
  titleEl.innerHTML = `<svg class="arrow h-4 w-4 text-blue-600 transition-transform duration-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>${escapeHtml(title)}`;
  titleEl.id = slugify(title);
  wrapper.appendChild(titleEl);
  const body = document.createElement('div');
  body.className = 'detail-text hidden';
  body.innerHTML = html;
  wrapper.appendChild(body);
  container.appendChild(wrapper);
}

function renderPlaceholder(details, contentArea, topic){
  const pdfUrl = details.originalPdf && details.pdfPage ? `${details.originalPdf}#page=${details.pdfPage}` : details.originalPdf || '';
  const link = pdfUrl ? `<a href="${pdfUrl}" target="_blank" rel="noopener" class="text-blue-600 underline">View source PDF (chapter)</a>` : '';
  const html = `
    <p class="text-gray-700">Edited Documentation placeholder for <strong>${escapeHtml(topic.title || topic.id)}</strong>.</p>
    <p class="text-gray-600">Content will be inserted here after your PDF edits are finalized.</p>
    ${link}
  `;
  insertEquipmentSection(contentArea, 'Edited Documentation', html);
}

function renderQuickVentSetup(contentArea){
  const wrap = document.createElement('div');
  wrap.className = 'mb-4';
  wrap.innerHTML = `
    <div class="text-center mb-3"><span class="font-semibold underline text-2xl md:text-3xl">Zoll Set Up</span></div>
    <div class="qv relative max-w-3xl mx-auto border border-gray-400 rounded pt-1 pb-2 mb-4">
      <div class="qv-legend absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-sm font-semibold underline">Input Pt Info</div>
    <div class="qv-row">
      <div class="qv-field">
        <label class="block text-sm font-medium mb-1 underline text-center">Sex</label>
        <div id="qv-sex" class="flex flex-col gap-1 items-center">
          <button data-val="male" class="text-sm border border-gray-500 rounded px-1 leading-tight">♂</button>
          <button data-val="female" class="text-sm border border-gray-500 rounded px-1 leading-tight">♀</button>
        </div>
      </div>
      <div class="qv-field">
        <label class="block text-sm font-medium mb-1 underline text-center">Weight</label>
        <div class="qv-weight">
          <div class="qv-unit"><input type="text" inputmode="decimal" id="qv-weight-lb" class="qv-input qv-num" placeholder="" aria-label="Weight pounds" /><span class="qv-suffix">lb</span></div>
          <div class="qv-unit"><input type="text" inputmode="decimal" id="qv-weight-kg" class="qv-input qv-num" placeholder="" aria-label="Weight kilograms" /><span class="qv-suffix">kg</span></div>
        </div>
      </div>
      <div class="qv-field">
        <label class="block text-sm font-medium mb-1 underline text-center">Height</label>
        <div class="qv-height">
          <div class="qv-height-pair">
            <div class="qv-unit"><input type="text" inputmode="numeric" id="qv-height-ft" class="qv-input qv-num" placeholder="" aria-label="Height feet" /><span class="qv-suffix">ft</span></div>
            <div class="qv-unit"><input type="text" inputmode="numeric" id="qv-height-in" class="qv-input qv-num" placeholder="" aria-label="Height inches" /><span class="qv-suffix">in</span></div>
          </div>
          <div class="qv-height-total"><input type="text" inputmode="numeric" id="qv-height-inches" class="qv-input qv-num" placeholder="" aria-label="Total inches" /><span class="qv-total-label">in</span></div>
        </div>
      </div>
      <div class="qv-field">
        <label class="block text-sm font-medium mb-1 underline text-center">ARDS?</label>
        <div id="qv-ards" class="flex flex-col gap-1 items-center">
          <button data-val="yes" class="text-sm border border-gray-500 rounded px-1 leading-tight">Yes</button>
          <button data-val="no" class="text-sm border border-gray-500 rounded px-1 leading-tight">No</button>
          <button data-val="unsure" class="text-sm border border-gray-500 rounded px-1 leading-tight">Not Sure</button>
        </div>
      </div>
    </div>
    </div>
    <div class="md:col-span-2 qv-tv-row">
      <div class="qv-tv-title">Suggested Tidal Volume =</div>
      <div id="qv-tv" class="qv-tv-ans" title="Hover to see math"></div>
    </div>
    <div class="mt-4 text-sm">
      <ul class="list-disc ml-5">
        <li>IFT = Obtain vent setting from respiratory therapist</li>
        <li>New ventilator pt = Use Ideal Body Weight (IBW) to find the Tidal Volume</li>
        <li><span class="qv-toggle text-green-700 cursor-pointer">Attach circuit to circuit tube hole <span class="qv-arrow">→</span><span class="qv-info hidden">big tube covered by red cap on right</span></span></li>
        <li><span class="qv-toggle text-green-700 cursor-pointer">Attach green tube to top transducer port <span class="qv-arrow">→</span><span class="qv-info hidden">top left</span></span></li>
        <li><span class="qv-toggle text-green-700 cursor-pointer">Attach clear tube to bottom port exhalation valve <span class="qv-arrow">→</span><span class="qv-info hidden">bottom left</span></span></li>
        <li>Turn on → Let self test run → Patient disconnect should display</li>
        <li>Check high pressure alarm by putting gloved hand against end of vent circuit</li>
        <li>Select mode - Assistant Control (AC) or SIMV</li>
        <li>Select breath type - Volume or Pressure</li>
        <li>Adjust settings &amp; alarms prn</li>
        <li><span class="qv-toggle text-green-700 cursor-pointer">Attach filter &amp; Capnography <span class="qv-arrow">→</span><span class="qv-info hidden">Place filter closer to pt &amp; place Capno on the other side of the filter that is farther from the pt</span></span></li>
        <li>Attach circuit to the pt</li>
        <li>Assess the pt\'s reaction to the vent &amp; document settings on Vent Form</li>
        <li>If any changes are needed, then discuss those changes with the Respiratory Therapist and document the changes on the Vent Form.</li>
      </ul>
    </div>
  `;
  contentArea.appendChild(wrap);
  // Ensure sex buttons have no stray inner text (control chars) so only ::before icons show
  try { wrap.querySelectorAll('#qv-sex button').forEach(b => { b.textContent = ''; }); } catch(e) {}
  // Transform specific list items: make the leading instruction text non-interactive
  try {
    const patterns = [
      { prefix: 'Attach circuit to ', clickable: 'circuit tube hole' },
      { prefix: 'Attach green tube to ', clickable: 'top transducer port' },
      { prefix: 'Attach clear tube to ', clickable: 'bottom port exhalation valve' },
    ];
    wrap.querySelectorAll('.qv-toggle').forEach(span => {
      const li = span.closest('li');
      if (!li) return;
      const textBeforeArrow = Array.from(span.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent || '')
        .join('')
        .trim();
      for (const p of patterns) {
        if (textBeforeArrow.startsWith(p.prefix) && textBeforeArrow.includes(p.clickable)) {
          // Inject non-interactive prefix before span
          const prefixNode = document.createTextNode(p.prefix);
          li.insertBefore(prefixNode, span);
          // Reduce span's leading text to just the clickable segment
          // Replace first text node's content
          const t = span.childNodes[0];
          if (t && t.nodeType === Node.TEXT_NODE) {
            t.textContent = p.clickable + ' ';
          }
          const arrow = span.querySelector('.qv-arrow');
          if (arrow) { arrow.textContent = '→'; arrow.style.color = '#000'; }
          break;
        }
      }
    });
  } catch(e) { /* ignore */ }
  attachToggleInfoHandlers(contentArea);
  // Quick vent specific toggles (no underline, no arrow)
  wrap.querySelectorAll('.qv-toggle').forEach(el => {
    el.addEventListener('click', (e)=>{
      const info = el.querySelector('.qv-info');
      if (info) info.classList.toggle('hidden');
      el.classList.toggle('open', !info?.classList.contains('hidden'));
    });
  });

  // Prefill from patientData
  const sexContainer = wrap.querySelector('#qv-sex');
  const wtKgEl = wrap.querySelector('#qv-weight-kg');
  const wtLbEl = wrap.querySelector('#qv-weight-lb');
  const wtClrEl = wrap.querySelector('#qv-weight-clear');
  const ftEl = wrap.querySelector('#qv-height-ft');
  const inEl = wrap.querySelector('#qv-height-in');
  const totalEl = wrap.querySelector('#qv-height-inches');
  const ardsContainer = wrap.querySelector('#qv-ards');
  const tvEl = wrap.querySelector('#qv-tv');

  // Input helpers for validation/formatting
  function clamp(num, min, max){ if (isNaN(num)) return NaN; return Math.min(max, Math.max(min, num)); }
  function frac(numer, denom){
    return `<span class=\"frac\"><span class=\"frac-num\">${numer}</span><span class=\"frac-bar\"></span><span class=\"frac-den\">${denom}</span></span>`;
  }
  function setInputSize(el){ /* disabled autosizing to keep inputs fixed */ }
  function sanitizeIntInRange(str, min, max){
    const onlyDigits = String(str || '').replace(/[^0-9]/g, '');
    if (!onlyDigits) return '';
    let n = parseInt(onlyDigits, 10);
    if (isNaN(n)) return '';
    n = clamp(n, min, max);
    return String(n);
  }
  function sanitizeWeight(str, unit){
    // allow only digits and optional single decimal with one digit
    let s = String(str || '').toLowerCase().replace(/[^0-9.]/g, '');
    const firstDot = s.indexOf('.');
    if (firstDot !== -1){
      // keep only first dot, remove any others
      s = s.slice(0, firstDot+1) + s.slice(firstDot+1).replace(/\./g, '');
    }
    // limit to one decimal place
    s = s.replace(/^(\d+)(\.(\d)?).*$/, '$1$2$3');
    // remove leading zeros if any (except keep single zero before decimal)
    s = s.replace(/^0+(\d)/, '$1');
    // clamp to realistic max
    const max = unit === 'kg' ? 300 : 660;
    const val = parseFloat(s);
    if (!isNaN(val)) {
      const clamped = clamp(val, 0, max);
      // preserve one decimal if present, else as integer string
      s = (s.includes('.') ? clamped.toFixed(1) : String(Math.trunc(clamped)));
    } else {
      s = '';
    }
    return s;
  }

  if (window.patientData) {
    if (window.patientData.gender) selectOption(sexContainer, window.patientData.gender);
    if (window.patientData.weight != null) wtKgEl.value = window.patientData.weight;
    if (window.patientData.weight != null) wtLbEl.value = (window.patientData.weight * 2.20462).toFixed(1);
    if (window.patientData.heightIn != null) {
      const h = window.patientData.heightIn;
      totalEl.value = h;
      ftEl.value = Math.floor(h/12);
      inEl.value = h % 12;
    }
  }

  function updateSidebarFromQV() {
    // Update sidebar fields to keep in sync
    const g = getSelected(sexContainer);
    const wkg = parseFloat(wtKgEl.value || '');
    const wlb = parseFloat(wtLbEl.value || '');
    const w = !isNaN(wkg) ? wkg : (!isNaN(wlb) ? +(wlb/2.20462).toFixed(2) : NaN);
    const ft = parseInt(ftEl.value || '0',10);
    const inc = parseInt(inEl.value || '0',10);
    const total = parseInt(totalEl.value || ((ft*12 + inc)||''), 10);
    // Update patientData directly to avoid full re-render while typing
    if (window.patientData) {
      window.patientData.gender = g || window.patientData.gender;
      window.patientData.weight = !isNaN(w) ? w : window.patientData.weight;
      window.patientData.heightIn = isNaN(total) ? window.patientData.heightIn : total;
      if (typeof window.renderPatientSnapshot === 'function') window.renderPatientSnapshot();
    }
  }

  function ibwKg(sex, heightIn) {
    if (!sex || !heightIn) return null;
    const over60 = Math.max(0, heightIn - 60);
    const base = sex === 'male' ? 50 : 45.5;
    return +(base + 2.3 * over60).toFixed(1);
  }
  function tvRange(kg, ards) {
    if (!kg) return null;
    // mL/kg ranges
    const normal = [6,8];
    const ardsR = [4,6];
    if (ards === 'yes') return [Math.round(kg*ardsR[0]), Math.round(kg*ardsR[1])];
    if (ards === 'no') return [Math.round(kg*normal[0]), Math.round(kg*normal[1])];
    // unsure → return both as string later
    return {
      normal: [Math.round(kg*normal[0]), Math.round(kg*normal[1])],
      ards: [Math.round(kg*ardsR[0]), Math.round(kg*ardsR[1])]
    };
  }

  function getSelected(container){ const btn=container.querySelector('button.selected'); return btn?btn.dataset.val:''; }
  function setSelected(container, val){ container.querySelectorAll('button').forEach(b=>{ b.classList.toggle('selected', b.dataset.val===val); }); }
  function selectOption(container, val){ if (!val) return; setSelected(container, val); }

  function compute() {
    const sex = getSelected(sexContainer);
    const wkg = parseFloat(wtKgEl.value || 'NaN');
    const wlb = parseFloat(wtLbEl.value || 'NaN');
    const w = !isNaN(wkg) ? wkg : (!isNaN(wlb) ? (wlb/2.20462) : NaN);
    const total = parseInt(totalEl.value || (parseInt(ftEl.value||'0',10)*12 + parseInt(inEl.value||'0',10)), 10);
    const ards = getSelected(ardsContainer);
    let usedKg = null;
    let mathHtml = '';
    if (!isNaN(w)) {
      usedKg = +w.toFixed(1);
      mathHtml = `Using actual weight: <strong>${usedKg} kg</strong><br/>`;
    } else if (sex && !isNaN(total)) {
      const ibw = ibwKg(sex,total);
      if (ibw) {
        usedKg = ibw;
        const base = sex === 'male' ? 50 : 45.5;
        mathHtml = `IBW (${sex}) = ${base} + 2.3 × (${total} − 60) = <strong>${ibw} kg</strong><br/>`;
      }
    }
    let display = '';
    if (usedKg != null) {
      const rng = tvRange(usedKg, ards);
      if (rng && Array.isArray(rng)) {
        display = `${rng[0]} – ${rng[1]} mL`;
        mathHtml += `TV range = <strong>[${ards==='yes'?'4–6':'6–8'} mL/<s>kg</s>]</strong> × <strong>${usedKg} <s>kg</s></strong> → <strong>${rng[0]}–${rng[1]} mL</strong>`;
      } else if (rng && rng.normal) {
        display = `${rng.normal[0]}–${rng.normal[1]} mL (no ARDS) · ${rng.ards[0]}–${rng.ards[1]} mL (ARDS)`;
        mathHtml += `No ARDS: [6–8 mL/<s>kg</s>] × ${usedKg} <s>kg</s> → <strong>${rng.normal[0]}–${rng.normal[1]} mL</strong><br/>ARDS: [4–6 mL/<s>kg</s>] × ${usedKg} <s>kg</s> → <strong>${rng.ards[0]}–${rng.ards[1]} mL</strong>`;
      } else {
        display = '';
      }
    }
    tvEl.innerHTML = display;
    // Render any a/b segments as stacked fractions in the math details
    try {
      mathHtml = mathHtml.replace(/(\d+(?:-\d+)?\s*mL)\s*\/\s*(<s>kg<\/s>|kg)/g, (_, numer, denom) => frac(numer, denom));
    } catch(e) { /* ignore */ }
    // Reformat TV range explanation into formula + min/max with equals, and adjust the displayed answer block
    try {
      const single = mathHtml.match(/TV range = [\s\S]*?\[([0-9]+)-([0-9]+) mL[\s\S]*?\] [\s\S]*?<strong>([0-9]+)-([0-9]+) mL<\/strong>/);
      if (single && usedKg != null) {
        const rmin = single[1], rmax = single[2], vmin = single[3], vmax = single[4];
        const title = 'Formula: TV = [mL/<s>kg</s>] × kg';
        const body = `Min: [${rmin} mL/<s>kg</s>] × ${usedKg} <s>kg</s> = <strong>${vmin} mL</strong><br/>Max: [${rmax} mL/<s>kg</s>] × ${usedKg} <s>kg</s> = <strong>${vmax} mL</strong>`;
        mathHtml = mathHtml.replace(/TV range =[\s\S]*?<strong>[0-9]+-[0-9]+ mL<\/strong>/, `${title}<br/>${body}`);
        display = `<span class="qv-tv-ans-val">${vmin}-${vmax} mL</span>`;
      } else {
        const noMatch = mathHtml.match(/No ARDS:[\s\S]*?<strong>([0-9]+)-([0-9]+) mL<\/strong>/);
        const ardsMatch = mathHtml.match(/ARDS:[\s\S]*?<strong>([0-9]+)-([0-9]+) mL<\/strong>/);
        if (noMatch && ardsMatch && usedKg != null) {
          const nMin=noMatch[1], nMax=noMatch[2], aMin=ardsMatch[1], aMax=ardsMatch[2];
          const title = 'Formula: TV = [mL/<s>kg</s>] × kg';
          const body = `No ARDS Min: [6 mL/<s>kg</s>] × ${usedKg} <s>kg</s> = <strong>${nMin} mL</strong><br/>No ARDS Max: [8 mL/<s>kg</s>] × ${usedKg} <s>kg</s> = <strong>${nMax} mL</strong><br/>ARDS Min: [4 mL/<s>kg</s>] × ${usedKg} <s>kg</s> = <strong>${aMin} mL</strong><br/>ARDS Max: [6 mL/<s>kg</s>] × ${usedKg} <s>kg</s> = <strong>${aMax} mL</strong>`;
          mathHtml = `${title}<br/>${body}`;
          display = `<div class=\"qv-tv-ans-line\"><span class=\"qv-tv-ans-label\">no ARDS:</span> <span class=\"qv-tv-ans-val\">${nMin}-${nMax} mL</span></div>`+
                    `<div class=\"qv-tv-ans-line\"><span class=\"qv-tv-ans-label\">ARDS:</span> <span class=\"qv-tv-ans-val\">${aMin}-${aMax} mL</span></div>`;
        }
      }
      tvEl.innerHTML = display;
    } catch(e) { /* ignore */ }
    tvEl.dataset.math = mathHtml;
    // hover tooltip
    tvEl.onmouseenter = (e)=>{
      if (!tvEl.textContent) return;
      const tip = document.createElement('div'); tip.className='qv-tooltip'; tip.id='qv-tip';
      tip.innerHTML = tvEl.dataset.math || '';
      document.body.appendChild(tip);
      const r = tvEl.getBoundingClientRect(); tip.style.left = (r.left+window.scrollX)+'px'; tip.style.top=(r.bottom+window.scrollY+6)+'px';
    };
    tvEl.onmouseleave = ()=>{ document.getElementById('qv-tip')?.remove(); };
    tvEl.onclick = ()=>{
      if (!tvEl.textContent) return;
      const modal = document.createElement('div'); modal.className='qv-modal'; modal.id='qv-modal';
      modal.innerHTML = `<div class=\"qv-modal-header\"><span>Calculation Details</span><span id=\"qv-close\" class=\"qv-close\">✕</span></div><div class=\"p-3 text-sm\">${tvEl.dataset.math||''}</div>`;
      document.body.appendChild(modal);
      const close = modal.querySelector('#qv-close'); close?.addEventListener('click', ()=> modal.remove());
      // basic drag
      const hdr = modal.querySelector('.qv-modal-header');
      let sx=0, sy=0, dragging=false, offX=0, offY=0;
      hdr?.addEventListener('mousedown', (ev)=>{ dragging=true; sx=ev.clientX; sy=ev.clientY; const rect=modal.getBoundingClientRect(); offX=ev.clientX-rect.left; offY=ev.clientY-rect.top; ev.preventDefault(); });
      window.addEventListener('mousemove', (ev)=>{ if(!dragging) return; modal.style.left=(ev.clientX-offX)+'px'; modal.style.top=(ev.clientY-offY)+'px'; modal.style.transform='none'; });
      window.addEventListener('mouseup', ()=> dragging=false);
    };
  }

  // Set initial input sizes
  [wtKgEl, wtLbEl, ftEl, inEl, totalEl].forEach(el => setInputSize(el));

  // Event wiring
  sexContainer.querySelectorAll('button').forEach(btn=> {
    btn.addEventListener('click', ()=>{ setSelected(sexContainer, btn.dataset.val); updateSidebarFromQV(); compute(); });
    btn.addEventListener('mouseenter', ()=>{
      const tip = document.createElement('div'); tip.className='qv-tooltip'; tip.id='qv-sex-tip'; tip.textContent = btn.dataset.val==='male'?'Male':'Female';
      document.body.appendChild(tip);
      const r = btn.getBoundingClientRect(); tip.style.left = (r.left+window.scrollX)+'px'; tip.style.top=(r.bottom+window.scrollY+6)+'px';
    });
    btn.addEventListener('mouseleave', ()=>{ document.getElementById('qv-sex-tip')?.remove(); });
  });
  wtKgEl.addEventListener('input', ()=>{
    wtKgEl.value = sanitizeWeight(wtKgEl.value, 'kg');
    setInputSize(wtKgEl);
    const kg = parseFloat(wtKgEl.value||'NaN');
    wtLbEl.value = !isNaN(kg) ? (kg*2.20462).toFixed(1) : '';
    setInputSize(wtLbEl);
    updateSidebarFromQV(); compute();
  });
  wtLbEl.addEventListener('input', ()=>{
    wtLbEl.value = sanitizeWeight(wtLbEl.value, 'lb');
    setInputSize(wtLbEl);
    const lb = parseFloat(wtLbEl.value||'NaN');
    wtKgEl.value = !isNaN(lb) ? (lb/2.20462).toFixed(1) : '';
    setInputSize(wtKgEl);
    updateSidebarFromQV(); compute();
  });
  wtClrEl?.addEventListener('click', (e)=>{ e.preventDefault(); wtKgEl.value=''; wtLbEl.value=''; setInputSize(wtKgEl); setInputSize(wtLbEl); updateSidebarFromQV(); compute(); });
  ftEl.addEventListener('input', ()=>{ ftEl.value = sanitizeIntInRange(ftEl.value, 0, 9); setInputSize(ftEl); totalEl.value=''; updateSidebarFromQV(); compute(); });
  inEl.addEventListener('input', ()=>{ inEl.value = sanitizeIntInRange(inEl.value, 0, 11); setInputSize(inEl); totalEl.value=''; updateSidebarFromQV(); compute(); });
  totalEl.addEventListener('input', ()=>{ totalEl.value = sanitizeIntInRange(totalEl.value, 0, 99); setInputSize(totalEl); updateSidebarFromQV(); compute(); });
  ardsContainer.querySelectorAll('button').forEach(btn=> btn.addEventListener('click', ()=>{ setSelected(ardsContainer, btn.dataset.val); compute(); }));

  // Height syncing between total and ft/in inside Quick Vent
  totalEl.addEventListener('input', ()=>{
    const total = parseInt(totalEl.value||'NaN',10);
    if (!isNaN(total)) { ftEl.value = Math.floor(total/12); inEl.value = total%12; }
  });
  ftEl.addEventListener('input', ()=>{
    const ft = parseInt(ftEl.value||'0',10); const inc = parseInt(inEl.value||'0',10);
    totalEl.value = (ft*12 + inc) || '';
  });
  inEl.addEventListener('input', ()=>{
    const ft = parseInt(ftEl.value||'0',10); const inc = parseInt(inEl.value||'0',10);
    totalEl.value = (ft*12 + inc) || '';
  });

  compute();
}

function renderQuickVentCalculator(contentArea){
  const wrap = document.createElement('div');
  wrap.className = 'mb-4';
  wrap.innerHTML = `<div class="text-center mb-3"><span class="font-semibold underline">Tidal Volume Calculator</span></div>`;
  contentArea.appendChild(wrap);
  // reuse setup UI minimal
  const fake = { quickVent: 'setup' };
  renderQuickVentSetup(contentArea);
}

function parseMdSections(md, topicId){
  // Very simple parser: split by H2 headings (## )
  const lines = md.split(/\r?\n/);
  const sections=[]; let cur={ title: 'Edited Documentation', content: []};
  for(const ln of lines){
    const m = ln.match(/^##\s+(.+)/);
    if (m){
      if (cur.content.length) sections.push({ title: cur.title, html: renderMdBlock(cur.content) });
      cur = { title: m[1].trim(), content: []};
    } else {
      cur.content.push(ln);
    }
  }
  if (cur.content.length) sections.push({ title: cur.title, html: renderMdBlock(cur.content) });
  // Cheat sheet: collect important lines
  const cheat = renderCheatSheet(md, topicId);
  // Reorder for Alarms to preferred sequence if present
  if (topicId === 'zoll-emv731-alarms') {
    const order = ['Original Documentation','Alarm Overview','Alarm Name','Alarm Priorities','Muting Alarms','Alarm Groups','High Priority Alarms','Gas Intake Failures','High O2 Failures','Self Check Failures','Exhalation System Failures'];
    sections.sort((a,b)=> order.indexOf(a.title) - order.indexOf(b.title));
  }
  return { cheat, sections };
}

function emphasizeImportant(html){
  // critical terms → red, cautionary → yellow
  const critical = /(high\s*priority|failure|failures|do not|never|gas intake failure|self check failure|exhalation system failure)/gi;
  const caution  = /(warning|caution|alarm|mute|muting|attention)/gi;
  return html
    .replace(critical, m => `<span class="text-red-600 font-semibold">${m}</span>`)
    .replace(caution, m => `<span class="text-yellow-600 font-semibold">${m}</span>`);
}

function renderMdBlock(lines){
  // Convert bullets and paragraphs into HTML
  let html='';
  let inList=false;
  for(const ln of lines){
    if (/^\s*[-*]\s+/.test(ln)){
      if (!inList){ html += '<ul class="detail-list">'; inList=true; }
      const inner = inlineMd(ln.replace(/^\s*[-*]\s+/,''));
      html += `<li>${emphasizeImportant(inner)}</li>`;
    } else {
      if (inList){ html += '</ul>'; inList=false; }
      if (ln.trim().length){ const inner = inlineMd(ln.trim()); html += `<p>${emphasizeImportant(inner)}</p>`; }
    }
  }
  if (inList) html += '</ul>';
  return html || '<p class="text-gray-500 italic">No content</p>';
}

function inlineMd(t){
  // Minimal inline handling: bold **, italic *, code `
  let s = escapeHtml(t);
  s = s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  s = s.replace(/\*(.+?)\*/g,'<em>$1</em>');
  s = s.replace(/`([^`]+)`/g,'<code>$1</code>');
  // Images ![alt](src)
  s = s.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, (m,alt,src)=> `<img src="${src}" alt="${escapeHtml(alt)}" class="max-w-full inline-block" />`);
  // Links [text](href)
  s = s.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (m,text,href)=> `<a href="${href}" class="text-blue-600 underline" target="_blank" rel="noopener">${escapeHtml(text)}</a>`);
  return s;
}

function renderCheatSheet(md, topicId){
  const lines = md.split(/\r?\n/);
  const picks = [];
  const key = /(high\s*priority|failure|failures|warning|caution|alarm|mute|muting|do not|never|gas intake|self check|exhalation system)/i;
  for (const ln of lines){
    if (key.test(ln)){
      picks.push(ln.trim());
      if (picks.length >= 12) break;
    }
  }
  if (!picks.length){
    // fallback: first 8 non-empty lines
    for (const ln of lines){
      if (ln.trim()){ picks.push(ln.trim()); if (picks.length>=8) break; }
    }
  }
  return renderMdBlock(picks);
}
