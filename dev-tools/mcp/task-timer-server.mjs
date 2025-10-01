#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SERVER_INFO = {
  name: "task-timer",
  version: "0.3.0"
};

const TOOL_NAME = "task_timer";
const TOOL_DESCRIPTION = "Track durations for workflow steps, flag bottlenecks, and analyse improvements over time.";
const TOOL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["action"],
  properties: {
    action: {
      type: "string",
      description: "Operation to perform: start, stop, status, history, report, or reset"
    },
    taskName: {
      type: "string",
      description: "Task label that groups related steps together"
    },
    taskId: {
      type: "string",
      description: "Optional explicit task identifier when task names may repeat"
    },
    stepName: {
      type: "string",
      description: "Name/description of the active step when starting the timer"
    },
    stepType: {
      type: "string",
      description: "Optional categorisation for the step (e.g., thought, action, research, edit)"
    },
    tags: {
      anyOf: [
        {
          type: "array",
          items: {
            type: "string"
          }
        },
        {
          type: "string"
        }
      ],
      description: "Optional tags (e.g., experiment:timer-v3) applied to the step"
    },
    experimentId: {
      type: "string",
      description: "Explicit experiment identifier if not supplied via tags"
    },
    note: {
      type: "string",
      description: "Optional note to attach to the start or stop event"
    },
    autoStop: {
      type: "boolean",
      description: "When starting, automatically stop the current step if one is active"
    },
    errors: {
      type: "number",
      minimum: 0,
      description: "Number of errors encountered during the step"
    },
    result: {
      type: "string",
      description: "Summary outcome for the step (e.g., success, needs-followup)"
    },
    limit: {
      type: "integer",
      minimum: 0,
      description: "Number of history entries to include in the response (0 returns all entries)"
    },
    flagsOnly: {
      type: "boolean",
      description: "When requesting status/history, only return entries that meet flag criteria. Defaults to true."
    },
    includeSummary: {
      type: "boolean",
      description: "Include aggregated summary details in status/history/report responses. Defaults to true."
    },
    top: {
      type: "integer",
      minimum: 1,
      description: "Limit the number of flagged entries returned by report"
    },
    compareExperiment: {
      type: "string",
      description: "For report: focus comparisons on the specified experiment id"
    },
    confirm: {
      type: "string",
      description: "Type RESET to confirm a destructive reset"
    }
  }
};

