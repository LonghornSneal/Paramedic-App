// Data/ParamedicCategoriesData.js
import { slugify } from '../Utils/slugify.js';
export const ParamedicCategoriesData = [
  {id: slugify("Adult Protocols"), title: "Adult Protocols", 
      type: "category", children: [{
        id: slugify("Adult Airway & Breathing"), title: "Airway & Breathing",
        type: "category", children: [{
          id: slugify("Adult COMA/OD"), title: "COMA/OD",
          type: "topic"
        },{
          id: slugify("Adult CPAP or BiPAP"), title: "CPAP or BiPAP",
          type: "topic"
        },{
          id: slugify("Adult SAI"), title: "SAI",
          type: "topic"
        },{
          id: slugify("Adult Nasal Intubation"), title: "Nasal Intubation",
          type: "topic"
        },{
          id: slugify("Adult ET Intubation"), title: "ET Intubation",
          type: "topic"
        },{
          id: slugify("Adult VENTILATOR Pt; Intubated & Sedated"), title: "VENTILATOR Pt; Intubated & Sedated",
          type: "topic"
        },{
          id: slugify("Adult TRACHEOSTOMY CARE"), title: "TRACHEOSTOMY CARE",
          type: "topic"
        },{
          id: slugify("Adult Cricothyrotomy"), title: "Cricothyrotomy",
          type: "topic"
        },{
          id: slugify("Adult Tension Pneumo"), title: "Tension Pneumo",
          type: "topic"
        },{
          id: slugify("Adult SGA -> Cardiac Arrest = Use 1st"), title: "SGA -> Cardiac Arrest = Use 1st",
          type: "topic"
        }]
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
        { id: '10-calcium-chloride', title: "Calcium Chloride (1,000mg/10ml)", 
          type: "topic" 
        }, { 
          id: '2-lidocaine-xylocaine', title: "2% Lidocaine (Xylocaine) (100mg/5ml)", 
          type: "topic" 
        },
        { id: '8-4-sodium-bicarbonate-nahco3', title: "8.4% Bicarb (NaHCO3) (50mEq/50ml)", 
          type: "topic" 
        }, { 
          id: 'adenosine-adenocard', title: "Adenosine (Adenocard) (6mg/2ml)", 
          type: "topic" 
        },
        { id: 'albuterol', title: "Albuterol (2.5mg/3cc)", 
          type: "topic" 
        }, { 
          id: 'asa', title: "ASA (81mg/tab)", 
          type: "topic" 
        }, { 
          id: 'atropine-sulfate', title: "Atropine Sulfate (1mg/10ml)", 
          type: "topic" 
        },
        { id: 'd10', title: "D10 (25g/250ml bag)", 
          type: "topic" 
        }, { 
          id: 'd5', title: "D5 (5g/100ml bag)", 
          type: "topic" 
        }, { 
          id: 'dexamethasone-decadron', title: "Dexamethasone (Decadron) (10mg/ml)", 
          type: "topic" 
        },
        { id: 'diphenhydramine-benadryl', title: "Diphenhydramine (Benadryl) (50mg/ml)", 
          type: "topic" 
        }, { 
          id: 'droperidol-inapsine', title: "Droperidol (Inapsine) (5mg/2ml)", 
          type: "topic" 
        },
        { id: 'epi-1-1000-adrenaline', title: "Epi 1:1,000 (Adrenaline) (10mg/10ml)", 
          type: "topic" 
        }, { 
          id: 'epi-1-10000', title: "Epi 1:10,000 (1mg/10ml)", 
          type: "topic" 
        },
        { id: 'epi-1-100000-push-dose-epi', title: "Epi 1:100,000 \"Push-Dose Epi\" (100mcg/10ml)",
          type: "topic" 
        }, { 
          id: 'etomidate-amidate', title: "Etomidate (Amidate) (20mg/10ml)", 
          type: "topic" 
        },
        { id: 'fentanyl-sublimaze', title: "Fentanyl (Sublimaze) (100mcg/2ml)", 
          type: "topic" 
        }, { 
          id: 'ipratropium', title: "Ipratropium (0.5mg/3cc)", 
          type: "topic" 
        },
        { id: 'ketamine-ketalar', title: "Ketamine (Ketalar) (500mg/5ml)", 
          type: "topic" 
        }, { 
          id: 'ketorolac-tromethamine-toradol', title: "Ketorolac Tromethamine (Toradol) (30mg/ml)", 
          type: "topic" 
        },
        { id: 'magnesium-sulfate-mgso4', title: "Magnesium Sulfate (MgSO4) (1g/2ml)", 
          type: "topic" 
        }, { 
          id: 'metoprolol-tartrate-lopressor', title: "Metoprolol Tartrate (Lopressor) (5mg/5ml)", 
          type: "topic" 
        },
        { id: 'midazolam-versed', title: "Midazolam (Versed) (10mg/2ml)", 
          type: "topic" 
        }, { id: 'morphine', title: "Morphine (4mg/2ml)", 
          type: "topic" 
        },
        { id: 'naloxone-narcan', title: "Naloxone (Narcan) (2mg/2ml)", 
          type: "topic" 
        }, { 
          id: 'ntg', title: "NTG (0.4mg/spray)", 
          type: "topic" 
        }, { 
          id: 'ondansetron-zofran', title: "Ondansetron (Zofran) (4mg/2ml)", 
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
          type: "topic",
          details: { mdPath: "Content/Administrative & Legal Essentials/medication-administration-cross-check-macc.md" } 
        },{ 
          id: slugify("CDC Field Triage Guidelines (Trauma)"), title: "CDC Field Triage Guidelines (Trauma)", 
          type: "topic" 
        },{ 
          id: slugify("Rehabilitation: Emergency Incidents & Municipal Partners"), title: "Rehabilitation: Emergency Incidents & Municipal Partners", 
          type: "topic" 
        }
      ]
    },
  {
      id: slugify("Skills & Equipment"), title: "Skills & Equipment", 
      type: "category", children: [{ 
  //      @@ 'Skills & Equipment' children array

         id: slugify("Ventilator Set-Up (ParaPAC Plus)"), title: "Ventilator Set-Up (ParaPAC Plus)",
         type: "topic" 
       },{ 
        id: slugify("Zoll EMV731"), title: "Zoll EMV731",
        type: "category",
        children: [
          { id: slugify("zoll-emv731-quick-vent-guide"), title: "Quick Vent Guide", type: "category", children: [
            { id: 'zoll-quick-vent-zoll-setup', title: 'Zoll Set Up', type: 'topic' },
            { id: 'zoll-quick-vent-operational-notes', title: 'General Operational Notes', type: 'topic' },
            { id: 'zoll-quick-vent-volume-mode', title: 'Volume Mode', type: 'topic' },
            { id: 'zoll-quick-vent-pressure-mode', title: 'Pressure Mode', type: 'topic' },
            { id: 'zoll-quick-vent-other-vent-alarms', title: 'Other Vent Alarms', type: 'topic' },
            { id: 'zoll-quick-vent-cpap', title: 'CPAP', type: 'topic' },
            { id: 'zoll-quick-vent-bi-level', title: 'Bi-Level', type: 'topic' },
            { id: 'zoll-quick-vent-terms-settings', title: 'Terms & Settings', type: 'topic' },
            { id: 'zoll-quick-vent-tidal-volume-calculator', title: 'Tidal Volume Calculator', type: 'topic' }
          ] },
          { id: ("zoll-emv731-general-information"), title: "Zoll EMV731 - General Information", type: "category", children: [
            { id: 'zoll-emv731-general-information-purpose-manual', title: 'Purpose & Manual Use', type: 'topic' },
            { id: 'zoll-emv731-general-information-symbols', title: 'Symbols', type: 'topic' },
            { id: 'zoll-emv731-general-information-indications', title: 'Indications for Use', type: 'topic' },
            { id: 'zoll-emv731-general-information-warnings', title: 'Warnings & Cautions', type: 'topic' },
            { id: 'zoll-emv731-general-information-warranty', title: 'Warranty & Tracking', type: 'topic' },
            { id: 'zoll-emv731-general-information-contact', title: 'Contact Information', type: 'topic' }
          ] },
          { id: slugify("zoll-emv731-product-overview"), title: "Product Overview", type: "category", children: [
            { id: 'zoll-emv731-product-overview-models', title: 'Models & Intended Use', type: 'topic' },
            { id: 'zoll-emv731-product-overview-controls', title: 'Controls & Indicators', type: 'topic' },
            { id: 'zoll-emv731-product-overview-gui', title: 'GUI Overview', type: 'topic' },
            { id: 'zoll-emv731-product-overview-pneumatic', title: 'Pneumatic Design', type: 'topic' },
            { id: 'zoll-emv731-product-overview-fresh-gas', title: 'Fresh Gas Intake', type: 'topic' },
            { id: 'zoll-emv731-product-overview-connector', title: 'Connector Panel', type: 'topic' },
            { id: 'zoll-emv731-product-overview-circuits', title: 'Ventilator Circuits', type: 'topic' },
            { id: 'zoll-emv731-product-overview-oximeter', title: 'Pulse Oximeter Module', type: 'topic' },
            { id: 'zoll-emv731-product-overview-power', title: 'Power Sources', type: 'topic' }
          ] },
          { id: slugify("zoll-emv731-setting-up-the-ventilator"), title: "Setting Up the Ventilator", type: "category", children: [
            { id: 'zoll-emv731-setting-up-circuit', title: 'Circuit Attachment', type: 'topic' },
            { id: 'zoll-emv731-setting-up-hp-o2', title: 'High-Pressure O₂ Connection', type: 'topic' },
            { id: 'zoll-emv731-setting-up-filters', title: 'Filters & Accessories', type: 'topic' },
            { id: 'zoll-emv731-setting-up-power', title: 'Power Source Selection', type: 'topic' },
            { id: 'zoll-emv731-setting-up-power-on', title: 'Power On & Defaults', type: 'topic' },
            { id: 'zoll-emv731-setting-up-mode', title: 'Mode Selection', type: 'topic' },
            { id: 'zoll-emv731-setting-up-op-test', title: 'Operational Test', type: 'topic' },
            { id: 'zoll-emv731-setting-up-oximeter', title: 'Attach Pulse Oximeter', type: 'topic' },
            { id: 'zoll-emv731-setting-up-connect', title: 'Connect Patient', type: 'topic' }
          ] },
          { id: slugify("zoll-emv731-using-the-ventilator"), title: "Using the Ventilator", type: "category", children: [
            { id: 'zoll-emv731-using-interface', title: 'Interface & Parameter Windows', type: 'topic' },
            { id: 'zoll-emv731-using-change-values', title: 'Changing Parameter Values', type: 'topic' },
            { id: 'zoll-emv731-using-mode-ac', title: 'Ventilation Modes (AC)', type: 'topic' },
            { id: 'zoll-emv731-using-mode-simv', title: 'Ventilation Modes (SIMV)', type: 'topic' },
            { id: 'zoll-emv731-using-mode-cpap', title: 'Ventilation Modes (CPAP)', type: 'topic' },
            { id: 'zoll-emv731-using-mode-bilevel', title: 'Ventilation Modes (Bi-Level)', type: 'topic' },
            { id: 'zoll-emv731-using-breath-target', title: 'Breath Target (V/P)', type: 'topic' },
            { id: 'zoll-emv731-using-oximeter', title: 'Pulse Oximeter Use', type: 'topic' },
            { id: 'zoll-emv731-using-popups', title: 'Pop Up Messages', type: 'topic' },
            { id: 'zoll-emv731-using-manage-alarms', title: 'Managing Alarms', type: 'topic' }
          ] },
          { id: slugify("zoll-emv731-alarms"), title: "Alarms", type: "category", children: [
            { id: 'zoll-emv731-alarms-overview', title: 'Alarm Overview', type: 'topic' },
            { id: 'zoll-emv731-alarms-amc', title: 'Alarm Message Center (AMC)', type: 'topic' },
            { id: 'zoll-emv731-alarms-priorities', title: 'Alarm Priorities', type: 'topic' },
            { id: 'zoll-emv731-alarms-icons', title: 'Alarm Icons & Service Codes', type: 'topic' },
            { id: 'zoll-emv731-alarms-muting', title: 'Muting Alarms', type: 'topic' },
            { id: 'zoll-emv731-alarms-types-patient', title: 'Alarm Types: Patient Safety', type: 'topic' },
            { id: 'zoll-emv731-alarms-types-environment', title: 'Alarm Types: Environment', type: 'topic' },
            { id: 'zoll-emv731-alarms-types-selfcheck', title: 'Alarm Types: Self Check', type: 'topic' },
            { id: 'zoll-emv731-alarms-groups', title: 'Alarm Groups', type: 'topic' },
            { id: 'zoll-emv731-alarms-popups', title: 'Pop Up Messages', type: 'topic' }
          ] },
          { id: slugify("zoll-emv731-operating-environments"), title: "Operating Environments", type: "category", children: [
            { id: 'zoll-emv731-operating-all', title: 'All Content', type: 'topic' },
            { id: 'zoll-emv731-operating-conditions', title: 'Environmental Conditions', type: 'topic' },
            { id: 'zoll-emv731-operating-transport', title: 'Transport Use', type: 'topic' },
            { id: 'zoll-emv731-operating-noise', title: 'High Noise Environments', type: 'topic' },
            { id: 'zoll-emv731-operating-emc', title: 'EMC & Safety', type: 'topic' }
          ] },
          { id: slugify("zoll-emv731-maintenance"), title: "Maintenance", type: "category", children: [
            { id: 'zoll-emv731-maintenance-all', title: 'All Content', type: 'topic' },
            { id: 'zoll-emv731-maintenance-pm', title: 'Preventive Maintenance', type: 'topic' },
            { id: 'zoll-emv731-maintenance-filters', title: 'Filter Maintenance', type: 'topic' },
            { id: 'zoll-emv731-maintenance-exhalation', title: 'Exhalation Valve Diaphragm', type: 'topic' },
            { id: 'zoll-emv731-maintenance-selftest', title: 'Self Test & Service', type: 'topic' },
            { id: 'zoll-emv731-maintenance-cleaning', title: 'Cleaning & Storage', type: 'topic' }
          ] },
          { id: slugify("zoll-emv731-specifications"), title: "Specifications", type: "category", children: [
            { id: 'zoll-emv731-specifications-all', title: 'All Content', type: 'topic' },
            { id: 'zoll-emv731-specifications-ranges', title: 'Operating Ranges', type: 'topic' },
            { id: 'zoll-emv731-specifications-resolution', title: 'Measurement Resolution & Tolerances', type: 'topic' },
            { id: 'zoll-emv731-specifications-o2', title: 'Oxygen Input Pressure', type: 'topic' }
          ] },
          { id: slugify("zoll-emv731-accessories"), title: "Accessories", type: "category", children: [
            { id: 'zoll-emv731-accessories-all', title: 'All Content', type: 'topic' },
            { id: 'zoll-emv731-accessories-power', title: 'Power Supplies & Cables', type: 'topic' },
            { id: 'zoll-emv731-accessories-battery', title: 'Battery Packs', type: 'topic' },
            { id: 'zoll-emv731-accessories-cases', title: 'Carrying Cases', type: 'topic' },
            { id: 'zoll-emv731-accessories-filters', title: 'Filters & HMEs', type: 'topic' },
            { id: 'zoll-emv731-accessories-reservoir', title: 'Reservoir Kits', type: 'topic' },
            { id: 'zoll-emv731-accessories-country', title: 'Country Variations', type: 'topic' }
          ] },
          { id: slugify("zoll-emv731-pulse-oximeter-principles"), title: "Pulse Oximeter Principles", type: "category", children: [
            { id: 'zoll-emv731-oximeter-all', title: 'All Content', type: 'topic' },
            { id: 'zoll-emv731-oximeter-principles', title: 'Principles of Pulse Oximetry', type: 'topic' },
            { id: 'zoll-emv731-oximeter-traditional', title: 'Traditional Ratio Method', type: 'topic' },
            { id: 'zoll-emv731-oximeter-masimo', title: 'Masimo SET Algorithm', type: 'topic' },
            { id: 'zoll-emv731-oximeter-rate-noise', title: 'Update Rate & Noise Handling', type: 'topic' }
          ] },
          { id: slugify("zoll-emv731-patient-circuits"), title: "Patient Circuits", type: "category", children: [
            { id: 'zoll-emv731-circuits-all', title: 'All Content', type: 'topic' },
            { id: 'zoll-emv731-circuits-types', title: 'Circuit Types & Lengths', type: 'topic' },
            { id: 'zoll-emv731-circuits-specs', title: 'Technical Specifications', type: 'topic' },
            { id: 'zoll-emv731-circuits-directions', title: 'Directions for Use', type: 'topic' },
            { id: 'zoll-emv731-circuits-troubleshooting', title: 'Troubleshooting', type: 'topic' },
            { id: 'zoll-emv731-circuits-warnings', title: 'Warnings & Notes', type: 'topic' }
          ] },
          { id: slugify("zoll-emv731-original-documentation"), title: "Original Documentation", type: "topic" }
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
   {

      id: slugify("Abbreviations & References"), title: "Abbreviations & References", 

      type: "category", 

      children: [

        {

          id: slugify("Abbott Approved Abbreviations"), title: "Abbott Approved Abbreviations", 

          type: "category", 

          children: [

            {

              id: slugify("Abbott Approved Abbreviations Assessment & Clinical Documentation"), title: "Assessment & Clinical Documentation", 

              type: "topic", 

              details: { mdPath: "Content/Abbreviations & References/abbott-approved-abbreviations-assessment-clinical-documentation.md" } 

            },{

              id: slugify("Abbott Approved Abbreviations Procedures & Equipment"), title: "Procedures & Equipment", 

              type: "topic", 

              details: { mdPath: "Content/Abbreviations & References/abbott-approved-abbreviations-procedures-equipment.md" } 

            },{

              id: slugify("Abbott Approved Abbreviations Medications & Pharmacology (Rx)"), title: "Medications & Pharmacology (Rx)", 

              type: "topic", 

              details: { mdPath: "Content/Abbreviations & References/abbott-approved-abbreviations-medications-pharmacology-rx.md" } 

            },{

              id: slugify("Abbott Approved Abbreviations Measurements & Units"), title: "Measurements & Units", 

              type: "topic", 

              details: { mdPath: "Content/Abbreviations & References/abbott-approved-abbreviations-measurements-units.md" } 

            },{

              id: slugify("Abbott Approved Abbreviations Cardiovascular & Hemodynamics"), title: "Cardiovascular & Hemodynamics", 

              type: "topic", 

              details: { mdPath: "Content/Abbreviations & References/abbott-approved-abbreviations-cardiovascular-hemodynamics.md" } 

            },{

              id: slugify("Abbott Approved Abbreviations Respiratory & Airway"), title: "Respiratory & Airway", 

              type: "topic", 

              details: { mdPath: "Content/Abbreviations & References/abbott-approved-abbreviations-respiratory-airway.md" } 

            },{

              id: slugify("Abbott Approved Abbreviations Anatomy & Patient Conditions"), title: "Anatomy & Patient Conditions", 

              type: "topic", 

              details: { mdPath: "Content/Abbreviations & References/abbott-approved-abbreviations-anatomy-patient-conditions.md" } 

            },{

              id: slugify("Abbott Approved Abbreviations Diagnostics, Labs & Imaging"), title: "Diagnostics, Labs & Imaging", 

              type: "topic", 

              details: { mdPath: "Content/Abbreviations & References/abbott-approved-abbreviations-diagnostics-labs-imaging.md" } 

            },{

              id: slugify("Abbott Approved Abbreviations Neurologic & Trauma"), title: "Neurologic & Trauma", 

              type: "topic", 

              details: { mdPath: "Content/Abbreviations & References/abbott-approved-abbreviations-neurologic-trauma.md" } 

            },{

              id: slugify("Abbott Approved Abbreviations Operations & Agencies"), title: "Operations & Agencies", 

              type: "topic", 

              details: { mdPath: "Content/Abbreviations & References/abbott-approved-abbreviations-operations-agencies.md" } 

            }

          ]

        },{ 

          id: slugify("Other Abbreviations"), title: "Other Abbreviations", 

          type: "topic", 

          details: { mdPath: "Content/Abbreviations & References/other-abbreviations.md" } 

        }

      ]

    },

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
          type: "topic",
          details: { mdPath: "Content/Administrative & Legal Essentials/applicability-of-the-cog.md" } 
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
    }
];

