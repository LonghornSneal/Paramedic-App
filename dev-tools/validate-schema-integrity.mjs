import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ParamedicCategoriesData } from '../Data/ParamedicCategoriesData.js';
import { ProtocolMarkdownAliases, ProtocolMarkdownMap } from '../Data/ProtocolMarkdownMap.js';
import { slugIDs } from '../Features/anchorNav/slugList.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const knownSourceGapIds = new Set([
  'general-important-information',
  'rule-of-9s-rule-of-palms-bsa-burn-estimation',
  'smith-modified-sgarbossa-criteria',
  'cdc-field-triage-guidelines-trauma',
]);

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

function collectLiveCatalog() {
  const allItems = flatten(ParamedicCategoriesData);
  const topics = allItems.filter(item => item.type === 'topic');
  const topicById = new Map(topics.map(item => [item.id, item]));
  const mdPathToIds = new Map();

  for (const topic of topics) {
    const mdPath = topic.details && topic.details.mdPath;
    if (!mdPath) continue;
    if (!mdPathToIds.has(mdPath)) {
      mdPathToIds.set(mdPath, []);
    }
    mdPathToIds.get(mdPath).push(topic.id);
  }

  return {
    allItems,
    topics,
    topicById,
    mdPathToIds,
  };
}

function getOmissionReason(topic) {
  if (topic.details && topic.details.abbreviationGroup) {
    return 'abbreviation-group';
  }
  if (topic.details && topic.details.render) {
    return 'manual-render';
  }
  if (topic.details && topic.details.mdPath) {
    return 'explicit-md-path';
  }
  if (topic.path[0] === 'ALS Medications') {
    return 'data-driven-medication';
  }
  if (topic.id.startsWith('zoll-')) {
    return 'manual-zoll';
  }
  if (knownSourceGapIds.has(topic.id)) {
    return 'known-source-gap';
  }
  return null;
}

function compareOrderedLists(name, expected, actual) {
  const errors = [];
  if (expected.length !== actual.length) {
    errors.push(`${name}: expected ${expected.length} entries but found ${actual.length}`);
    return errors;
  }
  for (let i = 0; i < expected.length; i += 1) {
    if (expected[i] !== actual[i]) {
      errors.push(`${name}: mismatch at index ${i} (${expected[i]} !== ${actual[i]})`);
      break;
    }
  }
  return errors;
}

function validateSlugList(liveIds) {
  const errors = [];
  const slugErrors = compareOrderedLists('slugList', liveIds, slugIDs);
  errors.push(...slugErrors);
  return errors;
}

