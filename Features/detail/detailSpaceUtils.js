export const detailSpaceTopics = new Set([
  'adult-anaphylaxis',
  'adult-seizure',
  'adult-sepsis'
]);

export function resetDetailSpaceClasses(contentArea) {
  if (!contentArea) return;
  contentArea.classList.remove('detail-space');
  [...contentArea.classList].forEach(cls => {
    if (cls.startsWith('detail-space-')) {
      contentArea.classList.remove(cls);
    }
  });
}

export function applyDetailSpaceClasses(contentArea, topicId) {
  resetDetailSpaceClasses(contentArea);
  if (detailSpaceTopics.has(topicId)) {
    contentArea.classList.add('detail-space', `detail-space-${topicId}`);
  }
}
