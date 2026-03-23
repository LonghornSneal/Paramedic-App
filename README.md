--- **Paramedic Quick Reference Application**

- **[Use `AGENTS.md` for repo policy and clinical safeguards, `Agent-Workflow.md` for the skill loop, and this README for live file ownership, current app behavior, and task placement.]**
- **[Read Chapters 1-5 before changing app behavior. Use Chapters 6-7 for active work, Chapters 8-9 for verified shipped work, and Chapter 10 for future-only ideas.]**
- **[When README status lines are added or rewritten, keep the repo's double-asterisk bracket convention: `**[ ... ]**`.]**
- **[Before documenting behavior as current, verify the code path and confirm UI behavior with Playwright where it matters.]**

## Table of Contents
1. General Scope
2. App Overview and Ownership Areas
3. Current Product Behavior
4. Project Structure
5. Common Task Map
6. Top Priority Tasks
7. Current Tasks/Goals
8. Recent Fixes and Changes
9. Timeline Summary
10. Future Tasks/Goals/Ideas

## 1. General Scope

- **[This repo ships a static browser app rooted at `index.html` + `main.js`. Serve it over HTTP; opening via `file://` breaks ES-module loading.]**
- **[There is no backend or remote API layer. The category tree, medication/equipment data, Markdown mappings, PDFs, and other assets live in local repo files.]**
- **[Do not assume "fully offline" means zero runtime loading. The app lazily loads local Markdown files for many detail pages, but it does not depend on a server-side API.]**
- **[Protocol/content edits are not default work. Only touch `Content/` or protocol text when the user explicitly assigns that scope.]**

## 2. App Overview and Ownership Areas

- **[App shell and bootstrap: `index.html` owns the persistent shell and DOM ids, `viewportFix.js` handles mobile viewport sizing, and `main.js` imports tracing/data/features, exposes shared globals, seeds patient suggestions, and renders the initial spiderweb view.]**
- **[Home/search/navigation: `Features/list/ListView.js` renders the spiderweb/category tree, `Features/list/spiderwebContext.js` scores relevance, `Features/search/Search.js` owns draft vs committed search behavior, and `Features/navigation/*.js` plus `Features/History.js` handle Back/Forward/Home/History.]**
- **[Patient context: `Features/patient/PatientSidebar.js` opens/closes the sidebar and wires autocomplete, `Features/patient/PatientInfo.js` normalizes inputs into `window.patientData`, `Features/patient/PatientSnapshot.js` renders the header snapshot, and `Data/EkgAssetsData.js` feeds rhythm/modifier previews.]**
- **[Detail content: `Features/detail/DetailPage.js` is the live detail entry point, `Features/detail/markdownDetail.js` lazy-loads local Markdown and PDF sections, `Features/detail/quickVent.js` owns Quick Vent UI, and `Features/Warnings.js` injects patient-aware warning boxes.]**
- **[Styles: `styles.css` is only the import hub. Edit the modular files under `styles/base`, `styles/navigation`, `styles/sidebar`, `styles/detail`, `styles/quick-vent`, `styles/modals`, and `styles/utilities` instead of hand-editing generated output.]**
- **[Canonical detail/rendering files live in `Features/detail/*.js`; the nested `Features/detail/DetailPage/` folder is not the current app entry path and should not be the default place to patch detail behavior unless you first prove it is imported.]**

## 3. Current Product Behavior

- **[Home view: verified with Playwright on 2026-03-16. The default screen is a seven-root spiderweb of connected pills: `Adult Protocols`, `Pediatric Protocols`, `ALS Medications`, `Operational Protocols`, `Skills/Equipment`, `Intro/Core Principles`, and `Administrative & Legal`.]**
- **[Search: verified with Playwright. Typing opens a two-column `Filtered Topics` + `Smart Suggestions` panel; the spiderweb only re-renders on Enter or suggestion selection; Back/Forward restore committed search states.]**
- **[Patient sidebar: verified with Playwright. The header menu opens a dense line-based patient sheet with demographics, chip-backed PMH/Allergies/Current Rx's/Indications/S/S, vitals, and rhythm/modifier inputs that feed a live header snapshot.]**
- **[Detail pages: verified with Playwright and targeted code inspection. Topic pills transition into detail view, details render collapsible sections, patient-aware warning boxes appear above the content, and Markdown/PDF/equipment sections render when configured.]**
- **[Settings and History: verified with Playwright on 2026-03-16. Settings now opens a persistent modal with Dark Mode, dark-mode brightness, main/category/background/text warning/comment/popup color controls, text-size scaling, reduced motion, reset-to-defaults, and live contrast warnings for low-contrast text/background combinations; History still opens a session-only modal that starts empty and then lists visited detail pages.]**
- **[Snapshot vs warnings: the compact snapshot bar is still summary-first, but recognized medication-class warnings can render beneath it. Detail-page warning boxes remain the primary contraindication surface through `Features/Warnings.js`.]**

## 4. Project Structure

- **[Runtime entry files: `index.html`, `main.js`, `viewportFix.js`, `styles.css`, and `playwright.config.js`.]**
- **[Data source modules: `Data/ParamedicCategoriesData.js`, `Data/MedicationDetailsData.js`, `Data/VentilationDetailsData.js`, `Data/ProtocolMarkdownMap.js`, `Data/EkgAssetsData.js`, `Data/patientInfoSynonyms.js`, `Data/additionalMedications.js`, and `Data/AbbreviationGroups.js`.]**
- **[Content files: `Content/` holds the protocol Markdown and PDFs grouped by section (`Adult Protocols`, `Pediatric Protocols`, `Operational Protocols`, `Administrative & Legal Essentials`, `Skills & Equipment`, `Introduction & Core Principles`, and `Abbreviations & References`).]**
- **[Feature modules: `Features/list`, `Features/search`, `Features/patient`, `Features/detail`, and `Features/navigation` are the live app areas; `Features/settings.js`, `Features/History.js`, and `Features/Warnings.js` support them.]**
- **[Styles: `styles/base` owns layout/theme, `styles/navigation` owns header controls, `styles/sidebar` owns the patient sheet and field-level CSS, `styles/detail` owns topic-detail styling, `styles/quick-vent` owns Quick Vent, `styles/modals` owns shared modals, and `styles/utilities` holds print/accessibility support.]**
- **[Tooling and tests: `dev-tools/tests/*.spec.js` holds Playwright UI suites, `dev-tools/tests/utils/previewServer.cjs` is the shared preview helper, and `dev-tools/scripts/` / `dev-tools/*.mjs` hold repo utilities.]**
- **[Support and reference folders: `research/` is the local research/source cache, `notes/` holds decision logs and design experiments, and `artifacts/`, `dist/`, `test-results/`, and `archive/` are outputs/reference rather than primary app source.]**
- **[Non-SPA workspace artifacts: `.mvn/`, `pom.xml`, `src/`, and `target/` support Java/VS Code tooling and are not the shipping web-app runtime.]**

## 5. Common Task Map

- **[Change the category tree, spiderweb layout, or root labels: start with `Data/ParamedicCategoriesData.js`, then check `Features/list/ListView.js`, `Features/list/spiderwebContext.js`, and the relevant Playwright specs such as `dev-tools/tests/spiderweb-navigation.spec.js`, `dev-tools/tests/category-tree.spec.js`, and `dev-tools/tests/mobile-branch-fit.spec.js`.]**
- **[Change search behavior or suggestion previews: work in `Features/search/Search.js` and `Features/search/searchPreview.js`; verify with `dev-tools/tests/search-bar.spec.js` and `dev-tools/tests/spiderweb-mobile-readability.spec.js`.]**
- **[Change patient inputs, chip normalization, snapshot text, or EKG preview behavior: work in `Features/patient/PatientInfo.js`, `Features/patient/PatientSidebar.js`, `Features/patient/PatientSnapshot.js`, `Features/patient/patientTerminology.js`, `Data/EkgAssetsData.js`, and `styles/sidebar/*`; verify with `dev-tools/tests/patient-sidebar.spec.js` and `dev-tools/tests/patient-sidebar-ekg-preview.spec.js`.]**
- **[Change detail rendering, warning boxes, Markdown/PDF content, or Quick Vent UI: start with `Features/detail/DetailPage.js`, `Features/detail/markdownDetail.js`, `Features/detail/quickVent.js`, `Features/Warnings.js`, `Data/MedicationDetailsData.js`, `Data/VentilationDetailsData.js`, and `Data/ProtocolMarkdownMap.js`; relevant tests include `dev-tools/tests/ventilation.spec.js`, `dev-tools/tests/cricothyrotomy.spec.js`, and `dev-tools/tests/medication-dosing.spec.js`.]**
- **[Change navigation/history/settings: use `Features/navigation/Navigation.js`, `Features/navigation/Home.js`, `Features/History.js`, `Features/settings.js`, and the layout/theme CSS in `styles/base` and `styles/navigation`.]**
- **[Change protocol Markdown or add a new protocol page: edit the file under `Content/...`, map it in `Data/ProtocolMarkdownMap.js` when needed, update `Data/ParamedicCategoriesData.js`, and touch `Features/anchorNav/slugList.js` only if a new static anchor list entry is actually required.]**
- **[Change styling: edit the relevant module under `styles/`; `styles/tailwind.generated.css` is build output from `npm run build:tailwind` and should not be hand-maintained.]**
- **[Run local verification from repo root: `npm run preview`, `npm run lint`, `npm run test`, `npm run test:vent`, `npm run test:playwright`, `npx playwright test dev-tools/tests/<spec>.js`, `npm run build:tailwind`, `npm run scan:dead`, `npm run scan:deps`, and `npm run mcp:health`. `npm run test` / `npm run test:vent` are the smoke shortcuts; `npm run test:playwright` runs the broader Playwright suite; `npx playwright test dev-tools/tests/<spec>.js` stays available for a single spec.]**

## 6. Top Priority Tasks

- **[Expand contraindication keyword coverage and extension notes so new medications do not silently bypass `Features/Warnings.js` and patient-context checks.]**
- **[Keep the test entrypoints honest: `npm run test` remains the narrow smoke path, `npm run test:playwright` is the broader Playwright suite, and README commands should not imply wider coverage than the scripts actually run.]**

## 7. Current Tasks/Goals

- **[Keep every patient-sidebar field tied to visible app behavior where clinically appropriate. Current live effects already include snapshot updates, detail-page warning refreshes, search reprioritization, and some age/context emphasis, but field-by-field coverage is not complete.]**
- **[Finish dynamic medication dose calculations across medication detail data. `Features/dosageCalc.js` is partially integrated today, but coverage is not universal.]**
- **[Broaden smart-search synonym and typo coverage, plus the planned related-topic right-click/long-press behavior, without regressing the committed-search model.]**
- **[Keep global warning-surface ideas separate from shipped behavior: the header snapshot can show limited medication-class warnings, but general contraindication/warning boxes still live on detail pages.]**

## 8. Recent Fixes and Changes

- **[2026-03-16 Settings expansion: shipped persistent main/category/background/text warning/comment/popup color controls, text-size scaling, reduced motion, reset-to-defaults, and live contrast warnings in `Features/settings.js`, `index.html`, `styles/base/theme.css`, `styles/base/layout.css`, `styles/detail/detail-pages.css`, `styles/modals/global-modals.css`, `styles/sidebar/patient-modals.css`, and `dev-tools/tests/settings.spec.js`; verified the required home -> settings -> detail -> reopen -> reload -> reset flows with Playwright across `360x640`, `390x844`, `430x932`, and `480x932` mobile viewports.]**
- **[2026-03-16 Regression cleanup: fixed the dense 1280x720 patient-sidebar overflow, restored direct mobile tap targets for committed seizure search across navigation/search-order flows, removed blank HR/RR snapshot tokens when vitals are empty, and expanded Playwright coverage in `dev-tools/tests/patient-sidebar.spec.js` and `dev-tools/tests/search-bar.spec.js`. Files: `Features/patient/PatientSnapshot.js`, `styles/sidebar/patient-sidebar-forms.css`, `Features/search/Search.js`, `Features/list/ListView.js`, `dev-tools/tests/patient-sidebar.spec.js`, `dev-tools/tests/search-bar.spec.js`, `README.md`.]**
- **[2026-03-16 README navigation cleanup: rewrote Chapters 1-10 so file ownership, commands, and current UI notes match the live repo and verified browser behavior.]**
- **[2026-03-16 Search and sidebar pass: the app shipped two-column committed search, denser patient-sidebar layout work, linked vital/rhythm field behavior, and broader Playwright coverage in `dev-tools/tests/search-bar.spec.js`, `dev-tools/tests/patient-sidebar.spec.js`, and related suites.]**
- **[2026-03-15 Spiderweb navigation rebuild: `Features/list/ListView.js` + `Features/list/spiderwebContext.js` replaced the old chevron list with the connected pill map and pill-to-detail transition.]**
- **[2026-01-03 Protocol/detail expansion: adult, operational, and administrative Markdown coverage grew, and the Adult Anaphylaxis page/styling were redesigned across `Content/`, `Data/ProtocolMarkdownMap.js`, `Data/ParamedicCategoriesData.js`, and `styles/detail/detail-pages.css`.]**
- **[2025-10 Sidebar/style modularization: patient-sidebar styling moved into `styles/sidebar/*`, Quick Vent detail code was consolidated, and the shared Playwright preview helper landed in `dev-tools/tests/utils/previewServer.cjs`.]**

## 9. Timeline Summary

- **[2026-03: the current UI generation centers on the spiderweb home view, committed search, dense patient-sidebar fit on desktop/mobile, corrected mobile committed-search hit targets, and wider Playwright coverage.]**
- **[2026-01: protocol-content coverage expanded across Adult, Operational, Administrative, and detail-page presentation work.]**
- **[2025-10: repo structure shifted away from monolithic sidebar/detail styling toward modular `styles/`, stronger Playwright harnessing, and local tooling support.]**

## 10. Future Tasks/Goals/Ideas

- **[Session persistence for patient data, navigation history, and committed search state is still unshipped.]**
- **[Placeholder feature modules exist but are not implemented: `Features/CardiacArrest.js`, `Features/Diagnoses.js`, `Features/pcrNarrative.js`, and `Features/VoiceMode.js`.]**
- **[Longer-term patient-safety work includes richer cross-medication contraindication logic, broader summary warning surfaces, and full step-by-step dose math across all medication topics.]**
- **[Longer-term UX work includes more settings/theming controls, deeper search intelligence, and broader mobile readability hardening after the current search/sidebar regressions are closed.]**
