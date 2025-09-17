# Paramedic App Agent Handbook
_Last updated: 2025-03-09_

## Mission & Source of Truth
- Deliver the full Abbott EMS protocol playbook as a rapid, offline-ready reference for field clinicians.
- Treat `C:/Users/HhsJa/OneDrive/Documents/Edited entire Protocols organized.docx` (and the extracted text at `research/paramedic_protocols.txt`) as the non-negotiable source for medical content. No guidance ships without tracing back to a paragraph in that document.
- Preserve clinical accuracy, scope-of-practice boundaries, and mandated reporting obligations exactly as written. Escalate to maintainers before interpreting ambiguous language.
- Respect privacy: never record actual patient identifiers or PHI when adding examples or workflows.

## Protocol Topology & Repository Map
The DOCX is organized into five major bodies. Maintain 1:1 coverage across code, data, and content directories.

| Protocol Section | Example Topics | Repository Targets |
| --- | --- | --- |
| Section 1: EMS Operations | Start-of-shift checks, medical oversight, on-scene authority, mandatory reporting, MACC | `Content/Introduction & Core Principles`, `Content/Operational Protocols`, `Features/navigation/`, policy checklists in `Content/Administrative & Legal Essentials` |
| Skills & Equipment | Ventilator setup, i-gel, EZ-IO, push-dose epi prep | `Content/Skills & Equipment`, calculators in `Features/detail/` or `Features/patient/`, ventilator data in `Data/VentilationDetailsData.js` |
| Adult Protocols | Airway, cardiology, medical, trauma, OB, refusal workflows | `Content/Adult Protocols`, detail components in `Features/detail/`, cross-links in `ParamedicCategoriesData` |
| Pediatric Protocols | Airway, BRUE, shock, neonatal resuscitation, special needs | `Content/Pediatric Protocols`, pediatric additions to patient tools, pediatric dosing cards |
| ALS Medications | Full drug monographs, dosing, contraindications | `Data/MedicationDetailsData.js`, `Data/additionalMedications.js`, UI cards in `Content/` and patient safety warnings |

### Category Tree Alignment
- `Data/ParamedicCategoriesData.js` must mirror the structure of the DOCX table of contents. Keep section ordering, nested topics, and titles synchronized.
- Each content directory should contain one markdown/HTML asset per protocol topic. When adding a new file, ensure the slug matches the entry ID (`slugify(title)`).
- Update `slugAnchors.js` and `slugList.js` whenever a new section or anchor is introduced so navigation and deep links stay correct.

## Authoring & Update Workflow
1. **Read the source**: Before modifying content, locate the relevant paragraphs in the DOCX or `research/paramedic_protocols.txt`. Capture copy block references (e.g., "Section 1: EMS > ALS Ground Rules").
2. **Plan the change**: Outline affected files (`Data/*.js`, `Content/*`, UI features) and note clinical dependencies (e.g., RASS scale, MACC workflow, mandatory reporting numbers).
3. **Implement**:
   - Textual updates: reflect the protocol verbatim, only adjusting for readability (headings, tables). Preserve dosage numbers, callouts, and caution language.
   - Data modules: verify IDs are unique, sorted, and cross-referenced. Include metadata such as indications, contraindications, dosing ranges, and links back to content files.
   - Feature logic: keep behaviour declarative. Calculators (ventilation ratios, dosing, rule of 9s) must show formulae that match the protocol text.
4. **Document**: Annotate `README.md` per repository rules (double-asterisk bracket convention) with summary, rationale, and source location.
5. **Review**: Run lint/tests, then perform manual QA focusing on the affected protocol workflows.

## Clinical Safeguards & Escalation
- **Scope adherence**: If a protocol references restrictions (e.g., EMT-B vs EMT-P actions, physician consult triggers), ensure UI labels and decision aids reflect those limits.
- **Mandatory reporting**: Keep hotline numbers and reporting steps accurate. When numbers change, update contact cards across all surfaces and add regression tests if possible.
- **Medication Administration Cross Check (MACC)**: Reinforce double-check steps in UI flows. Any automation around dosing must still surface MACC prompts.
- **Restraint & sedation content**: Highlight safety notes (no prone restraints, ketamine monitoring, RASS scale) prominently. Validate that warnings propagate to patient snapshot summaries where relevant.
- **Air medical criteria**: If calculators or decision trees reference air transport, match the conditions listed in the protocol (time thresholds, no-go criteria).
- **Legal/administrative content**: Keep HIPAA, PCR requirements, and incident reporting workflows intact. When altering guidance, notify maintainers for legal review.

## Data Modeling Guidelines
- Each medication entry (`MedicationDetailsData.js`, `additionalMedications.js`) must include: common name, concentration, adult dosing, pediatric dosing, contraindications, adverse effects, MACC cues, and crosslinks to protocol sections.
- Ventilation and airway tools should expose parameters from the skills section (e.g., ParaPAC settings, CPAP/BiPAP tables). Store reference ranges in `Data/VentilationDetailsData.js` with units and notes.
- Patient tools (`Features/patient/`) should encapsulate quick-reference values (BGL thresholds, shock index formulas, stroke scale criteria). Track the exact paragraph source in code comments when logic is derived.
- Maintain ASCII encoding; replace special punctuation with ASCII equivalents when importing protocol text.

## Testing & Verification
| Command | Purpose |
| --- | --- |
| `npm install` | Install linting, testing, and preview tools. |
| `npm run lint` | Enforce CSS/HTML/JS standards and accessibility hints. |
| `npm run preview` | Launch static preview for manual walkthroughs of protocol pages. |
| `npm run test` | Run Playwright ventilation spec. Extend to cover new calculators or flows. |
| `npm run scan:deps` / `scan:dead` | Ensure file tree hygiene as the protocol footprint grows. |

### Manual QA Script
- Navigation: Confirm every TOC entry from the DOCX appears in the app navigation and routes to populated content.
- Adult protocols: Validate airway, cardiology, medical, trauma, and OB/GYN sections show accurate algorithms, warning boxes, and consult triggers.
- Pediatric protocols: Check dosing adjustments, neonatal resuscitation steps, and STARS guidance. Verify pediatric vitals tables load and search exposes new terms.
- Skills: Walk through ventilator setup, EZ-IO, i-gel, and push-dose epi prep instructions. Ensure any calculators reflect the math in the source document.
- Medications: Compare each drug card against the ALS medication monographs, including concentration units and infusion rates.
- Safety content: Confirm mandatory reporting numbers, MACC procedure, RASS scale, and crime-scene precautions are visible and correctly formatted.

## Change Log & Collaboration
- Record all protocol updates in README Chapter 6 (current tasks) with date, source section, and files touched. Planned future imports belong in Chapter 10.
- Use the planning tool for anything beyond typo fixes; include notes about which DOCX sections were consulted.
- Open questions or policy clarifications should be escalated to maintainers or the medical oversight contact before implementation.

## Reference Assets
- `research/paramedic_protocols.txt` - extracted ASCII copy of the DOCX for quick grep access. Refresh it when the DOCX changes.
- `research/agents_samples.json` - external AGENTS.md references (keep for inspiration; do not treat as clinical sources).
- `research/agents_outline.md` - evolving outline for handbook improvements.
- `dev-tools/tests/ventilation.spec.js` - baseline automated validation; expand with additional protocol-critical tests as coverage grows.

Stay disciplined: every update must tie back to the authoritative protocol while preserving the app's reliability for crews who rely on it in the field.
