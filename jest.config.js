module.exports = {
  collectCoverageFrom: ['app/**/*.ts', '!app/**/*/sample-data/**/*'],
  coverageThreshold: { global: { lines: 80 } }
};
