import { addTapListener } from '../../Utils/addTapListener.js';
import { slugify } from '../../Utils/slugify.js';
import { attachToggleCategoryHandlers } from './detailPageUtils.js';
import { initializeEquipmentPopovers } from './equipmentPopover.js';
import { setupSlugAnchors } from '../anchorNav/slugAnchors.js';

function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function emphasizeImportant(html){
  // critical terms → red, cautionary → yellow
  const critical = /(high\s*priority|failure|failures|do not|never|gas intake failure|self check failure|exhalation system failure)/gi;
  const caution  = /(warning|caution|alarm|mute|muting|attention)/gi;
  return html
    .replace(critical, m => `<span class="text-red-600 font-semibold">${m}</span>`)
    .replace(caution, m => `<span class="text-yellow-600 font-semibold">${m}</span>`);
}

function inlineMd(t){
  // Minimal inline handling: bold **, italic *, code `
  let s = escapeHtml(t);
  s = s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  s = s.replace(/\*(.+?)\*/g,'<em>$1</em>');
  s = s.replace(/`([^`]+)`/g,'<code>$1</code>');
  // Images ![alt](src)
  s = s.replace(/!\[([^\]]*)\]\(([^\]]*)\)/g, (m,alt,src)=> `<img src="${src}" alt="${escapeHtml(alt)}" class="max-w-full inline-block" />`);
  // Links [text](href)
  s = s.replace(/\b\[([^\]]+)\]\(([^\]]+)\)/g, (m,text,href)=> `<a href="${href}" class="text-blue-600 underline" target="_blank" rel="noopener">${escapeHtml(text)}</a>`);
  return s;
}

function renderMdBlock(lines){
  // Convert bullets, headings, and paragraphs into HTML
  let html = '';
  let inList = false;
  for (const ln of lines) {
    if (/^\s*[-*]\s+/.test(ln)) {
      if (!inList) {
        html += '<ul class="detail-list">';
        inList = true;
      }
      const inner = inlineMd(ln.replace(/^\s*[-*]\s+/, ""));
      html += `<li>${emphasizeImportant(inner)}</li>`;
      continue;
    }
    if (inList) {
      html += '</ul>';
      inList = false;
    }
    const trimmed = ln.trim();
    if (!trimmed.length) {
      continue;
    }
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = Math.min(6, headingMatch[1].length);
      const headingHtml = emphasizeImportant(inlineMd(headingMatch[2].trim()));
      html += `<h${level} class="detail-md-heading">${headingHtml}</h${level}>`;
      continue;
    }
    const paragraphHtml = emphasizeImportant(inlineMd(trimmed));
    html += `<p>${paragraphHtml}</p>`;
  }
  if (inList) {
    html += '</ul>';
  }
  return html || '<p class="text-gray-500 italic">No content</p>';
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

function parseMdSections(md, topicId){
  // Very simple parser: split by H2 headings (## )
  const lines = md.split(/\r?\n/);
  const sections=[]; let cur={ title: 'Protocol Overview', content: []};
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
    const order = ['Original Documentation','Alarm Overview','Alarm Message Center (AMC)','Alarm Name','Alarm Priorities','Alarm Icons & Service Codes','Muting Alarms','Alarm Types: Patient Safety','Alarm Types: Environment','Alarm Types: Self Check','Alarm Groups','Pop Up Messages','High Priority Alarms','Medium Priority Alarms','Low Priority Alarms','Gas Intake Failures','High O2 Failures','Self Check Failures','Exhalation System Failures'];
    sections.sort((a,b)=> order.indexOf(a.title) - order.indexOf(b.title));
  }
  return { cheat, sections };
}

export async function renderEquipmentFromMarkdown(details, contentArea, topic) {
  try {
    const res = await fetch(details.mdPath);
    if (!res.ok) throw new Error(`Failed to load ${details.mdPath}`);
    const md = await res.text();
    const { cheat, sections } = parseMdSections(md, topic.id);
    const subscriptDigits = '\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089';
    const normalizeHeading = (value = '') => {
      const raw = value.toString().trim();
      const withDigits = raw.replace(/[\u2080-\u2089]/g, char => {
        const idx = subscriptDigits.indexOf(char);
        return idx === -1 ? char : String(idx);
      });
      const collapsed = withDigits.replace(/\s+/g, ' ');
      const normalized = typeof collapsed.normalize === 'function' ? collapsed.normalize('NFKD') : collapsed;
      return normalized.toLowerCase();
    };
    const desiredTitles = Array.isArray(details.sectionTitles)
      ? details.sectionTitles
      : details.sectionTitle
      ? [details.sectionTitle]
      : topic?.title
      ? [topic.title]
      : [];
    const normalizedTargets = desiredTitles
      .map(normalizeHeading)
      .filter(Boolean);
    let selectedSections = sections;
    let matchedSpecific = false;
    if (normalizedTargets.length) {
      const matches = [];
      normalizedTargets.forEach(target => {
        const matchSection = sections.find(sec => normalizeHeading(sec.title) === target);
        if (matchSection) matches.push(matchSection);
      });
      if (matches.length) {
        selectedSections = matches;
        matchedSpecific = true;
      }
    }
    const hasSpecificSection = matchedSpecific;
    const collapsible = details.collapsible ?? !hasSpecificSection;
    const expandSections = details.expandSections ?? hasSpecificSection;
    const showCheat = details.includeCheat ?? !hasSpecificSection;
    const enableToc = details.includeToc ?? (!hasSpecificSection && selectedSections.length >= 6);
    if (details.originalPdf) {
      renderOriginalPdfSection(details, contentArea, topic);
    }
    const cheatHtml = details.cheat && Array.isArray(details.cheat) && details.cheat.length
      ? renderMdBlock(details.cheat)
      : cheat;
    if (showCheat && cheatHtml && cheatHtml.trim()) {
      insertEquipmentSection(contentArea, 'Cheat Sheet', cheatHtml, {
        collapsible,
        expanded: expandSections
      });
    }
    selectedSections.forEach(sec => {
      insertEquipmentSection(contentArea, sec.title, sec.html, {
        collapsible,
        expanded: expandSections
      });
    });
    attachToggleCategoryHandlers(contentArea);
    initializeEquipmentPopovers(contentArea);
    const tocSections = [];
    if (showCheat && cheatHtml && cheatHtml.trim()) {
      tocSections.push({ id: slugify('Cheat Sheet'), label: 'Cheat Sheet' });
    }
    selectedSections.forEach(sec => {
      tocSections.push({ id: slugify(sec.title), label: sec.title });
    });
    if (enableToc && typeof window !== 'undefined' && window.ENABLE_DETAIL_TOC && tocSections.length >= 6) {
      setupSlugAnchors(tocSections);
    }
  } catch (err) {
    contentArea.insertAdjacentHTML('beforeend', `<div class="text-red-700">Unable to load content: ${escapeHtml(err.message)}</div>`);
  }
}

export async function renderMarkdownDetail(details, contentArea, topic) {
  try {
    const res = await fetch(details.mdPath);
    if (!res.ok) throw new Error(`Failed to load ${details.mdPath}`);
    const md = await res.text();
    const parsed = parseMdSections(md, topic.id) || { sections: [] };
    const sectionList = (parsed.sections && parsed.sections.length)
      ? parsed.sections.map(sec => ({ title: sec.title, html: sec.html ?? renderMdBlock(sec.content || []) }))
      : [{ title: topic.title || 'Protocol Detail', html: renderMdBlock(md.split(/\r?\n/)) }];
    const collapsibleHeadings = Array.isArray(details.collapsibleHeadings)
      ? new Set(details.collapsibleHeadings.map(h => h.toString().toLowerCase()))
      : null;
    sectionList.forEach((section, index) => {
      const titleText = (section.title || '').toString();
      if (collapsibleHeadings && collapsibleHeadings.has(titleText.toLowerCase())) {
        const detailsEl = document.createElement('details');
        detailsEl.className = 'md-summary-collapsible';
        const summaryEl = document.createElement('summary');
        summaryEl.className = 'md-summary-title';
        const label = document.createElement('span');
        label.className = 'md-summary-label';
        label.textContent = titleText || topic.title || `Section ${index + 1}`;
        const indicator = document.createElement('span');
        indicator.className = 'md-summary-indicator';
        indicator.textContent = 'Show';
        summaryEl.append(label, indicator);
        summaryEl.addEventListener('click', () => {
          requestAnimationFrame(() => {
            indicator.textContent = detailsEl.open ? 'Hide' : 'Show';
          });
        });
        detailsEl.appendChild(summaryEl);
        const body = document.createElement('div');
        body.className = 'detail-text';
        body.innerHTML = section.html || '';
        detailsEl.appendChild(body);
        contentArea.appendChild(detailsEl);
        return;
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'detail-section mb-3';
      const titleEl = document.createElement('div');
      titleEl.className = 'detail-section-title toggle-category';
      titleEl.setAttribute('role', 'button');
      titleEl.setAttribute('tabindex', '0');
      const expanded = index === 0;
      titleEl.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      const titleLabel = document.createElement('span');
      titleLabel.className = 'detail-section-label';
      titleLabel.textContent = section.title || topic.title || `Section ${index + 1}`;
      const indicatorEl = document.createElement('span');
      indicatorEl.className = 'section-indicator';
      indicatorEl.textContent = expanded ? 'Hide' : 'Show';
      const headerId = slugify(`${topic.id || 'topic'}-${section.title || index}`);
      titleEl.id = headerId;
      titleEl.append(titleLabel, indicatorEl);
      const body = document.createElement('div');
      body.className = 'detail-text';
      if (!expanded) body.classList.add('hidden');
      body.innerHTML = section.html || '';
      wrapper.append(titleEl, body);
      contentArea.appendChild(wrapper);
    });
    attachToggleCategoryHandlers(contentArea);
    initializeEquipmentPopovers(contentArea);
  } catch (err) {
    console.error('renderMarkdownDetail', err);
    contentArea.insertAdjacentHTML('beforeend', `<div class="text-red-700">Unable to load content: ${escapeHtml(err.message)}</div>`);
  }
}

export function renderOriginalPdfSection(details, contentArea, topic){
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

export function insertEquipmentSection(container, title, html, options = {}) {
  const { collapsible = true, expanded = false, headingTag = 'h3' } = options;
  const wrapper = document.createElement('div');
  wrapper.className = 'detail-section mb-3';
  if (!collapsible) {
    const headingEl = document.createElement(headingTag);
    headingEl.className = 'detail-section-title';
    headingEl.id = slugify(title);
    headingEl.textContent = title;
    wrapper.appendChild(headingEl);
    const body = document.createElement('div');
    body.className = 'detail-text';
    body.innerHTML = html;
    wrapper.appendChild(body);
    container.appendChild(wrapper);
    return;
  }
  const titleEl = document.createElement('div');
  titleEl.className = 'detail-section-title toggle-category';
  titleEl.setAttribute('role', 'button');
  titleEl.setAttribute('tabindex', '0');
  titleEl.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  const titleLabel = document.createElement('span');
  titleLabel.className = 'detail-section-label';
  titleLabel.textContent = title;
  const indicatorEl = document.createElement('span');
  indicatorEl.className = 'section-indicator';
  indicatorEl.textContent = expanded ? 'Hide' : 'Show';
  titleEl.id = slugify(title);
  titleEl.append(titleLabel, indicatorEl);
  wrapper.appendChild(titleEl);
  const body = document.createElement('div');
  body.className = 'detail-text';
  body.innerHTML = html;
  if (!expanded) {
    body.classList.add('hidden');
  } else {
    titleEl.classList.add('is-expanded');
  }
  wrapper.appendChild(body);
  container.appendChild(wrapper);
}

export function renderPlaceholder(details, contentArea, topic){
  const pdfUrl = details.originalPdf && details.pdfPage ? `${details.originalPdf}#page=${details.pdfPage}` : details.originalPdf || '';
  const link = pdfUrl ? `<a href="${pdfUrl}" target="_blank" rel="noopener" class="text-blue-600 underline">View source PDF (chapter)</a>` : '';
  const html = `
    <p class="text-gray-700">Edited Documentation placeholder for <strong>${escapeHtml(topic.title || topic.id)}</strong>.</p>
    <p class="text-gray-600">Content will be inserted here after your PDF edits are finalized.</p>
    ${link}
  `;
  insertEquipmentSection(contentArea, 'Edited Documentation', html);
}