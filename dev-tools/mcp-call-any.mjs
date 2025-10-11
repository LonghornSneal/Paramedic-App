#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const basePath = "C:/Users/HhsJa/OneDrive/Documents/GitHub/Paramedic-App";

const defaultServers = {
  filesystem: {
    command: "node",
    args: [
      `${basePath}/node_modules/@modelcontextprotocol/server-filesystem/dist/index.js`,
      basePath
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  git: {
    command: "node",
    args: [
      `${basePath}/node_modules/@cyanheads/git-mcp-server/dist/index.js`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  seq: {
    command: "node",
    args: [
      `${basePath}/node_modules/@modelcontextprotocol/server-sequential-thinking/dist/index.js`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  tasktimer: {
    command: "node",
    args: [
      `${basePath}/dev-tools/mcp/task-timer-server.mjs`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  memory: {
    command: "node",
    args: [
      `${basePath}/node_modules/@modelcontextprotocol/server-memory/dist/index.js`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  healthcare: {
    command: "node",
    args: [
      `${basePath}/node_modules/healthcare-mcp/server/index.js`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  fetch: {
    command: "node",
    args: [
      `${basePath}/node_modules/@kazuph/mcp-fetch/dist/index.js`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  fetcher: {
    command: "node",
    args: [
      `${basePath}/node_modules/fetcher-mcp/build/index.js`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  webpick: {
    command: "node",
    args: [
      `${basePath}/dev-tools/mcp/webpick-server.mjs`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  crawler: {
    command: "node",
    args: [
      `${basePath}/node_modules/mcp-smart-crawler/build/index.js`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  playwright: {
    command: "node",
    args: [
      `${basePath}/node_modules/@playwright/mcp/cli.js`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  shell: {
    command: "node",
    args: [
      `${basePath}/node_modules/mcp-shell-execute/dist/cli.js`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  everything: {
    command: "node",
    args: [
      `${basePath}/node_modules/@modelcontextprotocol/server-everything/dist/index.js`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  lighthouse: {
    command: "node",
    args: [
      `${basePath}/node_modules/lighthouse-mcp/build/index.js`
    ],
    cwd: basePath,
    stderr: "pipe"
  },
  a11y: {
    command: "node",
    args: [
      `${basePath}/node_modules/a11y-mcp/src/index.js`
    ],
    cwd: basePath,
    stderr: "pipe"
  }
};

function showHelp() {
  console.error(`Usage: node mcp-call-any.mjs --server <name> --action <listTools|call> [options]

Options:
  --server <name>            Registered server key (filesystem, git, etc.)
  --action <listTools|call>  MCP operation to perform
  --payload <json|- >        JSON payload for call; use '-' to read from stdin
  --command <path>           Override executable command for the server
  --arg <value>              Repeatable when overriding command to supply args
  --env <KEY=VALUE>          Repeatable; sets environment variables
  --cwd <path>               Working directory for the server process
  -h, --help                 Show this message
`);
  process.exit(1);
}

function parseArgs(argv) {
  const options = {
    env: {},
    customArgs: []
  };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    switch (token) {
      case "--server":
        options.server = argv[++i];
        break;
      case "--action":
        options.action = argv[++i];
        break;
      case "--payload":
        options.payload = argv[++i];
        break;
      case "--command":
        options.command = argv[++i];
        break;
      case "--arg":
        options.customArgs.push(argv[++i]);
        break;
      case "--env": {
        const pair = argv[++i];
        if (!pair || !pair.includes("=")) {
          throw new Error("--env expects KEY=VALUE");
        }
        const [key, ...rest] = pair.split("=");
        options.env[key] = rest.join("=");
        break;
      }
      case "--cwd":
        options.cwd = argv[++i];
        break;
      case "-h":
      case "--help":
        showHelp();
        break;
      default:
        console.error(`Unknown argument '${token}'`);
        showHelp();
    }
  }
  return options;
}

async function readPayload(payloadOption) {
  if (!payloadOption) {
    return null;
  }
  if (payloadOption !== "-") {
    return JSON.parse(payloadOption);
  }
  return await new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", chunk => { data += chunk; });
    process.stdin.on("end", () => {
      try {
        resolve(JSON.parse(data.trim()));
      } catch (error) {
        reject(error);
      }
    });
    process.stdin.on("error", reject);
  });
}

function buildServerConfig(opts) {
  if (opts.command) {
    return {
      command: opts.command,
      args: opts.customArgs,
      cwd: opts.cwd ?? basePath,
      stderr: "pipe",
      env: opts.env
    };
  }
  const preset = defaultServers[opts.server];
  if (!preset) {
    throw new Error(`Unknown server '${opts.server}'. Provide --command to override or choose a known key.`);
  }
  const mergedEnv = { ...(preset.env ?? {}), ...opts.env };
  return {
    ...preset,
    env: Object.keys(mergedEnv).length > 0 ? mergedEnv : undefined,
    cwd: opts.cwd ?? preset.cwd ?? basePath
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.server || !options.action) {
    showHelp();
  }
  const action = options.action.toLowerCase();
  if (!["listtools", "call"].includes(action)) {
    throw new Error(`Unsupported action '${options.action}'. Use listTools or call.`);
  }
  const serverConfig = buildServerConfig(options);
  const payload = await readPayload(options.payload);

  const client = new Client({
    name: "CodexAutomation",
    version: "0.1.0"
  }, {
    capabilities: {
      tools: {}
    }
  });
  const transport = new StdioClientTransport(serverConfig);
  if (transport.stderr) {
    transport.stderr.on("data", chunk => process.stderr.write(chunk));
  }
  await client.connect(transport);
  try {
    if (action === "listtools") {
      const result = await client.listTools();
      console.log(JSON.stringify(result, null, 2));
    } else {
      if (!payload) {
        throw new Error("call action requires --payload JSON or '-' for stdin");
      }
      if (!payload.name) {
        throw new Error("Payload must include 'name' field for the tool to call.");
      }
      const result = await client.callTool(payload);
      console.log(JSON.stringify(result, null, 2));
    }
  } finally {
    await client.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
