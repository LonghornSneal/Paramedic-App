import compat from "eslint-plugin-compat";
import globals from "globals";

export default [
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
    },
  },
];