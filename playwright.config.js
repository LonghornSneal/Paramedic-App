const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './dev-tools/tests',
  testMatch: '**/*.spec.js',
  globalSetup: require.resolve('./dev-tools/tests/utils/playwrightGlobalSetup.cjs'),
  globalTeardown: require.resolve('./dev-tools/tests/utils/playwrightGlobalTeardown.cjs'),
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
  },
});
