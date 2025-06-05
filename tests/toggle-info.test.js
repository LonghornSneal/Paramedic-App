const fs = require('fs');
const { JSDOM } = require('jsdom');

describe('toggle-info styling', () => {
  let document;
  beforeAll(() => {
    const html = fs.readFileSync(require('path').join(__dirname, '..', 'README.md'), 'utf8');
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  test('has toggle-info elements', () => {
    const els = document.querySelectorAll('.toggle-info');
    expect(els.length).toBeGreaterThan(0);
  });

  test('stylesheet contains cursor-pointer rule for toggle-info', () => {
    const styles = Array.from(document.querySelectorAll('style'))
      .map(s => s.textContent)
      .join('\n');
    expect(/\.toggle-info\s*\{[^}]*cursor-pointer/.test(styles)).toBe(true);
  });
});
