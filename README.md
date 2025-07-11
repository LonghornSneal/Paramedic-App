# -------------------------------------THIS FILE IS TO BE CONTINUALLY UPDATED BY AI-------------------------------------

## PARAMEDIC QUICK REFERENCE APP README.md

### TABLE OF CONTENTS: ## 1. GENERAL SCOPE   ## 2. APP OVERVIEW AND STRUCTURE   ## 3. PROJECT PURPOSE   ## 4. PROJECT STRUCTURE   ## 5. HOW THE PIECES/FILES/CODE FIT/WORK TOGETHER   ## 6. -----TOP PRIORITY TASKS-----   ## 7. CURRENT TASKS/GOALS   ## 8. RECENT FIXES/CHANGES   ## 9. TIMELINE SUMMARY  ## 10. FUTURE TASKS/GOALS/IDEAS

## 1. GENERAL SCOPE

This is the README for the Paramedic-App repository. This file is esential to understand fully when addressing any of the user's questions. Be professional, keep everything up-to-date, and keep the code bug free. Updates to this README.md must be designed to accurately describe how the app is supposed to appear & function, both currently and for future updates. Updates to the README.md are also designed to improve coding outcomes of the AI reading this README.md. When deleting code, adding code, or altering code, you must follow these rules:
-1. First, you must Read the README.md fully, to obtain a clear understanding for how the entire repository works together and to know where at in the repository any relevant information is to be found.
-2. Always quote the line of code that appears both before and after the code line that is being referced in any situation.
-3. Use **...** to declare any changes in the code or code comments.
-4. Search for duplicates of code in other files.
-5. Ensure code terms match in any file or files that the code term is found within.
-6. Ensure the code aligns the "PROJECT PURPOSE" and "PROJECT STRUCTURE" found in the README.md.
-7. Ensure that the code is in the correct location within the file and is also in the appropriate folder. Code should structured in an logical order within any file, code blocks that share the same function should be logically structured after or before as appropriate, and code blocks must ensure that their structured ordered in the file doesn't cause any timing issues or concerns.
-8. If an issue, concern, or error is noticed that isn't directly related to your main task, you must still address and fix any of those issues, concerns, or errors.
-9. When focusing on a specific file, read that specific file's README.md if it exists.
-10. As a final quality assurance step, always ensure that any changes made to the code will still function appropriately with the rest of the repository.

## 2. APP OVERVIEW AND STRUCTURE

This document provides an overview of the **Paramedic Quick Reference** application’s structure and components. The entire reposistory is also known as the Paramedic-App. It is designed to be a thourough walkthrough guide for the entire project and to ultimately reduce any issues, concerns, or errors during developement of the app. By outlining where each piece of functionality resides and highlighting known pitfalls, this README.md helps narrow down where code errors might occur and how to address them appropriately.

The code is organized into separate files and folders to make updating the project easier.
Assume that the code in one file will either be dependent on code in other files, or that code in other files will depend on that code.
All respository code will incorporate ONLY html, css, and javascript. Modules will NOT be used.

## 3. PROJECT PUROPOSE

The **Paramedic Quick Reference** is a single-page web application that offers paramedics a quick-access guide to critical information that is needed be easily located within seconds in order to save a patient's life.

The Paramedic-App Includes the following design features:

-Main Contents Page: List of Topics that is visible on app start-up, App Title at top center, Search Bar underneath App Title, Patient Info Menu Button that is in the top left, Navigation Buttons (Back Navigation Button next to a Forward Navigation Button) placed in the top right, Home Button that is underneath the Navigation Buttons, Blue Arrows that have two states they can be in, History Button underneath the Home Button,

-Blue Arrows: Consist of Rightward-Pointing Blue Arrow and Downward-Pointing Blue arrow. Both Blue Arrows will always be adjacent and to the right of the text they are associated with.

-Rightward-Pointing Blue Arrow: When clicked upon (or the user clicks the associated text), the Blue Arrow rotates clockwise 90 degrees, becoming a Downward-Pointing Blue Arrow, and expands either a list of Subtopics or Hidden Text.

-Downward-Pointing Blue Arrow: When clicked upon (or the user clicks the associated text), the Downward-Pointing Blue Arrow rotates counter-clockwise 90 degrees to become a Rightward-Pointing Blue Arrow and the Revealed Hidden Text becomes Hidden Text again.

