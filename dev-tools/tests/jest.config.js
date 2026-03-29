module.exports = {
  rootDir: '..',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  testPathIgnorePatterns: [
    '<rootDir>/tests/add.test.js',
    '<rootDir>/tests/slugify.test.js',
  ],
};
