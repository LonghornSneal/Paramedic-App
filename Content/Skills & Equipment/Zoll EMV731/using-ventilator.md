Chapter 4
Using the ZOLL Ventilator
This chapter describes how to use the ZOLL Ventilator.
Effective operation of the ventilator requires understanding of the following information:
•
•
•
•
•
•

The ZOLL Ventilator Interface and Parameter Windows
Changing Parameter Values
Selecting Ventilation Mode Options
Using the Pulse Oximeter
Managing Pop Up Messages
Managing Alarms


ZOLL Ventilator Operator’s Guide

4-1

USING THE ZOLL VENTILATOR

The Ventilator Interface
The ZOLL Ventilator uses a Graphical Use Interface (GUI) to display the parameter settings
and patient readings.

Changing Parameter Values
The ZOLL Ventilator helps you to manage the patient by organizing ventilatory parameters in
parameter windows on the right side of the display screen. These parameter windows display
the primary and secondary parameters and the alarm settings for that parameter. In addition, set
values and measurements appear in the auxiliary boxes at the bottom of the display screen.
Additional settings used to manage the patient are applied using the context menu for parameter
group.
The sections below describe the parameter windows and the associated context menus for each
parameter. A table addresses availability of the parameter and its use in the device models.
The parameter window values are chosen with the parameter button:
Single Press: chooses primary parameter
Multiple Presses: chooses the secondary parameter and alarm limits
Press and Hold: chooses the context menu
To prevent setting of parameter values that are outside the typical clinical range of settings, the
ZOLL Ventilator displays Pop Up messages that ask if you are sure you would like to set the
parameter beyond the typical range. We describe Pop Up messages in more detail in Chapter 5.

Parameter Buttons
The parameter windows, from lowest to highest, are
• Mode
• BPM (Breaths per Minute)
• Vt (Tidal Volume -- VT)
•
•
•
•

PIP (Peak Inspiratory Pressure)
FIO2
SpO2
HR (Heart Rate)

Mode
The ZOLL Ventilator allows you to select different ventilation modes that you can select to
optimally manage the patient:
• AC (Assist/Control) -- The patient receives either controlled or assisted breaths. When the

patient triggers an assisted breath, they receive a breath based on either the volume or
pressure target.
• SIMV (Synchronized Intermittent Mandatory Ventilation) -- The patient receives
controlled breaths based on the set breathing rate. Spontaneous breaths are either
unsupported demand flow or supported using Pressure Support.

4-2




• CPAP (Continuous Positive Airway Pressure) -- The patient receives constant positive

airway pressure while breathing spontaneously. Spontaneous breaths are either demand flow
or supported using Pressure Support.
• BL (Bi Level) -- the ventilator provides two pressure settings to assist patients breathing
spontaneously: a higher inhalation pressure (IPAP) and a lower exhalation pressure (EPAP).
Press the Mode parameter button to highlight the current ventilation mode. Press the Mode
parameter button again to select volume or pressure targeting which is shown as either “(V)”
for volume or “(P)” for pressure.


ZOLL Ventilator Operator’s Guide

4-3

USING THE ZOLL VENTILATOR

Breath Target
The selected ventilation mode, and the selection of breath target (volume or pressure)
predetermines the parameter availability for the BPM, Vt, and PIP parameter windows.
Volume targeting assures a constant volume is delivered to the patient in the inspiratory time
using a constant flow.
Pressure targeting provides a constant airway pressure for the duration of the inspiratory time

