## **Paramedic Quick Reference Application**

# *Full Code Context with any code Changes and with any code references:*
  *When proposing code alterations or additions, always provide the complete updated code for the affected segment or file, including the entire line immediately before and after the change. Likewise, whenever referencing specific lines of code in explanations, quote the entire line (not partial fragments). This ensures changes are clear and can be copied into the codebase with proper context.*


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

This README is for the Paramedic-App repository (also called the Paramedic Quick Reference app). It is essential to thoroughly understand this document when addressing any development task or user question. Only make updates to the README if the user has specifically requested it. The README describes how the app should appear and function both currently and in future plans, serving as a guide for developers or AI assistants to implement features correctly and ensuring a bug-free repository. When making changes to the codebase, follow these guidelines:

1. Read Before Coding: Read this README.md in full to understand how the entire repository works together and to locate relevant information for the task at hand.

2. Quote Context in Explanations: When referencing code in discussions or pull requests, always quote the full line of code along with the line immediately before and after it. This provides context for the change.

3. Use Asterics ** for new code: Any new code added is to have ** directly before and directly after the new code for easy identification. Don't omit parts of code in a quoted snippet.

4. Use comments: When writing new code or when using the current code, always make sure each code block has a comment that clearly describes the function of the code block. Make sure the current comments of code lines that you are focused on are up-to-date and accurate. If any comments that you come across are wrong, make sure the user is aware and offer an appropriate solution with either a new accurate comment or by deleting the comment.

5. Check for Duplicates: Before adding new code, search the repository for similar or duplicate code to avoid redundancy. Remove or consolidate duplicates when possible.

6. Consistent Terminology: Ensure that terminology (function names, variable names, feature names) is used consistently across all files. If a term appears in multiple files, it should match exactly in spelling and case.

7. Align with Project Purpose & Structure: All code changes must align with the Project Purpose and Project Structure outlined in this README. New features or modifications should not conflict with the app’s intended functionality or organization.

8. Correct File Placement & Order: Add or modify code in the appropriate file and location. Keep code blocks in a logical order within files (functions that relate to each other should be grouped sensibly). Ensure that the order of code execution does not introduce timing issues (e.g. a function should be defined before it is used).

9. Address All Noticed Issues: Unless the user explicitly instructs otherwise, If you encounter any bug or concern outside your main task (even minor or unrelated), address and fix it if possible. We aim for a clean, error-free codebase.

10. Use File-Specific Documentation: If a specific file has its own README or documentation, read that as well when working in that file.

11. Quality Assurance: After any change, verify that the app still functions correctly as a whole. Test the relevant features and also do regression testing on other features to ensure nothing else broke. Only commit changes that maintain or improve overall functionality.


## 2. APP OVERVIEW AND STRUCTURE

Paramedic Quick Reference is a single-page web application (SPA) built with plain HTML, CSS, and JavaScript (no frameworks or external modules). The app provides paramedics with quick access to critical treatment and reference information, organized for instant retrieval under high-pressure scenarios. This README serves as a thorough guide to the project, outlining where each piece of functionality resides and highlighting how the components interact. By understanding this structure, developers can more easily identify where to implement new features or fix issues. Key points about the app’s architecture and design:

The application is entirely client-side and offline-capable. All data is stored in local JavaScript files, so no API calls are needed and information loads without delay.

The code is separated into logical files and folders for clarity and maintainability. Each file or script has a specific purpose (e.g., data definition, UI rendering, event handling).

The app does not use any build systems or package modules; everything runs natively in the browser. This keeps deployment simple and avoids external dependencies.

Because files and features depend on each other, be mindful that a change in one place (e.g., data format) might require updates in multiple files. This README describes those relationships to help coordinate changes.

The UI uses Tailwind CSS via CDN for quick styling, supplemented by a custom CSS file for additional tweaks. We do not use any JavaScript frameworks; all interactivity is via vanilla JS, which improves speed and ensures we have fine-grained control over behavior.


## 3. PROJECT PUROPOSE

The Paramedic Quick Reference is designed to allow paramedics to find life-saving information within seconds. It functions as an interactive protocol book and drug reference on a phone or tablet. The interface is optimized for speed, clarity, and ease-of-use in emergency situations.

Design and Feature Overview: The app’s UI elements and features are detailed below, describing how each works and what role it plays in the user experience:

Main Contents Page: This is the default view when the app loads. It shows a list of high-level topics (categories) and subtopics that the user can navigate. Key elements on this page include:
  App Title – Displayed at the top-center of the header (e.g., “Paramedic Quick Reference”).
  Search Bar – Located just below the title, this allows users to filter and find topics by typing keywords (more details in Search Bar below).
  Patient Info Button – A button in the top-left corner of the header that opens the Patient Info sidebar when clicked.
  Navigation Buttons – Back and Forward buttons in the top-right corner of the header (disabled initially) for navigating through the view history (see Navigation Buttons below).
  Home Button – A button (represented by a home icon) located under the Back/Forward navigation buttons, which when clicked returns the user to the Main Contents Page from any detail view.
  History Button – A button (visible at all times, below the Home button) that opens a scrollable history of all items the user has clicked during the session (see History Button below).
  Expandable Topic List – The Main Contents list itself uses interactive arrows (blue arrows) to expand/collapse categories and subcategories, and clickable text for final topics (explained under Blue Arrows and Subtopics below).

Blue Arrows: These are the small blue arrow icons that appear to the right of any topic that can be expanded or collapsed. They visually indicate whether a category is expanded or not and let the user reveal sub-items. There are two states:

  Rightward-Pointing Blue Arrow: Indicates that the section is currently collapsed. Clicking this arrow (or its associated text label) will rotate the arrow 90° clockwise to point downward and will expand the section to show its subtopics or reveal hidden information.

  Downward-Pointing Blue Arrow: Indicates that the section is expanded. Clicking this (or the section title again) will rotate the arrow 90° counter-clockwise back to a rightward orientation and collapse the section (hiding the subtopics or text).

  The blue arrows are always positioned immediately to the right of their topic text. They provide a clear visual cue and toggle for showing/hiding content. If a topic has further subtopics, it will always have a blue arrow next to it; if it has no subtopics, no arrow is shown (it’s a final item that can be clicked to view details).

Subtopics and Navigation Hierarchy: The topics are arranged in a hierarchy:

  Categories with Subtopics: These appear as bold or highlighted parent items with a rightward arrow. Clicking them expands a list of subtopics underneath (and turns the arrow downward). Each subtopic may itself be a parent to further subtopics, in which case it will also have a blue arrow to expand it. This nesting can continue through multiple levels if needed.

  Topics without Further Subtopics: These are the final items in a branch (leaf nodes). They do not have a blue arrow. Instead, their text is styled as a clickable button. Clicking one of these will open a Focused Subtopic Section (detail page) for that topic. For example, “ASA” in the ALS Medications category might be a final topic; clicking it opens the Aspirin detail page.

