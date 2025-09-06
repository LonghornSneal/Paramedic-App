#!/usr/bin/env node
// ESM version of local MCP server
import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";

let _playwright;
async function pw() {
  if (!_playwright) {
    _playwright = await import("playwright");
  }
  return _playwright;
}

const repoRoot = path.resolve(process.cwd());
const defaultIndex = path.join(repoRoot, "index.html");
const defaultCss = path.join(repoRoot, "styles.css");
let previewProc = null;

const server = new Server({ name: "local-dev-tools", version: "0.1.0" });

server.tool(
  {
    name: "start_preview",
    description: "Start a simple static HTTP server for the app and return the URL.",
    inputSchema: {
      type: "object",
      properties: {
        port: { type: "number", description: "Port to listen on", default: 5173 },
        dir: { type: "string", description: "Directory to serve", default: repoRoot },
      },
    },
  },
  async ({ port = 5173, dir = repoRoot }) => {
    if (previewProc && !previewProc.killed) {
      return { url: `http://localhost:${port}`, note: "Preview already running" };
    }
    const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
    previewProc = spawn(cmd, ["http-server", dir, "-p", String(port), "-c-1"], {
      stdio: "ignore",
      shell: false,
      env: process.env,
    });
    return { url: `http://localhost:${port}` };
  }
);

server.tool(
  {
    name: "stop_preview",
    description: "Stop the preview HTTP server if running.",
    inputSchema: { type: "object", properties: {} },
  },
  async () => {
    if (previewProc && !previewProc.killed) {
      previewProc.kill();
      previewProc = null;
      return { stopped: true };
    }
    return { stopped: false };
  }
);

server.tool(
  {
    name: "element_screenshot",
    description: "Open a page (local path or URL) and capture a screenshot of the page or element.",
    inputSchema: {
      type: "object",
      properties: {
        target: { type: "string", description: "URL or local file path", default: defaultIndex },
        selector: { type: "string", description: "CSS selector for element (optional)" },
        fullPage: { type: "boolean", description: "Full page screenshot if no selector", default: true },
      },
      required: ["target"],
    },
  },
  async ({ target, selector, fullPage = true }) => {
    const { chromium } = await pw();
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      const url = target.match(/^https?:/)
        ? target
        : `file://${path.resolve(target)}`;
      await page.goto(url);
      let buf;
      if (selector) {
        const loc = page.locator(selector).first();
        await loc.waitFor({ state: "visible", timeout: 5000 });
        buf = await loc.screenshot({ type: "png" });
      } else {
        buf = await page.screenshot({ type: "png", fullPage });
      }
      return { base64: Buffer.from(buf).toString("base64") };
    } finally {
      await browser.close();
    }
  }
);

server.tool(
  {
    name: "computed_styles",
    description: "Get computed CSS styles for a selector on a given page (URL or local).",
    inputSchema: {
      type: "object",
      properties: {
        target: { type: "string", default: defaultIndex },
        selector: { type: "string" },
        properties: { type: "array", items: { type: "string" }, description: "Optional list of CSS properties to return" },
      },
      required: ["selector"],
    },
  },
  async ({ target = defaultIndex, selector, properties }) => {
    const { chromium } = await pw();
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      const url = target.match(/^https?:/)
        ? target
        : `file://${path.resolve(target)}`;
      await page.goto(url);
      await page.waitForSelector(selector, { state: "attached", timeout: 5000 });
      const styles = await page.$eval(selector, (el) => {
        const cs = window.getComputedStyle(el);
        const out = {};
        for (const k of Array.from(cs)) {
          out[k] = cs.getPropertyValue(k);
        }
        return out;
      });
      if (properties && properties.length) {
        const filtered = {};
        for (const p of properties) filtered[p] = styles[p];
        return { styles: filtered };
      }
      return { styles };
    } finally {
      await browser.close();
    }
  }
);

