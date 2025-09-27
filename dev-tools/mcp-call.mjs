import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const basePath = "C:/Users/HhsJa/OneDrive/Documents/GitHub/Paramedic-App";
const serverConfigs = {
  filesystem: {
    command: "node",
    args: [
      `${basePath}/node_modules/@modelcontextprotocol/server-filesystem/dist/index.js`,
      basePath
    ],
    stderr: "pipe",
    cwd: basePath
  },
  git: {
    command: "node",
    args: [
      `${basePath}/node_modules/@cyanheads/git-mcp-server/dist/index.js`
    ],
    stderr: "pipe",
    cwd: basePath
  },
  seq: {
    command: "node",
    args: [
      `${basePath}/node_modules/@modelcontextprotocol/server-sequential-thinking/dist/index.js`
    ],
    stderr: "pipe",
    cwd: basePath
  },
  memory: {
    command: "node",
    args: [
      `${basePath}/node_modules/@modelcontextprotocol/server-memory/dist/index.js`
    ],
    stderr: "pipe",
    cwd: basePath
  },
  healthcare: {
    command: "node",
    args: [
      `${basePath}/node_modules/healthcare-mcp/server/index.js`
    ],
    stderr: "pipe",
    cwd: basePath
  },
  fetch: {
    command: "node",
    args: [
      `${basePath}/node_modules/@kazuph/mcp-fetch/dist/index.js`
    ],
    stderr: "pipe",
    cwd: basePath
  },
  fetcher: {
    command: "node",
    args: [
      `${basePath}/node_modules/fetcher-mcp/build/index.js`
    ],
    stderr: "pipe",
    cwd: basePath
  },
  webpick: {
    command: "node",
    args: [
      `${basePath}/node_modules/mcp-web-content-pick/dist/index.js`
    ],
    stderr: "pipe",
    cwd: basePath
  }
};

function usage() {
  console.error("Usage: node mcp-call.mjs <server> <action> [jsonArgs]");
  console.error("Actions: listTools, call");
  process.exit(1);
}

const [, , serverName, action, jsonArgs] = process.argv;
let payloadText = jsonArgs;
if (!serverName || !action) {
  usage();
}
if (payloadText === "-") {
  payloadText = await new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", chunk => { data += chunk; });
    process.stdin.on("end", () => resolve(data.trim()));
    process.stdin.on("error", reject);
  });
}
const server = serverConfigs[serverName];
if (!server) {
  console.error(`Unknown server '${serverName}'`);
  process.exit(1);
}
(async () => {
  const client = new Client({
    name: "CodexAutomation",
    version: "0.1.0"
  }, {
    capabilities: {
      tools: {}
    }
  });
  const transport = new StdioClientTransport(server);
  if (transport.stderr) {
    transport.stderr.on('data', (chunk) => {
      process.stderr.write(chunk);
    });
  }
  await client.connect(transport);
  try {
    if (action === "listTools") {
      const result = await client.listTools();
      console.log(JSON.stringify(result, null, 2));
    } else if (action === "call") {
      if (!payloadText) {
        console.error("call requires JSON args including name and arguments");
        process.exit(1);
      }
      const parsed = JSON.parse(payloadText);
      if (!parsed.name) {
        console.error("JSON args must include 'name'");
        process.exit(1);
      }
      const result = await client.callTool(parsed);
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.error(`Unknown action '${action}'`);
      process.exit(1);
    }
  } finally {
    await client.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});