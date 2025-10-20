import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basePath = resolve(__dirname, "..");
const seqServer = {
  command: "node",
  args: [
    `${basePath}/node_modules/@modelcontextprotocol/server-sequential-thinking/dist/index.js`
  ],
  stderr: "pipe",
  cwd: basePath
};

function parseArgs(argv) {
  const options = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument '${arg}'. Use --key value format.`);
    }
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      options[key] = true;
      continue;
    }
    options[key] = next;
    i += 1;
  }
  return options;
}

function coerceBoolean(value, key) {
  if (typeof value === "boolean") return value;
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid boolean for --${key}: ${value}`);
}

function coerceInteger(value, key) {
  if (value === undefined) return undefined;
  const num = Number.parseInt(value, 10);
  if (Number.isNaN(num) || num < 1) {
    throw new Error(`Invalid integer for --${key}: ${value}`);
  }
  return num;
}

async function main() {
  const opts = parseArgs(process.argv);
  const thought = opts.thought;
  const thoughtNumber = coerceInteger(opts.thoughtNumber, "thoughtNumber");
  const totalThoughts = coerceInteger(opts.totalThoughts, "totalThoughts");
  const nextThoughtNeeded = coerceBoolean(opts.nextThoughtNeeded, "nextThoughtNeeded");
  const isRevision = coerceBoolean(opts.isRevision, "isRevision");
  const needsMoreThoughts = coerceBoolean(opts.needsMoreThoughts, "needsMoreThoughts");
  const revisesThought = coerceInteger(opts.revisesThought, "revisesThought");
  const branchFromThought = coerceInteger(opts.branchFromThought, "branchFromThought");
  const branchId = opts.branchId;

  if (!thought) {
    throw new Error("--thought is required");
  }
  if (!thoughtNumber) {
    throw new Error("--thoughtNumber is required and must be >= 1");
  }
  if (!totalThoughts) {
    throw new Error("--totalThoughts is required and must be >= 1");
  }
  if (nextThoughtNeeded === undefined) {
    throw new Error("--nextThoughtNeeded must be provided as true or false");
  }

  const client = new Client({
    name: "CodexAutomation",
    version: "0.1.0"
  }, {
    capabilities: {
      tools: {}
    }
  });
  const transport = new StdioClientTransport(seqServer);
  if (transport.stderr) {
    transport.stderr.on("data", chunk => {
      process.stderr.write(chunk);
    });
  }
  await client.connect(transport);
  try {
    const result = await client.callTool({
      name: "sequentialthinking",
      arguments: {
        thought,
        nextThoughtNeeded,
        thoughtNumber,
        totalThoughts,
        isRevision,
        revisesThought,
        branchFromThought,
        branchId,
        needsMoreThoughts
      }
    });
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await client.close();
  }
}

main().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