const TOOL_DEFINITION = {
  name: TOOL_NAME,
  description: TOOL_DESCRIPTION,
  inputSchema: TOOL_SCHEMA
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const STORAGE_DIR = path.join(repoRoot, "dev-tools", "task-timer");
const STORAGE_FILE = path.join(STORAGE_DIR, "history.json");
const STATE_VERSION = 3;
const DURATION_FLAG_MS = 2 * 60 * 1000; // >2 minutes
const TASK_REPEAT_THRESHOLD = 5;
const CROSS_TASK_FLAG_MS = 3 * 60 * 1000; // >=3 minutes
const CROSS_TASK_THRESHOLD = 3;

const FLAG_CODES = {
  LONG_DURATION: "duration_over_2m",
  REPEAT_IN_TASK: "repeat_5_in_task",
  REPEAT_ACROSS_TASKS: "repeat_3_tasks_3m"
};

const DEFAULT_METRICS = {
  steps: {},
  experiments: {},
  updatedAt: null
};

const DEFAULT_STATE = {
  version: STATE_VERSION,
  active: null,
  history: [],
  metrics: structuredClone(DEFAULT_METRICS),
  lastUpdated: null
};

async function ensureStorageDir() {
  await mkdir(STORAGE_DIR, { recursive: true });
}

async function readState() {
  await ensureStorageDir();
  try {
    await access(STORAGE_FILE);
  } catch (error) {
    return structuredClone(DEFAULT_STATE);
  }
  try {
    const raw = await readFile(STORAGE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return upgradeState(parsed);
  } catch (error) {
    return structuredClone(DEFAULT_STATE);
  }
}

function structuredClone(object) {
  return JSON.parse(JSON.stringify(object));
}

function upgradeState(stateInput) {
  const state = {
    ...structuredClone(DEFAULT_STATE),
    ...stateInput
  };
  state.version = STATE_VERSION;
  if (!Array.isArray(state.history)) {
    state.history = [];
  }
  state.history = state.history.map(upgradeEntry);
  if (state.active) {
    state.active = upgradeActive(state.active);
  }
  state.metrics = rebuildMetrics(state.history);
  return state;
}

function upgradeActive(activeInput) {
  const active = { ...activeInput };
  active.taskId = cleanString(active.taskId);
  active.taskName = cleanString(active.taskName);
  active.stepName = cleanString(active.stepName) ?? "Unnamed step";
  active.stepType = cleanString(active.stepType);
  active.startedAt = active.startedAt ?? nowIso();
  active.startNote = cleanString(active.startNote);
  active.tags = normaliseTags(active.tags);
  active.experimentId = cleanString(active.experimentId) ?? extractExperiment(active.tags);
  return active;
}

function upgradeEntry(entryInput) {
  const entry = { ...entryInput };
  entry.taskId = cleanString(entry.taskId);
  entry.taskName = cleanString(entry.taskName);
  entry.stepName = cleanString(entry.stepName) ?? "Unnamed step";
  entry.stepType = cleanString(entry.stepType);
  entry.startedAt = entry.startedAt ?? nowIso();
  entry.endedAt = entry.endedAt ?? entry.startedAt;
  entry.durationMs = safeDurationMs(entry.startedAt, entry.endedAt, entry.durationMs);
  entry.durationSeconds = Number(((entry.durationMs ?? 0) / 1000).toFixed(3));
  entry.durationReadable = entry.durationReadable ?? formatDuration(entry.durationMs);
  entry.startNote = cleanString(entry.startNote);
  entry.stopNote = cleanString(entry.stopNote);
  entry.tags = normaliseTags(entry.tags);
  entry.experimentId = cleanString(entry.experimentId) ?? extractExperiment(entry.tags);
  entry.errors = toNumber(entry.errors) ?? 0;
  entry.result = cleanString(entry.result);
  entry.flags = Array.isArray(entry.flags) ? entry.flags : [];
  entry.flagDetails = Array.isArray(entry.flagDetails) ? entry.flagDetails : [];
  entry.flagged = Boolean(entry.flagged || entry.flags.length);
  entry.counts = entry.counts ?? {
    repeatsInTask: 0,
    crossTaskLongRuns: 0
  };
  entry.id = entry.id ?? `step-${new Date(entry.endedAt).getTime()}`;
  return entry;
}

function rebuildMetrics(history) {
  const metrics = structuredClone(DEFAULT_METRICS);
  for (const entry of history) {
    updateMetrics(metrics, entry);
  }
  metrics.updatedAt = nowIso();
  return metrics;
}

async function writeState(stateInput) {
  await ensureStorageDir();
  const state = {
    ...stateInput,
    version: STATE_VERSION
  };
  const payload = JSON.stringify(state, null, 2);
  await writeFile(STORAGE_FILE, payload, "utf8");
}

function nowIso() {
  return new Date().toISOString();
}

function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function formatDuration(durationMs) {
  const safeMs = Number.isFinite(durationMs) && durationMs > 0 ? durationMs : 0;
  const totalSeconds = safeMs / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;
  const parts = [];
  if (hours) {
    parts.push(`${hours}h`);
  }
  if (minutes) {
    parts.push(`${minutes}m`);
  }
  const secondsRounded = seconds.toFixed(1);
  parts.push(`${Number.parseFloat(secondsRounded)}s`);
  return parts.join(" ");
}

function cleanString(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normaliseTags(input) {
  if (!input) {
    return [];
  }
  let values = [];
  if (Array.isArray(input)) {
    values = input;
  } else if (typeof input === "string") {
    values = input.split(/[,;]+/);
  }
  const normalised = values
    .map(tag => cleanString(tag))
    .filter(Boolean);
  return Array.from(new Set(normalised));
}

function extractExperiment(tags) {
  if (!Array.isArray(tags)) {
    return null;
  }
  const match = tags.find(tag => tag.startsWith("experiment:"));
  return match ? match.slice("experiment:".length) : null;
}

function taskKey(entry) {
  return entry.taskId ?? entry.taskName ?? null;
}

function stepKey(entry) {
  return normaliseName(entry.stepName ?? "");
}

function normaliseName(name) {
  return (name ?? "").trim().toLowerCase();
}

function safeDurationMs(startedAt, endedAt, fallback) {
  if (typeof fallback === "number" && Number.isFinite(fallback)) {
    return Math.max(0, fallback);
  }
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
  if (Number.isFinite(start) && Number.isFinite(end)) {
    return Math.max(0, end - start);
  }
  return 0;
}

function evaluateFlags(candidate, history) {
  const flags = [];
  const details = [];
  const nameKey = normaliseName(candidate.stepName);
  const candidateTaskKey = taskKey(candidate);

  if (candidate.durationMs >= DURATION_FLAG_MS) {
    flags.push(FLAG_CODES.LONG_DURATION);
    details.push(`Duration ${formatDuration(candidate.durationMs)} exceeds 2 minute threshold.`);
  }

  const repeatsInTask = history.filter(entry => taskKey(entry) === candidateTaskKey && normaliseName(entry.stepName) === nameKey).length + 1;
  if (candidateTaskKey && repeatsInTask >= TASK_REPEAT_THRESHOLD) {
    flags.push(FLAG_CODES.REPEAT_IN_TASK);
    details.push(`Step repeated ${repeatsInTask} times within task '${candidate.taskName ?? candidate.taskId}'.`);
  }

  const crossTaskSet = new Set();
  for (const entry of history) {
    if (normaliseName(entry.stepName) === nameKey && entry.durationMs >= CROSS_TASK_FLAG_MS) {
      const key = taskKey(entry);
      if (key) {
        crossTaskSet.add(key);
      }
    }
  }
  if (candidate.durationMs >= CROSS_TASK_FLAG_MS && candidateTaskKey) {
    crossTaskSet.add(candidateTaskKey);
  }
  const crossTaskCount = crossTaskSet.size;
  if (crossTaskCount >= CROSS_TASK_THRESHOLD) {
    flags.push(FLAG_CODES.REPEAT_ACROSS_TASKS);
    details.push(`Step exceeded ${formatDuration(CROSS_TASK_FLAG_MS)} in ${crossTaskCount} different tasks.`);
  }

  return {
    flags,
    details,
    counts: {
      repeatsInTask,
      crossTaskLongRuns: crossTaskCount
    }
  };
}

function updateMetrics(metrics, entry) {
  const stepId = stepKey(entry);
  if (!metrics.steps[stepId]) {
    metrics.steps[stepId] = {
      stepName: entry.stepName,
      totalRuns: 0,
      totalDurationMs: 0,
      totalErrors: 0,
      flaggedCounts: {
        [FLAG_CODES.LONG_DURATION]: 0,
        [FLAG_CODES.REPEAT_IN_TASK]: 0,
        [FLAG_CODES.REPEAT_ACROSS_TASKS]: 0
      },
      tasks: {},
      experiments: {}
    };
  }
  const stepMetrics = metrics.steps[stepId];
  stepMetrics.totalRuns += 1;
  stepMetrics.totalDurationMs += entry.durationMs;
  stepMetrics.totalErrors += entry.errors ?? 0;
  for (const flag of entry.flags ?? []) {
    if (stepMetrics.flaggedCounts[flag] !== undefined) {
      stepMetrics.flaggedCounts[flag] += 1;
    }
  }
  const tKey = taskKey(entry) ?? "__unknown_task";
  stepMetrics.tasks[tKey] = (stepMetrics.tasks[tKey] ?? 0) + 1;

  const experimentId = entry.experimentId;
  if (experimentId) {
    if (!metrics.experiments[experimentId]) {
      metrics.experiments[experimentId] = {};
    }
    if (!metrics.experiments[experimentId][stepId]) {
      metrics.experiments[experimentId][stepId] = {
        stepName: entry.stepName,
        totalRuns: 0,
        totalDurationMs: 0,
        totalErrors: 0,
        flaggedCounts: {
          [FLAG_CODES.LONG_DURATION]: 0,
          [FLAG_CODES.REPEAT_IN_TASK]: 0,
          [FLAG_CODES.REPEAT_ACROSS_TASKS]: 0
        }
      };
    }
    const expMetrics = metrics.experiments[experimentId][stepId];
    expMetrics.totalRuns += 1;
    expMetrics.totalDurationMs += entry.durationMs;
    expMetrics.totalErrors += entry.errors ?? 0;
    for (const flag of entry.flags ?? []) {
      if (expMetrics.flaggedCounts[flag] !== undefined) {
        expMetrics.flaggedCounts[flag] += 1;
      }
    }
    stepMetrics.experiments[experimentId] = (stepMetrics.experiments[experimentId] ?? 0) + 1;
  }
}

function buildSummary(history, metrics) {
  const flaggedEntries = history.filter(entry => entry.flagged);
  const summary = {
    totalEntries: history.length,
    flaggedEntries: flaggedEntries.length,
    flagsByType: {},
    thresholds: {
      durationFlagMs: DURATION_FLAG_MS,
      repeatInTaskThreshold: TASK_REPEAT_THRESHOLD,
      crossTaskFlagMs: CROSS_TASK_FLAG_MS,
      crossTaskThreshold: CROSS_TASK_THRESHOLD
    },
    averageErrorRate: calculateErrorRate(history)
  };
  for (const code of Object.values(FLAG_CODES)) {
    summary.flagsByType[code] = flaggedEntries.filter(entry => entry.flags.includes(code)).length;
  }
  if (metrics) {
    summary.updatedAt = metrics.updatedAt;
  }
  return summary;
}

function calculateErrorRate(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return 0;
  }
  const totalErrors = entries.reduce((sum, entry) => sum + (entry.errors ?? 0), 0);
  return Number((totalErrors / entries.length).toFixed(3));
}

function successResponse(payload) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2)
      }
    ]
  };
}

