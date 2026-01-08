import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const spaceVars = [
  "      --space-base: #050712;",
  "      --space-vignette: radial-gradient(1200px 600px at 50% -10%, rgba(37, 99, 235, 0.25), transparent 70%),",
  "        radial-gradient(900px 520px at 15% 90%, rgba(219, 39, 119, 0.18), transparent 70%);",
  "      --star-1: 219, 234, 254;",
  "      --star-2: 224, 231, 255;",
  "      --star-3: 254, 205, 211;"
].join("\n");

const starBlock = [
  "    body::before {",
  "      content: \"\";",
  "      position: fixed;",
  "      inset: 0;",
  "      background-image:",
  "        radial-gradient(1px 1px at 18px 24px, rgba(var(--star-1), 0.9) 0 1px, transparent 2px),",
  "        radial-gradient(1px 1px at 80px 60px, rgba(var(--star-2), 0.7) 0 1px, transparent 2px),",
  "        radial-gradient(1.5px 1.5px at 42px 90px, rgba(var(--star-3), 0.8) 0 1px, transparent 2px);",
  "      background-size: 140px 140px, 200px 200px, 260px 260px;",
  "      opacity: 0.7;",
  "      pointer-events: none;",
  "      z-index: 0;",
  "    }"
].join("\n");

const mainRule = "    main { position: relative; z-index: 1; }";

const updateHtml = (html) => {
  let next = html;

  if (!next.includes("--space-base")) {
    next = next.replace(/:root\s*\{/, `:root {\n${spaceVars}`);
  }

  next = next.replace(
    /background:\s*var\(--bg-1\)[^;]*;/,
    "background: var(--space-vignette), var(--bg-1), var(--bg-2), var(--bg-3), var(--bg-4), var(--space-base);"
  );

  next = next.replace(
    /background: var\(--space-vignette\)[^;]*;/,
    "background: var(--space-vignette), var(--bg-1), var(--bg-2), var(--bg-3), var(--bg-4), var(--space-base);"
  );

  next = next.replace(
    /background: var\(--space-vignette\), var\(--bg-1\), var\(--bg-2\), var\(--bg-3\), var\(--bg-4\), var\(--space-base\);/,
    "background: var(--space-vignette), var(--bg-1), var(--bg-2), var(--bg-3), var(--bg-4), var(--space-base);"
  );

  next = next.replace(
    /background: var\(--space-vignette\), var\(--bg-1\), var\(--bg-2\), var\(--bg-3\), var\(--bg-4\), var\(--space-base\);\s*}/,
    "background: var(--space-vignette), var(--bg-1), var(--bg-2), var(--bg-3), var(--bg-4), var(--space-base);\n      min-height: 100vh;\n      position: relative;\n      overflow-x: hidden;\n    }"
  );

  if (!next.includes("body::before")) {
    next = next.replace(/body\s*\{[\s\S]*?\}/, (match) => `${match}\n\n${starBlock}`);
  }

  if (!next.includes("main { position: relative; z-index: 1; }")) {
    next = next.replace(/\.scene\s*\{[^}]*\}/, (match) => `${match}\n\n${mainRule}`);
  }

  return next;
};

const run = async () => {
  const baseDir = join("notes", "experiments");
  const entries = await readdir(baseDir);
  const targets = entries.filter((entry) => entry.startsWith("adult-protocol-detail-v12-option-") && entry.endsWith(".html"));

  for (const file of targets) {
    const fullPath = join(baseDir, file);
    const html = await readFile(fullPath, "utf8");
    const next = updateHtml(html);
    await writeFile(fullPath, next, "utf8");
  }
};

run();
