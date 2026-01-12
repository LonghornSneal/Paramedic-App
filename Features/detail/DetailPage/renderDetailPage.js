import { addHistoryEntry } from '../../navigation/Navigation.js';
import { appendTopicWarnings } from '../../Warnings.js';
import { setupSlugAnchors } from '../../anchorNav/slugAnchors.js';
import { appendTopicDetails } from './topicDetails.js';
import { attachSsToggleHandlers, attachToggleInfoHandlers, attachToggleCategoryHandlers } from './toggleHandlers.js';
import { initializeEquipmentPopovers, hideEquipmentPopover } from './equipment/EquipmentPopover.js';

export function findAlsMedTopicIndex(children, topicId) {
  let idx = children.findIndex(child => child.id === topicId);
  if (idx !== -1) return idx;
  if (/^\d+-/.test(topicId)) {
    const altId = topicId.replace(/^\d+-/, '');
    idx = children.findIndex(child => child.id === altId);
    if (idx !== -1) return idx;
  }
  const altId = Object.keys(window.allDisplayableTopicsMap || {}).find(key => key.endsWith(topicId));
  if (altId) {
    idx = children.findIndex(child => child.id === altId);
    if (idx !== -1) return idx;
  }
  return -1;
}

export function renderDetailPage(topicId, shouldAddHistory = true, scrollToTop = true) {
  const contentArea = window.contentArea || document.getElementById('content-area');
  if (!window.allDisplayableTopicsMap[topicId]) {
    contentArea.innerHTML = '<div class="text-gray-500 italic">Not found.</div>';
    return;
  }
  const topic = window.allDisplayableTopicsMap[topicId];
  hideEquipmentPopover(true, true);
  contentArea.innerHTML = '';
  const isQuickVent = /^zoll-quick-vent-/.test(topicId);
  if (!isQuickVent) {
    const headerEl = document.createElement('h2');
    headerEl.textContent = topic.title || topic.name || topic.id;
    headerEl.className = 'topic-h2 font-semibold text-lg mb-4';
    headerEl.dataset.topicId = topic.id;
    contentArea.appendChild(headerEl);
  } else {
    const hidden = document.createElement('div');
    hidden.className = 'topic-h2 hidden';
    hidden.dataset.topicId = topic.id;
    contentArea.appendChild(hidden);
  }
  const warningsHtml = appendTopicWarnings(topic, window.patientData);
  if (warningsHtml) {
    contentArea.insertAdjacentHTML('beforeend', warningsHtml);
  }
  appendTopicDetails(topic, contentArea);
  attachToggleInfoHandlers(contentArea);
  attachSsToggleHandlers(contentArea);
  attachToggleCategoryHandlers(contentArea);
  initializeEquipmentPopovers(contentArea);
  const tocSections = Array.from(contentArea.querySelectorAll('.detail-section-title')).map(el => ({
    id: el.id,
    label: el.textContent
  }));
  if (typeof window !== 'undefined' && window.ENABLE_DETAIL_TOC && tocSections.length >= 6) {
    setupSlugAnchors(tocSections);
  }
  if (topic.description) {
    const desc = document.createElement('div');
    desc.className = 'mb-4';
    desc.textContent = topic.description;
    contentArea.appendChild(desc);
  }
  if (shouldAddHistory) {
    addHistoryEntry({ viewType: 'detail', contentId: topicId });
  }
  if (scrollToTop) {
    contentArea.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
}

if (typeof window !== 'undefined') {
  window.renderDetailPage = renderDetailPage;
}