-Subtopics that contain more Subtopics: Will have the same Rightward-Pointing Blue Arrow that will trigger more Subtopics when clicked upon.

-Subtopics without any further Subtopics: No blue arrow, but the text will be a clickable button that triggers the release of a Focused Subtopic Section when clicked upon.

-Focused Subtopic Sections: May contain: links, images, videos, interactive text, tips, regular text, treatments (Rx:), dosage information, calculations for weight based dosages if the user has inputed the patient's weight already in the Patient Info section, Protocols.
fix text here----------Detailed Topic Pages: Each topic (for example, a specific medication or procedure) has its own detail page. These pages display comprehensive information such as Description, Indications, Contraindications, Dosage (with adult and pediatric sections), Side Effects, and any other relevant notes. Content is organized with clear headings. All details are stored in the app’s data files and rendered on demand, ensuring information is consistent and up-to-date.

-Interactive Text: Green Text is interactive and triggers the release of Hidden Text that directly follows the Green Text.

-Triggered Green Text: both the Green Text and the revealed Hidden Text become a light green font.

-Search Bar: Space reserved for user input text that filters two seperate lists in real time. Those two lists become visible as the user begins typing inside of the Search Bar and they are located directly underneath the Search Bar and split into two seperate columns. The first column is the Filtered List of Topics and the second column is the Smart Suggestions.

-Filtered List of Topics: appear under the Search Bar and the the right Clicking a Suggestion will show a narrowed list of topics related to that specific Suggestion. Clicking a Topic directly navigate to a matching detail page. Populates with related options when the user begins typing in it. Allows for quick keyword lookup.

-Smart Suggestions:

-Patient Info Menu Button: Expands to bring up a Patient Info Section when clicked upon. Clicking outside of the Patient Info Section and on the still visible page the user was last on will trigger the closure of the Patient Info Section.

-Patient Info Section: Contains the following interactive categories: Age, Weight, Vital Signs (VS), Past Medical History (PMH), Allergies, Medications, etc.

-Age:

-Weight:

-VS:

-PMH:

-Allergies:

-Medications:

Treatments or doses that don’t apply (e.g. pediatric doses for an adult patient, or a medication contraindicated due to an allergy will trigger an warning) are automatically struck through or visually deemphasized.
Warnings appear in the detail pages if the patient’s data triggers any contraindications (for example, an alert if the patient is on a medication that conflicts with a drug in the protocol, or if blood pressure is too low for a certain treatment).
In the main topics list, if the user has provided certain indications or symptoms, the list can highlight or strikethrough topics to show which ones are relevant to the case.
Note: Some dynamic adjustments (like automatic dose calculations based on weight) are planned for future updates. The current implementation handles key scenarios (like the Nitroglycerin blood pressure and drug interaction checks) and lays the groundwork for more advanced data-driven tweaks.

-This data that is entered in by the user will be able to have the following effects on the rest of the app: strikethrough text that is no longer appropriate, warnings, narrowed lists, focused lists, Any listed "Rx" will now have their calculations already performed with math to obtain to calculations visible to the user, new button options, faded topic buttons, some of the data that the user enters will be shown on the screen at all times as a "Patient Snapshot" while the user navigates around the app.

-Patient Snapshot:

-Navigation Buttons: Visible at all times. Initially is unusable until it's own requirments to function are met. The navigation history is managed internally so that these controls update the content reliably. This ensures users can explore information freely and always have a quick way to backtrack or start over.

-Back Navigation Button: Becomes clickable after the user clicks on an Focused Subtopic Section or a similar type items. When clicked upon, the user will be taken back to the immediate prior screen that the user was on, looking exactly how they left it (Blue Arrows are in the state that the user had last put them in) with the exception being that the last thing or Subtopic that the user had clicked upon is now highlighted.

-Forward Navigation Button: Becomes clickable after the user clicks upon the Back Navigation Button.

-Home Button: Takes the user to the Main Contents Page when clicked upon.

Font will incorporate all the various style options.

When the user exits the app and goes back into the app, the user will be able to easily access any information that the user had previously inputted into the app and there will be a

