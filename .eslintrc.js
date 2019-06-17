const path = require("path")

module.exports = {
  root: true,
  settings: {
    "import/ignored": [
      "node_modules",
    ],
    "import/resolver": {
      webpack: {
        config: path.resolve("./webpack.config.js")
      },
    },
  },
  extends: [
    "@alexseitsinger/eslint-config",
  ]
};
