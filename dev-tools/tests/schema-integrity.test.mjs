import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptPath = path.resolve(__dirname, '..', 'validate-schema-integrity.mjs');

test('schema integrity validator passes on the live tree', () => {
  const output = execFileSync(process.execPath, [scriptPath], { encoding: 'utf8' });

  assert.match(output, /slugList matched 317 live ids\./);
  assert.match(output, /protocol map validated 147 entries\./);
  assert.match(output, /alias entries: 1\./);
});