-History Button: that is on the screen at all times that will give a scrollable list of all the clickable buttons the user had clicked on starting from the most recent button clicked upon in the current app session or in prior app session. Any of these Buttons within the History Button can be clicked upon with the same functionality of the Button it represents.

Performance and Simplicity: The app is built with only HTML, CSS, and JavaScript – no frameworks or modules – to keep it fast and easy to maintain. All data is loaded locally (no external API calls), so content is available offline without delay. The interface is designed to be clear and uncluttered, using Tailwind CSS (via CDN) for a consistent look and feel, with custom styles in our stylesheet where needed. Every design choice centers on speed, clarity, customizability, and ease-of-use, given that in a high-stress field scenario the user needs to get to the right info immediately.

## 4. PROJECT STRUCTURE

The project is organized into a few directories and files, each with a specific role:

index.html – The main HTML file that defines the app’s layout and includes all scripts and styles. It sets up the structure of the page (header, sidebar, main content area, footer) and links to the necessary CSS/JS files. All other components plug into this file.
index.html – The main HTML file that sets up the interface layout and includes all scripts and styles.

styles.css – The main stylesheet for custom CSS. This file contains any custom styling needed for the app’s layout and components. (Tailwind CSS is also loaded via CDN in index.html for utility classes, so styles.css mainly provides additional tweaks or design elements not covered by Tailwind’s defaults.)
styles.js – (If present) Contains any JavaScript-based style fixes or configuration (this might be a Tailwind CSS config or similar – in this project Tailwind is loaded via CDN, so this could be minimal or unused).

Data/ – Directory for static data files that populate the app’s content:
Data/ – Contains JavaScript files with static data:

ParamedicCategoriesData.js – Defines the hierarchical list of categories and topics. For example, it might define an array of objects for sections like ALS Medications, etc., each with children array for their subtopics. This file attaches its data to the global window object as window.ParamedicCategoriesData.
ParamedicCategoriesData.js – Defines the hierarchical list of categories and topics (e.g., sections like *ALS Medications*, *BLS Procedures*, etc., and the individual topics within them). This is loaded as a global object `window.ParamedicCategoriesData`.

MedicationDetailsData.js – Contains detailed information for each ALS Medication. It could be an array or an object keyed by medication ID, attached as window.MedicationDetailsData. Each entry typically includes fields such as id, description, adultDose, pediatricDose, indications, contraindications, sideEffects, etc. These details are referenced when rendering the topic detail pages.
MedicationDetailsData.js – Contains detailed information for each medication (primarily used for ALS medications in this app). It’s an array/object of detail entries loaded as window.MedicationDetailsData. Each entry typically includes fields like `id`, `description`, doses (`adultRx`, `pediatricRx`), indications, contraindications, side effects, etc.

Features/ – Directory for features for specific functionality:

PatientInfo.js – Manages the Patient Info Sidebar behavior and the global patientData. It sets up event listeners on the sidebar input fields and defines the updatePatientData() function. When patient data changes, this module updates patientData (age, weight, allergies, medications, etc.) and then triggers UI updates (e.g. adding or removing a .strikethrough class on certain elements, or re-rendering the current detail page to reflect new info). This separation allows all patient-related logic to be maintained in one place.
PatientInfo.js – Manages the Patient Info sidebar and related data. It defines the `patientData` object (age, weight, allergies, etc.) and handles updates to this data. It also controls contextual UI changes (e.g., striking through inapplicable treatments based on patient info). It declares global variables for data structures used by the app (like `paramedicCategories`, `allSearchableTopics`, `allDisplayableTopicsMap`, and a local `medicationDetailsData` reference that gets filled with the global data). This separation makes it easier to handle patient-specific logic independently.

Utils/ – Directory for utility scripts:

slugify.js – A helper function that converts a string into a URL-friendly “slug.” For example, it turns a title like "Adult Dose" into "adult-dose". This is used to generate consistent id attributes for sections in detail pages and to create anchor links that jump to those sections.
slugify.js – A helper that converts strings into URL-friendly “slugs.” For example, it turns a title like "Pediatric Dose" into `"pediatric-dose"`. This is used to generate consistent `id` attributes for sections or to create anchor links.

Main scripts (in the project root):
Main scripts** (in the project root or loaded directly):

