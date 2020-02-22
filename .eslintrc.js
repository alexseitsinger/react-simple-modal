const path = require("path")

const typescriptConfig = require("./.eslintrc-typescript")
const packageConfig = require("./.eslintrc-package")
const markdownConfig = require("./.eslintrc-markdown")
const javascriptConfig = require("./.eslintrc-javascript")

module.exports = {
  overrides: [
    {
      files: ["*.js", "*.jsx"],
      ...javascriptConfig,
    },
    {
      files: ["*.ts", "*.tsx"],
      ...typescriptConfig,
    },
    {
      files: ["package.json"],
      ...packageConfig,
    },
    {
      files: ["*.md"],
      ...markdownConfig,
    },
  ],
}
