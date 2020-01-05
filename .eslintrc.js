const path = require("path")

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jest: true,
    commonjs: true,
  },
  globals: {
    window: true,
    document: true,
    describe: true,
    it: true,
    test: true,
    mount: true,
    render: true,
    shallow: true,
  },
  parser: "@typescript-eslint/parser",
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      webpack: {
        paths: ["src", "tests"],
        config: path.resolve("./webpack.config.dev.js"),
      },
    },
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  rules: {
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
  },
  extends: ["plugin:import/typescript", "@alexseitsinger/eslint-config"],
}
