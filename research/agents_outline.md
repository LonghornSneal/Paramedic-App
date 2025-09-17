# AGENTS.md Structure Draft

## Section Ideas
- Mission & scope tailored to Paramedic Quick Reference app (offline-ready, fast triage support).
- Product context & personas (field medics, training mode).
- Current architecture overview (vanilla JS modules, data directories, navigation components).
- Feature inventory with owners (list view, detail view, patient snapshot, search, anchor nav).
- Runtime environment & tooling (index.html static site, bundler none, serve via dev server).
- Workflow expectations for agents (read README chapters, use plan tool, follow branching).
- Coding conventions (modular ES modules, data-driven updates, slug utilities, CSS).
- Testing & validation (manual QA checklist, linting, performance).
- Data governance & safety (medical accuracy, references, disclaimers).
- Release/readiness checks (accessibility, mobile responsiveness, offline caching roadmap).
- Communication & escalation guidelines.
- Backlog linkages (connect with README chapters tasks).

## Patterns Observed in Reference AGENTS.md Files
- Most include explicit workflow rules (small commits, review process).
- Tables or bullet lists of commands/tests are common.
- Strong emphasis on testing & validation (11/25 mention).
- Inclusion of decision principles (quality, safety) and assumption tracking.
- Some include triggers for specialized instructions.
- Many provide environment setup, lint/test commands, and release checklists.

## Adaptation Notes
- Highlight patient safety & data accuracy as "non-negotiables" (from safety/quality patterns).
- Provide quick command references (npm scripts, static server).
- Add checklist for verifying calculations, units, dosing.
- Define escalation path when unsure about medical content.
- Encourage creation/update of `README.md` per repository rule.
- Align terminology with Paramedic-specific features (MedicationDetailsData, VentilationDetailsData).

## Proposed Document Skeleton
1. Title & version info
2. Mission & Non-Negotiables
   - Purpose statement, primary users, medical accuracy rules.
   - Non-goals & escalation (consult SMEs).
3. System Snapshot
   - Architecture overview (static site, modular JS).
   - File map for Data, Features, Utils, styles.
   - External dependencies / scripts.
4. Workflow Expectations for Agents
   - Reading order (README chapters).
   - Planning requirements & commit discipline.
   - Branching & PR patterns (align with README).
5. Coding Standards
   - JS module patterns, data modelling, slug usage.
   - CSS structure & responsive practices.
   - Accessibility requirements.
6. Testing & Verification
   - npm scripts (lint, test, preview).
   - Manual QA checklist (navigation, search, patient snapshot).
   - Data validation steps (units, calculations).
7. Content Governance
   - Source verification, change logs, disclaimers.
   - How to add new medications/protocols.
8. Release Readiness
   - Pre-launch checklist (lint/test, README updates, accessibility).
9. Tooling & References
   - CLI commands, recommended extensions, key docs.
10. Appendices
   - Glossary (HNR, CPAP, etc).
   - Links to tasks/backlog.
