# MCP Research Source Catalog

Keep this catalog current so we do not repeat blocked requests or stale references when gathering external MCP guidance.

## Primary Sources
- **GitHub REST API** – Prefer `https://api.github.com/repos/<owner>/<repo>` for metadata and `.../contents/<path>` for file listings; always pass a descriptive `User-Agent` (e.g., `CodexAgent/1.0`).
- **Raw GitHub content** – Use `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>` for README and config files. Pair with the REST API commit timestamps to confirm recency.
- **Official vendor docs** – Context7 (`https://context7.com`), Supabase MCP docs (`https://supabase.com/docs/guides/getting-started/mcp`), Microsoft Playwright MCP (`https://github.com/microsoft/playwright-mcp`).

## Community Mirrors & Fallbacks
- **r.jina.ai proxy** – Wrap the original URL (e.g., `https://r.jina.ai/https://www.reddit.com/...`) when direct fetches return 403/404. Content is served as static markdown suitable for parsing.
- **Reddit JSON API** – Append `/.json?raw_json=1` to posts shared via `/comments/<id>/...` to avoid the new UI payloads.
- **Smithery / Glama directories** – Aggregated MCP listings with short descriptions and install commands. Use for high-level confirmation, not canonical documentation.

## Automation
- Run `dev-tools/scripts/Get-McpResearchContent.ps1 <url>` to pull pages with a Codex-safe `User-Agent`. The script automatically:
  1. Retries Reddit links as JSON endpoints when possible.
  2. Falls back to `r.jina.ai` for other 403/404 responses.
  3. Accepts `-OutFile` for saving the payload and `-PassThru` to emit the content to the console.

## Maintenance Log
- **2025-10-05** – Added GitHub REST/Raw guidance, Reddit JSON fallback, and scripted fetch helper.
- Record future additions or deprecations here (date, reason, and action taken).
