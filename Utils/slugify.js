/**
 * Utility function to convert a given text string into a URL-friendly "slug" format.
 * It lowercases the text, replaces spaces with hyphens, substitutes or removes special characters (including converting any subscript digits to normal digits), 
 * and strips out any characters that are not alphanumeric or hyphens.
 * This is used to generate consistent slug IDs for topics/categories based on their titles, ensuring links and IDs are standardized.
 */

// Converts a given string into a URL-friendly slug (lowercased, hyphenated, no special characters).

const subscriptMap = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
};

// Utils/slugify.js – Utility to convert text to URL-friendly slug
export function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[+/:(),&%#\u2080-\u2089]/g, (match) => {
      if (subscriptMap[match]) return subscriptMap[match];
      return '-';
    })
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Attach to window for backward compatibility (can remove later if not needed)
// if (typeof window !== 'undefined') {
//    window.slugify = slugify;
// }


// Allow CLI usage: `node slugify.js "Some Text"`
if (typeof require !== 'undefined' && require.main === module) {
  const input = process.argv.slice(2).join(' ');
  console.log(slugify(input));
}
