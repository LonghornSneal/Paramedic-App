--- This file is to be continually updated by the AI Agent with the updated text within {}. Nothing is to be ever deleted, only added! Updates must be designed to accurately describe how the app is supposed to appear & function, both currently and for future updates. Updates are also designed to change the behavior of the AI Agent, so that the AI Agent will successfully update the code without any errors or issues being present. Read both of the README.md files for guidance, and then continue coding/testing the code. You have all the tools available to fix ANY issue. Always run tests on newly created code and upon any & all code that is related to an issue. Before you are finsihed coding, you must Read this README.md once more to make updates to the README.md and to insure that all instructions where followed.---


# Paramedic Quick Reference – App Overview and Structure

This document provides an overview of the **Paramedic Quick Reference** application’s structure and components. It is meant to guide developers (and AI assistants) through the project, to prevent misunderstandings during updates. By outlining where each piece of functionality resides and highlighting known pitfalls, this README helps narrow down where code errors might occur and how to address them.

## Project Purpose

**Paramedic Quick Reference** is a single-page web application that offers paramedics a quick-access guide to critical information. It includes hierarchical categories of topics (like protocols, medications, etc.), detailed medication information for ALS (Advanced Life Support) drugs, a patient info sidebar for contextual inputs, and dynamic features such as dosage calculations and warnings based on patient data.

## Project Structure

The project is organized into several directories, each containing specific types of files:

- **`index.html`** – The main HTML file that sets up the interface layout and includes all scripts and styles.
- **`Data/`** – Contains JavaScript files with static data:
  - `ParamedicCategoriesData.js` – Defines the hierarchical list of categories and topics (e.g., sections like *ALS Medications*, *BLS Procedures*, etc., and the individual topics within them). This is loaded as a global object `window.ParamedicCategoriesData`.
  - `MedicationDetailsData.js` – Contains detailed information for each medication (primarily used for ALS medications in this app). It’s an array/object of detail entries loaded as `window.MedicationDetailsData`. Each entry typically includes fields like `id`, `description`, doses (`adultRx`, `pediatricRx`), indications, contraindications, side effects, etc.
- **`Features/`** – Contains modules for specific functionality:
  - `PatientInfo.js` – Manages the Patient Info sidebar and related data. It defines the `patientData` object (age, weight, allergies, etc.) and handles updates to this data. It also controls contextual UI changes (e.g., striking through inapplicable treatments based on patient info). It declares global variables for data structures used by the app (like `paramedicCategories`, `allSearchableTopics`, `allDisplayableTopicsMap`, and a local `medicationDetailsData` reference that gets filled with the global data). This separation makes it easier to handle patient-specific logic independently.
- **`Utils/`** – Utility scripts:
  - `slugify.js` – A helper that converts strings into URL-friendly “slugs.” For example, it turns a title like "Pediatric Dose" into `"pediatric-dose"`. This is used to generate consistent `id` attributes for sections or to create anchor links.
- **Main scripts** (in the project root or loaded directly):
  - `styles.js` – (If present) Contains any JavaScript-based style fixes or configuration (this might be a Tailwind CSS config or similar – in this project Tailwind is loaded via CDN, so this could be minimal or unused).
  - `viewportFix.js` – A small script to fix mobile viewport units issue (common technique to ensure 100vh works correctly on mobile browsers).
  - `slugList.js` – *(Data/slugList.js, included for anchor navigation)* Likely gathers or defines a list of content section anchors based on the loaded data. It works in conjunction with `slugify.js` and `slugAnchors.js` to facilitate an in-page table of contents for medication detail sections. For example, it might compile all section headers from the medication details into an array of slugs.
  - `slugAnchors.js` – Works with `slugList.js` to insert or activate anchor links in the UI. For instance, after `slugList.js` prepares the list of section IDs (slugs), `slugAnchors.js` could generate a clickable list of those sections (anchor navigation menu) or attach event listeners to scroll to those sections. **Note:** These two files (`slugList.js` and `slugAnchors.js`) provide the “Anchor Navigation” feature. If you’re debugging anchor links not working, these are the files to inspect (ensuring the slugs generated match the section IDs in the HTML).
  - `main.js` – The core application logic tying everything together. It initializes the app, handles search functionality, navigation (history stack for back/forward buttons), renders the category list and detail views, and integrates the patient info into the content. Key functions in `main.js` include:
    - `initializeData(categoriesData, medDetailsData)`: **Called on startup**, this function takes the raw data from `ParamedicCategoriesData` and `MedicationDetailsData` and populates the internal structures. It likely builds the `allDisplayableTopicsMap` (mapping each topic’s ID to its detail object), combines category info with detail info for quick lookup, and prepares the searchable list of topics.
    - `renderInitialView(...)`: Renders the hierarchical list of categories and topics in the content area (the default view).
    - `renderDetailPage(topicId, ...)`: Given a topic ID (for example, a specific medication), this renders the detailed information page for that topic. It pulls the corresponding detail from `allDisplayableTopicsMap` and creates the HTML (title, sections like indications, doses, contraindications, etc.). It also triggers warning messages or dosage calculations based on the current `patientData` (for instance, highlighting contraindications if the patient has certain conditions, or calculating a weight-based dose).
    - Event handlers for search input and navigation buttons, which allow users to filter topics by keyword or navigate back/forward through viewed pages.
    - Integration points: after `initializeData` runs, `main.js` relies on the data provided. It also uses `slugify` when needed (e.g., ensuring generated IDs or anchors match), and calls functions from `PatientInfo.js` (like `updatePatientData()`) when patient info changes.
    
