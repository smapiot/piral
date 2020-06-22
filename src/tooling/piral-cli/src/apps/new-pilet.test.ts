import { mkdtempSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { newPilet } from './new-pilet';
import { PiletLanguage } from '../common';

function createTempDir() {
  return mkdtempSync(join(tmpdir(), 'piral-tests-new-pilet-'));
}

describe('New Pilet Command', () => {
  it('scaffolding in an empty directory works', async () => {
    jest.setTimeout(60000);
    const dir = createTempDir();
    await newPilet(dir, {
      install: false,
      source: 'piral@latest',
    });
    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.tsx'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeFalsy();
  });

  it('scaffolding with language JS works', async () => {
    jest.setTimeout(60000);
    const dir = createTempDir();
    await newPilet(dir, {
      language: PiletLanguage.js,
      install: false,
      source: 'piral@latest',
    });
    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeFalsy();
    expect(existsSync(resolve(dir, 'src/index.jsx'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeFalsy();
  });
});
