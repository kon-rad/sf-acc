/* eslint-disable max-lines */
module.exports = {
  settings: {
    "import/resolver": {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  plugins: ["prefer-arrow", "import"],
  extends: [
    "next",
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:import/recommended",
  ],
  ignorePatterns: ["**/node_modules/", "**/.next/"],
  rules: {},
};
