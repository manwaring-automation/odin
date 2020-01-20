module.exports = {
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*/sample-data/**/*'],
  coverageThreshold: { global: { lines: 70 } }
};
