module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "ts", "tsx"],
  setupFiles: ["./jest.setup.js"],
  moduleNameMapper: {
    "^tests(.*)$": "<rootDir>/tests$1",
    "^src(.*)$": "<rootDir>/src$1",
  },
  transform: {
    "\\.tsx?$": "ts-jest",
  },
  testMatch: ["<rootDir>/tests/*.test.{ts,tsx}"],
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.jest.json",
    },
  },
}
