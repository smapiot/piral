module.exports = {
  collectCoverage: true,
  roots: [
    'packages/',
  ],
  transform: {
    '^.+\\.(ts|tsx?)$': 'ts-jest',
    '^.+\\.js?$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  globals: {
    NODE_ENV: 'test',
    'ts-jest': {
      diagnostics: false,
    },
  },
  testURL: 'http://localhost',
  verbose: true
};
