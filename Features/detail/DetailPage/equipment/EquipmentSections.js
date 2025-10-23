import { addTapListener } from '../../../../Utils/addTapListener.js';
import { slugify } from '../../../../Utils/slugify.js';
import { escapeHtml } from '../utils/escapeHtml.js';

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

export function renderOriginalPdfSection(details, contentArea, topic) {
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

export function renderPlaceholder(details, contentArea, topic) {
  const pdfUrl = details.originalPdf && details.pdfPage
    ? `${details.originalPdf}#page=${details.pdfPage}`
    : details.originalPdf || '';
  const link = pdfUrl
    ? `<a href="${pdfUrl}" target="_blank" rel="noopener" class="text-blue-600 underline">View source PDF (chapter)</a>`
    : '';
  const html = `
    <p class="text-gray-700">Edited Documentation placeholder for <strong>${escapeHtml(topic.title || topic.id)}</strong>.</p>
    <p class="text-gray-600">Content will be inserted here after your PDF edits are finalized.</p>
    ${link}
  `;
  insertEquipmentSection(contentArea, 'Edited Documentation', html);
}
