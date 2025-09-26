import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ParamedicCategoriesData } from "../Data/ParamedicCategoriesData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolveRepoPath = (...segments) => path.resolve(__dirname, "..", ...segments);

const mapPath = resolveRepoPath("research", "protocol_content_map.json");
if (!fs.existsSync(mapPath)) {
  throw new Error(`Missing mapping file at ${mapPath}. Run extract-protocols script first.`);
}
const mapping = JSON.parse(fs.readFileSync(mapPath, "utf8"));

function flatten(items, parentPath = []) {
  const out = [];
  for (const item of items) {
    const pathTitles = [...parentPath, item.title];
    out.push({ ...item, path: pathTitles });
    if (Array.isArray(item.children) && item.children.length) {
      out.push(...flatten(item.children, pathTitles));
    }
  }
  return out;
}

const allItems = flatten(ParamedicCategoriesData);
const topicMeta = new Map();
for (const item of allItems) {
  if (item.type === "topic") {
    const existingDetails = item.details || null;
    topicMeta.set(item.id, { item, existingDetails });
  }
}

const topLevelDirMap = {
  "Adult Protocols": "Content/Adult Protocols",
  "Pediatric Protocols": "Content/Pediatric Protocols",
  "Administrative & Legal Essentials": "Content/Administrative & Legal Essentials",
  "Introduction & Core Principles": "Content/Introduction & Core Principles",
  "Operational Protocols": "Content/Operational Protocols",
  "Skills & Equipment": "Content/Skills & Equipment",
  "Abbreviations & References": "Content/Abbreviations & References"
};

const created = [];
const skippedExisting = [];
const missingDirectory = [];
const markdownMapEntries = new Map();

const ensureDir = dir => fs.mkdirSync(dir, { recursive: true });

const topics = Array.isArray(mapping.topics) ? mapping.topics : [];

for (const topic of topics) {
  const { id, title, matchTitle, path: topicPath, contentLines, content } = topic;
  if (!id || !Array.isArray(topicPath) || topicPath.length === 0) continue;
  if (!contentLines || !content || !content.trim()) continue;

  const meta = topicMeta.get(id);
  if (!meta) continue;

  if (meta.existingDetails && meta.existingDetails.mdPath) {
    skippedExisting.push({ id, title: meta.item.title, reason: "existing details" });
    continue;
  }

  const topLevel = topicPath[0];
  if (id.startsWith('zoll-emv731')) {
    skippedExisting.push({ id, title: meta.item.title, reason: 'handled by Zoll manual' });
    continue;
  }
  if (topLevel === "ALS Medications") {
    skippedExisting.push({ id, title: meta.item.title, reason: "ALS medication handled by data" });
    continue;
  }

  const baseDir = topLevelDirMap[topLevel];
  if (!baseDir) {
    missingDirectory.push({ id, title: topicPath.join(" > "), topLevel });
    continue;
  }

  const fileName = `${id}.md`;
  const filePath = resolveRepoPath(baseDir, fileName);
  ensureDir(path.dirname(filePath));

  const docHeading = matchTitle || title || meta.item.title;

  if (!fs.existsSync(filePath)) {
    const fullContent = `# ${docHeading}\n\n${content}`.trimEnd() + "\n";
    fs.writeFileSync(filePath, fullContent, { encoding: "utf8" });
    created.push({ id, title: meta.item.title, matchTitle: docHeading, mdPath: filePath });
  } else {
    skippedExisting.push({ id, title: meta.item.title, reason: "file already exists", path: filePath });
  }

  const relativePath = path.relative(resolveRepoPath(), filePath).replace(/\\/g, "/");
  markdownMapEntries.set(id, relativePath);
}

const mapModulePath = resolveRepoPath("Data", "ProtocolMarkdownMap.js");
const sortedEntries = Array.from(markdownMapEntries.entries()).sort((a, b) => a[0].localeCompare(b[0]));
const mapEntries = sortedEntries.map(([key, value]) => `  \"${key}\": \"${value}\"`).join(",\n");
const moduleContent = `// Auto-generated protocol markdown references\n// Generated on ${new Date().toISOString()}\n\nexport const ProtocolMarkdownMap = {\n${mapEntries}\n};\n`;
fs.writeFileSync(mapModulePath, moduleContent, { encoding: "utf8" });

const report = {
  generatedAt: new Date().toISOString(),
  created,
  skippedExisting,
  missingDirectory,
  unmatchedDocHeadings: mapping.unmatchedTocEntries || [],
  unassignedAppTopics: mapping.unassignedTopics || []
};

const reportPath = resolveRepoPath("research", "protocol_import_report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`Created ${created.length} markdown files (newly written).`);
console.log(`Skipped ${skippedExisting.length} topics.`);
if (missingDirectory.length) {
  console.warn(`Missing directory mapping for ${missingDirectory.length} topics.`);
}
console.log(`ProtocolMarkdownMap written to ${mapModulePath}`);
console.log(`Report saved to ${reportPath}`);