viewportFix.js – A small script that fixes a known issue with the CSS 100vh unit on some mobile browsers. It ensures the app’s full-height elements (like the sidebar or certain containers) size correctly on all devices.
viewportFix.js – A small script to fix mobile viewport units issue (common technique to ensure 100vh works correctly on mobile browsers).

slugList.js – (located in the Data directory and included as a script) This script gathers all section headers from a medication’s detail page after it’s rendered and compiles a list of their id values (using the same slug generation as slugify.js). Essentially, it prepares an array of section anchors whenever a detail page is shown.
slugList.js – *(Data/slugList.js, included for anchor navigation)* Likely gathers or defines a list of content section anchors based on the loaded data. It works in conjunction with `slugify.js` and `slugAnchors.js` to facilitate an in-page table of contents for medication detail sections. For example, it might compile all section headers from the medication details into an array of slugs.

slugAnchors.js – This works hand-in-hand with slugList.js. After the list of section IDs is prepared, slugAnchors.js inserts a clickable Table of Contents (anchor links) into the detail view. For example, if a medication page has sections like Description, Dosage, Indications, etc., slugAnchors.js will create a list of links at the top of that page so the user can jump to “Dosage” or “Contraindications” instantly. It also handles any necessary event listeners for those links (like smooth scrolling or highlighting the active section). Note: When adding or modifying sections in a detail page, always use the slugify.js helper for section IDs to ensure these anchor links continue to match their targets.
slugAnchors.js – Works with `slugList.js` to insert or activate anchor links in the UI. For instance, after `slugList.js` prepares the list of section IDs (slugs), `slugAnchors.js` could generate a clickable list of those sections (anchor navigation menu) or attach event listeners to scroll to those sections. **Note:** These two files (`slugList.js` and `slugAnchors.js`) provide the “Anchor Navigation” feature. If you’re debugging anchor links not working, these are the files to inspect (ensuring the slugs generated match the section IDs in the HTML).

main.js – The core application logic that ties everything together. This file initializes the app and contains the primary functions for rendering content and handling user interactions:
main.js – The core application logic tying everything together. It initializes the app, handles search functionality, navigation (history stack for back/forward buttons), renders the category list and detail views, and integrates the patient info into the content. Key functions in `main.js` include:

initializeData(categoriesData, medDetailsData) – Called on startup. This function takes the raw data objects from ParamedicCategoriesData.js and MedicationDetailsData.js and merges/organizes them into structures the app uses. It builds the paramedicCategories array (the master list of categories and topics), populates the allDisplayableTopicsMap (a lookup map of every topic by ID, including its details and parent hierarchy), and creates allSearchableTopics (an array of all topics with their titles and paths, used for the search feature).
initializeData(categoriesData, medDetailsData): **Called on startup**, this function takes the raw data from `ParamedicCategoriesData` and `MedicationDetailsData` and populates the internal structures. It likely builds the `allDisplayableTopicsMap` (mapping each topic’s ID to its detail object), combines category info with detail info for quick lookup, and prepares the searchable list of topics.

renderInitialView(highlightId = null) – Displays the main contents page (the hierarchical list of categories and topics). It uses a helper (like createHierarchicalList) to generate the expandable menu UI. If highlightId is provided (meaning we want to highlight a specific topic on the list, e.g. after navigating back), it will ensure that topic is visible and marked.
renderInitialView(...): Renders the hierarchical list of categories and topics in the content area (the default view).

renderDetailPage(topicId) – Displays the detail view for a given topic (usually a medication or procedure). It looks up the topic by id in allDisplayableTopicsMap and, if found, renders an HTML page with that topic’s full information (title and all detail sections). This function is responsible for injecting sections like Indications, Dosage (with adult/pediatric breakdown), Contraindications, etc., into the page. As it renders, it also checks the current patientData to apply any special formatting: for example, it will add warnings (in red highlight boxes) if the patient’s info indicates an allergy or contraindication for this topic, and it can strike out dose sections that don’t apply (e.g. pediatric doses for adult patients).
renderDetailPage(topicId, ...): Given a topic ID (for example, a specific medication), this renders the detailed information page for that topic. It pulls the corresponding detail from `allDisplayableTopicsMap` and creates the HTML (title, sections like indications, doses, contraindications, etc.). It also triggers warning messages or dosage calculations based on the current `patientData` (for instance, highlighting contraindications if the patient has certain conditions, or calculating a weight-based dose).

