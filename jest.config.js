module.exports = {
  setupFiles: ["./jest.setup.js"],
  // snapshotSerializers: ["enzyme-to-json/serializer", "jest-emotion"],
  testRegex: "((/tests/(integration|unit).js)|(test.js))$",
  moduleNameMapper: {
    "\\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/jest.assetTransformer.js",
    "\\.(css|less)$": "<rootDir>/jest.assetTransformer.js",
  },
}
