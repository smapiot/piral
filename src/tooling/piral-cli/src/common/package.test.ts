import { describe, it, expect } from 'vitest';
import { combinePiletExternals, findPackageVersion, getPiralPackage, getPiletsInfo, retrievePiletData } from './package';
import { cliVersion } from './info';

const testOptions = {
  timeout: 10000,
};

describe('CLI package module', () => {
  it('uses compatible Angular core secondary paths from an inherited shell runtime', () => {
    const importmap = [
      {
        entry: '/shell/angular-core.mjs',
        id: '@angular/core@22.1.6',
        name: '@angular/core',
        parents: ['shell'],
        ref: 'angular-core.js',
        requireId: '@angular/core@^22.0.0',
        type: 'local' as const,
      },
      {
        entry: '/pilet/angular-rxjs-interop.mjs',
        id: '@angular/core/rxjs-interop@22.1.6',
        name: '@angular/core/rxjs-interop',
        ref: 'angular-core-rxjs-interop.js',
        requireId: '@angular/core/rxjs-interop@^22.0.0',
        type: 'local' as const,
      },
    ];

    expect(combinePiletExternals(['shell'], {}, [], importmap, 'v2')).toEqual([
      'shell',
      '@angular/core/rxjs-interop',
      '@angular/core',
    ]);
    expect(importmap).toEqual([]);
  });

  it('uses compatible Angular primitive entry points from an inherited shell runtime', () => {
    const importmap = [
      {
        entry: '/shell/angular-core.mjs',
        id: '@angular/core@22.1.6',
        name: '@angular/core',
        parents: ['shell'],
        ref: 'angular-core.js',
        requireId: '@angular/core@^22.0.0',
        type: 'local' as const,
      },
      {
        entry: '/pilet/angular-signals.mjs',
        id: '@angular/core/primitives/signals@22.1.6',
        name: '@angular/core/primitives/signals',
        ref: 'angular-core-primitives-signals.js',
        requireId: '@angular/core/primitives/signals@^22.0.0',
        type: 'local' as const,
      },
    ];

    expect(combinePiletExternals(['shell'], {}, [], importmap, 'v2')).toEqual([
      'shell',
      '@angular/core/primitives/signals',
      '@angular/core',
    ]);
    expect(importmap).toEqual([]);
  });

  it('keeps unsupported Angular core subpaths distributed', () => {
    const importmap = [
      {
        entry: '/shell/angular-core.mjs',
        id: '@angular/core@22.1.6',
        name: '@angular/core',
        parents: ['shell'],
        ref: 'angular-core.js',
        requireId: '@angular/core@^22.0.0',
        type: 'local' as const,
      },
      {
        entry: '/pilet/angular-testing.mjs',
        id: '@angular/core/testing@22.1.6',
        name: '@angular/core/testing',
        ref: 'angular-core-testing.js',
        requireId: '@angular/core/testing@^22.0.0',
        type: 'local' as const,
      },
    ];

    expect(combinePiletExternals(['shell'], {}, [], importmap, 'v2')).toEqual(['shell', '@angular/core']);
    expect(importmap).toHaveLength(1);
    expect(importmap[0].name).toBe('@angular/core/testing');
  });

  it('does not apply Angular secondary-entry routing to non-v2 schemas', () => {
    const makeImportmap = () => [
      {
        entry: '/shell/angular-core.mjs',
        id: '@angular/core@22.1.6',
        name: '@angular/core',
        parents: ['shell'],
        ref: 'angular-core.js',
        requireId: '@angular/core@^22.0.0',
        type: 'local' as const,
      },
      {
        entry: '/pilet/angular-rxjs-interop.mjs',
        id: '@angular/core/rxjs-interop@22.1.6',
        name: '@angular/core/rxjs-interop',
        ref: 'angular-core-rxjs-interop.js',
        requireId: '@angular/core/rxjs-interop@^22.0.0',
        type: 'local' as const,
      },
    ];
    const importmap = makeImportmap();

    expect(combinePiletExternals(['shell'], {}, [], importmap, 'v1')).toEqual(['shell', '@angular/core']);
    expect(importmap).toHaveLength(1);
    expect(importmap[0].name).toBe('@angular/core/rxjs-interop');
  });

  it('keeps incompatible Angular core secondary paths distributed', () => {
    const importmap = [
      {
        entry: '/shell/angular-core.mjs',
        id: '@angular/core@22.1.6',
        name: '@angular/core',
        parents: ['shell'],
        ref: 'angular-core.js',
        requireId: '@angular/core@^22.0.0',
        type: 'local' as const,
      },
      {
        entry: '/pilet/angular-rxjs-interop.mjs',
        id: '@angular/core/rxjs-interop@21.2.22',
        name: '@angular/core/rxjs-interop',
        ref: 'angular-core-rxjs-interop.js',
        requireId: '@angular/core/rxjs-interop@^21.0.0',
        type: 'local' as const,
      },
    ];

    expect(combinePiletExternals(['shell'], {}, [], importmap, 'v2')).toEqual(['shell', '@angular/core']);
    expect(importmap).toHaveLength(1);
    expect(importmap[0].name).toBe('@angular/core/rxjs-interop');
  });

  it('findPackageVersion finds the current package version', testOptions, async () => {
    const version = await findPackageVersion(process.cwd(), 'sample-piral');
    expect(version).toBe(cliVersion);
  });

  it('findPackageVersion falls back to latest', testOptions, async () => {
    const version = await findPackageVersion(process.cwd(), 'foo-bar-not-exists');
    expect(version).toBe('latest');
  });

  it('getPiletsInfo returns pilets information about provided piralInfo', testOptions, () => {
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
  });

  it('getPiralPackage returns piral package with webpack in latest version', testOptions, async () => {
    const result = await getPiralPackage(
      'app',
      { language: 'ts', packageName: 'piral-base', reactRouterVersion: 5, reactVersion: 17 },
      '10.0.0',
      'webpack',
    );
    expect(result.devDependencies['piral-cli-webpack']).toEqual('latest');
  });

  it('getPiralPackage returns piral package with webpack in beta version', testOptions, async () => {
    const result = await getPiralPackage(
      'app',
      { language: 'ts', packageName: 'piral-base', reactRouterVersion: 5, reactVersion: 17 },
      '0.15.0-beta.1',
      'webpack',
    );
    expect(result.devDependencies['piral-cli-webpack']).toEqual('next');
  });

  it('getPiralPackage returns piral package with webpack in alpha version', testOptions, async () => {
    const result = await getPiralPackage(
      'app',
      { language: 'ts', packageName: 'piral-base', reactRouterVersion: 5, reactVersion: 17 },
      '0.15.0-alpha.1',
      'webpack',
    );
    expect(result.devDependencies['piral-cli-webpack']).toEqual('canary');
  });

  it('getPiralPackage returns piral package with webpack in existing version', testOptions, async () => {
    const result = await getPiralPackage(
      'app',
      { language: 'ts', packageName: 'piral-base', reactRouterVersion: 5, reactVersion: 17 },
      '0.14.0',
      'webpack',
    );
    expect(result.devDependencies['piral-cli-webpack']).toEqual('0.14.0');
  });

  it('getPiralPackage returns piral package without bundler', testOptions, async () => {
    const result = await getPiralPackage(
      'app',
      { language: 'ts', packageName: 'piral-base', reactRouterVersion: 5, reactVersion: 17 },
      '1.0.0',
    );
    expect(result.devDependencies['piral-cli-webpack']).toBeUndefined();
  });

  it('retrievePiletData error cases', testOptions, async () => {
    await expect(retrievePiletData('foo', 'bar')).rejects.toThrow(
      '[0010] The defined Piral instance ("bar") could not be found.',
    );
    await expect(retrievePiletData('/foo', 'sample-piral')).rejects.toThrow(
      '[0075] Cannot find the "package.json". You need a valid package.json for your pilet.',
    );
  });
});
