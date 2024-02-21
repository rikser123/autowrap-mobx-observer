module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      diagnostics: false,
      babelConfig: true,
    },
  },
  moduleFileExtensions: ["js", "ts", "json", "tsx"],
  moduleDirectories: ["node_modules", "src"],
  transformIgnorePatterns: ["/node_modules/objection"],
  testRegex: "([/src/].*(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
};