Leak Compensation
Leak Compensation provides flow during the expiratory phase to maintain the baseline
pressure in patients that are breathing spontaneously, but have a leaking airway or facemask
To avoid nuisance alarms in patients with active leaks, Leak Compensation suppresses he
following alarms:
• Incomplete Exhalation (Alarm #3091)
• Insufficient Flow (Alarm #2095)

The following table lists the ventilator modes and their availability in the ZOLL ventilator
models, and gives the options and ranges for the ventilation mode parameters:

Parameter Window
Primary Value

Mode

Secondary
parameter Values

Target

LC

Options /
Range
AC
SIMV
CPAP
BL
(V) or (P)

On or OFF
Default off
Default on

Alarms

N/A

Measured Value

N/A

Apnea Back Up Context Menu

Availability/Notes

Models

AC and SIMV modes

All
EMV+, Eagle II
All
All
All

AC(P), SIMV(P) modes
BL modes
CPAP

(SIMV not available
with AEV)
EMV+, Eagle II
All

CPAP and BL modes

Apnea Back Up

BPM

1 to 80

All

Apnea Back Up

PIP

10 to 80

All

Apnea Back Up

I:E , Ti

1:1 to
1:99, 0.1 to 3

4-4

Control selected in context BPM Context Menu


All


BPM (Breathes Per Minute) -- Timing and Rate
Management
The BPM parameter describes the number of breaths-per-minute. The selected ventilation
mode determines when this value is a setting or a measurement.
Assisted and controlled breaths are time-cycled. For spontaneous breaths, the ventilator uses
the percent of the peak flow to terminate the breath being delivered (flow cycled).

Control Parameter
The Ti (Inspiratory Time) parameter adjustment sets the inspiratory time for the control and
assisted breaths (AC and SIMV modes). For volume targeted breaths, the Ti parameter affects
the gas flow rate (the device displays Pop-Up messages when the minimum and maximum flow
rate values have been reached).

Rise Time
When PS is selected, you can adjust the time it takes to reach PIP. You can specify an index of
1 (shortest) to 10 (longest). The device uses the PIP waveform as a reference when selecting the
Rise Time for the patient.
You should reassess and readjust the Rise Time settings after the patient is placed on the
ventilator and initially stabilized. To minimize patient's work of breathing and potential for
pressure overshoots, you must take the following into consideration when setting the Rise
Time:
•
•
•
•
•

Patient's respiratory pattern
Patient's comfort
Patient's flow demand
Resistance (Mechanical/Physiological)
Compliance characteristics

The Rise Time for a passive lung is driven primarily by airway resistance, and is fairly
independent of compliance.

Resistance

Rise Time









An adult patient with high Resistance may benefit from a Rise Time setting of 3 to 4 for
optimal breath delivery. Rise Times of 8 to 10 are optimized for infants and are flow limited.
(The infant circuit is not intended for flows > 60 LPM.)


ZOLL Ventilator Operator’s Guide


4-5

USING THE ZOLL VENTILATOR

Cycle Off % Parameter
The ZOLL Ventilator transitions from inspiratory to expiratory phase when the flow drops
below a set percentage of the peak flow.
You can adjust the Cycle % value t account for patient leaks.
Note:

The longest duration of a spontaneous breath is 5 seconds. At the end of this time, the
ventilator ends flow and opens the exhalation valve.

Clinicians must carefully assess the patient's response when applying the adjusted % -- you
must adjust the % value carefully to optimize patient ventilatory support and comfort.
The Cycle Off % parameter is principally for noninvasive modes where a much higher setting
is required to cycle the breath properly in the presence of a leak. If a higher value is not used
and there is a leak, the system tends to time cycle at 5 seconds instead of flow cycle (if the leak
flow is higher than 25% of the peak flow, the cycle threshold is never crossed.)
If there is no leak, increasing the Cycle Off % parameter causes breaths to cycle sooner, and
deliver less volume. If you set the Cycle Off % parameter too high, the breath ends early
relative to patient effort, which may lead to the triggering of a second breath.

Spont Ti Limit Parameter
The Spont Ti Limit parameter provides an additional method to operate the delivery of breaths
and maximize patient comfort.

Manual Breath/Plateau Pressure Button
The Manual Breath/Plateau Pressure button delivers a breath only if pressed during the
expiratory phase when the airway pressure drops to the PEEP target.
In AC and SIMV, pressing the Manual Breath/Plateau Pressure button delivers a breath defined
by the settings.
In CPAP and BL, pressing the Manual Breath/Plateau Pressure button delivers a breath defined
by Apnea Back-Up settings.
Press and hold the Manual Breath/Plateau Pressure button to perform a plateau pressure
maneuver.

4-6



BPM Parameter Settings
The following table gives the options and ranges for the BPM parameters:

Parameter Window
Primary Value

BPM

Secondary
parameter Values

Breaths per
minute
Ti (sec)
|or
I:E

Alarm Limits

Options /
Range
0 to 80

Availability/Notes

Models

Volume Target: Control Setting

All

Pressure Target: Measured
Ti 0.1 to 3.0
or
1:1 to 1:99

See BPM context menu: Control Parameter

All

Ti 0.1 to 5.0
or
I:E 4:1 to 1:99

Inverse I:E

EMV+,
Eagle II

The control value is shown in
the Parameter window, the
dependent value is shown in the
Auxiliary Box.

All

Inverse I:E

EMV+,
Eagle II

High breath rate

20 to 99, off

Low breath rate

2 to 40

Measured Value

Minute Volume
Vmin (ml)
BPM Context Menu

0 to 99.9

Control
Parameter

1:1 to

Default I:E

1:99, 0.3 to 3

Ti 0.1 to 5.0
or
I:E $:1 to !:99
Rise Time -

Default #

1 to 10

Auxiliary Box

All

Cycle Off %

Default 25%

10 to 70%

Auxiliary Box

All

Default
Adult = 3.00
Infant = 2.00
Mask CPAP =
3.00

0.30 to 4.00

(% Cycle )
Spont Ti Limit


ZOLL Ventilator Operator’s Guide

4-7

USING THE ZOLL VENTILATOR

Vt (Tidal Volume)
The Vt parameter gives the tidal volume (ml) delivered to the lung. The selected ventilation
mode determines if this value is a setting or a measurement.
In volume targeted modes, pressing the VT parameter button highlights the current set tidal
volume and enables it to be changed.
In pressure targeted breaths, the delivered tidal volume is shown as outlined text and is based
on the patient pulmonary mechanics. The VT High and Low Limits are also available as
secondary parameters.

Warning!

In NPPV, a VT that is lower than anticipated given the patient's size may be an
indication that the patient is not able to adequately spontaneously ventilate.
The ventilator circuit is part of the breathing system of the ventilator. Tubing compliance of the
circuit is a physical property that affects the tidal volume delivered to the patient. The ZOLL
Ventilator allows you to adjust the compliance value of the circuit (see Chapter 6 for more
information).
Note:

Warning!

4-8

In the CPAP-NPPV, the VT delivered and Vmin may be overestimates of the true
volume going to the patient when leaks are present. The O2 Use values accurately
display the O2 use, though the amount used is more than if no leak was present.

If significant leaks are present during NPPV modes, the VT delivered and Vmin shown
may be overestimates of what is actually being delivered to the patient. The adequacy of
ventilation should be assessed using an alternate method.




The following table gives the options and ranges for the Vt parameters:

Parameter Window
Primary Value

Options /
Range
50 to 2000

Vt
ml

Availability/Notes

Models

Volume Target: Control Setting

All

Pressure Target: Measured

Secondary
Alarm Limits

High Vt

50 to 2000,
Off
5 to 500,
Off

Low Vt
Vt Context Menu
Tubing Compliance (CT)

Default : Off

OFF, Adult,
Infant

Auxiliary Box

All

Adult

Default: 1.60

0 to 3.50

All

Infant

Default: 0.50

0 to 2.00

The changed value is not
retained when the device is
turned OFF

Compliance
Volume (ml)

(Measured
value )

0 to 349

All
All

PIP (Peak Inspiratory Pressure) -- Pressure Management
In volume targeted modes, the primary field shows the delivered PIP as outline text. In pressure
targeted modes, the PIP target is displayed and is adjustable. The PIP High Limit, PIP Low
Limit, and PEEP are also available as secondary parameters.
During the exhalation phase, the ventilator opens the exhalation valve when the pressure is
above the PEEP setting, and closes it when below the setting.
In Bilevel Ventilation Mode, the ventilator provides noninvasive ventilation with the ability to
manage the patient by adjusting the IPAP and EPAP parameters.
Caution

Set the trigger level to minimize the work of breathing for the patient and prevent
auto-triggering. Set the Vt alarms to bracket average tidal volume so that the unit detects pending
respiratory failure (low tidal volumes) and excessive leaks (high tidal volumes).

Spontaneous/Assisted Breath Trigger
The Spontaneous/Assisted Breath Trigger is preset to -2.0 cm H2O and can be adjusted from6.0 to -0.5 cm H2O below the baseline (PEEP) pressure. In order to initiate a spontaneous or
assisted breath, the patient must generate -2.0 cm H2O. When the pressure drop is detected, an
assisted breath is delivered.
The trigger automatically adjusts when the PEEP is changed.


ZOLL Ventilator Operator’s Guide

4-9

USING THE ZOLL VENTILATOR

Plateau Pressure
Press and hold the Manual Breath/Plateau Pressure button to perform a plateau pressure
maneauver.

4-10



Pressure Management
The following table gives the options and ranges for pressure management.

Parameter Window
Primary
Value

Secondary
Value

Options /
Range
10 to 80

PIP
cm H2O

Availability/Notes

Models

Volume Target: Measurement

All

Pressure Target: Control Setting

PEEP

0 to 30

PIP values greater than 60 cm
H2O require the operator to
perform a separate
confirmation.
AC Modes (ACV, SIMV, CPAP, All
BL Modes

3 to 30

Alarm Limits

PS

0 to 60

Spontaneous Breaths

EPAP

3 to 30

(SIMV and CPAP )
Spontaneous Breaths

IPAP

6 to 60

BL

High PIP

20 to 100

PEEP cannot be within 5 cm All
H2O of the PIP High Limit

Low PIP

3 to 35, Off

All

Mean Airway Pressure

0 to 99.9

All

0 to 100

All

All

setting.
Measured
Value

MAP
Paw Waveform
PIP Context Menu

Breath Trigger
(Assisted,
Spontaneous)

Default : -2


-6 to -0.5

All

Adjustment Increments: .5

ZOLL Ventilator Operator’s Guide


All

4-11

USING THE ZOLL VENTILATOR

FIO2 (Fraction of Inspired Oxygen) -- Oxygen Delivery
Management
Pressing the FIO2 parameter button highlights the current FIO2 value and enables you to adjust
it. There are no adjustable secondary parameters. The default values at start up is 21% whether
oxygen is present or not. If an FIO2 value greater than 21% is saved and used for Power Up
settings, the unit start ups with that saved FIO2 value if high-pressure oxygen is present. If
high-pressure oxygen is not present, the unit starts up with FIO2 = 21% and O2 SUPPLY
PRESSURE LOW alarm is not activated. The secondary display in the parameter window is O2
Use1. This is the flow (liters/min) of high pressure oxygen used by the unit to support the
patient at the current settings. O2 Reservoir mode is indicated on the display with a plus “+”
sign next to the FIO2 value when this mode is active. (The “O2 Use” value does not include
oxygen use in the O2 Reservoir.)
The following table lists the options and ranges for the FIO2 parameter:

Parameter Window
Primary Value
FiO2

Options /
Range
21 to 100

%

Availability/Notes

Models

All breaths are delivered from
the compressor at 21%

All

All breaths are delivered from
the High Pressure O2 Source at
100%
Secondary Values Not Applicable

All

Alarm Limits

Not Applicable

All

Measured Values

O2 Use (L/min)

0 to 99.9

Shows when High Pressure
Oxygen Supply is present.

All

Default : off

Off / On

“+” icon indicates when “on” for
low flow oxygen.

All

FiO2 Context Menu
O2 Reservoir

1. O2 Use = ((FIO2-0.21)/0.79)*Minute Volume where FIO2 is represented as a fraction and minute
volume is the actual minute volume (controlled and spontaneous breaths * tidal volume).

4-12



SpO2 -- Using the Pulse Oximeter
The primary use of the device is as a ventilator -- the pulse oximeter operates only when the
device is providing ventilation.
The following conditions can affect the pulse oximeter reading:
• The sensor is too tight.
• There is excessive illumination from light sources such as a surgical lamp, a bilirubin lamp,
•
•
•
•

or sunlight.
A blood pressure cuff is inflated on the same extremity as the one with a SpO2 sensor
attached.
The patient has hypotension, severe vascoconstriction, severe anemia, or hypothermia.
There is an arterial occlusion proximal to the sensor.
The patient is in cardiac arrest or is in shock.

The SpO2 display is active only when the pulse oximeter is connected. The pulse oximeter is in
standby (and displays stby in the parameter window) when
• No SpO2 sensor is connected
• The sensor is off the patient during start up
• You place the pulse oximeter in standby

Note:

You can place the pulse oximeter in standby only when the probe is disconnected from
the patient. A valid signal automatically brings the pulse oximeter out of standby.


ZOLL Ventilator Operator’s Guide

4-13

USING THE ZOLL VENTILATOR

SpO2 Parameter Values
Pressing the SpO2 parameter button highlights the Low SpO2 Alarm Limit and enables its
value to be changed. The default low SpO2 value at start up is 94%. The SpO2 parameter uses
the same Context Menu as the HR parameter.
The following table gives the options and ranges for the SpO2 parameter:

Parameter Window

Options /Range

Availability/Notes

Models

Primary Value

84 to 100

Measurement

All

Secondary
Values

SpO2
%
Not Applicable

Alarm Limits

Low Limit

Measured
Values

Pleth
Waveform

86 to 99, Off

SpO2 Context Menu (note same
as HR Context Menu)
Pulse Ox
Default :
Standby

Standby, Off,
On

Fast SAT

Off/On

Default : Off

All

Fast SAT enables rapid tracking of
arterial oxygen saturation changes by
minimizing the averaging. This mode is
clinically applicable during procedures
when detecting rapid changes in SpO2
is paramount such as induction,
intubation, and sleep studies.

Sensitivity

Norm

Max

Norm adjusts the pleth signal
sensitivity. Max interprets and displays
data for even the weakest of signals.
Max is recommended during
procedures and when clinician and
patient contact is continuous.

APOD

Off

Off, On

When on, this mode improves detection
of the "probe off patient" condition, but
reduces the ability to acquire a reading
on patients of low perfusion.

Averaging

8 Seconds

2 to 4, 4 to 6,
8, 10, 12, 16
Seconds

Adjusts the SpO2 and HR averaging
durations.

4-14




Signal Strength

Measured
Value

0 to 20

Current signal strength value, not
adjustable. A value of zero indicates that
no measurement is available. This value
helps clinicians place sensors on
optimal sites

Signal IQ

Measured
Value

Bar Graph

Bar graph displays the relative reliability
of the pulse oximeter signal.


ZOLL Ventilator Operator’s Guide

4-15

USING THE ZOLL VENTILATOR

HR (Heart Rate)
The HR (Heart Rate) parameter window displays the patient’s heart rate when the pulse
oximeter is working and the sensor is attached.
Pressing the HR parameter button highlights the High Heart Rate alarm limit and enables its
value to be changed. Pressing the HR button a second time highlights the current value of the
Low Heart Rate Alarm limit and enables its value to be changed. Both limits are adjustable by
1 b/min. The default value at start up for the high alarm limit is 120 BPM (Beats Per Minute);
the low alarm limit is 40 BPM.
The following table gives the options and ranges for the HR parameter:

Parameter Window
Primary Value
Secondary
Values
Alarm Limits

HR

Options /
Range
0 to 240

%
Not Applicable
High Limit
Low Limit

Availability/Notes

Models

Measurement - Heart Icon blinks
at the beat rate.

All

80 to 240,
Off
30 to 79,
Off

Measured
Pleth Waveform
Values
HR Context Menu (note same as SpO2 Context Menu)

4-16



Managing Pop Up Messages
To prevent the setting of parameter values that are outside the typical clinical range of settings,
the ventilator presents Pop Up messages that ask if you are sure you would like to set the
parameter beyond the typical range.
When a message occurs, you are asked to press the Accept/Select button before you can adjust
a parameter beyond the typical range. Pop Up messages are also used to alert you that certain
settings are not permitted. In addition, Pop Up messages can call for you to press Accept/Select
to acknowledge that you are entering configurations where certain alarms are being suppressed,
turned “off”, and/or canceled.
We provide a comprehensive list of pop up messages in Chapter 5, “Alarms.”

Pop Up Message Example


ZOLL Ventilator Operator’s Guide


4-17

USING THE ZOLL VENTILATOR

Managing Alarms
The ZOLL Ventilator uses Smart Help™ messages that provide a comprehensive suite of
alarms. Smart Help messages alert operators and guide their actions to resolve alarm conditions
and ensure patient safety.
At the onset of an alarm, the screen displays the alarm name and then a series of
context-sensitive Smart Help messages, which describe the possible cause and resolution of
that alarm. When multiple alarms occur, the unit prioritizes alarms and displays those alarms
that indicate the greatest risk to the patient first.

Smart Help Example

The previous illustration provides an example of what the device displays when there are
several alarms. The displayed Alarm message corresponds to the dark alarm bell at the bottom
of the display. You can cycle through the various alarms by turning the ventilator’s selection
dial. If there are less than 5 alarms, this alarm list also includes a “plot” icon, where the alarm
screen is replaced by the Pulse Pleth/Time and Pressure/Time plots.
We describe Alarms in detail in Chapter 5, “Alarms” and provide a comprehensive reference.

4-18



Smart Help Messages
At the onset of an alarm, the Alarm Message Center (AMC) in the upper left-hand corner of the
device’s LCD screen displays a Smart Help message. The Smart Help message displays the
alarm name with a series of messages to help the operator resolve the alarm. The AMC
indicates the number of active alarms as a series of Alarm Bell icons at the bottom with each
bell indicating an active alarm. The ventilator prioritizes alarms and displays the alarm
indicating the greatest risk first. All messages are context-based and suggest what is causing the
condition and how it can be resolved.

a

b

c
d

e

f

Smart Help Display

Smart Help messages contain the information and instructions for all active alarms, such as in
the previous example:
a.

b.
c.

d.

e.
f.


Alarm Name: Describes the nature and/or cause of the fault or failure. The Alarm
Name appears at the top of the AMC. When more than one alarm occurs at the
same time, the unit prioritizes them based on patient safety.
Mitigation/Resolution Instructions: Instructions for the operator as to how the
alarm state may be resolved.
If not Resolved Instructions area: Instructions for the operator on what to do if
they cannot resolve the alarm state. The instruction is always shown in the following
format **Message...**.
Alarm Icons: For each active alarm, an alarm bell appears. When multiple alarms
are active, the number of bells corresponds to the number of alarms. The alarm in
the AMC is demonstrated as the solid bell. To view each active alarm, turn the
selection dial to scroll through all active alarms. If there are less then 5 alarms, the
plot icon also appears.
Service Code: Each alarm has a 4 digit number associated with it, which helps the
operator indicate the specific alarm when communicating with technical support.
Attention Warning Icon: Identifies the severity of the alarm: Low, Medium, or
High priority.

ZOLL Ventilator Operator’s Guide

4-19

USING THE ZOLL VENTILATOR

Alarm Priorities
Alarm priorities define the operational state of the device regarding its ability to provide
mechanical ventilation. The alarm priority determines what effect pressing the
MUTE/CANCEL button has. There are three priorities:
• High Priority: Mechanical ventilation under operator control is no longer possible. This

alarm category requires immediate intervention by the operator. This includes system failure
alarms where the CPU has failed and a backup has taken over to sound the audible and
visual alarms. It also includes when the device is turned on and there is no internal or
external power source. Pressing the MUTE/CANCEL button has no affect on the High
Priority alarm. The alarm can only be silenced by turning off the ventilator.
• Medium Priority: Mechanical ventilation is active or is possible (maybe for a finite period
of time), but there is a failure/fault with the patient, ventilator circuit, a pneumatic
subsystem, or pulse oximeter. This alarm category requires immediate intervention by the
operator. Pressing the MUTE/CANCEL button mutes Medium Priority alarms for 30
seconds. If after 30 seconds the alarm-causing condition still exists, the audible alarm recurs
until it is muted again for another 30 second period or resolves.
• Low Priority (Advisory): Safe mechanical ventilation is active, but there is a fault that the
operator must be aware of to ensure safe management of the patient and/or ventilator. Low
Priority alarms present themselves with both an audible and yellow LED alarm signal
alerting the operator to the condition. Pressing the MUTE/CANCEL button cancels the
audible signal. If the alarm is not resolved, the yellow LED remains illuminated to remind
the operator of the fault or failure. You can cancel some Low Priority alarms to avoid
nuisance alarms.
If the alarms are Low Priority, then the Pleth and Pressure/Time plots appear permanently on
the screen when the alarms are muted. If the alarms are Medium Priority, the unit cycles
through each Medium Priority Alarm for a 20 second period. You can use the selection dial to
select a particular Medium Priority Alarm and/or Plot for 20 seconds, after which the above
cycling rotation resumes. New Alarms can overwrite the screen at any time.
The first digit in the service code indicates the alarm priority:
1###: High Priority alarms
2###: Medium Priority alarms
3###: Low Priority alarms

4-20




Silencing Alarms
The operator may decide, based on their clinical assessment, to silence certain alarms that, in
the given situation, are considered “nuisance” alarms and do not assist in the safe management
of the patient. Before any alarms can be silenced, the operator receives a Pop Up message
asking them to confirm their understanding that the alarm is no longer available in the current
operating session.

Alarm Preemptive Mute upon Power up
When the unit is first powered up, certain patient circuit alarms are preemptively muted for 120
seconds, to allow the operator time to get the patient circuit properly adjusted without nuisance
alarms.
Note:

During this preemptive mute of this audible alarm, the LED alarm light and alarm
message are still indicated.

There is a countdown timer located under the muted alarm symbol, showing how much time of
the 120 seconds is remaining. The alarms that have this preemptive mute are:

Service Code Alarm Name

Exhalation Fault


Airway Pressure High


Low Airway Pressure


High Tidal Volume


Low Tidal Volume


High Breath Rate


Low Breath Rate/Apnea


Apnea


PEEP Leak


Insufficient Flow


Patient Disconnect


Spontaneous Breath-PIP High


Spontaneous Breath-PIP Low


Spontaneous Breath-VT High


Spontaneous Breath-VT Low


Pulse Ox Module Failed


Internal Communication Failed


SpO2 Sensor Off Patient


SpO2 Low


Heart Rate High


Heart Rate Low (Pulse Rate Low)


ZOLL Ventilator Operator’s Guide

4-21

USING THE ZOLL VENTILATOR

Service Code Alarm Name

SpO2 Shutdown (MS 11 Failure-Monitor Not In Use)


SpO2 Shutdown (Communication Failure EMV-Pulse Ox-Monitor Not In
Use)


No SpO2 Sensor Connected (No Sensor Detected)


Defective Sensor


SpO2 Pulse Search


SpO2 Signal Interference


Too Much Ambient Light


Invalid SpO2 Sensor (Unrecognized Sensor)


Low SpO2 Perfusion (Low Perfusion)


Low SpO2 Perfusion (Poor SpO2 Signal

Turning Off Alarms at Extreme Range Limits
If the operator sets the following alarm limits to their extreme range, the ventilator turns off the
indicated alarms after Pop Up message confirmation:
1.
2.
3.
4.
5.
6.
7.

High Breath Rate (Alarm #2074).
PIP Low (Alarms #2071, 2171) -- the device automatically turns off these alarm limits
in NPPV mode.
VT High (Alarms #2072, 2172) -- the device automatically turns off these alarm limits
in NPPV mode.
VT Low (Alarms #2073, 2173) -- the device automatically turns off these alarm limits
in NPPV mode.
Low SpO2 (Alarm #2410)
High Heart Rate (Alarm #2410)
Low Heart Rate (Alarm #2411)

If an alarm has been turned off and is then modified, but is not accepted, then the alarm
parameter is set to the values indicated in the following table. This is done to ensure patient
safety in the event of an inadvertent value change. You can change these values following the
parameter change procedures described above.

High
Breath
Rate
99 BPM

4-22

PIP Low
3 cm H2O

VT High
2000 ml

VT Low
0 ml


High
Low Heart
Low SpO2 Heart
Rate
Rate
86%

240 BPM

30 BPM


Alarm Cancellation in Alarm Configuration Menu
There are clinical situations where an alarm occurs, and in the operator’s clinical judgment, this
alarm should be canceled for the remainder of the unit’s operating session. The following
constraints apply to alarm cancellation:
1.
2.
3.
4.

Only alarms that have occurred in the current operating session can be canceled.
Alarms which have not occurred since turn on are indicated with a “--”.
Canceled alarms are not be saved in the User Settings for the next session.
All canceled alarms reappear (if appropriate) when the unit is next turned on. (As an
example, the Self Check Fault, calibration due Alarm # 3120, reappears in the next
operating session.)

You may cancel the following alarms in the Alarm Configuration Menu:
1.

Self Check Fault, calibration due (Alarm #3120)
2. RTC Battery Fault (Battery Low) (Alarm #3110)
3. Incomplete Exhalation (Alarm #3110)
4. PEEP Leak (Alarm #2090)
5. Fresh Gas Intake Fault (Alarm #3031)
• Patient Inspiratory Demand Not Met (Alarm #3092)


ZOLL Ventilator Operator’s Guide


4-23

USING THE ZOLL VENTILATOR

4-24