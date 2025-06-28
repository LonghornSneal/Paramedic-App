const slugify = require('../../Utils/slugify');

describe('slugify', () => {
  it('should convert spaces and uppercase to hyphenated lowercase', () => {
    expect(slugify('Test String')).toBe('test-string');
  });
  it('should remove special characters', () => {
    expect(slugify('A+B/C')).toBe('a-b-c');
  });
  it('should handle subscript digits', () => {
    expect(slugify('NaHCO₃')).toBe('nahco3');
  });
  it('should trim hyphens', () => {
    expect(slugify('  Hello World!  ')).toBe('hello-world');
  });
});
