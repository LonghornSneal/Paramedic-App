import compat from "eslint-plugin-compat";
import globals from "globals";

export default [
  {
    ignores: ["dev-tools/coverage/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      compat,
    },
    rules: {
      "compat/compat": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["dev-tools/**/*.js"],
    rules: {
      "no-console": "off",
    },
  },
];