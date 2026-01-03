// Utils/slugify.js - Utility to convert text to URL-friendly slug
export function slugify(text) {
    if (!text) return '';
    const subscriptMap = {
        '\u2080': '0',
        '\u2081': '1',
        '\u2082': '2',
        '\u2083': '3',
        '\u2084': '4',
        '\u2085': '5',
        '\u2086': '6',
        '\u2087': '7',
        '\u2088': '8',
        '\u2089': '9'
    };
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
/*
  Utils/slugify.js
  Purpose: Converts strings to URL/ID-friendly slugs used for anchors and element IDs.

  Tests:
  - No dedicated tests; behavior can be validated by checking generated IDs in rendered sections.
*/
