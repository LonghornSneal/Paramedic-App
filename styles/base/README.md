# Base Styles

This folder holds the global scaffolding for the Paramedic Quick Reference UI.

## layout.css
- Establishes the overall page canvas (`body`, header bar, search input, content panel).
- Provides structural rules for the protocol category cards, the expandable hierarchy list, and search results.
- Includes the shared appearance for snapshot cards that appear outside of the patient sidebar.

## theme.css
- Defines the root design tokens (for example `--brightness`) used across every module.
- Contains the keyframe loop that animates the footer **Settings** button and other global colour cues.
- Applies global dark-mode adjustments that are not tied to a specific feature (brightness filter, settings modal styling cues).
