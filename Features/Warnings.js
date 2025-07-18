// Features/Warnings.js – Warning box generation logic
import { PDE5_INHIBITORS } from './patient/PatientInfo.js';

function createWarningIcon(colorClass = 'text-yellow-600') {
    return `<svg class="${colorClass} w-5 h-5 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" 
                 viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 
                  1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 
                  0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" 
                  clip-rule="evenodd"/>
            </svg>`;
}

function getAllergyWarning(topic, patientData) {
    if (!patientData.allergies.length) return "";
    const medKeywords = (topic.title + " " + topic.id).toLowerCase();
    const allergyMatch = patientData.allergies.find(a => a && medKeywords.includes(a.toLowerCase()));
    if (!allergyMatch) return "";
    return `<div class="warning-box warning-box-red">
                <div>${createWarningIcon('text-red-600')}
                     <span>Allergy Alert: Patient has a known allergy to ${topic.title}.</span>
                </div>
            </div>`;
}

function getPDE5Warning(topic, patientData) {
    if (topic.id !== 'ntg') return "";
    const foundMed = patientData.currentMedications.find(med =>
        PDE5_INHIBITORS.some(term => med.toLowerCase().includes(term.toLowerCase()))
    );
    if (!foundMed) return "";
    const medDisplay = foundMed.charAt(0).toUpperCase() + foundMed.slice(1);
    return `<div class="warning-box warning-box-red">
                <div>${createWarningIcon('text-red-600')}
                     <span>Contraindication: Patient has recently taken ${medDisplay} (PDE5 inhibitor) – 
                           DO NOT administer ${topic.title}.</span>
                </div>
            </div>`;
}

function getLowBPWarning(topic, patientData) {
    if (topic.id !== 'ntg' || !patientData.vitalSigns.bp) return "";
    const bpStr = patientData.vitalSigns.bp;
    const systolicBP = parseInt(bpStr.split('/')[0], 10);
    if (isNaN(systolicBP)) return "";
    if (systolicBP < 100) {
        return `<div class="warning-box warning-box-red">
                    <div>${createWarningIcon('text-red-600')}
                         <span>Contraindication: Patient’s blood pressure is below the recommended minimum for ${topic.title}.</span>
                    </div>
                </div>`;
    }
    return "";
}

export function appendTopicWarnings(topic, patientData) {
    let warningsHtml = "";
    warningsHtml += getAllergyWarning(topic, patientData);
    warningsHtml += getPDE5Warning(topic, patientData);
    warningsHtml += getLowBPWarning(topic, patientData);
    return warningsHtml;
}
