const slugify = require('../slugify');

test('converts spaces to hyphens', () => {
  expect(slugify('Hello World')).toBe('hello-world');
});

test('removes special characters', () => {
  expect(slugify('Hello+World!')).toBe('hello-world');
});

test('converts subscript digits', () => {
  expect(slugify('CO₂₃₄ test')).toBe('co-234-test');
});
