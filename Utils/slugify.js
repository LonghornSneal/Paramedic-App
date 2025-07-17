// Utils/slugify.js – Utility to convert text to URL-friendly slug
export function slugify(text) {
    if (!text) return '';
    const subscriptMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[+/:(),&%#\u2080-\u2089]/g, match => subscriptMap[match] || '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
// Attach to window for backward compatibility (can remove later if not needed)
if (typeof window !== 'undefined') {
    window.slugify = slugify;
}