function errorResponse(message) {
  return {
    content: [{ type: "text", text: message }],
    isError: true
  };
}

async function handleStart(args) {
  const stepName = cleanString(args.stepName);
  if (!stepName) {
    return errorResponse("stepName is required to start the timer.");
  }
  const taskName = cleanString(args.taskName);
  const taskId = cleanString(args.taskId);
  if (!taskName && !taskId) {
    return errorResponse("Provide taskName or taskId so repeated work can be analysed.");
  }
  const stepType = cleanString(args.stepType);
  const startNote = cleanString(args.note);
  const autoStop = Boolean(args.autoStop);
  const tags = normaliseTags(args.tags);
  const experimentId = cleanString(args.experimentId) ?? extractExperiment(tags);

  const state = await readState();
  const startedAt = nowIso();

  if (state.active) {
    if (!autoStop) {
      return errorResponse("A step is already active. Stop it first or provide autoStop: true.");
    }
    const entry = finaliseActive(state.active, startedAt, "Auto-stopped by start.", state.history, {});
    state.history.push(entry);
    updateMetrics(state.metrics, entry);
  }

  state.active = {
    taskId,
    taskName,
    stepName,
    stepType,
    startedAt,
    startNote,
    tags,
    experimentId
  };
  state.lastUpdated = startedAt;
  await writeState(state);

  return successResponse({
    message: `Started step '${stepName}'`,
    active: state.active,
    historyCount: state.history.length,
    stateVersion: state.version
  });
}

