#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const codexConfigPath = path.join(os.homedir(), '.codex', 'config.toml');
const configText = fs.existsSync(codexConfigPath)
  ? fs.readFileSync(codexConfigPath, 'utf8')
  : '';

const servers = [
  {
    name: 'filesystem',
    package: '@modelcontextprotocol/server-filesystem',
    binary: 'mcp-server-filesystem',
    required: true,
    configKey: 'filesystem',
    notes: 'Provides read/write file operations with edit support.'
  },
  {
    name: 'git',
    package: '@cyanheads/git-mcp-server',
    binary: 'git-mcp-server',
    required: true,
    configKey: 'git',
    notes: 'Used for git_status, git_diff, commits, and history.'
  },
  {
    name: 'shell',
    package: 'mcp-shell-execute',
    binary: 'mcp-shell-execute',
    required: true,
    configKey: 'shell',
    notes: 'Fallback for shell commands when MCP tooling lacks coverage.'
  },
  {
    name: 'everything',
    package: '@modelcontextprotocol/server-everything',
    binary: 'mcp-server-everything',
    required: false,
    configKey: 'everything',
    notes: 'Diagnostic server covering every MCP feature.'
  },
  {
    name: 'seq',
    package: '@modelcontextprotocol/server-sequential-thinking',
    binary: 'mcp-server-sequential-thinking',
    required: false,
    configKey: 'seq',
    notes: 'Sequential thinking scratchpad for complex planning.'
  },
  {
    name: 'memory',
    package: '@modelcontextprotocol/server-memory',
    binary: 'mcp-server-memory',
    required: false,
    configKey: 'memory',
    notes: 'Knowledge graph memory for persisting decisions.'
  },
  {
    name: 'webpick',
    package: 'mcp-web-content-pick',
    binary: 'mcp-web-content-pick',
    required: false,
    configKey: 'webpick',
    notes: 'Structured web content extraction.'
  },
  {
    name: 'crawler',
    package: 'mcp-smart-crawler',
    binary: 'mcp-smart-crawler',
    required: false,
    configKey: 'crawler',
    notes: 'Playwright powered crawler for deeper web pulls.'
  },
  {
    name: 'fetch',
    package: '@kazuph/mcp-fetch',
    binary: 'mcp-fetch',
    required: false,
    configKey: 'fetch',
    notes: 'HTTP fetch helper for simple requests.'
  },
  {
    name: 'fetcher',
    package: 'fetcher-mcp',
    binary: 'fetcher-mcp',
    required: false,
    configKey: 'fetcher',
    notes: 'Playwright-backed fetcher for dynamic pages.'
  },
  {
    name: 'playwright',
    package: '@playwright/mcp',
    binary: 'playwright',
    required: false,
    configKey: 'playwright',
    notes: 'Browser automation and accessibility snapshots.'
  },
  {
    name: 'lighthouse',
    package: 'lighthouse-mcp',
    binary: 'lighthouse-mcp',
    required: false,
    configKey: 'lighthouse',
    notes: 'Performance auditing via Lighthouse.'
  },
  {
    name: 'a11y',
    package: 'a11y-mcp',
    binary: 'a11y-mcp',
    required: false,
    configKey: 'a11y',
    notes: 'Accessibility scans using axe-core.'
  }
];

const optionalServers = [
  {
    name: 'firecrawl',
    package: 'firecrawl-mcp',
    binary: 'firecrawl-mcp',
    required: false,
    configKey: 'firecrawl',
    envVar: 'FIRECRAWL_API_KEY',
    notes: 'Requires Firecrawl API key. Leave disabled unless configured.'
  }
];

function resolvePackage(pkg) {
  const segments = pkg.split('/');
  let scoped = segments[0];
  let rest = segments[1];
  if (pkg.startsWith('@') && segments.length > 1) {
    scoped = segments[0];
    rest = segments[1];
  }

  const possiblePaths = [];
  if (pkg.startsWith('@')) {
    possiblePaths.push(path.join(repoRoot, 'node_modules', scoped, rest, 'package.json'));
    possiblePaths.push(path.join(repoRoot, 'dev-tools', 'node_modules', scoped, rest, 'package.json'));
  } else {
    possiblePaths.push(path.join(repoRoot, 'node_modules', pkg, 'package.json'));
    possiblePaths.push(path.join(repoRoot, 'dev-tools', 'node_modules', pkg, 'package.json'));
  }

  return possiblePaths.some((candidate) => fs.existsSync(candidate));
}

function binaryExists(binaryName) {
  if (!binaryName) return true;
  const suffixes = process.platform === 'win32'
    ? ['.cmd', '.ps1']
    : [''];
  return suffixes.some((suffix) => {
    const candidate = path.join(repoRoot, 'node_modules', '.bin', `${binaryName}${suffix}`);
    return fs.existsSync(candidate);
  });
}

function configHasServer(key) {
  if (!configText) return false;
  const pattern = new RegExp(`\[mcp_servers\.${key}\]`);
  return pattern.test(configText);
}

function formatLine({ status, label, detail }) {
  return `${status} ${label.padEnd(12)} ${detail}`;
}

const checks = [];

function assess(serversList, { optional } = {}) {
  for (const server of serversList) {
    const pkgOk = resolvePackage(server.package);
    const binOk = pkgOk && binaryExists(server.binary);
    const inConfig = configHasServer(server.configKey);
    const envOk = !server.envVar || Boolean(process.env[server.envVar]);
    const problems = [];

    if (!pkgOk) {
      problems.push('package missing');
    }
    if (pkgOk && !binOk) {
      problems.push('binary shim missing');
    }
    if (!optional && server.required && !inConfig) {
      problems.push('not referenced in ~/.codex/config.toml');
    }
    if (!optional && server.required && !envOk) {
      problems.push(`${server.envVar} not set`);
    }

    const status = problems.length === 0
      ? (server.required ? '✅' : '⚠️')
      : '❌';

    const detailParts = [];
    if (problems.length === 0) {
      detailParts.push(server.notes);
      if (!server.required) {
        detailParts.push(optional ? 'Optional - configure when needed.' : 'Optional server available.');
      }
    } else {
      detailParts.push(problems.join('; '));
    }
    const detail = detailParts.join(' ');

    checks.push({
      server,
      status,
      problems,
      detail,
      optional,
      pkgOk,
      binOk,
      inConfig,
      envOk
    });

    console.log(formatLine({
      status,
      label: server.name,
      detail
    }));
  }
}

console.log('=== MCP Health Check ===');
console.log(`Repo: ${repoRoot}`);
console.log(configText ? `Config: ${codexConfigPath}` : 'Config: not found');
console.log('');

assess(servers);
assess(optionalServers, { optional: true });

const blocking = checks.filter((item) =>
  !item.optional && item.server.required && item.problems.length > 0
);

if (blocking.length > 0) {
  console.error('\nOne or more required MCP servers are not ready. Run "npm install" and re-check.');
  process.exit(1);
}

if (!configText) {
  console.warn('\nWarning: ~/.codex/config.toml not found. MCP clients will not connect until it is created.');
}

console.log('\nAll required MCP servers resolved. Optional entries may be configured as needed.');
