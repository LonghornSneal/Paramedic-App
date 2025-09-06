// This data module holds detailed information for the ZOLL EMV731 ventilator and its
// associated subtopics.  Unlike MedicationDetailsData.js, which is tailored for
// pharmaceuticals, this module is intended for equipment‑related content.  Each entry
// corresponds to a topic under the “Zoll EMV731” category defined in
// ParamedicCategoriesData.js.  The `id` values match the slugs used by the app so
// that the details can be looked up correctly.  The `class` field contains a
// descriptive overview of the corresponding section from the operator’s manual, and
// the `indications` array summarises key points for quick reference.

export const VentilationDetailsData = [
  {
    id: 'zoll-emv731-original-documentation',
    title: 'Zoll EMV731 - Original Documentation',
    equipment: true,
    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf'
  },
  // ---- Quick Vent Guide ----
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
  { id: 'zoll-emv731-general-information-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 7, mdPath: 'Content/Skills & Equipment/Zoll EMV731/general-information.md' },
  { id: 'zoll-emv731-general-information-purpose-manual', title: 'Purpose & Manual Use', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 7 },
  { id: 'zoll-emv731-general-information-symbols', title: 'Symbols', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 8 },
  { id: 'zoll-emv731-general-information-indications', title: 'Indications for Use', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 7 },
  { id: 'zoll-emv731-general-information-warnings', title: 'Warnings & Cautions', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 7 },
  { id: 'zoll-emv731-general-information-warranty', title: 'Warranty & Tracking', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 7 },
  { id: 'zoll-emv731-general-information-contact', title: 'Contact Information', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 7 },

  // ---- Product Overview children ----
  { id: 'zoll-emv731-product-overview-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27, mdPath: 'Content/Skills & Equipment/Zoll EMV731/product-overview.md' },
  { id: 'zoll-emv731-product-overview-models', title: 'Models & Intended Use', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27 },
  { id: 'zoll-emv731-product-overview-controls', title: 'Controls & Indicators', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27 },
  { id: 'zoll-emv731-product-overview-gui', title: 'GUI Overview', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27 },
  { id: 'zoll-emv731-product-overview-pneumatic', title: 'Pneumatic Design', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27 },
  { id: 'zoll-emv731-product-overview-fresh-gas', title: 'Fresh Gas Intake', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27 },
  { id: 'zoll-emv731-product-overview-connector', title: 'Connector Panel', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27 },
  { id: 'zoll-emv731-product-overview-circuits', title: 'Ventilator Circuits', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27 },
  { id: 'zoll-emv731-product-overview-oximeter', title: 'Pulse Oximeter Module', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27 },
  { id: 'zoll-emv731-product-overview-power', title: 'Power Sources', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 27 },

  // ---- Setting Up children ----
  { id: 'zoll-emv731-setting-up-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43, mdPath: 'Content/Skills & Equipment/Zoll EMV731/setting-up-ventilator.md' },
  { id: 'zoll-emv731-setting-up-circuit', title: 'Circuit Attachment', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43 },
  { id: 'zoll-emv731-setting-up-hp-o2', title: 'High-Pressure O₂ Connection', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43 },
  { id: 'zoll-emv731-setting-up-filters', title: 'Filters & Accessories', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43 },
  { id: 'zoll-emv731-setting-up-power', title: 'Power Source Selection', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43 },
  { id: 'zoll-emv731-setting-up-power-on', title: 'Power On & Defaults', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43 },
  { id: 'zoll-emv731-setting-up-mode', title: 'Mode Selection', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43 },
  { id: 'zoll-emv731-setting-up-op-test', title: 'Operational Test', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43 },
  { id: 'zoll-emv731-setting-up-oximeter', title: 'Attach Pulse Oximeter', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43 },
  { id: 'zoll-emv731-setting-up-connect', title: 'Connect Patient', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 43 },

  // ---- Using children ----
  { id: 'zoll-emv731-using-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57, mdPath: 'Content/Skills & Equipment/Zoll EMV731/using-ventilator.md' },
  { id: 'zoll-emv731-using-interface', title: 'Interface & Parameter Windows', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57 },
  { id: 'zoll-emv731-using-change-values', title: 'Changing Parameter Values', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57 },
  { id: 'zoll-emv731-using-mode-ac', title: 'Ventilation Modes (AC)', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57 },
  { id: 'zoll-emv731-using-mode-simv', title: 'Ventilation Modes (SIMV)', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57 },
  { id: 'zoll-emv731-using-mode-cpap', title: 'Ventilation Modes (CPAP)', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57 },
  { id: 'zoll-emv731-using-mode-bilevel', title: 'Ventilation Modes (Bi-Level)', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57 },
  { id: 'zoll-emv731-using-breath-target', title: 'Breath Target (V/P)', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57 },
  { id: 'zoll-emv731-using-oximeter', title: 'Pulse Oximeter Use', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57 },
  { id: 'zoll-emv731-using-popups', title: 'Pop Up Messages', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57 },
  { id: 'zoll-emv731-using-manage-alarms', title: 'Managing Alarms', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 57 },

  // ---- Alarms children ----
  { id: 'zoll-emv731-alarms-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81, mdPath: 'Content/Skills & Equipment/Zoll EMV731/alarms.md' },
  { id: 'zoll-emv731-alarms-overview', title: 'Alarm Overview', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81 },
  { id: 'zoll-emv731-alarms-amc', title: 'Alarm Message Center (AMC)', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81 },
  { id: 'zoll-emv731-alarms-priorities', title: 'Alarm Priorities', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81 },
  { id: 'zoll-emv731-alarms-icons', title: 'Alarm Icons & Service Codes', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81 },
  { id: 'zoll-emv731-alarms-muting', title: 'Muting Alarms', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81 },
  { id: 'zoll-emv731-alarms-types-patient', title: 'Alarm Types: Patient Safety', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81 },
  { id: 'zoll-emv731-alarms-types-environment', title: 'Alarm Types: Environment', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81 },
  { id: 'zoll-emv731-alarms-types-selfcheck', title: 'Alarm Types: Self Check', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81 },
  { id: 'zoll-emv731-alarms-groups', title: 'Alarm Groups', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81 },
  { id: 'zoll-emv731-alarms-popups', title: 'Pop Up Messages', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 81 },

  // ---- Operating Environments children ----
  { id: 'zoll-emv731-operating-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 113, mdPath: 'Content/Skills & Equipment/Zoll EMV731/operating-environments.md' },
  { id: 'zoll-emv731-operating-conditions', title: 'Environmental Conditions', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 113 },
  { id: 'zoll-emv731-operating-transport', title: 'Transport Use', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 113 },
  { id: 'zoll-emv731-operating-noise', title: 'High Noise Environments', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 113 },
  { id: 'zoll-emv731-operating-emc', title: 'EMC & Safety', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 113 },

  // ---- Maintenance children ----
  { id: 'zoll-emv731-maintenance-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 121, mdPath: 'Content/Skills & Equipment/Zoll EMV731/maintenance.md' },
  { id: 'zoll-emv731-maintenance-pm', title: 'Preventive Maintenance', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 121 },
  { id: 'zoll-emv731-maintenance-filters', title: 'Filter Maintenance', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 121 },
  { id: 'zoll-emv731-maintenance-exhalation', title: 'Exhalation Valve Diaphragm', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 121 },
  { id: 'zoll-emv731-maintenance-selftest', title: 'Self Test & Service', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 121 },
  { id: 'zoll-emv731-maintenance-cleaning', title: 'Cleaning & Storage', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 121 },

  // ---- Specifications children ----
  { id: 'zoll-emv731-specifications-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 131, mdPath: 'Content/Skills & Equipment/Zoll EMV731/specifications.md' },
  { id: 'zoll-emv731-specifications-ranges', title: 'Operating Ranges', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 131 },
  { id: 'zoll-emv731-specifications-resolution', title: 'Measurement Resolution & Tolerances', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 131 },
  { id: 'zoll-emv731-specifications-o2', title: 'Oxygen Input Pressure', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 131 },

  // ---- Accessories children ----
  { id: 'zoll-emv731-accessories-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139, mdPath: 'Content/Skills & Equipment/Zoll EMV731/accessories.md' },
  { id: 'zoll-emv731-accessories-power', title: 'Power Supplies & Cables', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139 },
  { id: 'zoll-emv731-accessories-battery', title: 'Battery Packs', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139 },
  { id: 'zoll-emv731-accessories-cases', title: 'Carrying Cases', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139 },
  { id: 'zoll-emv731-accessories-filters', title: 'Filters & HMEs', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139 },
  { id: 'zoll-emv731-accessories-reservoir', title: 'Reservoir Kits', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139 },
  { id: 'zoll-emv731-accessories-country', title: 'Country Variations', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 139 },

  // ---- Pulse Oximeter children ----
  { id: 'zoll-emv731-oximeter-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 143, mdPath: 'Content/Skills & Equipment/Zoll EMV731/pulse-oximeter-principles.md' },
  { id: 'zoll-emv731-oximeter-principles', title: 'Principles of Pulse Oximetry', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 143 },
  { id: 'zoll-emv731-oximeter-traditional', title: 'Traditional Ratio Method', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 143 },
  { id: 'zoll-emv731-oximeter-masimo', title: 'Masimo SET Algorithm', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 143 },
  { id: 'zoll-emv731-oximeter-rate-noise', title: 'Update Rate & Noise Handling', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 143 },

  // ---- Patient Circuits children ----
  { id: 'zoll-emv731-circuits-all', equipment: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 145, mdPath: 'Content/Skills & Equipment/Zoll EMV731/patient-circuits.md' },
  { id: 'zoll-emv731-circuits-types', title: 'Circuit Types & Lengths', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 145 },
  { id: 'zoll-emv731-circuits-specs', title: 'Technical Specifications', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 145 },
  { id: 'zoll-emv731-circuits-directions', title: 'Directions for Use', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 145 },
  { id: 'zoll-emv731-circuits-troubleshooting', title: 'Troubleshooting', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 145 },
  { id: 'zoll-emv731-circuits-warnings', title: 'Warnings & Notes', equipment: true, placeholder: true, originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf', pdfPage: 145 },
  {
    id: 'zoll-emv731-general-information',
    title: 'Zoll EMV731 - General Information',
    equipment: true,
    mdPath: 'Content/Skills & Equipment/Zoll EMV731/general-information.md',
    originalPdf: 'Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf',
    pdfPage: 7,
    cheat: [
      'Read Warnings/Cautions thoroughly before use.',
      'Portable, rugged, full-featured ventilator for prehospital/transport.',
      'Keep product documentation current; check ZOLL website for updates.',
      'Symbols: understand alarm, mute/cancel, DC power, exhalation valve, O2 connector.',
      'If shipping damage or failed self-test: contact ZOLL support before use.'
    ],
    class: `
This section introduces the ZOLL EMV731 ventilator and its operator's guide.  It
describes the ventilator as a small, durable, full‑featured mechanical device
designed for use in hospitals as well as harsh and under‑resourced environments.  The
operator’s guide explains how to use and care for the ventilator safely and
effectively, listing symbols that appear on the device and in the manual, defining
important abbreviations, and presenting indications for ventilation and cardiopulmonary
resuscitation.  Additional content explains how to unpack and assemble the ventilator,
lists warnings and cautions, and provides information on warranty, FDA tracking
requirements and software licensing.  Contact details for ZOLL Medical Corporation
and instructions for obtaining manual updates are also included.
    `,
    indications: [
      'Introduces the ventilator and its operator’s guide, including symbols, abbreviations and indications for use.',
      'Explains unpacking, assembly and important warnings/cautions.',
      'Provides warranty and service information, FDA tracking requirements and contact details for ZOLL support.'
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
      'Models: AEV, EMV+, Eagle II — transport/hospital/prehospital.',
      'Rugged, lightweight; internal compressor, long-life battery, daylight-visible GUI.',
      'Ventilation modes: AC, SIMV, CPAP, Bi-Level; integrated SpO2.',
      'Know connector panel: fresh gas intake, power, patient circuit, exhalation valve.',
      'Understand GUI parameter windows and indicators before patient use.'
    ],
    class: `
This overview summarises the available EMV731 models – AEV, EMV+ and Eagle II –
and their intended applications in prehospital, transport and hospital settings.  It
highlights common features such as a rugged lightweight design, internal compressor
with long‑life battery, daylight‑visible display, integrated pulse‑oximetry and
efficient oxygen consumption.  The chapter outlines ventilation modes (Assist/Control,
SIMV, CPAP and Bi‑Level), introduces controls and indicators, describes the GUI
display, and explains the pneumatic design, fresh gas intake, connector panel,
ventilator circuits, pulse oximeter and power sources.
    `,
    indications: [
      'Describes AEV, EMV+ and Eagle II models and their target environments.',
      'Highlights common features like rugged design, multiple ventilation modes, internal compressor, long battery life and integrated SpO₂ monitoring.',
      'Introduces controls, display screen, pneumatic design, fresh gas intake, connector panel, circuits, oximeter and power sources.'
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
      'Never start ventilator with patient attached; be ready to bag.',
      'Attach circuit; optionally connect high-pressure O2; verify filters/accessories.',
      'Select power source; power on; choose startup defaults and mode.',
      'Perform operational test before connecting patient.',
      'Attach pulse-oximeter probe as required; confirm alarms and settings.'
    ],
    class: `
This section provides step‑by‑step instructions for preparing the ventilator for use.
Key tasks include attaching the ventilator circuit, optionally connecting a high‑pressure
oxygen supply, inspecting and attaching fresh‑gas filters and accessories, selecting a
power source, powering on the unit, choosing start‑up default values and an operating
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
      'Details the sequence of tasks to prepare the ventilator, from attaching the circuit and power source to performing an operational test and connecting the patient.',
      'Emphasises safety warnings: prepare to bag the patient, do not start the ventilator with the patient attached, and select appropriate circuits and attachments.',
      'Explains how to connect hoses and lines and describes optional accessories like oxygen reservoir bags and filters.'
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
      'GUI shows parameter windows for Mode, BPM, VT, PIP, FIO2, SpO2, HR.',
      'Single press = primary; multiple = secondary/alarm; press/hold = context menu.',
      'Select breath target (V or P) as appropriate for patient/strategy.',
      'Pop Up protects against out-of-range settings — read and confirm intentionally.',
      'Leak Compensation reduces nuisance alarms (Incomplete Exhalation/Insufficient Flow).'
    ],
    class: `
This chapter explains operation of the EMV731.  It describes the graphical user
interface with parameter windows for Mode, Breaths Per Minute (BPM), Tidal Volume
(VT), Peak Inspiratory Pressure (PIP), Fraction of Inspired Oxygen (FIO₂), Oxygen
Saturation (SpO₂) and Heart Rate (HR).  Instructions cover changing parameter values
using single, multiple or press‑and‑hold actions on the parameter buttons.  The
ventilation modes are defined – Assist/Control (AC), Synchronized Intermittent
Mandatory Ventilation (SIMV), Continuous Positive Airway Pressure (CPAP) and
Bi‑Level (BL) – along with options for volume‑ or pressure‑targeted breaths and leak
compensation.  Further sections discuss pop‑up messages that warn when settings
exceed typical clinical ranges, integration of the pulse oximeter, and methods for
managing alarms and notifications.
    `,
    indications: [
      'Describes the ventilator’s graphical interface and parameter windows for mode, BPM, VT, PIP, FIO₂, SpO₂ and HR.',
      'Explains how to change settings and defines ventilation modes (AC, SIMV, CPAP, BL) with volume‑ or pressure‑targeted options and leak compensation.',
      'Discusses pop‑up warnings, pulse‑oximetry integration and management of alarms and messages.'
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
      'Alarm Message Center (AMC) shows name, mitigation steps, if-not-resolved steps.',
      'High Priority: ventilation under user control not possible — immediate action; cannot mute.',
      'Medium Priority: ventilation possible but failure exists — mute 30s; fix cause.',
      'Low Priority: safe ventilation active; audible cancels with Mute; LED stays yellow if unresolved.',
      'Preemptive Mute for 30s before procedures that trigger alarms.',
      'Startup Mute: patient safety alarms suspended ~2 min during setup (exceptions apply).',
      'Multiple alarms: turn Dial to cycle; solid bell indicates alarm shown; max 6 without plot.',
      'Service codes (1###, 2###, 3###) map to priority; report when contacting support.',
      'Pop Up Messages protect from unsafe settings; read and act accordingly.'
    ],
    class: `
This section details the ventilator’s Smart Help alarm system.  The ventilator
continuously monitors patient status, device performance and environmental conditions.
When it detects a problem it raises an alarm and displays a Smart Help message in
the Alarm Message Center.  The alarm name, mitigation instructions and follow‑up
guidance appear in priority order, with the most critical alarms shown first.  Alarms
are categorised as High Priority (mechanical ventilation impossible – immediate
intervention required), Medium Priority (ventilation possible but device fault – user
action needed) or Low Priority (advisory).  Icons indicate the number of active
alarms and their severity, and each alarm has a four‑digit service code to aid
technical support.
    `,
    indications: [
      'Explains the Smart Help alarm system, which monitors patient, device and environment and displays context‑specific messages.',
      'Defines High, Medium and Low priority alarms and provides mitigation and follow‑up instructions for each.',
      'Describes alarm display elements including names, service codes, severity icons and indicators of multiple active alarms.'
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
      'Confirm temperature, barometric pressure, and altitude are within device specs.',
      'Monitor device and ambient temperature; avoid overheating/condensation.',
      'Use appropriate power/O2 sources for the environment (field vs transport).'
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
limits (–25 °C to 49 °C), adjusting circuit compliance values, and determining when to
remove the unit from its padded case to improve cooling or keep it insulated.  The
ventilator is not intended for use in hyperbaric chambers.
    `,
    indications: [
      'Provides guidance for operating the ventilator in harsh, hazardous and MRI environments.',
      'Advises using filters and padded cases to protect the device in harsh settings and selecting appropriate accessories in chemical/biological environments.',
      'Discusses operating at extreme temperatures and altitudes, setting battery limits, adjusting compliance and noting that the ventilator is not for hyperbaric chambers.'
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
      'Follow preventive maintenance schedule; heed PM alarms.',
      'Inspect/replace filters and accessories per schedule; check exhalation valve diaphragm.',
      'If self-test fails or damage suspected: remove from service and contact support.'
    ],
    class: `
This chapter outlines maintenance procedures to ensure the ventilator remains ready for
use.  It recommends regular inspection for cleanliness, damage and wear on the unit,
accessories, hoses, circuits, filters and power cables, replacing any worn or defective
components.  Cleaning instructions include keeping the ventilator clean, preventing
liquids from entering the unit, wiping with a damp soapy cloth or 10 % bleach
solution, avoiding abrasives or chlorinated solvents and thoroughly drying the unit.
Operators are warned never to use oil or grease with oxygen or compressed‑gas
equipment.  The chapter also explains how to replace intake filters and notes that
preventive maintenance and annual calibration should be carried out by ZOLL‑trained
personnel using the RCS system.
    `,
    indications: [
      'Advises regular inspection of the ventilator and accessories for cleanliness, damage and wear, with replacement of worn parts.',
      'Provides cleaning instructions using damp soapy cloths or a 10 % bleach solution and cautions against liquids, abrasives and chlorinated solvents.',
      'Describes replacing intake filters and performing preventative maintenance and calibration through ZOLL‑trained personnel.'
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
      'Know operational ranges: flow rate, BPM, VT, FIO2, PEEP/EPAP, PIP, pressure support.',
      'Max PIP ~80 cmH2O; pressure support up to 60 cmH2O; O2 input ~55 psig.',
      'Review measurement resolutions/tolerances; set alarms accordingly.'
    ],
    class: `
This appendix summarises the ventilator’s technical specifications.  It lists the
operating modes available on the EMV+ and Eagle II models (Assist/Control,
SIMV, CPAP with or without Pressure Support, Bi‑Level with leak compensation) and on
the AEV model (Assist/Control, CPAP and Bi‑Level with leak compensation).  The
operational ranges include flow rates up to 100 litres per minute, breath rates from 1
to 80 breaths per minute, tidal volumes from 50 to 2 000 millilitres, FIO₂ from 21 % to
100 %, positive end expiratory pressure (PEEP/EPAP) from 0 to 30 cm H₂O, peak
inspiratory pressures (PIP) from 10 to 80 cm H₂O, pressure support up to 60 cm H₂O
and an oxygen input pressure of 55 psig.  Measurement resolutions and tolerances
for parameters such as inspiratory time, tidal volume, FIO₂, PIP and mean airway
pressure (MAP) are also provided.
    `,
    indications: [
      'Lists available ventilation modes for EMV+, Eagle II and AEV models.',
      'Provides operational ranges for flow rate, breath rate, tidal volume, FIO₂, PEEP/EPAP, PIP and pressure support.',
      'Specifies measurement resolutions and tolerances for key parameters and notes the oxygen input pressure.'
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
      'AC/DC supplies, region-specific power cords, battery packs/cables.',
      'Carrying cases, bacterial/viral filters, HMEs, compressor foam filters.',
      'O2 reservoir kits; part numbers vary by country — confirm before ordering.'
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
      'Lists available accessories such as power supplies, battery packs, extension cords, carry cases, filters, HMEs and oxygen reservoir kits.',
      'Notes that part numbers and connector types vary by country and that some items are sold individually or in bulk.',
      'Explains the purpose of each accessory in supporting power, infection control and circuit connections.'
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
      'SpO2 relies on differential absorption (red 660nm, IR 905nm) and pulsatile volume.',
      'Masimo SET separates arterial signal from noise (motion/low perfusion) for accuracy.',
      'SpO2 computed every ~2s via discrete saturation transform.'
    ],
    class: `
This appendix explains the operating principles of the Masimo SET pulse oximeter used
with the ventilator.  Pulse oximetry relies on two phenomena: oxyhemoglobin and
deoxyhemoglobin absorb red and infrared light differently, and arterial blood volume
changes during each pulse.  Traditional oximeters calculate a ratio of the pulsatile
absorbance at two wavelengths (660 nm and 905 nm) to determine oxygen saturation
from a lookup table.  The Masimo SET algorithm improves on this by decomposing
the signals into arterial and noise components, recognising that arterio‑venous
shunting introduces noise.  It applies an adaptive correlation canceller and a
discrete saturation transform across all possible saturation values to compute SpO₂
every two seconds, enhancing accuracy in the presence of motion or low perfusion.
    `,
    indications: [
      'Describes the principles of pulse oximetry, including differential light absorption and pulsatile blood volume.',
      'Explains how traditional oximeters use a ratio of absorbance at two wavelengths to estimate saturation.',
      'Introduces the Masimo SET algorithm, which separates arterial signals from noise and computes SpO₂ every two seconds using a discrete saturation transform.'
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
      'Choose correct single-limb Wye circuit (adult/ped/infant; 6 or 12 ft).',
      'Maintain PEEP ≥ 5 cmH2O; correct for compressible volume; beware long circuits.',
      'Inspect and reseat exhalation valve diaphragm if alarms occur; test with lung.'
    ],
    class: `
This appendix describes the ventilator’s patient circuits.  It covers single‑limb,
Wye circuits for pediatric/adult patients in 6 ft and 12 ft lengths and for
infant/pediatric patients in 6 ft and 12 ft lengths.  Intended use information
explains that these circuits transfer gases to and from the patient and are not
designed for heated humidification.  Technical specifications include the internal
diameter, inspiratory and expiratory resistance, compliance (compressible volume),
deadspace, maximum working pressure and operating temperature range.  The circuits
comply with ISO 5367 and are single‑patient use.  Directions for use detail how to
connect the inspiratory line, pressure line and exhalation valve line, verify
connections with a test lung and examine the circuit for damage before use.  A
troubleshooting section describes how to inspect and reseat the silicon diaphragm
in the exhalation valve when alarms occur.  Warnings emphasise the need to correct
for circuit compressible volume, maintain PEEP at or above 5 cm H₂O and ensure that
longer circuits can trap PEEP in patients with short expiratory times.
    `,
    indications: [
      'Explains the intended use of single‑limb Wye circuits for adult, pediatric and infant patients, noting they are single‑use and not for heated humidification.',
      'Provides specifications such as internal diameter, resistance, compliance, deadspace, maximum working pressure and temperature range and notes compliance with ISO 5367.',
      'Offers directions for connecting the inspiratory, pressure and exhalation valve lines, troubleshooting the exhalation valve and warns about compressible volume and PEEP maintenance.'
    ],
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
