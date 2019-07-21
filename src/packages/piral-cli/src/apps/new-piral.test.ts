import { mkdtempSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { PiletLanguage } from './common';
import { newPiral } from './new-piral';

function createTempDir() {
  return mkdtempSync(join(tmpdir(), 'piral-tests-new-piral-'));
}

describe('New Piral Command', () => {
  it('scaffolding in an empty directory works', async () => {
    jest.setTimeout(60000);
    const dir = createTempDir();
    await newPiral(dir);
    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.tsx'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.html'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeFalsy();
  });

  it('scaffolding with language JS works', async () => {
    jest.setTimeout(60000);
    const dir = createTempDir();
    await newPiral(dir, {
      language: PiletLanguage.js,
    });
    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeFalsy();
    expect(existsSync(resolve(dir, 'src/index.jsx'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.html'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeFalsy();
  });

  it('scaffolding for piral-core works', async () => {
    jest.setTimeout(60000);
    const dir = createTempDir();
    await newPiral(dir, {
      onlyCore: true,
    });
    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeFalsy();
    expect(existsSync(resolve(dir, 'node_modules/piral-core/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.jsx'))).toBeFalsy();
    expect(existsSync(resolve(dir, 'src/index.html'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeFalsy();
  });
});
