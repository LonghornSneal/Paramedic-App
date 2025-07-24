// Features/Warnings.js – Warning box generation logic
import { PDE5_INHIBITORS } from './patient/PatientInfo.js';

// Helper: build a warning icon with a configurable colour
function createWarningIcon(colorClass = 'text-yellow-600') {
    return `<svg class="${colorClass} w-5 h-5 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" 
                 viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 
                  1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 
                  0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" 
                  clip-rule="evenodd"/>
            </svg>`;
}

// Allergy warnings
function getAllergyWarning(topic, patientData) {
    if (!patientData || !Array.isArray(patientData.allergies)) return '';
    const medKeywords = ((topic.title || '') + ' ' + (topic.id || '')).toLowerCase();
    const match = patientData.allergies.find(a => a && medKeywords.includes(a.toLowerCase()));
    if (!match) return '';
    return `
      <div class="warning-box warning-box-red mb-2">
        <div class="flex items-start">
          ${createWarningIcon('red-600')}
          <span>Allergy Alert: Patient has a known allergy to ${topic.title}.</span>
        </div>
      </div>`;
}

// PDE5 inhibitor warnings
function getPDE5Warning(topic, patientData) {
    if (!topic || topic.id !== 'ntg') return '';
    if (!patientData || !Array.isArray(patientData.currentMedications)) return '';
    const found = patientData.currentMedications.find(med =>
        PDE5_INHIBITORS.some(term => med.toLowerCase().includes(term.toLowerCase())));
    if (!found) return '';
    const medDisplay = found.charAt(0).toUpperCase() + found.slice(1);
    return `
      <div class="warning-box warning-box-red mb-2">
        <div class="flex items-start">
          ${createWarningIcon('red-600')}
          <span>Contraindication: Patient has recently taken ${medDisplay} (PDE5 inhibitor) – do not administer ${topic.title}.</span>
        </div>
      </div>`;
}

// Low blood‑pressure warnings (for nitroglycerin)
function getLowBPWarning(topic, patientData) {
    if (!topic || topic.id !== 'ntg') return '';
    const bpStr = patientData?.vitalSigns?.bp;
    if (!bpStr) return '';
    const systolic = parseInt(bpStr.split('/')[0], 10);
    if (isNaN(systolic)) return '';
    if (systolic < 100) {
        return `
          <div class="warning-box warning-box-red mb-2">
            <div class="flex items-start">
              ${createWarningIcon('red-600')}
              <span>Contraindication: Patient’s blood pressure (${systolic} mmHg) is below the recommended minimum for ${topic.title}.</span>
            </div>
          </div>`;
    }
    return '';
}

// General contraindications from MedicationDetailsData (excluding allergies)
function getGeneralContraindicationsWarning(topic) {
    const med = window.medicationDataMap?.[topic.id];
    if (!med || !Array.isArray(med.contraindications)) return '';
    let warnings = '';
    med.contraindications.forEach(ci => {
        const ciLower = ci.toLowerCase();
        if (ciLower.includes('allergy') || ciLower.includes('hypersensitivity')) return;
        warnings += `
          <div class="warning-box warning-box-red mb-2">
            <div class="flex items-start">
              ${createWarningIcon('red-600')}
              <span>Contraindication: ${ci}.</span>
            </div>
          </div>`;
    });
    return warnings;
}

// (Optional) Age warnings: future support for age ranges, if defined in data
//function getAgeWarning(topic, patientData) {
    if (!patientData || patientData.age == null) return '';
    const med = window.medicationDataMap?.[topic.id];
    if (!med || !med.ageRange) return '';
    const min = med.ageRange.min ?? 0;
    const max = med.ageRange.max ?? Infinity;
    if (patientData.age < min || patientData.age > max) {
        return `
          <div class="warning-box warning-box-yellow mb-2">
            <div class="flex items-start">
              ${createWarningIcon('yellow-600')}
              <span>Caution: ${topic.title} is recommended for ages ${min}–${max} years.</span>
            </div>
          </div>`;
    }
    return '';
//}

// Main function: collate all warnings
export function appendTopicWarnings(topic, patientData) {
    let warnings = '';
    warnings += getAllergyWarning(topic, patientData);
    warnings += getPDE5Warning(topic, patientData);
    warnings += getLowBPWarning(topic, patientData);
    warnings += getGeneralContraindicationsWarning(topic);
    warnings += getAgeWarning(topic, patientData);
    return warnings;
}

/**
 * Builds warning messages from a medication's contraindications array.
 * Skips entries that mention allergies or hypersensitivity (handled elsewhere).
 * This allows new contraindication keywords in MedicationDetailsData to show up automatically.
 *
 * @param {object} topic The topic object (medication).
 * @returns {string} HTML snippet of additional warnings.
 */
