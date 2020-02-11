const path = require("path")
const nodeExternals = require("webpack-node-externals")

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  target: "node",
  devtool: "source-map",
  output: {
    path: path.resolve("./dist"),
    filename: "[name].dev.js",
    sourceMapFilename: "[name].dev.js.map",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        include: [path.resolve("./src")],
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.dev.json",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      src: path.resolve("./src"),
      tests: path.resolve("./tests"),
    },
  },
  externals: [
    nodeExternals({
      modulesFromFile: {
        exclude: ["dependencies"],
        include: ["devDependencies", "peerDependencies"],
      },
    }),
  ],
}
