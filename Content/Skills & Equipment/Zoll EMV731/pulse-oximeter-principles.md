Appendix C
Pulse Oximeter Principles
The Masimo SET® MS board pulse oximeter is based on three principles:
1. Oxyhemoglobin and deoxyhemoglobin differ in their absorption of red and infrared light
(spectrophotometer).
2. The volume of arterial blood in tissue and the light absorbed by the blood changes during
the pulse (plethysmography).
3. Arterio-venous shunting is highly variable and that fluctuating absorbance by venous
blood is a major component of noise during the pulse.
The Masimo SET MS board pulse oximeter as well as traditional pulse oximetry determines
SpO2 by passing red and infrared light into a capillary bed and measuring changes in light
absorption during the pulsatile cycle. Red and infrared light-emitting diodes (LEDs) in
oximetry sensors serve as the light sources, a photodiode serves as the photodetector.
Traditional pulse oximetry assumes that all pulsations in the light absorbance are caused by
oscillations in the arterial blood volume. This assumes that the blood flow in the region of the
sensor passes entirely through the capillary bed rather than through any arterio-venous shunts.
The traditional pulse oximeter calculates the ratio of pulsatile absorbance (AC) to the mean
absorbance (DC) at each of two wavelengths, 660 nm and 905 nm:
S(660) = AC(660)/DC(660)
S(905) = AC(905)/DC(905)
The oximeter then calculates the ratio of these two arterial pulse-added absorbance signals:
R = S(660)/S(905)
This value of R is used to find the saturation SpO2 in a look-up table built into the oximeter’s
software. The values in the look-up table are based upon human blood studies against a
laboratory co-oximeter on healthy adult volunteers in induced hypoxia studies.


ZOLL Ventilator Operator’s Guide

C-1

PULSE OXIMETER PRINCIPLES
The Masimo SET MS board pulse oximeter assumes that arterio-venous shunting is highly
variable and that fluctuating absorbance by venous blood is the major component of noise
during the pulse. The MS board decomposes S(660) and S(905) into an arterial signal plus a
noise component and calculates the ratio of the arterial signals without the noise:
S(660) = S1 + N1
S(905) = S2 + N2
R = S1/S2
Again, R is the ratio of two arterial pulse-added absorbance signals and its value is used to find
the saturation SpO2 in an empirically derived equation into the oximeter’s software. The values
in the empirically derived equation are based upon human blood studies against a laboratory
co-oximeter on healthy adult volunteers in induced hypoxia studies.
The above equations are combined and a noise reference (N’) is determined:
N’ = S(660) - S(905) x R
If there is no noise, N’ = 0: then S(660) = S(905) x R, which is the same relationship for
traditional pulse oximeter.
The equation for the noise reference is based on the value of R, the value being sought to
determine the SpO2. The MS board software sweeps through possible values of R that
correspond to SpO2 values between 1% and 100% and generates an N’ value for each of these
R-values. The S(660) and S(905) signals are processed with each possible N’ noise reference
through an adaptive correlation canceler (ACC), which yields an output power for each
possible value of R (i.e., each possible SpO2 from 1% to 100%). The result is a Discrete
Saturation Transform (DST™) plot of relative output power versus possible SpO2 value as
shown in the following figure where R corresponds to SpO2 = 97%:

Pulse Oximeter Discrete Saturation Transformation

The DST plot has two peaks: the peak corresponding to the higher saturation is selected as the
SpO2 value. This entire sequence is repeated once every two seconds on the most recent four
seconds of raw data. The MS board SpO2 therefore corresponds to a running average of arterial
hemoglobin that is updated every two seconds.

C-2