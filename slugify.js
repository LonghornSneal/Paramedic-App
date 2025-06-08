function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[+/:(),&%#₃₄]/g, (match) => {
      if (match === '₃') return '3';
      if (match === '₄') return '4';
      return '-';
    })
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = slugify;
}
if (typeof window !== 'undefined') {
  window.slugify = slugify;
}

// Allow CLI usage: `node slugify.js "Some Text"`
if (typeof require !== 'undefined' && require.main === module) {
  const input = process.argv.slice(2).join(' ');
  console.log(slugify(input));
}
