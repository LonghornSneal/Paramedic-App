## All Content
Appendix C unpacks how the EMV731's Masimo SET module acquires SpO2, why traditional ratio methods falter in motion, and how the device filters noise so trends stay reliable during transport. Use this section when verifying sensor placement, interpreting slow-moving trends, or troubleshooting suspect readings before escalating an alarm. (*Source: Rev. P, Appendix C-1 through C-2*)

- Prioritize clean probe placement and perfusion before blaming equipment; venous pulsation is the usual spoiler.
- Remember that SET filtering is excellent but not perfect; extreme motion, dyes, and dyshemoglobins still demand clinical confirmation.

## Principles of Pulse Oximetry
Two light-emitting diodes pulse red (660 nm) and infrared (905 nm) light through a capillary bed while a photodiode measures what returns. Arterial inflow briefly thickens the blood column, changing how much red and infrared light is absorbed. The ventilator graphs that pulsatile absorbance as a plethysmograph, then calculates saturation from the differing extinction of oxyhemoglobin and deoxyhemoglobin. Accurate SpO2 values require a well-perfused site, minimal ambient light intrusion, and keeping venous pulsation from dominating the signal path. (*Source: Rev. P, Appendix C-1*)

## Traditional Ratio Method
Legacy oximeters derive saturation from the ratio of the pulsatile (AC) to non-pulsatile (DC) absorbance at each wavelength. They compute R = (AC660/DC660) / (AC905/DC905) and look up SpO2 in calibration tables assembled from healthy volunteers. That method presumes every pulse is arterial. Motion, venous pooling, or poor probe fit introduce extra pulsation, skewing R and pushing the saturation display away from reality. Crews must stabilize the sensor, limit movement, and keep perfusion adequate for the table-driven result to remain trustworthy. (*Source: Rev. P, Appendix C-1*)

## Masimo SET Algorithm
The SET module treats each measured signal as arterial content plus noise, isolates the arterial component, and only then forms a ratio. It iteratively tests possible saturations (1-100%), uses an adaptive correlation canceller to strip venous and motion artifacts, and generates a Discrete Saturation Transform curve. The algorithm accepts the saturation that produces the strongest arterial peak with the smallest residual noise, making readings resilient during transport where vibration, motion, and weak pulses are expected. (*Source: Rev. P, Appendix C-2*)

## Update Rate & Noise Handling
The ventilator processes a rolling four-second data window and posts a new saturation value every two seconds, giving teams a smoothed trend instead of jittery swings. During each update it recomputes the noise reference so the adaptive filter continues to subtract venous and motion interference. Expect a short lag when conditions change abruptly; when alarms fire, stay on the patient and confirm the trend across several updates before intervening. (*Source: Rev. P, Appendix C-2*)
