## All Content
Chapter 3 walks through the pre-flight tasks required before a patient can safely ride the EMV731: circuit hookup, oxygen source, intake filters, power, start-up defaults, operating mode, alarm tests, optional pulse oximetry, and finally connecting the patient. (*Source: Rev. P, Chapter 3-1 through 3-13*)

- Always be ready to bag; never start the ventilator with a patient attached until set-up and checks are finished. (*Source: Rev. P, Chapter 3-2*)
- Follow the task order so alarms and power transitions work as expected during transport.
- Keep the red gas-output cap and intake filters handy for storage and maintenance.

## Circuit Attachment
1. Choose the correct single-patient circuit (adult/pediatric or infant) for the mission profile. (*Source: Rev. P, Chapter 3-2*)
2. Remove and retain the red gas-output cap; attach the 22 mm corrugated hose to the gas outlet.
3. Connect the green 3/16 in airway-pressure line to the transducer barb and the clear 1/4 in line to the exhalation-valve fitting.
4. Seat the oxygen hose on the high-pressure inlet if supplemental O2 will be used.

Warnings:
- Match circuit size to patient category to avoid dead-space and compliance errors. (*Source: Rev. P, Chapter 3-2*)
- When using third-party circuits or accessories, update tubing compliance and dead-space values so tidal volume delivery stays accurate. (*Source: Rev. P, Chapter 3-3*)

## High-Pressure O2 Connection
- Optional because the EMV731 carries an internal compressor; connect only medical-grade (USP) oxygen. (*Source: Rev. P, Chapter 3-3*)
- Secure cylinders and use the supplied O2 hose (green or white depending on region) to the DISS inlet.
- Ensure input pressure is within the range described in Chapter 2 before or during self-check.

## Filters & Accessories
- Inspect the Fresh Gas/Emergency Air Intake foam insert and disk filter; replace if dirty to protect the compressor. (*Source: Rev. P, Chapter 3-4*)
- Never block the intake--free airflow is required for both compressor operation and patient fallback breathing. (*Source: Rev. P, Chapter 3-4*)
- Attachments:
  - Oxygen reservoir bag for low-flow concentrators. (*Source: Rev. P, Chapter 3-5*)
  - Bacterial/viral filter for infection control.
  - Chemical/biological C2A1 filter for hazardous environments.

## Power Source Selection
- Options: internal 14.4 V Li-ion battery (>10 h at factory defaults with SpO2 on), universal AC/DC supply (100-240 V AC, 50/60/400 Hz, outputs 24 V DC at 4.2 A), vehicle DC cables (11.8-30.0 V DC), or external battery packs. (*Source: Rev. P, Chapter 3-5*)
- The ventilator prefers external power and charges the battery automatically; loss of external power triggers the EXTERNAL POWER FAILURE alarm and seamless switchover.
- If a shutdown is required and the switch fails, remove external power immediately.

## Power On & Defaults
- Do not connect the patient during self-check or while the Start Menu is active. (*Source: Rev. P, Chapter 3-6*)
- After power on, wait for the LED ring to turn green and choose a preset: Adult, Pediatric, Mask CPAP, Custom, or Last Settings. (*Source: Rev. P, Chapter 3-6 through 3-8*)
- Factory defaults (Adult example): Mode AC(V), BPM 12, I:E 1:3, VT 450, PEEP 5, PIP limit 35, FiO2 21%. Pediatric and Mask CPAP presets adjust BPM, PIP, and backup values accordingly. (*Source: Rev. P, Chapter 3-7 and 3-8*)
- Configure the ventilator to auto-select Adult defaults via the Start Config menu if desired.

## Mode Selection
- Available modes: AC, SIMV (model-dependent), CPAP, and BL; each can be pressure or volume targeted as supported. (*Source: Rev. P, Chapter 3-8 through 3-10*)
- Use the Mode button and dial to highlight and accept the desired mode; confirm related alarm and support settings.
- Transitioning into CPAP/BL automatically adjusts rise time and support limits--verify especially for infants and small children. (*Source: Rev. P, Chapter 3-10*)
- The head-with-mask icon signals NPPV; it reappears once muted alarms clear.

## Operational Test
Perform before attaching the patient to verify circuit integrity and primary alarms. (*Source: Rev. P, Chapter 3-11*)
1. Press Manual Breath--observe flow from the patient port.
2. Occlude the patient port; after two breaths the HIGH AIRWAY PRESSURE alarm should sound (PIP limit <=35 cm H2O).
3. Release the port to trigger PATIENT DISCONNECT; partially close to reset it.
4. Remove external power to confirm EXTERNAL POWER LOW/DISCONNECT alarms, then restore power.
5. If any alarm fails, continue manual ventilation, replace the ventilator, and send for service.
6. Verify remaining battery capacity if operating on internal power.

## Attach Pulse Oximeter
- Optional Masimo SET module activates when the sensor cable is plugged into the top-panel SpO2 port; stby clears after a valid waveform for 10 seconds. (*Source: Rev. P, Chapter 3-12*)
- Use approved LNCS probes, route cables to avoid tangles, and reference Appendix C for technology specifics.

## Connect Patient
- After the operational test, detach any test lung and secure the patient interface (ETT, LMA, mask) to the circuit. (*Source: Rev. P, Chapter 3-13*)
- Confirm the ventilator parameters and alarms match the patient prescription before ventilation.
- Do not plug anything into the service USB port during clinical use. (*Source: Rev. P, Chapter 3-13*)
