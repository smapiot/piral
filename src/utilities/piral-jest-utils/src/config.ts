import type { Config } from '@jest/types';
import { resolve } from 'path';

const config: Config.InitialOptions = {
  collectCoverage: true,
  setupFiles: [resolve(__dirname, 'setupBefore.js')],
  setupFilesAfterEnv: [resolve(__dirname, 'setupAfter.js')],
  roots: ['src/'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.codegen$': resolve(__dirname, 'codegen.js'),
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(s?css)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png)$': resolve(__dirname, 'file.mock.js'),
  },
  globals: {
    NODE_ENV: 'test',
    'ts-jest': {
      diagnostics: false,
    },
  },
  verbose: true,
};

export default config;
