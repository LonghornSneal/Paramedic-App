# Agent Workflow: Paramedic App

This guide shows how to use Codex + MCP servers to code in this repo efficiently.

- Search -> Plan -> Edit -> Diff -> Test -> Commit -> Push
- Memory: persist key decisions when useful
- Web: fetch docs/snippets structurally when needed
- Default focus: execute the active user task exactly as requested. Do not volunteer protocol content changes unless the user explicitly assigns them; treat the user as the final authority on wording.


## Session Startup Protocol

1. **Launch Inspector with seq enabled**  
   - Run `dev-tools\\start-inspector-seq.cmd` from the repo root. This opens the Inspector UI and starts the seq MCP server alongside the other default servers.
2. **Confirm Inspector connection**  
   - As soon as the browser window opens, click the **Connect** button. Keep the browser tab and the shell window open; closing either stops the servers.
3. **Codex session handshake**  
   - In every new chat, the agent must immediately run `dev-tools\\start-inspector-seq.cmd`, wait for the Inspector to finish launching, and then say:  
     let me know when you have pressed "Connect" and I will begin working on the current task or tasks.  
   - Begin work only after the user confirms they clicked **Connect**.
4. **Sequential thinking discipline**  
   - Invoke the sequentialthinking tool with at least five thoughts for every task, prompt, and response. Increase the total if the work is complex or if any prior attempt needs correction (add one or more extra thoughts for each rework cycle). Use the `needsMoreThoughts` flag when extending a plan beyond the original estimate. The seq MCP server must be invoked for every task, prompt, and response without exception.
   - Make sure the thought plan mirrors the user's explicit request; ask before altering protocol content if it was not part of the assignment.
   - Import the helper module once per session: `Import-Module (Resolve-Path 'dev-tools/modules/Invoke-SeqThought/Invoke-SeqThought.psd1')`.
   - Run `dev-tools/scripts/Enable-SeqThoughtAutoLoad.ps1` once to append the modules directory to `$PROFILE` and keep `Invoke-SeqThought` available in future PowerShell sessions.
   - Call `Invoke-SeqThought -Thought "..." -ThoughtNumber 1 -TotalThoughts 6 -NextThoughtNeeded $true` and add optional flags (`IsRevision`, `RevisesThought`, `BranchFromThought`, `BranchId`, `NeedsMoreThoughts`) as needed.

6. **MCP-driven validation**  
   - Before delivering a final response, run the relevant lint/tests through MCP (shell_execute_command, hooks, playwright, etc.) so that feature changes are proven to work in the app.

Document any workflow adjustments here so future sessions inherit the same startup behavior.

## Quick Start

0) Health check
- Run `npm run mcp:health` from the repo root. Fix any failures (missing packages, `.bin` shims, or env vars) before you launch Codex.
- Restart Codex after installing dependencies or changing environment variables so the new MCP binaries are picked up.

1) Start Inspector (UI)
- Double-click `dev-tools/start-inspector.cmd` (Filesystem)
- Or use `start-inspector-git.cmd`, `-webpick.cmd`, etc.
- New: `start-inspector-playwright.cmd` (browser tools), `start-inspector-shell.cmd` (run commands), or `start-inspector-all.cmd` (UI only, pick any server)

2) In Codex CLI
- Run `codex` from this repo folder to start a session.
- When the session banner shows each server as connected, call `filesystem.read_text_file` (or `list_directory`) and `git_status` via the MCP git server to confirm routing.
- If a server refuses to connect, rerun the health check, address the issue, and restart Codex before proceeding.

## Git tools (via MCP git server)
- First set working directory (per session):
  - Tool: `git_set_working_dir`
  - Arg `path`: `C:\Users\HhsJa\OneDrive\Documents\GitHub\Paramedic-App`
- Then status/diff:
  - `git_status` -> see staged/unstaged changes
  - `git_diff` -> view diffs
- Commit & push:
  - `git_add` with `files: "."`
  - `git_commit` with `message: "feat: ..."`
  - `git_push` (configure remote first if needed)

## Filesystem server
- Use to read/write/edit files from the agent
- Prefer `edit_file` for surgical line edits (atomic & reversible)

## Web tools
- Web Picker (`webpick`): `web-content-pick` to extract structured HTML content
- Fetch (`fetch`/`fetcher`): simple HTTP fetch or Playwright-based fetcher
- Playwright (`playwright`): full browser automation: navigate, click, type, resize window, take screenshots, evaluate JS
  - Good for: visualizing CSS changes, element screenshots, verifying UI flows, exploring other sites
  - First-time: run tool `browser_install` if prompted to download browsers

## Memory server
- In Inspector (or via Codex), use:
  - `create_entities` / `add_observations` to persist decisions
  - Example entity name: "ParamedicApp:UI-Nav-Design"
  - Note: current setup is in-memory for the server lifetime; re-run loses graph

## Best Practices

- Run `npm run mcp:health` again if any MCP server fails to connect; fix the root cause and restart Codex before continuing work.
- Keep diffs, commits, edits, and searches inside MCP (`filesystem`, `git`, `shell.execute.command`) and fall back to direct shell only while restoring service.
- At session start: call `git_set_working_dir`
- Use `search_files` (filesystem server) to locate code quickly
- Use `edit_file` to make scoped changes; then `git_diff` to verify
- Commit granular changes with clear messages
- For docs, use Web Picker to bring in structured snippets
- Write down significant decisions to Memory (entity+observations)

## New MCP Tools (what to use when)

- CSS visualize: `playwright`
  - `playwright_browser_navigate` to `file:///C:/Users/HhsJa/OneDrive/Documents/GitHub/Paramedic-App/index.html` or `http://localhost:5173/`
  - `playwright_browser_resize` (e.g., 390x844 for mobile preview)
  - `playwright_browser_take_screenshot` (full page or after `playwright_browser_snapshot` select elements)
  - `playwright_browser_evaluate` to read `getComputedStyle(...)` for selectors

- CSS generation/resizing: `filesystem` + `shell`
  - Add rules: use `filesystem_edit_file` or `filesystem_write_file` to append to `styles.css`
  - Verify: `playwright_browser_evaluate` to compare computed styles to expected values

- "Did it actually get done?" checks: `playwright`
  - Use `playwright_browser_navigate` + `playwright_browser_wait_for { text }` + `playwright_browser_take_screenshot`
  - For strict checks, `playwright_browser_evaluate` assertions (e.g., find element and compare text/location)

- Outdated/dead code scan: `shell`
  - `shell_execute_command` with `npm run scan:dead` (Knip) and `npm run scan:deps` (depcheck)

- Explore other apps for ideas: `playwright` + `webpick`
  - `playwright_browser_navigate` to the target URL, take screenshots, inspect DOM
  - `webpick_web-content-pick` to extract headings/links/images/tables as structured data

- Local preview you can test: `shell`
  - `shell_execute_command` -> `npm run preview` (serves at `http://localhost:5173`)
  - Then drive it with `playwright` tools.

- Search for issues: `shell` (aggregated linters)
  - Run `npm run lint` to check CSS, HTML, JS, and web best practices

- Math "show your work" popup verification: `playwright`
  - Navigate to page; trigger the calculator flow (click/fill)
  - `playwright_browser_wait_for` to see the popup text
  - `playwright_browser_evaluate` to assert that the popup contains all steps and that the final answer appears in the target selector
