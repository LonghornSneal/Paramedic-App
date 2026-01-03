
# Paramedic App Agent Handbook
_Last updated: 2025-10-05_
## Mission & Source of Truth
- Build and refine the Paramedic App exactly as the user specifies. The active user request is always your current focus.
- Only touch protocol text or content assets when the user explicitly assigns that work. When assigned, use `C:/Users/HhsJa/OneDrive/Documents/Edited entire Protocols organized.docx` and as the primary sources, and cite any external references with direct hyperlinks that align with the user's material.
- Escalate to user before interpreting ambiguous language.

## Task Scope & Priorities
- Follow the user's current instructions as the authoritative task list. Never self-assign protocol content edits or redirect towards content unless the user explicitly requests it.
- Use the protocol documents to validate behavior or content only when the user tasks you with that area, keeping their wording, structure, and future plans intact unless they direct otherwise.
- Escalate when a requirement might change clinical guidance so the user can approve or redirect before any edits land.

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
- `Data/ParamedicCategoriesData.js` will be similar in structure of the DOCX table of contents (section ordering, nested topics, and titles).
- Each content directory should contain one markdown/HTML asset per protocol topic. When adding a new file, ensure the slug matches the entry ID (`slugify(title)`).
- Update `slugAnchors.js` and `slugList.js` whenever a new section or anchor is introduced so navigation and deep links stay correct.

## Authoring & Update Workflow\r\n_Use this workflow only when the user assigns protocol or content edits._\r\n1. **Read the source**: Before modifying content, locate the relevant paragraphs in the DOCX or `research/paramedic_protocols.txt`. Capture copy block references (e.g., "Section 1: EMS > ALS Ground Rules").
2. **Plan the change**: Outline affected files (`Data/*.js`, `Content/*`, UI features) and note clinical dependencies (e.g., RASS scale, MACC workflow, mandatory reporting numbers).
3. **Implement**:
   - Data modules: verify IDs are unique, sorted, and cross-referenced. Include metadata such as indications, contraindications, dosing ranges, and links back to content files.
   - Feature logic: keep behavior declarative. Calculators (ventilation ratios, dosing, rule of 9s) must show formulae that match the protocol text.
4. **Document**: Annotate `README.md` per repository rules (double-asterisk bracket convention) with summary, rationale, and source location.
5. **Review**: Run lint/tests, then perform manual QA focusing on the affected protocol workflows.

## Code Review & Maintenance Discipline
- **General checks**
  - Reference code by file path with 1-based line numbers (for example `Features/detail/DetailPage.js:42`).
  - Track questionable assets (duplicate snippets, unused modules, large images) in the task summary before removal so the user can confirm.
  - Verify the target file is the canonical home for the logic; note any relocation proposals and the dependent modules they affect.
- **JavaScript / JSX**
  - Use `rg`/`git grep` to locate identical blocks before deleting; only remove duplicates that match byte-for-byte and are unused in routing, exports, or tests.
  - When finding unused exports, confirm whether README.md or roadmap sections promise future use; if yes, annotate the reference instead of deleting.
  - Highlight mismatched module intent (e.g., UI helpers living in data folders) and suggest the correct directory in the response.
- **HTML / Markup**
  - Cull screenshots or images that do not appear in rendered pages or documentation; cross-check for alt text references before removal.
  - Ensure anchor IDs sync with `Features/anchorNav/*`; record any missing slug updates that need follow-up.
  - Validate semantic structure (landmarks, heading hierarchy) and note any regressions introduced by edits.
- **CSS**
  - Remove duplicate rule sets only when selectors and declarations match exactly and no media queries diverge.
  - Flag orphaned utility classes and confirm they are not toggled dynamically in JS before deprecating.
  - Check that variables and mixins reside in the designated theme files; list migrations needed if they do not.
- **Markdown / README**
  - Follow the double-asterisk bracket convention already defined in README.md; log every change in Chapter 6.
  - When spotting outdated guidance, confirm whether a newer instruction exists elsewhere before editing; otherwise, create a TODO entry for user review.
  - Surface any tooling discrepancies (scripts, commands) so the user can reconcile docs and package scripts.