Event Handlers & Navigation: main.js also sets up the event listeners for user interactions:
It initializes the search bar behavior so that typing filters the list, and pressing Enter triggers a full search.
It manages the navigation history for the Back and Forward buttons. Each time you render a view, it logs the state so that clicking Back or Forward will correctly restore the previous view (and it updates the disabled/enabled state of those buttons accordingly).
It ties in with PatientInfo.js by calling updatePatientData() whenever the patient inputs change, ensuring that the UI stays in sync with any new patient-specific context.
All scripts and data files are included in index.html in the proper order. Notably, the data files (ParamedicCategoriesData.js and MedicationDetailsData.js) load before main.js. This way, by the time the initialization code runs, the global data (categories and medication details) is already available for use. The CSS (Tailwind and styles.css) is loaded in the <head> so that the UI styling is ready as the HTML renders.
Event handlers for search input and navigation buttons, which allow users to filter topics by keyword or navigate back/forward through viewed pages.

Integration points: after `initializeData` runs, `main.js` relies on the data provided. It also uses `slugify` when needed (e.g., ensuring generated IDs or anchors match), and calls functions from `PatientInfo.js` (like `updatePatientData()`) when patient info changes.

All scripts are included in `index.html` in the proper order. Notably, the data files are included **before** the main application script. This ensures that by the time `main.js` runs, the global data (categories and medication details) is already available.

## 5. HOW THE PIECES/FILES/CODE FIT/WORK TOGETHER

To understand the app’s flow, here’s how all the components collaborate when the app runs:

Data Loading: When the page first loads, the data scripts run immediately. ParamedicCategoriesData.js and MedicationDetailsData.js each attach their data to the global window object (as window.ParamedicCategoriesData and window.MedicationDetailsData, respectively). This means the categories list and the medication details are ready in memory before the main app logic starts. It’s crucial that every topic or subtopic in the category data has a matching id in the medication details (if that topic has detailed info). If an ID mismatch occurs – for example, a category references an id that doesn’t exist in the details – then when the user tries to view that topic’s details, the app wouldn’t find anything to display.
App Initialization: The main script (main.js) runs on the DOMContentLoaded event. During initialization, it calls initApp(), which in turn calls initializeData(window.ParamedicCategoriesData, window.MedicationDetailsData). This step merges the loaded data into the app’s internal structures. After that, the app calls renderInitialView() to draw the main contents page (the list of categories and topics). At this point, the Back and Forward navigation buttons are set to disabled (since no history exists yet), and the patient sidebar (if present) is hidden.

Rendering the Category List: The function renderInitialView() (using a helper called createHierarchicalList) builds the nested list of categories and topics in the main content area:
Each category is rendered as a row with a clickable label and a blue arrow button. The arrow’s orientation indicates if the category is expanded (downward arrow) or collapsed (right arrow). Clicking either the arrow or the category name will toggle that category’s expansion and reveal or hide its sub-items.

Topics (end nodes of the hierarchy with no further subtopics) are rendered as clickable links (styled as buttons). When clicked, these will trigger renderDetailPage() for that topic.
The createHierarchicalList function assigns HTML attributes like data-topic-id to each topic link (using the topic’s unique id) so that the code can easily identify what was clicked. It dynamically updates the DOM to show nested <div> containers for expanded categories. All of this happens quickly to allow smooth navigation of the menu.

Showing Detail Pages: When a user clicks on a topic link in the list, the app calls renderDetailPage(topicId). This function is responsible for displaying all the information about that selected topic:

It looks up the topic in allDisplayableTopicsMap using the topicId. This gives it a combined object containing the topic’s title, its category path (for context), and its detailed data (if available).

The content area is cleared, and a new detail view is constructed. At minimum, the topic’s title is shown prominently. Then, for each section of details available (description, indications, contraindications, dosage, etc.), the function creates corresponding HTML elements (e.g. headings and paragraphs or lists). For example, if the medication has an “Indications” array in the data, the app will insert a heading like Indications and list those indications.

To maintain consistency, section headings are given id attributes generated by the slugify.js helper. For instance, a section titled "Adult Dose" will have an element like <h3 id="adult-dose">Adult Dose</h3>. This is important for the anchor navigation (next step).

