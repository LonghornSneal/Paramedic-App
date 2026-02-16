import { test, expect } from '@playwright/test';
import previewServer from './utils/previewServer.cjs';

const { ensurePreviewServer, shutdownPreviewServer } = previewServer;
const BASE_URL = 'http://127.0.0.1:5173/';

async function setWeight(page, pounds) {
  await page.click('#open-sidebar-button');
  await page.waitForFunction(() => document.getElementById('patient-sidebar')?.classList.contains('open'));
  const weightInput = page.locator('#pt-weight-value');
  await expect(weightInput).toBeVisible();
  await weightInput.fill(String(pounds));
  await weightInput.dispatchEvent('input');
  await page.click('#close-sidebar-button');
  await page.waitForFunction(() => document.getElementById('patient-sidebar')?.classList.contains('hidden'));
}

async function openMedicationDetail(page, topicId) {
  await page.waitForFunction(() => typeof window.renderDetailPage === 'function');
  await page.evaluate((id) => window.renderDetailPage(id, false, false), topicId);
}

function sectionByTitle(page, title) {
  return page.locator('.detail-section').filter({
    has: page.locator('.detail-section-title', { hasText: title })
  }).first();
}

test.beforeAll(async () => {
  await ensurePreviewServer();
});

test.afterAll(async () => {
  await shutdownPreviewServer();
});

test('Adult Rx line auto-calculates from weight with visible formula', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForFunction(() => typeof window.patientData !== 'undefined');

  await openMedicationDetail(page, '2-lidocaine-xylocaine');
  const adultSection = sectionByTitle(page, 'Adult Rx');
  await adultSection.locator('.detail-section-title').click();

  const calc = adultSection.locator('.med-dose-calc').first();
  await expect(calc).toBeVisible();
  await expect(calc).toContainText('Enter weight to calculate');

  await setWeight(page, 70);
  await expect(calc).toContainText('Formula: Dose: 1-1.5 mg/kg × 70kg = 70-105 mg');
  await expect(calc).toContainText('3.5-5.25 mL');
});

test('Pediatric Rx line auto-calculates and updates from patient weight', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForFunction(() => typeof window.patientData !== 'undefined');

  await setWeight(page, 20);
  await openMedicationDetail(page, 'midazolam-versed');
  const pediatricSection = sectionByTitle(page, 'Pediatric Rx');
  await pediatricSection.locator('.detail-section-title').click();

  const calc = pediatricSection.locator('.med-dose-calc').first();
  await expect(calc).toContainText('Formula: Dose: 0.1 mg/kg × 20kg = 2 mg');
  await expect(calc).toContainText('Volume: 2 mg ÷ 10mg/2mL');
  await expect(calc).toContainText('0.4 mL');
});
