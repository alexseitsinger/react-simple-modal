const path = require("path")

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jest: true,
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
  settings: {
    "import/ignored": [
      "node_modules",
    ],
    "import/resolver": {
      webpack: {
        config: path.resolve("./webpack.config.dev.js")
      },
    },
  },
  extends: [
    "@alexseitsinger/eslint-config-base",
    "@alexseitsinger/eslint-config-react",
  ]
};
