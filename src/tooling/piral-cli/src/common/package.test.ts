import { describe, it, expect } from 'vitest';
import { findPackageVersion, getPiralPackage, getPiletsInfo, retrievePiletData } from './package';
import { cliVersion } from './info';

const testOptions = {
  timeout: 10000,
};

describe('CLI package module', () => {
  it(
    'findPackageVersion finds the current package version',
    async () => {
      const version = await findPackageVersion(process.cwd(), 'sample-piral');
      expect(version).toBe(cliVersion);
    },
    testOptions,
  );

  it(
    'findPackageVersion falls back to latest',
    async () => {
      const version = await findPackageVersion(process.cwd(), 'foo-bar-not-exists');
      expect(version).toBe('latest');
    },
    testOptions,
  );

  it(
    'getPiletsInfo returns pilets information about provided piralInfo',
    () => {
      const emptyPiletsInfo = {
        files: [],
        template: 'default',
        scripts: {},
        validators: {},
        devDependencies: {},
        preScaffold: '',
        postScaffold: '',
        packageOverrides: {},
        preUpgrade: '',
        postUpgrade: '',
      };
      let result = getPiletsInfo({});
      expect(result).toStrictEqual(emptyPiletsInfo);

      const piralInfo = {
        pilets: {
          files: ['foo.tgz', 'foo2.tgz'],
          template: 'default',
          scripts: {},
          validators: {},
          devDependencies: {},
          preScaffold: '',
          packageOverrides: {},
          postScaffold: '',
          preUpgrade: '',
          postUpgrade: '',
        },
      };
      result = getPiletsInfo(piralInfo);
      expect(result).toStrictEqual(piralInfo.pilets);
    },
    testOptions,
  );

  it(
    'getPiralPackage returns piral package with webpack in latest version',
    async () => {
      const result = await getPiralPackage(
        'app',
        { language: 'ts', packageName: 'piral-base', reactRouterVersion: 5, reactVersion: 17 },
        '10.0.0',
        'webpack',
      );
      expect(result.devDependencies['piral-cli-webpack']).toEqual('latest');
    },
    testOptions,
  );

  it(
    'getPiralPackage returns piral package with webpack in beta version',
    async () => {
      const result = await getPiralPackage(
        'app',
        { language: 'ts', packageName: 'piral-base', reactRouterVersion: 5, reactVersion: 17 },
        '0.15.0-beta.1',
        'webpack',
      );
      expect(result.devDependencies['piral-cli-webpack']).toEqual('next');
    },
    testOptions,
  );

  it(
    'getPiralPackage returns piral package with webpack in alpha version',
    async () => {
      const result = await getPiralPackage(
        'app',
        { language: 'ts', packageName: 'piral-base', reactRouterVersion: 5, reactVersion: 17 },
        '0.15.0-alpha.1',
        'webpack',
      );
      expect(result.devDependencies['piral-cli-webpack']).toEqual('canary');
    },
    testOptions,
  );

  it(
    'getPiralPackage returns piral package with webpack in existing version',
    async () => {
      const result = await getPiralPackage(
        'app',
        { language: 'ts', packageName: 'piral-base', reactRouterVersion: 5, reactVersion: 17 },
        '0.14.0',
        'webpack',
      );
      expect(result.devDependencies['piral-cli-webpack']).toEqual('0.14.0');
    },
    testOptions,
  );

  it(
    'getPiralPackage returns piral package without bundler',
    async () => {
      const result = await getPiralPackage(
        'app',
        { language: 'ts', packageName: 'piral-base', reactRouterVersion: 5, reactVersion: 17 },
        '1.0.0',
      );
      expect(result.devDependencies['piral-cli-webpack']).toBeUndefined();
    },
    testOptions,
  );

  it(
    'retrievePiletData error cases',
    async () => {
      await expect(retrievePiletData('foo', 'bar')).rejects.toThrow(
        '[0010] The defined Piral instance ("bar") could not be found.',
      );
      await expect(retrievePiletData('/foo', 'sample-piral')).rejects.toThrow(
        '[0075] Cannot find the "package.json". You need a valid package.json for your pilet.',
      );
    },
    testOptions,
  );
});
