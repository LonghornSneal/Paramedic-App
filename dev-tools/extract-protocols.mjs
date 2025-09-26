import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ParamedicCategoriesData } from '../Data/ParamedicCategoriesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolveRepoPath = (...segments) => path.resolve(__dirname, '..', ...segments);

const docPath = resolveRepoPath('research', 'paramedic_protocols.txt');
const rawText = fs.readFileSync(docPath, 'utf8');
const lines = rawText.split(/\r?\n/);

const MIN_ASSIGN_SCORE = 0.4;
const MIN_LINE_SCORE = 0.5;

const normalize = (str) => str
  .normalize('NFKD')
  .replace(/[^A-Za-z0-9]+/g, ' ')
  .trim()
  .toUpperCase();

const canonicalTokens = (str) => {
  const base = normalize(str);
  const words = base.split(/\s+/).filter(Boolean);
  return words.map(word => {
    let w = word;
    if (w.endsWith('S') && w.length > 4) w = w.slice(0, -1);
    w = w.replace(/(TION|ING|ED|ES|ER|LY)$/,'');
    if (w === 'NON') w = 'NOT';
    if (w.length > 5) w = w.slice(0,5);
    return w;
  });
};

const tokenSet = tokens => new Set(tokens.filter(Boolean));
const scoreTokens = (tokensA, tokensB) => {
  if (!tokensA.size || !tokensB.size) return 0;
  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection += 1;
  }
  return intersection / Math.max(tokensA.size, tokensB.size);
};

const tocEntries = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.includes('\t')) break;
  const [title] = line.split('\t');
  const trimmed = title.trim();
  if (!trimmed) continue;
  const tokens = canonicalTokens(trimmed);
  tocEntries.push({
    title: trimmed,
    tokens,
    tokenSet: tokenSet(tokens),
    index: i,
    assignedTopicId: null
  });
}

const bodyStartIndex = tocEntries.length ? tocEntries[tocEntries.length - 1].index + 1 : 0;

function flatten(items, pathTrail = []) {
  const out = [];
  for (const item of items) {
    const pathTitles = [...pathTrail, item.title];
    out.push({
      id: item.id,
      title: item.title,
      tokens: canonicalTokens(item.title),
      tokenSet: tokenSet(canonicalTokens(item.title)),
      type: item.type,
      path: pathTitles,
      details: item.details || null,
      assigned: false,
      matchTitle: null,
      tocIndex: null,
      content: ''
    });
    if (Array.isArray(item.children) && item.children.length) {
      out.push(...flatten(item.children, pathTitles));
    }
  }
  return out;
}

const allItems = flatten(ParamedicCategoriesData);
const topicItems = allItems.filter(item => item.type === 'topic');

for (const entry of tocEntries) {
  let bestTopic = null;
  let bestScore = 0;
  for (const topic of topicItems) {
    if (topic.assigned) continue;
    const score = scoreTokens(entry.tokenSet, topic.tokenSet);
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }
  if (bestTopic && bestScore >= MIN_ASSIGN_SCORE) {
    bestTopic.assigned = true;
    bestTopic.matchTitle = entry.title;
    bestTopic.tocIndex = entry.index;
    entry.assignedTopicId = bestTopic.id;
  }
}

const assignedTopics = topicItems.filter(topic => topic.assigned).sort((a, b) => a.tocIndex - b.tocIndex);
const headingPositions = [];
const usedLines = new Set();
let searchStart = bodyStartIndex;

const getLineTokens = (idx) => canonicalTokens(lines[idx] || '');

for (const topic of assignedTopics) {
  let bestLine = -1;
  let bestScore = 0;

  for (let i = searchStart; i < lines.length; i++) {
    if (usedLines.has(i)) continue;
    const score = scoreTokens(tokenSet(getLineTokens(i)), topic.tokenSet);
    if (score > bestScore) {
      bestScore = score;
      bestLine = i;
      if (score === 1) break;
    }
  }

  if (bestLine < 0 || bestScore < MIN_LINE_SCORE) {
    bestLine = -1;
    bestScore = 0;
    for (let i = bodyStartIndex; i < lines.length; i++) {
      if (usedLines.has(i)) continue;
      const score = scoreTokens(tokenSet(getLineTokens(i)), topic.tokenSet);
      if (score > bestScore) {
        bestScore = score;
        bestLine = i;
        if (score === 1) break;
      }
    }
  }

  if (bestLine >= 0 && bestScore >= MIN_LINE_SCORE) {
    headingPositions.push({ topic, line: bestLine });
    usedLines.add(bestLine);
    searchStart = bestLine + 1;
  } else {
    headingPositions.push({ topic, line: null });
  }
}

headingPositions.sort((a, b) => {
  if (a.line === null) return 1;
  if (b.line === null) return -1;
  return a.line - b.line;
});

for (let i = 0; i < headingPositions.length; i++) {
  const current = headingPositions[i];
  if (current.line === null) continue;
  const nextLine = headingPositions.slice(i + 1).find(pos => pos.line !== null)?.line ?? lines.length;
  const start = current.line + 1;
  const end = nextLine;
  current.topic.content = lines.slice(start, end).join('\n').trim();
}

const output = {
  generatedAt: new Date().toISOString(),
  tocEntries: tocEntries.length,
  matchedTopics: headingPositions.filter(pos => pos.line !== null).length,
  unmatchedTocEntries: tocEntries.filter(entry => !entry.assignedTopicId),
  missingTopics: headingPositions.filter(pos => pos.line === null).map(pos => ({
    id: pos.topic.id,
    title: pos.topic.title,
    path: pos.topic.path,
    matchTitle: pos.topic.matchTitle,
  })),
  unassignedTopics: topicItems.filter(topic => !topic.assigned),
  topics: headingPositions.map(pos => ({
    id: pos.topic.id,
    title: pos.topic.title,
    matchTitle: pos.topic.matchTitle,
    path: pos.topic.path,
    line: pos.line,
    contentLines: pos.topic.content ? pos.topic.content.split(/\r?\n/).length : 0,
    content: pos.topic.content || '',
    contentPreview: pos.topic.content ? pos.topic.content.split(/\r?\n/).slice(0, 5) : []
  }))
};

const outPath = resolveRepoPath('research', 'protocol_content_map.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log('Protocol content map written to ' + outPath);
