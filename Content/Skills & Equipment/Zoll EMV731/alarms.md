## Alarm Overview
The EMV731 constantly audits the patient, ventilator hardware, and surrounding environment. Any deviation generates a Smart Help alert that highlights the issue and points you toward corrective actions. The alarm list is sorted by clinical risk, so the most dangerous condition always appears first. Work the alarms in order, confirming the patient each time before you silence the tone or move on. (*Source: Rev. P, Chapter 5-1 through 5-2*)

- Smart Help binds device diagnostics to bedside tasks, making it easier to translate the alert into patient care steps.
- Consider every alarm a patient-safety event until proven otherwise; even advisory banners can foreshadow loss of ventilation.

## Alarm Message Center (AMC)
The Smart Help banner in the upper-left corner functions as the Alarm Message Center. It layers the alarm name, stepwise mitigation guidance, and a bold Message line that tells you what to do if the first suggestions fail. Use the control dial to page through active alarms; the solid bell icon marks the alarm you are viewing, while outlined bells show the remaining stack. The waveform icon shares the list so you can review the current trace when you need more context. (*Source: Rev. P, Chapter 5-2 through 5-3*)

- Line 1 names the alarm and mirrors the priority color seen on the LED column.
- The next lines list corrective actions in order; carry them out sequentially.
- The final bold Message prompt lays out the contingency plan (often switching to manual ventilation or calling for service) if the alarm does not clear.
- Every alarm carries a four-digit service code. The leading digit mirrors the alarm priority and becomes the shorthand you should quote to ZOLL support (for example, a 2### code signals a medium-level event).

## Alarm Priorities
Alarm priorities describe how threatened the patient's ventilation is and how aggressively you must intervene. (*Source: Rev. P, Chapter 5-3 through 5-4*)

- High priority: The ventilator can no longer guarantee breaths under user control. Assume the patient is unsupported, begin manual ventilation, troubleshoot power and hardware, and expect the alarm to continue until the fault is resolved or the ventilator is powered down.
- Medium priority: Ventilation continues, but a circuit, pneumatic, or monitoring fault needs rapid attention. Pressing Mute gives a 30-second pause; if the problem persists, the tone restarts after three seconds.
- Low priority (advisory): Ventilation is stable, yet a configuration or monitoring issue requires follow-up. Mute silences the tone, but the yellow LED stays lit until you fix the condition.

## Alarm Icons & Service Codes
The alarm banner uses consistent iconography so severity is obvious at a glance. A column of bell icons appears for every active alarm; the filled bell reflects the line you are reading, and up to six alarms can display before the waveform icon is pushed off the list. Priority triangles (yellow, orange, or red) match the Chapter 1 legend for low, medium, and high alerts. Provide the accompanying four-digit service code when calling technical support; the leading digit communicates the same priority you see on screen and speeds remote troubleshooting. (*Source: Rev. P, Chapter 5-2 through 5-3*)

## Muting Alarms
The Mute key is a short-term sound control, not a fix. Most alarms silence for 30 seconds, but high-priority events ignore the command. Use mute deliberately so you can hear new alarms and complete parameter changes without interruption. (*Source: Rev. P, Chapter 5-4*)

- Preemptive mute: Tap before suctioning, circuit changes, or other planned disconnections; patient-safety alarms stay quiet for 30 seconds while you work.
- Startup mute: When you launch from the Start Menu, the ventilator suspends most patient alarms for up to two minutes (or 15 seconds once the patient is connected) so you can finish setup without nuisance tones; critical faults still break through.
- High-noise environments: Leaving the alarm active causes the tone to retrigger with every breath and can cancel adjustments. Hit mute, solve the problem, and verify the alarm clears instead of letting it cycle endlessly.

## Alarm Types: Patient Safety
Patient safety alarms watch everything that directly influences ventilation and oxygenation. They commonly appear as high or medium priority cues that require bedside intervention. (*Source: Rev. P, Chapter 5-4 through 5-6*)

- Airway pressure, AutoPEEP, leak, and tubing compliance alarms point to disconnections, kinks, or compliance shifts. Inspect the patient interface and circuit before altering settings.
- Apnea, breath-rate, inspiratory-demand, and insufficient-flow alarms flag when the patient is not receiving or generating adequate breaths; reassess sedation, trigger sensitivity, and backup rates immediately.
- Exhalation valve, patient-detected, and circuit fault alarms indicate hardware that needs replacement to restore proper cycling.
- Integrated SpO2 and heart-rate alarms keep oxygenation information beside ventilator faults so you can correct hypoxia alongside mechanical issues.

## Alarm Types: Environment
Environment alarms oversee the resources that keep the ventilator running. They usually start as advisory or medium-priority events but escalate if supplies are exhausted. (*Source: Rev. P, Chapter 5-5 through 5-6*)

- Power and battery alerts warn of reversed DC leads, depleted batteries, or charger faults. Secure stable power or swap batteries before ventilation stops.
- High-pressure O2 and fresh-gas inlet messages reveal supply restrictions; check cylinder pressure, hose connections, filters, and reservoir mode.
- Ambient pressure and temperature alarms surface when the operating environment drifts outside the ventilator's certified range; adjust positioning or transport the patient to a safer location.

## Alarm Types: Self Check
Self Check alarms report internal diagnostic faults. They may allow temporary support, but crews should be ready to change ventilators and notify maintenance. (*Source: Rev. P, Chapter 5-5 through 5-6*)

- Internal communication, firmware mismatch, or processor errors show that the controller and Smart Pneumatic Module disagree. Switch to manual ventilation and arrange a replacement ventilator.
- Pneumatic sensor or system alarms indicate the unit cannot verify flow or pressure accurately; treat the reading as unreliable until the hardware is serviced.
- Power-system, pulse-oximeter module, and preventive-maintenance alarms document hardware that needs technical follow-up; capture the service code and escalate per agency policy.

## Alarm Groups
Chapter 5 clusters every alarm into Patient Safety, Environment, or Self Check groupings so you can find them quickly in the reference tables. Patient Safety covers airway pressure, breathing frequency, circuit integrity, oximetry, and leak detection items. Environment catalogues batteries, external power, high-pressure oxygen, fresh-gas flow, ambient pressure, and temperature limits. Self Check captures firmware mismatches, internal communications, pneumatic modules, power converters, and scheduled maintenance needs. Mirror these groupings in the app so field crews can jump straight to the appropriate section. (*Source: Rev. P, Chapter 5-5 through 5-7*)

## Pop Up Messages
Pop ups act as guardrails whenever you attempt to enter a value outside the ventilator's safe envelope or when the device needs a deliberate confirmation. They freeze the adjustment, explain why the change is blocked, and tell you which key sequence will accept or cancel the request. Many overrides, such as inverse I:E ratios, high EPAP or IPAP targets, or circuit mismatches, demand a second press of Accept to acknowledge the risk; skipping the confirmation leaves the prior setting in place. Some pop ups temporarily disable related alarms until you reconfigure limits, so complete the requested steps before returning to other tasks. (*Source: Rev. P, Chapter 5-4 and 5-23 through 5-31*)

High Priority Alarms

Service
Alarm Name/Mitigation/Resolution
Code


Self Check Failure
Alarm triggers when the compressor fails to operate or fails to provide the flow required to deliver a breath
and high pressure O2 is not available to provide ventilation.
Mitigation/Info: Pneumatic System: Compressor, Manually Ventilate Patient, Connect 55
psig/380 kPa O2, Restart Ventilator with O2, **Contact Service Center**
Self Check Failure
Alarm triggers when communication between the compressor controller and Smart Pneumatic Module (SPM)
is lost and high pressure O2 is not available to provide ventilation.
Mitigation/Info: Pneumatic System: Compressor, Manually Ventilate Patient, Connect 55


Self Check Failure


Alarm triggers when the flow from the first breath is ± 20% of the expected flow for the tidal volume at start
up. This unusually low RPM is a symptom of a dirty flow screen which cannot be serviced by the user.
Mitigation/Info: Pneumatic Sensor: Pneumotach, Manually Ventilate Patient, **Contact Service Center**
Self Check Failure
Alarm triggers when the O2 valve fails in the open position which results in continuous inspiratory flow. When
this occurs the device automatically opens the exhalation valve to prevent pressure from accumulating in the
circuit and ventilation stops.


Mitigation/Info: Pneumatic System: O2 Valve, Manually Ventilate Patient, **Contact Service Center**
Self Check Failure
Alarm occurs when the signal to the O2 valve is not delivering the required flow rate and the compressor is
not available to provide ventilation.


Mitigation/Info: Pneumatic System: O2 Valve, Manually Ventilate Patient, **Contact Service Center**
Self Check Failure
Alarm occurs when the communication between the O2 valve and the SPM fails and the compressor is not
available to provide ventilation.


Mitigation/Info: Pneumatic System: O2 Valve, Manually Ventilate Patient, **Contact Service Center**
Low O2 Supply Failure
Alarm occurs when the O2 supply pressure is <35 psig (241 kPa) and the compressor is not available to support ventilation. If the O2 source can be restored the device should be cycled off then on to reset. By design
the device will not reestablish O2 operation unless the supply pressure is ≥40 psig (276 kPa). If the supply
pressure is between 40 and 87 psig (276 to 600 kPa) the user should check the hose connections for leaks.
Occasionally, this alarm can be caused by a regulator that provides a static pressure within range but is not
able to provide the flow necessary to meet the patient flow demand.
Mitigation/Info: Manually Ventilate Patient, Connect 55 psig/380 kPa O2, Restart, Check O2 Supply for

5-8





Gas Intake Failure
Alarm occurs when the Fresh Gas/Emergency Air Inlet is blocked so that the compressor is not able to
deliver flow sufficient for the current settings and high pressure O2 is not available to support ventilation. The
user should clear the blockage and restart the ventilator. A false alarm can be triggered in very high vibration
environments.
Mitigation/Info: Manually Ventilate Patient, Clear Blocked Intake, Connect 55 psig/380 kPa O2, Restart Venti-


High O2 Supply Failure
Alarm triggers when the O2 supply pressure is >87 psig (600 kPa). Pressures above 87 psig (600 kPa) can
result in a catastrophic failure, harm to the patient and/or damage to the device. While the patient is manually
ventilated the user or assistant should seek to reduce the O2 supply pressure. Sometimes this requires
changing the regulator which is not functioning as required. If the pressure cannot be reduced and a low flow
device like a flow meter is available the user can provide supplemental O2 via the optional low flow O2 reservoir. To clear the alarm the device should be turned off and then restarted with supply pressure in the appropriate range (40 to 87 psig, 276 to 600 kPa) or without the high pressure O2 source connected.



Self Check Failure
Alarm triggers when the autocal procedure is not able to zero the airway pressure transducer to ambient
pressure. When this occurs, manually ventilate the patient, replace the ventilator replaced and contact the
service center for additional information. Note: a false alarm can be triggered during operation in very high
vibration environments when the device is not mounted correctly. If this could be the cause, restart the ventilator and continue operation if no alarms are triggered.
Mitigation/Info: Pneumatic Sensor: Autocal, Manually Ventilate Patient, **Contact Service Center**
Self Check Failure
Communication between the airway pressure sensor and SPM is lost. When this happens, manually ventilate the patient, replace the ventilator and contact the service center for additional information. Mitigation/Info: Pneumatic Sensor: Airway Pressure, Manually Ventilate Patient, **Contact Service Center**


Exhalation System Failure
Alarm occurs when the PIP fails to return to the baseline pressure for 3 consecutive breaths, indicating that
the exhalation control valve has failed. When triggered, the device stops ventilating and attempts to discharge the pressure in the breathing circuit to atmosphere. This failure may be caused by a significant blockage of the exhalation valve or an occlusion/kink in the exhalation valve tube. If possible, the user should
replace the breathing circuit and restart the ventilator. If this does not resolve the failure, replace the ventilator
and contact the service center for additional information.
Mitigation/Info: Patient Can Not Exhale, Manually Ventilate Patient, Check for Kinked Hose/Tube, Replace


Exhalation System Failure
The airway pressure, PIP, is >40 cm H2O, the PIP High Limit (when PIP High Limit is < 35 cm H2O) for > 5
seconds, or when the PIP is >75 cm H2O for > 1.5 seconds. When this happens, the device stops ventilating


and attempts to discharge the pressure in the breathing circuit to atmosphere. This failure may be caused by
a significant blockage of the exhalation valve or an occlusion/kink in the exhalation valve tube. If possible,
the user should replace the breathing circuit and restart the ventilator. If this does not resolve the problem,
replace the ventilator and contact the service center for additional information.
Mitigation/Info: Patient Can Not Exhale, Manually Ventilate Patient, Check for Kinked Hose/Tube, Replace
Self Check Failure
Alarm occurs when the 5 volt power bus fails to provide the required voltage. If this failure occurs, the user
should manually ventilate the patient, replace the ventilator and contact the service center for additional information.
Mitigation/Info: Pneumatic Sensor: Autocal, Manually Ventilate Patient, **Contact Service Center**


ZOLL Ventilator Operator’s Guide

5-9

ALARMS

Self Check Failure
Alarm occurs when communication fails between one of the subcomponents and the host processor. If this
failure occurs, the user should manually ventilate the patient, replace the ventilator and contact the service
center for additional information.
Mitigation/Info: Internal COMM, Manually Ventilate Patient, Backup Ventilator Started, **Contact Service


Self Check Failure
Alarm occurs when the device is not able to calibrate the one or more transducers and is no longer able to
operate safely. If this failure occurs, the user should manually ventilate the patient, replace the ventilator and
contact the service center for additional information.
Mitigation/Info: Pneumatic Sensor: Transducer, Manually Ventilate Patient, Restart Ventilator, **Contact Service Center**


Self Check Failure
Alarm triggers when the internal communication bus and the host are not able to communicate with the subassemblies. If this failure occurs, the user should manually ventilate the patient, replace the ventilator and
contact the service center for additional information.
Mitigation/Infor: Internal COMM, Manually Ventilate Patient, **Contact Service Center**


Self Check Failure
Alarm triggers when the calibration file fails its integrity check. The user should manually ventilate the patient,
replace the ventilator and contact the service center for additional information.
Mitigation/Info: Internal COMM, Manually Ventilate Patient, **Contact Service Center**


Self Check: Complete Power Failure
Alarm triggers when power is lost from both the internal battery and an external source during operation.
When this occurs, the LCD blanks (no power for operation), the audible alarm pulses rapidly, and the visual
alarm flashes rapidly. This alarm will last approximately two minutes. If the device can be recharged after the
failure and there are no other issues it can be returned to service. If there are any questions, contact the service center for additional information.


Drained Battery
Alarm triggers when the internal battery power drops below the amount required to provide ventilation and
external power is not connected. When this occurs there is enough power to operate the user interface and
provide information to the user. The user should be manually ventilate the patient while an external source of
power is sought. To cancel the alarm and begin operation with external power the device must be turned off
and then back on.
Mitigation/Info: Manually Ventilate Patient, Connect External Power, **Contact Service Center**


Self Check Failure


Alarm triggers when the device is no longer able to communicate with the User Interface Module (UIM) and
the interface controls. When this occurs ventilation continues at the current settings or the backup mode settings and the high priority alarm sounds. The user should manually ventilate the patient, replace the ventilator
and contact the service center for additional information.
Mitigation/Info: Internal COMM, Manually Ventilate Patient, **Contact Service Center**
Self Check Failure
Alarm triggers when the device is no longer able to communicate with the Smart Pneumatic Module (SPM).
When this occurs ventilation continues at the current settings or the backup mode settings and the high priority alarm sounds. The user should manually ventilate the patient, replace the ventilator and contact the service center for additional information.
Mitigation/Info: Internal COMM, Manually Ventilate Patient, **Contact Service Center**

5-10




Self Check Failure
Alarm triggers when no valid data is sent from the SPM within 1 second. When this occurs ventilation continues at the current settings or the backup mode settings and the high priority alarm sounds. The user should
manually ventilate the patient, replace the ventilator and contact the service center for additional information.
Mitigation/Info: Internal COMM, Manually Ventilate Patient, **Contact Service Center**



Self Check Failure
Alarm triggers when cyclic redundancy checking between the device and SPM fails. When this occurs ventilation continues at the current setting or the backup mode settings and the high priority alarm sounds. The
user should manually ventilate the patient, replace the ventilator and contact the service center for additional
information.
Mitigation/Infor: Internal COMM, Manually Ventilate Patient, **Contact Service Center**
Self Check Failure
Alarm triggers when the device has lost communication with the contrast control and in most instances the
content of the LCD is not visible. When this occurs ventilation continues at the current settings or the backup
mode setting and the high priority alarm sounds. The user should manually ventilate the patient, replace the
ventilator and contact the service center for additional information.
Mitigation/Info: Internal COMM, Manually Ventilate Patient, Backup Ventilator Started, **Contact Service
Center**


Self Check Failure
Alarm triggers when the device and SPM software loads are not compatible. This alarm is typically associated with an SPM change where the technician failed to update the device and SPM to the current software
revision. Ventilation is provided using the backup mode settings. The user should manually ventilate the
patient, replace the ventilator and contact the service center for additional information.
Mitigation/Info: Firmware Mismatch, Manually Ventilate Patient, Software Compatibility Failure,
**Contact Service Center**


ZOLL Ventilator Operator’s Guide


5-11

ALARMS

Medium Priority Alarms


Self Check Fault
Alarm triggers when the communication between the compressor and the SPM fails and high pressure O2 is
available to provide ventilation. The alarm will continue to sound as a medium priority alarm until the user
acknowledges that ventilation is being provided using O2 by setting the FIO2 to 100%. At this time the priority
changes to low priority. While operating in this state the user should ensure an adequate supply of O2. Failure to maintain the O2 supply will result in a high priority alarm.


Mitigation/Info: Pneumatic System: Compressor, Operation Switched to O2 Supply, Set FIO2 to 100%, MoniSelf Check Fault
Alarm triggers when the communication between the O2 valve and the SPM fails and the compressor is available to provide ventilation. The alarm will continue to sound as a medium priority alarm until the user
acknowledges that ventilation is being provided using the compressor by setting the FIO2 to 21%. At this time
the alarm priority changes to low. While operating in this state the user should monitor the SpO2 to ensure
that adequate oxygenation is maintained. If low flow O2 is available it can be entrained through the Fresh
Gas/Emergency Air Intake port using the optional O2 reservoir. Maintain an acceptable SpO2 by adjusting the
O2 supply up or down to increase or decrease the amount of O2 delivered to the patient.


Mitigation/Info: Pneumatic System: Compressor, Operation Switched to O2 Supply, Set FIO2 to 100%, MoniSelf Check Fault
Alarm triggers when the signal to the O2 valve is outside of the calibration range for the required flow rate and
the compressor is available to provide ventilation. The medium priority alarm will continue until the user
acknowledges that ventilation is being provided using the compressor by setting the FIO2 to 21%. At this time
the alarm priority changes to low priority. While operating in this state the user should monitor the SpO2 to
ensure that adequate oxygenation is maintained. If low flow O2 is available it can be entrained through the
Fresh Gas/Emergency Air Intake port using the optional O2 reservoir. Maintain an acceptable SpO2 by
adjusting the O2 supply up or down to increase or decrease the amount of O2 delivered to the patient.


Mitigation: Pneumatic System: O2 Valve, Operation Switched to Compressor, Connect Low Flow O2, Monitor
Self Check Fault
Alarm triggers when the communication between the O2 valve and the SPM fails and the compressor is available to provide ventilation. The alarm will continue to sound as a medium priority alarm until the user
acknowledges that ventilation is being provided using the compressor by setting the FIO2 to 21%. At this time
the alarm priority changes to low. While operating in this state the user should monitor the SpO2 to ensure
that adequate oxygenation is maintained. If low flow O2 is available it can be entrained through the Fresh
Gas/Emergency Air Intake port using the optional O2 reservoir. Maintain an acceptable SpO2 by adjusting the
O2 supply up or down to increase or decrease the amount of O2 delivered to the patient.
Mitigation/Info: Pneumatic System O2 Valve, Set FIO2 To 21%, Connect Low Flow O2, Monitor SpO2

5-12




Low O2 Supply Fault
Alarm triggers when the O2 supply pressure is <35 psig (241 kPa) and the compressor is able to support ventilation. When this occurs the device begins ventilation using the compressor. The alarm will continue to
sound as a medium priority alarm until the user acknowledges that ventilation is being provided using the
compressor by setting the FIO2 to 21%. The alarm will cancel completely when the user sets to 21%. NOTE:
The device works with or without external O2. If O2 is connected the device will not continue O2 operation
unless the supply pressure is ≥40 psig (276 kPa). This is done to prevent continuous cycling between alarms
during the inspiratory phase and no alarm during the expiratory phases. If low flow O2 is available it can be
entrained through the Fresh Gas/Emergency Air Intake port using the optional O2 reservoir. Maintain an
acceptable SpO2 by adjusting the O2 supply up or down to increase or decrease the amount of O2 delivered
to the patient.


Gas Intake Fault
Alarm triggers when the Fresh Gas/Emergency Air Inlet is blocked so that the compressor is not able to
deliver a breath within ±10% of the current settings and high pressure O2 is available to support ventilation.
When this occurs the ventilator immediately switches to O2 powered ventilation. To clear the alarm first set
the FIO2 to 100% to acknowledge that the patient is being ventilated at 100%, clear the blockage and then
set the FIO2 back to the original value. Once the blockage has been cleared operation with the compressor
will restart. If the blockage cannot be cleared, the alarm will resound, continue ventilation with FIO2 set to
100% and ensure an adequate supply of O2. NOTE: A high vibration environment can trigger this alarm. If
necessary, the user can activate the O2 Reservoir Mode while continuing to operate normally. This will sup-


press the alarm.
Self Check Fault
Alarm triggers when the expiratory time is <170 ms for 3 consecutive breaths. When this occurs the device
attempts to reestablish a baseline by momentarily setting PEEP to 0 cm H2O and suspending triggered
breaths. This interruption lasts no longer than 2 breath cycles. The user should also check for leaks in the
hose and tubes, patient airway and exhalation valve. If recalibration is successful the alarm will automatically
cancel. If the device does not reset, manually ventilated the patient, replace the ventilator and contact the
service center for additional information.
Mitigation/Info: Pneumatic Sensor: Airway Pressure, Check Circuit for Leaks/Disconnects, , Check Tube


Exhalation System Fault
Alarm triggers when the airway pressure, PIP, measured at the end of expiration is >5 cm H2O above the
baseline pressure, PEEP. This is typically caused by a restriction of the exhalation valve or an occlusion/kink
in one or more of the breathing circuit tubes or hose. If the breathing circuit tubes appear to be intact the circuit should be replaced to eliminate the possibility of a bad exhalation valve. If the condition does not resolve
the user should manually ventilate the patient, replace the ventilator and contact the service center for additional information.
Mitigation/Info: Check Patient Exhalation, Check Circuit for Kinked Hose/Tube, Check for Blocked Exhalation


Airway Pressure High
Alarm triggers when the airway pressure, PIP, is > the high airway pressure limit for 2 consecutive breaths.
When the limit is reached, the flow decelerates to keep the PIP below the airway pressure for the duration of
the breath (inspiratory time). The user should check for kinks or blockage of the breathing circuit, exhalation
valve or patient airway. In some instances the cause can be an accumulation of secretions in the airway
which will require suctioning to clear. The user should also assess if the patient is fighting the ventilator, asynchrony, or if the high airway pressure limit is set too low.
Mitigation/Info: Pressure Exceeds Limit Setting, Check Circuit for Kinked Hose/Tube, Check for Airway


ZOLL Ventilator Operator’s Guide

5-13

ALARMS

Low Airway Pressure
Alarm triggers when the airway pressure, PIP, is < the low airway pressure limit for 2 consecutive breaths.
The user should check for leaks/disconnects in the breathing circuit, patient airway or a failure of the exhalation valve. The user should also assess if the patient is breathing with the ventilator, the PIP or tidal volume
are set too low, or if the low airway pressure limit is set too high. If a replacement is available the user should
replace the breathing circuit. If these mitigations do not resolve the alarm condition, replace the ventilator and
contact the service center for more information.
Mitigation/Info: Check Patient Connection, Check Circuit For Loose Hose/Tube, Check Exhalation Valve,


High Tidal Volume
Alarm triggers during pressure targeted ventilation when the delivered tidal volume exceeds the user defined
limit for 2 consecutive breaths. This can be caused by a leak in the patient connection or breathing circuit.
When the ventilator is not able to reach the pressure target flow increases to compensate which leads to a
high delivered tidal volume. It is critical to set this alarm with infant and pediatric patients given that the high
resistance airways used with these patients can provide a false airway pressure even when the patient has
extubated or decannulated. The user should check for leaks/disconnects in the breathing circuit, patient airway or a failure of the exhalation valve. Users should also assess if the patient is anxious and breathing
deeply or if the high tidal volume limit is set too low. If a replacement is available the user should replace the
breathing circuit.


Mitigation/Info: Check Patient Connection, Check Circuit For Loose Hose/Tube, Check Exhalation Valve,
Low Tidal Volume
Alarm triggers during pressure targeted ventilation when the delivered tidal volume does not reach the user
defined limit for 2 consecutive breaths. When this occurs flow decelerates to maintain the airway pressure at
airway pressure limit for the duration of the breath (inspiratory time). If the PIP setting is set properly the
breath should be greater than the low limit, provided it is set correctly. The user should check for kinks or
blockage of the breathing circuit or patient airway. In some instances the cause can be an accumulation of
secretions in the airway which will require suctioning to clear. The user should also assess if the patient is
fighting the ventilator, asynchrony, or if the PIP target is set too low.
Mitigation/Info: Check Circuit For Kinked Hose/Tube, Check For Airway Obstruction, Suction Airway If Nec-


High Breath Rate
Alarm triggers when the actual breathing rate (set rate plus spontaneous patient rate) exceeds the high alarm
limit. This can be caused by the patient breathing too fast due to anxiety or pending respiratory failure. It can
also be caused by autotriggering due to a leak or the when the spontaneous/assisted breath trigger is set too
close to the baseline pressure, PEEP. The user should check for leaks/disconnects in the breathing circuit,
patient airway or a failure of the exhalation valve. The user should also assess if the patient is anxious and
breathing deeply or if the high tidal volume limit is set too low. If a replacement is available the user should
replace the breathing circuit.


Mitigation/Info: Check For Loose Circuit Connection, Check Trigger Setting, Check High Alarm Limit Setting,
Low Breath Rate/Apnea
Alarm triggers when the actual breathing rate (set rate plus spontaneous patient rate) is less than the low
alarm limit. This can be caused by the patient not breathing or breathing at a rate less than the limit. If the
spontaneous/assisted breath trigger is not sensitive enough the patient may not be able to trigger breaths.
The user should also determine if the low rate is set too high for the patient.


Mitigation/Info: Check Patient for Spontaneous Breathing, Adjust Breath Trigger, Check Low Alarm Limit Setting, Increase Ventilation Support, ** Manually Ventilate Patient**
Apnea
Alarm triggers when the spontaneous breathing rate is less than the low alarm limit. This alarm only occurs in
noninvasive ventilation, CPAP and BL modes. The alarm can be caused by the patient not breathing or
breathing at a rate less than the limit. The apnea backup ventilation starts automatically when the alarm is
triggered. The user should select and active mode of ventilation, AC or SIMV, to support the patient.
Mitigation/Info: Apnea Backup Ventilation Started, Set Mode to AC or SIMV, Set Rate and Tidal Volume/
Pressure Target, ** Manually Ventilate Patient**

5-14





PEEP Leak
Alarm triggers when the airway pressure drops below the PEEP setting by 2 cm H2O during the expiratory
phase of the breath. This can be caused by a leak in the breathing circuit, exhalation valve or patient airway.
The user should check the breathing circuit and exhalation valve to ensure that all connections are tight. If the
circuit appears damaged or is suspect it should be replaced. The user should also check if there is a cuff leak
from the patient’s airway or mask. If these mitigations do not resolve the alarm the user can choose to use
leak compensation to provide additional flow during the expiratory phase to compensate for the leak. If you
still cannot compensate for the leak, consult the attending physician. If this fails replace the ventilator and
contact the service center for more information.


Insufficient Flow
Alarm triggers when the pressure target is not reached during the inspiratory period during pressure targeted
ventilation. Typically this can occur when the Rise Time is set too low for the patient and their respiratory
mechanics. Decrease the Rise Time and check the circuit and exhalation valve for leaks or disconnects. If
the flow cannot be adjusted appropriately then the patient should be ventilated using volume targeted ventilation.
Mitigation/Info: Pressure Target Not Met, Decrease Rise Time , Press/Hold BPM Button, Consult Physician,


** Ventilate With Volume Target**
Patient Disconnect
Alarm triggers when the airway pressure fails to exceed the PEEP setting by ~7 cm H2O. When this occurs
the user should quickly check the patient connection, breathing circuit connections and the exhalation valve.
At times this alarm can be caused by the patient breathing with the ventilator during inspiration which prevents the PIP from passing the minimum pressure. While resolving the alarm condition the user should be
sure to manually ventilate the patient.
Mitigation/Info: Check Patient Connection, Check Circuit for Loose Hose/Tube, Check Exhalation Valve,
Check Patient, Replace Circuit, **Manually Ventilate Patient**


Patient Detected
An alarm triggers when you connect the patient to the ventilator while the Start Menu is still active. To resolve
the alarm, you must select a mode of ventilation and configure the device appropriately for the patient. In
addition, you should perform the Operational Test procedure before reconnecting the patient to the device.
Mitigation/Info: Backup Ventilation Started, Set Mode (AC, SIMV, CPAP, BL), Configure Other Settings,
**Manually Ventilate Patient and Restart**


Spont. Breath PIP High
Alarm triggers when the airway pressure, PIP, exceeds the High PIP Limit Setting during 2 consecutive spontaneous breaths. The user should quickly check for kinked hoses/ tubes and check for airway obstruction.
Suctioned the patient if necessary. The user should also check if the High PIP limit is set correctly of if the
pressure support (PS) level is set too high. While resolving the alarm condition the user should be sure to
manually ventilate the patient.


Mitigation/Info: Pressure Exceeds Limit Setting, Check Circuit for Kinked Hose/Tube, Check for Airway
Obstruction, Suction Airway if Necessary, Check High Limit Setting, **Manually Ventilate Patient**
Spont. Breath PIP Low
Alarm triggers when the airway pressure, PIP, exceeds the Low PIP Limit Setting during 2 consecutive spontaneous breaths. The user should quickly check circuit for loose hoses/ tubes and also check the exhalation
valve and the tube placement/ cuff. The user should also check if the Low PIP Limit is set correctly. While
resolving the alarm condition the user should be sure to manually ventilate the patient.
Mitigation/Info: Check Patient Connection, Check Circuit for Loose Hose/Tube, Check Exhalation Valve,
Check Tube Placement/ Cuff, Check Low Limit Setting, **Manually Ventilate Patient**


ZOLL Ventilator Operator’s Guide

5-15

ALARMS

Spont. Breath Vt High
Alarm triggers when the high VT Limit is exceeded during 2 consecutive spontaneous breaths. The user
should check: the patient connection, airway placement, breathing circuit for loose hoses/ tubes and also
check the exhalation valve. The user should also check if the High VT Limit is set correctly. While resolving
the alarm condition the user should be sure to manually ventilate the patient.


Mitigation/Info: Check Patient Connection, Check Circuit for Loose Hose/Tube, Check Exhalation Valve,
Check Tube Placement/ Cuff, Check Limit Setting, **Monitor Patient**
Spont. Breath Tt Low
Alarm triggers when the Low VT Limit Setting is not achieved during 2 consecutive spontaneous breaths.
When this occurs, the user should quickly check for kinked hoses/ tubes and check for airway obstruction.
The patient should be suctioned if necessary. The user should also check if the Low VT limit is set correctly.
While resolving the alarm condition the user should be sure to manually ventilate the patient.


Mitigation/Info: Check Circuit for Kinked Hose/Tube, Check for Airway Obstruction, Suction Airway if Necessary, Check Low Limit Setting, **Manually Ventilate Patient**
Self Check Fault
Alarm triggers when the pulse oximeter module fails while in use. The user cannot resolve the fault. When the
alarm is active “-- --” displays in the HR and SpO2 windows. Pressing the Mute/Cancel button silences the
audible alarm for 30 seconds. To resolve the alarm, remove the probe from the device and put the pulse
oximeter in standby “stby”. Contact the service center for additional information.
Mitigation/Info: Pulse Ox Module, Internal Failure, SpO2/HR Not Available from Pulse Ox, Turn Off Pulse Ox,


Self Check Fault
Alarm triggers when the communication between the pulse oximeter module and device fails. When this
occurs the user must turn off the pulse oximeter monitor to end the alarm condition through the SpO2 Context
menu while also removing the probe from the device. When this is done “stby“ appears in the parameter windows for SpO2 and HR as those parameters are no longer available. When appropriate the user should
replace the ventilator and contact the service center for additional information.


Mitigation/Info: Internal COMM: Pulse Ox Module, SpO2/HR Not Available from Pulse Ox, Turn Off Pulse
Ox, Remove SpO2 Cable from Ventilator, **Contact Service Center**
Pulse Ox Sensor Off Patient
Alarm triggers when an operating sensor loses the patient signal. The most common cause is when the sensor disconnects from the patient or is misaligned with the sensor site. This alarm can also be caused by poor
perfusion at the sensor site which doesn’t provide an adequate signal. In these cases try another site.
Replace the sensor if another sensor is available. If the alarm condition cannot be resolved the user should
remove the sensor from the patient and put the pulse oximetry monitor in standby “stby”.


Mitigation/Info: Check Pulse Ox Sensor Site, Check Patient for Peripheral Pulse, Change Placement, Check
Sensor Operation, Replace Sensor,**Turn Off Pulse Ox Monitoring**
SpO2 Low
Alarm triggers whenever the SpO2 value drops below the Low SpO2 Limit. The default value for the limit is
94%. Corrective actions are increasing oxygenation by increasing the FIO2 or PEEP settings. PEEP should
only be changed based on consultation with the attending physician. When using low flow O2 the user should
increase the flow of O2 to the low flow O2 reservoir.
Mitigation/Info: SpO2 Below Limit, Increase FIO2, Check O2 Supply, Increase PEEP Per Physician, **Con-


Heart Rate High
Alarm triggers when the heart rate is greater than the High Heart Rate Limit. The default value for the limit is
120 beats/minute. The user should consult with the attending physician on how best to reduce the heart rate
to an acceptable level.
Mitigation/Info: Heart Rate Above Limit, Check High Limit Setting, **Consult Physician**

5-16




Heart Rate Low
Alarm triggers when the heart rate is less than the Low Heart Rate Limit. The default value for the limit is 40
beats/minute. The user should consult with the attending physician on how best to increase the heart rate to
an acceptable level.
Mitigation/Info: Heart Rate Below Limit, Check Low Limit Setting, **Consult Physician**


Self Check Fault


Alarm triggers when there is a failure of the input protection circuit and the device is able to operate. The
alarm will continue until the device is turned off. The user can mute the alarm for 30 seconds by pushing the
MUTE/CANCEL button. The user should replace the ventilator and contact the service center for additional
information.
Mitigation/Info: Power System, Power System Needs Repair, Internal Battery Operation, Monitor Battery %
Charge, **Contact Service Center**
Self Check Fault
Alarm triggers when the internal power circuit has failed and external power is connected but cannot be used.
The fault cannot be repaired by the user. Pressing the Mute/Cancel button silences the audible alarm for 30
seconds. Replace the ventilator and contact the service center for additional information.
Mitigation/Info: Power System, Power System Needs Repair, Internal Battery Operation, Monitor Battery %
Charge, **Contact Service Center**


Nearly Drained Battery
Alarm triggers when the device detects that there is ≤5 minutes of battery operation remaining and external
power is not connected. The user should immediately seek a source of external power and/or plan to provide
manual ventilation. Attaching external power will immediately clear the alarm though a low priority alarm will
remain until the internal battery has recharged so that the device can provide 30 minutes of operating time.
This will take approximately 5 to 10 minutes. If recharging the battery does not resolve the issue, contact the
service center for additional information.
Mitigation/Info: <5 Minutes Operation, Connect External Power, Ensure Ability to Manually Ventilate, ** Con-


Battery Discharge Fault
Alarm triggers when the battery temperature reaches 70 °C (158 °F) which is 5 °C from its maximum operating temperature using the internal battery and external power is not connected. When the battery temperature reaches 75 °C (167 °F) the battery will shut down to prevent failure and the device will sound a high
priority alarm and shutdown. If possible the user should provide a source of external power which will allow
operation to continue at the current and higher temperatures. In addition, the device should be removed from
the soft case which acts as insulation. Shading the patient and ventilator from direct sunlight may also help
reduce the battery temperature.


Mitigation/Info: Battery Within 5 °C of High Limit, Remove Padded Case, Ensure External Power Available,
Ensure Ability to Manually Ventilate, **Move To Cooler Location**
Battery Fault
Alarm triggers when the device is not able to communicate with the internal battery. When this occurs the
device does not know the current charge of the battery and operation could stop at any time. To continue
operation and the user should connect external power and ensure the ability to manually ventilate the patient.
When external power is connected the alarm priority decreases to Low Priority, replace the ventilator and
contact the service center.
Mitigation/Info: Battery Communication, Connect External Power, Ensure Ability to Manually Ventilate
Patient , **Contact Service Center**


ZOLL Ventilator Operator’s Guide


5-17

ALARMS

Low Priority Alarms

Service
Alarm Name/Mitigation/Resolution
Code

Self Check Fault
Alarm triggers when the compressor fails to operate or fails to provide the flow required to deliver a breath
within ±10% of the current settings, high pressure O2 is available to provide ventilation and the user has
set the FIO2 to 100%. While operating in this state the user should ensure an adequate supply of O2. Failure to maintain the O2 supply will result in a high priority alarm. The user cannot repair the compressor,
replace the ventilator and contact the service center for additional information.
Mitigation: Pneumatic System Compressor, Ensure 55 psig/380 kPa O2, O2 Operation Only, **Contact


Self Check Fault
Alarm triggers when communication between the compressor controller and SPM is lost, high pressure O2
is available to provide ventilation and the user has set the FIO2 to 100%. While operating in this state the
user should ensure an adequate supply of O2. Failure to maintain the O2 supply will result in a high priority


alarm. The user cannot repair the device, replace the ventilator and contact the service center for additional
information.
Mitigation: Pneumatic System: Compressor, Ensure 55 psig.380 kPa O2 Supply, O2 Operation Only, **Contact Service Center**
Self Check Fault
Alarm triggers when the signal to the O2 valve is outside of the calibration range for the required flow rate,
the compressor is available to provide ventilation and the user has acknowledged that ventilation is being
provided using the compressor by setting the FIO2 to 21%. While operating in this state the user should
monitor the SpO2 to ensure that adequate oxygenation is maintained. If low flow O2 is available it can be
entrained through the Fresh Gas/Emergency Air Inlet port using the optional O2 reservoir. Maintain an
acceptable SpO2 by adjusting the O2 supply up or down to increase or decrease the amount of O2 delivered
to the patient. The user cannot repair the O2 valve, replace the ventilator and contact the service center for
additional information.


Self Check Fault
Alarm triggers when communication between the O2 valve and SPM is lost, the compressor is available to provide ventilation and the user has set the FIO2 to 21%. While operating in this state the user
should monitor the SpO2 to ensure that adequate oxygenation is maintained. If low flow O2 is available it can be entrained through the Fresh Gas/Emergency Air Inlet port using the optional O2 reservoir. Maintain an acceptable SpO2 by adjusting the O2 supply up or down to increase or decrease the
amount of O2 delivered to the patient. The user cannot repair the O2 valve, replace the ventilator and
contact the service center for additional information.
Mitigation/Info: Pneumatic System: O2 Valve, Compressor Operation Only!, Keep FIO2 at 21%, Con-

5-18




Gas Intake Fault
Alarm triggers when the Fresh Gas/Emergency Air Inlet is blocked so that the compressor is not able to
deliver breaths within ±10% of the current settings, high pressure O2 is available to support ventilation and
the user has set the FIO2 to 100%. To clear the alarm, clear the blockage and set the FIO2 back to the original value. If the blockage is cleared operation with the compressor will restart. If the blockage is not
cleared, the alarm will resound, set the FIO2 to 100%, continue ventilation and ensure an adequate supply
of O2. It is possible for this alarm to be a false alarm that is triggered in a very high vibration environment or


if the device is not mounted correctly. If the alarm does not resolve contact the service center for additional
information.
Mitigation/Info: O2 Supply Operation, Clear Blocked Intake, Reset FIO2 to Previous, Monitor SpO2, **ConIntake Restricted
Alarm triggers when the Fresh Gas/Emergency Air Inlet is blocked but is still capable of delivering breaths
within ±10% of the current settings. This could be caused by an external blockage or a dirty/wet external or
internal filter. If the blockage is cleared the alarm will automatically cancel. Refer to instructions for changing the internal filters. If the problem does not resolve contact the service center for additional information.
On rare occasions, this alarm can be triggered by a patient with a very high inspiratory demand. In this
case increase the rise time or shorten the inspiratory time to increase the inspiratory flow rate.
Mitigation/Info: Clear Fresh Gas Intake, Check Filter for Moisture or Dirt, OR, Manage Settings / Inspiratory
Demand, **Manually Ventilate Patient**


Self Check Fault
Alarm triggers when communication between the Fresh Gas/Emergency Air Inlet pressure sensor is lost.
Normal operation can continue but, if the condition is not cleared by powering off and restarting the device
should be replaced when appropriate as. When used during this alarm condition the user should be sure to
keep the Fresh Gas/Emergency Air Inlet clear and ensure that external filters are checked regularly.
Mitigation/Info: Pneumatic Sensor, Ventilator Operating, Unable to Detect Inlet Obstruction, **Contact Ser-


High O2 Supply Fault
Alarm triggers when the high pressure O2 supply is ≥80 psig (552 kPa) and <87 psig (600 kPa). The alarm
automatically cancels when the supply pressure is <80 psig (552 kPa). Pressure above 87 psig (600kPa) could
result in a catastrophic failure, harm to the patient and/or damage to the device. The user should reduce the
O2 supply pressure, sometimes this requires replacing the regulator that is not functioning correctly. If the
pressure cannot be reduced and a low flow device like a flow meter is available the user can provide supplemental O2 via the optional low flow O2 reservoir. If not, the user should monitor the O2 supply pressure and
ensure that the pressure does not rise further.


Mitigation/Info: Decrease O2 Supply Pressure, Replace Regulator, Connect Low Flow O2, Monitor SpO2
Tubing Compliance Fault
Alarm is triggered when the tubing compliance correction shows that it is >the set tidal volume indicating that
the patient may not be receiving the appropriate tidal volume. In this case the user should assess the patient
and settings. Consult the attending physician if there are questions about how to configure the ventilator correctly to support the patient.


Mitigation/Info: Calculated Compliance Volume Larger than Delivered Volume, Check Tubing Compliance vs.
Circuit
AutoPEEP
Alarm triggers when the exhaled flow from the patient continues throughout the expiratory period causing the
expiratory control valve to cycle throughout the period to maintain the baseline pressure. When this occurs the
user should increase the expiratory period by decreasing the inspiratory time, decreasing the breathing rate or
both. The physician should also be consulted as this alarm is an indication that Auto-PEEP is occurring. Note:
at startup, this alarm is off. The user can choose to activate the alarm if they believe the patient is at risk of
Auto-PEEP using the Alarm Configuration submenu that is access using the Main Menu.
Mitigation/Info: Increase Expiratory Time, Decrease Inspiratory Time, Decrease Respiratory Rate, Disable


ZOLL Ventilator Operator’s Guide

5-19

ALARMS

Inspiratory Demand
Alarm triggers when the end-inspiratory pressure is < -1.0 cm H2O for 3 consecutive breaths. This can occur
due to changes in the patient’s status, where the patient attempts to inhale more gas than what is currently set.
When this occurs, the user should note if the patient is breathing or fighting with the vent. The user should
increase the flow rate (by decreasing the inspiratory time) and/or reduce the rise time. The physician should be
consulted.


Mitigation/Info: Patient May be Breathing with the Ventilator, Increase I Time and/or Decrease Rise Time,
Check Patient and Circuit for Leaks, Disable Alarm, **Consult Physician**
RTC Battery Low
Alarm triggers when the real-time clock (RTC) battery is < ~2.5 volts. The alarm condition is checked at start
up and if this alarm occurs the device is safe to operate but the user should replace the device when appropriate and consult the service center for additional information. The user cannot change the RTC battery. The
RTC battery provides power for the clock that tracks the local time. It is replaced every 4 years during preventive maintenance.
Mitigation/Info: Vent Fully Functional, **Contact Service Center**


PM Due
Alarm triggers at start up when the preselected number of days has elapsed since the last calibration. When
appropriate the device should be replaced and sent for preventive maintenance. The low priority message
serves as a reminder. Calibration is due every 365 days or 730 days for devices configured for stockpile use
(check with your organization regarding the configuration of your device). Users should schedule the device for
service as soon as possible. Users can suspend the yellow alarm notification for the current use by turning the
alarm off using the Alarm Configuration submenu in the Main Menu.
Mitigation/Info: Preventive Maintenance Due, Ventilator Functioning with No Faults, **When Appropriate, Con-


Power Cycle Need
This alarm occurs when the device has been running continuously for 30 days. In order to check the flow pneumotach, which is done a startup, the user should manually ventilate the patient and cycle the power. Once this
is done the user can select the Last Settings options from the Start Menu and continue operation if not faults
are detected during the self check. If nonoperating alarms occur, contact the service center for additional information.


Mitigation/Info: Power-on Self Checks are Due, When Appropriate, Power Off Then On, Verify Proper Settings,
**Review Manual For Additional Information**
Self Check Fault
Alarm triggers when the ambient pressure transducer fails. When this occurs, the device is no longer able to
automatically compensate for changes in altitude especially in situations where the ambient pressure could
change rapidly as during transport by air. When this alarm is active during aeromedical transport the user
should ventilate using pressure targeting if the ventilator cannot be replaced. Users should also monitor chest
rise and breath sounds to ensure adequate ventilation.


Mitigation/Info: Sensor: Barometer, Altitude Compensation Disabled, Maintain Airway Pressure, Check Patient
Chest Rise, Avoid Use At Varying Altitude, **Contact Service Center**
Excessive Altitude
Alarm triggers when the ambient pressure transducer detects an altitude >25,000 feet (7620 meters). Beyond
this altitude compensation remains fixed at the 25,000 ft compensation level. The user should monitor the airway pressure and reduce the tidal volume as altitude increases though, there is very little change in performance over this altitude. Where possible cabin pressure should be maintained in the compensated range.
Mitigation/Info: Beyond Altitude Compensation Limit, Maintain Airway Pressure, Check Patient Chest Rise,
Monitor Ventilator/Patient,**Reduce Altitude/ Pressurize Cabin if Possible**

5-20





Low Altitude
Alarm triggers when the ambient pressure transducer detects an altitude <-2,000 feet below sea level (610
meters, 15.8 psig or 103 kPa). This can be caused by use in subterranean rescue operation or mistaken use in
a hyperbaric chamber. Beyond this pressure level compensation remains fixed at the -2,000 ft level. NOTE:
the device is not intended for use in hyperbaric chambers or at hyperbaric pressures.
Mitigation/Info: High Barometric Pressure Detected, Beyond Compensation Limit, Maintain Airway Pressure,
Check Patient Chest Rise, Monitor Patient and Ventilator, **Reduce Ambient Pressure**


Ambient Temperature Fault
Alarm triggers when the ambient temperature exceeds the normal operating range, >131 °F (55 °C) for the
ventilator. The device allows operation at these temperatures but alerts the user to the condition. Operating
above the specified range can affect the longevity of the internal battery and the duration of operating time.
When operating at high temperatures the user should remove the padded case which insulates and increases
the ventilator’s internal temperature.


Mitigation/Info: High Temperature Detected, Remove Padded Case, **Monitor Patient and Ventilator**
Ambient Temperature Fault
Alarm triggers when the ambient temperature falls below the normal operating range <14 °F (-10 °C) for the
ventilator. The device allows operation at these temperatures but alerts the user to the condition. Operating
below the specified range can affect the longevity of the internal battery and the duration of operating time. At
extreme cold temperatures operating time can be significantly reduced. When operating at low temperatures
the user user use the padded case which insulates and increases the ventilator’s internal temperature.


Mitigation/Info: Low Temperature Detected, Use Padded Case, **Monitor Patient and Ventilator**
Self Check Fault
Alarm triggers when there is failure of the internal temperature sensors. When this occurs the device is no longer able to detect if it is operating outside of the allowable temperature range. If operating inside of the standard temperature range -25 °C to 49 °C (-13 °F to 120 °F) there is no effect on operation. If operating outside
this range the user should monitor the device continuously. When appropriate the user should replace the ventilator and contact the service center for additional information.
Mitigation/Info: Environmental Sensor: Temperature, Ventilator Operating, Service Required, **Contact Ser-


Self Check Fault
Alarm triggers when the device is not able to zero the airway pressure transducer during the autocal cycle.
When this occurs the device is still able to monitor the airway pressure safely. Large changes in temperature
should be avoided which can affect the calibration of the transducer. This alarm can also be triggered when the
device is exposed to excessive vibration and/or is mounted in a vehicle in a manner that increases its exposure to vibration. If the alarm continues, replace the ventilator and contact the service center for additional
information.
Mitigation/Info: Pneumatic Sensor: Autocal, Reduce Vibration if Possible, Avoid Temperature Changes, Auto-


Self Check Fault
Alarm triggers when the pulse oximeter module fails and the user has turned off pulse oximeter monitoring
acknowledging the condition. When this is done “stby“ appears in the parameter windows for SpO2 and HR as
those parameters are no longer available. When appropriate the user should replace the ventilator and contact
the service center for additional information.


Mitigation/Info: Pulse Ox Module Not Available, SpO2/HR Not Available, **Contact Service Center**
Self Check Fault
Alarm triggers when the communication between the pulse oximeter module and device fails and the user has
turned off pulse oximeter monitoring acknowledging the condition. When this is done “stby“ appears in the
parameter windows for SpO2 and HR as those parameters are no longer available. When appropriate the user
should replace the ventilator and contact the service center for additional information.
Mitigation/Info: Internal COMM: Pulse Ox, SpO2/HR Not Available, **Contact Service Center**


ZOLL Ventilator Operator’s Guide

5-21

ALARMS

Pulse Ox Sensor Not Connected
Alarm triggers when the pulse oximeter detects that no SpO2 sensor is connected after a period of successful
operation. NOTE: during start up the device automatically detects if a sensor is connected. If it is, the device
begins operation with the pulse oximeter active. If no sensor is detected the device turns off this function. If the
sensor is properly connected this failure can also be the result of a broken or defective sensor. If the alarm
condition cannot be resolved the user should remove the sensor and turn off pulse oximetry monitoring using
the SpO2 Context menu to put the monitor in standby. Contact the service center for additional information.


Mitigation/Info: Check Pulse Ox Sensor, Check Sensor/Ventilator Connection, Reinsert Sensor, Replace
Cable/Sensor, Replace Sensor, **Contact Service Center**
Defective Pulse Ox Sensor
Alarm triggers when the pulse oximeter cannot identify the connected sensor or the sensor has failed. Causes
for this alarm include: broken sensor cable, inoperative sensor LEDs and/or faulty detector. If the alarm condition cannot be resolved the user should suspend pulse oximetry monitoring by placing it in standby “stby”
using the SpO2 Context menu.
Mitigation/Info: Check Pulse Ox Sensor, Check Sensor/ Ventilator Connection, Reinsert Sensor, Cable/Sensor Damaged?, Replace Sensor, **Turn Off Pulse Ox Monitoring**


Pulse Search
Alarm triggers when the pulse oximeter is searching for a pulse signal. If a value is not displayed within 30 seconds disconnect and reconnect sensor and reapply to the patient. If pulse search continues relocate it to a site
that may have better perfusion. Replace the sensor if another sensor is available. If the alarm condition cannot
be resolved the user should suspend pulse oximetry monitoring by placing it in standby “stby”.
Mitigation/Info: Please Wait Acquiring Signal, Check Sensor Placement, Change Placement of Probe, Minimize Patient Movement, Check Sensor Operation/Replace, **Turn Off Pulse Ox Monitoring**


Pulse Ox Signal Interference
Alarm triggers when an outside signal or energy source prevents accurate reading by the device. When this
occurs the patient should be moved from the location or pulse oximeter turned off.


Mitigation/Info: External Signal Interfering With Measurement , Remove Patient From Location, **Turn Off
Pulse Ox Monitoring**
Ambient Light Fault
Alarm triggers when there is too much ambient light on the SpO2 sensor or there is inadequate tissue covering
the sensor detector. Most often this alarm condition can be resolved by shielding the sensor from ambient
light.


Mitigation/Info: Too Much Ambient Light, Shield Sensor From Light, Change Sensor Placement, Check Sensor
Operation, Replace Sensor, **Turn Off Pulse Ox Monitoring**
Invalid Pulse Ox Sensor
Alarm triggers when the pulse oximeter does not recognize the connected sensor, i.e. a non-Masimo sensor.
The alarm can also occur when there is a broken sensor cable, inoperative LEDs, a fault is detected and/or the
sensor has failed. To resolve the alarm condition the sensor should be replaced. If the alarm condition cannot
be resolved the user should turn off pulse oximetry monitoring by placing it in standby “stby”.
Mitigation/Info: Replace Sensor, **Turn Off Pulse Ox Monitoring**


Low SpO2 Perfusion
Alarm triggers whenever the amplitude of the arterial pulsation is weak. Low perfusion typically occurs in
patients with poor circulation or when the sensor is applied to the same limb as the noninvasive blood pressure
(NIBP) cuff. To resolve the alarm condition, move the sensor to a better perfused site or to another limb if the
interference is from the NIBP cuff.
Mitigation/Info: Pulse Signal Weak, Check Sensor Placement, Change Sensor Placement, Check Sensor
Operation, **Turn Off Pulse Ox Monitoring**

5-22




Low SpO2 Perfusion
Alarm triggers when the pulse oximeter determines the quality of the input signal is low due to excessive
motion or artifact. To resolve the alarm minimize patient movement and make sure the sensor is properly
applied.
Mitigation/Info: Signal Artifact, Minimize Patient Movement, Check Sensor Placement, Check Sensor Operation, **Turn Off Pulse Ox Monitoring**


External Power Low / Disconnect
Alarm triggers when the external power (either AC or DC) drops below minimum level (~11 VDC as supplied
by either the AC/DC Power Supply or a direct DC source) or power is intentionally disconnected. Since the
device operates with either external power or using its internal battery this is a low priority alarm that clears
when the user presses the Mute button. Pressing the Mute button is the user’s acknowledgement that the
device is operating on internal battery. If this alarm occurs and the user believes that the device is still connected to external power the user should investigate the external power source and contact the service center
for additional information.
Mitigation/Info: Internal Battery Operation, Check Power Connection/Supply, Monitor Battery Status


Battery Fault
Alarm triggers when the internal battery has been removed or communication between the battery and CPU
has failed. When external power is applied the device is capable of operation however, loss of external power
will result in loss of ventilation and a high priority alarm. Operating in this state should only be done when no
other alternatives are available.
Mitigation/Info: Battery Power Not Available, DO NOT Remove External Power!, Maintain External Power
**Contact Service Center**


Battery Charging Fault
Alarm triggers when the battery charging circuit fails. When this alarm is active, the battery cannot be charged.
The device can only run with external power. If power is lost, ventilator will stop and a high priority alarm will
trigger. Operating in this state should only be done when no other alternatives are available. Contact the service center for additional information.
Mitigation/Info: Ventilator Operating, Power System Needs Repair, Battery Cannot Charge, Maintain External
Power, **Contact Service Center**


Low Battery
Alarm triggers when the device detects that there is <30 minutes of battery operation remaining and no external power is connected. The user should seek a source of external power and/or plan to provide manual ventilation. Attaching external power will immediately clear the alarm however, alarm #3431 will occur in its place,
see below.
Mitigation/Info: <30 Minutes Operation, Connect External Power, Ensure Ability to Manually Ventilate, **Contact Service Center**


Low Battery
This triggers when external power is connected to a device that has an internal battery that has drained to a
low battery status. The device is warning the user that in the event of an external power failure the device has
<30 minutes of backup. This alarm will resolve when the internal battery charge has >30 minutes of operation.
The user must maintain constant monitoring of the device and the patient during this period.
Mitigation/Info: <30 Minutes Operation, Operating With External Power, Continue Charging With External
Power, Ensure Ability To Manually Ventilate, **Contact Service Center**


ZOLL Ventilator Operator’s Guide


5-23

ALARMS

External Power Fault
Alarm triggers when the supplied DC power is >33 VDC. When this occurs the device automatically switches
to operation using the internal battery. If the supplied voltage drops to <30 VDC the device automatically
returns to operation using external power. If the external power source is known to be good then the AC/DC
Power Supply may be faulty and need replacement. Contact the service center for additional information.
Mitigation/Info: External Voltage Too High, Internal Battery Operation, Check/Replace Power Supply


External Power Fault
Alarm triggers when the external power supply has insufficient current. When this occurs the device automatically switches to operation using the internal battery. If the external power source is known to be good then the
AC/DC Power Supply may be faulty and need replacement. Contact the service center for additional information.


Mitigation/Info: External Power Insufficient Current, Internal Battery Operation, Check/Replace Power Supply,
**Remove DC Connection**
External Power Fault
Alarm triggers when the voltage polarity is reversed when the device is attached to an external DC source.
When this occurs the device automatically switches to operation using the internal battery. This condition is
most likely caused by a faulty DC source. The user should seek an alternate power source.
Mitigation/Info: DC Voltage Reversed, Internal Battery Operation, Disconnect Power Source


**Replace Power Source**
Battery Discharge Fault
Alarm triggers when the battery temperature reaches 70 °C (158 °F) which is 5 °C from its maximum operating
temperature and external power is connected. When the battery temperature reaches 75 °C (167 °F) the battery will shut down to prevent failure. When this occurs the device will continue operation using external power
only. The device should be removed from the padded case which acts as insulation. Shading the patient and
ventilator from direct sunlight may also help reduce the battery temperature.


Mitigation/Info: Battery Within 5 °C of High Limit, Remove Padded Case, Continue External Power Operation,
Shade Patient and Ventilator, **Move To Cooler Location**
Battery Discharge Fault
Alarm triggers when the battery temperature reaches ≥75 °C (167 °F) and external power is connected. Discharging the battery beyond this temperature could destroy the battery and damage the device. During the
alarm condition the device will continue operation using external power. The device should be removed from
the padded case which acts as insulation. Shading the patient and ventilator from direct sunlight may also help
reduce the battery temperature.


Mitigation/Info: Battery Too Hot to Discharge, Do NOT Remove External Power!, Remove Padded Case,
Ensure Ability to Manually Ventilate Patient, **Move To Cooler Location**
Battery Charging Fault
Alarm triggers when the battery temperature is >45 °C (122 °F). Charging the battery above this temperature
could destroy the battery and damage the device. During the alarm condition the device continues to operate
using external power and if external power is lost the device will operate using internal battery power. The
device should be removed from the padded case which acts as insulation. Shading the patient and ventilator
from direct sunlight may also help reduce the battery temperature.


Mitigation/Info: High Battery Temperature, Battery Does Not Charge When It is Too Hot, Ensure External
Power Available, Remove Padded Case, Shade Patient and Ventilator, **Move To Cooler Location**
Battery Charging Fault
Alarm triggers when the battery temperature is ≤0 °C (32 °F). Charging the battery below this temperature
could destroy the battery and damage the device. During the alarm condition the device continues to operate
using external power and if external power is lost the device will operate using internal battery power. The padded case should be used because it provides insulation.
Mitigation/Info: Battery Too Cold To Charge, Ensure External Power Available, Use Padded Case
**Move to Warmer Location**

5-24




Battery Fault
Alarm triggers when the device is not able to communicate with the internal battery and external power is connected. To continue operation, the device must remain connected external power. Use in this state should only
be done if there are no other alternatives. Contact the service center for additional information.


Mitigation/Info: Battery Communication, Do Not Remove External Power, Ensure Ability to Manually Ventilate
Patient, **Contact Service Center**
Self Check Fault
Alarm triggers when the device is no longer able to communicate with the Power Interface Module (PIM).
When this occurs the user should monitor operation continuously, replace the ventilator when possible and
ensure the ability to manually ventilate the patient. Contact the service center for additional information.
Mitigation/Info: Power System, Power Management Fault, Ensure the Ability to Manually Ventilate the Patient,
Monitor Power Source, **Replace/Service Ventilator**


Self Check Fault
Alarm triggers when the device software detects that it has not been calibrated with the SPM that is inside the
device. This fault occurs when the biomedical technician fails to recalibrate the device following an SPM
change or service. When this occurs the device should be replaced when appropriate and sent to the service
center.
Mitigation/Info: Serial Number Mismatch, Hardware Compatibility Failure, Update Calibration Records


ZOLL Ventilator Operator’s Guide

5-25

ALARMS

Pop Up Messages

Alarm Name/Information/Message
Silent/Dark Mode Enabled
Popup triggers when the user attempts to begin operation using Silent/Dark mode. In order to proceed the
user must press the Accept button to begin operation. Note: not all devices are provided with the capability
to operate with Silent/Dark mode, please check with your organization.
Message: Press Accept Key to Enter Silent/Dark Mode Now
Requested Compressor Flow Too Low
Popup triggers when the rate/tidal volume/FIO2 combination requires a flow that is less than the flow capability of the compressor. Resolution involves changing a setting to increase the flow required from the compressor if possible. Note: this condition is only possible with infant setting and for FIO2 <25%.
Mitigation/Info: Reduce FiO2, increase BPM, reduce I Time, or increase Vt
Requested Compressor Flow Too High
Popup triggers when the user attempts to adjust the ventilator so that flow from the compressor is >100 l/
min.
Message: Cannot exceed 100 LPM total flow
Requested O2 Flow Too Low
Popup triggers when the rate/tidal volume/FIO2 combination requires a flow that is less than the flow capability of the O2 valve. Resolution involves changing a setting to increase the flow required from the O2 valve if
possible. Note: this condition is only possible with infant setting and for FIO2 <25%. Message: Increase FiO2,
increase BPM, reduce I Time, or increase Vt
Requested O2 Flow Too High
Popup triggers when the user attempts to adjust the ventilator so that flow from the O2 valve is >100 l/min.
Message: Cannot exceed 100 LPM total flow
Total Requested Flow Too High
Popup triggers when the user attempts to adjust the ventilator so that the combined flow from the compressor and O2 valve is >100 l/min.
Message: Cannot exceed 100 LPM total flow
Requested Compressor Flow Too High
Popup triggers when the user attempts to adjust the ventilator so that combined flow from the compressor
and O2 valve is <2 l/min.
Message: Cannot flow less than 2 LPM total flow
Alarm Disable
Popup triggers when the user attempts to adjust to disable an alarm by setting the value to 0 or the maximum value which would render the alarm essentially off.
Message: Confirmation required -- press accept key to disable alarm
BPM Setting Conflict
Popup triggers when the user attempts to set the BPM to a value that would result in an inspiratory time (I
Time) >3 seconds.
Message: I Time cannot exceed 3 seconds

5-26




BPM Setting Conflict
Popup triggers when the user attempts to set the BPM to a value that would result in an inspiratory time (I
Time) >5 seconds during inverse I:E ratio ventilation.
Message: I Time cannot exceed 5 seconds with inverse I:E
E Time Range Exception
Popup triggers when the user attempts to set the BPM to a value that would result in an expiratory time (E
Time) <0.3 seconds.
Message: E Time must be greater than 0.3 seconds
I:E Setting Conflict
Popup triggers when the user attempts to transition from AC mode using an inverse I:E ratio to another
mode where inverse I:E is not allowed.
Message: Inverse I:E only allowed in AC - Mode change will reset I:E to 1:3
I:E Setting Conflict
Popup triggers when the user attempts to set an inverse I:E ratio in an mode other than Assist/Control (AC).
Message: Inverse I:E Not Allowed
BPM Setting Conflict
Popup triggers when the user attempts to set a BPM rate that will result in an I:E ratio >1:99.
Message: I:E > 1:99 not allowed
I Time Range Exception
Popup triggers when the user attempts to adjust the ventilator so that flow from the compressor is >100 l/
min.
Message: Cannot exceed 100 LPM total flow
I Time Range Exception
Popup triggers when the user attempts to SET inspiratory time (I Time) >5 seconds during inverse I:E ratio
ventilation.
Message: I Time cannot exceed 5 seconds with inverse I:E
I Time Range Exception
Popup triggers when the user attempts to set an inspiratory time (I Time) <0.1 seconds.
Message: I Time must be greater than 0.1 seconds
I:E Range Exception
Popup triggers when the user attempts to set an inverse I:E ratio <4:1.
Message: I:E < 4:1 not allowed
I:E Range Exception
Popup triggers when the user attempts to set an I:E ratio >1:99.
Message: I:E > 1:99 not allowed
Vt Limit Conflict
Popup triggers when the user attempts to set the Vt lower than the Vt Low alarm limit.
Message: Cannot adjust Vt Set below Vt Low Alarm
Vt Limit Conflict
Popup triggers when the user attempts to set the Vt higher than the Vt High alarm limit.
Message: Cannot adjust Vt Set above Vt High Limit
High Vt Setting
Popup triggers when the user attempts to Vt >1000 ml. To do this, the user must press the Accept button
and then continue to set a value >1000 ml followed by Accept again to confirm the setting change.
Message: Confirmation required -- press accept key to allow Vt > 1000ml


ZOLL Ventilator Operator’s Guide

5-27

ALARMS
PEEP Setting Conflict
Popup triggers when the user attempts to set the PEEP setting ≤5 cm H2O below the PIP High pressure
limit.
Message: Cannot adjust PEEP target to within 5 of PIP High Limits
PEEP Setting Conflict
Popup triggers when the user attempts to configure the ventilator so that the PEEP plus the pressure support (PS) are > the PIP High pressure limit.
Message: PEEP + PS cannot be greater than PIP High Limit
PEEP Backup Setting Conflict
Popup triggers when the user attempts to set the PEEP setting ≤5 cm H2O below the Apnea Backup PIP
pressure during CPAP or BL mode ventilation.
Message: Cannot adjust PEEP target to within 5 of backup PIP target
PEEP Setting Conflict
Popup triggers when the user attempts to set the PEEP ≤5 cm H2O below PIP pressure.
Message: Cannot adjust PEEP target to within 5 of PIP target
PEEP+PS Setting Conflict
Popup triggers when the user attempts to set a combination of PEEP and PS that is <3 cm H2O.
Message: Cannot adjust PEEP+PS below 3
High Pressure Target Setting
Popup triggers when the user attempts to set the PIP pressure >60 cm H2O. To do this, the user must press
the Accept button and then continue to set a value >60 cm H2O followed by Accept again to confirm the setting change.
Message: Confirmation required -- press accept key to exceed 60 cmH2O
PIP Setting Conflict
Popup triggers when the user attempts to set the PIP target ≤5 of PEEP pressure.
Message: Cannot adjust PIP target to less than 5 more than PEEP
PIP Setting Conflict
Popup triggers when the user attempts to set the PIP > the PIP High pressure limit.
Message: Cannot adjust PIP target higher than PIP High Limit
BPM Limit Conflict
Popup triggers when the user attempts to set the PIP High pressure limit < the PIP Low pressure limit.
Message: Cannot adjust high limit lower than low limit
Low Breath Rate Setting
Popup triggers when the user attempts to set the BPM < 6 bpm. Doing this could, in effect, disable the
alarm for some patients. To do this, the user must press the Accept button and then continue to set a value
<6 bpm followed by Accept again to confirm the setting change.
Message: Confirmation required -- press accept key for values below 6 BPM
BPM Limit Conflict
Popup triggers when the user attempts to set the BPM Low limit > the BPM High limit.
Message: Cannot adjust low limit higher than high limit
Vt Limit Conflict
Popup triggers when the user attempts to set the Vt high limit < the Vt low limit.
Message: Cannot adjust high limit lower than low limit

5-28



Vt Limit Backup Setting Conflict
Popup triggers during CPAP or BL mode when the user attempts to set the Vt limit < the Vt low limit in the
Apnea Backup settings.
Message: Cannot adjust high limit lower than Backup Vt Setting
Vt Limit Conflict
Popup triggers when the user attempts to set the Vt high limit < the Vt setting.
Message: Cannot adjust high limit lower than Vt Setting
High Vt Limit Setting
Popup triggers when the user attempts to set the Vt limit >1500 ml. Doing this could, in effect, disable the
alarm for some patients. To do this, the user must press the Accept button and then continue to set a value
>1500 ml followed by Accept again to confirm the setting change.
Message: Confirmation required -- press accept key for values above 1500ml
Vt Limit Conflict
Popup triggers when the user attempts to set the Vt low limit < Vt high limit.
Message: Cannot adjust low limit higher than high limit
Vt Limit Conflict
Popup triggers during SIMV (V) when the user attempts to set the Vt low limit > the current Vt.
Message: Cannot adjust low limit higher than Vt Setting
High Pressure Limit Setting
Popup triggers when the user attempts to set the PIP > 60 cm H2O. To do this, the user must press the
Accept button and then continue to set a PIP >60 cm H2O followed by Accept again to confirm the setting
change.
Message: Confirmation required -- press accept key to exceed 60 cmH2O
PIP Limit Conflict
Popup triggers when the user attempts to set the PIP High limit > the PIP Low limit.
Message: Cannot adjust high limit lower than low limit
PIP Limit Backup Setting Conflict
Popup triggers during CPAP or BL mode when the user attempts to set the PIP High limit < Apnea Backup
PIP limit.
Message: Cannot adjust high limit lower than backup PIP target
PIP Limit Conflict
Popup triggers when the user attempts to set the PIP High limit < the PIP Low limit.
Message: Cannot adjust high limit lower than PIP target
PIP Limit Conflict
Popup triggers when the user attempts to set the PIP High limit < the combination of PS and PEEP pressures.
Message: Cannot adjust high limit lower than PS + PEEP
PIP Limit Conflict
Popup triggers when the user attempts to set the PIP Low limit > the PIP high limit.
Message: Cannot adjust low limit higher than high limit
Heart Rate Limit Conflict
Popup triggers when the user attempts to set the HR High limit < the HR Low limit.
Message: Cannot adjust high limit lower than low limit
Heart Rate Limit Conflict
Popup triggers when the user attempts to set the HR Low limit > the HR High limit.
Message: Cannot adjust low limit higher than high limit


ZOLL Ventilator Operator’s Guide


5-29

ALARMS
PS Conflict
Popup triggers when the user attempts to set the PS > the PIP High limit - PEEP pressure.
Message: Cannot adjust PS higher than PIP High Limit - PEEP
Leak Comp.
Popup triggers when the user attempts to initiate leak compensation (LC). To do this, the user must press
the Accept button and then select LC followed by Accept again to confirm the setting change.
Message: Some Alarms Disabled! Configure Alarms for Patient!
Mode Conflict
Popup triggers when the user attempts to initiate leak compensation (LC) during volume targeted ventilation. Note: LC is only available during pressure targeted ventilation.
Message: Cannot select Volume targeted control breaths with Leak Compensation on -- first turn Leak Compensation off
Inverse I:E
Popup triggers when the user attempts to set an inverse I:E ratio. To do this, the user must press the
Accept button and then adjust the I:E ratio to the desired inverse value and press Accept again to confirm
the setting change.
Message: Confirmation required -- press accept key to allow inverse I:E
Excessive Volume for Infant Circuit
Popup triggers when the user attempts to set a Vt >300 ml when the tubing compliance compensation is set
to Pediatric.
Message: Press accept to confirm use of adult circuit
Insufficient Volume for Adult/Ped Circuit
Popup triggers when the user attempts to set a Vt <200 ml when the tubing compliance compensation is set
to Adult.
Message: Press accept to confirm use of infant circuit
High PEEP Setting
Popup triggers during CPAP mode when the user attempts to set the PEEP >15 cm H2O. To do this, the
user must press the Accept button and then adjust PEEP to the desired value and press Accept again to
confirm the setting change.
Message: Confirmation required -- press accept key to allow PEEP above 15
High EPAP Setting
Popup triggers during BL mode when the user attempts to set the EPAP >15 cm H2O. To do this, the user
must press the Accept button and then adjust PEEP to the desired value and press Accept again to confirm
the setting change.
Message: Confirmation required -- press accept key to allow EPAP above 15
EPAP Setting Conflict
Popup triggers during BL mode when the user attempts to set the EPAP <3 cm H2O below the IPAP target.
Message: Cannot adjust EPAP target to within 3 of IPAP target
EPAP Setting Conflict
Popup triggers during BL mode when the user attempts to set the EPAP <5 cm H2O below the Apnea
Backup PIP target.
Message: Cannot adjust EPAP target to within 5 of backup PIP
PIP Limit Conflict
Popup triggers during BL mode when the user attempts to set the peak inspiratory pressure (PIP) < the
IPAP target.
Message: Cannot adjust high limit lower than IPAP target

5-30



IPAP Setting Conflict
Popup triggers during BL mode when the user attempts to set the IPAP <3 cm H2O above the EPAP setting.
Message: Cannot adjust IPAP target to less than 3 more than EPAP
IPAP Setting Conflict
Popup triggers during BL mode when the user attempts to set the IPAP < the PIP limit.
Message: Cannot adjust IPAP target higher than PIP High Limit
High IPAP Setting
Popup triggers during BL mode when the user attempts to set the IPAP >30 cm H2O. To do this, the user
must press the Accept button and then adjust IPAP to the desired value and press Accept again to confirm
the setting change.
Message: Confirmation required -- press accept key to allow IPAP above 30 cmH2O
High PEEP+PS Setting
Popup triggers CPAP mode when the user attempts to set the combination of PEEP + PS <30 cm H2O. To
do this, the user must press the Accept button and then adjust PEEP or PS to the desired value and press
Accept again to confirm the setting change.
Message: Confirmation required -- press accept key to allow PEEP+PS above 30 cmH2O
High Pressure Limit Setting
Popup triggers when the Start Menu is active and the user access either the Custom or Last Setting options
and the PIP high limit is >35 cm H2O. When the user selects one of the options where this is true, the Popup
message is triggered require the user to provide additional conformation, pressing Accept, to initiate ventilation with the option.


ZOLL Ventilator Operator’s Guide

5-31

ALARMS

5-32