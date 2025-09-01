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
    id: 'zoll-emv731-general-information',
    title: 'Zoll EMV731 - General Information',
    equipment: true,
    mdPath: 'Content/Skills & Equipment/Zoll EMV731/general-information.md',
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
