const { spawnSync } = require('node:child_process');
const path = require('node:path');

const isWin = process.platform === 'win32';
const hintBin = path.resolve(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  isWin ? 'hint.cmd' : 'hint'
);

const result = spawnSync(hintBin, ['index.html'], {
  stdio: 'inherit',
  shell: false,
  env: {
    ...process.env,
    NO_UPDATE_NOTIFIER: '1'
  }
});

process.exit(result.status ?? 1);
