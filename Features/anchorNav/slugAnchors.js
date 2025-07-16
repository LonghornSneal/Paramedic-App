// Sets up a Table of Contents for detail sections and injects hidden anchor elements for external use (automation).
function setupSlugAnchors(tocData) {
    if (!tocData || tocData.length === 0) return;  // nothing to do if no sections
    // Remove any existing TOC nav
    const existing = document.getElementById('detail-toc');
    if (existing) existing.remove();
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;
    // Create TOC navigation element
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
    // Insert TOC at top of content (immediately after title/warnings)
    const insertPoint = contentArea.children[1] || null;
    contentArea.insertBefore(nav, insertPoint);
    // Attach smooth scrolling and auto-expand on TOC link clicks
    nav.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const contentEl = targetEl.nextElementSibling;
            const arrowEl = targetEl.querySelector('.arrow');
            if (contentEl?.classList.contains('hidden')) {
                contentEl.classList.remove('hidden');
                arrowEl?.classList.add('rotate');
            }
        });
    });
}
if (typeof window !== 'undefined') {
    window.setupSlugAnchors = setupSlugAnchors;
}
//function setupSlugAnchors(sectionIds) {
//  if (!sectionIds || sectionIds.length === 0) return;  // nothing to do if no sections
//  var tocNav = document.createElement('nav');
//  tocNav.id = 'section-toc';
//  tocNav.className = 'section-toc';
  // Generate anchor links for each section 
//  tocNav.innerHTML = sectionIds.map(function(id) {
//    var titleText = id.replace(/-/g, ' ');  // e.g., "adult-dose" -> "adult dose"
//      return '<a href="#' + id + '">' + titleText + '</a>';
//    }).join(' | ');
//    var contentDiv = document.getElementById('content-area'); 
//    contentDiv.insertBefore(tocNav, contentDiv.firstChild);
  



// /function setupSlugAnchors(tocData) { if (typeof document === 'undefined') return;  // Hidden container of slug IDs for external automation
//  if (typeof slugIDs !== 'undefined' && Array.isArray(slugIDs)) { if (!document.getElementById('slug-id-container')) { const container = document.createElement('div');
//      container.id = 'slug-id-container'; container.classList.add('hidden'); slugIDs.forEach(id => { const div = document.createElement('div');
//        div.id = id; div.dataset.branch = id; container.appendChild(div); }); document.body.appendChild(container); } }




//  /if (Array.isArray(tocData) && tocData.length > 0) {
//    const contentArea = document.getElementById('content-area');
//    if (!contentArea) return;
//    const existing = document.getElementById('detail-toc');
//    if (existing) existing.remove();
//
//    const nav = document.createElement('nav');
//    nav.id = 'detail-toc';
//    nav.className = 'mb-4';
//    const heading = document.createElement('h3');
//    heading.className = 'font-semibold mb-1';
//    heading.textContent = 'Table of Contents';
//    nav.appendChild(heading);
//    const list = document.createElement('ul');
//    list.className = 'list-disc ml-6 space-y-1';
//    tocData.forEach(item => {
//      const li = document.createElement('li');
//      const a = document.createElement('a');
//      a.href = `#${item.id}`;
//      a.textContent = item.label;
//      a.className = 'text-blue-600 hover:underline';
//      li.appendChild(a);
//      list.appendChild(li);
//    });
//    nav.appendChild(list);
//    const insertPoint = contentArea.children[1] || null;
//    contentArea.insertBefore(nav, insertPoint);
//  }
//}
//if (typeof document !== 'undefined') {
//  if (document.readyState === 'loading') {
//    document.addEventListener('DOMContentLoaded', () => setupSlugAnchors());
//  } else {
//    setupSlugAnchors();
//  }
//}
//if (typeof window !== 'undefined') {
//  window.setupSlugAnchors = setupSlugAnchors;
//}