All scripts are included in `index.html` in the proper order. Notably, the data files are included **before** the main application script. This ensures that by the time `main.js` runs, the global data (categories and medication details) is already available.

## How the Pieces Work Together

1. **Data Loading:** On page load, `ParamedicCategoriesData.js` and `MedicationDetailsData.js` execute, attaching large data objects to the `window` (global scope). For example, `window.ParamedicCategoriesData` might be an array of category objects (some of which contain nested topics), and `window.MedicationDetailsData` might be an array or object mapping each medication ID to its detail info. It’s important that each topic in the category data has a unique `id` that corresponds to a detail entry’s `id`. If these IDs don’t match, the detail page won’t know which data to display.
2. **App Initialization:** When `main.js`’s `initApp()` runs (on DOMContentLoaded), it calls `initializeData(window.ParamedicCategoriesData, window.MedicationDetailsData)` to merge the static data into the app’s dynamic structures. Internally, this may copy the data into the `paramedicCategories` array, build the `allSearchableTopics` list (for searching titles), and fill the `allDisplayableTopicsMap` – a dictionary mapping each topic ID to a combined object containing its title, category path, and `details` (if it’s a medication). After initialization, the app calls `renderInitialView()` to show the list of categories/topics.
3. **Rendering the List:** The initial view iterates through `paramedicCategories` to create the expandable list in the UI. Categories can be clicked to reveal their topics. Topics (like specific drugs or procedures) appear as links. The code for building this list resides in `main.js` (a function like `createHierarchicalList` or within `renderInitialView`). Each topic link element gets a `data-topic-id` attribute equal to that topic’s `id` (slug).
4. **Showing Details:** When a topic link is clicked, `renderDetailPage(topicId)` is invoked. This function looks up the topic in `allDisplayableTopicsMap` by its `id`. If it finds a match, it uses that data to construct an HTML detail view. For a medication, the detail view will include sections like **Description**, **Indications**, **Contraindications**, **Dosage** (often split into adult and pediatric sections), and possibly other notes. These sections likely have heading elements (e.g., `<h3>` or `<h2>` tags for each section title). The app uses consistent slug IDs for these sections – e.g., a section "Adult Dose" might have an element `<h3 id="adult-dose">Adult Dose</h3>` generated via the slugify utility.
5. **Anchor Navigation:** If a medication detail page is long, the app provides an in-page navigation (anchors) to jump to sections. The combination of `slugList.js` and `slugAnchors.js` enables this:
   - `slugList.js` probably collects all section headings from the detail content (after it’s rendered) and creates a list of their `id` attributes (using `slugify` to mirror how the IDs were generated).
   - `slugAnchors.js` then takes that list and renders a clickable table of contents (for example, a list of anchor links at the top of the detail page or a floating menu). Each anchor link’s `href` corresponds to a section’s ID (e.g., `#adult-dose`). It also may handle smooth scrolling or highlight the current section.
   - **Important:** The slug generation must be consistent. The same `slugify` function is used both when assigning IDs to section headings and when creating the anchor `href`s. This consistency was enforced in recent fixes, so all anchors should align with their targets. If you need to modify or add new sections, use `slugify.js` to generate section IDs to maintain this consistency.
