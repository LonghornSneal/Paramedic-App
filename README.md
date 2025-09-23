--- **Paramedic Quick Reference Application**


Always follow these guidelines:

  1. Read Before Coding: Read this README.md in full to understand how the entire repository works together and to locate relevant information for the task at hand. Chapters 1-5 are essential to understanding everything about the app and must be thoroughly read before beginning user's request. Chapters 6-7 are were you find tasks to work on. Chapters 8-9 are mostly for the user. Chapter 10 is where future tasks will eventually become the current tasks.

  2. Modifying the README.md: After you have finished all of the user's requests, update the README.md to reflect the current state of the app. Fix any spelling errors. Changes should be surrounded by double asterics with the original line in square brackets for easy identification. Ensure everything is located in their appropriate locations, one example of this would be when you finish a task and it passes the test you run on it, then it would logically be moved out of the tasks category and placed at the end of Chapter 8 (additionally placed in Chapter 9 if the change is a major change), and it would be re-written to conform to the style of that Chapter.

    2.1 Chapters 6,7, & 10: If you discover errors that involve features that should already be functional, then specify what the issue is in Chapter 6. If a task is known, but isn't in Chapter 7, then place it in Chapter 7 (unless it is currently the task that the user requested and it is the first time the user has requested this task). When the user's request is simple, research potential future tasks to place in Chapter 10 by looking through other code bases online and ensuring that the future task is appropriate for this specific Paramedic-App and that the user would want the future task added to the README.md.

  3. Quote full line + neighbor: When referencing code (for any reason), always quote the entire line and include the line immediately before and after it. Reference the line numbers. 

  4. Identify new code in explanations: Wrap new code with double asterisks in explanations only (not in source)

  5. Comment new code: Explain why and how; update or remove stale comments you encounter.

  6. Avoid duplication: Search first; consolidate or remove duplicates; keep names consistent across files.

  7. Align with scope and structure: Changes must align with sections 1–5; do not introduce frameworks or backends.

  8. Place Code Correctly: Add or modify code in the appropriate file and maintain logical ordering so that definitions appear before use. This avoids timing or hoisting issues.

  9. Fix what you see: If you notice a bug while working here, fix it unless explicitly told not to.

  10. File-specific docs: If a file mentions local rules or notes, read and follow them.

  11. Verify: Manually verify features still work after changes; run available tests as appropriate. If no appropriate test exists, then create an appropriate test and ensure it is functional and passes the test.

## Table of Contents
1. General Scope
2. App Overview and Structure
3. Project Purpose
4. Project Structure
5. How the Pieces Work Together
6. Top Priority Tasks
7. Current Tasks/Goals
8. Recent Fixes and Changes
9. Timeline Summary
10. Future Tasks/Goals/Ideas

## 1. **General Scope**

Single-page, offline app in HTML/CSS/vanilla JS (ES Modules).

All data is local (no APIs). Instant load, no network required.

Files are organized into logical folders (Data, Features, Utils, etc.).

Scope strictly reflects current functionality of this repo (nothing external or future-ware).



## 2. APP OVERVIEW AND STRUCTURE

Built with: HTML, CSS, JavaScript, & ES Modules.

Paramedic Protocols: This app encompasses the user's Paramedic Protocols along with additional information, features, and functions.

App philosphy: Relevant and/or more important information should naturally be easier for the user to access. Pt Treatments that are relevant, relevant warnings, and other relevant information automatically should have the app focus on that information to ensure timely pt care.

This README serves as a thorough guide to the project, outlining where each piece of functionality resides and highlighting how the components interact. By understanding this structure, developers can more easily identify where to implement new features or fix issues.

Logical File/Folder seperation of Codebase: Each file/script has a specific purpose (e.g., data definition, UI rendering, event handling).

Some updates will require updates in multiple files, even with a single minor change. 

Styling: Tailwind via CDN + styles.css (custom rules).

## 3. PROJECT PUROPOSE

The Paramedic Quick Reference is designed to allow paramedics to find life-saving information within seconds. It functions as an interactive protocol book and drug reference on a phone or tablet. The interface is optimized for speed, clarity, and ease-of-use in emergency situations.

