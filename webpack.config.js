const path = require("path")
const nodeExternals = require("webpack-node-externals")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  target: "node",
  devtool: false,
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
    libraryTarget: "commonjs2",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      src: path.resolve("./src"),
      tests: path.resolve("./tests"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        include: [path.resolve("./src")],
        use: ["babel-loader", "ts-loader"],
      },
    ],
  },
  externals: [
    nodeExternals({
      modulesFromFile: {
        exclude: ["dependencies"],
        include: [
          "devDependencies",
          "peerDependencies",
          "optionalDependencies",
        ],
      },
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: false,
        extractComments: false,
        terserOptions: {
          warnings: false,
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
}