function finaliseActive(active, endedAt, stopNote, history, stopArgs) {
  const entry = {
    id: `step-${new Date(endedAt).getTime()}`,
    taskId: active.taskId ?? null,
    taskName: active.taskName ?? null,
    stepName: active.stepName,
    stepType: active.stepType ?? null,
    startedAt: active.startedAt,
    endedAt,
    startNote: active.startNote ?? null,
    stopNote: cleanString(stopNote),
    tags: normaliseTags(active.tags),
    experimentId: cleanString(active.experimentId) ?? extractExperiment(active.tags)
  };
  entry.durationMs = safeDurationMs(entry.startedAt, entry.endedAt);
  entry.durationSeconds = Number((entry.durationMs / 1000).toFixed(3));
  entry.durationReadable = formatDuration(entry.durationMs);
  entry.errors = toNumber(stopArgs.errors) ?? 0;
  entry.result = cleanString(stopArgs.result);
  const evaluation = evaluateFlags(entry, history);
  entry.flags = evaluation.flags;
  entry.flagDetails = evaluation.details;
  entry.flagged = entry.flags.length > 0;
  entry.counts = evaluation.counts;
  return entry;
}

async function handleStop(args) {
  const state = await readState();
  if (!state.active) {
    return errorResponse("No active step to stop.");
  }
  const endedAt = nowIso();
  const stopNote = cleanString(args.note);
  const entry = finaliseActive(state.active, endedAt, stopNote, state.history, args);
  state.history.push(entry);
  updateMetrics(state.metrics, entry);
  state.active = null;
  state.lastUpdated = endedAt;
  state.metrics.updatedAt = endedAt;
  await writeState(state);

  return successResponse({
    message: `Stopped step '${entry.stepName}'`,
    lastEntry: entry,
    historyCount: state.history.length,
    flaggedEntries: state.history.filter(item => item.flagged).length,
    stateVersion: state.version
  });
}

