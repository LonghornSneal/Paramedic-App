// This data module holds detailed information for the ZOLL EMV731 ventilator and its

// associated subtopics.  Unlike MedicationDetailsData.js, which is tailored for

// pharmaceuticals, this module is intended for equipment-related content.  Each entry

// corresponds to a topic under the "Zoll EMV731" category defined in

// ParamedicCategoriesData.js.  The `id` values match the slugs used by the app so

// that the details can be looked up correctly.  The `class` field contains a

// descriptive overview of the corresponding section from the operator's manual, and

// the `indications` array summarises key points for quick reference.



export const VentilationDetailsData = [  // ---- Quick Vent Guide ----

  { id: 'zoll-quick-vent-zoll-setup', title: 'Zoll Set Up', quickVent: 'setup', equipment: true },

  { id: 'zoll-quick-vent-operational-notes', title: 'General Operational Notes', equipment: true, placeholder: true },

  { id: 'zoll-quick-vent-volume-mode', title: 'Volume Mode', equipment: true, placeholder: true },

  { id: 'zoll-quick-vent-pressure-mode', title: 'Pressure Mode', equipment: true, placeholder: true },

  { id: 'zoll-quick-vent-other-vent-alarms', title: 'Other Vent Alarms', equipment: true, placeholder: true },

  { id: 'zoll-quick-vent-cpap', title: 'CPAP', equipment: true, placeholder: true },

  { id: 'zoll-quick-vent-bi-level', title: 'Bi-Level', equipment: true, placeholder: true },

  { id: 'zoll-quick-vent-terms-settings', title: 'Terms & Settings', equipment: true, placeholder: true },

  { id: 'zoll-quick-vent-tidal-volume-calculator', title: 'Tidal Volume Calculator', quickVent: 'calculator', equipment: true },

  // ---- General Information children ----

  { id: 'zoll-emv731-general-information-purpose-manual', title: 'Purpose & Manual Use', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 7, mdPath: 'Content/Skills & Equipment/Zoll EMV731/general-information.md', cheat: [

    "Read warnings, verify manual revision, and run the self-test before patient use.",

    "Keep Chapter 7 handy for cleaning, battery care, and preventive maintenance steps.",

    "Escalate to ZOLL service if the self-test fails or accessories are missing."

  ] },

  { id: 'zoll-emv731-general-information-symbols', title: 'Symbols', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 8, mdPath: 'Content/Skills & Equipment/Zoll EMV731/general-information.md', cheat: [

    "Know chassis icons (power, accept, mute/cancel, Type BF, MRI, reuse warnings).",

    "Interpret GUI alarm bells, banners, leak compensation, O2, battery, and mute indicators.",

    "Pause if an icon is unfamiliar; review Chapter 1 symbol tables before proceeding."

  ] },

  { id: 'zoll-emv731-general-information-indications', title: 'Indications for Use', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 7, mdPath: 'Content/Skills & Equipment/Zoll EMV731/general-information.md', cheat: [

    "Ventilates infant through adult patients >=5 kg in acute or chronic respiratory failure.",

    "Approved for hospital, EMS, aeromedical, and CBRN missions when filtered.",

    "MRI use limited to MRI-conditional units with site-specific precautions."

  ] },

  { id: 'zoll-emv731-general-information-warnings', title: 'Warnings & Cautions', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 7, mdPath: 'Content/Skills & Equipment/Zoll EMV731/general-information.md', cheat: [

    "Qualified operators only; never modify the ventilator without authorization.",

    "Verify grounding before using external power; avoid USB connections during care.",

    "SpO2 is not an apnea monitor--manage motion, lighting, and dyshemoglobins."

  ] },

  { id: 'zoll-emv731-general-information-warranty', title: 'Warranty & Tracking', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 7, mdPath: 'Content/Skills & Equipment/Zoll EMV731/general-information.md', cheat: [

    "1-year device / 90-day battery warranty; consumables are excluded.",

    "Report receipt, loss, or transfer to ZOLL per 21 CFR 821 tracking rules.",

    "SMDA requires reporting device-related deaths, injuries, or malfunctions to ZOLL/FDA."

  ] },

  { id: 'zoll-emv731-general-information-contact', title: 'Contact Information', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 7, mdPath: 'Content/Skills & Equipment/Zoll EMV731/general-information.md', cheat: [

    "US support: 1-800-348-9011 / 1-978-421-9655 or techsupport@zoll.com.",

    "Have the serial number, issue summary, contact person, and purchase order ready.",

    "Obtain an SR number; ship with battery installed using protective packaging."

  ] },



  // ---- Product Overview children ----

  { id: 'zoll-emv731-product-overview-models', title: 'Models & Intended Use', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27, mdPath: 'Content/Skills & Equipment/Zoll EMV731/product-overview.md', cheat: [

    "AEV: ambulance-focused with AC, CPAP+PS, BiLevel modes.",

    "EMV+: multi-transport, full AC/SIMV/CPAP/BiLevel, rugged with MRI variant.",

    "Eagle II: intra-hospital mounts, shares EMV+ features and MRI option."

  ] },

  { id: 'zoll-emv731-product-overview-controls', title: 'Controls & Indicators', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27, mdPath: 'Content/Skills & Equipment/Zoll EMV731/product-overview.md', cheat: [

    "Power switch, parameter buttons, menu, and selection dial manage settings.",

    "Mute/Cancel silences alarms; Accept confirms entries; Manual Breath/P-plat button.",

    "Status LED array signals alarm priority (green/yellow/red)."

  ] },

  { id: 'zoll-emv731-product-overview-gui', title: 'GUI Overview', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27, mdPath: 'Content/Skills & Equipment/Zoll EMV731/product-overview.md', cheat: [

    "LCD splits into message/waveform window, parameter windows, icon bar, aux boxes.",

    "Waveform area shows airway pressure and pleth when sensor attached.",

    "Icons track ventilation mode, leak compensation, O2/battery status, alarms."

  ] },

  { id: 'zoll-emv731-product-overview-pneumatic', title: 'Pneumatic Design', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27, mdPath: 'Content/Skills & Equipment/Zoll EMV731/product-overview.md', cheat: [

    "Internal compressor blends ambient air and oxygen through a sealed path.",

    "Ventilator controls the exhalation valve to maintain PEEP.",

    "Transducers monitor airway, O2 supply, and barometric pressure."

  ] },

  { id: 'zoll-emv731-product-overview-fresh-gas', title: 'Fresh Gas Intake', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27, mdPath: 'Content/Skills & Equipment/Zoll EMV731/product-overview.md', cheat: [

    "Side intake feeds compressor and serves as anti-asphyxia valve.",

    "Supports particulate, bacterial/viral, or CBRN filters as mission dictates.",

    "O2 reservoir kit enables low-flow concentrator supplementation."

  ] },

  { id: 'zoll-emv731-product-overview-connector', title: 'Connector Panel', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27, mdPath: 'Content/Skills & Equipment/Zoll EMV731/product-overview.md', cheat: [

    "Top panel groups O2 inlet, gas output, external power, USB service, SpO2 jack.",

    "Fresh gas intake and status LEDs sit alongside connectors for quick scanning.",

    "Retain protective caps when ports are idle to prevent contamination."

  ] },

  { id: 'zoll-emv731-product-overview-circuits', title: 'Ventilator Circuits', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27, mdPath: 'Content/Skills & Equipment/Zoll EMV731/product-overview.md', cheat: [

    "Single-patient circuits (adult/pediatric & infant) in 6 ft and 12 ft lengths.",

    "Inspect daily; replace if damaged or contaminated; adjust for compressible volume.",

    "HMEs/HMEFs permitted--match device to patient size to avoid dead-space issues."

  ] },

  { id: 'zoll-emv731-product-overview-oximeter', title: 'Pulse Oximeter Module', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27, mdPath: 'Content/Skills & Equipment/Zoll EMV731/product-overview.md', cheat: [

    "Masimo SET module supports LNCS probes for infant through adult patients.",

    "Handles motion/low perfusion with alarms surfaced on the ventilator GUI.",

    "Route sensor cables to prevent tangles with other connectors."

  ] },

  { id: 'zoll-emv731-product-overview-power', title: 'Power Sources', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27, mdPath: 'Content/Skills & Equipment/Zoll EMV731/product-overview.md', cheat: [

    "Internal Li-ion battery delivers >10 hours at factory defaults with SpO2 running.",

    "Universal AC/DC supply (100-240 VAC, 50/60/400 Hz) outputs 24 V DC at 4.2 A.",

    "Use approved holder kits; disconnect external power if emergency shutdown required."

  ] },



  // ---- Setting Up children ----

  { id: 'zoll-emv731-setting-up-circuit', title: 'Circuit Attachment', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43, mdPath: 'Content/Skills & Equipment/Zoll EMV731/setting-up-ventilator.md', cheat: [

    "Attach corrugated hose, pressure line, and exhalation line; save the red gas-output cap.",

    "Match circuit size to patient; adjust tubing compliance for accessories.",

    "Inspect disposable circuits before use; replace damaged or contaminated sets."

  ] },

  { id: 'zoll-emv731-setting-up-hp-o2', title: 'High-Pressure O2 Connection', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43, mdPath: 'Content/Skills & Equipment/Zoll EMV731/setting-up-ventilator.md', cheat: [

    "Supplemental oxygen is optional; use only USP medical-grade sources.",

    "Secure cylinders and connect via the supplied DISS hose (green or white).",

    "Verify inlet pressure meets Chapter 2 specs before or during self-check."

  ] },

  { id: 'zoll-emv731-setting-up-filters', title: 'Filters & Accessories', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43, mdPath: 'Content/Skills & Equipment/Zoll EMV731/setting-up-ventilator.md', cheat: [

    "Inspect foam and disk intake filters; replace if dirty.",

    "Never block the fresh gas intake; it supports compressor air and patient fallback breathing.",

    "Add reservoir bag, bacterial/viral, or CBRN filters when mission environment requires."

  ] },

  { id: 'zoll-emv731-setting-up-power', title: 'Power Source Selection', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43, mdPath: 'Content/Skills & Equipment/Zoll EMV731/setting-up-ventilator.md', cheat: [

    "Internal Li-ion battery (>10 h at defaults) plus AC/DC or vehicle DC options.",

    "Ventilator prioritizes external power and charges the battery automatically.",

    "Remove external power immediately if the switch fails during shutdown."

  ] },

  { id: 'zoll-emv731-setting-up-power-on', title: 'Power On & Defaults', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43, mdPath: 'Content/Skills & Equipment/Zoll EMV731/setting-up-ventilator.md', cheat: [

    "Wait for self-check to complete before connecting the patient.",

    "Select Adult, Pediatric, Mask CPAP, Custom, or Last Settings from the Start Menu.",

    "Factory Adult default: Mode AC(V), BPM 12, I:E 1:3, VT 450, PEEP 5, PIP limit 35, FiO2 21."

  ] },

  { id: 'zoll-emv731-setting-up-mode', title: 'Mode Selection', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43, mdPath: 'Content/Skills & Equipment/Zoll EMV731/setting-up-ventilator.md', cheat: [

    "Modes: AC, SIMV (model dependent), CPAP, and BL.",

    "Use the Mode button and dial to select; confirm alarm and support settings after the change.",

    "NPPV transitions auto-adjust rise time and support--verify settings for infants and small children."

  ] },

  { id: 'zoll-emv731-setting-up-op-test', title: 'Operational Test', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43, mdPath: 'Content/Skills & Equipment/Zoll EMV731/setting-up-ventilator.md', cheat: [

    "Manual Breath should produce flow from the patient port.",

    "Occlusion must trigger HIGH AIRWAY PRESSURE and release must trigger PATIENT DISCONNECT.",

    "Remove and restore external power to confirm EXTERNAL POWER alarms; replace unit if any test fails."

  ] },

  { id: 'zoll-emv731-setting-up-oximeter', title: 'Attach Pulse Oximeter', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43, mdPath: 'Content/Skills & Equipment/Zoll EMV731/setting-up-ventilator.md', cheat: [

    "Plug the Masimo cable into the top-panel SpO2 connector; monitoring starts after a valid signal.",

    "Use approved LNCS probes and route the cable to avoid tangles.",

    "SpO2 integration is optional but feeds ventilator alarms for desaturation events."

  ] },

  { id: 'zoll-emv731-setting-up-connect', title: 'Connect Patient', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43, mdPath: 'Content/Skills & Equipment/Zoll EMV731/setting-up-ventilator.md', cheat: [

    "Detach any test lung and attach the patient interface only after the operational test passes.",

    "Verify ventilator parameters and alarms match the physician order before ventilation.",

    "Leave the service USB port unused during patient care."

  ] },

  // ---- Using children ----



  { id: 'zoll-emv731-using-interface', title: 'Interface & Parameter Windows', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57, mdPath: 'Content/Skills & Equipment/Zoll EMV731/using-ventilator.md', cheat: [



    "Stacked parameter windows show primary and secondary values with auxiliary boxes below.",



    "Single press selects the primary value; repeated presses cycle secondary values and alarm limits.",



    "Solid text denotes operator-set values; outlined text reflects patient measurements."



  ] },



  { id: 'zoll-emv731-using-change-values', title: 'Changing Parameter Values', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57, mdPath: 'Content/Skills & Equipment/Zoll EMV731/using-ventilator.md', cheat: [



    "Adjust from the Mode window upward so dependent settings update correctly.",



    "Turn the dial, press Accept to commit, and respond to popups for out-of-range selections.",



    "Reset high and low alarm limits to bracket every new value."



  ] },



  { id: 'zoll-emv731-using-mode-ac', title: 'Ventilation Modes (AC)', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57, mdPath: 'Content/Skills & Equipment/Zoll EMV731/using-ventilator.md', cheat: [



    "AC delivers controlled or assisted breaths using the chosen volume or pressure target.",



    "Set BPM, VT or PIP, and PEEP before connecting the patient; confirm trigger sensitivity.",



    "Use AC when patients need guaranteed support but can trigger assisted breaths."



  ] },



  { id: 'zoll-emv731-using-mode-simv', title: 'Ventilation Modes (SIMV)', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57, mdPath: 'Content/Skills & Equipment/Zoll EMV731/using-ventilator.md', cheat: [



    "SIMV blends mandatory breaths with spontaneous demand flow or pressure-supported breaths.",



    "Verify Pressure Support configuration and model availability before deployment.",



    "Ideal when patients can breathe between set-rate breaths but still need backup ventilation."



  ] },



  { id: 'zoll-emv731-using-mode-cpap', title: 'Ventilation Modes (CPAP)', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57, mdPath: 'Content/Skills & Equipment/Zoll EMV731/using-ventilator.md', cheat: [



    "CPAP maintains continuous positive airway pressure for spontaneous breathers.",



    "Configure backup parameters and Pressure Support to match the clinical order.",



    "Confirm NPPV warnings and head-with-mask icon before connecting the patient."



  ] },



  { id: 'zoll-emv731-using-mode-bilevel', title: 'Ventilation Modes (Bi-Level)', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57, mdPath: 'Content/Skills & Equipment/Zoll EMV731/using-ventilator.md', cheat: [



    "Bi-Level alternates IPAP and EPAP to support spontaneous breathing.",



    "Mode transitions auto-adjust rise time and limits; verify them, especially for pediatrics.",



    "Adjust pressure support and alarms to maintain comfort and safety."



  ] },



  { id: 'zoll-emv731-using-breath-target', title: 'Breath Target (V/P)', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57, mdPath: 'Content/Skills & Equipment/Zoll EMV731/using-ventilator.md', cheat: [



    "Mode button toggles between volume (V) and pressure (P) targeting.",



    "Target choice changes which parameters appear in BPM, VT, and PIP windows.",



    "Update compliance settings and alarms when switching targets."



  ] },



  { id: 'zoll-emv731-using-oximeter', title: 'Pulse Oximeter Use', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57, mdPath: 'Content/Skills & Equipment/Zoll EMV731/using-ventilator.md', cheat: [



    "SpO2 window leaves stby after roughly 10 seconds of valid signal.",



    "Use approved LNCS probes and secure the cable to prevent disconnections.",



    "Watch the alarm banner for desaturation or low-perfusion alerts."



  ] },



  { id: 'zoll-emv731-using-popups', title: 'Pop Up Messages', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57, mdPath: 'Content/Skills & Equipment/Zoll EMV731/using-ventilator.md', cheat: [



    "Popups confirm atypical changes or relay informational guidance.",



    "Accept commits the new value; Cancel restores the previous setting.",



    "Startup provides a 120-second alarm mute so you can finish configuring parameters."



  ] },



  { id: 'zoll-emv731-using-manage-alarms', title: 'Managing Alarms', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57, mdPath: 'Content/Skills & Equipment/Zoll EMV731/using-ventilator.md', cheat: [



    "Alarm Message Center lists active alarms with mitigation tips.",



    "Mute/Cancel silences audibles while you correct the problem and acknowledge prompts.",



    "In NPPV modes the head-with-mask icon disappears during alarms and returns once cleared."



  ] },





// ---- Alarms children ----


  { id: 'zoll-emv731-alarms-overview', title: 'Alarm Overview', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81, mdPath: 'Content/Skills & Equipment/Zoll EMV731/alarms.md', cheat: [
    "Smart Help lists alarms in order of patient risk; confirm the patient before you mute anything.",
    "Monitoring spans patient status, ventilator hardware, and ambient conditions so critical faults surface quickly."
  ] },

  { id: 'zoll-emv731-alarms-amc', title: 'Alarm Message Center (AMC)', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81, mdPath: 'Content/Skills & Equipment/Zoll EMV731/alarms.md', cheat: [
    "The upper-left Alarm Message Center lists the active alarm, prioritized fixes, and a bold backup instruction.",
    "Turn the control dial through the bell icons to review every alarm, check the waveform icon, and share the 4-digit service code when escalating."
  ] },

  { id: 'zoll-emv731-alarms-priorities', title: 'Alarm Priorities', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81, mdPath: 'Content/Skills & Equipment/Zoll EMV731/alarms.md', cheat: [
    "High priority alarms mean ventilation is no longer reliable; switch to manual support and troubleshoot immediately.",
    "Medium alarms re-sound three seconds after muting if the fault persists, while low alarms keep the yellow LED lit until resolved."
  ] },

  { id: 'zoll-emv731-alarms-icons', title: 'Alarm Icons & Service Codes', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81, mdPath: 'Content/Skills & Equipment/Zoll EMV731/alarms.md', cheat: [
    "The solid bell marks the alarm you are viewing; outlined bells flag additional active events.",
    "Priority triangles mirror low (yellow), medium (orange), and high (red) status, and service codes starting with 1/2/3 match that severity."
  ] },

  { id: 'zoll-emv731-alarms-muting', title: 'Muting Alarms', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81, mdPath: 'Content/Skills & Equipment/Zoll EMV731/alarms.md', cheat: [
    "Mute provides a 30-second pause for most alarms, but high priority tones ignore it.",
    "Use preemptive and startup mutes to prevent nuisance noise, yet finish the task quickly so monitoring stays active."
  ] },

  { id: 'zoll-emv731-alarms-types-patient', title: 'Alarm Types: Patient Safety', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81, mdPath: 'Content/Skills & Equipment/Zoll EMV731/alarms.md', cheat: [
    "Patient safety alarms highlight airway pressure shifts, disconnects, leaks, AutoPEEP, and monitored vitals; start by checking the patient and circuit.",
    "Apnea or insufficient-flow alerts demand trigger, sedation, and backup-rate checks to keep ventilation safe."
  ] },

  { id: 'zoll-emv731-alarms-types-environment', title: 'Alarm Types: Environment', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81, mdPath: 'Content/Skills & Equipment/Zoll EMV731/alarms.md', cheat: [
    "Environment alarms warn about power, battery, oxygen supply, and gas intake issues; stabilize these resources before they fail.",
    "Ambient pressure or temperature alerts signal that operating conditions are outside the ventilator's certified range."
  ] },

  { id: 'zoll-emv731-alarms-types-selfcheck', title: 'Alarm Types: Self Check', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81, mdPath: 'Content/Skills & Equipment/Zoll EMV731/alarms.md', cheat: [
    "Self Check alarms report internal communication, pneumatic sensor, or power module faults; plan to swap ventilators and notify maintenance.",
    "Document the 4-digit service code so biomedical support can target the failing subsystem."
  ] },

  { id: 'zoll-emv731-alarms-groups', title: 'Alarm Groups', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81, mdPath: 'Content/Skills & Equipment/Zoll EMV731/alarms.md', cheat: [
    "Alarm groups cluster alerts into Patient Safety, Environment, and Self Check so crews can jump to the right troubleshooting table.",
    "Use the group label to align the on-screen Smart Help guidance with the reference material."
  ] },

  { id: 'zoll-emv731-alarms-popups', title: 'Pop Up Messages', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81, mdPath: 'Content/Skills & Equipment/Zoll EMV731/alarms.md', cheat: [
    "Pop ups halt out-of-range changes, explain the limit, and require Accept before the ventilator applies the new setting.",
    "Some confirmations temporarily disable related alarms; complete the steps so full monitoring resumes."
  ] },



  // ---- Operating Environments children ----

  { id: 'zoll-emv731-operating-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 113, mdPath: 'Content/Skills & Equipment/Zoll EMV731/operating-environments.md' },

  { id: 'zoll-emv731-operating-conditions', title: 'Environmental Conditions', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 113, mdPath: 'Content/Skills & Equipment/Zoll EMV731/operating-environments.md', sectionTitle: 'Environmental Conditions', cheat: [
    'Low-priority environment advisories flag hot, cold, or altitude extremes; confirm patient status and adjust compliance as needed. (Rev. P, Chapter 6-1 through 6-3)',
    'Shield the Fresh Gas intake with the soft case and a disposable B/V filter in dust, rain, or snow; swap the filter before it clogs. (Rev. P, Chapter 6-1 through 6-2)',
    'Above 25,000 ft the controller stops compensating; trim delivered volume/pressure and restore baseline once the cabin returns to range. (Rev. P, Chapter 6-3)'
  ] },

  { id: 'zoll-emv731-operating-transport', title: 'Transport Use', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 113, mdPath: 'Content/Skills & Equipment/Zoll EMV731/operating-environments.md', sectionTitle: 'Transport Use', cheat: [
    'Secure the ventilator with ZOLL-approved mounts (carry case, CCLAW litter bracket, roll stand) before moving the patient. (Rev. P, Chapters 2-2 and 6-7; Appendix B)',
    'Plan each power handoff; confirm vehicle or facility power quality and use the internal battery or a UPS to bridge unstable mains. (Rev. P, Appendix A)',
    'Watch altitude advisories in flight and adjust tidal volume or switch to pressure targets if the cabin exceeds 25,000 ft. (Rev. P, Chapter 6-3)'
  ] },

  { id: 'zoll-emv731-operating-noise', title: 'High Noise Environments', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 85, mdPath: 'Content/Skills & Equipment/Zoll EMV731/operating-environments.md', sectionTitle: 'High Noise Environments', cheat: [
    'Use the 30-second pre-emptive mute before suctioning or disconnects so Smart Help guidance stays readable. (Rev. P, Chapter 5-5)',
    'Startup mute buys two minutes to configure, but high-priority alarms still break through and must be addressed immediately. (Rev. P, Chapter 5-5)',
    'In loud cabins press Mute while troubleshooting; otherwise the alarm retriggers each breath and cancels parameter edits. (Rev. P, Chapter 5-5)'
  ] },

  { id: 'zoll-emv731-operating-emc', title: 'EMC & Safety', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 134, mdPath: 'Content/Skills & Equipment/Zoll EMV731/operating-environments.md', sectionTitle: 'EMC & Safety', cheat: [
    'Run the ventilator on Class A power only and use the internal battery or a UPS to bridge voltage dips. (Rev. P, Appendix A-2 through A-4)',
    'Maintain RF separation-about 0.6 m for 1 W portables and 3.6 m for 10 W sets-and reposition radios if Smart Help flags interference. (Rev. P, Appendix A-5)',
    'Keep humidity above 30% on synthetic floors and watch status indicators whenever RF emitters operate nearby. (Rev. P, Appendix A-5 through A-6)'
  ] },



  // ---- Maintenance children ----

  { id: 'zoll-emv731-maintenance-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 121, mdPath: 'Content/Skills & Equipment/Zoll EMV731/maintenance.md' },

  { id: 'zoll-emv731-maintenance-pm', title: 'Preventive Maintenance', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 121, mdPath: 'Content/Skills & Equipment/Zoll EMV731/maintenance.md', sectionTitle: 'Preventive Maintenance', cheat: [
    'Log visual inspections each shift and treat the PM Due Smart Help reminder as an immediate cue to schedule calibration. (Rev. P, Chapter 7-1 through 7-3)',
    'Only ZOLL technicians recalibrate via the RCS system; shorten the interval after heavy deployments and record results locally. (Rev. P, Chapter 7-3)',
    'After long storage, warm the unit to the operating range, run the Operational Test, and recharge before patient use. (Rev. P, Chapter 7-1)'
  ] },

  { id: 'zoll-emv731-maintenance-filters', title: 'Filter Maintenance', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 121, mdPath: 'Content/Skills & Equipment/Zoll EMV731/maintenance.md', sectionTitle: 'Filter Maintenance', cheat: [
    'Power down, remove the foam prefilter with hemostats, and discard it; never rinse or reuse. (Rev. P, Chapter 7-3)',
    'If debris persists, open the compressor inlet fitting, swap the disk filter, and reinstall the gasket before tightening the screws. (Rev. P, Chapter 7-3 through 7-4)',
    'Never run the compressor without filters in place; contamination forces depot-level cleaning. (Rev. P, Chapter 7-3)'
  ] },

  { id: 'zoll-emv731-maintenance-exhalation', title: 'Exhalation Valve Diaphragm', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 156, mdPath: 'Content/Skills & Equipment/Zoll EMV731/maintenance.md', sectionTitle: 'Exhalation Valve Diaphragm', cheat: [
    'Inspect the silicone diaphragm for kinks when valve alarms persist and relax folds with gentle opposing pressure. (Rev. P, Appendix D-11)',
    'Re-seat the diaphragm, orient the tubing barb with the FLOW arrow, and snap the cover fully closed. (Rev. P, Appendix D-11 through D-12)',
    'Test the circuit on a test lung after reassembly before reconnecting to the patient. (Rev. P, Appendix D-12)'
  ] },

  { id: 'zoll-emv731-maintenance-selftest', title: 'Self Test & Service', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 121, mdPath: 'Content/Skills & Equipment/Zoll EMV731/maintenance.md', sectionTitle: 'Self Test & Service', cheat: [
    'Let the ventilator finish its startup self check every cycle and honour Power Cycle Needed prompts to refresh flow calibration. (Rev. P, Chapter 7-1 through 7-8)',
    'If a self-check fault persists, remove the unit from service, capture the alarm code, and coordinate with ZOLL. (Rev. P, Chapter 7-8)',
    'Only ZOLL-certified technicians perform RCS calibration or internal repairs; field crews should not open the chassis. (Rev. P, Chapter 7-3 through 7-8)'
  ] },

  { id: 'zoll-emv731-maintenance-cleaning', title: 'Cleaning & Storage', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 121, mdPath: 'Content/Skills & Equipment/Zoll EMV731/maintenance.md', sectionTitle: 'Cleaning & Storage', cheat: [
    'Clean the housing with soapy water, then a 10% bleach wipe-down, and dry with lint-free cloths; never submerge the unit. (Rev. P, Chapter 7-2)',
    'After contaminated incidents follow the Incident Commander\'s PPE and decon guidance immediately. (Rev. P, Chapter 7-2 through 7-3)',
    'Store fully charged in a cool space and top off every 3 to 12 months depending on temperature; recharge before redeployment. (Rev. P, Chapter 7-5 through 7-7)'
  ] },



  // ---- Specifications children ----

  { id: 'zoll-emv731-specifications-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 131, mdPath: 'Content/Skills & Equipment/Zoll EMV731/specifications.md' },

  { id: 'zoll-emv731-specifications-ranges', title: 'Operating Ranges', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 131, mdPath: 'Content/Skills & Equipment/Zoll EMV731/specifications.md', sectionTitle: 'Operating Ranges', cheat: [
    'Ventilator supports 1-80 BPM mandatory rates (reports up to 90 BPM) and flows up to 100 LPM at 40 cm H2O. (Rev. P, Appendix A-1)',
    'Tidal volume programs from 50 to 2000 mL in 10 mL steps-check lung mechanics before approaching the extremes. (Rev. P, Appendix A-1)',
    'Pressure window spans PIP 10-80 cm H2O and PEEP/EPAP 0-30 cm H2O, with FiO2 control from 21% to 100%. (Rev. P, Appendix A-2)'
  ] },

  { id: 'zoll-emv731-specifications-resolution', title: 'Measurement Resolution & Tolerances', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 131, mdPath: 'Content/Skills & Equipment/Zoll EMV731/specifications.md', sectionTitle: 'Measurement Resolution & Tolerances', cheat: [
    'Rate commands resolve to whole breaths with +/-1 BPM accuracy; inspiratory time adjusts in 0.05 s steps. (Rev. P, Appendix A-1)',
    'Tidal volume accuracy is +/-(5 mL + 10% of the set value)-verify with a test lung after circuit or altitude changes. (Rev. P, Appendix A-1)',
    'Pressure readings (PIP, PEEP/EPAP, MAP) stay within +/-(2 cm H2O + 8%); larger drift signals maintenance. (Rev. P, Appendix A-2)'
  ] },

  { id: 'zoll-emv731-specifications-o2', title: 'Oxygen Input Pressure', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 131, mdPath: 'Content/Skills & Equipment/Zoll EMV731/specifications.md', sectionTitle: 'Oxygen Input Pressure', cheat: [
    'Designed for regulated 55 psig medical oxygen through the DISS inlet-match hoses and regulators to that spec. (Rev. P, Appendix A-2)',
    'Low or high supply alarms fire when pressure drifts outside roughly 40-87 psig; be ready to revert to compressor-only ventilation. (Rev. P, Chapter 3-3)',
    'Cap or filter the inlet during transport to keep debris out of the closed pneumatic path. (Rev. P, Chapter 6-1)'
  ] },



  // ---- Accessories children ----

  { id: 'zoll-emv731-accessories-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139, mdPath: 'Content/Skills & Equipment/Zoll EMV731/accessories.md' },

  { id: 'zoll-emv731-accessories-power', title: 'Power Supplies & Cables', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139, mdPath: 'Content/Skills & Equipment/Zoll EMV731/accessories.md', sectionTitle: 'Power Supplies & Cables', cheat: [
    'Carry an AC/DC brick (024-0012-00) plus the correct regional cord so the ventilator can charge on any mains circuit. (Rev. P, Appendix B-1)',
    'Keep both vehicle cables on hand: 704-0EMV-05 for 28 VDC military power and 704-0EMV-06 for 12 VDC ambulance sockets. (Rev. P, Appendix B-2)',
    'Use hospital-grade extensions (704-0EMV-XX) or the NEMA-equipped 710-0731-01 when generator or distance demands it. (Rev. P, Appendix B-1)'
  ] },

  { id: 'zoll-emv731-accessories-battery', title: 'Battery Packs', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139, mdPath: 'Content/Skills & Equipment/Zoll EMV731/accessories.md', sectionTitle: 'Battery Packs', cheat: [
    '6800 mAh replacement pack (703-0731-01) matches the ventilator runtime; rotate through charge cycles to keep spares warm. (Rev. P, Appendix B-1)',
    'Only ZOLL service centers swap internal batteries-flag packs that hit drop limits so they can be shipped under lithium rules. (Rev. P, Appendix B-2)'
  ] },

  { id: 'zoll-emv731-accessories-cases', title: 'Carrying Cases', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139, mdPath: 'Content/Skills & Equipment/Zoll EMV731/accessories.md', sectionTitle: 'Carrying Cases', cheat: [
    'Keep the padded carry case (402-0032-00) with rain flap ready for routine transports. (Rev. P, Appendix B-1)',
    'Match transit cases (703-0731-03 through 703-0731-15) to mission needs-bulkhead power, USB pass-through, wheels, or pull handles. (Rev. P, Appendix B-3)'
  ] },

  { id: 'zoll-emv731-accessories-filters', title: 'Filters & HMEs', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139, mdPath: 'Content/Skills & Equipment/Zoll EMV731/accessories.md', sectionTitle: 'Filters & HMEs', cheat: [
    'Stock B/V intake filters (465-0024-00) and the foam/disk replacements to protect the compressor. (Rev. P, Appendix B-1)',
    'Choose HME/HMEF cartridges sized for patient dead space (820-0108-00 through 820-0110-25). (Rev. P, Appendix B-1 through B-2)',
    'Carry MDI adapters (820-0111-00 adult, 820-0112-00 pediatric) when noninvasive inhaler support is expected. (Rev. P, Appendix B-2)'
  ] },

  { id: 'zoll-emv731-accessories-reservoir', title: 'Reservoir Kits', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139, mdPath: 'Content/Skills & Equipment/Zoll EMV731/accessories.md', sectionTitle: 'Reservoir Kits', cheat: [
    'Use the 3 L oxygen reservoir (704-0004-00) when supplementing low-flow concentrators or portable cylinders. (Rev. P, Appendix B-2)',
    'Pair the reservoir with the check valve kit (704-0700-01) to prevent backflow during source changes. (Rev. P, Appendix B-3)'
  ] },

  { id: 'zoll-emv731-accessories-country', title: 'Country Variations', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139, mdPath: 'Content/Skills & Equipment/Zoll EMV731/accessories.md', sectionTitle: 'Country Variations', cheat: [
    'IEC-to-country cordsets (708-0041-XX) match the ventilator power brick to local outlets-select the correct suffix before deployment. (Rev. P, Appendix B-1)',
    'Hospital-grade extensions (704-0EMV-XX) and specialty cords (708-0063-00, 708-0064-00) satisfy regional electrical codes. (Rev. P, Appendix B-2)'
  ] },



  // ---- Pulse Oximeter children ----

  { id: 'zoll-emv731-oximeter-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 143, mdPath: 'Content/Skills & Equipment/Zoll EMV731/pulse-oximeter-principles.md' },

  { id: 'zoll-emv731-oximeter-principles', title: 'Principles of Pulse Oximetry', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 143, mdPath: 'Content/Skills & Equipment/Zoll EMV731/pulse-oximeter-principles.md', sectionTitle: 'Principles of Pulse Oximetry', cheat: [
    'Sensors use red and infrared LEDs plus a photodiode to track arterial absorbance changes. (Rev. P, Appendix C-1)',
    'Plethysmography and spectrophotometry assumptions break down when venous pulsation dominates—watch placement. (Rev. P, Appendix C-1)',
    'Noise rejection is vital in transport; know how the algorithm distinguishes arterial from venous components. (Rev. P, Appendix C-1)'
  ] },

  { id: 'zoll-emv731-oximeter-traditional', title: 'Traditional Ratio Method', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 143, mdPath: 'Content/Skills & Equipment/Zoll EMV731/pulse-oximeter-principles.md', sectionTitle: 'Traditional Ratio Method', cheat: [
    'Calculates AC/DC ratios at 660 and 905 nm and forms R to lookup SpO2. (Rev. P, Appendix C-1)',
    'Relies on tables derived from healthy volunteer blood samples; motion error skews R. (Rev. P, Appendix C-1)',
    'Assumes all pulsatile signal is arterial—keep probes still and perfused to stay accurate. (Rev. P, Appendix C-1)'
  ] },

  { id: 'zoll-emv731-oximeter-masimo', title: 'Masimo SET Algorithm', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 143, mdPath: 'Content/Skills & Equipment/Zoll EMV731/pulse-oximeter-principles.md', sectionTitle: 'Masimo SET Algorithm', cheat: [
    'Treats measured signals as arterial plus noise, isolates the arterial component before computing R. (Rev. P, Appendix C-2)',
    'Sweeps possible saturations and picks the peak of the Discrete Saturation Transform curve. (Rev. P, Appendix C-2)',
    'Adaptive correlation cancelling suppresses venous and motion artifacts so SpO2 stays reliable in transport. (Rev. P, Appendix C-2)'
  ] },

  { id: 'zoll-emv731-oximeter-rate-noise', title: 'Update Rate & Noise Handling', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 143, mdPath: 'Content/Skills & Equipment/Zoll EMV731/pulse-oximeter-principles.md', sectionTitle: 'Update Rate & Noise Handling', cheat: [
    'Processes four seconds of data and refreshes SpO2 every two seconds; trends update quickly. (Rev. P, Appendix C-2)',
    'Noise reference N-prime is recalculated for each possible saturation to maximise signal-to-noise. (Rev. P, Appendix C-2)',
    'Motion tolerance comes from stripping venous noise before the final saturation output. (Rev. P, Appendix C-2)'
  ] },



  // ---- Patient Circuits children ----

  { id: 'zoll-emv731-circuits-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 145, mdPath: 'Content/Skills & Equipment/Zoll EMV731/patient-circuits.md' },

  { id: 'zoll-emv731-circuits-types', title: 'Circuit Types & Lengths', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 145, mdPath: 'Content/Skills & Equipment/Zoll EMV731/patient-circuits.md', sectionTitle: 'Circuit Types & Lengths', cheat: [
    '6 ft (820-0106-XX) and 12 ft (820-0130-XX) single-limb circuits are single-use and interface with the external exhalation valve. (Rev. P, Appendix D-1 through D-2)',
    'Supports tidal volumes from about 200 mL to full adult range; longer circuits add compressible volume. (Rev. P, Appendix D-1 through D-3)',
    'Monitor PEEP performance closely when using the 12 ft circuit with short expiratory times. (Rev. P, Appendix D-3)'
  ] },

  { id: 'zoll-emv731-circuits-specs', title: 'Technical Specifications', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 145, mdPath: 'Content/Skills & Equipment/Zoll EMV731/patient-circuits.md', sectionTitle: 'Technical Specifications', cheat: [
    '22 mm ID tubing with inspiratory resistance ~0.02 hPa/L/min and expiratory ~0.10 hPa/L/min at 30 LPM. (Rev. P, Appendix D-2)',
    'Compliance ~2.8 mL/hPa at 60 hPa and deadspace ~22 mL; max working pressure 100 hPa. (Rev. P, Appendix D-2)',
    'Operating temperature -40 C to 70 C, ISO 5367 compliant, not for heated humidification. (Rev. P, Appendix D-2)'
  ] },

  { id: 'zoll-emv731-circuits-directions', title: 'Directions for Use', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 145, mdPath: 'Content/Skills & Equipment/Zoll EMV731/patient-circuits.md', sectionTitle: 'Directions for Use', cheat: [
    'Attach inspiratory limb, pressure line, and exhalation drive line securely before connecting to the patient. (Rev. P, Appendix D-8 through D-10)',
    'Remove the pressure-line cuff if needed and seat it firmly on the transducer port. (Rev. P, Appendix D-9)',
    'Run the ventilator on a test lung to check for leaks or occlusions prior to patient use. (Rev. P, Appendix D-10)'
  ] },

  { id: 'zoll-emv731-circuits-troubleshooting', title: 'Troubleshooting', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 145, mdPath: 'Content/Skills & Equipment/Zoll EMV731/patient-circuits.md', sectionTitle: 'Troubleshooting', cheat: [
    'Disconnect, PEEP leak, or low pressure alarms usually trace to loose fittings or the exhalation valve. (Rev. P, Appendix D-11)',
    'Inspect and relax the silicone diaphragm, then reseat it and ensure the FLOW barb is oriented correctly. (Rev. P, Appendix D-11 through D-12)',
    'If the diaphragm is torn or leaks persist after reseating, replace the circuit and retest on a lung. (Rev. P, Appendix D-11)'
  ] },

  { id: 'zoll-emv731-circuits-warnings', title: 'Warnings & Notes', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 145, mdPath: 'Content/Skills & Equipment/Zoll EMV731/patient-circuits.md', sectionTitle: 'Warnings & Notes', cheat: [
    'Correct for circuit compressible volume in small adults/pediatrics to avoid under-ventilation. (Rev. P, Appendix D-3)',
    'Do not run PEEP below 5 cm H2O; the single-limb valve may not seal fast enough. (Rev. P, Appendix D-3)',
    'Dispose of circuits after single-patient use and handle as biohazard if contaminated. (Rev. P, Appendix D-2)'
  ] },

  {

    id: 'zoll-emv731-general-information',

    title: 'Zoll EMV731 - General Information',

    equipment: true,

    mdPath: 'Content/Skills & Equipment/Zoll EMV731/general-information.md',

    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf',

    pdfPage: 7,

    cheat: [

      "Read Warnings/Cautions thoroughly before use.",

      "Portable, rugged, full-featured ventilator for prehospital/transport.",

      "Keep product documentation current; check ZOLL website for updates.",

      "Symbols: understand alarm, mute/cancel, DC power, exhalation valve, O2 connector.",

      "If shipping damage or failed self-test: contact ZOLL support before use."

    ],

    class: `

This section introduces the ZOLL EMV731 ventilator and its operator's guide.  It

describes the ventilator as a small, durable, full-featured mechanical device

designed for use in hospitals as well as harsh and under-resourced environments.  The

operator's guide explains how to use and care for the ventilator safely and

effectively, listing symbols that appear on the device and in the manual, defining

important abbreviations, and presenting indications for ventilation and cardiopulmonary

resuscitation.  Additional content explains how to unpack and assemble the ventilator,

lists warnings and cautions, and provides information on warranty, FDA tracking

requirements and software licensing.  Contact details for ZOLL Medical Corporation

and instructions for obtaining manual updates are also included.

    `,

    indications: [

      "Introduces the ventilator and its operator's guide, including symbols, abbreviations and indications for use.",

      "Explains unpacking, assembly and important warnings/cautions.",

      "Provides warranty and service information, FDA tracking requirements and contact details for ZOLL support."

    ],

  },

  {

    id: 'zoll-emv731-product-overview',

    title: 'Zoll EMV731 - Product Overview',

    equipment: true,

    mdPath: 'Content/Skills & Equipment/Zoll EMV731/product-overview.md',

    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf',

    pdfPage: 27,

    cheat: [

      "Models: AEV, EMV+, Eagle II -- transport/hospital/prehospital.",

      "Rugged, lightweight; internal compressor, long-life battery, daylight-visible GUI.",

      "Ventilation modes: AC, SIMV, CPAP, Bi-Level; integrated SpO2.",

      "Know connector panel: fresh gas intake, power, patient circuit, exhalation valve.",

      "Understand GUI parameter windows and indicators before patient use."

    ],

    class: `

This overview summarises the available EMV731 models - AEV, EMV+ and Eagle II -

and their intended applications in prehospital, transport and hospital settings.  It

highlights common features such as a rugged lightweight design, internal compressor

with long-life battery, daylight-visible display, integrated pulse-oximetry and

efficient oxygen consumption.  The chapter outlines ventilation modes (Assist/Control,

SIMV, CPAP and Bi-Level), introduces controls and indicators, describes the GUI

display, and explains the pneumatic design, fresh gas intake, connector panel,

ventilator circuits, pulse oximeter and power sources.

    `,

    indications: [

      "Describes AEV, EMV+ and Eagle II models and their target environments.",

      "Highlights common features like rugged design, multiple ventilation modes, internal compressor, long battery life and integrated SpO2 monitoring.",

      "Introduces controls, display screen, pneumatic design, fresh gas intake, connector panel, circuits, oximeter and power sources."

    ],

  },

  {

    id: 'zoll-emv731-setting-up-the-ventilator',

    title: 'Zoll EMV731 - Setting Up the Ventilator',

    equipment: true,

    mdPath: 'Content/Skills & Equipment/Zoll EMV731/setting-up-ventilator.md',

    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf',

    pdfPage: 43,

    cheat: [

      "Never start ventilator with patient attached; be ready to bag.",

      "Attach circuit; optionally connect high-pressure O2; verify filters/accessories.",

      "Select power source; power on; choose startup defaults and mode.",

      "Perform operational test before connecting patient.",

      "Attach pulse-oximeter probe as required; confirm alarms and settings."

    ],

    class: `

This section provides step-by-step instructions for preparing the ventilator for use.

Key tasks include attaching the ventilator circuit, optionally connecting a high-pressure

oxygen supply, inspecting and attaching fresh-gas filters and accessories, selecting a

power source, powering on the unit, choosing start-up default values and an operating

mode, adjusting parameters and settings, performing an operational test, attaching the

pulse oximeter probe when required, and finally connecting the patient.  The chapter

emphasises safety by warning providers to be ready to manually ventilate the patient,

never to start the ventilator with the patient attached, and to choose the correct

circuit and attachments based on patient size and environment.  It also explains how

to connect the corrugated hose, pressure line and exhalation valve control line and

describes optional accessories such as oxygen reservoir bags and bacterial/viral or

chemical/biological filters.

    `,

    indications: [

      "Details the sequence of tasks to prepare the ventilator, from attaching the circuit and power source to performing an operational test and connecting the patient.",

      "Emphasises safety warnings: prepare to bag the patient, do not start the ventilator with the patient attached, and select appropriate circuits and attachments.",

      "Explains how to connect hoses and lines and describes optional accessories like oxygen reservoir bags and filters."

    ],

  },

  {

    id: 'zoll-emv731-using-the-ventilator',

    title: 'Zoll EMV731 - Using the Ventilator',

    equipment: true,

    mdPath: 'Content/Skills & Equipment/Zoll EMV731/using-ventilator.md',

    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf',

    pdfPage: 57,

    cheat: [

      "GUI shows parameter windows for Mode, BPM, VT, PIP, FIO2, SpO2, HR.",

      "Single press = primary; multiple = secondary/alarm; press/hold = context menu.",

      "Select breath target (V or P) as appropriate for patient/strategy.",

      "Pop Up protects against out-of-range settings -- read and confirm intentionally.",

      "Leak Compensation reduces nuisance alarms (Incomplete Exhalation/Insufficient Flow)."

    ],

    class: `

This chapter explains operation of the EMV731.  It describes the graphical user

interface with parameter windows for Mode, Breaths Per Minute (BPM), Tidal Volume

(VT), Peak Inspiratory Pressure (PIP), Fraction of Inspired Oxygen (FIO2), Oxygen

Saturation (SpO2) and Heart Rate (HR).  Instructions cover changing parameter values

using single, multiple or press-and-hold actions on the parameter buttons.  The

ventilation modes are defined - Assist/Control (AC), Synchronized Intermittent

Mandatory Ventilation (SIMV), Continuous Positive Airway Pressure (CPAP) and

Bi-Level (BL) - along with options for volume- or pressure-targeted breaths and leak

compensation.  Further sections discuss pop-up messages that warn when settings

exceed typical clinical ranges, integration of the pulse oximeter, and methods for

managing alarms and notifications.

    `,

    indications: [

      "Describes the ventilator's graphical interface and parameter windows for mode, BPM, VT, PIP, FIO2, SpO2 and HR.",

      "Explains how to change settings and defines ventilation modes (AC, SIMV, CPAP, BL) with volume- or pressure-targeted options and leak compensation.",

      "Discusses pop-up warnings, pulse-oximetry integration and management of alarms and messages."

    ],

  },

  {

    id: 'zoll-emv731-alarms',

    title: 'Zoll EMV731 - Alarms',

    equipment: true,

    mdPath: 'Content/Skills & Equipment/Zoll EMV731/alarms.md',

    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf',

    pdfPage: 81,

    cheat: [

      "Alarm Message Center (AMC) shows name, mitigation steps, if-not-resolved steps.",

      "High Priority: ventilation under user control not possible -- immediate action; cannot mute.",

      "Medium Priority: ventilation possible but failure exists -- mute 30s; fix cause.",

      "Low Priority: safe ventilation active; audible cancels with Mute; LED stays yellow if unresolved.",

      "Preemptive Mute for 30s before procedures that trigger alarms.",

      "Startup Mute: patient safety alarms suspended ~2 min during setup (exceptions apply).",

      "Multiple alarms: turn Dial to cycle; solid bell indicates alarm shown; max 6 without plot.",

      "Service codes (1###, 2###, 3###) map to priority; report when contacting support.",

      "Pop Up Messages protect from unsafe settings; read and act accordingly."

    ],

    class: `

This section details the ventilator's Smart Help alarm system.  The ventilator

continuously monitors patient status, device performance and environmental conditions.

When it detects a problem it raises an alarm and displays a Smart Help message in

the Alarm Message Center.  The alarm name, mitigation instructions and follow-up

guidance appear in priority order, with the most critical alarms shown first.  Alarms

are categorised as High Priority (mechanical ventilation impossible - immediate

intervention required), Medium Priority (ventilation possible but device fault - user

action needed) or Low Priority (advisory).  Icons indicate the number of active

alarms and their severity, and each alarm has a four-digit service code to aid

technical support.

    `,

    indications: [

      "Explains the Smart Help alarm system, which monitors patient, device and environment and displays context-specific messages.",

      "Defines High, Medium and Low priority alarms and provides mitigation and follow-up instructions for each.",

      "Describes alarm display elements including names, service codes, severity icons and indicators of multiple active alarms."

    ],

  },

  {

    id: 'zoll-emv731-operating-environments',

    title: 'Zoll EMV731 - Operating Environments',

    equipment: true,

    mdPath: 'Content/Skills & Equipment/Zoll EMV731/operating-environments.md',

    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf',

    pdfPage: 113,

    cheat: [

      "Confirm temperature, barometric pressure, and altitude are within device specs.",

      "Monitor device and ambient temperature; avoid overheating/condensation.",

      "Use appropriate power/O2 sources for the environment (field vs transport)."

    ],

    class: `

Guidelines in this chapter address operating the ventilator in environments outside

of the typical hospital setting.  For harsh prehospital and transport environments it

recommends using disposable bacterial/viral filters to protect internal components,

keeping the unit in its padded case and monitoring environmental conditions.  In

hazardous chemical or biological environments the chapter advises selecting

appropriate filters and attachments.  When using the ventilator in MRI suites it

explains how to safely position and operate the device.  It also discusses operating in

extreme temperatures and at altitude, including battery charging and discharging

limits (-25  deg C to 49  deg C), adjusting circuit compliance values, and determining when to

remove the unit from its padded case to improve cooling or keep it insulated.  The

ventilator is not intended for use in hyperbaric chambers.

    `,

    indications: [

      "Provides guidance for operating the ventilator in harsh, hazardous and MRI environments.",

      "Advises using filters and padded cases to protect the device in harsh settings and selecting appropriate accessories in chemical/biological environments.",

      "Discusses operating at extreme temperatures and altitudes, setting battery limits, adjusting compliance and noting that the ventilator is not for hyperbaric chambers."

    ],

  },

  {

    id: 'zoll-emv731-maintenance',

    title: 'Zoll EMV731 - Maintenance',

    equipment: true,

    mdPath: 'Content/Skills & Equipment/Zoll EMV731/maintenance.md',

    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf',

    pdfPage: 121,

    cheat: [

      "Follow preventive maintenance schedule; heed PM alarms.",

      "Inspect/replace filters and accessories per schedule; check exhalation valve diaphragm.",

      "If self-test fails or damage suspected: remove from service and contact support."

    ],

    class: `

This chapter outlines maintenance procedures to ensure the ventilator remains ready for

use.  It recommends regular inspection for cleanliness, damage and wear on the unit,

accessories, hoses, circuits, filters and power cables, replacing any worn or defective

components.  Cleaning instructions include keeping the ventilator clean, preventing

liquids from entering the unit, wiping with a damp soapy cloth or 10 % bleach

solution, avoiding abrasives or chlorinated solvents and thoroughly drying the unit.

Operators are warned never to use oil or grease with oxygen or compressed-gas

equipment.  The chapter also explains how to replace intake filters and notes that

preventive maintenance and annual calibration should be carried out by ZOLL-trained

personnel using the RCS system.

    `,

    indications: [

      "Advises regular inspection of the ventilator and accessories for cleanliness, damage and wear, with replacement of worn parts.",

      "Provides cleaning instructions using damp soapy cloths or a 10 % bleach solution and cautions against liquids, abrasives and chlorinated solvents.",

      "Describes replacing intake filters and performing preventative maintenance and calibration through ZOLL-trained personnel."

    ],

  },

  {

    id: 'zoll-emv731-specifications',

    title: 'Zoll EMV731 - Specifications',

    equipment: true,

    mdPath: 'Content/Skills & Equipment/Zoll EMV731/specifications.md',

    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf',

    pdfPage: 131,

    cheat: [

      "Know operational ranges: flow rate, BPM, VT, FIO2, PEEP/EPAP, PIP, pressure support.",

      "Max PIP ~80 cmH2O; pressure support up to 60 cmH2O; O2 input ~55 psig.",

      "Review measurement resolutions/tolerances; set alarms accordingly."

    ],

    class: `

This appendix summarises the ventilator's technical specifications.  It lists the

operating modes available on the EMV+ and Eagle II models (Assist/Control,

SIMV, CPAP with or without Pressure Support, Bi-Level with leak compensation) and on

the AEV model (Assist/Control, CPAP and Bi-Level with leak compensation).  The

operational ranges include flow rates up to 100 litres per minute, breath rates from 1

to 80 breaths per minute, tidal volumes from 50 to 2 000 millilitres, FIO2 from 21 % to

100 %, positive end expiratory pressure (PEEP/EPAP) from 0 to 30 cm H2O, peak

inspiratory pressures (PIP) from 10 to 80 cm H2O, pressure support up to 60 cm H2O

and an oxygen input pressure of 55 psig.  Measurement resolutions and tolerances

for parameters such as inspiratory time, tidal volume, FIO2, PIP and mean airway

pressure (MAP) are also provided.

    `,

    indications: [

      "Lists available ventilation modes for EMV+, Eagle II and AEV models.",

      "Provides operational ranges for flow rate, breath rate, tidal volume, FIO2, PEEP/EPAP, PIP and pressure support.",

      "Specifies measurement resolutions and tolerances for key parameters and notes the oxygen input pressure."

    ],

  },

  {

    id: 'zoll-emv731-accessories',

    title: 'Zoll EMV731 - Accessories',

    equipment: true,

    mdPath: 'Content/Skills & Equipment/Zoll EMV731/accessories.md',

    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf',

    pdfPage: 139,

    cheat: [

      "AC/DC supplies, region-specific power cords, battery packs/cables.",

      "Carrying cases, bacterial/viral filters, HMEs, compressor foam filters.",

      "O2 reservoir kits; part numbers vary by country -- confirm before ordering."

    ],

    class: `

This appendix enumerates accessories available for the ventilator, including AC/DC

power supplies, various power cords for different regions, battery packs, extension

cords, padded carrying cases, bacterial/viral filters, heat and moisture exchangers

for adult and pediatric use, disk filters, removable foam compressor filters, oxygen

reservoir kits and DC power cables.  Part numbers are provided for each item and

users are instructed to contact ZOLL or local distributors when ordering since some

part numbers vary by country.  The purpose of each accessory is explained, such as

providing power options, protecting the patient and device from contaminants and

ensuring appropriate circuit connections for different patient sizes.

    `,

    indications: [

      "Lists available accessories such as power supplies, battery packs, extension cords, carry cases, filters, HMEs and oxygen reservoir kits.",

      "Notes that part numbers and connector types vary by country and that some items are sold individually or in bulk.",

      "Explains the purpose of each accessory in supporting power, infection control and circuit connections."

    ],

  },

  {

    id: 'zoll-emv731-pulse-oximeter-principles',

    title: 'Zoll EMV731 - Pulse Oximeter Principles',

    equipment: true,

    mdPath: 'Content/Skills & Equipment/Zoll EMV731/pulse-oximeter-principles.md',

    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf',

    pdfPage: 143,

    cheat: [

      "SpO2 relies on differential absorption (red 660nm, IR 905nm) and pulsatile volume.",

      "Masimo SET separates arterial signal from noise (motion/low perfusion) for accuracy.",

      "SpO2 computed every ~2s via discrete saturation transform."

    ],

    class: `

This appendix explains the operating principles of the Masimo SET pulse oximeter used

with the ventilator.  Pulse oximetry relies on two phenomena: oxyhemoglobin and

deoxyhemoglobin absorb red and infrared light differently, and arterial blood volume

changes during each pulse.  Traditional oximeters calculate a ratio of the pulsatile

absorbance at two wavelengths (660 nm and 905 nm) to determine oxygen saturation

from a lookup table.  The Masimo SET algorithm improves on this by decomposing

the signals into arterial and noise components, recognising that arterio-venous

shunting introduces noise.  It applies an adaptive correlation canceller and a

discrete saturation transform across all possible saturation values to compute SpO2

every two seconds, enhancing accuracy in the presence of motion or low perfusion.

    `,

    indications: [

      "Describes the principles of pulse oximetry, including differential light absorption and pulsatile blood volume.",

      "Explains how traditional oximeters use a ratio of absorbance at two wavelengths to estimate saturation.",

      "Introduces the Masimo SET algorithm, which separates arterial signals from noise and computes SpO2 every two seconds using a discrete saturation transform."

    ],

  },

  {

    id: 'zoll-emv731-patient-circuits',

    title: 'Zoll EMV731 - Patient Circuits',

    equipment: true,

    mdPath: 'Content/Skills & Equipment/Zoll EMV731/patient-circuits.md',

    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf',

    pdfPage: 145,

    cheat: [

      "Choose correct single-limb Wye circuit (adult/ped/infant; 6 or 12 ft).",

      "Maintain PEEP >= 5 cmH2O; correct for compressible volume; beware long circuits.",

      "Inspect and reseat exhalation valve diaphragm if alarms occur; test with lung."

    ],

    class: `

This appendix describes the ventilator's patient circuits.  It covers single-limb,

Wye circuits for pediatric/adult patients in 6 ft and 12 ft lengths and for

infant/pediatric patients in 6 ft and 12 ft lengths.  Intended use information

explains that these circuits transfer gases to and from the patient and are not

designed for heated humidification.  Technical specifications include the internal

diameter, inspiratory and expiratory resistance, compliance (compressible volume),

deadspace, maximum working pressure and operating temperature range.  The circuits

comply with ISO 5367 and are single-patient use.  Directions for use detail how to

connect the inspiratory line, pressure line and exhalation valve line, verify

connections with a test lung and examine the circuit for damage before use.  A

troubleshooting section describes how to inspect and reseat the silicon diaphragm

in the exhalation valve when alarms occur.  Warnings emphasise the need to correct

for circuit compressible volume, maintain PEEP at or above 5 cm H2O and ensure that

longer circuits can trap PEEP in patients with short expiratory times.

    `,

    indications: [

      "Explains the intended use of single-limb Wye circuits for adult, pediatric and infant patients, noting they are single-use and not for heated humidification.",

      "Provides specifications such as internal diameter, resistance, compliance, deadspace, maximum working pressure and temperature range and notes compliance with ISO 5367.",

      "Offers directions for connecting the inspiratory, pressure and exhalation valve lines, troubleshooting the exhalation valve and warns about compressible volume and PEEP maintenance."

    ],

  },


  {

    id: 'zoll-emv731-original-documentation',

    title: 'Zoll EMV731 - Original Documentation',

    equipment: true,

    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf'

  },


];



// Default export for convenience

export default VentilationDetailsData;

/*

  Data/VentilationDetailsData.js

  Purpose: Static content map for ZOLL EMV731 equipment topics and Quick Vent Guide entries

  (including the Zoll Set Up and Tidal Volume Calculator topics). Used by the app to render

  details via Features/detail/DetailPage.js.



  Tests:

  - The Quick Vent topics are covered by E2E tests (ventilation.spec.js) that drive the UI and

    verify computed values and layout.

*/
