const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function waitForAbbrevTable(page) {
  await page.waitForSelector('.abbrev-table', { state: 'visible' });
}

async function takeShot(page, dir, name) {
  await page.screenshot({ path: path.join(dir, name), fullPage: true });
}

(async () => {
  const baseUrl = process.env.ABBREV_TEST_URL || 'http://localhost:3001/';
  const screenshotDir = path.join(__dirname, 'screenshots');
  await ensureDir(screenshotDir);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  try {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.category-card');
    await page.getByRole('button', { name: 'Abbreviations & References', exact: true }).click();
    await page.getByRole('button', { name: 'Abbott Approved Abbreviations', exact: true }).click();
    const assessmentLink = page.locator('text=Assessment & Clinical Documentation').first();
    await assessmentLink.click();
    await waitForAbbrevTable(page);

    const modeSelect = page.getByLabel('Display options:');

    await takeShot(page, screenshotDir, 'abbrev-term-abbrev.png');

    await modeSelect.selectOption('abbrev');
    await takeShot(page, screenshotDir, 'abbrev-abbrev-term.png');

    await modeSelect.selectOption('remove');
    const removeButton = page.getByRole('button', { name: 'Remove' }).first();
    if (await removeButton.count()) {
      await removeButton.click();
    }
    await takeShot(page, screenshotDir, 'abbrev-remove.png');

    await modeSelect.selectOption('add');
    const removedCheckbox = page.locator('.abbrev-removed-item input').first();
    if (await removedCheckbox.count()) {
      await removedCheckbox.check();
      await page.getByRole('button', { name: 'Add selected' }).click();
    }
    await page.getByLabel('term', { exact: true }).fill('Custom Term');
    await page.getByLabel('abbrev.', { exact: true }).fill('CT');
    await page.getByRole('button', { name: 'Add term' }).click();
    await takeShot(page, screenshotDir, 'abbrev-add.png');

    await modeSelect.selectOption('reorder');
    const moveDown = page.getByRole('button', { name: 'Move down' }).first();
    if (await moveDown.count()) {
      await moveDown.click();
    }
    await takeShot(page, screenshotDir, 'abbrev-reorder.png');

    await page.getByRole('button', { name: 'RESET' }).click();
    await waitForAbbrevTable(page);
    await takeShot(page, screenshotDir, 'abbrev-reset.png');

    await page.getByRole('button', { name: 'Home' }).click();
    await page.waitForSelector('.category-card');
    await page.getByRole('button', { name: 'Abbreviations & References', exact: true }).click();
    const otherLink = page.locator('text=Other Abbreviations').first();
    await otherLink.click();
    await waitForAbbrevTable(page);
    await takeShot(page, screenshotDir, 'other-abbreviations.png');

    await page.getByRole('button', { name: 'Home' }).click();
    await page.waitForSelector('.category-card');
    await page.getByRole('button', { name: 'Administrative & Legal Essentials', exact: true }).click();
    await page.locator('text=Medication Administration Cross Check (MACC)').first().click();
    await page.waitForSelector('details', { state: 'visible' });
    await takeShot(page, screenshotDir, 'macc-detail.png');

    await page.getByRole('button', { name: 'Home' }).click();
    await page.waitForSelector('.category-card');
    await page.getByRole('button', { name: 'Administrative & Legal Essentials', exact: true }).click();
    await page.locator('text=Applicability of the COG').first().click();
    await page.waitForSelector('.detail-text', { state: 'visible' });
    await takeShot(page, screenshotDir, 'applicability-cog.png');
  } finally {
    await browser.close();
  }
})();
