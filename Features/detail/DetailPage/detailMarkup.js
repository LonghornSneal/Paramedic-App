import { escapeHtml } from './utils/escapeHtml.js';

export function parseTextMarkup(text) {
  let safeText = escapeHtml(text?.toString() ?? '');
  safeText = safeText.replace(/\n/g, ' ');
  safeText = safeText.replace(/\[\[(.+?)\|(.+?)\]\]/g, (_, display, info) => {
    return `<span class="toggle-info" role="button" tabindex="0" aria-expanded="false"><span class="toggle-info-label">${display}</span><span class="toggle-info-indicator" aria-hidden="true">Show</span><span class="info-text hidden">${info}</span></span>`;
  });
  safeText = safeText.replace(/\{\{red:(.+?)\}\}/g, (_, t) => `<span class="text-red-600 font-semibold">${t}</span>`);
  safeText = safeText.replace(/\{\{redul:(.+?)\}\}/g, (_, t) => `<span class="text-red-600 font-semibold underline decoration-red-600">${t}</span>`);
  safeText = safeText.replace(/\{\{orange:(.+?)\}\}/g, (_, t) => `<span class="text-orange-600">${t}</span>`);
  safeText = safeText.replace(/\{\{blackul:(.+?)\}\}/g, (_, t) => `<span class="font-bold underline decoration-black">${t}</span>`);
  return safeText;
}

export function createDetailList(itemsArray) {
  if (!itemsArray || itemsArray.length === 0) {
    return '<p class="text-gray-500 italic">None listed.</p>';
  }
  const listItemsHtml = itemsArray.map(item => `<li>${parseTextMarkup(item)}</li>`).join('');
  return `<ul class="detail-list">${listItemsHtml}</ul>`;
}

export function createDetailText(textBlock) {
  if (!textBlock || textBlock.toString().trim() === '') {
    return '<p class="text-gray-500 italic">Not specified.</p>';
  }
  const safeText = parseTextMarkup(textBlock.toString());
  return `<div class="detail-text">${safeText}</div>`;
}
