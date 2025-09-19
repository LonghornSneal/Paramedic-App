# Agent Workflow: Paramedic App

This guide shows how to use Codex + MCP servers to code in this repo efficiently.

- Search → Plan → Edit → Diff → Test → Commit → Push
- Memory: persist key decisions when useful
- Web: fetch docs/snippets structurally when needed

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
  - `git_status` → see staged/unstaged changes
  - `git_diff` → view diffs
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
  - `browser_navigate` to `file:///C:/Users/HhsJa/OneDrive/Documents/GitHub/Paramedic-App/index.html` or `http://localhost:5173/`
  - `browser_resize` (e.g., 390x844 for mobile preview)
  - `browser_take_screenshot` (full page or after `browser_snapshot` select elements)
  - `browser_evaluate` to read `getComputedStyle(...)` for selectors

- CSS generation/resizing: `filesystem` + `shell`
  - Add rules: use `filesystem.edit_file` or `filesystem.write_file` to append to `styles.css`
  - Verify: `playwright.browser_evaluate` to compare computed styles to expected values

- “Did it actually get done?” checks: `playwright`
  - Use `browser_navigate` + `browser_wait_for { text }` + `browser_take_screenshot`
  - For strict checks, `browser_evaluate` assertions (e.g., find element and compare text/location)

- Outdated/dead code scan: `shell`
  - `execute.command` with `npm run scan:dead` (Knip) and `npm run scan:deps` (depcheck)

- Explore other apps for ideas: `playwright` + `webpick`
  - `playwright.browser_navigate` to the target URL, take screenshots, inspect DOM
  - `webpick.web-content-pick` to extract headings/links/images/tables as structured data

- Local preview you can test: `shell`
  - `execute.command` → `npm run preview` (serves at `http://localhost:5173`)
  - Then drive it with `playwright` tools.

- Search for issues: `shell` (aggregated linters)
  - Run `npm run lint` to check CSS, HTML, JS, and web best practices

- Math “show your work” popup verification: `playwright`
  - Navigate to page; trigger the calculator flow (click/fill)
  - `browser_wait_for` to see the popup text
  - `browser_evaluate` to assert that the popup contains all steps and that the final answer appears in the target selector

