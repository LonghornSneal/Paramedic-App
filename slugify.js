function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[+/:(),&%#₃₄]/g, match => {
      if (match === '₃') return '3';
      if (match === '₄') return '4';
      return '-';
    })
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

module.exports = slugify;
