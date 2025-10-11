# Patient Sidebar Styles

All rules in this directory style the Patient Info Sidebar experience. The files are split by responsibility so each slice can be reasoned about independently.

## patient-sidebar-shell.css
- Fixed positioning, slide-in transitions, and overlay behaviour for the sidebar container.
- Responsive width constraints, including the narrow screen `@media` tweak used on phones.

## patient-sidebar-forms.css
- Typography and layout for sidebar sections, rows, and form fields.
- Handles vitals grid layout, unit suffix alignment, demographic rows, and dark-mode colour shifts for inputs and labels.

## patient-sidebar-controls.css
- Styles the interactive control groups: sex picker, age unit toggles, weight unit toggles, and their dark-mode states.
- Ensures active/hover feedback, focus rings, and condensed layouts for quick data entry.

## patient-autocomplete.css
- Positions the autocomplete dropdown, applies the scrollable panel skin, and styles suggestion rows.
- The `.hidden` utility lives in `styles/utilities`—this file only controls the suggestion container itself.

## patient-modals.css
- Covers snapshot warning banners, suggestion cards, and the EKG help modal internals (preview cards, back button, dark-mode palette).