While rendering, renderDetailPage also checks the current patientData. If the patient info suggests any warnings (say the patient is allergic to this medication, or a vital sign contraindicates its use), the function inserts visible warning boxes into the detail page. These warnings are styled to catch the user’s eye (e.g. red text or background) and explain the caution (e.g. “Allergy Alert: Patient has an allergy to this medication” or “Contraindication: Patient’s blood pressure is below recommended minimum for this drug”).
Additionally, based on patient data, certain parts of the detail content are automatically modified: for example, pediatric dosage sections might be greyed out or crossed out for an adult patient, and vice versa. This ensures the paramedic sees immediately which dosage applies and which does not, given the context.

Anchor Navigation for Detail Sections: Many medication detail pages can be long. To help users jump to specific sections quickly, the app uses an in-page anchor navigation system powered by slugList.js and slugAnchors.js:

After renderDetailPage populates the content, slugList.js runs. It scans the newly created detail page for section headers (the ones with IDs like "adult-dose", "indications", etc.). It compiles an array of these section identifiers.

Next, slugAnchors.js runs and uses that array to generate a small table of contents menu, typically placed at the top of the detail page (or as a floating sidebar in the detail view). This menu consists of clickable links (anchor tags) for each section, so the user can click "Contraindications" or "Dosage" and jump directly to that part of the page. The script may also handle a bit of user experience enhancement, like smooth scrolling to the section and perhaps highlighting the current section header as the user scrolls.

Consistency is critical: Both these scripts rely on the section IDs being predictable. That’s why we use the same slugify function for generating the IDs and for listing them. When modifying section titles or adding new sections in the data, always ensure their slug IDs match up, or else the anchor links won’t point to the right place. (If anchor links ever appear broken, double-check that the IDs in the HTML and the hrefs in the anchor menu are the same.)

Patient Info Sidebar Integration: The Patient Info sidebar works in tandem with the main content:

Input Event Handling: In PatientInfo.js, all the input fields in the sidebar (age, weight, allergies, etc.) have event listeners that trigger on any change (keyboard input, selection, etc.).
These listeners call the updatePatientData() function whenever the user updates something.

Updating Data and UI: The updatePatientData() function (defined in PatientInfo.js) reads all the sidebar fields and updates the global patientData object. Once it has the latest patient info, it then goes through the app’s UI to apply changes. For the list of topics, it will add a .strikethrough CSS class to any topic link that becomes irrelevant given the patient’s conditions (for example, if the user entered an indication and a particular protocol is not used for that indication, it might be struck out; or if the patient has an allergy that makes a certain medication unusable, that med could be visually marked). It also refreshes the current detail view (if one is open) by calling renderDetailPage again for the active topic, this time without adding a new history entry. This refresh allows newly entered patient data to immediately reflect in the detail content (e.g., hiding or striking out dose info, or showing a new warning box).

Dynamic Filtering and Warnings: Some automatic calculations or filters are still being fine-tuned. The code already covers a few important cases (for instance, in the Nitroglycerin detail page, if patientData shows the patient is on a PDE5 inhibitor medication or has low blood pressure, the rendered page will display a contraindication warning). Other potential dynamic features, like automatically calculating an exact dose based on weight or filtering the main list to only show relevant protocols for a given symptom, are planned. These are marked as future enhancements. For now, the groundwork is laid: the patient info mechanism can be expanded to cover more cases as needed.

Search Functionality: The search bar at the top of the page lets users find topics by keyword:

As the user types into the search field, the app calls handleSearch() (on every key input or on pressing Enter). This function takes the current search query and compares it against the titles and category paths of all topics (using the pre-built allSearchableTopics list).

If the search term is empty, handleSearch simply re-displays the full list of categories (or keeps the current view). If there’s a term, it filters allSearchableTopics to find any entries that match. Matching is typically done by checking substrings in the title or parent categories.

The filtered results are then passed to renderSearchResults(), which updates the content area to show a list of clickable results. Each result usually displays the topic name and maybe a faint breadcrumb of its category (for context). Clicking a result will open that topic’s detail page.

The search function also handles a “clear search” action (allowing the user to easily get back to the full list after a search). Internally, search and normal navigation integrate with the same history mechanism, so the Back button can return you to a previous list or search state if you navigate away.

