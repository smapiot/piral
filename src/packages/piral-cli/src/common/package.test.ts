import { resolve } from 'path';
import { findPackageVersion, findEntryModule, findPackageRoot } from './package';
import { cliVersion } from './info';

describe('CLI package module', () => {
  it('findPackageVersion finds the current package version', async () => {
    const version = await findPackageVersion(process.cwd(), 'sample-piral');
    expect(version).toBe(cliVersion);
  });

  it('findPackageVersion falls back to latest', async () => {
    const version = await findPackageVersion(process.cwd(), 'foo-bar-not-exists');
    expect(version).toBe('latest');
  });

  it('findEntryModule finds the implicit index.html', async () => {
    const dir = resolve(process.cwd(), 'src', 'samples', 'sample-piral', 'src');
    const version = await findEntryModule('index', dir);
    expect(version).toBe(resolve(dir, 'index.html'));
  });

  it('findEntryModule finds the explicit index.tsx', async () => {
    const dir = resolve(process.cwd(), 'src', 'samples', 'sample-piral', 'src');
    const version = await findEntryModule('index.tsx', dir);
    expect(version).toBe(resolve(dir, 'index.tsx'));
  });

  it('findEntryModule does not find anything and returns original', async () => {
    const dir = resolve(process.cwd(), 'src', 'samples', 'sample-piral', 'src');
    const version = await findEntryModule('app.js', dir);
    expect(version).toBe('app.js');
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
});