Focused Subtopic Sections (Detail Pages): When a user clicks a final topic, the app displays a detailed page for that specific item. These detail pages may contain medication details, general protocols, or treatments for specific patient conditions.

  All content for these sections comes from the app’s data files.

  The content is organized with clear subheadings.

  Internal links or references: Some detail pages may contain links (for related topics or external resources), images, or even embedded videos if relevant (e.g., a procedural guide might have an image of equipment). Currently, all such media is stored locally or referenced in the data.

  Interactive text elements: Detail pages can also include interactive text (highlighted in green – see Interactive Text below) which, when clicked, reveal additional hidden text (like definitions, tips, or Auto-Calculations).

  Treatment Dosages (Rx): If the patient’s weight is provided (see Patient Info below), the app can Auto-Calculate weight-based dosages and display the calculated values directly in with the text.

  All details for these pages are defined in the data files (no hard-coded content in HTML), ensuring consistency and easy updates.

Interactive Text (Green Text): Within detail pages, certain pieces of text appear in green, indicating they are interactive. This is used for content that has an explanation or additional info that can be toggled without leaving the page. For example, in a protocol you might see something like “Administer Dextrose 50% (D50) IV” where “Dextrose 50%” is green; clicking it could reveal a brief explanation or a conversion to a different concentration.

  When a green text item is clicked, the text immediately following it (which is initially hidden) will slide down or appear – this revealed text is in a lighter green or highlighted format. We often refer to this pattern as a small “accordion” for definitions or clarifications in-line.

  After activation, the green text and its revealed content may both appear with a light-green highlight or background to indicate that they are active. Clicking the green text again will hide the extra information and return the view to normal.

Search Bar: The search bar at the top of the interface allows users to quickly filter and find topics. As the user types into the search input, two dynamic lists appear immediately below it (side by side):

  Filtered List of Topics: On the left, a list of topic titles (and possibly their category path) that match the text entered. This updates in real-time with each keystroke. For instance, typing “asp” might show “ASA – ALS Medications” as well as any other topics containing “asp” or "ASA". Clicking on a topic in this list will directly navigate to that topic’s detail page.

  Smart Suggestions: On the right, the app can display A list of topics that is filtered by the information that the user has inputed into the Patient Info Sidebar and re-organized by what the user is inputing into the search bar. For example, if the user inputs in the Patient Info Sidebar that the patient is intubated, then the Smart Suggestions will show a list of all the various intubation topics that the user may select. If the user then types the letter "d" into the search bar, the Smart Suggestions list will re-organize itself to have the topics that start with the letter "d" appearing first. Smart Suggestions always contain a set number of topics in a scrollable list that is determined by the information in the Patient Info Sidebar. If no information is in the Patient Info Sidebar, then Smart Suggestion contains the full list of Smart Suggestions that is found in the data file. Smart Suggestions topics will be searchable through indirect routes such as: common medical terms, synonyms, or common spelling errors. For example, typing “dAtdi” might suggest “Cardiac Arrest” even if those exact words haven’t been fully typed, or might suggest related terms like “Cardioversion” or “Cardizem” if applicable. These suggestions help guide the user if they are unsure of spelling or the exact name of a protocol. Clicking a suggestion could refine the search or directly show a subset of related topics. (This feature may be expanded as the app grows; currently it may offer basic suggestions based on an internal list of keywords and these basic suggestion will be more likely to contain topics that the user would need to access while under duress such as: Cardiac Arrest, SVT, RASS +3, RASS +4, Epi, Versed, ecetera.)

  The search is case-insensitive and tries to match any part of a topic’s name or associated keywords. It allows quick navigation without manually browsing the categories. There is also usually an “X” or clear button to reset the search and return to the full contents list.

Patient Info Menu Button: This button (often iconized as “Patient Info” or using a patient icon) toggles the Patient Information sidebar. When clicked, it slides out a sidebar (from the left side of the screen by default) where the user can input patient-specific data. Clicking the button again (or clicking on the semi-transparent overlay over the main content) will close the sidebar. This feature is crucial because patient-specific information can change which treatments are applicable. It effectively personalizes the content to the current patient.

Patient Info Sidebar/Section: The patient info section is an interactive form where the paramedic can enter details about their patient. Every category in this section allows the user to input specific information that is interactive with the app in one way or more. All categories will have a drop down menu to select from, some categories will have a drop down menu and allow for the user to type the data in. Any information inputed by the user persists inbetween sessions (so if they close and reopen the app, no patient information is lost.). The categories of information include:

  Age – The patient’s age. This can affect whether pediatric or adult protocols apply (e.g., dose differences, which sections to StrikeThrough). The UI might treat an age above a certain threshold as “adult.” Numbers user can input if in "years' are positive integers from 0-120. Numbers user can input if in "months" are positive integers from 0-40. Numbers user can input if in days are positive integers from 0-500.

  Weight – The patient’s weight (in kilograms or pounds). Weight is used for Auto-Calculation with weight-based dosages. (Current UI includes a single weight input, but a planned improvement is to allow entry in either kg or lbs and automatically convert between them.) Numbers user can input if in "lbs" are positive integers from 0-1500. Numbers user can input if in KG are positive integers from 0-700.

  Vital Signs (VS) – Vital Sign abnormalities can trigger warnings or make certain interventions inappropriate (which the app will indicate). Input options are: User input, Drop-Down menu to select an option from, or both. When the user hovers, with a mouse or they press and hold with their finger, over an option that they can select from the Drop-Down menus of select VS, a Pop-Up menu will appear. This Pop-Up menu appears to the right of the Sidebar (not within the Sidebar). This Pop-Up menu will give further clarity on what their selection option means exactly, and the menu will have an "x" in the top right corner that will close the Pop-Up menu. VS include:
    Blood Pressure (BP): User may input number or select from Drop-Down menu. Drop-Down menu options are: 200+, 160+, Normal, >90, and >70. Top of Drop-Down menu is labled SBS. Numbers user can input are positive integers from 0-400 for systolic and 0-300 for diastolic.
      MAP: Inputing a systolic and diastolic BP will Auto-Calculate and provide the user with a MAP value that will have it's own Pop-Up menu.
    Heart Rate (HR): User may input number or select from Drop-Down menu. Drop-Down menu options include: 150+, 100+, 60-100, >60, and >40. Numbers user can input are positive integers from 0-300 for systolic BP and 0-200 for diastolic BP.
    SpO2 (%): User may input number or select from Drop-Down menu. Drop-Down menu options include: Normal, Low, and Severly Low. Numbers user can input are positive integers from 50-100.
    EtCO2: User may input number or select from Drop-Down menu. Numbers user can input are positive integers from 0-50.
    Respiratory Rate (RR): User may input number or select from Drop-Down menu. Numbers user can input are positive integers from 0-80.
    Blood Glucose (BGL): User may input number or select from Drop-Down menu. Numbers user can input are positive integers from 0-900.
    Pupils: User may input number or select from Drop-Down menu. Numbers user can input are positive integers from 0-8mm.
    GCS: User may input number or select from Drop-Down menu. When clicked, drops down a menu starting at the top at 1 and ending at 15. 
    AO Status: Drop-Down menu only. Drop-Down menu starts at 4 and ends at 0.
    Lung Sounds (LS): User may type their option(s) to filter the Drop-Down menue or just select from the Drop-Down menu.

  EKG Interpretation: User may type their option(s) to filter the Drop-Down menue or just select from the Drop-Down menu. When the user hovers, with a mouse or they press and hold with their finger, over an option that they can select from the Drop-Down menu, a Pop-Up menu will appear. Pop-up menu will appear on screen the same as the other, but instead of info, it will have an EKG example. Off to the side, their will be a "EKG Help" link that takes the user to a new screen dedicated to EKGs.

  Past Medical History (PMH) – User may type their option(s) to filter the Drop-Down menue or just select from the Drop-Down menu. A list of the patient’s known conditions or medical history (e.g., diabetes, heart failure, asthma). This can help filter protocols (for example, showing relevant treatments or contraindications). This field often supports multiple comma-separated entries, and the app provides an autocomplete of common conditions for convenience.

  Allergies – User may type their option(s) to filter the Drop-Down menue or just select from the Drop-Down menu. Known patient allergies (especially drug allergies). If a patient is allergic to a medication listed in the app, that medication’s detail page will show a prominent Allergy Alert. Additionally, the medication may be visually marked (e.g., Struck-Through) in lists to help the user focus on more viable options. Struck-Through options are still functionable. Autocomplete suggestions (common allergens like penicillin, latex, etc.) are provided.

  Medications – User may type their option(s) to filter the Drop-Down menue or just select from the Drop-Down menu. The medications the patient is currently taking. This is important for identifying drug interactions. For instance, if the patient is on a phosphodiesterase inhibitor (like Viagra), the app will warn against giving Nitroglycerin. This field also supports multiple entries with autocompletion of common drug names.

  Indications – User may type their option(s) to filter the Drop-Down menue or just select from the Drop-Down menu. The primary complaint or indication for calling EMS (e.g., chest pain, shortness of breath). This can be used by the app to highlight protocols that are likely relevant (for example, if “chest pain” is entered, the protocols related to cardiac issues will be highlighted blue).

  Symptoms – User may type their option(s) to filter the Drop-Down menue or just select from the Drop-Down menu. Additional symptoms observed (e.g., nausea, dizziness). Like Indications, these might be used for smart filtering or highlighting relevant topics.

  (All Patient Info fields are optional, but the more that is filled, the more the app can tailor the content. All fields left blank simply mean the app shows everything by default.)