server.tool(
  {
    name: "verify_dom",
    description: "Verify DOM conditions: text presence, visibility, and optional computed style equals.",
    inputSchema: {
      type: "object",
      properties: {
        target: { type: "string", default: defaultIndex },
        assertions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              selector: { type: "string" },
              textContains: { type: "string" },
              visible: { type: "boolean", default: true },
              styleEquals: { type: "object", additionalProperties: { type: "string" }, description: "Map of CSS property -> expected value" },
            },
            required: ["selector"],
          },
        },
      },
      required: ["assertions"],
    },
  },
  async ({ target = defaultIndex, assertions }) => {
    const { chromium } = await pw();
    const browser = await chromium.launch();
    const results = [];
    try {
      const page = await browser.newPage();
      const url = target.match(/^https?:/)
        ? target
        : `file://${path.resolve(target)}`;
      await page.goto(url);
      for (const a of assertions) {
        let pass = true;
        let details = [];
        try {
          const loc = page.locator(a.selector).first();
          await loc.waitFor({ state: "attached", timeout: 5000 });
          if (a.visible) {
            await loc.waitFor({ state: "visible", timeout: 5000 });
          }
          if (a.textContains) {
            const t = await loc.innerText();
            if (!t.includes(a.textContains)) {
              pass = false;
              details.push(`Text missing: ${a.textContains}`);
            }
          }
          if (a.styleEquals) {
            const cs = await loc.evaluate((el) => {
              const s = getComputedStyle(el);
              const out = {};
              for (const k of Array.from(s)) out[k] = s.getPropertyValue(k);
              return out;
            });
            for (const [k, v] of Object.entries(a.styleEquals)) {
              if ((cs[k] || '').trim() !== String(v).trim()) {
                pass = false;
                details.push(`Style ${k} expected '${v}' got '${cs[k]}'`);
              }
            }
          }
        } catch (e) {
          pass = false;
          details.push(String(e));
        }
        results.push({ selector: a.selector, pass, details });
      }
    } finally {
      await browser.close();
    }
    return { results };
  }
);

server.tool(
  {
    name: "append_css_block",
    description: "Append a CSS rule block to styles.css (or specified file). This is additive and safe.",
    inputSchema: {
      type: "object",
      properties: {
        selector: { type: "string" },
        declarations: { type: "array", items: { type: "string" }, description: "Array of CSS declarations like 'color: red'" },
        cssPath: { type: "string", default: defaultCss },
      },
      required: ["selector", "declarations"],
    },
  },
  async ({ selector, declarations, cssPath = defaultCss }) => {
    const block = `\n${selector} {\n  ${declarations.join(";\n  ")};\n}\n`;
    await fs.appendFile(cssPath, block, "utf8");
    return { appended: true, cssPath };
  }
);

server.tool(
  {
    name: "run_linters",
    description: "Run project linters (stylelint, csstree-validator, html-validate, eslint, webhint).",
    inputSchema: { type: "object", properties: {} },
  },
  async () => {
    const cmd = process.platform === "win32" ? "npm.cmd" : "npm";
    return new Promise((resolve) => {
      const proc = spawn(cmd, ["run", "lint"], { shell: false });
      let out = "";
      let err = "";
      proc.stdout.on("data", (d) => (out += d.toString()));
      proc.stderr.on("data", (d) => (err += d.toString()));
      proc.on("close", (code) => resolve({ code, out, err }));
    });
  }
);

server.tool(
  {
    name: "scan_unused_code",
    description: "Scan for unused exports/files and dependencies using knip and depcheck.",
    inputSchema: { type: "object", properties: {} },
  },
  async () => {
    const npx = process.platform === "win32" ? "npx.cmd" : "npx";
    const run = (args) =>
      new Promise((resolve) => {
        const p = spawn(npx, args, { shell: false });
        let out = "";
        let err = "";
        p.stdout.on("data", (d) => (out += d.toString()));
        p.stderr.on("data", (d) => (err += d.toString()));
        p.on("close", (code) => resolve({ code, out, err }));
      });
    const knip = await run(["knip", "--json"]);
    const depcheck = await run(["depcheck", "--json"]);
    return { knip, depcheck };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
