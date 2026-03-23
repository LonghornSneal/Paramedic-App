# AI All Tools Set Workspace

This folder is a legacy experiment for an older VS Code AI tool-set workflow. It is not the repo's current workspace AI entrypoint.

## Features
- Retains the original `All-Tools.toolsets.jsonc` experiment for reference
- Keeps a legacy nested `.github/copilot-instructions.md` sample only for this subfolder
- Does not drive the root workspace's current VS Code agent customization

## Current repo-level setup
- Always-on repo instructions live in `../../AGENTS.md`.
- Workspace MCP servers live in `../../.vscode/mcp.json`.
- Workspace AI settings live in `../../.vscode/settings.json`.

## Usage
- Treat `All-Tools.toolsets.jsonc` as historical reference only.
- Do not assume current VS Code automatically discovers this folder's tool-set file.
- If you need current workspace AI behavior, use the root workspace files listed above.
