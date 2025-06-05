const slugify = require('../slugify');

describe('slugify', () => {
  test('converts spaces to dashes and lowercases', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('multiple   spaces here')).toBe('multiple-spaces-here');
  });

  test('handles special punctuation and subscript numbers', () => {
    expect(slugify('NaHCO₃')).toBe('nahco3');
    expect(slugify('1+1=2')).toBe('1-12');
    expect(slugify('Sample text (test)')).toBe('sample-text-test');
  });
});
