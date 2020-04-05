import { resolve } from 'path';
import { findPackageVersion, findEntryModule } from './package';
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

  it('findEntryModule finds the index.html', async () => {
    const dir = resolve(process.cwd(), 'src', 'samples', 'sample-piral', 'src');
    const version = await findEntryModule('index', dir);
    expect(version).toBe(resolve(dir, 'index.html'));
  });
});
