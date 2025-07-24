import { patientData } from './PatientInfo.js';

/**
 * Format an array as a comma‑separated string with title‑casing, or return "None".
 */
function formatList(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return 'None';
    return arr.map(item => item.replace(/\b\w/g, c => c.toUpperCase())).join(', ');
}

/**
 * Renders the patient snapshot.  Creates the container if it doesn’t exist,
 * then writes HTML summarising age, weight, allergies, current meds,
 * selected med class and basic vitals (BP and HR).
 */
export function renderPatientSnapshot() {
    const sidebar = document.getElementById('patient-sidebar');
    if (!sidebar) return;
    let snapshotEl = document.getElementById('pt-snapshot');
    if (!snapshotEl) {
        snapshotEl = document.createElement('div');
        snapshotEl.id = 'pt-snapshot';
        sidebar.insertAdjacentElement('afterbegin', snapshotEl);
    }
    const age     = patientData.age ?? '—';
    const weight  = patientData.weight != null ? `${patientData.weight} kg` : '—';
    const allergies = formatList(patientData.allergies);
    const meds    = formatList(patientData.currentMedications);
    const medClass= formatList(patientData.medicationClasses || []);
    const vitals  = patientData.vitalSigns || {};
    const bp      = vitals.bp || '—';
    const hr      = vitals.hr != null ? vitals.hr : '—';

    snapshotEl.innerHTML = `
      <div class="snapshot-card">
        <h3 class="font-semibold text-base mb-2">Patient Snapshot</h3>
        <p><span class="font-medium">Age:</span> ${age}</p>
        <p><span class="font-medium">Weight:</span> ${weight}</p>
        <p><span class="font-medium">Allergies:</span> ${allergies}</p>
        <p><span class="font-medium">Medications:</span> ${meds}</p>
        <p><span class="font-medium">Med Class:</span> ${medClass}</p>
        <p><span class="font-medium">BP:</span> ${bp} | <span class="font-medium">HR:</span> ${hr}</p>
      </div>`;
}

// Optionally expose globally
if (typeof window !== 'undefined') {
    window.renderPatientSnapshot = renderPatientSnapshot;
}
