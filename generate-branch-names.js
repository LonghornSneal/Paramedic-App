#!/usr/bin/env node
const { execSync } = require('child_process');
const slugify = require('./slugify');

// Nested structure of branch titles. When executed, this script
// outputs a flat list of slugified names. Use --create to create
// Git branches with those names.
const branches = [
  {
    title: 'Abbreviations & References',
    children: [
      'Abbott Approved Abbreviations',
      'Other Abbreviations'
    ]
  },
  {
    title: 'Introduction & Core Principles',
    children: [
      'Introduction to Abbott',
      'Core Principles – Safety & Well-Being',
      'General Important Information'
    ]
  },
  {
    title: 'Administrative & Legal Essentials',
    children: [
      'ALS Ground Rules',
      'Scope Violations & Possible Consequences',
      'Suspension/Revocation',
      'On-Scene Authority',
      'On-Scene Healthcare Professionals',
      'Dispatching MD [200]',
      'Consulting OLMC',
      'Transfer to Lesser Credential',
      'EMR Accompanying Critically Ill',
      'Response Mode',
      'AIR AMBULANCE UTILIZATION',
      'Applicability of the COG',
      'Mandatory Reporting',
      'Crime Scene',
      "Worker's Compensation Process"
    ]
  },
  {
    title: 'Operational Protocols',
    children: [
      'Restraint of Agitated/Combative Patients',
      'Richmond Agitation Sedation Scale (RASS)',
      "Rule of 9’s & Rule of Palms (BSA Burn Estimation)",
      'Smith-Modified Sgarbossa Criteria',
      'PCR Requirements',
      'Clinical Errors & Reporting',
      'Medication Administration Cross Check (MACC)',
      'CDC Field Triage Guidelines (Trauma)',
      'Rehabilitation: Emergency Incidents & Municipal Partners'
    ]
  },
  {
    title: 'Skills & Equipment',
    children: [
      'Ventilator Set-Up (ParaPAC Plus)',
      'I-gel Supraglottic Airway (SGA)',
      'Thermometer (Braun ThermoScan)',
      'Glucometer (McKesson True Metrix Pro)',
      'Diltiazem Add-Vantage Directions',
      'EZ-IO Insertion',
      'PUSH-DOSE EPI',
      'Mucosal Atomization Device (M.A.D.)',
      'Minutes of Oxygen by Cylinder Size',
      'Understanding Ratios, Percentages & Solution Mixtures'
    ]
  },
  {
    title: 'Adult Protocols',
    children: [
      {
        title: 'Airway & Breathing',
        children: [
          'Bronchospasm',
          'CPAP/BiPAP',
          'SAI',
          'Nasal Intubation',
          'Ventilator pt: Intubated & Sedated'
        ]
      },
      {
        title: 'Circulation/Cardiology',
        children: [
          'Bradycardia',
          'Cardiogenic Shock (not post arrest)',
          'LVAD pt',
          'Pulmonary Edema',
          'MI/ACS',
          'PEA/Asystole',
          'ROSC Stabilization',
          'VF/pVT',
          'Hyperkalemia',
          'SVT/Mono-VT (unstable)',
          'SVT (stable)',
          'A-Fib RVR or A-Flutter (stable symptomatic)',
          'MAT (stable)',
          'Mono-VT (stable)',
          'Poly-VT/Torsades (stable)',
          'Poly-VT/Torsades (unstable)'
        ]
      },
      {
        title: 'Medical Emergencies',
        children: [
          'Allergic Reaction',
          'Anaphylaxis',
          'Fall or Weakness',
          'Hyperglycemia',
          'Hypoglycemia',
          'N/V',
          'SLUDGEM pt',
          'Pain',
          'H/A or Abdominal pain',
          'Sickle Cell Crisis',
          'Seizure',
          'Sepsis',
          'Stroke',
          'Toxic Ingestion with serious S/S',
          'RASS +1 through +4'
        ]
      },
      {
        title: 'OB/GYN',
        children: [
          'Normal Delivery',
          'Shoulder Dystocia',
          'Breech',
          'Frank/Complete Breech Presentation',
          'Prolapsed Cord',
          'Eclampsia'
        ]
      },
      {
        title: 'Trauma',
        children: [
          'Cardiac Arrest + Pressure Sores from Immobility',
          'Mace/Pepper-Spray',
          'SMR',
          'Taser',
          'Major Level 1 Trauma'
        ]
      },
      'Refusals'
    ]
  },
  {
    title: 'Pediatric Protocols',
    children: [
      'Pediatric Assessment & VS',
      'Airway & Breathing',
      'Circulation/Cardiac',
      'Medical',
      'Trauma',
      'Special Needs Children',
      'Refusals'
    ]
  },
  {
    title: 'ALS Medications',
    children: [
      '10% Calcium Chloride',
      '2% Lidocaine (Xylocaine)',
      '8.4% Sodium Bicarbonate (NaHCO₃)',
      'Adenosine (Adenocard)',
      'Albuterol',
      'ASA',
      'Atropine Sulfate',
      'D10',
      'D5',
      'Dexamethasone (Decadron)',
      'Diphenhydramine (Benadryl)',
      'Droperidol (Inapsine)',
      'Epi 1:1,000 (Adrenaline)',
      'Epi 1:10,000',
      'Epi 1:100,000 "Push-Dose Epi"',
      'Etomidate (Amidate)',
      'Fentanyl (Sublimaze)',
      'Ipratropium',
      'Ketamine (Ketalar)',
      'Ketorolac Tromethamine (Toradol)',
      'Magnesium sulfate (MgSO₄)',
      'Metoprolol tartrate (Lopressor)',
      'Midazolam (Versed)',
      'Morphine',
      'Naloxone (Narcan)',
      'NTG',
      'Ondansetron (Zofran)'
    ]
  }
];

const create = process.argv.includes('--create');

function walk(item) {
  if (!item) return;
  if (typeof item === 'string') {
    output(slugify(item));
  } else {
    output(slugify(item.title));
    if (Array.isArray(item.children)) {
      item.children.forEach(child => walk(child));
    }
  }
}

function output(name) {
  if (create) {
    try {
      execSync(`git branch ${name}`);
    } catch (err) {
      console.error(`Could not create branch ${name}:`, err.message);
    }
  } else {
    console.log(name);
  }
}

branches.forEach(b => walk(b));
