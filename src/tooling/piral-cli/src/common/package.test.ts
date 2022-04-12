import { resolve } from 'path';
import { findPackageVersion, findPackageRoot, getPiralPackage, getPiletsInfo, retrievePiletData } from './package';
import { cliVersion } from './info';
import { SourceLanguage } from './enums';

describe('CLI package module', () => {
  it('findPackageVersion finds the current package version', async () => {
    const version = await findPackageVersion(process.cwd(), 'sample-piral');
    expect(version).toBe(cliVersion);
  });

  it('findPackageVersion falls back to latest', async () => {
    const version = await findPackageVersion(process.cwd(), 'foo-bar-not-exists');
    expect(version).toBe('latest');
  });

  it('findPackageRoot correctly resolves the package root of parcel-bundler', () => {
    const dir = process.cwd();
    const version = findPackageRoot('parcel-bundler', dir);
    expect(version).toBe(resolve(dir, 'node_modules', 'parcel-bundler', 'package.json'));
  });

  it('findPackageRoot returns undefined for invalid package', () => {
    const dir = process.cwd();
    const version = findPackageRoot('foo-bar-not-exist', dir);
    expect(version).toBeUndefined();
  });

  it('getPiletsInfo returns pilets information about provided piralInfo', () => {
    const emptyPiletsInfo = {
      files: [],
      template: 'default',
      externals: [],
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
        externals: [],
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
  });

  it('getPiralPackage returns piral package', () => {
    let result = getPiralPackage('app', SourceLanguage.ts, '1.0.0', 'piral-base', 'webpack');
    expect(result.devDependencies['piral-cli-webpack']).toEqual('1.0.0');
    result = getPiralPackage('app', SourceLanguage.ts, '1.0.0', 'piral-base');
    expect(result.devDependencies).not.toContain('piral-cli-webpack');
  });

  it('retrievePiletData error cases', async () => {
    await retrievePiletData('foo', '').catch((err) =>
      expect(err).toStrictEqual(Error('[0011] Could not find a valid Piral instance.')),
    );
    await retrievePiletData('foo', 'sample-piral').catch((err) =>
      expect(err).toStrictEqual(
        Error('[0075] Cannot find the "package.json". You need a valid package.json for your pilet.'),
      ),
    );
  });
});