function sliceHistory(history, limit) {
  if (!Array.isArray(history) || history.length === 0) {
    return [];
  }
  if (limit === 0) {
    return [...history];
  }
  const safeLimit = limit && limit > 0 ? limit : 10;
  return history.slice(-safeLimit);
}

async function handleStatus(args) {
  const state = await readState();
  const limitRaw = toNumber(args.limit);
  const limit = typeof limitRaw === "number" && limitRaw >= 0 ? limitRaw : undefined;
  const flagsOnly = args.flagsOnly === undefined ? true : Boolean(args.flagsOnly);
  const includeSummary = args.includeSummary === undefined ? true : Boolean(args.includeSummary);

  const allHistory = state.history.map(entry => upgradeEntry(entry));
  const filteredHistory = flagsOnly ? allHistory.filter(entry => entry.flagged) : allHistory;
  const history = sliceHistory(filteredHistory, limit);
  const summary = includeSummary ? buildSummary(allHistory, state.metrics) : undefined;

  return successResponse({
    message: flagsOnly ? "Flagged timer entries" : "Timer status",
    active: state.active,
    history,
    historyCount: history.length,
    filteredTotal: filteredHistory.length,
    totalEntries: allHistory.length,
    summary,
    lastUpdated: state.lastUpdated,
    stateVersion: state.version
  });
}