When updating or debugging the search feature, key places to check are the construction of allSearchableTopics (in initializeData) and the logic in handleSearch/renderSearchResults that does the filtering and rendering. The goal is to ensure search is fast and accurate, helping the user jump straight to what they need.

All instructions and documentation reflect the current and intended behavior of the Paramedic Quick Reference app.






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

## 6. -----TOP PRIORITY TASKS-----

- **Navigation Buttons (ALS Medications):**
  - The Previous/Next (blue arrow) navigation buttons in the ALS Medications section are now always present, visually match the Contents page, and function correctly for all medications-------STILL CAN USE IMPROVEMENTS IN THE VISUAL DEPARTMENT-------.
  - Navigation logic was refactored to ensure buttons are always rendered and event listeners are reliably attached after header creation -----DOUBLE CHECK THAT THIS IS CORRECT--------.

- **Patient Info Sidebar:**
  - The quick escape (close) button and overlay now reliably close/hide the sidebar, regardless of how it was opened.
  - Sidebar open/close logic was unified in both `main.js` and `Features/PatientInfo.js` for consistent overlay behavior-----DOUBLE CHECK THAT THIS IS CORRECT--------.

- **Medication Data Display:**
  - All medications now display their associated data, regardless of whether their IDs have number prefixes or not. ID matching logic was made robust to handle both numbered and non-numbered IDs-------WORK IN PROGRESS-----------DOUBLE CHECK THAT THIS IS CORRECT--------.

- **Navigation (Back/Forward) Buttons:**
  - Navigation history and view rendering logic were updated to always update navigation button states and use consistent state objects----------LOGIC NEEDS TO BE IMPROVED STILL----------NAVIGATION IS NOT ALWAYS LOGICAL--------FUTURE UPDATE STILL NEEDS TO HIGHLIGHT THE AREA THE USER LAST CLICKED ON AFTER THE HIT THE BACK NAVIGATION ARROW (THE CODE SHOULD EXIST FOR THIS SO YOU MUST SEARCH FOR IT)--------STILL NEEDS CODE FOR A "HOME BUTTON" THAT IS PLACED RIGHT UNDERNEATH THE NAVIGATION ARROWS--------.

- **UI Consistency:**
  - The main topic title in detail view now uses a consistent class and data attribute for reliable UI updates-----DOUBLE CHECK THAT THIS IS CORRECT--------.
  - The `ensureHeaderUI` function in `main.js` was patched to always create and order navigation/search elements correctly, fixing header UI consistency-----DOUBLE CHECK THAT THIS IS CORRECT--------.
  - **Slug Anchors Initialization:** `slugAnchors.js` now waits for the DOM to load before inserting hidden anchor elements, ensuring the container is appended reliably-----DOUBLE CHECK THAT THIS IS CORRECT--------.
  - **Detail Table of Contents:** Each medication detail page now shows a generated Table of Contents for its sections. `renderDetailPage` passes the section list to `setupSlugAnchors`, which builds the anchor list immediately on page load.
  - **Medication Detail Layout:** Section headers like *Indications* and *Precautions* now align directly beside the blue arrow instead of being spaced across the screen. This was fixed by updating the `.toggle-category` style to use `justify-content: flex-start`--------THIS STILL DOESN'T WORK--------.
  - **Table of Contents Loading:** `ParamedicCategoriesData.js` now exports its data via a constant before assigning to `window`. This prevents a runtime error and ensures the contents list loads on the first page view-----DOUBLE CHECK THAT THIS IS CORRECT--------.

