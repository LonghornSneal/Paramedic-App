import { AbbreviationGroups } from '../../Data/AbbreviationGroups.js';
import { CricothyrotomyContent } from '../../Data/CricothyrotomyContent.js';

const DETAIL_SECTION_KEYS = [
    'class',
    'concentration',
    'indications',
    'contraindications',
    'precautions',
    'sideEffects',
    'adultRx',
    'pediatricRx'
];

const detailLinesCache = new Map();
const detailLinesPromiseCache = new Map();
const markdownTextCache = new Map();
const markdownTextPromiseCache = new Map();

function normalizeText(value) {
    return `${value ?? ''}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function tokenize(value) {
    return normalizeText(value)
        .split(' ')
        .filter(token => token.length >= 3);
}

function stripLineFormatting(value) {
    return `${value ?? ''}`
        .replace(/\r/g, '')
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^\s*[-*]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/<\/?[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/\s+/g, ' ')
        .trim();
}

function splitCleanLines(value) {
    return `${value ?? ''}`
        .split(/\r?\n/)
        .map(stripLineFormatting)
        .filter(Boolean);
}

function pushValueLines(value, target) {
    if (Array.isArray(value)) {
        value.forEach(entry => pushValueLines(entry, target));
        return;
    }
    if (value && typeof value === 'object') {
        Object.values(value).forEach(entry => pushValueLines(entry, target));
        return;
    }
    splitCleanLines(value).forEach(line => target.push(line));
}

function uniqueLines(lines) {
    const seen = new Set();
    return lines.filter(line => {
        const key = line.toLowerCase();
        if (!line || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function buildStructuredDetailLines(entry) {
    const details = entry?.details || {};
    const lines = [];
    DETAIL_SECTION_KEYS.forEach(key => pushValueLines(details[key], lines));
    if (!lines.length) {
        pushValueLines(entry?.description, lines);
    }
    return uniqueLines(lines);
}

function buildAbbreviationLines(groupId) {
    const group = AbbreviationGroups?.[groupId];
    if (!group?.items?.length) return [];
    return uniqueLines(group.items.map(item => {
        const term = stripLineFormatting(item.term);
        const abbrev = stripLineFormatting(item.abbrev);
        return [term, abbrev].filter(Boolean).join(' : ');
    }).filter(Boolean));
}

function collectCricRenderableLines(value, target, parentKey = '') {
    if (Array.isArray(value)) {
        value.forEach(entry => collectCricRenderableLines(entry, target, parentKey));
        return;
    }
    if (value && typeof value === 'object') {
        Object.entries(value).forEach(([key, entry]) => {
            if (['id', 'href', 'src', 'type', 'references', 'credit', 'sourceNote'].includes(key)) {
                return;
            }
            collectCricRenderableLines(entry, target, key);
        });
        return;
    }
    const cleaned = stripLineFormatting(value);
    if (!cleaned) return;
    if (parentKey === 'image') return;
    target.push(cleaned);
}

function buildCricothyrotomyLines(details = {}) {
    const variants = Array.isArray(CricothyrotomyContent?.variants) ? CricothyrotomyContent.variants : [];
    const variantId = details.variant || 'adult';
    const variantData = variants.find(variant => variant.id === variantId) || variants[0];
    if (!variantData) return [];
    const sections = Array.isArray(variantData.sections) && variantData.sections.length
        ? variantData.sections
        : [variantData];
    const visibleSections = details.section
        ? sections.filter(section => section.id === details.section)
        : sections;
    const lines = [];
    (visibleSections.length ? visibleSections : sections).forEach(section => {
        collectCricRenderableLines(section, lines);
    });
    return uniqueLines(lines);
}

function normalizeHeading(value = '') {
    const subscriptDigits = '\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089';
    const raw = value.toString().trim();
    const withDigits = raw.replace(/[\u2080-\u2089]/g, char => {
        const idx = subscriptDigits.indexOf(char);
        return idx === -1 ? char : String(idx);
    });
    const collapsed = withDigits.replace(/\s+/g, ' ');
    const normalized = typeof collapsed.normalize === 'function' ? collapsed.normalize('NFKD') : collapsed;
    return normalized.toLowerCase();
}

function parseMarkdownSections(md) {
    const lines = md.split(/\r?\n/);
    const sections = [];
    let current = { title: '', lines: [] };
    lines.forEach(raw => {
        const headingMatch = raw.match(/^##\s+(.+)/);
        if (headingMatch) {
            if (current.title || current.lines.some(line => line.trim())) {
                sections.push(current);
            }
            current = { title: stripLineFormatting(headingMatch[1]), lines: [] };
            return;
        }
        current.lines.push(raw);
    });
    if (current.title || current.lines.some(line => line.trim())) {
        sections.push(current);
    }
    return sections;
}

function selectMarkdownSections(sections, entry) {
    const details = entry?.details || {};
    if (!details.equipment) {
        return sections;
    }
    const desiredTitles = Array.isArray(details.sectionTitles)
        ? details.sectionTitles
        : details.sectionTitle
            ? [details.sectionTitle]
            : entry?.title
                ? [entry.title]
                : [];
    const normalizedTargets = desiredTitles
        .map(normalizeHeading)
        .filter(Boolean);
    if (!normalizedTargets.length) {
        return sections;
    }
    const matches = [];
    normalizedTargets.forEach(target => {
        const match = sections.find(section => normalizeHeading(section.title) === target);
        if (match) matches.push(match);
    });
    return matches.length ? matches : sections;
}

function buildMarkdownLines(md, entry) {
    const sections = selectMarkdownSections(parseMarkdownSections(md), entry);
    const lines = [];
    if (Array.isArray(entry?.details?.cheat)) {
        pushValueLines(entry.details.cheat, lines);
    }
    if (!sections.length) {
        pushValueLines(md, lines);
        return uniqueLines(lines);
    }
    sections.forEach(section => {
        if (section.title) {
            lines.push(section.title);
        }
        section.lines.forEach(rawLine => {
            const cleaned = stripLineFormatting(rawLine);
            if (cleaned) lines.push(cleaned);
        });
    });
    return uniqueLines(lines);
}

async function loadMarkdownText(mdPath) {
    if (!mdPath) return '';
    if (markdownTextCache.has(mdPath)) return markdownTextCache.get(mdPath);
    if (markdownTextPromiseCache.has(mdPath)) return markdownTextPromiseCache.get(mdPath);
    const promise = fetch(mdPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${mdPath}`);
            }
            return response.text();
        })
        .then(text => {
            markdownTextCache.set(mdPath, text);
            markdownTextPromiseCache.delete(mdPath);
            return text;
        })
        .catch(error => {
            markdownTextPromiseCache.delete(mdPath);
            throw error;
        });
    markdownTextPromiseCache.set(mdPath, promise);
    return promise;
}

