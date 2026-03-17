import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';

async function waitForHttp(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function probe() {
      const req = http.get(url, res => {
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('Server not reachable'));
        else setTimeout(probe, 500);
      });
    })();
  });
}

let serverProc;
const SNAPSHOT_VIEWPORTS = [
  { name: '360x640', width: 360, height: 640 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
  { name: '480x960', width: 480, height: 960 }
];

test.beforeAll(async () => {
  try {
    await waitForHttp('http://localhost:5173');
  } catch {
    const isWin = process.platform === 'win32';
    const serverBin = path.resolve(process.cwd(), isWin ? 'node_modules/.bin/http-server.cmd' : 'node_modules/.bin/http-server');
    const command = isWin ? 'cmd.exe' : serverBin;
    const args = isWin ? ['/c', serverBin, '-p', '5173', '-c-1'] : ['-p', '5173', '-c-1'];
    serverProc = spawn(command, args, { stdio: 'ignore', shell: false });
    await waitForHttp('http://localhost:5173');
  }
});

test.afterAll(async () => {
  if (serverProc && !serverProc.killed) serverProc.kill();
});

async function openSidebar(page, viewport = { width: 1280, height: 720 }) {
  await page.setViewportSize(viewport);
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('#open-sidebar-button');
  await page.locator('#open-sidebar-button').click();
  await expect(page.locator('#patient-sidebar')).toHaveClass(/open/);
}

async function fillAndTrigger(page, selector, value) {
  const locator = page.locator(selector);
  await locator.fill(value);
  await locator.dispatchEvent('input');
  await locator.dispatchEvent('change');
}

async function fillDenseSidebar(page) {
  await page.locator('.sex-option[data-value="male"]').click();
  await fillAndTrigger(page, '#pt-age', '42');
  await page.locator('.weight-unit-toggle[data-unit="lb"]').click();
  await fillAndTrigger(page, '#pt-weight-value', '190');
  await fillAndTrigger(page, '#pt-height-ft', '5');
  await fillAndTrigger(page, '#pt-height-in', '11');

  await fillAndTrigger(page, '#pt-pmh', 'hypertension, diabetes, asthma, copd, heart failure, cad, stroke, seizure disorder, hypothyroidism, anxiety, ');
  await fillAndTrigger(page, '#pt-allergies', 'penicillin, sulfa, aspirin, nsaids, morphine, codeine, iodine, shellfish, latex, peanuts, ');
  await fillAndTrigger(page, '#pt-medications', 'lisinopril, metformin, atorvastatin, amlodipine, hydrochlorothiazide, simvastatin, albuterol, levothyroxine, gabapentin, omeprazole, ');
  await fillAndTrigger(page, '#pt-indications', 'chest pain, shortness of breath, syncope, seizure, mi, acs, bronchospasm, hypoglycemia, asthma, ');
  await fillAndTrigger(page, '#pt-symptoms', 'chest pain, shortness of breath, dyspnea, nausea, vomiting, abdominal pain, headache, dizziness, weakness, fever, ');

  await fillAndTrigger(page, '#vs-bp-systolic', '118');
  await fillAndTrigger(page, '#vs-bp-diastolic', '76');
  await fillAndTrigger(page, '#vs-hr-value', '84');
  await page.locator('#vs-spo2-select').selectOption('Low');
  await fillAndTrigger(page, '#vs-etco2', '34');
  await fillAndTrigger(page, '#vs-rr', '18');
  await fillAndTrigger(page, '#vs-bgl-value', '104');
  await fillAndTrigger(page, '#vs-pupils-value', '3');
  await page.locator('#vs-pupils-select').selectOption('PERRL');
  await page.locator('#vs-lung-sounds').selectOption('Clear Bilaterally');
  await fillAndTrigger(page, '#vs-gcs-value', '15');
  await page.locator('#vs-ao-status').selectOption('4');
  await page.locator('#pt-ekg-select').selectOption('Sinus Tachycardia');
  await page.locator('#pt-ekg-secondary').selectOption('Inferior MI');

  return await page.evaluate(() => {
    const sidebar = document.getElementById('patient-sidebar');
    const rowIssues = [];
    document.querySelectorAll('#patient-sidebar .patient-line').forEach((row, rowIndex) => {
      const rowRect = row.getBoundingClientRect();
      const children = Array.from(row.children).filter(child => {
        const style = window.getComputedStyle(child);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      children.forEach((child, childIndex) => {
        const rect = child.getBoundingClientRect();
        if (rect.left < rowRect.left - 1 || rect.right > rowRect.right + 1) {
          rowIssues.push({ rowIndex, childIndex, type: 'bounds' });
        }
      });
      for (let i = 0; i < children.length - 1; i += 1) {
        const currentRect = children[i].getBoundingClientRect();
        const nextRect = children[i + 1].getBoundingClientRect();
        if (currentRect.right > nextRect.left + 1 && currentRect.bottom > nextRect.top + 1 && nextRect.bottom > currentRect.top + 1) {
          rowIssues.push({ rowIndex, childIndex: i, type: 'overlap' });
        }
      }
    });

    return {
      sidebarHeight: sidebar.clientHeight,
      sidebarScrollHeight: sidebar.scrollHeight,
      chipCounts: {
        pmh: document.querySelectorAll('#pt-pmh-chips .sidebar-chip').length,
        allergies: document.querySelectorAll('#pt-allergies-chips .sidebar-chip').length,
        medications: document.querySelectorAll('#pt-medications-chips .sidebar-chip').length,
        indications: document.querySelectorAll('#pt-indications-chips .sidebar-chip').length,
        symptoms: document.querySelectorAll('#pt-symptoms-chips .sidebar-chip').length
      },
      rowIssues,
      patientData: window.patientData,
      rhythmInfoDisabled: document.getElementById('ekg-rhythm-info')?.disabled ?? true,
      modifierInfoDisabled: document.getElementById('ekg-modifier-info')?.disabled ?? true
    };
  });
}

async function getSnapshotState(page) {
  return await page.evaluate(() => ({
    snapshot: document.getElementById('patient-snapshot-bar')?.innerText ?? '',
    allergyChips: Array.from(document.querySelectorAll('#pt-allergies-chips .sidebar-chip'))
      .map(chip => chip.textContent.trim())
      .filter(Boolean)
  }));
}

async function waitForSnapshotState(page, predicate, label) {
  const timeoutAt = Date.now() + 5000;
  let lastState = null;

  while (Date.now() < timeoutAt) {
    lastState = await getSnapshotState(page);
    if (predicate(lastState)) return lastState;
    await page.waitForTimeout(100);
  }

  throw new Error(`${label} failed: ${JSON.stringify(lastState)}`);
}

test('patient sidebar fits the viewport under dense multi-value input', async ({ page }) => {
  await openSidebar(page);
  const result = await fillDenseSidebar(page);

  expect(result.sidebarScrollHeight).toBeLessThanOrEqual(result.sidebarHeight + 1);
  expect(result.chipCounts.pmh).toBeGreaterThanOrEqual(10);
  expect(result.chipCounts.allergies).toBeGreaterThanOrEqual(10);
  expect(result.chipCounts.medications).toBeGreaterThanOrEqual(10);
  expect(result.chipCounts.indications).toBeGreaterThanOrEqual(9);
  expect(result.chipCounts.symptoms).toBeGreaterThanOrEqual(10);
  expect(result.rowIssues).toEqual([]);
  expect(result.patientData.weightUnit).toBe('lb');
  expect(result.patientData.vitalSigns.map).toBe(90);
  expect(result.patientData.vitalSigns.spo2).toBe('Low');
  expect(result.patientData.vitalSigns.lungSounds).toBe('Clear Bilaterally');
  expect(result.rhythmInfoDisabled).toBe(false);
  expect(result.modifierInfoDisabled).toBe(false);
});

test('patient sidebar fits the viewport under dense multi-value input on mobile', async ({ page }) => {
  await openSidebar(page, { width: 390, height: 844 });
  const result = await fillDenseSidebar(page);

  expect(result.sidebarScrollHeight).toBeLessThanOrEqual(result.sidebarHeight + 1);
  expect(result.rowIssues).toEqual([]);
  expect(result.chipCounts.pmh).toBeGreaterThanOrEqual(10);
  expect(result.chipCounts.allergies).toBeGreaterThanOrEqual(10);
  expect(result.chipCounts.medications).toBeGreaterThanOrEqual(10);
  expect(result.chipCounts.indications).toBeGreaterThanOrEqual(9);
  expect(result.chipCounts.symptoms).toBeGreaterThanOrEqual(10);
});

test('sidebar linked numeric and preset fields stay in sync', async ({ page }) => {
  await openSidebar(page);

  await page.locator('#vs-spo2-select').selectOption('Low');
  await page.locator('#vs-hr-select').selectOption('60-100');
  await fillAndTrigger(page, '#vs-spo2-value', '96');
  await fillAndTrigger(page, '#vs-hr-value', '84');
  await fillAndTrigger(page, '#vs-bp-systolic', '118');
  await fillAndTrigger(page, '#vs-bp-diastolic', '76');
  await page.locator('#pt-ekg-select').selectOption('Sinus Tachycardia');
  await page.locator('#pt-ekg-secondary').selectOption('Inferior MI');

  const result = await page.evaluate(() => ({
    spo2SelectValue: document.getElementById('vs-spo2-select')?.value ?? null,
    hrSelectValue: document.getElementById('vs-hr-select')?.value ?? null,
    systolicMap: document.getElementById('vs-bp-systolic')?.dataset.mapValue ?? null,
    diastolicMap: document.getElementById('vs-bp-diastolic')?.dataset.mapValue ?? null,
    patientData: window.patientData,
    rhythmPreviewEmpty: document.getElementById('ekg-rhythm-preview')?.classList.contains('is-empty') ?? true,
    modifierPreviewEmpty: document.getElementById('ekg-modifier-preview')?.classList.contains('is-empty') ?? true
  }));

  expect(result.spo2SelectValue).toBe('');
  expect(result.hrSelectValue).toBe('');
  expect(result.systolicMap).toBe('90');
  expect(result.diastolicMap).toBe('90');
  expect(result.patientData.vitalSigns.spo2).toBe(96);
  expect(result.patientData.vitalSigns.hr).toBe(84);
  expect(result.patientData.vitalSigns.map).toBe(90);
  expect(result.patientData.ekg).toBe('Sinus Tachycardia');
  expect(result.patientData.ekgSecondary).toBe('Inferior MI');
  expect(result.rhythmPreviewEmpty).toBe(false);
  expect(result.modifierPreviewEmpty).toBe(false);
});

for (const viewport of SNAPSHOT_VIEWPORTS) {
  test(`typed allergy entries stay live and context-aware in the snapshot on ${viewport.name}`, async ({ page }) => {
    await openSidebar(page, viewport);
    await fillAndTrigger(page, '#pt-allergies', 'penicillin');

    const allergyFirstState = await waitForSnapshotState(
      page,
      state => state.snapshot.includes('Allergies: Penicillin')
        && !state.snapshot.includes('NKA')
        && state.allergyChips.includes('Penicillin'),
      `${viewport.name} allergy-first`
    );

    expect(allergyFirstState.snapshot).toContain('Allergies: Penicillin');
    expect(allergyFirstState.snapshot).not.toContain('NKA');
    expect(allergyFirstState.allergyChips).toEqual(['Penicillin']);

    await page.evaluate(() => {
      const allergies = document.getElementById('pt-allergies');
      if (allergies) allergies.value = '';
      window.renderPatientSnapshot();
    });

    const clearedRenderState = await waitForSnapshotState(
      page,
      state => !state.snapshot.includes('Allergies:')
        && !state.snapshot.includes('NKA'),
      `${viewport.name} allergy-cleared-render`
    );

    expect(clearedRenderState.snapshot).not.toContain('Allergies:');
    expect(clearedRenderState.snapshot).not.toContain('NKA');

    await fillAndTrigger(page, '#pt-allergies', '');
    const clearedSyncState = await waitForSnapshotState(
      page,
      state => state.allergyChips.length === 0,
      `${viewport.name} allergy-cleared-sync`
    );

    expect(clearedSyncState.allergyChips).toEqual([]);

    const clearedPatientState = await page.evaluate(() => ({
      allergies: Array.isArray(window.patientData?.allergies) ? window.patientData.allergies : null,
      allergyDisplay: Array.isArray(window.patientData?.allergyDisplay) ? window.patientData.allergyDisplay : null
    }));

    expect(clearedPatientState.allergies).toEqual([]);
    expect(clearedPatientState.allergyDisplay).toEqual([]);

    await openSidebar(page, viewport);
    await fillAndTrigger(page, '#pt-age', '45');
    await fillAndTrigger(page, '#pt-weight-value', '70');
    await fillAndTrigger(page, '#pt-indications', 'chest pain');
    await fillAndTrigger(page, '#pt-allergies', 'penicillin, aspirin, latex');

    const chestPainState = await waitForSnapshotState(
      page,
      state => state.snapshot.includes('Allergies: ASA, etc.')
        && state.allergyChips.join(',') === 'Penicillin,ASA,Latex',
      `${viewport.name} chest-pain-context`
    );

    expect(chestPainState.snapshot).toContain('Allergies: ASA, etc.');
    expect(chestPainState.snapshot).not.toContain('Allergies: NKA');
    expect(chestPainState.allergyChips).toEqual(['Penicillin', 'ASA', 'Latex']);

    await openSidebar(page, viewport);
    await fillAndTrigger(page, '#pt-indications', 'anaphylaxis');
    await fillAndTrigger(page, '#pt-allergies', 'penicillin, aspirin, latex');

    const allergyIndicationFirstState = await waitForSnapshotState(
      page,
      state => state.snapshot.includes('Allergies: Penicillin, ASA (NSAID), Latex'),
      `${viewport.name} anaphylaxis-first`
    );

    expect(allergyIndicationFirstState.snapshot).toContain('Anaphylaxis');
    expect(allergyIndicationFirstState.snapshot).toContain('Allergies: Penicillin, ASA (NSAID), Latex');

    await openSidebar(page, viewport);
    await fillAndTrigger(page, '#pt-allergies', 'penicillin, aspirin, latex');
    await fillAndTrigger(page, '#pt-age', '45');
    await fillAndTrigger(page, '#pt-weight-value', '70');
    await fillAndTrigger(page, '#pt-indications', 'anaphylaxis');

    const allergyIndicationAfterState = await waitForSnapshotState(
      page,
      state => state.snapshot.includes('Allergies: Penicillin, ASA (NSAID), Latex'),
      `${viewport.name} anaphylaxis-after`
    );

    expect(allergyIndicationAfterState.snapshot).toContain('Anaphylaxis');
    expect(allergyIndicationAfterState.snapshot).toContain('Allergies: Penicillin, ASA (NSAID), Latex');
    expect(allergyIndicationAfterState.allergyChips).toEqual(['Penicillin', 'ASA', 'Latex']);
  });
}

test('ekg controls update snapshot, avoid blank vitals, and expose help modal', async ({ page }) => {
  await openSidebar(page);

  await page.locator('#pt-ekg-select').selectOption('Sinus Tachycardia');
  await page.locator('#pt-ekg-secondary').selectOption('Inferior MI');
  await page.waitForTimeout(250);

  const snapshotState = await page.evaluate(() => ({
    text: document.getElementById('patient-snapshot-bar')?.innerText ?? '',
    html: document.getElementById('patient-snapshot-bar')?.innerHTML ?? '',
    rhythmInfoDisabled: document.getElementById('ekg-rhythm-info')?.disabled ?? true,
    modifierInfoDisabled: document.getElementById('ekg-modifier-info')?.disabled ?? true
  }));

  expect(snapshotState.text).toContain('Sinus Tachy');
  expect(snapshotState.text).toContain('Inferior MI');
  expect(snapshotState.text).not.toContain('HR');
  expect(snapshotState.text).not.toContain('RR');
  expect(snapshotState.html).toContain('text-yellow-600');
  expect(snapshotState.rhythmInfoDisabled).toBe(false);
  expect(snapshotState.modifierInfoDisabled).toBe(false);

  await page.locator('#ekg-help-button').click();
  await expect(page.locator('#ekg-help-modal')).not.toHaveClass(/hidden/);
  await expect(page.locator('#ekg-help-backdrop')).not.toHaveClass(/hidden/);
  await page.locator('#ekg-help-close').click();
  await expect(page.locator('#ekg-help-modal')).toHaveClass(/hidden/);
});

test('recognized medication classes add snapshot warnings under the search bar', async ({ page }) => {
  await openSidebar(page);

  await fillAndTrigger(page, '#pt-medications', 'Metoprolol Tartrate (Lopressor) (5mg/5ml)');
  await fillAndTrigger(page, '#pt-indications', 'bronchospasm');

  const snapshotState = await page.evaluate(() => ({
    text: document.getElementById('patient-snapshot-bar')?.innerText ?? '',
    html: document.getElementById('patient-snapshot-bar')?.innerHTML ?? '',
    medicationClasses: window.patientData?.medicationClasses ?? []
  }));

  expect(snapshotState.medicationClasses).toContain('Beta antagonist (β1 selective)');
  expect(snapshotState.text).toContain('Warning: Documented beta-blocker may reduce effectiveness of beta-agonist bronchodilators.');
  expect(snapshotState.text).not.toContain('HR');
  expect(snapshotState.text).not.toContain('RR');
  expect(snapshotState.html).toContain('snapshot-warning-item');
});

test('detail contraindication warnings refresh regardless of whether detail or sidebar changes happen first', async ({ page }) => {
  await openSidebar(page);

  await page.evaluate(() => window.renderDetailPage('ketorolac-tromethamine-toradol', false, false));
  await fillAndTrigger(page, '#pt-pmh', 'asthma');
  await page.waitForTimeout(250);
  await expect(page.locator('.warning-box')).toContainText('Contraindication: Asthma.');

  await openSidebar(page);
  await fillAndTrigger(page, '#pt-pmh', 'asthma');
  await page.evaluate(() => window.renderDetailPage('ketorolac-tromethamine-toradol', false, false));
  await page.waitForTimeout(250);
  await expect(page.locator('.warning-box')).toContainText('Contraindication: Asthma.');
});
