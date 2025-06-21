/* The configuration file for ESLint, the JavaScript linter. It defines coding standards and rules for the project (such as style guidelines or identifying potential errors). By using this config, developers can run ESLint to catch issues early and enforce a consistent code style across the codebase. (The .mjs extension indicates it’s an ES Module format config for modern ESLint versions.)
*/
// eslint.config.js
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
      },
    },
    rules: {
      // Add your custom rules here
    },
  },
];
