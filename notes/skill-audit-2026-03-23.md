## Skill Audit - 2026-03-23

### Scope

- Audited `57` installed skills.
- Created one delegated subagent review per skill, in batches because the environment allows only `6` concurrent agent threads.
- Evaluated each skill against this target: "Can this skill materially streamline a new repo coding project from idea through implementation, QA, and delivery?"

### Executive Summary

Your skill set is strong as a toolbox, but weak as a true greenfield project system.

You already have enough skills to support:

- planning and task tracking
- repo inspection and local execution
- code review and basic verification
- browser/UI QA after an app already runs
- external research and citation
- documentation maintenance

You do **not** yet have enough workflow coverage to reliably streamline the entire process of starting a fresh app repo from blank slate through disciplined delivery without adding more orchestration.

The main problem is not the number of skills. The main problem is that many skills are:

- narrow wrappers around one tool
- specialized to one domain or platform
- useful only after a repo or running app already exists
- missing hard-gated orchestration between planning, implementation, testing, QA, and security

### Strong Current Foundation

These skills are the most useful baseline pieces for a general coding workflow:

- `sequential-thinking`
- `checklist`
- `memory-log`
- `filesystem-ops`
- `shell-exec`
- `repo-onboarding`
- `issue-triage`
- `code-review-checklist`
- `test-runner`
- `git-helper`
- `git-ops`

These are good supporting skills once a UI or app surface exists:

- `playwright-browser`
- `playwright-interactive`
- `a11y-audit`
- `lighthouse-audit`
- `vscode-diagnostics`
- `docs-updater`
- `source-citation`
- `web-fetch`
- `web-fetcher`
- `workflow-web-research`
- `workflow-ui-quality`

These are useful, but too thin to be your primary dev-loop:

- `workflow-dev-loop`
- `hooks-runner`
- `security-privacy`
- `mcp-everything`
- `release-helper`

### Specialized Or Niche Skills

These are solid, but they should not be treated as default greenfield workflow skills:

- Azure/Foundry: `agents/microsoft-foundry*`, `preset`
- Healthcare/clinical: `agent-care`, `healthcare-research`, `emergency-transport-planner`, `workflow-clinical-update`
- OpenAI app/product specific: `chatgpt-apps`, `openai-docs`
- Media/assets: `imagegen`, `speech`, `sora`, `screenshot`
- Documents/artifacts: `doc`, `pdf`, `slides`, `spreadsheet`
- App/platform specific: `winui-app`, `develop-web-game`
- Web crawling extras: `firecrawl`, `smart-crawler`, `webpick`
- Meta-skills: `skill-creator`, `skill-installer`

### Current State Blockers

The skill inventory is better than the environment readiness.

Current local blockers found during the audit:

- `gh` is missing.
- `az` is missing.
- `docker` is missing.
- `OPENAI_API_KEY` is missing.
- `GH_TOKEN` and `GITHUB_TOKEN` are missing.
- `FIGMA_TOKEN` is missing.
- `FIRECRAWL_API_KEY` is missing.
- `AZURE_OPENAI_API_KEY` is missing.
- `GOOGLE_MAPS_API_KEY` is missing.
- `hooks_mcp.yaml` is missing from this repo.
- VS Code is installed, but prior validation noted the VSCode MCP bridge is not configured.
- Prior skill validation noted Lighthouse timed out.

Practical effect:

- GitHub skills are presently blocked.
- Azure/Foundry skills are presently blocked.
- Figma and Firecrawl skills are presently blocked.
- Image, speech, and Sora skills are presently blocked for live calls.
- Hooks-based standardized task execution is not wired into this repo.

### Gap Analysis Against Your Desired Workflow

You asked for a setup that can streamline:

- brainstorming with the user
- asking the user important questions
- giving professional suggestions
- creating a project outline that can be checked off
- automatic Playwright testing before and after each code update
- security
- QA
- research
- the other work needed to build an app from scratch

Current gaps:

1. No true project-intake or requirements-discovery skill.
2. No dedicated brainstorming/facilitation skill for blank-slate product exploration.
3. No generic app scaffolding skill for common repo types.
4. No architecture/ADR/spec-writing workflow for turning ideas into a build plan.
5. No enforced "before and after each code change" quality gate.
6. No generic app-security workflow beyond output redaction.
7. No CI/bootstrap workflow for setting up repo automation from scratch.
8. No dedicated API-contract or database-schema planning skill.
9. No observability/telemetry/bootstrap skill.
10. No release/deployment workflow that covers real delivery end to end.

### Most Important Workflow Weakness

`workflow-dev-loop` is the closest thing you have to a default engineering loop, but it is too light.

It currently covers:

- planning
- repo onboarding
- review
- test running
- git guidance
- docs updates

It does **not** cover:

- project scaffolding
- implementation orchestration
- environment bootstrap
- automatic pre-change baseline capture
- automatic post-change Playwright checks
- a11y/Lighthouse/security gates
- deployment or release execution

### Recommended Skills To Add Next

If your goal is a serious from-scratch app workflow, these are the highest-value additions:

1. `project-intake`
   - User questioning, requirements capture, scope boundaries, assumptions, constraints, success criteria.
2. `greenfield-planner`
   - Convert intake into milestones, acceptance criteria, task checklist, and repo plan.
3. `app-scaffold`
   - Generic repo bootstrapping for common stacks.
4. `architecture-blueprint`
   - System design, module boundaries, ADRs, data flow, API surface, folder layout.
5. `guarded-dev-loop`
   - Mandatory pre-change baseline plus post-change lint/test/Playwright/a11y gates.
6. `qa-orchestrator`
   - Broader QA coverage: smoke, edge cases, visual checks, regression notes, signoff criteria.
7. `appsec-review`
   - Threat model, secret handling, auth/session review, dependency audit, CI security checks.
8. `ci-bootstrap`
   - Create or update CI workflows for lint/test/build/Playwright and status checks.
9. `api-contract-designer`
   - REST/GraphQL/OpenAPI planning, validation, mock contracts, error models.
10. `db-schema-planner`
   - Data models, migrations, seed strategy, indexing, constraints.
11. `observability-bootstrap`
   - Logging, metrics, tracing, health checks, error reporting.

### Recommended Immediate Direction

If you want the fastest improvement with the biggest effect, build these first:

1. `project-intake`
2. `greenfield-planner`
3. `guarded-dev-loop`
4. `appsec-review`
5. `ci-bootstrap`

That combination would close the biggest gaps between "many useful skills" and "a complete startup-project workflow."

### Audit Verdict

Current state: good toolbox, incomplete system.

You have enough skills to help with many parts of app development, but not enough orchestration to reliably run the whole process from blank repo to professional delivery without adding several new workflow skills and wiring the missing environment dependencies.