## Sequential Thinking Skill Playbook
1. **Scoping Thought** - List every user question/task, call out the files/features involved, and any ambiguities to escalate. Set an initial `totalThoughts` that covers the required structure (scoping + per question + research + QA) and adjust during execution.
2. **Per-Question Thoughts** - Dedicate one thought to each user question or subtask. Capture acceptance criteria, dependencies, and checklist items. Branch with `branchFromThought`/`branchId` if the work diverges, and mark revisions with `isRevision`.
3. **Execution Planning Thoughts** - Before editing or running tools, outline the steps, matching files, and tool actions (filesystem/git/hooks/playwright). Flag rollback plans, and memory updates.
4. **Research Thoughts (coding-focused)** - When research is necessary, name the coding sources to pull (repo docs, design specs, GitHub threads, vetted forums) and confirm freshness. Only cite external sources when they materially improve implementation accuracy and never contradict the protocol DOCX.
5. **Dynamic Adjustment Thoughts** - Emit a new thought when scope changes. Update `totalThoughts` and use `needsMoreThoughts` if you overrun the original estimate so the history stays auditable.
6. **QA/Test Thought** - Second to last. Review existing automated/manual coverage, decide whether new tests or lint checks are needed, schedule exact commands, and record follow-ups for any failures (CSS, JS, data, or doc regressions).

## Research Utilities & Fallbacks
- Run `dev-tools/scripts/Get-McpResearchContent.ps1 <url>` to fetch web content with a Codex-friendly user agent and automatic fallbacks (Reddit share URLs resolve to JSON; other 403/404 responses fall back to `r.jina.ai`). Use `-OutFile` to store the response for later parsing.
- The curated source catalog at `research/mcp_source_catalog.md` tracks reliable MCP-friendly endpoints (GitHub API, raw GitHub, proxy mirrors) and recording cadence. Update it when new dependable sources or failure modes are discovered.
- Prefer GitHub API + raw content for code/documentation research before falling back to community mirrors; always reconcile findings with the Abbott protocol DOCX before shipping changes.
## Skill Tooling Discipline
- Use the sequential-thinking skill at the start of every task to structure the plan before making changes.
- Record task decisions and follow-up items through the memory-log skill before finishing the work.

### Skill Auto-Invocation Guide
- **filesystem-ops** - Use for local file reads, edits, and directory listing; confirm before touching paths outside the repo.
- **git-ops** - Use for status, diffs, staging, and commits instead of raw git commands when reporting results.
- **shell-exec** - Use when command execution is required and capture output carefully.
- **webpick** - Use for scoped content grabs where selectors are enough.
- **web-fetch** - Use for simple HTTP fetches and readable page copies.
- **web-fetcher** - Use when JavaScript rendering is required.
- **smart-crawler** - Use for deep or repetitive crawling jobs; keep scope tight.
- **playwright-browser** - Use for browser automation, snapshots, and UI flow checks.
- **lighthouse-audit** - Use for performance and best-practices audits on UI changes.
- **a11y-audit** - Use for accessibility scans when layouts or interactions change.
- **vscode-diagnostics** - Use for language server diagnostics and symbol lookups when VSCode is available.
- **hooks-runner** - Use to run vetted lint/test/build hooks defined by repo configuration.
- **figma-tokens** - Use to retrieve design tokens when UI work references Figma.
- **checklist** - Use to track multi-step work and acceptance criteria.
- **agent-care** - Use when auditing SMART-on-FHIR sandbox data with approved credentials.
- **emergency-transport-planner** - Use when evaluating transport destinations and ETAs.
- **healthcare-research** - Use for authoritative clinical references and cross-checks.
- **domain-specific skills** - Use only when the task explicitly calls for a niche workflow.

