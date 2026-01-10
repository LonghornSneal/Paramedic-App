const { test, expect } = require('@playwright/test');

test('paramedic navigation smoke', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');
  await expect(page.getByRole('heading', { name: /Paramedic Quick Reference/i })).toBeVisible();
  await page.getByRole('button', { name: /Adult Protocols/i }).click();
  await page.getByRole('button', { name: /Airway & Breathing/i }).click();
  await page.getByRole('button', { name: /Cricothyrotomy/i }).click();
  await expect(page.getByRole('heading', { name: /Cricothyrotomy/i })).toBeVisible();
});
