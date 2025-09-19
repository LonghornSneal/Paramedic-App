## All Content
Chapter 2 summarizes how the EMV731 hardware is built and where each subsystem lives: the model lineup, shared controls, graphical interface, pneumatic architecture, gas pathway, connector layout, circuit options, pulse oximetry integration, and power strategy. It orients crews before they dive into setup or mode selection. (*Source: Rev. P, Chapter 2-1 through 2-4*)

- Three-model family: AEV (ambulance), EMV+ (multi-transport), Eagle II (intra-hospital) share a rugged shell, Smart Help prompts, Masimo SpO2, and a sealed compressor path.
- Core conveniences: daylight-visible LCD, status LED array, on-device menus, and patient-friendly pneumatic design with controlled exhalation and pressure sensing.
- Mission flexibility: supports high or low pressure oxygen, ambient-air operation, and quick reconfiguration between hospital, air, and ground platforms. (*Source: Rev. P, Chapter 2-2 through 2-4*)

## Models & Intended Use
The three models differ mainly in mounting and mission profile while keeping the same software and safety envelope.

| Model | Primary environments | Core ventilation modes & notes |
| --- | --- | --- |
| AEV | Ground ambulance transport | AC, CPAP with pressure support, BiLevel tuned to prehospital workflows. |
| EMV+ | EMS, air medical, mass casualty & field care | Full range AC/SIMV/CPAP/BiLevel, rugged shell for harsh environments, optional MRI-conditional variant. |
| Eagle II | Emergency department & intra-hospital transport | EMV+ feature set with mounting options for walls, boom arms, roll stands, and gurneys; MRI-compatible variant available. |

All models are approved for MRI suites when fitted with the MRI-conditional configuration (3.0 T, placement ~6.5 ft from the bore). (*Source: Rev. P, Chapter 2-2*)

## Controls & Indicators
The control panel clusters every tactile control around the LCD so operators can manage settings without leaving the patient.

- Controls: Power switch, parameter buttons (primary/secondary/context menus), Menu button, Selection dial with accelerated turn response, Mute/Cancel (alarms or edits), Accept (confirm selections), Manual Breath/Plateau Pressure trigger. (*Source: Rev. P, Chapter 2-4*)
- Indicators: Status LED array (green/yellow/red), LCD for settings/patient data/alarms, Alarm Message Center for mitigation prompts. Hardware icons appear adjacent to each connector for quick cable routing. (*Source: Rev. P, Chapter 2-3 through 2-4*)

## GUI Overview
The LCD is divided into four functional zones so the most important data stays visible:

- Alarm Message Center / waveform window: hosts airway pressure and pleth waveforms or context menus during adjustments.
- Parameter windows: show active settings, highlight the currently editable value, and display alarm thresholds.
- Shared icon area: consolidates ventilator status icons (mode, power, alarms, patient detect, leak compensation, SpO2, external power) for rapid scanning.
- Auxiliary boxes: provide secondary parameter values and alarm limits adjacent to the main windows. (*Source: Rev. P, Chapter 2-4 through 2-6*)

## Pneumatic Design
The internal compressor blends ambient air and supplemental oxygen through a fully sealed path. Inspiratory flow passes through the wye circuit to the patient, while the expiratory limb vents directly to atmosphere. The ventilator pneumatically actuates the exhalation valve (maintaining PEEP) and monitors airway pressure with an internal transducer. Breath cycling can be patient-triggered or time/flow cycled, with pressure or volume targets. (*Source: Rev. P, Chapter 2-9*)

## Fresh Gas Intake
The side-mounted Fresh Gas/Emergency Air Intake feeds the internal compressor and doubles as an anti-asphyxia valve so the patient can breathe ambient air if the ventilator fails. The intake ships with a particulate filter and accepts bacteria/viral or chemical/biological filtration as conditions require. ZOLL's O2 reservoir kit lets crews supplement low-flow oxygen concentrators. Keep the intake clear of obstructions to avoid alarms and flow restriction. (*Source: Rev. P, Chapter 2-9 through 2-10*)

## Connector Panel
The top panel groups every external connection for fast setup. Key ports include:

| Connector | Purpose | Notes |
| --- | --- | --- |
| High-pressure O2 inlet (DISS) | Connects regulated 40-87 psig oxygen supply | Save the dust cap when not in use. |
| Gas output | Links to the patient circuit | Ships with red protective cap; reinstall for storage. |
| External power input | Accepts the AC/DC supply or DC harness | Automatically charges the internal battery when present. |
| USB service port | Service interface for updates/log retrieval | Do not leave connected during patient care. |
| Pulse oximeter connector | Connects Masimo LNCS sensor cable | Supports adult, pediatric, and infant probes. |
| Fresh gas intake | Ambient air and anti-asphyxia inlet | Houses the particulate and optional filters. |
| Status LED array | Visual alarm indicator | Tied directly to alarm priority.

(*Source: Rev. P, Chapter 2-2 through 2-4*)

## Ventilator Circuits
ZOLL supplies single-patient-use circuits in adult/pediatric (6 ft and 12 ft) and infant/pediatric (6 ft and 12 ft) variants. Inspect daily for cracks, discoloration, or deformation; replace if damaged or after contamination events. HEAT and Moisture Exchangers (HME/HMEF) can be added, noting the slight resistance increase and patient-size-specific selection. Compressible volume must be accounted for via the Vt context menu, especially with long circuits. (*Source: Rev. P, Chapter 2-12 through 2-16*)

## Pulse Oximeter Module
An optional Masimo SET module integrates with the ventilator to provide continuous SpO2 and pulse-rate monitoring for infant through adult patients, even during motion or low perfusion. Use Masimo LNCS probes listed in Appendix A, route cables to avoid entanglement, and rely on the ventilator alarm banners to escalate desaturation events. (*Source: Rev. P, Chapter 2-8 and 2-14*)

## Power Sources
The ventilator runs on its internal Li-ion battery (over 10 hours at factory default with SpO2 active) or the universal external AC/DC supply (100-240 V AC, 50/60 Hz, 400 Hz capable, delivering 24 V DC at 4.2 A). When external power is connected, the battery charges automatically while supporting ventilation. Mount external supplies with the approved holder kits to maintain earthing; disconnect power if the device must be shut down and the switch is unresponsive. (*Source: Rev. P, Chapter 2-14 through 2-15*)
