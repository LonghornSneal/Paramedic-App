import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const liveDetailRenderer = path.join(repoRoot, 'Features', 'detail', 'DetailPage.js');
const duplicateTreeRoot = path.join(repoRoot, 'Features', 'detail', 'DetailPage');

function collectFiles(rootDir) {
  if (!statSync(rootDir, { throwIfNoEntry: false })) {
    return [];
  }
  const entries = readdirSync(rootDir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(fullPath);
    }
    return [fullPath];
  });
}

test('detail renderer uses only the canonical root file', () => {
  assert.ok(statSync(liveDetailRenderer, { throwIfNoEntry: false }), 'expected live detail renderer to exist');
  const duplicateFiles = collectFiles(duplicateTreeRoot);
  assert.equal(duplicateFiles.length, 0, `expected duplicate detail tree to stay removed, found: ${duplicateFiles.join(', ')}`);
});
