// Setup or update the table of contents for detail sections
// Also inject hidden anchor elements for branch automation
function setupSlugAnchors(tocData) {
  if (typeof document === 'undefined') return;

  // Hidden container of slug IDs for external automation
  if (typeof slugIDs !== 'undefined' && Array.isArray(slugIDs)) {
    if (!document.getElementById('slug-id-container')) {
      const container = document.createElement('div');
      container.id = 'slug-id-container';
      container.classList.add('hidden');
      slugIDs.forEach(id => {
        const div = document.createElement('div');
        div.id = id;
        div.dataset.branch = id;
        container.appendChild(div);
      });
      document.body.appendChild(container);
    }
  }

  if (Array.isArray(tocData) && tocData.length > 0) {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;
    const existing = document.getElementById('detail-toc');
    if (existing) existing.remove();

    const nav = document.createElement('nav');
    nav.id = 'detail-toc';
    nav.className = 'mb-4';
    const heading = document.createElement('h3');
    heading.className = 'font-semibold mb-1';
    heading.textContent = 'Table of Contents';
    nav.appendChild(heading);
    const list = document.createElement('ul');
    list.className = 'list-disc ml-6 space-y-1';
    tocData.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${item.id}`;
      a.textContent = item.label;
      a.className = 'text-blue-600 hover:underline';
      li.appendChild(a);
      list.appendChild(li);
    });
    nav.appendChild(list);
    const insertPoint = contentArea.children[1] || null;
    contentArea.insertBefore(nav, insertPoint);
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setupSlugAnchors());
  } else {
    setupSlugAnchors();
  }
}


if (typeof window !== 'undefined') {
  window.setupSlugAnchors = setupSlugAnchors;
}
