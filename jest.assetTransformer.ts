const path = require("path")

module.exports = {
  process: (src: string, filename: string) =>
    `module.exports = ${JSON.stringify(path.basename(filename))};`,
}