function validateProtocolMarkdownMap(catalog) {
  const errors = [];
  const warnings = [];
  const aliases = [];
  const missingEntries = [];
  const omittedTopics = [];
  const declaredAliases = new Map(Object.entries(ProtocolMarkdownAliases));

  for (const topic of catalog.topics) {
    const mapEntry = ProtocolMarkdownMap[topic.id];
    const omissionReason = getOmissionReason(topic);
    if (mapEntry) continue;
    if (omissionReason) {
      omittedTopics.push({ id: topic.id, reason: omissionReason });
      continue;
    }
    if (!omissionReason) {
      missingEntries.push({
        id: topic.id,
        title: topic.title,
        path: topic.path.join(' > '),
      });
    }
  }

  for (const [key, value] of Object.entries(ProtocolMarkdownMap)) {
    const topic = catalog.topicById.get(key);
    if (topic) {
      if (!fs.existsSync(path.resolve(repoRoot, value))) {
        errors.push(`ProtocolMarkdownMap entry ${key} points to missing file ${value}`);
      }
      continue;
    }

    const declaredAliasTarget = declaredAliases.get(key);
    const liveIdsForPath = catalog.mdPathToIds.get(value) || [];
    if (declaredAliasTarget) {
      if (declaredAliasTarget !== value) {
        errors.push(`ProtocolMarkdownMap alias ${key} expected ${declaredAliasTarget} but found ${value}`);
        continue;
      }
      if (!liveIdsForPath.length) {
        errors.push(`ProtocolMarkdownMap alias ${key} points to missing shared content ${value}`);
        continue;
      }
      aliases.push({ key, value, liveIdsForPath, declared: true });
      continue;
    }

    if (liveIdsForPath.length) {
      errors.push(`ProtocolMarkdownMap entry ${key} is an undeclared alias for ${value} (${liveIdsForPath.join(', ')})`);
      continue;
    }

    if (!liveIdsForPath.length) {
      errors.push(`ProtocolMarkdownMap entry ${key} does not match any live topic or known alias target (${value})`);
      continue;
    }
  }

  for (const [aliasKey, aliasValue] of declaredAliases.entries()) {
    if (!(aliasKey in ProtocolMarkdownMap)) {
      errors.push(`Declared ProtocolMarkdown alias ${aliasKey} is missing from ProtocolMarkdownMap`);
      continue;
    }
    if (ProtocolMarkdownMap[aliasKey] !== aliasValue) {
      errors.push(`Declared ProtocolMarkdown alias ${aliasKey} does not match the map value ${ProtocolMarkdownMap[aliasKey]}`);
    }
  }

  if (missingEntries.length) {
    errors.push(
      `missing ProtocolMarkdownMap entries for ${missingEntries.length} live topics`,
      ...missingEntries.slice(0, 10).map(entry => `  - ${entry.id} (${entry.path})`),
    );
  }

  if (aliases.length) {
    warnings.push(
      `found ${aliases.length} declared alias map entry${aliases.length === 1 ? '' : 's'}`,
      ...aliases.map(alias => `  - ${alias.key} -> ${alias.value} (${alias.liveIdsForPath.join(', ')})`),
    );
  }

  return { errors, warnings, aliases, missingEntries, omittedTopics };
}

function validateHelperInventory(catalog) {
  const helperPath = path.resolve(repoRoot, 'research', 'protocol_content_map.json');
  if (!fs.existsSync(helperPath)) {
    return { warnings: ['helper inventory missing: research/protocol_content_map.json'], stale: false };
  }

  let helper;
  try {
    helper = JSON.parse(fs.readFileSync(helperPath, 'utf8'));
  } catch (error) {
    return { warnings: [`helper inventory unreadable: ${error.message}`], stale: true };
  }

  const helperTopicIds = new Set((helper.topics || []).map(topic => topic.id).filter(Boolean));
  const liveTopicIds = new Set(catalog.topics.map(topic => topic.id));

  const missingInHelper = [...liveTopicIds].filter(id => !helperTopicIds.has(id));
  const extraInHelper = [...helperTopicIds].filter(id => !liveTopicIds.has(id));
  const stale = missingInHelper.length > 0 || extraInHelper.length > 0;
  const warnings = [];

  if (stale) {
    warnings.push(
      `helper inventory is stale: ${missingInHelper.length} live topics missing and ${extraInHelper.length} helper-only topics present`,
    );
  }

  return { warnings, stale, missingInHelper, extraInHelper, generatedAt: helper.generatedAt || null };
}

function main() {
  const catalog = collectLiveCatalog();
  const liveIds = catalog.allItems.map(item => item.id);

  const slugErrors = validateSlugList(liveIds);
  const { errors: mapErrors, warnings: mapWarnings, aliases, missingEntries, omittedTopics } = validateProtocolMarkdownMap(catalog);
  const helperCheck = validateHelperInventory(catalog);

  const allErrors = [...slugErrors, ...mapErrors];
  const allWarnings = [...mapWarnings, ...helperCheck.warnings];

  if (allWarnings.length) {
    console.warn('[schema-integrity] warnings:');
    for (const warning of allWarnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (allErrors.length) {
    console.error('[schema-integrity] errors:');
    for (const error of allErrors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`[schema-integrity] slugList matched ${liveIds.length} live ids.`);
  console.log(`[schema-integrity] protocol map validated ${Object.keys(ProtocolMarkdownMap).length} entries.`);
  console.log(`[schema-integrity] omitted topics: ${omittedTopics.length}. unexpected missing entries: ${missingEntries.length}. alias entries: ${aliases.length}.`);
  if (helperCheck.generatedAt) {
    console.log(`[schema-integrity] helper inventory generated at ${helperCheck.generatedAt}.`);
  }
}

main();
