import { mkdtempSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { newPilet } from './new-pilet';
import { SourceLanguage } from '../common';

function createTempDir() {
  return mkdtempSync(join(tmpdir(), 'piral-tests-new-pilet-'));
}

jest.mock('../common/clients/npm', () => {
  const original = jest.requireActual('../common/clients/npm');

  return {
    ...original,
    installPackage: (...args) => {
      if (args[0].startsWith('@smapiot/')) {
        return Promise.resolve();
      } else {
        return original.installPackage(...args);
      }
    },
  };
});

describe('New Pilet Command', () => {
  it('scaffolding in an empty directory works', async () => {
    jest.setTimeout(60000);
    const dir = createTempDir();
    await newPilet(dir, {
      install: false,
      source: 'piral@latest',
      registry: 'https://someFakeRegistry.com',
    });
    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.tsx'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeTruthy();
  });

  it('command will fail when providing invalid registry', async () => {
    // Arrange
    const dir = createTempDir();
    const options = {
      install: true,
      source: 'piral@latest',
      registry: 'https://someFakeRegistry.com',
    };

    // Act
    const result = await newPilet(dir, options);

    // Assert
    expect(result).toBeUndefined();
  });

  it('should scaffold without creating npmrc file', async () => {
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
      language: SourceLanguage.js,
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
