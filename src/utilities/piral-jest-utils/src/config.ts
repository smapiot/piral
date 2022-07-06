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
      diagnostics: {
        ignoreCodes: [
          'TS151001',
          'TS2786',
          'TS2345',
          'TS2322',
          'TS2554',
          'TS2717',
          'TS2488',
          'TS2739',
          'TS2339',
          'TS2741',
          'TS2532',
          'TS1117',
          'TS2740',
        ],
      },
    },
  },
  verbose: true,
};

export default config;
