// Features/anchorNav/slugAnchors.js – Insert in-page Table of Contents anchors
export function setupSlugAnchors(tocData) {
    if (!tocData || tocData.length === 0) return;
    const existing = document.getElementById('detail-toc');
    if (existing) existing.remove();
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;
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
    // Smooth scroll and auto-expand on anchor click:
    nav.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const contentEl = targetEl.nextElementSibling;
            const indicator = targetEl.querySelector('.section-indicator');
            if (contentEl?.classList.contains('hidden')) {
                contentEl.classList.remove('hidden');
                if (indicator) indicator.textContent = 'Hide';
                targetEl.setAttribute('aria-expanded', 'true');
                targetEl.classList.add('is-expanded');
            }
        });
    });
}
