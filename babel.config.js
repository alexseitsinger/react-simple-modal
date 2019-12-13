module.exports = {
  presets: [
    ["@babel/preset-env", {
      "useBuiltIns": "entry",
      "corejs": 3
    }],
    "@babel/preset-react",
    ["@emotion/babel-preset-css-prop", {
      autoLabel: (process.env.NODE_ENV !== "production"),
      labelFormat: "[local]"
    }],
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-syntax-export-default-from",
    "@babel/plugin-syntax-export-namespace-from"
  ],
  env: {
    production: {
      plugins: [
        "babel-plugin-transform-react-remove-prop-types",
      ],
    },
  },
}
