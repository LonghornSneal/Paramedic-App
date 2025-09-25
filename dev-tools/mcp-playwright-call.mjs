import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const basePath = "C:/Users/HhsJa/OneDrive/Documents/GitHub/Paramedic-App";
const server = {
  command: "node",
  args: [
    `${basePath}/node_modules/@playwright/mcp/cli.js`,
    "--browser=chromium",
    "--headless",
    "--executable-path=C:/Users/HhsJa/AppData/Local/ms-playwright/chromium-1187/chrome-win/chrome.exe"
  ],
  stderr: "pipe",
  cwd: basePath
};

function usage() {
  console.error("Usage: node mcp-playwright-call.mjs <action> [jsonArgs]");
  console.error("Actions: listTools, call");
  process.exit(1);
}

const [, , action, jsonArgs] = process.argv;
let payloadText = jsonArgs;
if (!action) {
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
    transport.stderr.on('data', (chunk) => process.stderr.write(chunk));
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
