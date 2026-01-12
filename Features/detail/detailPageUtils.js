import { addTapListener } from '../../Utils/addTapListener.js';

export function parseTextMarkup(text) {
    let safeText = text
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    safeText = safeText.replace(/\\n/g, ' ');
    // Replace [[display|info]] with a toggle-able info span including a Show/Hide indicator and hidden info text
    safeText = safeText.replace(/\\\[\[(.+?)\|(.+?)\]\]/g,
        (_, display, info) => {
            return `<span class="toggle-info" role="button" tabindex="0" aria-expanded="false"><span class="toggle-info-label">${display}</span><span class="toggle-info-indicator" aria-hidden="true">Show</span><span class="info-text hidden">${info}</span></span>`;
        });
            // Replace custom markup for colored/underlined text
    safeText = safeText.replace(/\\\{\{red:(.+?)\}\} /g, (_, t) => `<span class="text-red-600 font-semibold">${t}</span>`);
    safeText = safeText.replace(/\\\{\{redul:(.+?)\}\} /g, (_, t) => `<span class="text-red-600 font-semibold underline decoration-red-600">${t}</span>`);
    safeText = safeText.replace(/\\\{\{orange:(.+?)\}\} /g, (_, t) => `<span class="text-orange-600">${t}</span>`);
    safeText = safeText.replace(/\\\{\{blackul:(.+?)\}\} /g, (_, t) => `<span class="font-bold underline decoration-black">${t}</span>`);
    return safeText;
}

export function createDetailList(itemsArray) {
    if (!itemsArray || itemsArray.length === 0) {
        return '<p class="text-gray-500 italic">None listed.</p>'; 
    }
    const listItemsHtml = itemsArray.map(it => `<li>${parseTextMarkup(it)}</li>`).join('');
    return `<ul class="detail-list">${listItemsHtml}</ul>`; 
}

export function createDetailText(textBlock) {
    if (!textBlock || textBlock.toString().trim() === '') {
        return '<p class="text-gray-500 italic">Not specified.</p>'; 
    }
    const safeText = parseTextMarkup(textBlock.toString());
    return `<div class="detail-text">${safeText}</div>`; 
}

export function attachToggleInfoHandlers(container) {
    container.querySelectorAll('.toggle-info').forEach(el => {
        el.onclick = e => {  
            e.stopPropagation();
            const info = el.querySelector('.info-text');
            if (!info) return;
            const indicator = el.querySelector('.toggle-info-indicator');
            const isHidden = info.classList.toggle('hidden');
            const expanded = !isHidden;
            if (indicator) indicator.textContent = expanded ? 'Hide' : 'Show';
            el.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            el.classList.toggle('is-expanded', expanded);
        };  
    });  
}

export function attachSsToggleHandlers(container) {
    container.querySelectorAll('.ss-toggle').forEach(toggle => {
        addTapListener(toggle, e => {
            e.stopPropagation();
            const targetId = toggle.dataset.ssTarget;
            if (!targetId) return;
            const list = container.querySelector(`#${targetId}`);
            if (!list) return;
            const isHidden = list.classList.toggle('hidden');
            const expanded = !isHidden;
            const indicator = toggle.querySelector('.toggle-info-indicator');
            if (indicator) indicator.textContent = expanded ? 'Hide' : 'Show';
            toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            toggle.classList.toggle('is-expanded', expanded);
        });
    });
}

export function attachToggleCategoryHandlers(container) {
    container.querySelectorAll('.toggle-category').forEach(header => {
        addTapListener(header, () => {
            const content = header.nextElementSibling;
            if (!content) return;
            const indicator = header.querySelector('.section-indicator');
            const isHidden = content.classList.toggle('hidden');
            const expanded = !isHidden;
            if (indicator) indicator.textContent = expanded ? 'Hide' : 'Show';
            header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            header.classList.toggle('is-expanded', expanded);
        }); 
    });
}