After the user enters patient data, the app immediately updates relevant parts of the UI (see Effects of Patient Data below). The sidebar remains open or can be closed; the entered data persists in memory (and can be designed to persist across sessions using localStorage in the future, though currently it’s just in-memory).

Effects of Patient Data: The information input in the Patient Info sidebar influences the main content in real time:

  StrikeThrough Inapplicable Items: Treatments or doses that don’t apply to the given patient are automatically styled with a StrikeThrough or greyed-out. For example, if an adult patient’s age is entered, any pediatric dosage sections might be de-emphasized or crossed out (since they are not needed). If a patient has an allergy to a medication, that medication name might appear crossed out in lists or accompanied by an alert icon.

  Warnings/Alerts: If patient data triggers a contraindication or warning, the detail page will show a prominent warning box (usually with a red border or background). For instance, on the Nitroglycerin page, if the patient’s systolic BP (from VS input) is below the safe threshold, a warning will appear reading “Contraindication: Patient’s blood pressure is below recommended minimum for Nitroglycerin.” Similarly, if the patient’s Medications list includes a drug that interacts, a warning like “Drug Interaction Alert: Patient has recently taken Viagra (PDE5 inhibitor) – DO NOT administer Nitroglycerin” will show. These warnings are meant to be very noticeable.

  Dynamic Content Filtering: The main Contents page can adapt based on Patient Info. If certain indications or symptoms are recorded, the app can highlight protocols that match or even partially hide those that clearly don’t apply. For example, if “trauma” is an indication, medical (non-trauma) protocols might dim or move lower. Conversely, relevant topics might get a highlight or rise to a “Suggested” section.

  Auto-Calculations: Numeric inputs like weight are used to calculate doses. Wherever the data files denote a dose as weight-based (marked by “Rx” or similar), the app will perform the math and insert the result. This spares the paramedic from manual calculation under stress. For instance, "Morphine Dose: 0.1 mg/kg IV/IO” and the patient weight is 50 kg, the app will display “Dose: 0.1 mg/kg IV/IO (= 5 mg IV/IO)”. Clicking on the "= 5 mg IV/IO" will bring up a Pop-Up menu that shows the math to reach that answer along with providing how many ml of Morphine the Paramedic needs to draw up into their syringe (math included). The "(= 5 mg IV/IO)" will actively transition back and forth between two color fonts to indicate to the user that a Pop-Up menu exist. Calculations update live as the weight input changes.

  Contextual UI Changes: Some UI elements may change based on Patient Info. For example, if an entire category becomes irrelevant (say, “Pediatric Protocols” for a 30-year-old patient), the app might visually fade those buttons or put a note next to them. Additionally, the header or a small fixed panel will show a Patient-Snapshot (see below).

  Patient-Snapshot: Key patient details are shown persistently on the screen once entered, so the user is always aware of the context. This could be a small bar or box (for example, at the top or bottom of the screen) that says something like: “45 y/o F, 60 kg; Takes Beta-Blockers (The user entered "Metoprolol” into the Patient Info section, but "Beta-Blocker" would be shown in the Patient-Snapshot, since Beta-Blocker has a higher potential for being relevant in the context of administering Beta adrenergic medications); Broncospasm; (then underneath in red warning font) WARNING: Albuterol may be ineffective for Tx if the pt is actively taking her Metoprolol Rx!" and the WARNING message in red font would also be a clickable button that can provide further information on the WARNING. This Snapshot updates in realtime as the user changes any info, and it remains visible as they navigate through topics, providing context at a glance. (The exact placement and style of the snapshot are a part of the UI design – it might appear in the header or as a sidebar summary. The main goal is that the user doesn’t forget the entered patient parameters while reading treatment info.)

Navigation Buttons (Back, Forward, Home): The app provides basic navigation controls similar to a web browser, so users can easily move between viewed pages without losing their place:

  Back Navigation Button: This appears in the top-right of the header (as an arrow pointing left). Initially, it is disabled (grayed out) because there is no history yet. Once the user navigates to at least one detail page (or performs a search, etc.), the Back button becomes active. Clicking Back will return the content area to the previous view the user was on. Importantly, the app restores the state of that page exactly as it was – for example, if the user had expanded certain categories on the main list, those remain expanded, and the particular subtopic they clicked is highlighted to show where they left off. This “state restoration” means the user can explore a topic’s details and then go back to the list without losing context.

  Forward Navigation Button: Next to Back, the Forward button (arrow pointing right) becomes enabled if the user has gone back and can move forward again (much like a browser’s forward button). It re-navigates to the page that was ahead in history. These two buttons together let the user step backward or forward through their navigation path easily.

  Home Button: Under the Back/Forward controls, the Home button instantly brings the user back to the Main Contents Page (the top-level list of all topics). This is a quick way to start over or go to the main menu, regardless of how far the user navigated. Unlike the Back button, Home does not preserve expanded states (it resets the content list to default collapsed state for all categories). It’s essentially a shortcut to renderInitialView() fresh (Patient Info that the user inputs is uneffected!!!).

  History Button: This is a feature to track what the user has clicked on during their session. The History button (available at all times, as an clock icon) opens a DropDown Panel showing a chronological list of topics the user has viewed (most recent first). Each entry in this history list is a clickable link; clicking one takes the user back to that topic’s detail page (or list view) directly. The history persists inbetween sessions (so if they close and reopen the app, they will still see past items). This is useful for quickly revisiting something looked up earlier without searching again.
  The history list might show the topic name and possibly the time it was accessed or an index number. It functions similarly to a browser history but within the app context.

**Settings Button:** Found in the Footer of the HTML. Font transitions back and forth between two colors to grab the user's attention. Any settings changed will exist between sessions. Settings options is aimed for the user to customize the UI to their own specific prefernces. There will be a broad depth of options to customize, making the app capable of being tailored to an individuals wants and needs.

Performance and Simplicity: The app prioritizes speed and reliability:

  It is built with pure HTML/CSS/JS to minimize overhead. There are no external frameworks or module bundlers involved. This not only keeps load times fast (just a few static files) but also simplifies development (no build step; just open the index.html).

  All content is loaded locally. Because all data is embedded in JavaScript objects, the app works offline once loaded (ideal for use in the field where internet might not be available). There are no runtime fetch calls for data, eliminating network delay.

  We use Tailwind CSS via CDN for rapid styling using utility classes. Tailwind provides a consistent look and spacing without writing large custom CSS. Our custom styles.css adds a few project-specific styles (like custom classes for strikethrough or warning highlights, and any layout tweaks). This approach means we can restyle quickly if needed, but also have predictable styling.

  The interface is intentionally uncluttered: a simple header, a sidebar for patient info, a content area that either shows a list or detail info, and a footer if needed. Font choices and sizes are made for readability. Color coding (blue for interactive elements, green for toggles, red for warnings) is used to draw attention appropriately.

  All design choices center on making the app usable in high-stress scenarios: big touch targets for buttons (for use on tablets/phones in the field), logical organization so info can be found with minimal taps, and fail-safes like warnings to prevent medical errors.


## 4. PROJECT STRUCTURE

*The project is organized into several files and directories, each serving a specific purpose. Below is an overview of the structure and key files along with their associated folders:*


**index.html** – Main HTML container. This is the entry point of the app. It defines the layout structure (header, sidebar, content area, etc.) and includes all the necessary CSS and JS files. In the <head>, it links the Tailwind CSS CDN and our styles.css. In the body, it sets up the static HTML for header buttons, the search bar, the empty content container, the patient sidebar form, and so on. It then includes scripts in a specific order: first the data files (so that data is ready), then utility scripts, then feature scripts like PatientInfo.js, and finally main.js which initializes the app; *file order may change depending upon project needs, so if the file order appears incorrect you must: Never change the file order without doing a thorough investigation into all of the files that will be now run before or after with the updated file order (files that dont change from running before to after or after to before the main file getting moved around are to be excluded); In the main file and all of the files you are to be investigating, you must do a thorough order of operations check to verify that the code will still function the same or better, which must be done on all the files and the entire code within the files; the number of positive or negative results obtained from the operations check will never be a factor in when to conclude the investigation, the operations check verification investigation can only be complete after each code line within each of the files has been independently investigated. Any new file must be included in the index.html.


**styles.css** – Custom CSS stylesheet. Contains project-specific styles that Tailwind’s utility classes don’t cover. For example, classes for the Strikethrough effect, any custom animations (like Arrow rotations), or layout fixes for certain elements. Most visual styling is with Tailwind classes directly in HTML, but critical overrides or additional styles live here. This file is loaded in the head of index.html so that its rules can complement/override Tailwind where needed.


*styles.js – **File path currently doesn't exist and File may never need to be created** In this project, since Tailwind is used via CDN with default settings, styles.js is mostly unused. It might contain a small script if we needed to calculate or toggle styles via JS (but most of that is handled in main.js or CSS). If not needed, this file can remain empty or be removed; it’s included for completeness in case we later add theme switching logic (for example, adding a dark mode via toggling classes).*


*Data/ – Data files directory. This folder contains static JavaScript files that define the content of the app (the topics and their details). These files do not execute any logic; they simply declare objects/arrays and assign them to the global window so that main.js can use them.*

  **Data/ParamedicCategoriesData.js** – Defines the hierarchical list of categories and topics for the main contents page. This file has an array of category objects. Each category object has properties like title and children (where children is an array of subtopics). Subtopics might themselves have children, or an id if they are final topics. For example, it may define an object for “ALS Medications” category which contains a list of medication topics each with a unique id. At the end, it assigns this array to window.ParamedicCategoriesData.

  Usage: main.js will iterate over window.ParamedicCategoriesData to build the menu. Each topic or subtopic’s id is crucial as it links to details in the next file.

  **Data/MedicationDetailsData.js** – Contains detailed information for individual topics, primarily medications (since those have a lot of structured data). This could be an array of objects or a dictionary object keyed by id. Each entry includes fields such as id (matching one from the categories data), description, indications (array of strings), contraindications (array), adultDose (or adultRx), pediatricDose (pediatricRx), sideEffects, etc. It may also include special flags or notes. This file attaches the data to window.MedicationDetailsData.

  Usage: When a detail page is rendered, main.js looks up the topic’s id in MedicationDetailsData to retrieve all these fields and then generates HTML accordingly. If an id is missing here (but present in categories), clicking that topic would result in no detail info being shown (so consistency is important). Note that not all topics require a detailed entry (some may be purely category headers), but all final actionable topics usually have one.


  *Other Data files that still need to have code placed within them include:*
    **Data/additionalMedications.js**
    **Data/patientInfoSynonyms.js**


*Features/ – Feature-specific scripts. This directory groups scripts that handle a particular aspect of the app’s functionality.*

  **Features/anchorNav/slugAnchors.js** – This file works in tandem with slugList.js. Once the list of section IDs is available, slugAnchors inserts clickable anchor links into the page. For example, it might generate a small <nav> element at the top of the detail content containing links like “<a href="#description">Description</a> | <a href="#dosage">Dosage</a> | …” for each section. It could also attach event listeners for smooth scrolling, or simply rely on default anchor behavior. In some implementations, slugAnchors might also highlight the current section as you scroll (though that’s a potential enhancement). For now, its main job is to display the list of section links.

    Both slugList and slugAnchors are triggered after renderDetailPage completes inserting content.

    Troubleshooting: If anchors are not appearing or not working, ensure that: (1) section headings have ids (generated by slugify), (2) slugList is capturing them, and (3) slugAnchors is appending the links to the DOM. Also, check that the anchor link href exactly matches a section id. Consistency is key, which is why slugify should be used everywhere.


  **Features/anchorNav/slugList.js** – This script is responsible for gathering section IDs from a rendered detail page. After a detail page is inserted into the DOM, slugList.js runs to collect all the headings (e.g., it might do document.querySelectorAll('h3') in the content area) and create an array of their id attributes. It then makes this list available (perhaps attaching it to window.currentSections or calling a function in slugAnchors). Essentially, it prepares the data needed for an in-page Table of Contents. By using the same slugify logic, it knows those IDs correspond exactly to the section titles. If a section isn’t appearing in the anchor menu, this script is the first place to check (does it capture it correctly?).


  **Features/navigation/Navigation.js** – Contains the navigation history state and Back/Forward Navigation Button's functionality.


  **Features/navigation/Home.js** – Implements the Home button functionality to return to the main Contents page.


  **Features/patient/PatientInfo.js** – Manages the Patient Info sidebar behavior and the global patient data state Manages the Patient Info sidebar behavior and the global patient data state. It defines a global object (e.g., window.patientData) to store age, weight, allergies, etc. It also sets up event listeners for the form inputs in the sidebar (like onChange for the text fields and checkboxes if any). When any patient info is updated, it runs the updatePatientData() function.

    updatePatientData(): This function reads the current values from all patient info fields (e.g., the number in the age field, the list of allergies entered, etc.) and updates the patientData object. Then it triggers various UI updates: for example, it may call applyPatientFilters() which goes through the topic list in the DOM and adds or removes a CSS class (like .strikethrough) on each topic depending on patient criteria. It will also invoke a refresh of the current detail page view (if one is open) by calling renderDetailPage for the current topic ID with the new context, so that any dosage calculations or warnings can update immediately.

    This file may also declare some global sets or arrays for use in *Autocompletion* (for example, lists of common allergies or medications are defined in *main.js* and passed to this file’s scope for use in *Suggestions*.)

    The separation of patient info logic here means all rules about how patient data affects the UI can be managed in one place (for instance, if we add a new field like “Pregnancy” in the future, we’d adjust this file to handle any special cases for that field).

    *Important: This script works closely with main.js – after updating data, it relies on main.js functions like re-rendering pages or lists. It also relies on global structures (like allDisplayableTopicsMap and allSearchableTopics) which are set up in main.js. Thus, it’s included after those structures exist. The event listeners in PatientInfo.js ensure that as soon as the user types or selects something in the sidebar, the rest of the app responds.*


  **Features/patient/PatientSnapshot.js** – (Planned file for capturing a snapshot of patient info; not yet implemented)


  **Features/search/Search.js** – Implements the search functionality (migrated from main.js), including building the searchable topics index and filtering topics based on the user’s query.


  **Features/Warnings.js** - Produces warnings when appropriate after the user begins inputing information into the Patient Info section. For instance, if the user inputs the pt's age as "8", then when they go in the medication detail for Etomidate, they will see a red Warning message up top that says, "Warning, pt's age is 8 years old! Etomidate is contraindicted for pt's less than 10 years old!!!"


# New Features/ folders and files include: (All files still need to have code placed within them) 
    Features/CardiacArrest.js
    Features/Diagnoses.js
    Features/dosageCalc.js
    Features/pcrNarrative.js
    Features/VoiceMode.js
   
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
 

*Utils/ – Utility scripts. These are helpers that are used across the app for small tasks, often included early so they can be used by other scripts.*

  **Utils/slugify.js** – A helper function to convert a string into a URL-friendly “slug” (lowercase, hyphen-separated). For example, "Adult Dose" becomes "adult-dose". We use this to generate id attributes for section headings on detail pages. By having a consistent slug generator, we ensure that if a section title in data is in "Contraindications", its <h3> element will get id="contraindications", and any anchor link can point to #contraindications. This consistency is vital for the anchor navigation to work (see slugList and slugAnchors below).

    The function exported by slugify.js is used both when rendering detail page sections (to set ids) and when building the anchor list (to make the links). Always use this function for any new section titles to avoid mismatches.

  # (Other utility files can be added here as needed; currently slugify is the main one. If we had a general helper for formatting or a polyfill, it would go in Utils too.)


*Main Scripts (project root): These are the core JavaScript files (often loaded directly in index.html) that drive the app’s functionality.*

  **viewportFix.js** – A small script that fixes the behavior of CSS 100vh on mobile browsers. On some mobile devices, 100vh can be problematic (because of browser UI chrome). This script calculates the actual viewport height and sets a CSS variable or updates elements like the sidebar to ensure full-height coverage. In effect, it ensures elements intended to span the full screen actually do so without causing scroll issues. This is mostly a UX polish for mobile compatibility. (It might add an event listener to window resize and adjust some CSS custom property like --vh which is then used in CSS in place of 100vh).


  **main.js** – The central application script that brings everything together. It handles initialization, rendering of views (list or detail), search functionality, and integrates the patient info into the content. Some key responsibilities and functions in main.js:

    Initialization (initApp): On DOMContentLoaded, initApp() is called. This function does initial setup like calling assignDomElements() to cache references to important DOM nodes (search input, content area, buttons, etc.), setting up event listeners (for search bar input, for navigation button clicks, etc.), and preparing the data. It ensures the Patient Info sidebar is hidden by default (adding hidden classes), and attaches the open/close logic for that sidebar (e.g., clicking the overlay or close button hides it, clicking the open button shows it – see lines around 38–60 in main.js for how it toggles classes for open/hidden).

      It also initializes autocomplete for patient info fields by calling a helper setupAutocomplete on various patient info textareas (for example, past medical history, allergies, medications, etc. have suggestion dropdowns). This makes user input faster and more uniform.

      Critically, initApp() calls initializeData(window.ParamedicCategoriesData, window.MedicationDetailsData). This merges the static data (loaded from the Data files) into internal structures. For instance, it might copy the array from ParamedicCategoriesData into a global paramedicCategories variable, and then traverse it to build allDisplayableTopicsMap (mapping every topic ID to its object with references to parent categories). It also builds allSearchableTopics, an array of objects each containing a topic’s title and full path, which is used to perform text search quickly.

      Once data initialization is done, it calls renderInitialView() to display the main content list. It also ensures the navigation history is set up (an empty array with index -1 initially) and that the Back/Forward buttons are correctly disabled at start.

    Rendering the Category List (renderInitialView): This function populates the main content area with the list of categories and topics (the table of contents of the app). It likely uses a helper (maybe internally defined) that recursively creates HTML for a given category and its children. Each category is output as a clickable <div class="toggle-category"> (or similar) containing the title and a blue arrow icon. Each topic (child without further children) is output as a <div class="topic-item"> or button element with an attached data-topic-id. The structure in HTML might be nested <div class="category-group"> containing a parent and its child list, etc.

      If renderInitialView(highlightId) is called with a highlightId (meaning we want to highlight a particular topic when rendering, e.g., after coming back via Back button), the function will ensure that category is expanded and scroll into view, and add a highlight style to that topic. This helps the user see where they left off.

      The result of this function is that contentArea (the main section in index.html) will be filled with the hierarchical list of all topics. Event listeners are set so that clicking on any blue arrow toggles the appropriate section (show/hide children), and clicking on any topic name (leaf node) triggers renderDetailPage for that topic.

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

    Activate Autocomplete: Call setupAutocomplete for each patient info textarea (PMH, allergies, medications, indications, symptoms) linking them with their suggestion sets (populated in step 5). This adds keyup events to show suggestion dropdowns and click events to select suggestions, making input faster.

    Global Input Focus Styling: Add a nice UI touch: all input and textarea elements get a focus ring (blue outline) by adding a Tailwind class on focus and removing on blur. This is done by selecting all inputs and textareas and adding listeners (improves mobile form usability by clearly indicating the focused field).

    Initial Render: Finally, call renderInitialView(true) to render the main contents list. The parameter true might indicate that if there’s any previously stored state (like maybe the last opened category in a previous session), it could highlight it, but in our case it simply builds the list fresh. After this, the user sees the home page with all categories.

  User Interaction – Expanding Categories: The user clicks a blue arrow or category name on the main list. The event listener (likely set up at the time of rendering each category in renderInitialView) catches this. If it’s an arrow or category with children, it toggles that category:

    If it was collapsed, it loads the subtopics (which might have been created already by createHierarchicalList but hidden, or it might generate them dynamically at click time) and then adds a class to the arrow to rotate it. We likely manage expanded state via CSS classes and maybe some data-expanded="true" attributes.

    If it was expanded, it hides the subtopics and rotates the arrow back.

    This is done purely with DOM manipulation and CSS (no re-render of the whole list, just show/hide of the specific branch). We must ensure that the HTML structure for subtopics is created (either at page load or on first expand) and that toggling doesn’t interfere with the user’s scroll position.

  User Interaction – Viewing a Detail Page: The user clicks a topic that has no further subtopics (a final topic). The click event listener (attached to that item with a data-topic-id) triggers renderDetailPage(topicId).

    renderDetailPage will push a new entry onto the navigationHistory stack (unless it was called as part of a back/forward navigation where we set a flag to avoid double-pushing). It then constructs the detail content as described earlier.

    Once the detail is rendered, it updates the Back button to enabled (because now there is a history entry behind this one). The Forward button is disabled because we’re at the newest entry.

    The user now sees the detail page with all relevant info and any patient-specific adjustments (if patientData is set).

  Dynamic Updates on Detail Page: Suppose the user now enters or changes something in the Patient Info sidebar (e.g., they add an allergy or adjust the weight). The input event on that field triggers updatePatientData():

    This function updates the patientData object. For example, patientData.weight gets set to the new number.

    It then calls functions to update the UI. Typically, it will call something like applyPatientFilters() which goes through the main contents list (if it’s currently displayed) to strike out or highlight items. If the main list is not visible (user is on a detail page), that can be skipped or will simply operate on a hidden DOM (which is fine).

    It then checks if a detail page is currently shown (we might track the current view type and id). If yes, it calls renderDetailPage(currentTopicId) again to refresh the content with the new patient context. Importantly, when doing this refresh, it should avoid adding another history entry. There might be a flag or a separate internal function for re-rendering the detail in place. The effect is that the user sees the detail page update instantly: new warning boxes might appear, certain text becomes struck through, and dosage calculations update. The scroll position might be preserved if possible, or reset to top if not handled (for now, likely resets to top).

    Because the anchor navigation (slugList/slugAnchors) runs on renderDetailPage, it will re-generate after refresh. That’s fine; it ensures the anchor links are still accurate if any sections were added/removed due to patient data (though typically we don’t remove sections entirely, just mark them).

    Example: The user is viewing “Epinephrine” detail. Initially, pediatric dose is shown (because no age given). They then enter Age = 30. Upon update, the Epinephrine page re-renders, now maybe visually de-emphasizing the pediatric dose section (or adding a note “Pediatric dosing not applicable for adult patient”). If they also add an allergy “Sulfa” (which might not affect Epinephrine, so nothing changes on that page) but if they add “Allergies: Epinephrine”, the page would on refresh show an “Allergy Alert: Patient allergic to epinephrine” box.

    These changes happen without a full page reload; it’s all JS DOM updates.

  Back/Forward Navigation: If the user clicks the Back button (after having navigated to a detail page, or after performing a search, etc.), the app will handle it via our navigateViaHistory(-1):

    We decrement the currentHistoryIndex, get the history entry at that new index, and based on its type, call the appropriate render. For example, if the history entry is {type: 'list'}, we call renderInitialView(highlightId) possibly to show the main list and highlight the item that was previously clicked. If the entry is {type: 'detail', id:'someId'}, we call renderDetailPage(someId) but likely with a flag to indicate it’s from history (to avoid pushing new history).

    After rendering, we update the nav button states. Now Forward becomes enabled (since we can go forward to the page we were just on).

    The user sees the previous page. Importantly, because we preserved state, if it’s the main list, it should have the same categories expanded as when they left it. This is handled by the highlightId logic and possibly storing expanded/collapsed state in the history entry. We may store something like an array of expanded category IDs in the history entry to restore the exact view. The code ensures, for instance, if ALS Medications was open and highlighted, it will open it again and scroll to that item.

    If the user now clicks Forward, a similar process happens in reverse, re-rendering the page they came from. The highlight and scroll states again should be restored (for detail pages, scroll restoration might not be implemented yet, but it’s something to consider).

  History List Usage: If the user opens the History dropdown and selects an item (say the first thing they opened in the session), the app will locate that item’s entry (or simply call renderDetailPage for that ID directly and push a new history entry for it). We might refine this to integrate with the existing history mechanism or treat it as a new navigation event (clearing forward history if you jump around).

  Anchor Navigation on Detail Page: On a long detail page, if the user clicks one of the anchor links (for example, “Contraindications” in the table of contents at top), the page will jump (or smoothly scroll) to the section with id #contraindications. We may have some custom scroll behavior for smoothness. If implemented, an event listener in slugAnchors.js might intercept the click, call event.preventDefault(), then find the target element and scroll it into view with behavior: 'smooth'. It might also add a temporary highlight on that heading to draw attention. If not implemented, the browser will jump to the anchor instantly by default.

  This doesn’t change any app state or history (it’s just a position within the page), so Back/Forward are unaffected. It’s purely a convenience for within-page navigation.

  Closing the App and Persistence: Currently, if the user closes the app (or refreshes), all state (patient info, history, expanded menus) resets because we are not using persistent storage. In future, we might use localStorage to save patientData and maybe navigationHistory between sessions. The README note suggests that when the user exits and comes back, they will be able to access information they had input previously – that implies a feature to persist patientData (so you don’t have to re-enter the same patient’s info if you switch apps briefly). Implementation of that would involve storing patientData in localStorage on unload and loading it on startup if available.

All these components work together to provide a seamless experience: The data provides content, main.js renders it and ties it to user input and navigation, and the patient info customizes it on the fly. Each file has a clear role, which makes it easier to maintain and update specific parts of the app.


## 6. -----TOP PRIORITY TASKS-----

(This section outlines the most important current development tasks, and known issues that are being addressed. It serves as a changelog of critical updates and areas of focus.)

  Medication Data Display (ID Matching):

    We fixed an issue where some medications were not showing their details because their IDs had numeric prefixes or unexpected formatting. The ID matching logic in initializeData and elsewhere has been made more robust. It now handles IDs regardless of whether they’re strings like "epiPen" or numeric strings like "5glucose". All medications and topics in the data should successfully link to their detail entries.

    This was a work in progress; if any medication detail still doesn’t load on click, investigate its id in both data files to ensure consistency. We have added console warnings for when a detail is missing, to catch any remaining mismatches. (Double-check that every topic in ParamedicCategoriesData that should have a detail in MedicationDetailsData indeed displays content when clicked.)

  Back/Forward Navigation Logic:

    Updates were made to how the app manages the history stack and the rendering of previous views. Now, whenever a new view is rendered (list or detail), the history entry includes enough info to restore that view. The Back and Forward Navigation Buttons’ enabled/disabled states are updated immediately after each navigation so they correctly reflect availability.
    
    Known Issue: The navigation history logic still has an edge case: after going Back to the main list, the last-clicked item on that list is highlighted (which is correct), but if the user had multiple levels expanded, sometimes not all of those expansions persist. We intend to highlight the exact subtopic or section the user last interacted with. There is code in place to do this (the highlightId parameter in renderInitialView), but it may need refinement to scroll the item into view or open all parent categories fully.



  UI Consistency Fixes:

    Detail Page Title Styling: The main title on each detail page now uses a consistent class name and data attribute. This allows the CSS to style all detail titles uniformly (e.g., same font-size and margin) and also allows scripts to easily select it (for any future dynamic update). Previously, some detail titles had inconsistent tags or classes, which could lead to styling glitches.

    Header UI Structure: We fixed the ensureHeaderUI function in main.js to always (re)create the necessary header elements in the correct order. In some cases, during navigation or re-initialization, duplicate search bars or misplaced buttons would appear. Now the header is treated as a stable component; ensureHeaderUI checks if elements exist and creates them if not, and ensures they are appended in the proper DOM order (Patient Info button on left, title center, nav buttons right, etc.). This improved the consistency of the header layout across navigations.

    Slug Anchors Initialization: Modified slugAnchors.js to wait for the DOM content to be fully loaded (or for a detail page container to exist) before inserting the anchor navigation menu. In practice, we use a function setupSlugAnchors(sectionIdArray) that is called after renderDetailPage. This ensures the anchor links (table of contents for sections) are injected at the right moment. This fix prevents a bug where anchor links sometimes were not added if the script ran too early.

    Detail Page Table of Contents: We introduced an automatic Table of Contents generation for detail pages with multiple sections. Now, at the top of each detail page, if there are sections like Description, Dosage, Indications, etc., the app inserts a list of links to those sections. This makes navigating within a long detail page faster. (E.g., on the Amiodarone page, you can tap “Adult Dose” in the TOC and jump straight down.) This feature is working, but continue to ensure new sections get slugified IDs so they appear in this TOC.

    Section Header Alignment: A CSS tweak was made to how section headers and their toggle arrows are aligned in expandable lists. Specifically, for the main Contents page and any similar toggles, we set .toggle-category { justify-content: flex-start; }. This was intended to ensure that the category name and the arrow icon stay together on the left, rather than being spaced apart. In practice, this fix did not fully solve the spacing issue for all screen sizes. We will revisit the CSS – likely the parent container needs align-items: center as well to vertically center, and maybe a specific width or padding. (This item remains partially unresolved: the goal is to have the arrow icon snugly next to the text label.)

    Data File Loading Order: A subtle fix was applied to ParamedicCategoriesData.js – we now define the categories data in a const (or var) and then assign it to window.ParamedicCategoriesData. This avoids a potential race condition where main.js might have tried to read the data before it was fully defined. In practice, this was causing an error on the very first page load in some cases. By exporting to window only after the data is fully ready, we ensure that initializeData gets the complete object. (Verify that on app startup, there are no console errors about missing data – the categories should populate on first try.)

  Testing Updates:

    All Jest tests in the repository now pass. We corrected an import path in add.test.js (likely a sample test file) so that it could find the code it was testing. Additionally, a basic test for slugify.js was added to ensure that slug generation works as expected for known inputs (e.g., “Pediatric Dose” → “pediatric-dose”). The test suite is currently small but passing, providing a foundation for adding more tests.

    Legacy Browser Compatibility: We modified some parts of main.js to be ES5-friendly in case the app needs to run in older environments (like an EMS device with an old browser). Changes included avoiding modern syntax: using var instead of let/const in global scopes where hoisting might matter, avoiding arrow functions in favor of traditional function expressions, concatenating strings with + instead of template literals for error messages, and removing use of the spread operator for array copying (instead using older methods). These changes do not affect functionality but make the code more compatible with older JS engines.

    Why: Some EMS systems might use legacy browser setups. Ensuring our app runs even if ES6 isn’t fully supported broadens its usability. For example, older Android tablets running WebView might choke on => or ... syntax. Now, the code should be interpreted correctly by those engines. (While our primary target is modern Chrome/Firefox, this change doesn’t hurt and aligns with graceful degradation.)

  Patient Weight Input Improvement:

    We added a Weight field to the Patient Info sidebar to capture patient weight, which is now used in dosage calculations. Currently, it’s a single input (defaulting to kilograms). Planned Upgrade: We intend to provide two side-by-side input boxes – one for weight in kg and one for weight in lbs. These will be linked: if the user enters a value in one, the other updates automatically to the equivalent weight. Units (kg, lb) will be clearly labeled next to each field. This dual-input approach ensures convenience (many paramedics think in pounds, but drug dosages are in kg). Implementation will require adding an event on each to update the other and possibly rounding appropriately. Until this is in place, users should enter weight in kilograms (or do their own conversion).

    In the meantime, any dose that is weight-based uses the single weight input’s value (assuming kg). The UI reflects calculations as described above, but if someone mistakenly entered weight in lbs, the dosage would be off. So this upgrade is high priority to avoid any confusion.

  Contraindication Warnings:

    The app now actively checks patient info against medication contraindications and displays warning boxes in the detail pages. For example, if a patient has an allergy that matches the medication (or its class), a red-bordered box with an alert icon and message “Allergy Alert: Patient has a known allergy to this medication” will appear at the top of that detail page. If the patient’s recorded medications include a drug that is contraindicated (e.g., PDE5 inhibitors when viewing Nitroglycerin), a warning box will similarly appear (“Drug Interaction Warning: Patient is on [Drug], which contraindicates [This Treatment]”). Vital signs like blood pressure are also checked; if below a threshold, a warning appears (“Contraindication: Blood pressure too low for this treatment”).

    This system is currently implemented for a few critical scenarios (e.g., Nitro + low BP or PDE5, allergies in general, pediatric vs adult constraints). It’s a work in progress: as we expand our data (MedicationDetailsData), we will include clear contraindication keywords so the code can automatically pick them up. For now, devs might need to update updatePatientData or renderDetailPage with specific checks per medication. The groundwork is laid out and functioning for major alerts. Always test after adding a new contraindication rule: the warning should appear and be clearly worded for the end user.

Toggle Arrows for Hidden Info (Green Text Expansion):





SVG arrow icon: Ensure that the SVG arrow icon is used for current green text;  
    Spacing around these green text arrows could be tweaked to not break the flow of text, they should appear as part of the text.


## 7. CURRENT TASKS/GOALS

**This section describes the current goals and tasks that need focus only after all of the TOP PRIORITY TASKS have been completed.**

The Back and Forward Navigation buttons in the header are supported and should update the content reliably, so verify that the history mechanism doesn’t break the sequential nav and vice versa.

Patient Info Sidebar Functionality: (Goal: Ensure each field in Patient Info has a visible effect somewhere for testing. E.g., test that entering low BP triggers Nitro warning.)

    All sidebar patient data inputs (age, weight, PMH, allergies, meds, etc.) should accept input and immediately cause changes in the app: 
      inappropriate treatments get a strike-through, relevant warnings pop up, etc. For instance, entering “Penicillin” in Allergies then viewing “Penicillin” (if it were a protocol) would show an allergy warning. Or entering Age 8 and viewing an adult-only medication would give a warnings stating, "Warning! Pt is 8 years old and Rx is for adults only!" 

Medication Details Pages: Any dynamic content (green text expansions, calculation placeholders) should be functioning. (The aim is that no medication click results in a blank page or missing info – if it does, that's a bug to fix either in data or rendering.)

Settings Button: Located in the footer to allow theme customization (like changing highlight colors) is planned. A Dark Mode toggle is also on the roadmap. We want the Settings button to be noticeable, Transitions back and forth between two colors, and has a bubbly font.

Expand test coverage: As we add features, we will want to add tests for things like: “if patientData has allergy X, does renderDetailPage for medication X include the Allergy Alert element?”, or “slugList correctly identifies all section IDs on a sample page”. Going forward, every fix or feature should ideally include a corresponding test to prevent regressions. The test suite is set up and running (e.g., via npm test or similar), ready for more tests to be added.

    Write additional tests for any new bugs we fix (write the test to simulate the scenario, then fix the code until the test passes). This will build a robust test suite that guards the app’s critical functionality.

Some features that involve heavy data logic (like fully dynamic dosage recalculation for every medication, or intelligent filtering of the main list by symptoms) are still in progress.

The anchor navigation works as-is, but we consider adding a smooth scroll.


## 8. RECENT FIXES AND CHANGES

Home Button: Added a Home button (a house icon under the nav arrows) that on click will immediately return the user to the main Contents page.

Patient Info Sidebar Behavior:

  The overlay's semi-transparent background, and the “X” close button both close the Patient Info sidebar every time.

  We standardized the open/close logic by centralizing it: both main.js and PatientInfo.js use the same functions to add/remove the active and hidden classes on the sidebar and overlay. This prevents divergent behavior (earlier, two different implementations sometimes caused the overlay to remain even after the sidebar closed).

UI Layout Consistency: All UI components should be properly placed and styled on every view. This means: the header always shows the title, nav buttons, and patient info button in the correct places; the patient sidebar slides over the content without affecting layout; the content area should scroll independently when content overflows (the header and sidebar remain fixed). The overall look should match our intended design: for example, spacing around sections, font sizes, and colors should be uniform.

  Internet Explorer & Legacy Support: We adjusted the layout techniques to accommodate older browsers. Instead of using CSS Grid for the main layout (which IE11 doesn’t fully support), we use Flexbox for structuring the content area and sidebar. Flexbox is widely supported and achieves a similar result for our two-column layout. By explicitly setting height on the sidebar (and letting the content area flex), we ensure that even if the viewport recalculates, our layout remains consistent. Users on legacy systems should see a functional layout, whereas previously they might have seen a broken or partially scrolling page.
  
  The use of the 100vh unit was causing issues on some mobile WebViews and IE, so we replaced it with a fixed height (applied via JS or CSS) for the sidebar. The sidebar now explicitly takes up the full viewport height regardless of browser quirks.

  Automated Testing Status: All existing automated tests are passing, meaning the basic functions we’ve written tests for (like addition example, slug generation, etc.) behave as expected. This gives us a baseline confidence. 

  Similarly, on the main Contents page, the blue arrows already rotate as categories open/close; that was always the case, but we unified the behavior and styling so that all expandable/collapsible indicators (blue or green) use a consistent CSS transition for rotation.

Green text: Whenever there is a green clickable text that expands hidden information, a small arrow icon is shown next to it (rightward-pointing chevron). When the text is clicked and the hidden info is revealed, this arrow rotates downward, similar to the blue category arrows. This gives a visual cue that something has expanded or can be collapsed. When the text is hidden again, the arrow returns to the rightward position.

## 9. TIMELINE SUMMARY

7/16/25-App is almost far enough along to actually be useful during work, but still need to update a lot of stuff and double check all the medication info.
  
    At this time, the app should work on Chrome, Firefox, Safari, and IE11/Edge. 

## 10. FUTURE TASKS/GOALS/IDEAS

(This section collects proposed enhancements and ideas for future development. These items are not to be worked on until they are reviewed and moved into the active task list or known issues, to ensure focus on current priorities.)

  The anchor Table of Contents at the top of long pages should list all the sections present and allow jumping. Try out a long entry (like one with many sections) to confirm the anchor links scroll correctly. 

  Theming and Customization: Introduce a Settings panel (accessible from a footer button) that allows users to customize the app’s appearance. This would include a Dark Mode toggle for low-light use, and possibly color scheme choices for highlights or background (to accommodate personal preference or better visibility in sunlight vs. night). Dark Mode would invert colors to a dark background with light text, and adjust other elements (e.g., preserve red/yellow warning colors but maybe slightly desaturate to be easier on night vision). This feature improves user comfort and accessibility.

  Persistent User Data: Implement saving of patient info and user history between sessions. For example, use localStorage or similar to remember the last entered patient details so if the app is closed accidentally or the browser refreshes, the user doesn’t have to re-enter critical info. Also, preserve the History list between sessions so a medic can quickly revisit frequently accessed topics across shifts. We must design this carefully (with a clear way to “clear” the data for privacy, since patient info is sensitive).

  Enhanced Dynamic Protocol Filtering: Expand the intelligence of the main Contents list filtering. Beyond just strike-throughs, we could implement a mode where, say, entering a primary indication or choosing a protocol (e.g., “STEMI” or “Anaphylaxis”) automatically highlights or even isolates the relevant protocols (perhaps by toggling a “Relevant Only” filter). This could guide medics to the correct treatment algorithm faster. It may involve tagging topics with keywords like “chest pain” or “trauma” and then matching those to patient indications input.

  Complete Weight-Based Dosing Automation: Currently we handle some weight calculations, but we plan to automate all weight-specific dosage calculations. This includes rounding to appropriate values and even suggesting volume (mL) if concentration is known. For example, “Epinephrine 0.01 mg/kg” for a 22 kg child → “0.22 mg (0.22 mL of 1:10000 solution)”. This requires augmenting the data with concentration info and writing logic to compute volumes. It’s a complex but valuable feature that ensures accuracy.

  Smooth Scroll and Section Highlight: Improve the anchor navigation by adding smooth scrolling animation when an anchor link is clicked, rather than a jump. Also, as the user manually scrolls through a detail page, highlight the current section in the anchor menu (e.g., bold or underline the section name in the TOC when that section is at top of viewport). This gives context about where you are in the page. This feature would involve listening to scroll events and computing which section is in view – performance should be considered for longer pages.

  Additional Autocomplete Enhancements: Our current suggestion lists (for PMH, allergies, etc.) could be enhanced by learning from usage. We might implement that if a user manually enters a term that isn’t in our suggestions, we add it to a local list for next time. Or provide more sophisticated suggestions (like common misspellings or abbreviations mapping to full terms – e.g., typing “MI” could suggest “Myocardial Infarction”). These improvements can make data entry faster and more accurate.

  Multi-language Support: Consider structuring the data and UI to support multiple languages or localized content. For example, have the ability to switch the app to Spanish for use in regions where paramedics might benefit from it. This is a large task (translating all protocol content), but thinking ahead, designing the data structure to separate text from code logic can facilitate it.

  Offline Data Update Mechanism: Because protocols and medications can change with new medical guidelines, a future goal is to allow the app’s data files to be updated without manually editing code. Perhaps a simple JSON update mechanism or a small admin interface where an authorized person can input updated dosage or new protocol info which then gets saved to the data files. This would require careful design to maintain the no-backend/offline-first nature (maybe syncing when online, or providing a downloadable updated version of the app).

  Additionally, there’s a known minor glitch that after lots of expansions/collapses and scrolling, some elements (like the header or certain buttons) might appear to shift or jitter slightly – potentially due to scrollbar appearance or focus outlines. We will continue to refine the CSS to eliminate any “weird” movement and ensure smooth scrolling.

  Note: The above suggestions are for consideration and alignment with the project’s goals of speed, accuracy, and usability. They should not be implemented until they are prioritized and moved into the appropriate section (such as Top Priority or Current Tasks) after thorough planning. The focus remains on stability and correctness of the current feature set before expanding scope.

**This README is up to date as of JuLY 7TH, 2025. All instructions and documentation reflect the current and intended behavior of the Paramedic Quick Reference app.**
