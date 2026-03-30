const { test, expect } = require('@playwright/test');

async function dismissTransientUi(page) {
  for (const name of [
    'Close EKG help',
    'Close Settings',
    'Close History',
    'Close Patient Info Sidebar'
  ]) {
    const button = page.getByRole('button', { name });
    if (await button.isVisible().catch(() => false)) {
      await button.click();
      await page.waitForTimeout(250);
    }
  }
}

async function gotoReadyHome(page) {
  await page.goto('http://127.0.0.1:5173/');
  await dismissTransientUi(page);
  await expect(page.getByRole('heading', { name: /Paramedic Quick Reference/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Adult Protocols' })).toBeVisible();
}

test('paramedic navigation smoke', async ({ page }) => {
  await gotoReadyHome(page);
  await page.getByRole('button', { name: /Adult Protocols/i }).click();
  await page.getByRole('button', { name: 'Airway/Breathing' }).click();
  await page.getByRole('button', { name: /Cricothyrotomy/i }).click();
  await expect(page.getByRole('heading', { name: /Cricothyrotomy/i })).toBeVisible();
});