Design & Feature Overview: The app’s UI elements & features.
  Detailed below, describing the function & role it plays in the app.

  Main Contents Page: The default view that shows categories & subtopics.
    The header: shows the app title centered with the search bar directly below; the Patient Info button is top‑left; Back/Forward arrows are top‑right (disabled initially), with the Home button beneath them and the History button below Home. 
    **[The hierarchical Contents list renders in the main content area: rounded Show/Hide badges expand or collapse categories, and selecting a final topic opens its detailed page.]**
    Entering patient data in the sidebar immediately updates the experience: irrelevant list items are strike‑through by indications, detail pages re‑render, and relevant warnings appear at the top of details. 
    All rendering is local, IDs are stable, taps are minimal, and flows are simple.
    **[Expandable Topic List: Each category row uses a Show/Hide badge to toggle its section, while final topics render as cards that open the detail page (see Show/Hide Badges below).]**

  **[Show/Hide Badges: On the Contents list.]**
    **[Each expandable category includes a pill-shaped Show/Hide badge on the right edge. Tapping the badge or the category card opens or collapses the children. Leaf topics omit the badge; tapping the card opens the detail page immediately.]**

  Subtopics and Navigation Hierarchy: Topics are organized as a tree.
    Parent items (type "category") render with a bold label and a blue chevron to the left; clicking the chevron or label toggles the section. Nested categories are supported recursively, so multiple levels can expand as needed. Final items (type "topic") do not show a chevron; their text is a clickable link that opens the corresponding detail page (the link carries data-topic-id and routes to renderDetailPage(id)).

    Focused Subtopic Sections (Detail Pages): Clicking a leaf topic opens a detail page for that item. The page content is generated from the data entry for that topic, with each section rendered under a collapsible subheading.
      Text is processed for inline markup: bracketed pairs like [[display|info]] render as green, clickable “toggle-info” spans that reveal additional details in-place; colored emphasis (e.g., {{red:...}}) is also supported.
      Original documentation: Topics load curated Markdown & provide links (& optional inline embedding) to the original local PDF chapter.
      Warnings: are injected at the top of the page based on patientData (e.g., allergy match, PDE5 + NTG, low BP for NTG, pediatric Etomidate). The app re-renders details on patient updates so context stays current.
        Note: broad, automatic medication administration math is planned (see Current Tasks); some detail content may include calculations, but universal dose auto-calculation is not yet implemented across all Rx's.

  Search Bar: dual lists (Filtered + Smart Suggestions) & only one location for user input.
    Matching: Case-insensitive, and tries to match any part of a topic’s name or associated keywords. Updates per keystroke. Clicking navigates to detail. Both lists are scrollable.
    Two dynamic lists: Two side-by-side list of topics (Appears as the user types into the search input).
      Displayed: immediately below the Search Bar (side by side).
    Filtered List of Topics: On the left.
     This is that standard search bar that is currently implemented.
    Smart Suggestions: On the right.
      Displays: Filtered (by Patient Info & Search Bar text) list of topics.

  Patient Info Menu Button: The Patient Info button (#open-sidebar-button) opens the Patient Information sidebar (#patient-sidebar) & activates the dim overlay (#sidebar-overlay).
    Close sidebar: by clicking its close (X) button or by clicking the overlay.
  The sidebar provides fields for sex, age, weight (KG/LB), height, PMH, allergies, current meds, indications, symptoms, VS, & EKG. Entered values update patientData immediately, which personalizes the app by striking through less‑relevant list items, re‑rendering the current detail page, & showing patient‑specific warnings.

  Patient Info Sidebar/Section: The sidebar is an interactive form that updates patientData as you type. All Categories will Auto-Update if the information is filled out elsewhere from within the app.
    Includes: Sex, Age, Weight (kg/lb), Height, PMH, Allergies, Medications, Indications, S/S, & VS.
      Note: pain scale still needs to be coded into app.
    VS Categories: BP (MAP is automatically calculated)HR, %SpO2, EtCO2, RR, BGL, Pupils, GCS, A&O Status, LS, & EKG Interpretation.
    Sex: Select 'Male' or 'Female' selection currently (task update available). Currently used for the Zoll Ventilator Calculation.
    Age: Affects surfaced treatments (e.g., dose differences, which sections to StrikeThrough). 18 & up equals “adult.”
        Inputs: whole numbers only, years 0–120, months 0–40, days 0–500.
    Weight (kg/lb): Used for Auto-Calculation with weight-based dosages.  Whole numbers only. Ranges: lb 0–1500; kg 0–700.
    Height: either ft+in or total inches; values sync both ways.

    Past Medical History (PMH): Free‑text, comma‑separated (#pt‑pmh) with autocomplete (e.g., diabetes, CHF, asthma). Parsed to an array on input. 
        Snapshot: Shows only most relevant (abbrev.). Informational only.
        Smart Suggestions: (Currently needs to be coded for)
          Roadmap: will filter Smart Suggestions’ Topic List (lower priority than Indications).
        Strike-Through: (Currently needs to be coded for) Adds a Strike-Through on innappropriate treatment options based upon PMH.

    Allergies: Type‑to‑filter or choose from dropdown.
        Allergy Alert: listed medication matches an allergy, then it's detail page shows an Allergy Alert & innappropriate treatments are struck‑through.
          Struck‑Through Items: Remain selectable.
        Autocomplete: Suggests available Paramedic medications first.

    Medications: Current pt medications. Type‑to‑filter or choose from dropdown.
        Autocomplete: Suggests common medications that may be relevant to pt care first and foremost.
        Interaction Checks: Identifies Rx interactions and applies Alerts/Warnings (e.g., PDE‑5 inhibitor → warn against nitroglycerin).

    Indications: Type‑to‑filter or choose from dropdown. Chief Complaint (e.g., chest pain, SOB).
        Highlights: Topics related to the Indications are highlighted.

    Signs & Symptoms (S/S): Same mechanics as Indications; adds nuance for smart filtering/highlighting.

    Vital Signs (VS): Manual entry or dropdowns. Abnormal values trigger warnings or Strike-Through contraindicated actions.
      Selectable Options: Hover/press‑and‑hold on dropdown option opens a right‑of‑sidebar pop‑up with definitions; close via “×”.
    VS include:
      Blood Pressure (BP): Number entry or dropdown.
          Drop-Down Menu Options: 200+, 160+, Normal (90-160 SBP), 70-90, & 70-.
          Inpute Range: SBP 0–400; diastolic 0–300. Integers.
        MAP: Auto‑calculated from SBP/DBP; has its own pop‑up.
      Heart Rate (HR): Number entry or dropdown.
          Drop-Down Menu Options: 150+, 100+, 60–100, >60, >40.
          Inpute Range: Integers. SBP 0–300 bpm. Diastolic BP 0-200
      SpO₂ (%): Number or dropdown.
          Drop-Down Menu Options: (Normal, Low, Severely Low).
          Inpute Range: Integers 50–100.
      EtCO₂: Number or dropdown.
          Drop-Down Menu Options:
          Inpute Range: Integers 0–50.
      RR: Number or dropdown.
          Drop-Down Menu Options: 
          Inpute Range: Integers 0–80.
      BGL: Number or dropdown.
          Drop-Down Menu Options:
          Inpute Range: Integers 0–900.
      Pupils (mm): Number or dropdown.
          Drop-Down Menu Options:
          Inpute Range: Integers 0–8.
        Note: future updates needed to access other eye issues.
      GCS: Number or dropdown.
          Drop-Down Menu Options:
          Inpute Range: list runs 3–15.
      A&O: Dropdown only.
          Drop-Down Menu Options: 0, 1, 2, 3, & 4.
      Lung Sounds (LS): Type‑to‑filter or dropdown.
          Drop-Down Menu Options:

    EKG: Free text in sidebar (#pt‑ekg).
      Future Tasks: dropdowns, pop‑ups, or “help.” Snapshot can tint entries containing “tachy”/“brady” if patientData.ekg is set. Current code doesn’t set it in updatePatientData(); add that assignment to enable snapshot and future EKG logic.

  Defaults & Behavior: All fields are optional.
    More Data: = tighter tailoring.
    No Data: = No UI/app effects/changes.
    Data input: UI updates instantly on input.
    Stored Data: Data persists in memory; session persistence via localStorage is on the roadmap.

Effects of Patient Data: The information input in the Patient Info sidebar influences the main content in real time (Section needs lot of improvements still).
  StrikeThrough Inapplicable Items: Occurs when certain Patient Info has been entered.
    Contents List Topic Titles: Irrelevant Topic Titles are visually de‑emphasized by applying a strike‑through style (relevant topics remain normal).
    Detail Page Sections: Irrelevant sections are visually de-emphasized by applying a faded strike-through style (relevant info remains normal).
      Age Patient Info Example: Entering in an Adult age will cause information specific to Pediatric patients to have a faded strike-through style.
  Warnings/Alerts: Warnings are meant to be more noticeable than Alerts, which should also be noticeable.
  If patient data triggers a contraindication or warning, the detail page will show a prominent warning box (usually with a red border or background). Warnings are intentionally noticeable (red/yellow boxes) and appear only on the detail page.
    Warnings/Alerts are capable of being triggered by:
      Patient Info that may cause a Strike-through effect:
      Patient Info that may cause a Warning effect:
      Allergy Input: Corresponding detail page shows a prominent Allergy Alert at the top.
      Detail pages render prominent warning boxes at the top when patient context triggers a contraindication or caution. Current checks include:
      Allergy Alert: if an entered allergy matches the topic title/id.
      NTG-specific: low systolic BP (< 100 mmHg) and PDE5 inhibitor usage both trigger red contraindication warnings (“do not administer …”).
      Pediatric Etomidate: age < 10 triggers a contraindication warning for Etomidate.
      General Contraindications: non‑allergy entries from the medication’s contraindications list are displayed as individual warnings.
  Dynamic Content Filtering: When Patient Info (or Patient Data) is present, the Contents list visually de‑emphasizes non‑matching topics by applying a strike‑through; all topics remain visible and in their original order. Symptoms do not currently affect the list. Highlighting, hiding, or reordering into a “Suggested” section is not implemented yet and is tracked as a future enhancement (see Enhanced Dynamic Protocol Filtering in Chapter 10).
The app reflects patient context in three ways today: (1) Indications apply a strike‑through to non‑matching topics in the Contents list; (2) detail pages de‑emphasize Adult vs Pediatric Rx sections based on age; and (3) a compact patient snapshot appears below the search bar showing key details (age/sex/weight, indications, relevant allergies, vitals, and EKG). Category‑level fading or notes (e.g., hiding or dimming entire “Pediatric Protocols” for adults) is not implemented.

Patient-Snapshot: A compact summary bar (#patient-snapshot-bar) appears below the Search Bar. Updates in realtime as Patient Info changes. It is a persistent context line while navigating. It includes:
  Age/sex: (e.g., “45yo Male (Use symbol instead)")
  weight: (e.g., “60kg”)
  Indications: Underlined blue, Abbreviated where possible.
  Allergies: “NKA” if none; otherwise a concise subset relevant to the current context (e.g., “ASA” for chest‑pain‑like indications).
  PMH: Most relevant. Abbreviated.
  Vitals: BP/HR/RR/BGL with subtle severity coloring when clearly high/low.
  EKG: Shown with mild severity coloring for “tachy”/“brady”) when patientData.ekg is populated. (Feature description does not reflect what user will eventually have coded).
  Examples: “45 y/o F, 60 kg; Takes Beta-Blockers (The user entered "Metoprolol” into the Patient Info section, but "Beta-Blocker" would be shown in the Patient-Snapshot, since Beta-Blocker has a higher potential for being relevant in the context of administering Beta adrenergic medications); Broncospasm; (then underneath in red warning font) WARNING: Albuterol may be ineffective for Tx if the pt is actively taking her Metoprolol Rx!" and the WARNING message in red font would also be a clickable button that can provide further information on the WARNING. 
  Note: The snapshot does not currently perform drug‑class mapping or show embedded warnings; those appear on detail pages. 

Auto-Calculations: For Rx dosing, universal automatic mg/kg → mg (and mL) computations are not yet implemented. Medication detail sections render dose text from data (with markup) but do not perform global dose math. A dedicated medication dosage calculator module is planned (see Current Tasks), which will compute mg/kg and mL values with step‑by‑step math shown in Pop-ups, & will all have live updates as patient weight changes.
  Quick Vent Tidal Volume calculator: Computes tidal‑volume ranges (No ARDS, ARDS, Not‑Sure) using entered weight or IBW (sex + height), and shows explicit math on demand. 




Navigation Buttons (Back, Forward, Home, History): Appears in the top-right of the header. The app provides basic navigation controls similar to a web browser, so users can easily move between viewed pages without losing their place:

  Back Navigation Button: Left arrow. Initially disabled & grayed out (because there is no history yet). Once the user navigates to at least one detail page (or performs a search, etc.), the Back button becomes active.
    To Activate: View a detail page or commit a search.
    Clicking Back Navigation Button:  Clicking Back restores the previous state precisely: if returning to the Contents list, the app re‑expands the relevant category path and highlights the previously viewed topic, scrolling it into view. If the previous state was a detail page, it re‑renders that page directly.
  Forward Navigation Button: Right arrow. Adjacent to Back Navigation Button. 
    To Enable: is enabled only when a “next” view exists in the navigation history (typically after pressing Back). Clicking it advances to that next view, restoring either the list (with the appropriate expansion/highlight) or a detail page, mirroring browser‑style forward navigation. It re-navigates to the page that was ahead in history. 
  Home Button: Under the Back/Forward Navigation Buttons. Resets interface to the top‑level Contents view. Clears search field, collapses all expanded categories, and renders a fresh list (renderInitialView(true)). Patient Info entries are not affected by the Home Button. Does not preserve expanded states. Essentially a shortcut to renderInitialView() fresh.
  History Button (Clock icon): Located under the Home Button. Opens a modal panel listing viewed items for the current session. Entries are clickable and navigate directly to that detail page; the panel closes and the overlay clears when an entry is selected or when the panel’s close (X) is clicked. History is currently session‑only, but is planned to be updated to persist through sessions (so if they close and reopen the app, they will still see past items).

Settings Button: Located in the footer (#settings-button). Opens a modal #settings-panel over the overlay. The button text cycles between two colors (CSS animation) to draw attention. Opening Settings automatically closes the Patient Info sidebar if it’s open to avoid overlap. Settings changes persist between sessions; The panel currently includes:
  Dark Mode toggle: Persists via localStorage('darkMode').
  Dark‑mode brightness slider with live preview: Persists via localStorage ('darkModeBrightness'), applied through CSS --brightness.
  Future Updates: Other customization options will be added to this panel over time. There will be a broad depth of options to customize, making the app capable of being tailored to an individuals wants and needs.

Performance and Simplicity: The app prioritizes speed and reliability. It is built using HTML/CSS/JS and ES Modules. All content is loaded locally. Because all data is embedded in JavaScript objects, the app works offline once loaded (ideal for use in the field where internet might not be available). There are no runtime fetch calls for data, eliminating network delay.
  Tailwind CSS: We use Tailwind CSS via CDN for rapid styling using utility classes. Tailwind provides a consistent look and spacing without writing large custom CSS. Our custom styles.css adds a few project-specific styles (like custom classes for strikethrough or warning highlights, and any layout tweaks). This approach means we can restyle quickly if needed, but also have predictable styling.
  Interface: Intentionally uncluttered. Simple header, a sidebar for patient info, a content area that either shows a list or detail info, and a footer if needed. Font choices & sizes are made for readability.
    Color coding: Blue for interactive elements, green for toggles, red for warnings, yellow for Alerts (used to draw attention appropriately). Future tasks may add more color coding options.
  Design Choices: Center on making the app usable in high-stress scenarios. Big touch targets for buttons (for use on tablets/phones in the field), logical organization so info can be found with minimal taps, & fail-safes like Warnings or Alerts to help prevent medical errors.


## 4. PROJECT STRUCTURE
The project is organized into several files and directories, each serving a specific purpose.
Overview of the structure & key files along with their associated folders:
  index.html: The app’s entry document.
    Header: Links Tailwind CDN and styles.css, & defers viewportFix.js for mobile --vh fixes.
    Body: Defines the overlay, Patient Info sidebar, header (Patient button left; title + #searchInput + #patient-snapshot-bar center; Back/Forward → Home → History right), the #content-area, the footer with #settings-button, & the #settings-panel.
    Script loading is ESM: a single <script type="module" src="main.js"> bootstraps the app; all Data/Features/Utils modules are imported from there. If you ever add another top‑level script or change load order, perform a full order‑of‑operations audit across affected files (ensure data maps build before indexing; indexing before first render; DOM refs before handler binding) and include the new file in index.html only if it must run before bootstrap.

styles.css: Custom CSS stylesheet. Loaded in the head of index.html to complement Tailwind utilities & provide precise behavior Tailwind can’t address cleanly (e.g., rotation states, overlays, brightness filter). Augments Tailwind with focused rules.
  Lists & links: .topic-link-item hover/active states; .recently-viewed highlight; .strikethrough to de‑emphasize list items.
  **[Detail sections: .detail-section-title uses Show/Hide badges; .toggle-info (green) reveals inline panels; .warning-box variants (red/orange/yellow).]**
  Sidebar & overlay: slide‑in patient sidebar (#patient-sidebar.open), dim overlay (#sidebar-overlay.active), and inputs/focus rings.
  Autocomplete: .autocomplete-suggestions dropdown layout and visibility.
  Snapshot: .snapshot-card class (present for potential card styling); dark‑mode adjustments.
  Dark mode & brightness: body.dark-mode sets a filter using --brightness (persisted via Settings); selected components have dark‑mode color overrides.
  Quick Vent (ZOLL) UI: .qv-* classes for title, answer layout, modal/tooltip, & input sizing.
  Settings button: #settings-button animated color transition (CSS keyframes).



Data/ (Data files directory): Holds static ES modules that define application content. Files export constants that are imported by main.js, which constructs global registries for runtime use.
  Data/ParamedicCategoriesData.js: exports the hierarchical Contents tree (export const ParamedicCategoriesData = [...]). Uses slugify() to generate stable IDs for categories/topics, & optional children for nesting.
    Usage: main.js will iterate over window.ParamedicCategoriesData to build the menu. Each topic or subtopic’s id is crucial as it links to details in the next file. main.js imports this module and calls processItem() for each root category to populate window.allDisplayableTopicsMap and build the search index. These ids must match corresponding entries in MedicationDetailsData or VentilationDetailsData for detail pages to load.
  Data/MedicationDetailsData.js: exports an array of medication detail objects keyed by id (fields like class, indications, contraindications, adultRx, pediatricRx, etc.).
    Typical Fields: title, class, indications[], contraindications[], precautions, sideEffects[], adultRx[], pediatricRx[], & optional notes. 
    main.js: Imports these modules, merges medication + ventilation detail arrays into window.medicationDataMap, indexes categories with processItem() to populate window.allDisplayableTopicsMap, and then renders the initial list.
    Detail pages: render sections from these fields (Class, Indications, Contraindications, Side Effects, Adult Rx, Pediatric Rx). 
    Note: Non‑allergy contraindications are also surfaced as warning boxes automatically on detail pages (this sentence needs to be updated).
  Placeholders: Data/additionalMedications.js and Data/patientInfoSynonyms.js (reserved for future expansion).
  Data/VentilationDetailsData.js: Exports equipment & Quick Vent content (EMV731) as an ES module. Entries are keyed by id (must match topic ids in ParamedicCategoriesData.js).
    equipment: true to mark equipment pages.
    mdPath for curated Markdown content per section (rendered into collapsible sections on detail pages).
    originalPdf (+ optional pdfPage) to link and optionally embed the source chapter inline.
    Quick Vent topics identified by quickVent: 'setup' | 'calculator' for the Zoll Set Up flow and the Tidal Volume calculator UI.
    main.js merges these entries with medication details into window.medicationDataMap so detail views can be rendered consistently. The Quick Vent calculator logic and section rendering are handled in Features/detail/DetailPage.js (equipment flow).

Features/ : Feature-specific scripts. This directory groups scripts that handle a particular aspect of the app’s functionality.
  Features/anchorNav/slugAnchors.js: Provides setupSlugAnchors(tocData) which inserts a "Table of Contents" <nav id="detail-toc"> into the detail view and renders a list of anchor links for each section. Clicking an anchor scrolls smoothly to the target; if that section is collapsed, it auto-expands the section, updates the Show/Hide badge, and marks the header as expanded. tocData is built by the detail renderer from .detail-section-title elements (using slugify ids). Current behavior does not highlight the active section while scrolling (though that's a potential enhancement). For now, its main job is to display the list of section links. Both slugList and slugAnchors are triggered after renderDetailPage completes inserting content.
    Troubleshooting If anchors are not appearing or not working, ensure that: (1) section headings have ids (generated by slugify), (2) slugList is capturing them, and (3) slugAnchors is appending the links to the DOM. Also, check that the anchor link href exactly matches a section id. Consistency is key, which is why slugify should be used everywhere.
  Features/anchorNav/slugList.js: Provides a static slugIDs array of topic slugs (primarily for developer tooling and legacy anchors). It exposes the array to window.slugIDs for backward compatibility and exports it for ES‑module consumers. It does not scrape the DOM or gather section IDs at runtime. The in‑page Table of Contents is built by the detail renderer from .detail-section-title elements and passed to setupSlugAnchors().
    Troubleshooting: If a section isn’t appearing in the anchor menu, this script is the first place to check (does it capture it correctly?).
  Features/detail/DetailPage.js: Renders the detailed view for a selected topic.
    Escapes HTML and converts inline markup: [[display|info]] produces green, clickable “toggle-info” spans with Show/Hide chips and hidden text; colored emphasis tokens (e.g., {{red:...}}) are supported.
    Builds lists and text blocks with sensible defaults: empty arrays render “None listed.”; empty text renders “Not specified.”
    Composes collapsible sections: (e.g., Class, Indications, Contraindications, Side Effects, Adult Rx, Pediatric Rx). Each section header includes a Show/Hide badge for toggling; “Adult Rx” and “Pediatric Rx” are marked with .adult-section / .pediatric-section.
    Assigns stable id values to section titles via slugify(): enabling optional in‑page TOC injection on long pages (window.ENABLE_DETAIL_TOC and ≥ 6 sections) using setupSlugAnchors.
    Inserts patient‑aware warnings at the top: (allergies, PDE5 + NTG, low BP + NTG, pediatric Etomidate, and non‑allergy contraindications) using appendTopicWarnings.
    Writes a .topic-h2 header (with data-topic-id) and updates navigation history unless disabled; optionally scrolls to the top of the content area.
    Fallbacks: if the topic id is missing, shows “Not found.”; if the topic has no details, inserts “No detail information found for this item.”
  Features/list/ListView.js: Owns the Contents (home) list. renderInitialView(shouldAddHistory, highlightId, categoryPath) clears #content-area, renders the hierarchical list, optionally expands along categoryPath, highlights highlightId with the .recently-viewed class, scrolls it into view, & (when requested) pushes a “list” entry into navigation history & updates Back/Forward button state.
    createHierarchicalList() builds rows: categories render with a left blue chevron and bold label; clicking the chevron or label toggles expansion (chevron renders rotated 0°/90° by inline style). Leaf topics render as clickable links with data-topic-id and route to renderDetailPage(id).
  Features/navigation/Navigation.js: Manages navigation history and Back/Forward controls.
    Exposes: navigationHistory (array of view states) & currentHistoryIndex.
    addHistoryEntry(entry): pushes a new state (truncating any forward entries) and updates Back/Forward enabled state.
    updateNavButtonsState(): disables Back at start of history & Forward at end.
    navigateViaHistory(direction): moves backward/forward one step and restores the state:
      List state: Restored via window.handleSearch(false, highlightId, categoryPath), which expands categories & highlights the target detail state is restored via renderDetailPage(id, false, false).
    attachNavHandlers(): binds Back/Forward buttons to history navigation
    Temporarily exposes a few methods on window for compatibility.
  Features/navigation/Home.js: Implements the Home button functionality to return to the main Contents page.
  Features/patient/Autocomplete.js: Autocomplete suggestion handling for Patient Info fields. Enables autocomplete suggestions for a textarea input field.
  Features/patient/PatientInfo.js: Manages the Patient Info sidebar & central patientData. updatePatientData() reads inputs (dual KG/LB weight, height syncing, PMH/Allergies/Meds/Indications/Symptoms, vitals), applies list strike‑throughs when Indications are present, re‑renders the active detail page to refresh warnings/context, applies age‑based strike‑through to Adult/Pediatric Rx sections, & refreshes the snapshot. It also exposes patientData & key constants for legacy access.
    Note: wire patientData.ekg = getInputValue('pt-ekg') if snapshot EKG display and future rhythm logic are desired.
  Features/patient/PatientSnapshot.js: Planned file for capturing a snapshot of patient info; not yet implemented.
  Features/search/Search.js: Builds the searchable index during category processing (processItem) & filters topics as you type. Matching is case‑insensitive against title, id, and  full category path. Results render in #content-area with a “Show All Categories” button that clears the search and restores the full list. Clicking a result (or pressing Enter/Space on it) opens that topic’s detail page.
    Note: the current setup adds search states to navigation history on input changes & on Enter; if you want typing to be non‑committal, adjust the handler to commit only on Enter.
  Features/settings.js: The Settings button in the footer cycles between two colors (CSS animation) to draw attention. Manages the footer Settings button & the #settings-panel.
    Clicking Settings Button: Closes Patient Info sidebar if open, then opens the panel & activates the shared overlay; the panel’s close (X) hides it & clears the overlay.
    Current options:
      Dark Mode toggle: persists via localStorage('darkMode') & applies an app-wide class.
      Brightness slider: persists via localStorage('darkModeBrightness') & updates CSS --brightness, which body.dark-mode uses to adjust overall brightness.
  Features/Warnings.js: Builds patient‑aware warnings for detail pages.
    Current checks:
      Allergy Alert: when a patient allergy matches the topic title/id.
      Nitroglycerin (ntg): contraindications for systolic BP < 100 mmHg & for recent PDE5 inhibitor usage (Viagra/Cialis/etc.).
      Etomidate (etomidate‑amidate): pediatric contraindication when age < 10.
    General contraindications: Listed in data (excluding allergy/hypersensitivity lines). Rendered as distinct warning boxes.
    Optional age‑range cautions: When a detail entry specifies an ageRange.
    Warnings: Injected at the top of the detail view and are intentionally prominent (red/yellow boxes with an icon).
  Features/History.js: Implements the History modal (#history-panel).
    Clicking the History button opens a list of previously viewed detail pages from the current session; each entry is a link that navigates back to that detail & closes the panel/overlay.
    The modal can also be closed via its (X). History content is derived from navigationHistory. Currently not persisted across reloads (will be coded to do so in future).
The following feature modules exist as placeholders and are not yet integrated:
Features/CardiacArrest.js — planned “Cardiac Arrest” mode (timers, intervention prompts, CPR cycle tracking).
Features/Diagnoses.js — planned diagnostic suggestions based on patient inputs (symptoms, VS, PMH).
Features/dosageCalc.js — planned medication dose calculator (mg/kg → mg and mL) with step‑by‑step math.
Features/pcrNarrative.js — planned PCR narrative generator from patient/context data.
Features/VoiceMode.js — planned voice control (speech recognition + TTS) for hands‑free use.
These files currently contain descriptive comments only & no runtime behavior.
# Features/patient/Patient Info Sidebar/ (All files still need to have code placed within them) 
  /Allergies.js
  /Contraindications.js
  /CurrentMedications.js
  /Indications.js
  /PatienetAge.js
  /PatientWeight.js
  /PMH.js
  /Symptoms.js
  /VS.js




 
updatePatientData(): This script works closely with main.js, reads the current values from all patient info fields (e.g., age field number, list of allergies entered, etc.) & updates the patientData object. After updating data, it relies on main.js functions like re-rendering pages or lists. It also relies on global structures (like allDisplayableTopicsMap and allSearchableTopics) which are set up in main.js. Thus, it’s included after those structures exist. The event listeners in PatientInfo.js ensure that as soon as the user types or selects something in the sidebar, the rest of the app responds.
  Triggers various UI updates: (for example) May call applyPatientFilters() which goes through the topic list in the DOM & adds or removes a CSS class (like .strikethrough) on each topic depending on patient criteria. It will also invoke a refresh of the current detail page view (if one is open) by calling renderDetailPage for the current topic ID with the new context, so that any dosage calculations or warnings can update immediately.
    May also declare some global sets or arrays for use in *Autocompletion* (for example, lists of common allergies or medications are defined in *main.js* & passed to this file’s scope for use in *Suggestions*.)
    The separation of patient info logic here means all rules about how patient data affects the UI can be managed in one place (for instance, if we add a new field like “Pregnancy” in the future, we’d adjust this file to handle any special cases for that field).

Content: Includes the following folders (Files still need to be created within each of the folders):
  Content/Abbreviations & References/
  Content/Administrative & Legal Essentials/
  Content/Adult Protocols/
  Content/Introduction & Core Principles/
  Content/Operational Protocols/
  Content/Pediatric Protocols/
  Content/Skills and Equipment/

Assets: Includes the following folders (files still need to be created within each of the folders):
  Assets/Images/
  Assets/Videos/

Utils/ : Utility scripts. These are helpers that are used across the app for small tasks, often included early so they can be used by other scripts.*
  Utils/addTapListener.js: Adds a unified “activate” handler for both mouse & keyboard. When attached to an element, it invokes the given handler on click or when the user presses Enter/Space (via ‘keypress’), preventing default as needed. Used across list items, search results, & History links to keep interactions consistent & accessible.
  Utils/escapeHTML.js: Escapes special characters in a string (& < > " ') using a small lookup map.
    Used when rendering user-sourced or data-sourced strings into HTML (e.g., search headers), to prevent unintended markup & ensure safe display.
  Utils/slugify.js: Converts strings to URL/ID‑safe slugs.
    Lowercases, replaces whitespace with -, maps common punctuation and subscript digits to -, collapses multiple -, trims leading/trailing -.
    Used to generate ids for .detail-section-title headings in detail pages so anchor links & the optional in‑page TOC work reliably. Always use this function for any new section titles or topic ids to avoid mismatches.




*Main Scripts (project root): These are the core JavaScript files (often loaded directly in index.html) that drive the app’s functionality.*

  **viewportFix.js** – A small script that fixes the behavior of CSS 100vh on mobile browsers. On some mobile devices, 100vh can be problematic (because of browser UI chrome). This script calculates the actual viewport height and sets a CSS variable or updates elements like the sidebar to ensure full-height coverage. In effect, it ensures elements intended to span the full screen actually do so without causing scroll issues. This is mostly a UX polish for mobile compatibility. (It might add an event listener to window resize and adjust some CSS custom property like --vh which is then used in CSS in place of 100vh).







  **main.js** – The central application script that brings everything together. It handles initialization, rendering of views (list or detail), search functionality, and integrates the patient info into the content. Some key responsibilities and functions in main.js:

    Initialization (initApp): On DOMContentLoaded, initApp() is called. This function does initial setup like calling assignDomElements() to cache references to important DOM nodes (search input, content area, buttons, etc.), setting up event listeners (for search bar input, for navigation button clicks, etc.), and preparing the data. It ensures the Patient Info sidebar is hidden by default (adding hidden classes), and attaches the open/close logic for that sidebar (e.g., clicking the overlay or close button hides it, clicking the open button shows it – see lines around 38–60 in main.js for how it toggles classes for open/hidden).

      It also initializes autocomplete for patient info fields by calling a helper setupAutocomplete on various patient info textareas (for example, past medical history, allergies, medications, etc. have suggestion dropdowns). This makes user input faster and more uniform.

Proposed rewrite (final)
Initialization (initApp)

On DOM ready, initApp() runs. It caches key DOM elements via assignDomElements() and exposes them globally (for cross‑module use), ensures the overlay and Patient Info sidebar start hidden, and wires open/close handlers: clicking the Patient Info button opens the sidebar and activates the overlay; clicking the close (X) or overlay hides it (with a short transition). Navigation (Back/Forward), Home, and search listeners are attached here. It also initializes autocomplete for PMH, Allergies, Medications, Indications, and Symptoms, making free‑text entry faster and more consistent.





      Critically, initApp() calls initializeData(window.ParamedicCategoriesData, window.MedicationDetailsData). This merges the static data (loaded from the Data files) into internal structures. For instance, it might copy the array from ParamedicCategoriesData into a global paramedicCategories variable, and then traverse it to build allDisplayableTopicsMap (mapping every topic ID to its object with references to parent categories). It also builds allSearchableTopics, an array of objects each containing a topic’s title and full path, which is used to perform text search quickly.

      Once data initialization is done, it calls renderInitialView() to display the main content list. It also ensures the navigation history is set up (an empty array with index -1 initially) and that the Back/Forward buttons are correctly disabled at start.

Proposed rewrite (final)
main.js — application bootstrap

ES module entry point. On DOM ready, initApp():
Caches key DOM elements (assignDomElements) and exposes them on window for cross‑module use; renders an HTTP warning if served via file://.
Wires navigation (Back/Forward), search (live filter + Enter commit), Home, Settings/overlay, and Patient Info sidebar open/close behavior.
Builds window.medicationDataMap by merging MedicationDetailsData and VentilationDetailsData, then indexes ParamedicCategoriesData via processItem() to populate window.allDisplayableTopicsMap and the search index.
Initializes autocomplete for PMH/Allergies/Medications/Indications/Symptoms and renders the initial patient snapshot if available.
Adds small UX touches (focus rings on inputs).
Renders the initial Contents list via renderInitialView(true) (or shows “No categories available”).
All Data/Features/Utils are imported as ES modules; index.html includes only <script type="module" src="main.js">.





    Rendering the Category List (renderInitialView): This function populates the main content area with the list of categories and topics (the table of contents of the app). It likely uses a helper (maybe internally defined) that recursively creates HTML for a given category and its children. Each category is output as a clickable card that displays its title alongside a Show/Hide badge. Each topic (child without further children) is output as a <div class="topic-item"> or button element with an attached data-topic-id. The structure in HTML might be nested <div class="category-group"> containing a parent and its child list, etc.

      If renderInitialView(highlightId) is called with a highlightId (meaning we want to highlight a particular topic when rendering, e.g., after coming back via Back button), the function will ensure that category is expanded and scroll into view, and add a highlight style to that topic. This helps the user see where they left off.

      The result of this function is that contentArea (the main section in index.html) will be filled with the hierarchical list of all topics. Event listeners are set so that clicking on any Show/Hide badge toggles the appropriate section (show/hide children), and clicking on any topic name (leaf node) triggers renderDetailPage for that topic.

    Rendering a Detail Page (renderDetailPage): This function takes a topic ID as argument. It looks up that ID in allDisplayableTopicsMap (which contains both the structural info and the detail info if available). If found, it clears out the contentArea and then builds the detail view for that topic. Steps include:

      Insert a title heading (e.g., <h2>Epipen (Epinephrine) Autoinjector</h2>).

      For each section of data present for that topic, create a section in the DOM. For example, if the topic object has a description field (string), create a <h3 id="description">Description</h3> and a <p> or <div> with the description text. If there’s an indications array, create <h3 id="indications">Indications</h3> and perhaps an unordered list of indications. Do the same for Contraindications, Dosage, etc. The slugify utility is used when setting the id on these headings (ensuring anchor links will match).

      If a dosage field is present (adult and/or pediatric), the function might format them clearly, possibly with subheadings for “Adult Dose” and “Pediatric Dose”. Those sub-sections also get slugified IDs like “adult-dose” and “pediatric-dose”. If patient’s weight is known and the dosage is weight-based, perform the calculation as described earlier. If the patient’s age indicates one of those sections doesn’t apply (e.g., a 30-year-old patient would mean that the pediatric dose section is not applicable), that section might get a CSS class to gray it out or a note “(N/A for adult patient)” or have a *Strikethrough*.

      Insert any special notes or side effects similarly. Use consistent styling for warning/caution sections – for example, if a medication has a Black Box Warning, that might be highlighted in red or with an icon.

      Patient Data Integration during render: Before finishing, renderDetailPage will incorporate patient context. It checks window.patientData. For instance, if patientData.allergies includes the medication name (or class), it will append an alert box at the top of the detail page like “⚠️ Allergy Alert: Patient is allergic to [MedicationName]”. If patientData.medications includes something contraindicated, similarly show an alert. If patientData.vitals (like blood pressure) contraindicate use, show that warning. These checks are coded in this function, often as simple if conditions comparing patientData values to known contraindications in the data.

      Also, as part of rendering doses, it might strike out or italicize parts that don’t apply (for example, if patient is pediatric, the adult dose section could be deemphasized with a note “(patient is pediatric – use pediatric dose below)”).

      Finally, after injecting all content, renderDetailPage will typically call slugList() (to gather section IDs) and then setupSlugAnchors() (from slugAnchors.js) to build the section table of contents if applicable. The detail page might be long, so having that quick navigation at the top improves usability. If a detail page ends up short (only one or two sections), the anchor menu might be omitted – the implementation can handle that by checking the number of sections.

    Navigation and State Management: main.js also manages the history of views manually, since this is a single-page app (the browser’s back button is not used for navigating content, only our own controls are):

      A global navigationHistory array is maintained. Every time a view is rendered (either list or detail, or search results), an entry is pushed to this history with identifying information (like type of view and an identifier, e.g., {type: 'detail', id: 'aspirin'} or {type: 'list'}). currentHistoryIndex tracks the index of the current view in that array. Clicking Back or Forward will decrement or increment that index and then call the appropriate render function for that historical entry (without pushing a new history entry of course). The code ensures that going back and then clicking a new link throws away “forward” history past the current index (just like a web browser would).

      After each render, the code updates the disabled/enabled state of the Back/Forward buttons. If currentHistoryIndex is 0, Back is disabled (nothing before it). If currentHistoryIndex is at the end of the array, Forward is disabled. Otherwise, both can be enabled.

      The Home button, when clicked, calls renderInitialView() and pushes a new entry (or possibly clears the history beyond that point, since it’s like starting over). We ensure Back will then go to what was previously viewed.

      The search interactions integrate with this too: performing a search might be treated as a new view state (type: 'search', query: 'keyword'), so that pressing Back after going to a detail from search can return you to your search results.

    Search Handling: The function handleSearch(doFilter) is implemented to manage what happens as the user types or submits the search query.

      We maintain allSearchableTopics which is an array of objects like { title: "Aspirin", fullPath: "ALS Medications > Aspirin", id: "aspirin" }. The search function will scan through this array to find any topic whose title or path contains the search string (case-insensitive).

      The results are then passed to renderSearchResults(), which, similar to renderInitialView, clears the content area and displays a list of matching topics. Each result is a clickable item that opens that topic’s detail page. We often show the category context in smaller text (e.g., result item might say “Aspirin — ALS Medications” to clarify which section it’s in).

      If the search input is cleared, the app will return to the previous view or main list. We also provide a “clear” button in the search bar (usually an ❌ icon) to quickly reset the search.

      The search feature ensures paramedics can jump directly to what they need (for example, typing “epi” will quickly surface the Epinephrine medications). Speed and accuracy of matching are important, so this function should be efficient (iterating a pre-made list rather than traversing the DOM, for instance).

      (The Smart Suggestions in the UI might be handled here as well, possibly by providing quick shortcut links for common searches, but as mentioned, that’s an evolving feature.)

In summary, the structure ensures that: Data is separated from Logic (data files vs main.js), UI behavior is modular (PatientInfo in its own file, anchor nav in its own file), and everything is glued together by main.js. All scripts are included in the correct order via index.html so that dependencies are satisfied.


## 5. HOW THE CODE WORKS TOGETHER

Understanding the flow of the application from load to user interactions:

  Initial Load & Data Preparation: As soon as index.html is opened (in a browser or a WebView), the included scripts load in the specified order. First, ParamedicCategoriesData.js runs and defines window.ParamedicCategoriesData. Then MedicationDetailsData.js runs and defines window.MedicationDetailsData. At this point, all the reference information the app needs is in memory as JavaScript objects.

  Next, utility files like slugify.js load (defining functions for later use). Then feature files like PatientInfo.js load, which likely set up the global patientData (initially empty or with defaults) and possibly event listeners for the sidebar inputs (though some event binding might also happen in main.js after DOMContentLoaded).

  Finally, main.js loads. Because we check document.readyState and possibly attach a DOMContentLoaded event, initApp() will run once the DOM is fully built (ensuring all HTML elements are present to be referenced).

  App Initialization: initApp() in main.js executes. Key steps:

    Cache DOM Elements: assignDomElements() finds important elements by ID (search input, content area, sidebar, open/close buttons for sidebar, overlay, nav buttons) and stores them in variables. This improves performance and code readability (no need to query DOM repeatedly).

    Sidebar Setup: Hide the sidebar overlay initially (adding .hidden class) and ensure the sidebar itself is hidden (maybe it starts hidden via CSS anyway). Attach event listeners to open and close the sidebar:

      Clicking the Patient Info button removes the .hidden class from the sidebar (making it visible, possibly with a CSS transition slide-in) and adds an .active class to the overlay to darken the main content area.

      Clicking the close “X” on the sidebar or clicking the semi-transparent overlay does the reverse: it removes the open class from sidebar (triggering slide-out) and after a short delay adds .hidden back to it (actually hiding it so it doesn’t block touch events), and hides the overlay. This logic was unified to ensure closing works consistently no matter how it’s triggered.

    Search Input Events: Add an input event listener to the search field so that every keystroke triggers a filtering function (handleSearch(true) possibly filters the list live). Add a keypress listener for the Enter key to perform a final search action (in case we want to show a separate results page or simply finalize the filter).

    Navigation Buttons: Attach click handlers to Back and Forward buttons (navigateViaHistory(-1) and navigateViaHistory(1) respectively). These will handle updating the view based on the history index. Initially, these buttons are disabled via HTML or by adding a disabled attribute/class in initApp. They will be enabled when appropriate during navigation.

    Data Integration: Check that window.ParamedicCategoriesData and window. MedicationDetailsData are available (they should be, given script order). Call initializeData(window.ParamedicCategoriesData, window.MedicationDetailsData). This function will:

      Take the categories array and copy it into the global paramedicCategories (which main.js uses).

      Initialize or reset allDisplayableTopicsMap and allSearchableTopics.

      Traverse through each item in the categories data, and for each topic (especially leaf topics), find its detail entry in MedicationDetailsData and combine them if necessary. Typically, it might simply ensure that each topic object gets a reference to its detail object, or populate the map with an entry { id: topicId, title: topicTitle, categoryPath: "Category > Subcategory", details: (detailDataObject) }. It likely uses a recursive helper processItem(item, parentPath) to build these.

      Build allSearchableTopics: for each topic that can be searched (probably every final topic and maybe categories too), push an object containing its name and full path. This array is sorted or left unsorted; searching will iterate through it.

      Build medicationDataMap (as seen in code): a quick lookup by id for all detail entries, which helps in checking patient drug interactions quickly (like scanning all contraindications text).

      Pre-load any suggestion sets (as the code snippet shows, it populates sets for common PMH, allergies, meds, plus PDE5 inhibitor list, etc., by reading through the data). This improves the patient info autocomplete feature.

      Proposed rewrite (final)
Data Integration

main.js imports ParamedicCategoriesData, MedicationDetailsData, and VentilationDetailsData as ES modules.
  During initialization, it: Merges medication + ventilation detail entries into window.medicationDataMap keyed by id, exposing it before indexing so search/detail code can resolve details quickly.
  Recursively indexes the categories via Features/search/Search.js processItem(item, parentPath, parentIds), which: Attaches the resolved details to each item, Populates window.allDisplayableTopicsMap[id] = { … item, path, details, categoryPath }, & Fills an internal allSearchableTopics array used for search (title/id/path matching).
  The IDs in ParamedicCategoriesData must match the id fields in the detail arrays for the detail pages to render.

Activate Autocomplete, Focus Styling, Initial Render: Autocomplete is attached to the PMH, Allergies, Medications, Indications, and Symptoms textareas via setupAutocomplete(). It filters suggestions against the current comma‑separated segment, shows a clickable list, inserts unique selections with a trailing “, ”, refocuses the field, & dispatches an input event to refresh patientData. Suggestion sets are seeded during init (common PMH/allergies/meds + PDE5 inhibitors; additional allergens extracted from contraindications).
For usability, all inputs/textareas gain a blue focus ring on focus & remove it on blur.
After data maps and indexes are ready, renderInitialView(true) renders the main Contents list in #content-area (or a “No categories available” message if categories are empty).

Expanding Categories (User Interaction): Clicking a category’s blue chevron or label toggles its expanded state & re-renders that branch via createHierarchicalList(). When expanded, children are rendered into a nested container; when collapsed, the branch re-renders without children. The chevron’s rotation (0° vs 90°) is set inline during render based on the current item.expanded value. Expanded/collapsed state is stored on the category item (not in data attributes). Normal toggles do not alter overall scroll position; when restoring state from history, the list re-expands the path and scrolls the previously viewed topic into view.

Viewing a Detail Page (User Interaction): Clicking a final topic (leaf) invokes renderDetailPage(topicId). This replaces #content-area with the topic’s detail view, injects any applicable patient‑aware warnings at the top, & (by default) adds a new “detail” entry to navigationHistory. Adding the entry updates Back/Forward button states (Back becomes enabled; Forward remains disabled because you’re at the newest entry). If renderDetailPage is called from Back/Forward navigation, the call sets shouldAddHistory = false to avoid pushing a duplicate history entry.

Dynamic Updates on Detail Page: Patient Info changes trigger updatePatientData(), which updates the patientData object, applies Indications‑based strike‑throughs to the list (if visible), re‑renders the current detail page in place (without adding a history entry), applies age‑based strike‑throughs to Adult/Pediatric Rx sections, and refreshes the snapshot under the search. If the page has many sections & window.ENABLE_DETAIL_TOC is true, the in‑page TOC is rebuilt from the updated section headers. Warnings (e.g., allergy, PDE5 + NTG, low BP + NTG, pediatric Etomidate, general contraindications) are re‑evaluated and injected at the top of the detail. 
  It then calls functions to update the UI. Typically, it will call something like applyPatientFilters() which goes through the main contents list (if it’s currently displayed) to strike out or highlight items. If the main list is not visible (user is on a detail page), that can be skipped or will simply operate on a hidden DOM (which is fine).
    It then checks if a detail page is currently shown (we might track the current view type and id). If yes, it calls renderDetailPage(currentTopicId) again to refresh the content with the new patient context. Importantly, when doing this refresh, it should avoid adding another history entry. There might be a flag or a separate internal function for re-rendering the detail in place. The effect is that the user sees the detail page update instantly: new warning boxes might appear, certain text becomes struck through, & dosage calculations update. The scroll position might be preserved if possible, or reset to top if not handled (for now, likely resets to top).
     Because the anchor navigation (slugList/slugAnchors) runs on renderDetailPage, it will re-generate after refresh. it ensures the anchor links are still accurate if any sections were added/removed due to patient data (typically we don’t remove sections entirely, just mark them).
        

5.4 Dynamic Updates on Detail Page  
- **Trigger pipeline:** `Features/patient/PatientInfo.js:155-276` listens to every sidebar field. When a value changes, `updatePatientData()` synchronizes kg/lb weight inputs, normalizes age/height, and refreshes the shared `patientData` object.  
- **List synchronisation:** The routine iterates `a.topic-link-item` nodes in the live list view, compares patient indications against each topic’s `details.indications`, and toggles the `strikethrough` class to de-emphasize non-matching entries. If the list is hidden (because a detail page is open), the updates are still applied so the list is accurate when the user navigates back.  
- **Detail rerender:** When a detail header (`.topic-h2`) is present, the handler calls `window.renderDetailPage(currentTopicId, false, false)` to redraw in place without adding a history entry. That rerender passes through the warning pipeline (`Features/detail/DetailPage.js:200-240`) so allergy/PDE5/BP/age/general contraindications are recomputed and injected at the top of the page.  
- **Section emphasis:** Adult vs. pediatric prescription blocks receive age-based `strikethrough` classes (`Features/patient/PatientInfo.js:233-247`), ensuring irrelevant dosing guidance is visually muted.  
- **Snapshot & tools:** `renderPatientSnapshot()` refreshes the compact banner under the search bar with new age/sex/weight/vitals (`Features/patient/PatientSnapshot.js:1-62`). If `window.ENABLE_DETAIL_TOC` is set and six or more sections exist, `setupSlugAnchors()` rebuilds the in-page TOC so anchors align with the updated headers (`Features/detail/DetailPage.js:234-239`).  
- **Quick Vent interplay:** When the active topic is part of the Quick Vent workflow, the rerender repopulates sex/weight/height controls and recalculates tidal-volume outputs, keeping the bedside calculator synchronized with sidebar context (`Features/detail/DetailPage.js:375-740`).






Back/Forward Navigation: Back/Forward use a view‑state stack. Clicking Back decrements the index and restores either:
  a list state by re‑rendering the Contents & expanding the relevant category path, highlighting & scrolling the previously viewed topic into view, or
  a detail state by re‑rendering the corresponding detail page (without adding a new history entry).
  Back/Forward button enabled states are updated after each move. Detail‑page scroll position is not currently preserved; list restoration scrolls to the highlighted topic.

History List Usage: History List Usage & Anchor Navigation: Opening the History modal shows a list of previously viewed detail pages from this session. Clicking an entry calls renderDetailPage(id) directly; this is treated as a new navigation event and adds a fresh “detail” entry to the history stack. The panel and overlay close immediately after navigation.
  On long detail pages with a Table of Contents, clicking an anchor smoothly scrolls to the target section and auto‑expands it if needed. This does not alter app state or the history stack.

Closing the App & Persistence: Currently, if the user closes the app (or refreshes), all state (patient info, history, expanded menus) resets because we are not using persistent storage. In future, we might use localStorage to save patientData & maybe navigationHistory between sessions. 
  Future coding task: Code features to persist patientData (so you don’t have to re-enter the same patient’s info if you switch apps briefly). Implementation of that would involve storing patientData in localStorage on unload and loading it on startup if available.

All these components work together to provide a seamless experience: The data provides content, main.js renders it & ties it to user input & navigation, & the patient info customizes it on the fly. Each file has a clear role.


## 6. -----TOP PRIORITY TASKS-----

**This section provides a list of tasks that must be worked on now unless explicitly told otherwise. Once this section is empty, proceed to the “CURRENT TASKS/GOALS” section in this README for additional tasks.**

Sex: Update the "Sex" field in the Patient Info Sidebar/Section to incoporate the symbols that get highlighted when selected, like in our "Zoll Set Up" Detail Page.

Settings: Color sliders for the app.
  Independent sliders for: main background, category background, main text, category text, warnings, pop‑up comments, other pop‑ups.
  Allow any color selection. Warn when the selected text color is similar to the chosen background.

Contraindication Warnings: Expand keywords, Add more contraindication keywords to Data/MedicationDetailsData.js, Update checks in updatePatientData() and renderDetailPage() as new medications are added, & Add comments indicating where to extend keywords and what else to update when adding a contraindication.

Search Bar: dual lists (Filtered + Smart Suggestions) & only one location for user input.
  Matching: Case-insensitive, and tries to match any part of a topic’s name or associated keywords. Updates per keystroke. Clicking navigates to detail. Both lists are scrollable.
  Two dynamic lists: Two side-by-side list of topics (Appears as the user types into the search input).
    Displayed: immediately below the Search Bar (side by side).
  Filtered List of Topics: On the left.
     This is that standard search bar that is currently implemented.
  Smart Suggestions: On the right.
    Displays: Filtered (by Patient Info & Search Bar text) list of topics.
    Topic List: Dynamically updates list from modification of Patient Info/Search Bar text.
      Example: User inputs "intubated" into Patient Info, and then inputs "d" into the Search Bar.
        Displays: Returns a list of topics that start with the letter "d" and involve Intubation or Intubated pt's, followed by the alphabatized list of Intubation related topics. Other Patient Info related topics will be prioritized afterwards. After all the Patient Info related topics are displayed first, the list will end with the rest of the baseline full Smart Suggestions list.
      No Patient Info: Display baseline full Smart Suggestions list (Search Bar text dynamically updates list order).
      Indirect Search Bar Routes: Topics may be found using common terms, synonyms, common spelling errors, or key-stroke errors.
        Key-Stroke Error Example: typing “dAtdi” might surface “Cardiac Arrest” even if those exact words haven’t been fully typed, or might suggest “Cardioversion/Cardizem”.
      Right Clicking/Long press on a Smart Suggestions Topic: Displays topics related the interacted topic (Interacted Topic remains at the top and the user is able to display the prior list by completing the action again).
      Higher Priority Topics: Cardiac Arrest, SVT, RASS +3, RASS +4, (Narcotic medication), ecetera. Higher Priority Topics may be classified by those which have a higher potential for patient harm if treatments are not quickly given.


## 7. CURRENT TASKS/GOALS

**TOP PRIORITY TASKS must all be completed before attempting any of the following Tasks.**

Current Task/Goal completed: Add a short, concise note to Chapter 8.
  Replace original Task/Goal location with Testing (if not already present).
  Tests: Add tests for any new bug (before the fix), for new features, and to test any completed Task/Goal.
    Organize test files: include minimal “how to run” notes when not obvious.

Patient Info Sidebar: visible app‑wide effects.
  Every field should drive visible UI changes: strike‑through inappropriate treatments, warnings pop, and adapt content.
  Examples: Enter “Morphine” in Allergies → viewing chest pain/pain protocols shows allergy warning; “Morphine” item is strike‑through (still accessible).
    Enter age 8 → viewing adult‑only medication should show pediatric warning
 
  Dynamic Dosage Recalculation: Implement fully dynamic dosage calculations for every medication.

Warnings/Alerts: Visually shown under Search Bar.
  Contraindication Warnings: visuals.
    When Patient Info contains contraindications (allergies, conflicting medications, low BP, etc.) the detail pages should display clear warning boxes in red font. For example, an allergy alert should show a red‑bordered box with a warning icon and message; drug interaction warnings and vital sign warnings should also appear as distinct boxes.
    If a patient has an allergy that matches the medication (or its class), a red-bordered box with an alert icon and message.
  Allergy Alert: "Patient has a known allergy to this medication” will appear at the top of that detail page.
    If the patient’s recorded medications include a drug that is contraindicated (e.g., PDE5 inhibitors when viewing Nitroglycerin), a warning box will similarly appear.
      Drug Interaction Warning: "Patient is on [Drug], which contraindicates [This Treatment]”).   
  VS Warning: "BP too low for this treatment!”.
   "
**[2025-09-22 EMV731 detail routing: Zoll EMV731 subtopics now open directly to their chapter sections without extra TOC layers, matching the operator workflow for General Information, Product Overview, Setup, Use, Alarms, and Accessories (source: Zoll EMV+ Ventilator Operator's Guide Rev. P, Chapters 1-5).]**
**[2025-09-20 EMV731 navigation cleanup: moved Original Documentation to the final slot and removed redundant 'All Content' topics so General Information, Product Overview, Setting Up, and Using open straight to their chapter subsections (source: Zoll EMV+ Ventilator Operator's Guide Rev. P, Chapters 1-4).]**
**[2025-09-17 EMV731 general information, product overview, setup, and operations condensed into section summaries with citations for in-app navigation (source: Zoll EMV+ Ventilator Operator's Guide Rev. P, Chapters 1-4).]**

**[2025-03-09 UI polish: Show/Hide badge toggles now replace chevrons across lists and detail sections, aligning styles.css with dev-tools/als-medication-detail.png and preserving cross-browser number-input behavior.]**
**[2025-03-09 EMV731 alarms chapter summarized: alarm overview, alarm message center, priorities, icon/service code cues, muting behaviors, patient/environment/self-check groupings, and pop ups distilled for field crews (source: Zoll EMV+ Ventilator Operator's Guide Rev. P, Chapter 5-1 through 5-31).]**
**[2025-03-09 EMV731 alarms navigation: removed the All Content topic and linked each subsection to chapter-specific summaries with navigation/slug updates (source: Zoll EMV+ Ventilator Operator's Guide Rev. P, Chapter 5-1 through 5-31).]**



Home button (house icon): jumps to main Contents.

Settings: Dark Mode toggle; animated Settings button; brightness slider with live preview/persistence.

Header/UI: ensureHeaderUI stabilizes header layout across navigations.
  **[Toggle alignment: Category cards align titles with Show/Hide badges; spacing improved across sizes.]**

  Header UI Structure: ensureHeaderUI checks if elements exist and creates them if not, and ensures they are appended in the proper DOM order.

  UI Layout Consistency: content area scrolls independently when content overflows.

Flexbox: structuring the content area & sidebar. By explicitly setting height on the sidebar (and letting the content area flex), we ensure that even if the viewport recalculates, our layout remains consistent. (Not sure if we are even still using this or something else now)**

Green text: Green clickable text expands hidden green fonted text.

ES Module Conversion: Continued migrating scripts to ES modules. This change allows tests and other ES Modules to import slugIDs directly.

Detail Page Title Styling: The main title on each detail page now uses a consistent class name & data attribute (Allows uniform CSS styles and allows scripts to easily select it).

Rendering: whenever a new view is rendered (list or detail), the history entry includes enough info to restore that view. Navigation Buttons enabled/disabled states are updated immediately after each navigation so they correctly reflect availability.

Slug anchors: Initialize after renderDetailPage to ensure TOC appears when applicable

Medication Data Display (ID Matching): The ID matching logic in initializeData (& elsewhere) now handles IDs regardless of whether they’re strings like epiPen or numeric strings like 5glucose.

Sidebar: Gave it a fixed height (applied via JS or CSS). The sidebar now explicitly takes up the full viewport height regardless of browser quirks.

Patient Sidebar weight: Dual KG/LB fields synchronized; internal unit stays kg.

Patient Info Sidebar Behavior: The overlay's semi-transparent background, and the “X” close button both close the Patient Info sidebar.

  We standardized the open/close logic by centralizing it: both main.js and PatientInfo.js use the same functions to add/remove the active and hidden classes on the sidebar and overlay. This prevents divergent behavior.

Data wiring: Build window.medicationDataMap before indexing categories → detail pages load reliably.

Search: Typing no longer pollutes history; only committed searches recorded.

Added basic default indication suggestions. 

Detail Rendering: Fixed main.js data wiring & Features/Warnings.js so medication/equipment details load reliably; implemented `getAgeWarning`.

Navigation/Home: Hooked up Home button handler to reset to the Contents view.

Medication Classes: Added dynamic Medication Class dropdown (built from data) in Patient Info; wired change listener.

Patient Snapshot: Implemented and updates on load/changes.

Autocomplete seeds: Added common terms and PDE5 inhibitors.

Settings/Dark Mode: Corrected CSS & added brightness slider.

CSS: Focus rings & Show/Hide badge transitions unified; invalid nested rules removed.

Sept 1, 2025: Patient Info given Medication Class dropdown populated from all medication classes in the data (updates suggestions & filters context).


## 9. TIMELINE SUMMARY (Short & Specific)

07/16/25 — Nearly useful for field work; more data review pending.

07/18/25 — ES Modules progressing; categories not yet loading at that time; Dark Mode working.


## 10. FUTURE TASKS/GOALS/IDEAS

*This section proposes enhancements/ideas for future development. Nothing in this section is to be worked on or looked at until they are moved into TOP PRIORITY TASKS or CURRENT TASKS/GOALS.*

  Minor glitch that after lots of expansions/collapses and scrolling, some elements (like the header or certain buttons) might appear to shift or jitter slightly – potentially due to scrollbar appearance or focus outlines. We will continue to refine the CSS to eliminate any “weird” movement and ensure smooth scrolling.

  Slug Anchors & Section Headers: Long detail pages should include a Table of Contents generated from section headings (slugAnchors.js); currently no detail page is long enough to need this implimentation.
    The anchor Table of Contents at the top of long pages should list all the sections present and allow jumping. Try out a long entry (like one with many sections) to confirm the anchor links scroll correctly. Ensure that anchors appear correctly and that clicking them scrolls smoothly to the section.

  Persistent User Data: Implement saving of patient info and user history between sessions. For example, use localStorage or similar to remember the last entered patient details so if the app is closed accidentally or the browser refreshes, the user doesn’t have to re-enter critical info. Also, preserve the History list between sessions so a medic can quickly revisit frequently accessed topics across shifts.
  Any information inputed by the user persists inbetween sessions (so if they close and reopen the app, no patient information is lost.).

  Enhanced Dynamic Protocol Filtering: Expand the intelligence of the main Contents list filtering. Beyond just strike-throughs, we could implement a mode where, say, entering a primary indication or choosing a protocol (e.g., “STEMI” or “Anaphylaxis”) automatically highlights or even isolates the relevant protocols (perhaps by toggling a “Relevant Only” filter). This could guide medics to the correct treatment algorithm faster. It may involve tagging topics with keywords like “chest pain” or “trauma” and then matching those to patient indications input.

  Proposed rewrite (final)
Enhanced Dynamic Protocol Filtering:

Introduce a “Relevant Only” mode that isolates protocols most likely to apply based on patient inputs. Implementation plan:
Data: Add a keywords array to topics (either in Data/ParamedicCategoriesData.js topic objects or in detail objects propagated during indexing). Examples: “chest pain”, “ACS”, “STEMI”, “anaphylaxis”, “trauma”. Populate Data/patientInfoSynonyms.js with mappings so inputs like “SOB” normalize to “shortness of breath”, “MI” to “myocardial infarction”, etc.
Index: During processItem() (Features/search/Search.js), attach normalized keywords to each full topic record and build a keywordIndex map (keyword → Set<topicId>) for quick lookups.
Compute relevance: In updatePatientData() (Features/patient/PatientInfo.js), normalize patientData.indications via synonyms and produce a relevantIds Set from keywordIndex unions (optionally expand to closely related terms via synonyms).
UI: Add a small “Relevant Only” toggle near the search (index.html + main.js). When enabled:
Modify renderInitialView() / createHierarchicalList() (Features/list/ListView.js) to render only relevant leaves and their ancestor categories. Non‑relevant branches are hidden or visually de‑emphasized.
Auto‑expand categories containing relevant descendants and apply a .relevant highlight class to matching topics.
Persist the toggle in localStorage so it survives reloads.
History/Search integration: Ensure Back/Forward captures and restores the filter state; “Show All Categories” clears both search and “Relevant Only”.
Tests: Add E2E coverage for “STEMI” and “Anaphylaxis” workflows (toggle on/off, isolation/highlight, auto‑expand, Back/Forward, and “Show All” reset).






  Complete Weight-Based Dosing Automation: Currently we handle some weight calculations, but we plan to automate all weight-specific dosage calculations. This includes rounding to appropriate values and even suggesting volume (mL) if concentration is known. For example, “Epinephrine 0.01 mg/kg” for a 22 kg child → “0.22 mg (0.22 mL of 1:10000 solution)”. This requires augmenting the data with concentration info and writing logic to compute volumes. 

  Complete Weight‑Based Dosing Automation

Goal: Automatically compute mg (and mL where concentration is known) for weight‑based doses shown in medication detail sections, updating live on patient weight changes. Keep math explicit and auditable.
Data requirements:
Augment Data/MedicationDetailsData.js entries with normalized dosing metadata where feasible:
dose: { perKg: number, units: 'mg'|'mcg', route?: 'IV'|'IM'|'IN', max?: number }
concentration?: { amount: number, units: 'mg', volumeMl: number } (for mL conversion)
Maintain current adultRx[] / pediatricRx[] text for readability; do not break existing rendering.
Implementation (Features/dosageCalc.js):
Build a pure function API:
computeDose({ kg, perKg, max, units }) → { mg: number, clamped: boolean }
toMl({ mg, concentration }) → number
formatDose({ mg, units, ml? }) → string
Add dose parsers to recognize “N.nn mg/kg” patterns in adultRx[]/pediatricRx[] text if metadata is missing, but prefer explicit metadata when present.
In Features/detail/DetailPage.js, when generating lines for Rx sections, detect weight‑based items and, if patientData.weight exists, inject an inline computed segment “(= X mg [Y mL])” with a tooltip/modal showing math steps. Use a class like .rx-computed and a click handler to show the math modal (reuse .qv-modal styles).
Rounding and safety:
Standard rounding rules per drug class can be configured (e.g., round mg to nearest 0.01; mL to nearest 0.1 unless specified).
Clamp by max if present; mark clamped: true in the math details.
Performance: memoize last computed value per item id + weight in a small cache.
Integration points:
Wire Features/dosageCalc.js functions into DetailPage during Rx section render; re‑compute on updatePatientData() refresh.
Tests:
Add unit tests for dose computations and mL conversion with a few representative meds.
Add a DOM test ensuring computed annotations appear/disappear as weight becomes available/cleared.
Verification:
Set weight to 22 kg; open a med with “0.01 mg/kg” and with valid concentration: confirm “(= 0.22 mg [0.22 mL])” and a math modal.





  Smooth Scroll and Section Highlight: Improve the anchor navigation by adding smooth scrolling animation when an anchor link is clicked, rather than a jump. Also, as the user manually scrolls through a detail page, highlight the current section in the anchor menu (e.g., bold or underline the section name in the TOC when that section is at top of viewport). This gives context about where you are in the page. This feature would involve listening to scroll events and computing which section is in view – performance should be considered for longer pages.

  Smooth Scroll and Section Highlight

Present state: Features/anchorNav/slugAnchors.js already inserts a TOC for long pages, smooth‑scrolls to targets, and auto‑expands collapsed sections. Missing: active section highlighting while scrolling.
Implementation:
Use IntersectionObserver to observe .detail-section-title elements; determine the currently active section (topmost crossing a visibility threshold).
In the TOC (#detail-toc), add .active to the matching anchor; remove from others. Add minimal CSS (bold/underline).
Debounce updates on scroll (requestAnimationFrame) to avoid churn.
Keep behavior integrated with the existing smooth scroll and auto‑expand logic; do not alter history.
Verification:
Open a long detail page with TOC; scroll by wheel/touch. Confirm active TOC entry updates smoothly without jank.
Click anchors; confirm smooth scroll and ensure the TOC link and Show/Hide badge reflect the target section.





  Additional Autocomplete Enhancements: Our current suggestion lists (for PMH, allergies, etc.) could be enhanced by learning from usage. We might implement that if a user manually enters a term that isn’t in our suggestions, we add it to a local list for next time. Or provide more sophisticated suggestions (like common misspellings or abbreviations mapping to full terms – e.g., typing “MI” could suggest “Myocardial Infarction”). These improvements can make data entry faster and more accurate.

  Additional Autocomplete Enhancements

Goals:
Learn common local terms the user types and surface them next time (per device).
Normalize to canonical terms using synonyms/misspellings to improve consistency.
Implementation:
Data/patientInfoSynonyms.js: add an exportable mapping object for terms → canonical (e.g., “sob” → “shortness of breath”, “mi” → “myocardial infarction”), grouped by field (PMH/indications/symptoms).
When a user commits a term not in the suggestion set, add it to a learned set persisted in localStorage per field (patientInfoLearned.pmh, etc.). On startup, merge learned sets into the base suggestion sets.
Fuzzy matching (optional): introduce a thin “contains normalized substring” step (lowercase, strip punctuation) before final includes() to catch near‑misses; keep it performant and deterministic.
Display canonicalized terms in snapshot (using the synonyms map) while retaining the raw user entry in the textarea.
Verification:
Type a novel indication (not in base suggestions); confirm it appears on the next session as a suggestion.
Type “MI” and verify the snapshot shows the canonical “MI” (abbr) with title/tooltip revealing “Myocardial Infarction.”






  EKGs: User may type their option(s) to filter the Drop-Down menue or just select from the Drop-Down menu. When the user hovers, with a mouse or they press and hold with their finger, over an option that they can select from the Drop-Down menu, a Pop-Up menu will appear. Pop-up menu will appear on screen the same as the other, but instead of info, it will have an EKG example. Off to the side, their will be a "EKG Help" link that takes the user to a new screen dedicated to EKGs.

EKGs (Suggestions + Help View)

Goals:
Improve the EKG input experience and provide quick reference examples.
Implementation:
EKG suggestions: seed an ekgSuggestions set (common rhythms) and wire setupAutocomplete('pt‑ekg','pt‑ekg‑suggestions', ekgSuggestions). Add a small suggestions container under the EKG input in index.html.
Snapshot: wire patientData.ekg = getInputValue('pt‑ekg') in updatePatientData(); keep the existing severity tint for “tachy”/“brady”.
EKG Help view: add a dedicated route (e.g., topic id ekg-help) in ParamedicCategoriesData.js (under a Reference category) and a corresponding content entry (Markdown under Content/…/ekg-help.md), then render it via existing Markdown equipment page logic in DetailPage.
Optional pop‑up: add an info icon next to the EKG field that opens a small modal listing example strips with brief captions; content can live as local images under Assets/Images/ekg/.
Verification:
Type “sinus tachycardia” and confirm suggestions dropdown appears; select it; verify snapshot shows EKG with yellow tint.
Click “EKG Help” topic; confirm the Markdown reference renders with images/examples.





**This README is up to date as of JuLY 19TH, 2025. All instructions and documentation reflect the current and intended behavior of the Paramedic Quick Reference app.**

---
# Paramedic Quick Reference — Developer Guide (Updated)

Single‑page reference app for paramedics. It includes searchable topics, a patient sidebar, and a Quick Vent Guide with a Zoll Set Up flow and Tidal Volume (TV) calculator.

Quick links
- Run preview: `npm run preview` → http://localhost:5173
- Run tests (Playwright E2E): `npm run test:vent`
- MCP Inspector launchers: `dev-tools/start-inspector-*.cmd`

Contents
- Project structure and responsibilities
- MCP servers & effective usage
- Tests and how to extend them
- Audit notes (ZOLL/Vent duplicates)
- Recent fixes (verified)

## Project structure
- `index.html` – app shell
- `styles.css` – global styles
- `main.js` – bootstrap logic and initial render
- `Data/` – static reference data (e.g., `VentilationDetailsData.js` for ZOLL topics)
- `Features/` – UI modules (detail rendering, patient sidebar, navigation, search)
- `Utils/` – helpers (`addTapListener.js`, `slugify.js`, `escapeHTML.js`)
- `dev-tools/` – scripts, MCP launchers, and tests (`dev-tools/tests/ventilation.spec.js`)

## MCP servers (Inspector)
Config: `inspector.mcp.json`. Servers: `fs`, `git`, `everything`, `seq`, `memory`, `webpick`, `crawler`, `fetch`, `fetcher`, `playwright`, `shell`, `a11y`, `lighthouse`.

Launchers:
- `dev-tools/start-inspector-all.cmd` (UI only - select server)
- `dev-tools/start-inspector-playwright.cmd`, `-shell.cmd`, `-git.cmd`, etc.

**[CLI client config: `~/.codex/config.toml` mirrors the Inspector roster. Keep `filesystem`, `git`, and `shell` enabled; enable optional servers (`everything`, `seq`, `memory`, `webpick`, `crawler`, `fetch`, `fetcher`, `playwright`, `lighthouse`, `a11y`) when the task needs them.]**
**[`firecrawl` stays commented until a `FIRECRAWL_API_KEY` is available; uncomment the stub in `~/.codex/config.toml` when you have credentials.]**
**[Install dependencies with `npm install` so the bundled MCP binaries are available on the local PATH before launching Codex.]**
**[Startup health check: run `npm run mcp:health` before coding. The script verifies local packages, `.bin` shims, and warns about missing env vars; fix issues, restart Codex, then reconnect servers.]**
**[Connectivity sanity check: after the Codex session opens, call `filesystem.read_text_file` and `git_status` via MCP tools to confirm the repo is wired correctly.]**
**[If a server fails mid-session, repair it (reinstall, set env vars, or disable optional entries) and restart Codex. Use direct shell commands only as a temporary bridge while restoring MCP coverage.]**

Good practice
- Connect only servers needed for the current task.
- **[Default to MCP tools for edits, diffs, searches, and command execution; drop to direct shell only when MCP servers are being restored.]**
- Filesystem edits: `fs.edit_file` for surgical line edits; confirm with `git_status` + `git_diff`.
- Preview locally with `shell.execute.command` -> `npm run preview`.
- Validate flows with Playwright tools (or run `npm run test:vent`). On Windows, run `browser_install` once; Administrator may be required for Chrome.
- Persist decisions in `memory` during large refactors.

## Tests
Playwright E2E tests live in `dev-tools/tests/ventilation.spec.js`.
- `npm run test:vent` checks:
  - Not Sure shows two distinct ranges (no ARDS, ARDS) in the purple answer area
  - Calculation Details pop‑up shows explicit TV min/max formulas and ranges for both pt types
  - Sex icon is visible when selected

Ad‑hoc check: `node dev-tools/check-tv.js` prints the live answer and modal content for a 70 kg example.

## Audit notes (ZOLL/Vent duplicates)
- No function duplication found in Quick Vent compute path. Range formatting is normalized in one pass; Not‑Sure stacked layout is rendered once and not overwritten.
- Ventilation data is in `Data/VentilationDetailsData.js` only.
- If TV logic expands, consider extracting to `Features/ventilation/tv.js` with unit tests.

## Recent fixes (verified)

- **[2025-09-18 MCP stack hardened: updated ~/.codex/config.toml, added dev-tools/mcp-health-check.js, and wired npm run mcp:health so MCP clients fail fast when binaries or env vars are missing (source: user request).]**
- **[2025-09-19 mcp:health now marks optional MCP servers as [OK]/[SKIP], ignores commented config entries, and confirms firecrawl remains disabled until credentials exist (dev-tools/mcp-health-check.js; verified with npm run mcp:health).]**


## Hosted URL (GitHub Pages)

This repo is wired to auto‑deploy to GitHub Pages from `main` via `.github/workflows/pages.yml`.

- After pushing to `main`, the workflow builds `dist/` and publishes it.
- Your site will be available at:
  - https://LonghornSneal.github.io/Paramedic-App/
- If it shows 404 initially, wait for the Pages workflow to finish (Actions tab), or check Settings → Pages to confirm the deployment.
- Not Sure shows two stacked answers (no ARDS first, ARDS second); pop‑up shows explicit formulas and correct ranges — verified by E2E.
- Sex icon remains visible when selected (selected state background/border) — verified by E2E.


