const config = require('piral-jest-utils').default;

module.exports = {
  ...config,
  moduleNameMapper: {
    ...config.moduleNameMapper,
    './external$': '<rootDir>/src/tooling/piral-cli/lib/external/index.js',
  },
};