async function handleReport(args) {
  const state = await readState();
  const allHistory = state.history.map(entry => upgradeEntry(entry));
  const scopeTaskName = cleanString(args.taskName);
  const scopeTaskId = cleanString(args.taskId);
  const scopeStepName = cleanString(args.stepName);
  const compareExperiment = cleanString(args.compareExperiment);
  const includeSummary = args.includeSummary === undefined ? true : Boolean(args.includeSummary);
  const topRaw = toNumber(args.top);
  const top = typeof topRaw === "number" && topRaw > 0 ? topRaw : undefined;

  let scoped = allHistory;
  if (scopeTaskName) {
    scoped = scoped.filter(entry => entry.taskName === scopeTaskName);
  }
  if (scopeTaskId) {
    scoped = scoped.filter(entry => entry.taskId === scopeTaskId);
  }
  if (scopeStepName) {
    const targetKey = normaliseName(scopeStepName);
    scoped = scoped.filter(entry => normaliseName(entry.stepName) === targetKey);
  }

  const flagged = scoped.filter(entry => entry.flagged);
  const flaggedLimited = top ? flagged.slice(-top) : flagged;
  const summary = includeSummary ? buildSummary(scoped, state.metrics) : undefined;
  const comparisons = buildComparisons(flagged, state.metrics, compareExperiment);
  const suggestions = buildSuggestions(flaggedLimited, comparisons);
  const errorRate = calculateErrorRate(scoped);

  return successResponse({
    message: "Timer analysis report",
    scope: {
      taskName: scopeTaskName,
      taskId: scopeTaskId,
      stepName: scopeStepName,
      compareExperiment
    },
    flaggedEntries: flaggedLimited,
    flaggedCount: flagged.length,
    totalScopedEntries: scoped.length,
    summary,
    comparisons,
    suggestions,
    errorRate,
    stateVersion: state.version
  });
}

function buildComparisons(entries, metrics, experimentId) {
  const comparisons = [];
  if (!entries.length) {
    return comparisons;
  }
  const stepGroups = new Map();
  for (const entry of entries) {
    const key = stepKey(entry);
    if (!stepGroups.has(key)) {
      stepGroups.set(key, []);
    }
    stepGroups.get(key).push(entry);
  }

  for (const [key, group] of stepGroups.entries()) {
    const stepMetrics = metrics.steps[key];
    if (!stepMetrics) {
      continue;
    }
    const totalRuns = stepMetrics.totalRuns || 1;
    const averageDurationMs = stepMetrics.totalDurationMs / totalRuns;
    const averageErrors = stepMetrics.totalErrors / totalRuns;
    const flaggedCount = group.length;
    const groupAverage = group.reduce((sum, entry) => sum + entry.durationMs, 0) / flaggedCount;
    const groupErrors = group.reduce((sum, entry) => sum + (entry.errors ?? 0), 0) / flaggedCount;

    const comparison = {
      stepName: stepMetrics.stepName,
      totalRuns,
      overallAverageMs: Number(averageDurationMs.toFixed(2)),
      overallAverageReadable: formatDuration(averageDurationMs),
      overallErrorRate: Number(averageErrors.toFixed(3)),
      flaggedRunCount: flaggedCount,
      flaggedAverageMs: Number(groupAverage.toFixed(2)),
      flaggedAverageReadable: formatDuration(groupAverage),
      flaggedErrorRate: Number(groupErrors.toFixed(3)),
      flagTypes: aggregateFlags(group)
    };

    const experiments = stepMetrics.experiments ?? {};
    if (Object.keys(experiments).length) {
      comparison.experiments = {};
      for (const [expId, runs] of Object.entries(experiments)) {
        const expMetrics = metrics.experiments[expId]?.[key];
        if (!expMetrics) {
          continue;
        }
        const avgMs = expMetrics.totalDurationMs / (expMetrics.totalRuns || 1);
        const avgErrors = expMetrics.totalErrors / (expMetrics.totalRuns || 1);
        comparison.experiments[expId] = {
          runs: expMetrics.totalRuns,
          averageMs: Number(avgMs.toFixed(2)),
          averageReadable: formatDuration(avgMs),
          errorRate: Number(avgErrors.toFixed(3))
        };
      }
    }

    if (experimentId && comparison.experiments?.[experimentId]) {
      comparison.focusExperiment = comparison.experiments[experimentId];
    }

    comparisons.push(comparison);
  }

  return comparisons;
}

