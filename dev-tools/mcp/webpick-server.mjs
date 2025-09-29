#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { scraping } from "web-structure";

// Wrapper around the upstream webpick server to keep the tool schema OpenAI-compatible
const SERVER_INFO = {
  name: "web-content-pick-sanitized",
  version: "0.1.0"
};

const TOOL_NAME = "web_content_pick";
const TOOL_DESCRIPTION = "Extract structured content from a web page. Uses Playwright-backed scraping with sensible defaults.";
const TOOL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["url"],
  properties: {
    url: {
      type: "string",
      description: "Web URL to extract structured content from"
    },
    maxDepth: {
      type: "integer",
      minimum: 0,
      description: "Optional crawl depth for following links. Zero limits the scraper to the initial page.",
      default: 0
    },
    withConsole: {
      type: "boolean",
      description: "Include underlying browser console output in the response.",
      default: false
    },
    breakWhenFailed: {
      type: "boolean",
      description: "Stop the crawl when a child page fails to load.",
      default: false
    },
    retryCount: {
      type: "integer",
      minimum: 0,
      description: "Number of retries when a page navigation fails.",
      default: 3
    },
    waitForSelectorTimeout: {
      type: "integer",
      minimum: 0,
      description: "Milliseconds to wait for target selectors before timing out.",
      default: 12000
    },
    waitForPageLoadTimeout: {
      type: "integer",
      minimum: 0,
      description: "Milliseconds to wait for page load completion before timing out.",
      default: 12000
    }
  }
};

const TOOL_DEFINITION = {
  name: TOOL_NAME,
  description: TOOL_DESCRIPTION,
  inputSchema: TOOL_SCHEMA
};

function coerceInteger(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }
  throw new Error(`${fieldName} must be an integer.`);
}

function coerceBoolean(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalised = value.trim().toLowerCase();
    if (normalised === "true") return true;
    if (normalised === "false") return false;
  }
  throw new Error(`${fieldName} must be a boolean.`);
}

function buildOptions(args) {
  const options = {};
  const maxDepth = coerceInteger(args.maxDepth, "maxDepth");
  if (maxDepth !== undefined) {
    options.maxDepth = maxDepth;
  }
  const retryCount = coerceInteger(args.retryCount, "retryCount");
  if (retryCount !== undefined) {
    options.retryCount = retryCount;
  }
  const waitForSelectorTimeout = coerceInteger(args.waitForSelectorTimeout, "waitForSelectorTimeout");
  if (waitForSelectorTimeout !== undefined) {
    options.waitForSelectorTimeout = waitForSelectorTimeout;
  }
  const waitForPageLoadTimeout = coerceInteger(args.waitForPageLoadTimeout, "waitForPageLoadTimeout");
  if (waitForPageLoadTimeout !== undefined) {
    options.waitForPageLoadTimeout = waitForPageLoadTimeout;
  }
  const withConsole = coerceBoolean(args.withConsole, "withConsole");
  if (withConsole !== undefined) {
    options.withConsole = withConsole;
  }
  const breakWhenFailed = coerceBoolean(args.breakWhenFailed, "breakWhenFailed");
  if (breakWhenFailed !== undefined) {
    options.breakWhenFailed = breakWhenFailed;
  }
  return options;
}

const server = new Server(SERVER_INFO, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [TOOL_DEFINITION]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name !== TOOL_NAME) {
    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true
    };
  }
  if (!args || typeof args.url !== "string" || args.url.trim() === "") {
    return {
      content: [{ type: "text", text: "The 'url' argument is required." }],
      isError: true
    };
  }

  let scrapeOptions;
  try {
    scrapeOptions = buildOptions(args);
  } catch (error) {
    return {
      content: [{ type: "text", text: error instanceof Error ? error.message : String(error) }],
      isError: true
    };
  }

  const finalOptions = {
    withConsole: false,
    breakWhenFailed: false,
    ...scrapeOptions
  };

  try {
    const results = await scraping(args.url, finalOptions);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(results, null, 2)
      }],
      isError: false
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true
    };
  }
});

async function start() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${TOOL_NAME} server running on stdio`);
}

start().catch((error) => {
  console.error(`Fatal error running server: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});