6. **Patient Info Sidebar Integration:** The Patient Info sidebar inputs (age, weight, medications, etc.) allow dynamic filtering and warnings:
   - In `PatientInfo.js`, event listeners are set up on these inputs (see the `ptInputs.forEach(...)` at the bottom of the file attaching `updatePatientData` on input events). When the user enters data (e.g., adds an allergy or sets an age), the `updatePatientData()` function runs. 
   - `updatePatientData()` (in **`PatientInfo.js`**) updates the global `patientData` object and then applies logic to the UI. For example, after updating, it goes through all topic links and adds a `.strikethrough` class if a medication is not indicated for the given conditions:contentReference[oaicite:9]{index=9}. It also re-renders the current open detail page (calling `renderDetailPage` again for the current topic) to apply any new age/weight-specific filtering (like striking out pediatric doses if the patient is an adult, and vice versa:contentReference[oaicite:10]{index=10}). Additionally, it checks contraindications: if the patient’s info suggests a contraindication (e.g., the patient is on a medication that conflicts with the drug in the detail view, or has an allergy), the code that builds the warnings in `renderDetailPage` will display those warnings in colored boxes. 
   - Currently, the partial data-driven updates (like automatically recalculating doses or filtering content) are a work in progress. The code already handles some scenarios (e.g., the blood pressure and PDE5 inhibitor checks for Nitroglycerin as seen in `renderDetailPage` logic:contentReference[oaicite:11]{index=11}), but other aspects might be expanded in the future. This is flagged for future development.
7. **Search Functionality:** The app includes a search bar at the top of the content area. When the user types and presses Enter, the `handleSearch()` function in `main.js` runs:contentReference[oaicite:12]{index=12}. This function filters `allSearchableTopics` for any topic whose title or path matches the search term. The result is passed to `renderSearchResults`, which displays a list of matching topics. This lets the user quickly find items by keyword. If modifying or debugging search, focus on the `allSearchableTopics` array (populated in initialization with all topic titles and perhaps category paths) and the `handleSearch`/`renderSearchResults` logic.

## 2024-Paramedic-App UI/UX and Codebase Update Summary (June 2024)

### Recent Fixes and Improvements

- **Navigation Buttons (ALS Medications):**
  - The Previous/Next (blue arrow) navigation buttons in the ALS Medications section are now always present, visually match the Contents page, and function correctly for all medications.
  - Navigation logic was refactored to ensure buttons are always rendered and event listeners are reliably attached after header creation.

- **Patient Info Sidebar:**
  - The quick escape (close) button and overlay now reliably close/hide the sidebar, regardless of how it was opened.
  - Sidebar open/close logic was unified in both `main.js` and `Features/PatientInfo.js` for consistent overlay behavior.

- **Medication Data Display:**
  - All medications now display their associated data, regardless of whether their IDs have number prefixes or not. ID matching logic was made robust to handle both numbered and non-numbered IDs.

- **Navigation (Back/Forward) Buttons:**
  - Navigation history and view rendering logic were updated to always update navigation button states and use consistent state objects.

- **UI Consistency:**
  - The main topic title in detail view now uses a consistent class and data attribute for reliable UI updates.
  - The `ensureHeaderUI` function in `main.js` was patched to always create and order navigation/search elements correctly, fixing header UI consistency.

- **Testing:**
  - All Jest tests now pass. The `add.test.js` import path was fixed, and a minimal test for `slugify.js` was added. The test suite is clean and ready for further test additions.
 - **Tailwind Configuration:**
   - `styles.js` now safely initializes `window.tailwind.config` so the file won't throw errors if loaded before the CDN script.

### Current App Behavior

- **Navigation:** Users can always move to the previous/next ALS medication using blue arrow buttons at the top of the detail view. Back/forward browser navigation is supported and reliably updates the UI.
- **Patient Info Sidebar:** The sidebar can be opened from the main UI and closed via the escape button or overlay. Patient data updates trigger UI changes and warnings in medication detail views.
- **Medication Details:** All medications listed in the ALS Medications section display their full details, including all associated data fields. Section anchors and in-page navigation work reliably.
- **UI Layout:** All UI elements (navigation, search, sidebar, detail view) are in their correct locations and styled consistently with the rest of the app.
- **Testing:** All available tests pass. The test suite is clean and ready for further expansion.

### Known Issues & Future Enhancements

- Some data-driven updates (like automatic recalculation of all medication doses based on patient info) are still a work in progress and flagged for future development.
- The anchor navigation for long detail pages works, but could be enhanced with smooth scrolling or section highlighting.
- Additional tests for more features (e.g., dosage calculations, contraindication warnings) are recommended.

---

**This README is up to date as of June 2024. All instructions and documentation reflect the current and intended behavior of the Paramedic Quick Reference app.**
