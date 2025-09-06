const { chromium, firefox, webkit } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true }).catch(async () => {
    try { return await firefox.launch({ headless: true }); } catch { return await webkit.launch({ headless: true }); }
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');
  // Render the detail page directly via exposed function
  await page.waitForFunction(() => typeof window.renderDetailPage === 'function', { timeout: 10000 });
  await page.evaluate(() => window.renderDetailPage('zoll-quick-vent-zoll-setup', false, false));
  await page.waitForSelector('#qv-weight-kg', { timeout: 10000 });
  await page.fill('#qv-weight-kg', '70');
  // Click ARDS Not Sure
  await page.click('#qv-ards button[data-val="unsure"]');
  // Read the purple answer area
  await page.waitForSelector('#qv-tv', { timeout: 5000 });
  const html = await page.$eval('#qv-tv', el => el.innerHTML);
  const text = await page.$eval('#qv-tv', el => el.innerText);
  console.log('TV_HTML:\n' + html);
  console.log('TV_TEXT:\n' + text);
  // Click to open modal and read math details if present
  await page.click('#qv-tv');
  await page.waitForTimeout(300);
  const modal = await page.$('.qv-modal');
  if (modal) {
    const modalText = await modal.innerText();
    console.log('MODAL_TEXT:\n' + modalText);
  } else {
    console.log('MODAL_TEXT:\n<no modal>');
  }
  await browser.close();
})();
