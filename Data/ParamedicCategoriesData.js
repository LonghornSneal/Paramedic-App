// Data/ParamedicCategoriesData.js
import { slugify } from '../Utils/slugify.js';

export const ParamedicCategoriesData = [
  {
    id: slugify("Abbreviations & References"), title: "Abbreviations & References", 
    type: "category", 
    children: [
      { 
        id: slugify("Abbott Approved Abbreviations"), title: "Abbott Approved Abbreviations", 
        type: "topic" 
      },{ 
        id: slugify("Other Abbreviations"), title: "Other Abbreviations", 
        type: "topic" 
      }
    ]
  },
  {
    id: slugify("Introduction & Core Principles"), title: "Introduction & Core Principles", 
    type: "category", 
    children: [
      { 
        id: slugify("Introduction to Abbott"), title: "Introduction to Abbott", 
        type: "topic" 
      },{ 
        id: slugify("Core Principles – Safety & Well-Being"), title: "Core Principles – Safety & Well-Being", 
        type: "topic" 
      },{ 
        id: slugify("General Important Information"), title: "General Important Information", 
        type: "topic" 
      }
    ]
  },
  {
    id: slugify("Administrative & Legal Essentials"), title: "Administrative & Legal Essentials", 
    type: "category", 
    children: [
      { 
        id: slugify("ALS Ground Rules"), title: "ALS Ground Rules", 
        type: "topic" 
      },{ 
        id: slugify("Scope Violations & Possible Consequences"), title: "Scope Violations & Possible Consequences", 
        type: "topic" 
      },{ 
        id: slugify("Suspension/Revocation"), title: "Suspension/Revocation", 
         type: "topic" 
      },{ 
        id: slugify("On-Scene Authority"), title: "On-Scene Authority", 
        type: "topic" 
      },{ 
        id: slugify("On-Scene Healthcare Professionals"), title: "On-Scene Healthcare Professionals", 
        type: "topic" 
      },{ 
        id: slugify("Dispatching MD [200]"), title: "Dispatching MD [200]", 
        type: "topic" 
      },{ 
        id: slugify("Consulting OLMC"), title: "Consulting OLMC", 
        type: "topic" 
      },{ 
        id: slugify("Transfer to Lesser Credential"), title: "Transfer to Lesser Credential", 
        type: "topic" 
      },{ 
        id: slugify("EMR Accompanying Critically Ill"), title: "EMR Accompanying Critically Ill", 
        type: "topic" 
      },{ 
        id: slugify("Response Mode"), title: "Response Mode", 
        type: "topic" 
      },{ 
        id: slugify("AIR AMBULANCE UTILIZATION"), title: "AIR AMBULANCE UTILIZATION", 
        type: "topic" 
      },{ 
        id: slugify("Applicability of the COG"), title: "Applicability of the COG", 
        type: "topic" 
      },{ 
        id: slugify("Mandatory Reporting"), title: "Mandatory Reporting", 
        type: "topic" 
      },{ 
        id: slugify("Crime Scene"), title: "Crime Scene", 
        type: "topic" 
      },{ 
        id: slugify("Worker’s Compensation Process"), title: "Worker’s Compensation Process", 
        type: "topic" 
      }
    ]
  },
  {
    id: slugify("Operational Protocols"), title: "Operational Protocols", 
    type: "category", 
    children: [
      { 
        id: slugify("Restraint of Agitated/Combative Patients"), title: "Restraint of Agitated/Combative Patients", 
        type: "topic" 
      },{ 
        id: slugify("Richmond Agitation Sedation Scale (RASS)"), title: "Richmond Agitation Sedation Scale (RASS)", 
        type: "topic" 
      },{ 
        id: slugify("Rule of 9’s & Rule of Palms (BSA Burn Estimation)"), title: "Rule of 9’s & Rule of Palms (BSA Burn Estimation)", 
        type: "topic" 
      },{ 
        id: slugify("Smith-Modified Sgarbossa Criteria"), title: "Smith-Modified Sgarbossa Criteria", 
        type: "topic" 
      },{ 
        id: slugify("PCR Requirements"), title: "PCR Requirements", 
        type: "topic" 
      },{ 
        id: slugify("Clinical Errors & Reporting"), title: "Clinical Errors & Reporting", 
        type: "topic" 
      },{ 
        id: slugify("Medication Administration Cross Check (MACC)"), title: "Medication Administration Cross Check (MACC)", 
        type: "topic" 
      },{ 
        id: slugify("CDC Field Triage Guidelines (Trauma)"), title: "CDC Field Triage Guidelines (Trauma)", 
        type: "topic" 
      },{ 
        id: slugify("Rehabilitation: Emergency Incidents & Municipal Partners"), title: "Rehabilitation: Emergency Incidents & Municipal Partners", 
        type: "topic" 
      }
    ]
  },{
    id: slugify("Skills & Equipment"), title: "Skills & Equipment", 
    type: "category", children: [{ 
//      @@ 'Skills & Equipment' children array
      
       id: slugify("Ventilator Set-Up (ParaPAC Plus)"), title: "Ventilator Set-Up (ParaPAC Plus)",
       type: "topic" 
     },{ 
      id: slugify("Zoll EMV731"), title: "Zoll EMV731",
      type: "category",
      children: [
        { id: ("zoll-emv731-general-information"), title: "Zoll EMV731 – General Information", type: "topic" },
        { id: slugify("zoll-emv731-product-overview"), title: "Product Overview", type: "topic" },
        { id: slugify("zoll-emv731-setting-up-the-ventilator"), title: "Setting Up the Ventilator", type: "topic" },
        { id: slugify("zoll-emv731-using-the-ventilator"), title: "Using the Ventilator", type: "topic" },
        { id: slugify("zoll-emv731-alarms"), title: "Alarms", type: "topic" },
        { id: slugify("zoll-emv731-operating-environments"), title: "Operating Environments", type: "topic" },
        { id: slugify("zoll-emv731-maintenance"), title: "Maintenance", type: "topic" },
        { id: slugify("zoll-emv731-specifications"), title: "Specifications", type: "topic" },
        { id: slugify("zoll-emv731-accessories"), title: "Accessories", type: "topic" },
        { id: slugify("zoll-emv731-pulse-oximeter-principles"), title: "Pulse Oximeter Principles", type: "topic" },
        { id: slugify("zoll-emv731-patient-circuits"), title: "Patient Circuits", type: "topic" }
      ]

    },{ 
      id: slugify("I-gel Supraglottic Airway (SGA)"), title: "I-gel Supraglottic Airway (SGA)", 
      type: "topic" 
    },{ 
      id: slugify("Thermometer (Braun ThermoScan)"), title: "Thermometer (Braun ThermoScan)", 
      type: "topic" 
    },{ 
      id: slugify("Glucometer (McKesson True Metrix Pro)"), title: "Glucometer (McKesson True Metrix Pro)", 
      type: "topic" 
    },{ 
      id: slugify("Diltiazem Add-Vantage Directions"), title: "Diltiazem Add-Vantage Directions", 
      type: "topic" 
    },{ 
      id: slugify("EZ-IO Insertion"), title: "EZ-IO Insertion", 
      type: "topic" 
    },{ 
      id: slugify("PUSH-DOSE EPI"), title: "PUSH-DOSE EPI", 
      type: "topic" 
    },{ 
      id: slugify("Mucosal Atomization Device (M.A.D.)"), title: "Mucosal Atomization Device (M.A.D.)", 
      type: "topic" 
    },{ 
      id: slugify("Minutes of Oxygen by Cylinder Size"), title: "Minutes of Oxygen by Cylinder Size", 
      type: "topic" 
    },{ 
      id: slugify("Understanding Ratios, Percentages & Solution Mixtures"), title: "Understanding Ratios, Percentages & Solution Mixtures", 
      type: "topic" 
    }]
  },
  {id: slugify("Adult Protocols"), title: "Adult Protocols", 
    type: "category", children: [{ 
      id: slugify("Adult Airway & Breathing"), title: "Airway & Breathing", 
      type: "category", children: [{ 
        id: slugify("Adult Bronchospasm"), title: "Bronchospasm", 
        type: "topic" 
      },{ 
        id: slugify("Adult CPAP-BiPAP"), title: "CPAP/BiPAP", 
        type: "topic" 
      },{ 
        id: slugify("Adult SAI"), title: "SAI", 
        type: "topic" 
      },{ 
        id: slugify("Adult Nasal Intubation"), title: "Nasal Intubation", 
        type: "topic" 
      },{ 
        id: slugify("Adult Ventilator pt Intubated & Sedated"), title: "Ventilator pt: Intubated & Sedated", 
        type: "topic" 
      },]
    },{ 
      id: slugify("Adult Circulation-Cardiology"), title: "Circulation/Cardiology", 
      type: "category", children: [{ 
        id: slugify("Adult Bradycardia"), title: "Bradycardia", 
        type: "topic" 
      },{ 
        id: slugify("Adult Cardiogenic Shock (not post arrest)"), title: "Cardiogenic Shock (not post arrest)", 
        type: "topic" 
      },{ 
        id: slugify("Adult LVAD pt"), title: "LVAD pt", 
        type: "topic" 
      },{ 
        id: slugify("Adult Pulmonary Edema"), title: "Pulmonary Edema", 
        type: "topic" 
      },{ 
        id: slugify("Adult MI-ACS"), title: "MI/ACS", 
        type: "topic" 
      },{ 
        id: slugify("Adult PEA-Asystole"), title: "PEA/Asystole", 
        type: "topic" 
      },{ 
        id: slugify("Adult ROSC Stabilization"), title: "ROSC Stabilization", 
        type: "topic" 
      },{ 
        id: slugify("Adult VF-pVT"), title: "VF/pVT", 
        type: "topic" 
      },{ 
        id: slugify("Adult Hyperkalemia"), title: "Hyperkalemia", 
        type: "topic" 
      },{ 
        id: slugify("Adult SVT-Mono-VT (unstable)"), title: "SVT/Mono-VT (unstable)", 
        type: "topic" 
      },{ 
        id: slugify("Adult SVT (stable)"), title: "SVT (stable)", 
        type: "topic" 
      },{ 
        id: slugify("Adult A-Fib RVR or A-Flutter (stable symptomatic)"), title: "A-Fib RVR or A-Flutter (stable symptomatic)", 
        type: "topic" 
      },{ 
        id: slugify("Adult MAT (stable)"), title: "MAT (stable)", 
        type: "topic" 
      },{ 
        id: slugify("Adult Mono-VT (stable)"), title: "Mono-VT (stable)", 
        type: "topic" 
      },{ 
        id: slugify("Adult Poly-VT-Torsades (stable)"), title: "Poly-VT/Torsades (stable)", 
        type: "topic" 
      },{ 
        id: slugify("Adult Poly-VT-Torsades (unstable)"), title: "Poly-VT/Torsades (unstable)", 
        type: "topic" 
      },]
    },{ 
      id: slugify("Adult Medical Emergencies"), title: "Medical Emergencies", 
      type: "category", children: [{ 
        id: slugify("Adult Allergic Reaction"), title: "Allergic Reaction", 
        type: "topic" 
      },{ 
        id: slugify("Adult Anaphylaxis"), title: "Anaphylaxis", 
        type: "topic" 
      },{ 
        id: slugify("Adult Fall or Weakness"), title: "Fall or Weakness", 
        type: "topic" 
      },{ 
        id: slugify("Adult Hyperglycemia"), title: "Hyperglycemia", 
        type: "topic" 
      },{ 
        id: slugify("Adult Hypoglycemia"), title: "Hypoglycemia", 
        type: "topic" 
      },{ 
        id: slugify("Adult N-V"), title: "N/V", 
        type: "topic" 
      },{ 
        id: slugify("Adult SLUDGEM pt"), title: "SLUDGEM pt", 
        type: "topic" 
      },{ 
        id: slugify("Adult Pain"), title: "Pain", 
        type: "topic" 
      },{ 
        id: slugify("Adult H-A or Abdominal pain"), title: "H/A or Abdominal pain", 
        type: "topic" 
      },{ 
        id: slugify("Adult Sickle Cell Crisis"), title: "Sickle Cell Crisis", 
        type: "topic" 
      },{ 
        id: slugify("Adult Seizure"), title: "Seizure", 
        type: "topic" 
      },{ 
        id: slugify("Adult Sepsis"), title: "Sepsis", 
        type: "topic" 
      },{ 
        id: slugify("Adult Stroke"), title: "Stroke", 
        type: "topic" 
      },{ 
        id: slugify("Adult Toxic Ingestion with serious S-S"), title: "Toxic Ingestion with serious S/S", 
        type: "topic" 
      },{ 
        id: slugify("Adult RASS 1 through 4"), title: "RASS +1 through +4", 
        type: "topic" 
      },]
    },{ 
      id: slugify("Adult OBGYN"), title: "OB/GYN", 
      type: "category", children: [{ 
        id: slugify("Adult Normal Delivery"), title: "Normal Delivery", 
        type: "topic" 
      },{ 
        id: slugify("Adult Shoulder Dystocia"), title: "Shoulder Dystocia", 
        type: "topic" 
      },{ 
        id: slugify("Adult Breech"), title: "Breech", 
        type: "topic" 
      },{ 
        id: slugify("Adult Frank-Complete Breech Presentation"), title: "Frank/Complete Breech Presentation", 
        type: "topic" 
      },{ 
        id: slugify("Adult Prolapsed Cord"), title: "Prolapsed Cord", 
        type: "topic" 
      },{ 
        id: slugify("Adult Eclampsia"), title: "Eclampsia", 
        type: "topic" 
      },]
    },{ 
      id: slugify("Adult Trauma"), title: "Trauma", 
      type: "category", children: [{ 
        id: slugify("Adult Cardiac Arrest - Pressure Sores from Immobility"), title: "Cardiac Arrest + Pressure Sores from Immobility", 
        type: "topic" 
      },{ 
        id: slugify("Adult Mace-Pepper-Spray"), title: "Mace/Pepper-Spray", 
        type: "topic" 
      },{ 
        id: slugify("Adult SMR"), title: "SMR", 
        type: "topic" 
      },{ 
        id: slugify("Adult Taser"), title: "Taser", 
        type: "topic" 
      },{ 
        id: slugify("Adult Major Level 1 Trauma"), title: "Major Level 1 Trauma", 
        type: "topic" 
      },]
    },{ 
      id: slugify("Adult Refusals"), title: "Refusals", 
      type: "topic" 
    }]
  },
  {id: slugify("Pediatric Protocols"), title: "Pediatric Protocols", 
    type: "category", children: [{ 
      id: slugify("Pediatric Assessment & VS"), title: "Pediatric Assessment & VS", 
      type: "topic" 
    },{ 
      id: slugify("Pediatric Airway & Breathing"), title: "Airway & Breathing", 
      type: "topic" 
    },{ 
      id: slugify("Pediatric Circulation-Cardiac"), title: "Circulation/Cardiac", 
      type: "topic" 
    },{ 
      id: slugify("Pediatric Medical"), title: "Medical", 
      type: "topic" 
    },{ 
      id: slugify("Pediatric Trauma"), title: "Trauma", 
      type: "topic" 
    },{ 
      id: slugify("Pediatric Special Needs Children"), title: "Special Needs Children", 
      type: "topic" 
    },{ 
      id: slugify("Pediatric Refusals"), title: "Refusals", 
      type: "topic" 
    }]
  },
  {id: slugify("ALS Medications"), title: "ALS Medications", 
    type: "category", children: [
      { id: '10-calcium-chloride', title: "10% Calcium Chloride", 
        type: "topic" 
      }, { 
        id: '2-lidocaine-xylocaine', title: "2% Lidocaine (Xylocaine)", 
        type: "topic" 
      },
      { id: '8-4-sodium-bicarbonate-nahco3', title: "8.4% Sodium Bicarbonate (NaHCO₃)", 
        type: "topic" 
      }, { 
        id: 'adenosine-adenocard', title: "Adenosine (Adenocard)", 
        type: "topic" 
      },
      { id: 'albuterol', title: "Albuterol", 
        type: "topic" 
      }, { 
        id: 'asa', title: "ASA", 
        type: "topic" 
      }, { 
        id: 'atropine-sulfate', title: "Atropine Sulfate", 
        type: "topic" 
      },
      { id: 'd10', title: "D10", 
        type: "topic" 
      }, { 
        id: 'd5', title: "D5", 
        type: "topic" 
      }, { 
        id: 'dexamethasone-decadron', title: "Dexamethasone (Decadron)", 
        type: "topic" 
      },
      { id: 'diphenhydramine-benadryl', title: "Diphenhydramine (Benadryl)", 
        type: "topic" 
      }, { 
        id: 'droperidol-inapsine', title: "Droperidol (Inapsine)", 
        type: "topic" 
      },
      { id: 'epi-1-1000-adrenaline', title: "Epi 1:1,000 (Adrenaline)", 
        type: "topic" 
      }, { 
        id: 'epi-1-10000', title: "Epi 1:10,000", 
        type: "topic" 
      },
      { id: 'epi-1-100000-push-dose-epi', title: "Epi 1:100,000 \"Push-Dose Epi\"", 
        type: "topic" 
      }, { 
        id: 'etomidate-amidate', title: "Etomidate (Amidate)", 
        type: "topic" 
      },
      { id: 'fentanyl-sublimaze', title: "Fentanyl (Sublimaze)", 
        type: "topic" 
      }, { 
        id: 'ipratropium', title: "Ipratropium", 
        type: "topic" 
      },
      { id: 'ketamine-ketalar', title: "Ketamine (Ketalar)", 
        type: "topic" 
      }, { 
        id: 'ketorolac-tromethamine-toradol', title: "Ketorolac Tromethamine (Toradol)", 
        type: "topic" 
      },
      { id: 'magnesium-sulfate-mgso4', title: "Magnesium sulfate (MgSO₄)", 
        type: "topic" 
      }, { 
        id: 'metoprolol-tartrate-lopressor', title: "Metoprolol tartrate (Lopressor)", 
        type: "topic" 
      },
      { id: 'midazolam-versed', title: "Midazolam (Versed)", 
        type: "topic" 
      }, { id: 'morphine', title: "Morphine", 
        type: "topic" 
      },
      { id: 'naloxone-narcan', title: "Naloxone (Narcan)", 
        type: "topic" 
      }, { 
        id: 'ntg', title: "NTG", 
        type: "topic" 
      }, { 
        id: 'ondansetron-zofran', title: "Ondansetron (Zofran)", 
        type: "topic" 
      }
    ]
  }
];