- **Testing:**
  - All Jest tests now pass. The `add.test.js` import path was fixed, and a minimal test for `slugify.js` was added. The test suite is clean and ready for further test additions-----DOUBLE CHECK THAT THIS IS CORRECT--------.
  - **Legacy Compatibility Update:** Key parts of `main.js` now avoid modern JavaScript features. DOM references use `var`, error messages use string concatenation, and category processing no longer relies on the spread operator------THIS NEEDS TO BE EXPLAINED IN MORE DETAIL FOR WHAT IT ACTUALLY MEANS AND WHY ONE WAY IS BETTER THAN THE OTHER WAY----------.

  Patient Weight Input: The sidebar now includes a weight input field, so users can input weight (kg/lb) which is used for dosage considerations-------NEEDS TO BE UPDATED TO HAVE BOTH FIELDS AVAILABLE ADJACENT TO EACH OTHER-------BOTH FIELDS MUST BE SIMULTANEOUSLY AVAILABLE FOR INPUT-------WHEN ONE FIELD GETS A WEIGHT PUT INTO IT, THE OTHER FIELD UPDATES WITH THE CORRECT VAULE FOR IT'S UNIT--------UNITS (kg/lb) MUST BE DIRECTLY NEXT TO THEIR RESPECTIVE NUMBERS-------.

  Contraindication Warnings: The app now displays warning boxes on medication pages if patient data reveals contraindications (e.g., allergies, low BP, or recent medication conflicts like PDE5 inhibitors with NTG)--------WORK IN PROGRESS---------.

  Toggle Arrows for Hidden Info: Green clickable text that reveals hidden information now has a small arrow icon that rotates when clicked, indicating expandable content. Likewise, the main Contents page shows blue arrows that turn downward when categories are expanded---------NEEDS FURTHER IMPROVEMENTS-----------.

### 7. CURRENT TASKS/GOALS

- **Navigation:** Users can always move to the previous/next ALS medication using blue arrow buttons at the top of the detail view. Back/forward browser navigation is supported and reliably updates the UI-----DOUBLE CHECK THAT THIS IS CORRECT--------.

- **Patient Info Sidebar:** The sidebar can be opened from the main UI and closed via the escape button or overlay. Patient data updates trigger UI changes and warnings in medication detail views-----DOUBLE CHECK THAT THIS IS CORRECT--------.

- **Medication Details:** All medications listed in the ALS Medications section display their full details, including all associated data fields. Section anchors and in-page navigation work reliably---------WORK IN PROGRESS----------.

- **UI Layout:** All UI elements (navigation, search, sidebar, detail view) are in their correct locations and styled consistently with the rest of the app---------NEEDS FURTHER IMPROVEMENTS--------NEEDS VISUAL IMPROVEMENTS---------NEEDS A SETTINGS TAB PLACED IN THE FOOTER FOR CHANGING THE COLORS OF EVERYTHING--------NEEDS A DARK MODE OPTION IN THE SETTINGS-------SETTINGS BUTTON SHOULD BE COLOR CHANGING TO DRAW THE USERS ATTENTION WHEN THEY LOOK AT THE BOTTOM OF THE SCREEN----------PAGE ELEMENTS MOVE WIERD WHEN SCROLLING AROUND A BUNCH------------.

- **IE Compatibility:** The CSS now avoids grid and custom viewport units. `#content-area` uses flexbox layout and `#patient-sidebar` has a fixed `100vh` height for better support in older browsers--------DESCRIPTION NEEDS TO BE MORE DETAILED ON WHY ONE WAY IS BETTER THAN ANOTHER WAY AND WHAT THE DIFFERENCE LOOKS LIKE----------.

- **Testing:** All available tests pass. The test suite is clean and ready for further expansion-----DOUBLE CHECK THAT THIS IS CORRECT--------.

- Some data-driven updates (like automatic recalculation of all medication doses based on patient info) are still a work in progress and flagged for future development.

- The anchor navigation for long detail pages works, but could be enhanced with smooth scrolling or section highlighting.

- Additional tests for more features (e.g., dosage calculations, contraindication warnings) are recommended.

### 8. RECENT FIXES AND CHANGES

## 9. TIMELINE SUMMARY

## 10. FUTURE TASKS/GOALS/IDEAS

  FUTURE IMPROVEMENTS-------ALWAYS GIVE A SUGGESTION BELOW FOR HOW THE APP CAN BE IMPROVED UPON IN TERMS OF ALIGNING WITH THE GOALS OF THE README.md-------------THE SUGGESTIONS THAT ARE BELOW ARE STRICTLY OFF-LIMITS TO WORK ON UNTIL THEY GET MOVED TO BE UNDERNEATH "KNOWN ISSUES"!!!!!!!!!!!!!!!!!!!!!!!!!!!--------------------------

---

**This README is up to date as of JuLY 7TH, 2025. All instructions and documentation reflect the current and intended behavior of the Paramedic Quick Reference app.**