function aggregateFlags(entries) {
  const counts = {
    [FLAG_CODES.LONG_DURATION]: 0,
    [FLAG_CODES.REPEAT_IN_TASK]: 0,
    [FLAG_CODES.REPEAT_ACROSS_TASKS]: 0
  };
  for (const entry of entries) {
    for (const flag of entry.flags ?? []) {
      if (counts[flag] !== undefined) {
        counts[flag] += 1;
      }
    }
  }
  return counts;
}

function buildSuggestions(entries, comparisons) {
  if (!entries.length) {
    return ["No flagged entries for this scope; timing looks healthy."];
  }
  const suggestions = [];
  const comparisonIndex = new Map();
  for (const item of comparisons) {
    comparisonIndex.set(normaliseName(item.stepName), item);
  }

  for (const entry of entries) {
    const stepId = normaliseName(entry.stepName);
    const comparison = comparisonIndex.get(stepId);
    const noteParts = [`Step '${entry.stepName}'`];
    if (entry.flags.includes(FLAG_CODES.LONG_DURATION)) {
      noteParts.push(`averages ${entry.durationReadable}; consider chunking the work, referencing prior outputs, or scripting repetitive portions.`);
    }
    if (entry.flags.includes(FLAG_CODES.REPEAT_IN_TASK)) {
      noteParts.push(`repeated ${entry.counts.repeatsInTask} times in this task—review if a cached reference or checklist would reduce duplication.`);
    }
    if (entry.flags.includes(FLAG_CODES.REPEAT_ACROSS_TASKS)) {
      noteParts.push(`appears across ${entry.counts.crossTaskLongRuns} tasks with >3 minute runs; evaluate whether an MCP helper or template would streamline it.`);
    }
    if ((entry.errors ?? 0) > 0) {
      noteParts.push(`logged ${entry.errors} error(s); double-check mitigation before optimising for speed.`);
    }
    if (comparison?.experiments) {
      const best = Object.entries(comparison.experiments)
        .sort((a, b) => a[1].averageMs - b[1].averageMs)[0];
      if (best) {
        noteParts.push(`fastest experiment so far: ${best[0]} averaging ${formatDuration(best[1].averageMs)} (error rate ${best[1].errorRate}).`);
      }
    }
    suggestions.push(noteParts.join(' '));
  }

  return suggestions;
}

async function handleReset(args) {
  const confirmValue = cleanString(args.confirm);
  if (confirmValue !== "RESET") {
    return errorResponse("Reset requires confirm: 'RESET'.");
  }
  const now = nowIso();
  const state = {
    version: STATE_VERSION,
    active: null,
    history: [],
    metrics: structuredClone(DEFAULT_METRICS),
    lastUpdated: now
  };
  await writeState(state);
  return successResponse({
    message: "Timer history cleared.",
    lastUpdated: now,
    stateVersion: state.version
  });
}

const ACTIONS = {
  start: handleStart,
  stop: handleStop,
  status: handleStatus,
  history: handleStatus,
  report: handleReport,
  reset: handleReset
};

const server = new Server(SERVER_INFO, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [TOOL_DEFINITION]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  if (name !== TOOL_NAME) {
    return errorResponse(`Unknown tool: ${name}`);
  }
  const actionKey = cleanString(args.action);
  if (!actionKey) {
    return errorResponse("Argument 'action' is required.");
  }
  const handler = ACTIONS[actionKey];
  if (!handler) {
    return errorResponse(`Unsupported action '${actionKey}'. Use start, stop, status, history, report, or reset.`);
  }
  try {
    return await handler(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(`Task timer error: ${message}`);
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
