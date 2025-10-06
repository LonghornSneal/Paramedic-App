export const patientInfoSynonyms = {
  pmh: [
    { canonical: 'Myocardial Infarction', display: 'MI', synonyms: ['mi', 'myocardial infarction', 'heart attack'] },
    { canonical: 'Congestive Heart Failure', display: 'CHF', synonyms: ['chf', 'congestive heart failure', 'heart failure'] },
    { canonical: 'Chronic Obstructive Pulmonary Disease', display: 'COPD', synonyms: ['copd', 'chronic obstructive pulmonary disease'] },
    { canonical: 'Diabetes Mellitus', display: 'DM', synonyms: ['diabetes', 'diabetes mellitus', 'dm'] },
    { canonical: 'Hypertension', display: 'HTN', synonyms: ['htn', 'hypertension', 'high blood pressure'] }
  ],
  allergies: [
    { canonical: 'Aspirin', display: 'ASA', synonyms: ['asa', 'aspirin'] },
    { canonical: 'Penicillin', display: 'Penicillin', synonyms: ['pcn', 'penicillin'] },
    { canonical: 'Latex', display: 'Latex', synonyms: ['latex'] },
    { canonical: 'Shellfish', display: 'Shellfish', synonyms: ['shellfish'] }
  ],
  medications: [
    { canonical: 'Metoprolol', display: 'Metoprolol', synonyms: ['metoprolol', 'lopressor'] },
    { canonical: 'Nitroglycerin', display: 'Nitroglycerin', synonyms: ['nitroglycerin', 'ntg'] },
    { canonical: 'Albuterol', display: 'Albuterol', synonyms: ['albuterol', 'salbutamol'] },
    { canonical: 'Epinephrine', display: 'Epinephrine', synonyms: ['epinephrine', 'epi'] }
  ],
  indications: [
    { canonical: 'Chest Pain', display: 'Chest Pain', synonyms: ['chest pain', 'cp'] },
    { canonical: 'Shortness of Breath', display: 'SOB', synonyms: ['shortness of breath', 'sob', 'dyspnea'] },
    { canonical: 'Bronchospasm', display: 'Bronchospasm', synonyms: ['bronchospasm', 'wheezing'] },
    { canonical: 'Hypoglycemia', display: 'Hypoglycemia', synonyms: ['hypoglycemia', 'low blood sugar'] }
  ],
  symptoms: [
    { canonical: 'Nausea', display: 'Nausea', synonyms: ['nausea'] },
    { canonical: 'Vomiting', display: 'Vomiting', synonyms: ['vomiting', 'emesis'] },
    { canonical: 'Dizziness', display: 'Dizziness', synonyms: ['dizziness', 'vertigo'] },
    { canonical: 'Weakness', display: 'Weakness', synonyms: ['weakness', 'fatigue'] },
    { canonical: 'Headache', display: 'Headache', synonyms: ['headache'] }
  ],
  ekg: [
    { canonical: 'Sinus Tachycardia', display: 'Sinus Tachy', synonyms: ['sinus tachycardia', 'tachycardia', 'sinus tachy'] },
    { canonical: 'Sinus Bradycardia', display: 'Sinus Brady', synonyms: ['sinus bradycardia', 'bradycardia', 'sinus brady'] },
    { canonical: 'Atrial Fibrillation', display: 'A-Fib', synonyms: ['atrial fibrillation', 'afib', 'a-fib'] },
    { canonical: 'Atrial Flutter', display: 'A-Flutter', synonyms: ['atrial flutter', 'a-flutter', 'flutter'] },
    { canonical: 'Supraventricular Tachycardia', display: 'SVT', synonyms: ['svt', 'supraventricular tachycardia'] },
    { canonical: 'Ventricular Tachycardia', display: 'VT', synonyms: ['ventricular tachycardia', 'vt', 'v-tach'] },
    { canonical: 'Junctional Rhythm', display: 'Junctional', synonyms: ['junctional rhythm', 'junctional'] },
    { canonical: 'Asystole', display: 'Asystole', synonyms: ['asystole', 'flatline'] }
  ]
};

export function buildSynonymLookup() {
  const lookup = {};
  Object.entries(patientInfoSynonyms).forEach(([field, entries]) => {
    lookup[field] = new Map();
    entries.forEach(entry => {
      entry.synonyms.forEach(term => {
        lookup[field].set(term.toLowerCase(), entry);
      });
      lookup[field].set(entry.canonical.toLowerCase(), entry);
    });
  });
  return lookup;
}
