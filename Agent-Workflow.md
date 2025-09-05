# Agent Workflow: Paramedic App

This guide shows how to use Codex + MCP servers to code in this repo efficiently.

- Search → Plan → Edit → Diff → Test → Commit → Push
- Memory: persist key decisions when useful
- Web: fetch docs/snippets structurally when needed

## Quick Start

1) Start Inspector (UI)
- Double-click `dev-tools/start-inspector.cmd` (Filesystem)
- Or use `start-inspector-git.cmd`, `-webpick.cmd`, etc.

2) In Codex CLI
- Just run `codex` from this repo folder to start a session
- Codex is configured to use all MCP servers in `~/.codex/config.toml`

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

## Memory server
- In Inspector (or via Codex), use:
  - `create_entities` / `add_observations` to persist decisions
  - Example entity name: "ParamedicApp:UI-Nav-Design"
  - Note: current setup is in-memory for the server lifetime; re-run loses graph

## Best Practices
- At session start: call `git_set_working_dir`
- Use `search_files` (filesystem server) to locate code quickly
- Use `edit_file` to make scoped changes; then `git_diff` to verify
- Commit granular changes with clear messages
- For docs, use Web Picker to bring in structured snippets
- Write down significant decisions to Memory (entity+observations)

