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

## MCP Tooling Discipline
- Invoke the seq MCP server at the start of every task to structure the plan before making changes. If unable for any reason to invoke the seq MCP server, then the very first thing you must do is solve this issue until it is invoked. Do not move onto a task until this step is complete.
- Record task decisions and follow-up items through the memory MCP server before finishing the work.
### MCP Server Auto-Invocation Guide
- **filesystem** — Auto-run for local file reads and edits because the reference implementation is built for secure, access-controlled filesystem work; skip it for actions that touch locations outside the repo and confirm with the user instead ([modelcontextprotocol/servers README](https://github.com/modelcontextprotocol/servers?tab=readme-ov-file#model-context-protocol-servers)).
- **git** — Invoke whenever you need status, diffs, or to stage/commit so the agent uses the git-aware tooling instead of raw shell commands; avoid it when you only need to skim a single file ([cyanheads/git-mcp-server](https://github.com/cyanheads/git-mcp-server)).
- **shell** — Use only when a task truly requires running CLI programs or custom scripts, leveraging the server's allowlists and audit logging; skip it for filesystem or git tasks the dedicated servers already cover ([sonirico/mcp-shell](https://github.com/sonirico/mcp-shell)).
- **webpick** — Auto-run for scoped content grabs where CSS selectors are enough; skip it for heavy navigation or JS-heavy pages that need a headless browser ([mcp-web-content-pick README](https://github.com/kilicmu/mcp-web-content-pick)).
- **fetch** — Use when you just need a readable copy of an article, title extraction, or optional image saves; avoid it if you require Playwright-grade rendering or multi-hop crawling ([kazuph/mcp-fetch](https://github.com/kazuph/mcp-fetch)).
- **fetcher** — Reach for the Playwright-backed fetcher when pages need JavaScript execution or readability cleanup beyond simple HTTP fetches; skip it for static pages where fetch already works ([fetcher-mcp on npm](https://www.npmjs.com/package/fetcher-mcp)).
- **smart-crawler** — Auto-run only for deep or repetitive crawling jobs where Playwright automation is justified; otherwise prefer lighter fetch tools to reduce load ([mcp-smart-crawler](https://github.com/loo-y/mcp-smart-crawler)).
- **playwright** — Use for browser automation, accessibility tree snapshots, or verifying UI flows; skip it when a static fetch suffices so we do not launch full browsers unnecessarily ([microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)).
- **lighthouse** — Trigger before shipping major UI changes when you need quantified performance metrics; skip for quick content tweaks that do not affect page load ([lighthouse-mcp on npm](https://www.npmjs.com/package/lighthouse-mcp)).
- **a11y** — Run axe-based scans when layouts or interactions change, holding it back for purely backend or data edits ([a11y-mcp on npm](https://www.npmjs.com/package/a11y-mcp)).
- **vscode-mcp** - Tap VSCode's language servers for instant diagnostics, symbol lookups, and safe refactors instead of shelling out to `tsc`/`eslint`; keep it running only when the bridge extension is installed and trusted ([tjx666/vscode-mcp](https://github.com/tjx666/vscode-mcp)).
- **vscode_mcp** - Tap VSCode's language servers for instant diagnostics, symbol lookups, and safe refactors instead of shelling out to `tsc`/`eslint`; keep it running only when the bridge extension is installed and trusted (tjx666/vscode-mcp).
- **hooks-mcp** - Expose our lint, build, and test scripts via YAML-defined MCP actions so agents run vetted commands with validated arguments; update the config when workflows change ([scosman/hooks_mcp](https://github.com/scosman/hooks_mcp)).
- **figma-developer-mcp** - Pull structured layout tokens from the latest Figma frames when implementing UI screens, avoiding screenshot guesswork during design-to-code sprints ([GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP)).
- **checklist-mcp-server** - Maintain live task trees so agents stay aligned with the approved plan and record hand-offs; start it when coordinating multi-step engineering work ([radiumce/checklist-mcp-server](https://github.com/radiumce/checklist-mcp-server)).
- **Domain-specific servers** — Only start niche servers (for example n8n workflow tooling) when working directly in that ecosystem, following community guidance that these integrations shine when the agent needs embedded docs and validation ([n8n-mcp launch post](https://www.reddit.com/r/n8n/comments/1lvcwri/i_built_an_mcp_server_that_finally_enables/)).
- **agent-care** - Connect to SMART-on-FHIR sandboxes when you must audit real patient charts, vitals, or medication lists against EMR data; keep PHI local and only run it once credentials and sandbox endpoints are confirmed ([Kartha-AI/agentcare-mcp](https://github.com/Kartha-AI/agentcare-mcp)).
- **emergency-medicare-planner** - Launch when a workflow requires evaluating nearby hospitals or transport destinations (uses Google Maps Places/Directions); skip if facility selection is already decided in the protocol ([manolaz/emergency-medicare-planner-mcp-server](https://github.com/manolaz/emergency-medicare-planner-mcp-server)).
- **healthcare-mcp** - Use for authoritative drug monographs, ICD-10 lookups, and clinical trial references to cross-check protocol content; avoid it for internal Abbott-only guidance where the DOCX already rules ([Cicatriiz/healthcare-mcp-public](https://github.com/Cicatriiz/healthcare-mcp-public)).
#### Task Routines & Loop Discipline
- **Updating README.md**: Start with `checklist-mcp-server` to generate a seq plan node for the doc change, launch `vscode_mcp` for live diagnostics on Markdown anchors, run `hooks-mcp` action `docs:lint` (or equivalent) in a loop until it passes, then capture rationale via `memory` before committing.
- **Updating AGENTS.md**: Mirror README workflow but add `memory` entries that summarize new agent policies; rerun `checklist` nodes after each edit to ensure every instruction bullet is satisfied.
- **Modifying/Deleting/Adding Code**: Auto-bind `vscode_mcp` for symbol insight, `hooks-mcp` for `lint`/`test` scripts, and `git` for diff snapshots; loop through (diagnostics -> edit -> hooks action -> `memory` log) until both diagnostics and tests are clean.
- **Adding or Modifying Features**: Expand the code loop by introducing a `checklist` branch per acceptance criterion, pull relevant design tokens via `figma-developer-mcp` when UI shifts are involved, and keep iterating through the hooks test suite until all checklist items are marked done.
- **CSS Updates**: Chain `figma-developer-mcp` (fetch design values) → `vscode_mcp` diagnostics → `hooks-mcp` style lint; repeat the trio until the diff matches design tokens and lint passes.
- **JavaScript Updates**: Use the core code loop with `hooks-mcp` actions for unit/integration tests; if logic touches DOM, append `playwright` or `lighthouse` runs before closing the checklist item.
- **Researching a User Question**: Create a `checklist` scope node, then cycle through `webpick`/`fetcher`/`fetch` as needed to gather sources, summarise each pass into `memory`, and only close the checklist node once citations are recorded.
- **Following Specific Instructions**: Convert each instruction into a `checklist` task, execute via the relevant MCP loop (code/design/docs), and log completion state to `memory` before moving forward.
- **Thinking Longer on a Task**: Park a `checklist` node labelled “reflection”, use `seq` to fan out sub-questions, document insights in `memory`, and only resume execution loops after the reflection node is closed.
- **Planning**: Run `seq` for high-level structure, instantiate those nodes in `checklist`, and preload any required servers (`vscode_mcp`, `hooks-mcp`, `figma`, etc.) before implementation begins.
- **Long-Running or Looping Tasks**: Maintain an outer `checklist` node that tracks iteration count; within each pass execute (diagnostics → implementation → hooks tests → memory summary). Continue looping until the acceptance condition in the checklist is marked satisfied.
- **Other Discovered Tasks**: When research uncovers a new workflow (e.g., spec-first dev from `spec-workflow-mcp` or process automation via ActivePieces), register it under the Domain-specific section and extend the checklist sequence accordingly.


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