#### Task Routines & Loop Discipline
- **Updating README.md**: Start with checklist to track tasks, use vscode-diagnostics for anchor checks, run hooks-runner action docs_lint (or equivalent) in a loop until it passes, then capture rationale via memory-log before committing.
- **Updating AGENTS.md**: Mirror README workflow but add memory-log entries that summarize new agent policies; rerun checklist nodes after each edit to ensure every instruction bullet is satisfied.
- **Modifying/Deleting/Adding Code**: Use vscode-diagnostics for symbol insight, hooks-runner for lint and test scripts, and git-ops for diff snapshots; loop through diagnostics to edits to hooks until clean, then log decisions in memory-log.
- **Adding or Modifying Features**: Expand the code loop by introducing a checklist branch per acceptance criterion, pull relevant design tokens via figma-tokens when UI shifts are involved, and iterate hooks-runner tests until all checklist items are marked done.
- **CSS Updates**: Chain figma-tokens to vscode-diagnostics to hooks-runner style lint; repeat until the diff matches tokens and lint passes.
- **JavaScript Updates**: Use the core code loop with hooks-runner actions for unit and integration tests; if logic touches DOM, append playwright-browser or lighthouse-audit runs before closing the checklist item.
- **Researching a User Question**: Create a checklist scope node, then cycle through webpick, web-fetcher, and web-fetch as needed to gather sources, summarize each pass into memory-log, and only close the checklist node once citations are recorded.
- **Following Specific Instructions**: Convert each instruction into a checklist task, execute via the relevant skill loop (code, design, and docs), and log completion state to memory-log before moving forward.
- **Thinking Longer on a Task**: Park a checklist node labeled "reflection", use sequential-thinking to fan out sub-questions, document insights in memory-log, and only resume execution loops after the reflection node is closed.
- **Planning**: Run sequential-thinking for high-level structure, instantiate those nodes in checklist, and use skills only (no MCP servers).
- **Long-Running or Looping Tasks**: Maintain an outer checklist node that tracks iteration count; within each pass execute (diagnostics to implementation to hooks tests to memory-log summary). Continue looping until the acceptance condition in the checklist is marked satisfied.
- **Other Discovered Tasks**: When research uncovers a new workflow, register it under the Domain-specific section and extend the checklist sequence accordingly.

## Clinical Safeguards & Escalation (this section will require updating eventually)
- **Scope adherence**: If a protocol in the app references restrictions, ensure UI labels and decision aids reflect those limits.
- **Mandatory reporting**: Keep hotline numbers and reporting steps accurate. When numbers change, update contact cards across all surfaces and add regression tests if possible. Research for updates in this field once a month. Record that the monthly search was performed so that this is only researched once a month.
- **Restraint & sedation content**: Highlight safety notes (no prone restraints, Ketamine monitoring, RASS scale) prominently. Validate that warnings propagate to patient snapshot summaries where relevant.
- **Air medical criteria**: If calculators or decision trees reference air transport, match the conditions listed in the protocol (time thresholds, no-go criteria).
- **Legal/administrative content**: Keep HIPAA, PCR requirements, and incident reporting workflows intact. When altering guidance, notify user for legal review.

## Data Modeling Guidelines
- Each medication entry (`MedicationDetailsData.js`, `additionalMedications.js`) must include: common name, concentration, adult dosing, pediatric dosing, contraindications, & adverse effects.
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
| Dependency and dead code scans | Ensure file tree hygiene as the protocol footprint grows. |

### Manual QA Script
- Navigation: Confirm every TOC entry from the DOCX appears in the app navigation and routes to populated content.
- Adult protocols: Validate airway, cardiology, medical, trauma, and OB/GYN sections show accurate algorithms, warning boxes, and consult triggers.
- Pediatric protocols: Check dosing adjustments, neonatal resuscitation steps, and STARS guidance. Verify pediatric vitals tables load and search exposes new terms.
- Skills: Walk through ventilator setup, EZ-IO, i-gel, and push-dose epi prep instructions. Ensure any calculators reflect the math in the source document.
- Medications: Compare each drug card against the ALS medication monographs, including concentration units and infusion rates.
- Safety content: Confirm mandatory reporting numbers, RASS scale, and crime-scene precautions are visible and correctly formatted.

## Change Log & Collaboration
- Record all protocol updates in README Chapter 6 (current tasks) with date, source section, and files touched. Planned future imports belong in Chapter 10.
- Use the planning tool for anything beyond typo fixes; include notes about which DOCX sections were consulted.
- Open questions or policy clarifications should be escalated to user before implementation.

## Reference Assets
- `research/paramedic_protocols.txt` - extracted ASCII copy of the DOCX for quick grep access.
- `research/agents_samples.json` - external AGENTS.md references (keep for inspiration; do not treat as clinical sources).
- `research/agents_outline.md` - evolving outline for handbook improvements.
- `dev-tools/tests/ventilation.spec.js` - baseline automated validation; expand with additional protocol-critical tests as coverage grows.





