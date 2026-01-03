# Agent Workflow: Paramedic App

This guide shows how to use Codex skills (no MCP servers) to work in this repo.

- Search -> Plan -> Edit -> Diff -> Test -> Commit -> Push
- Memory: record decisions with memory-log
- Web: use web-fetch, webpick, and web-fetcher as needed
- Default focus: execute the active user task exactly as requested

## Session Startup

1. Trigger sequential-thinking and outline the plan.
2. Use repo-onboarding if a repo overview is needed.
3. Confirm the working directory and task scope.

## Core Skills (what to use when)

- filesystem-ops: read, write, and edit files
- git-ops: status, diff, add, commit, push
- shell-exec: run commands (npm, rg, scripts)
- test-runner: run lint, test, and build commands
- docs-updater: update README or AGENTS with conventions
- web-fetch, webpick, web-fetcher: web research and extraction
- playwright-browser: UI automation, screenshots, visual checks
- lighthouse-audit: performance and best-practices checks
- a11y-audit: accessibility checks
- vscode-diagnostics: language server diagnostics (when VSCode is available)
- hooks-runner: run repo hook actions if configured
- checklist: track multi-step work
- memory-log: record decisions and follow-ups

## Typical Loop

1. Plan: sequential-thinking + checklist
2. Inspect: filesystem-ops or repo-onboarding
3. Edit: filesystem-ops (apply_patch or scripted edits), then re-read
4. Verify: git-ops diff + test-runner
5. Document: docs-updater if docs changed
6. Log: memory-log for decisions or follow-ups
7. Finish: git-ops status and optional commit

## UI and Preview

- Use shell-exec to run npm scripts like `npm run preview` or `npm run lint`.
- Use playwright-browser to validate UI flows and capture screenshots.

## Notes

- Do not call MCP servers. Use only the listed skills.
- Avoid destructive commands unless explicitly requested.
