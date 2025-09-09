// Attach medication details to the global scope so main.js can access them
export const MedicationDetailsData = [
    {
        id: '10-calcium-chloride', title: '10% Calcium Chloride',
        concentration: '(1,000mg/10ml)',
        "class": 'Electrolyte',
        indications: ['Hyperkalemia', 'Symptomatic [DEC]HR', 'Toxic Ingestion'], // Changed 'Symptomatic [INC]HR' to 'Symptomatic [DEC]HR' (corrected indication)  // confirm change with protocols
        contraindications: ['Known hypersensitivity', 'Digitalis toxicity'],
        precautions: 'Rx slowly unless: Cardiac Arrest.',
        sideEffects: ['[DEC]HR','VF','Extravasation Necrosis','Abdominal Pain', 'N/V'],
        adultRx: ['[[Mg OD|from Bronchospasm in Eclampsia]] Rx: 1g IV','Hyperkalemia Rx: 1g IVP/IO', 'Calcium channel blocker OD Rx: Consult to give 1g IVP/IO'], // Replaced missing text placeholder with Calcium channel blocker OD info   // make to to confirm with protocols
        pediatricRx: ['{{red:Don’t give Calcium Chloride to Pediatric pts}}']
    },
    {
        id: '2-lidocaine-xylocaine', title: "2% Lidocaine (Xylocaine)",
        concentration: "(100mg/5ml)",
        "class": "Antiarrhythmic",
        indications: ["Symptomatic [INC]HR & VF/pVT"],
        contraindications: ["Hypersensitivity or local anesthetic allergy in the amide class", "AV block >1º in the absence of a pacemaker", "Idioventricular escape rhythm s̄ a pacemaker", "Stokes-Adams syndrome", "WPW syndrome"],
        precautions: "[[Give [DEC] Maintenance Infusions for:|Prolonged plasma half-life]] >70yo, CHF, or hepatic failure.\nDon’t Rx if idioventricular escape rhythm s̄ a pacemaker is present.",
        sideEffects: ["Drowsiness", "Paresthesia", "Slurred speech", "[[Nystagmus|early sign of toxicity]]", "[[Seizures|severe toxicity]]"],
        adultRx: ["VT Rx: 1-1.5mg/kg slow IVP over 2-3min,\n      If n/c p̄ 5min, [[then give 0.5-0.75mg/kg|Max = 3mg/kg]]", "P̄-ROSC Stabilization Rx: Consult to give 2mg/min IV maintenance infusion", "EZ-IO Rx: 2ml over 60-90sec\n      -> Flush c̅ 5-10ml NS rapidly over 5sec\n            -> Then give 1ml over 30sec"]
    },
    {
        id: '8-4-sodium-bicarbonate-nahco3', title: "8.4% Sodium Bicarbonate (NaHCO₃)",
        concentration: "(50mEq/50ml)",
        notes: ["***Given separately from other drugs***"],
        class: "[[Alkalizing|buffering]] agent",
        indications: ["[[Fall or Weakness|probably only for suspected hyperkalemia]]", "Hyperkalemia", "Symptomatic [INC]HR", "Toxic Ingestion"],
        contraindications: ["None absolute besides hypersensitivity"],
        precautions: "Bicarb precipitates/interacts c̅ multiple Rx’s – {{red:Don’t Mix}}.\nFlush IV line ā & p̄ administration.\nNeonates & children <2yo -> [[4.2% given slowly instead|Bicarb may cause tissue necrosis, ulceration, & sloughing]].",
        sideEffects: ["Metabolic alkalosis", "Paradoxical acidosis", "Exacerbation of HF", "Hypernatremia", "Hypokalemia", "Hypocalcemia"],
        adultRx: ["[[Dead + bed sores from immobility|Suggests Hyperkalemia]] Rx: Consult to give 1mEq/kg", "Hyperkalemia Rx: 50mEq IVP/IO", "[[RRWCT >5mm c̅ HR <150|Suggests Hyperkalemia]] Rx: 50mEq IVP\n      If QRS narrows -> give second dose", "Tricyclic OD c̅ wide QRS & [DEC]BP or pulseless Rx: [[Consult to give 1mEq/kg IVP|Several doses may be needed]]"],
        pediatricRx: ["{{redul:Neonates & Children <2yo = use 4.2% Bicarb given slowly}}", "Propranolol OD c̅ widened QRS Rx: Consult to give 1-2mEq/kg IV/IO bolus", "Tricyclic OD c̅ [DEC]BP or pulseless or wide QRS Rx: Consult to give 1-2mEq/kg IV/IO"]
    },
    {
        id: 'adenosine-adenocard', title: "Adenosine (Adenocard)",
        concentration: "(6mg/2ml)",
        class: "Antiarrhythmic",
        indications: ["SVT"],
        contraindications: ["Known hypersensitivity", "A-Fib associated  c̅  WPW Syndrome"],
        precautions: "Rx in a pt c̅ A-Fib & WPW may result in VF\nRx may induce Airway Hyperresponsiveness & should be used c̅ caution in pts c̅ [[RAD Hx|asthma]]",
        sideEffects: ["H/A", "Cx pn", "Flushing", "Dyspnea/Bronchoconstriction", "[DEC]HR", "AV block", "Sinus Pause/Asystole"],
        adultRx: ["SVT Rx: 6mg Fast IVP c̅ 10ml Flush\n      If n/c -> 12mg Fast IVP c̅ 10ml Flush\n            If n/c -> 12mg Fast IVP c̅ 10ml Flush\n                If n/c -> Consult to give 12mg Fast IVP during transport\n                [[Note:|n/c =Stable Pt & Rhythm is unchanged]]"]
    },
    {
        id: 'albuterol', title: "Albuterol",
        concentration: "(2.5mg/3cc)",
        class: "[[Beta adrenergic agonist|β₂-selective]] bronchodilator",
        indications: ["Bronchospasm"],
        contraindications: ["Known hypersensitivity"],
        precautions: "",
        sideEffects: ["[INC]HR", "Palpitations/cardiac ectopy", "Tremor", "H/A", "N/V"],
        adultRx: ["Bronchospasm Rx: 2.5mg in 3cc neb c̅ O₂ ≥6 LPM\n      Consult to repeat dose or give Duo-Neb", "Hyperkalemia Rx: 2.5mg neb given p̄ Ca & Bicarb"],
        pediatricRx: ["Bronchospasm Rx: 2.5mg neb c̅ O₂ ≥6 LPM\n      Consult to repeat dose"]
    },
    {
        id: 'asa', title: "ASA",
        concentration: "(81mg/tab)",
        class: "NSAID (analgesic/antipyretic, antiplatelet)",
        indications: ["MI or ACS"],
        contraindications: ["Known hypersensitivity", "Environmental hyperthermia", "[[Peptic ulcer disease|relative for cardiac indications]]", "Pediatric/adolescent (risk of Reye’s Syndrome)"],
        precautions: "[[Reye’s Syndrome S/S|CNS damage, liver injury, & [DEC]BGL]]",
        sideEffects: ["Gastritis", "N/V", "Upper GI bleeding", "[INC] Bleeding tendency"],
        adultRx: ["MI/ACS Rx: 324mg PO (chewed)"]
    },
    {
        id: 'atropine-sulfate', title: "Atropine Sulfate",
        concentration: "(1mg/10ml)",
        class: "[[Anticholinergic|specifically, antimuscarinic]]",
        indications: ["Symptomatic [DEC]HR", "Organophosphate poisoning"],
        contraindications: ["Known hypersensitivity", "[[Glaucoma|relative if life-threatening [DEC]HR]]"],
        precautions: "[[MI/Hypoxia Caution|Atropine increases myocardial O₂ demand]].\nRx should not delay external pacing for pts c̅ {{blackul:poor perfusion}}.\n[[Mobitz II|Atropine may be ineffective for 2º AV block Type II]] & [[new 3º block c̅ wide QRS|distal (infra-His) blocks]].\n[[Donor hearts|are denervated & not responsive to Atropine]]",
        sideEffects: ["Blurred vision (high doses)", "Confusion (high doses)", "[[[INC]HR|may worsen myocardial ischemia]]", "Acute angle closure [[glaucoma|relative]]"],
        adultRx: ["{{orange:If initial IV attempt is unsuccessful, Atropine may be given IO/IM}}", "Symptomatic [DEC]HR (with IV access) Rx: 1mg IVP/IO\n   If n/c p̄ 5min -> Repeat Rx", "[[SLUDGEM Pt S/S|Organophosphate poisoning]] Rx: 2mg IVP/IO", "Plant ingestion c̅ [DEC]HR Rx: Consult with Med Control to give 2mg IVP\n   -> Repeat dose prn"],
        pediatricRx: ["[[SLUDGEM Pt S/S|Organophosphate poisoning]] Rx: 0.05mg/kg IV or IM prn\n   -> Repeat dose prn", "Plant ingestion c̅ [DEC]HR Rx: Consult with Med Control for dosing:\n   <12yo = 0.02–0.05mg/kg IV/IO q̄ 20–30min until patient “dries up”\n   ≥12yo = 0.05mg/kg IV/IO q̄ 20–30min until patient “dries up”"]
    },
    {
        id: 'd5', title: "D5",
        concentration: "(5g/100ml bag)",
        class: "Carbohydrate",
        indications: ["[DEC]BGL/Insulin Shock"],
        contraindications: ["[[Avoid D5W c̅ [INC]ICP|General Dextrose precaution]]"],
        precautions: "Use D10% to Rx [DEC]BGL with AMS\nHigher dextrose concentrations = [[Hypertonic|which may cause extravasation and subsequently cause tissue injury]]\nā Rx -> Verify Patency & Function of IV-line\np̄ Rx -> Check BGL",
        sideEffects: ["Local skin irritation", "Thrombophlebitis", "[[Extravasation|c̅ subsequent tissue necrosis]]", "[INC]BGL", "Osmotic diuresis"],
        adultRx: ["[[D5 is primarily for IVFs|D10 is given for [DEC]BGL]]"]
    },
    {
        id: 'd10', title: "D10",
        concentration: "(25g/250ml bag)",
        class: "Carbohydrate",
        indications: ["[DEC]BGL/Insulin Shock"],
        contraindications: ["[[Avoid D5W c̅ [INC]ICP|General dextrose precaution]]"],
        precautions: "Use D10% to Rx [DEC]BGL with AMS.\nHigher dextrose concentrations are [[hypertonic|may cause extravasation and tissue injury]].\n**Ā Rx:** Verify IV patency/function.\n**P̄ Rx:** Recheck BGL.",
        sideEffects: ["Local irritation", "Thrombophlebitis", "[[Extravasation|c̅ tissue necrosis]]", "[INC]BGL", "Osmotic diuresis"],
        adultRx: ["Give D10 in 10g increments until BGL >100 mg/dL"]
    },
    {
        id: 'dexamethasone-decadron', title: "Dexamethasone (Decadron)",
        concentration: "(10mg/ml)",
        class: "Corticosteroid (anti-inflammatory)",
        indications: ["Anaphylaxis", "Bronchospasm"],
        contraindications: ["Known hypersensitivity"],
        precautions: "Give slowly.",
        sideEffects: ["Agitation", "Perineal/body burning sensation", "Pruritus", "N/V"],
        adultRx: ["Anaphylaxis: 10mg IV/IM/PO (oral dose has bitter taste)", "Bronchospasm: 10mg IVP or IM"],
        pediatricRx: ["Anaphylaxis: 0.6mg/kg IV/IM", "Bronchospasm: 0.6mg/kg IV/IM/PO"]
    },
    {
        id: 'diphenhydramine-benadryl', title: "Diphenhydramine (Benadryl)",
        concentration: "(50mg/ml)",
        class: "Antihistamine (H1)",
        indications: ["Allergic Reaction", "Anaphylaxis", "Toxic Ingestion (dystonic reactions)"], // Simplified phrasing for dystonic reactions indication
        contraindications: ["Known hypersensitivity", "Narrow angle glaucoma", "Prostatic hypertrophy or bladder neck obstruction"],
        precautions: "The drug of choice for anaphylaxis is Epi, not Benadryl",
        sideEffects: ["Sedation", "[DEC]BP (rare)", "May cause paradoxical excitation in young children"],
        adultRx: ["Intervention: Allergic RXN or c̅ Anaphylaxis p̄ Epi = 50mg IVP", "Continuity: Extrapyramidal RXN from Haldol use = 50mg IVP/IM"],
        pediatricRx: ["Intervention: Allergic RXN or c̅ Anaphylaxis p̄ Epi = 1mg/kg IVP", "Continuity: Extrapyramidal RXN from Haldol = 1mg/kg IV/IM/IO"] // Added missing space after 'Haldol' for consistency
    },
    {
        id: 'droperidol-inapsine', title: "Droperidol (Inapsine)",
        concentration: "(5mg/2ml)",
        class: "Sedative/Hypnotic/Antiemetic",
        indications: ["N/V", "Pain Management", "Violent/Agitated/ &/or Anxious pt"],
        contraindications: ["Known hypersensitivity", "SBP <100mmHg"],
        precautions: "(might need to do an EKG due to QT elongation)",
        sideEffects: ["Transient [DEC]BP", "Hyperactivity/Anxiety", "Neuroleptic Malignant Syndrome"],
        adultRx: ["Intervention: N/V = 1.25mg IV/IM -> Consultation for a 2nd dose*", "Intervention: H/A or abdominal pain = 2.5mg IV", "Intervention: RASS+1 = 5mg IM", "Intervention: RASS+2/3 = 10mg IM -> Repeat once prn p̄ 10min\n   >65yo = 5mg IM"],
        pediatricRx: ["Not approved for Pediatric Pts"]
    },
    {
        id: 'epi-1-1000-adrenaline', title: "Epi 1:1,000 (Adrenaline)", 
        concentration: "(10mg/10ml)",
        class: "Endogenous Catecholamine",
        indications: ["Anaphylaxis", "Bronchospasm"],
        contraindications: ["Known hypersensitivity"],
        sideEffects: ["Tachycardia and arrhythmias", "Myocardial ischemia/infarction", "HTN", "Tremor", "Anxiety", "H/A", "N/V"],
        adultRx: ["Intervention: Anaphylaxis = 0.5mg IM \n   n/c p̄ 5min -> Repeat once\n   Consultation -> May give 3rd dose 5min p̄ the 2nd dose", "Consultation: Bronchospasm c̅ severe asthmatics = 0.5mg IM"], // Added missing spaces around ':' and '='
        pediatricRx: ["Intervention: Anaphylaxis <10kg = 0.01mg/kg IM  (0.01ml/kg IM)\n   10-25kg = 0.15mg IM   (0.15ml IM)\n   25-60kg = 0.3mg IM   (0.3ml IM)\n   >60kg = 0.5mg IM   (0.5ml IM)", "*All weight classes: give prn every 5-15min   (max = 3 doses)", "Consultation -> Epi IV Infusion p̄ 3rd dose of Epi", "Consultation: Bronchospasm = 0.3mg IM (0.3ml IM)"] // Fixed typo 'does' to 'dose'
    },
    {
        id: 'epi-1-10000', title: "Epi 1:10,000", 
        concentration: "(1mg/10ml)",
        class: "Endogenous Catecholamine",
        indications: ["VF or pVT", "Symptomatic [DEC]HR", "Cardiogenic Shock", "Post-ROSC Stabilization"],
        contraindications: ["Known hypersensitivity", "≥ 50yo (asthma) - use 1:1,000 for bronchospasm"], // Clarified instruction for asthmatics ≥50yo (use 1:1,000 for bronchospasm)
        sideEffects: ["[INC]HR & arrhythmias", "Myocardial ischemia/infarction", "HTN", "Tremor", "Anxiety", "H/A", "N/V"],
        adultRx: ["Intervention: VF/VT 1mg IVP during CPR"],
        pediatricRx: ["Cardiogenic Shock/Post Arrest Stabilization PEDIATRIC p157 - epinephrine 1mcg/kg IO or IVP"] // where did this p157 come from?????
    },
    {
        id: 'epi-1-100000-push-dose-epi',  title: "Epi 1:100,000 \"Push-Dose Epi\"", 
        concentration: "(100mcg/10ml)",
        class: "Endogenous Catecholamine",
        indications: ["Symptomatic [DEC]HR", "Cardiogenic Shock", "Post-ROSC Stabilization"],
        contraindications: ["Known hypersensitivity", "≥ 50yo (asthma) - use 1:1,000 for bronchospasm"], // Clarified instruction for asthmatics ≥50yo (use 1:1,000 for bronchospasm)
        sideEffects: ["[INC]HR & arrhythmias", "Myocardial ischemia/infarction", "HTN", "Tremor", "Anxiety", "H/A", "N/V"],
        adultRx: ["Push-Dose Epi Preparation: \n   Waste 1ml from NS Flush \n   -> Draw 1ml Epi 1:10,000 into NS Flush \n   Concentration = 10mcg/ml & total Epi = 100mcg/Flush", "Epi Continuous Infusion: \n   Waste 10ml from 250ml NS bag \n   -> Add 10ml of 1:10,000 Epi into the NS bag \n   = 4mcg/ml Epi Concentration", "Epi Continuous Infusion Drip Rates c̅ 60-Drip (Micro-Drip):\n   2mcg/min = 1gtt/2sec\n   4mcg/min = 1gtt/sec\n   8mcg/min = 2gtts/sec\n   12mcg/min = 3gtts/sec\n   16mcg/min = 4gtts/sec", "Intervention: Symptomatic [DEC]HR (En route & s̄ hypovolemia) \n   = 10mcg IVP followed by 2mcg/min Infusion\n   Consultation: Titrate up by 2mcg/min q̄ min prn    Max = 16mcg/min", "Intervention: Cardiogenic Shock 10mcg IVP followed by \n   -> 2mcg/min Infusion -> Titrate up 2mcg/min q̄ min\n   Max = 10mcg/min     SBP Goal ≥90", "Intervention: Post-ROSC Stabilization Infused at 2mcg/min \n   -> Titrate up by 2mcg/min q̄ min    Max = 16mcg/min"],
        pediatricRx: ["Consultation: Cardiogenic Shock or Post-ROSC Stabilization\n   = 1mcg/kg IVP/IO  -> From Push-Dose Epi", "10kg child = 1ml    -> From Push-Dose Epi", "15kg child = 1.5ml   -> From Push-Dose Epi"] // Added missing space in 'Shock or'
    },
    {
        id: 'etomidate-amidate', title: "Etomidate (Amidate)",
        concentration: "(40mg/20ml)",
        class: "Sedative-hypnotic",
        indications: ["SAI"],
        contraindications: ["Known allergy or hypersensitivity"],
        sideEffects: ["Pain on injection (secondary to propylene glycol diluent, may be [DEC] by administering through a rapidly flowing IV placed in a large vein).", "Myoclonus (not of clinical significance), can be [DEC] or mitigated by the co-Rx of an opioid or benzodiazepine."],
        adultRx: ["Intervention: SAI for >10yo = 0.3mg/kg IVP      Max = 40mg"]
    },
    {
        id: 'fentanyl-sublimaze', title: "Fentanyl (Sublimaze)",
        concentration: "(100mcg/2ml)",
        class: "Synthetic opioid",
        indications: ["MI", "Pain Management", "Sickle Cell Crisis"],
        contraindications: ["Known hypersensitivity &  SBP <100"],
        precautions: "Fentanyl should be administered slowly.\nCareful monitoring (including the use of waveform capnography) is warranted when co-administering c̅ benzodiazepines or to pts who have consumed alcohol as these pts are at risk for ventilatory depression.", // Fixed hyphenation in 'co-administering'
        sideEffects: ["Respiratory depression", "[DEC]BP", "Cx Rigidity (Extremely rare c̅ Rapid Rx + Dose >5mcg/kg)"],
        adultRx: ["Intervention: MI/ACS 1mcg/kg slow over 3-5min IVP \n   -> Consultation needed for repeated doses", "Intervention: Pain 1mcg/kg slow IVP/IM/IN    Max = 150mcg", "Intervention: Sickle Cell Crisis 1mcg/kg slow IVP   Max = 150mcg"],
        pediatricRx: ["Intervention: Pain 0.5-1mcg/kg IV/IN     Max = 50mcg\n   -> Consultation needed for repeated doses", "Consultation: Sickle Cell Crisis 1mcg/kg slow IVP/SQ \n   Max = 50mcg"]
    },
    {
        id: 'ipratropium', title: "Ipratropium",
        concentration: "(0.5mg/3cc)",
        class: "Anticholinergic\nParasympatholytic used in the Tx of respiratory emergencies.\nCauses bronchodilation & dries Respiratory tract secretions.\nBlocks Acetylcholine. 15% of dose reaches lower airway.",
        indications: ["Bronchospasm"],
        contraindications: ["Known Hypersensitivity"],
        sideEffects: ["Palpitation", "Anxiety", "Dizziness", "H/A", "N/V"],
        adultRx: ["Continuity: Bronchospasm = 0.5mg or Duo-Neb"]
    },
    {
        id: 'ketamine-ketalar', title: "Ketamine (Ketalar)",
        concentration: "(500mg/5ml)",
        class: "Dissociative general anesthetic",
        indications: ["SAI", "Bronchospasm", "Pain Management", "Violent/Combative Pt"],
        contraindications: ["Cardiac ischemia/infarction or Hx of CAD (relative)", "Penetrating ocular injury", "Pt ≤ 3 months of age", "Schizophrenia"],
        precautions: "IV ketamine should be administered over 60sec\nWhen not used in conjunction c̅ a neuromuscular blocking agent, the most common respiratory side effect associated c̅ ketamine is laryngeal spasm. It is usually transitory and easily managed c̅ PPV.",
        sideEffects: ["Emergence reaction", "[INC]HR", "[DEC]BP/HTN", "Hypersalivation", "Laryngospasm", "[INC] Intraocular Pressure", "N/V", "Transient apnea (if given rapidly via IV route)"],
        adultRx: ["Intervention: Combative pt = 4mg/kg IM      >65yo = 2mg/kg IM\n   Max = 500mg IM       RASS score q̄ 5min", "Intervention: SAI/Bronchospasm = 2mg/kg IV/IO", "Intervention: Pain = 0.2mg/kg IV/IO      Max = 25mg"],
        pediatricRx: ["Intervention: Combative = 4mg/kg IM \n   Don’t exceed Entire Vial/Site", "Intervention: SAI/Bronchospasm = 2mg/kg IV/IO", "Intervention: SAI c̅ [DEC]BP s̄ Cardiogenic Shock = 1mg/kg IV", "Intervention: SAI c̅ suspected Cardiogenic Shock = 0.5mg/kg IV"]
    },
    {
        id: 'ketorolac-tromethamine-toradol', title: "Ketorolac Tromethamine (Toradol)",
        concentration: "(30mg/ml)",
        class: "NSAID",
        indications: ["Pain Control for pts >17yo"],
        contraindications: ["Known hypersensitivity", "Allergy to any NSAID (including ASA)", "Asthma", "Renal insufficiency", "Peptic ulcer disease or GI bleeding", "Pregnancy", "Hypovolemia", "Trauma other than isolated extremity trauma", "Anticipated major surgery (within 7 days)"],
        precautions: "Ketorolac Tx is not indicated for abdominal/chest pain.\n[DEC] By 50% in pts >65yo due to [DEC] Renal Function Concerns", // Replaced 'Cx' with 'chest' for clarity
        sideEffects: ["GI bleeding", "H/A", "Drowsiness", "Abdominal pain", "Dyspepsia"],
        adultRx: ["Intervention: For Pain = 15mg IV/IM       If >65yo = 7.5mg IV/IM \n   (Not for abdominal/chest pain)\n   May be given off-label with med control approval for <17yo"] // Replaced 'Chest' with 'chest' for consistency
    },
    {
        id: 'magnesium-sulfate-mgso4', title: "Magnesium sulfate (MgSO₄)",
        concentration: "(1g/2ml)",
        class: "Electrolyte",
        indications: ["Bronchospasm", "Childbirth", "Symptomatic [INC]HR"],
        contraindications: ["Known hypersensitivity"],
        precautions: "[DEC]BP, [DEC]HR, & Conduction issues may occur if given too fast.  \nRx c̅ caution c̅ [DEC]HR.\nToxicity is associated c̅ CNS & neuromuscular depression.\nA [DEC] in deep tendon reflexes (DTRs) = Early Toxicity sign & may indicate impending respiratory depression.\nCa⁺ reverses respiratory depression associated c̅ Mg toxicity.",
        sideEffects: ["[DEC]BP", "[DEC]HR/Conduction disturbance (Rx c̅ caution in pts c̅ [DEC]HR)", "Respiratory depression", "Flushing"],
        adultRx: ["Intervention: Bronchospasm -> for Severe Asthmatics or c̅ PMH of Intubation for asthma = 2g slow IV drip", "Slow IV Drip = 1gtt/(1-2sec) c̅ a 10-Drip Set & 250ml NS bag", "Intervention: Eclampsia = 4g  slow IVP over 3-5min c̅ NS \n   -> followed by IV piggyback Drip at 1-2g/hr", "IV piggyback Drip at 1-2g/hr = 0.7gtts/sec \n   or ≈ 2gtts/3sec c̅ a 10-Drip Set & 250ml NS bag", "Intervention: Torsades = 2g IV Infusion over 2min \n   -> Followed by 5mg/min Infusion", "2g IV Infusion over 2min = 1g in 10ml Flush over 1min \n   -> repeat once", "5mg/min Infusion = Mix 1g in c̅  250ml NS bag c̅ 60-Drip Micro Set \n   -> Ran at 1.25gtts/sec or 5gtts/4sec"],
        pediatricRx: ["Consultation: Bronchospasm -> For >2yo c̅ Severe Asthmatics \n   or c̅ PMH of Intubation for asthma \n   = 40mg/kg diluted c̅ NS to a concentration of 100mg/ml \n   -> Infuse over 20min c̅ rate <150mg/min       Max = 2g", "“Prepared Syringe” c̅ a concentration of 100mg/ml: \n   = Draw 10ml out of 250ml NS bag c̅ 10cc syringe \n   -> Waste 2ml from syringe \n   -> Draw up into the syringe 1g (2ml) of MgSO₄", "(Pediatric Weight (in kg))/2.5 = # of ml’s added \n   to our 250ml NS bag from our “prepared syringe”", "Run MgSO₄ Infused NS bag over 20min c̅  10-Drip Set at 2gtts/sec", "Note: 50kg Child = 2g MgSO₄ (our max dose) = 2 Vials of MgSO₄\n   25kg child = 1g MgSO₄ = 1 Vial of MgSO₄\n   Never exceed 3gtts/sec\n   Never exceed 2 Vials of our 1g/2ml MgSO₄"]
    },
    {
        id: 'metoprolol-tartrate-lopressor', title: "Metoprolol tartrate (Lopressor)",
        concentration: "(5mg/5ml)",
        class: "Beta antagonist (β1 selective)",
        indications: ["Symptomatic [INC]HR"],
        contraindications: ["Known hypersensitivity", "HR < 60", "AV block >1º s̄ a pacemaker", "SBP <100", "Acute decompensated heart failure"],
        sideEffects: ["[DEC]BP", "[DEC]HR", "AV block", "Dizziness", "Bronchospasm", "Heart failure"],
        adultRx: ["Intervention: A-Fib c̅ RVR or A-Flutter \n   = 0.15mg/kg  slow IVP  over 2min       Max = 10mg", "Consultation: Stable SVT \n   -> Discuss for use as an additionally used dose for SVT"]
    },
    {
        id: 'midazolam-versed', title: "Midazolam (Versed)",
        concentration: "(10mg/2ml)",
        class: "Benzo",
        indications: ["SAI", "Symptomatic [DEC]HR", "Seizure", "Symptomatic [INC]HR", "Vent Pt", "Violent/Combative Pt"],
        contraindications: ["Known hypersensitivity", "Hypotension (SBP <100 mmHg) (relative)", "Acute angle glaucoma (relative)"], // Marked hypotension as relative contraindication (fixed typo)
        precautions: "Respiratory Depression Risk c̅ Opioids, old age, or c̅ Respiratory Conditions. [DEC] Rx c̅ in these pts.\nRx c̅ a non-intubated pt -> Monitor the airway & ventilation \n   -> Use Capno.\n[DEC]BP may occur c̅ fast Rx to low volume pts, or to pts c̅ hemodynamic instability.",
        sideEffects: ["Respiratory depression", "[DEC]BP", "Confusion"],
        adultRx: ["Intervention: [DEC]HR c̅ [DEC]BP If -> Pacing Works + Uncomfortable pt \n   = 5mg  IV/IO", "Intervention: [INC]HR c̅ [DEC]BP = 5mg IV/IO ā Cardioversion  if  IV", "Intervention: Vent pt c̅ [DEC]BP = 5mg IV/IO", "Intervention: RASS +1 Adult ≤65yo = 0.02mg/kg IV\n   Single Max Dose = 2.5mg IV or 5mg IM", "Consultation: RASS+4 p̄ Ketamine or RASS+1 Adult ≤65yo \n   = 5mg IM", "Intervention: SAI = 2.5-5mg IV", "Intervention: Seizure = 10mg IM or 0.1mg/kg IV/IN \n   Max = 5mg IV & 10mg IM", "Intervention: Seizure from Organophosphate OD = 5mg IV/IN"],
        pediatricRx: ["Intervention: SAI = 0.1mg/kg IV       Max = 5mg", "Intervention: Seizure = 0.5mg/kg  IN \n   Initial Max = 10mg & Total Dose Max = 20mg\n   or 0.2mg/kg  IV/IO  c̅  Max = 5mg & prn until Total Max = 10mg IV", "Intervention: Seizure from Organophosphate OD \n   = 0.2mg/kg  IV/IO      Max = 5mg\n   or 0.5mg/kg  IN", "Intervention: RASS+3 “safety or [INC] physical restraint” \n   =   0.1-0.2mg/kg  IM        Max = 5mg  IM\n   or 0.05-0.1mg/kg  IV      Max = 10mg  IV\n   or    0.02mg/kg  IN        Max = 20mg  IN\n   prn until Max Dose is Reached"]
    },
    {
        id: 'morphine', title: "Morphine",
        concentration: "(4mg/2ml)",
        class: "",
        indications: [],
        contraindications: [],
        precautions: "",
        sideEffects: [],
        adultRx: ["Intervention: MI/ACS = 4mg  Slow IVP \n   Only if  Fentanyl  is unavailable or contraindicated", "Intervention: Pain = 2-4mg  IVP"],
        pediatricRx: ["Intervention: Pain = 0.1mg/kg  IV/SQ     Max = 4mg \n   -> Consult for further doses", "Consultation: Sickle Cell Crisis = 0.1mg/kg  IV/SQ    Max = 4mg"]
    },
    {
        id: 'naloxone-narcan', title: "Naloxone (Narcan)",
        concentration: "(2mg/2ml)",
        class: "",
        indications: [],
        contraindications: [],
        precautions: "",
        sideEffects: [],
        adultRx: ["Intervention: Coma/Opioid OD = 2mg  IM/IN \n   or 0.4mg  IVP"],
        pediatricRx: ["Intervention: AMS/Opioid OD = 0.1mg/kg  IV/IO/ETT/IM \n   Max = 2.0mg", "Continuity: Methadone OD = 0.2mg/kg       Max = 2.0mg"]
    },
    {
        id: 'ntg', title: "NTG",
        concentration: "(0.4mg/spray)",
        class: "Organic nitrate",
        indications: ["MI or ACS", "Pulmonary Edema"],
        contraindications: ["Known hypersensitivity", "SBP <100", "Recent use of a phosphodiesterase type 5 inhibitor (sildenafil [Viagra, Revatio] or vardenafil [Levitra] within 24 hours or tadalafil [Cialis, Adcirca]) within 36 hours.", "Right ventricular infarction (RVI)", "Tachycardia (HR>100) in the absence of HF (not universal)", "[INC]ICP"],
        precautions: "Pts c̅ RVI are preload sensitive & can develop severe [DEC]BP in response to Preload-reducing agents. If [DEC]BP develops following Rx -> IVF may be necessary.\nInferior STEMI -> Do right sided EKG to look for RVI evidence\nPts c̅ aortic stenosis are very preload dependent to maintain cardiac output. NTG c̅ aortic stenosis or murmur should be judicious & carefully titrated.",
        sideEffects: ["Hypotension", "H/A", "Tachycardia (reflex)", "Bradycardia", "[[Methemoglobinemia|long term effect & unlikely seen in EMS setting]]"], // Corrected spelling of 'Methemoglobinemia'
        adultRx: ["Don’t give if pt had Viagra/Cialis within the past 48hrs", "NTG is NOT contraindicated c̅ Inferior STEMI \n   -> Should the pt become profoundly Hypotensive\n   -> Infuse NS until BP >90", "Be cautious c̅ Aortic Stenosis or Murmurs", "Intervention: MI/ACS = 0.4mg SL q̄ 5min prn only if BP >100 \n   or  >110 if pt Never had NTG ā\n   Max = 3 doses", "Continuity: Repeat  q̄  5min  if -> SBP >100 & pain still present", "Intervention: Pulmonary Edema = 0.4mg  SL  if BP  >100\n   or  >120  if pt Never had NTG ā", "Intervention: Flash Pulm-Edema from Hypertensive Crisis  s̄  IV \n   = 0.4mg  SL", "Consultation: 0.8-1.2mg  SL & Inform Med-Control if no IV yet"]
    },
    {
        id: 'ondansetron-zofran', title: "Ondansetron (Zofran)",
        concentration: "(4mg/2ml)",
        class: "Antiemetic",
        indications: ["N/V"],
        contraindications: ["Known hypersensitivity", "Prolonged QTI (male >440 msec; female >450 msec) (relative)", "Pregnancy (1st trimester)"],
        precautions: "Use c̅ caution c̅ other agents that may cause QTI prolongation.",
        sideEffects: ["H/A (particularly in those prone to migraine headaches)", "QTI prolongation", "AV conduction disturbance (associated c̅ rapid Rx)", "Sedation", "Diarrhea", "Dry mouth", "Serotonin syndrome"],
        adultRx: ["Intervention: N/V = 4mg  IVP over  60sec"],
        pediatricRx: ["Intervention: N/V = 0.15mg/kg  IVP over 60sec     Max = 4mg", "Intervention: N/V s̄  IV ->  4-11yo = 4mg tab PO\n   ≥12yo = 8mg tab PO"]
    }
];

// Attach to window if in browser environment
// if (typeof window !== 'undefined') window.MedicationDetailsData = MedicationDetailsData;
