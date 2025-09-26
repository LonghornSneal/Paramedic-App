import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const baseUrl = 'http://127.0.0.1:4173/';
const evidencePath = join(dirname(fileURLToPath(import.meta.url)), 'test-results', 'manual');

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function capture() {
  await ensureDir(evidencePath);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  // Abbott Approved Abbreviations -> Assessment & Clinical Documentation
  await page.getByRole('button', { name: 'Abbreviations & References' }).click();
  await page.getByRole('button', { name: 'Abbott Approved Abbreviations' }).click();
  await page.getByRole('link', { name: 'Assessment & Clinical Documentation' }).click();
  await page.waitForSelector('text="Source: \"Abbreviations for PCR - Approved list\""');
  await page.screenshot({ path: join(evidencePath, 'abbott-assessment.png'), fullPage: true });

  // Back to home
  await page.click('#nav-home-button');
  await page.waitForSelector('text="Abbreviations & References"');

  // Medication Administration Cross Check (MACC)
  await page.getByRole('button', { name: 'Administrative & Legal Essentials' }).click();
  await page.getByRole('link', { name: 'Medication Administration Cross Check (MACC)' }).click();
  await page.waitForSelector('text="BLS MACC"');
  await page.screenshot({ path: join(evidencePath, 'macc.png'), fullPage: true });

  // Applicability of the COG
  await page.click('#nav-home-button');
  await page.waitForSelector('text="Administrative & Legal Essentials"');
  await page.getByRole('button', { name: 'Administrative & Legal Essentials' }).click();
  await page.getByRole('link', { name: 'Applicability of the COG' }).click();
  await page.waitForSelector('text="Pt = Any Person"');
  await page.screenshot({ path: join(evidencePath, 'applicability.png'), fullPage: true });

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