function getCachedDetailLines(entry) {
    if (!entry?.id) return [];
    if (detailLinesCache.has(entry.id)) return detailLinesCache.get(entry.id);

    const details = entry.details || {};
    let lines = null;
    if (details.abbreviationGroup) {
        lines = buildAbbreviationLines(details.abbreviationGroup);
    } else if (details.render === 'cricothyrotomy') {
        lines = buildCricothyrotomyLines(details);
    } else if (details.mdPath) {
        if (!markdownTextCache.has(details.mdPath)) {
            return null;
        }
        lines = buildMarkdownLines(markdownTextCache.get(details.mdPath), entry);
    } else {
        lines = buildStructuredDetailLines(entry);
    }

    detailLinesCache.set(entry.id, uniqueLines(lines || []));
    return detailLinesCache.get(entry.id);
}

function lineMatchesSearch(line, searchTerm) {
    const normalizedSearch = normalizeText(searchTerm);
    if (!normalizedSearch) return false;
    const normalizedLine = normalizeText(line);
    if (!normalizedLine) return false;
    if (normalizedLine.includes(normalizedSearch)) return true;
    const searchTokens = tokenize(searchTerm);
    if (!searchTokens.length) return false;
    const lineTokens = tokenize(line);
    return searchTokens.every(token => lineTokens.some(lineToken => (
        lineToken.includes(token) || token.includes(lineToken)
    )));
}

export function getSearchPreview(entry, searchTerm) {
    const lines = getCachedDetailLines(entry);
    if (Array.isArray(lines) && lines.length) {
        const matchingLine = lines.find(line => lineMatchesSearch(line, searchTerm));
        if (matchingLine) {
            return matchingLine;
        }
    }
    const titleLine = stripLineFormatting(entry?.title);
    return lineMatchesSearch(titleLine, searchTerm) ? titleLine : '';
}

export function needsAsyncSearchPreview(entry) {
    return Boolean(entry?.details?.mdPath) && !detailLinesCache.has(entry.id);
}

export async function ensureSearchPreviewContent(entry) {
    const cached = getCachedDetailLines(entry);
    if (cached !== null) {
        return cached;
    }
    if (!entry?.details?.mdPath) {
        return [];
    }
    if (detailLinesPromiseCache.has(entry.id)) {
        return detailLinesPromiseCache.get(entry.id);
    }
    const promise = loadMarkdownText(entry.details.mdPath)
        .then(md => {
            const lines = buildMarkdownLines(md, entry);
            detailLinesCache.set(entry.id, lines);
            detailLinesPromiseCache.delete(entry.id);
            return lines;
        })
        .catch(error => {
            console.warn('search preview load failed', entry.details.mdPath, error);
            detailLinesCache.set(entry.id, []);
            detailLinesPromiseCache.delete(entry.id);
            return [];
        });
    detailLinesPromiseCache.set(entry.id, promise);
    return promise;
}

export function resetSearchPreviewCache() {
    detailLinesCache.clear();
    detailLinesPromiseCache.clear();
    markdownTextCache.clear();
    markdownTextPromiseCache.clear();
}
