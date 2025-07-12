// Warnings.js – contains all warning-related logic

// Returns an SVG string for a warning icon symbol,
function createWarningIcon(colorClass = 'text-yellow-600') {
    return `<svg class="${
        colorClass
    } w-5 h-5 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
    </svg>`;
}

// Insert warning boxes if any contraindications or allergies are present
function appendTopicWarnings(topic) {
    let warningsHtml = "";

    warningsHtml += getAllergyWarning(topic, patientData);
    warningsHtml += getPDE5Warning(topic, patientData);
    warningsHtml += getLowBPWarning(topic, patientData);

    return warningsHtml;
}

function getAllergyWarning(topic, patientData) {
    if (!patientData.allergies.length) return "";
    const medKeywords = (topic.title + " " + topic.id).toLowerCase();
    const allergy = patientData.allergies.find(a => a && medKeywords.includes(a.toLowerCase()));
    if (!allergy) return "";
    return `<div class="warning-box warning-box-red"><div>${
        createWarningIcon('text-red-600')
    }
    <span>Allergy Alert: Patient has an allergy to ${topic.title}.</span></div></div>`;
}

function getPDE5Warning(topic, patientData) {
    if (topic.id !== 'ntg') return "";
    const hasPDE5 = patientData.currentMedications.some(med =>
        PDE5_INHIBITORS.some(term => med.toLowerCase().includes(term.toLowerCase()))
    );
    if (!hasPDE5) return "";
    return `<div class="warning-box warning-box-red"><div>${
        createWarningIcon('text-red-600')
    }
    <span>Contraindication: Recent PDE5 inhibitor use – do NOT administer NTG.</span></div></div>`;
}

function getLowBPWarning(topic, patientData) {
    if (topic.id !== 'ntg' || !patientData?.vitalSigns?.bp) return "";
    // Example logic: warn if systolic BP < 100
    const systolicBP = parseInt(patientData.vitalSigns.bp.split('/')[0], 10);
    if (systolicBP < 100) {
        return '<div class="text-red-600 font-bold mb-2">Warning: Systolic BP is low. NTG may be contraindicated.</div>';
    }
    return "";
}
