import { mkdtempSync, existsSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { newPilet } from './new-pilet';

function createTempDir() {
  return mkdtempSync(join(tmpdir(), 'piral-tests-new-pilet-'));
}

jest.mock('../common/clients/npm', () => {
  const original = jest.requireActual('../common/clients/npm');

  return {
    ...original,
    installPackage: (...args) => {
      return original.installPackage(
        ...args,
        '--no-package-lock',
        '--no-save',
        '--registry=https://registry.npmjs.org/',
      );
    },
  };
});

jest.setTimeout(90000);

describe('New Pilet Command', () => {
  it('scaffolding in an empty directory works', async () => {
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
    const dir = createTempDir();
    await newPilet(dir, {
      language: 'js',
      install: false,
      source: 'piral@latest',
    });
    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeFalsy();
    expect(existsSync(resolve(dir, 'src/index.jsx'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeFalsy();
  });

  it('should set pilet name if passed as argument', async () => {
    const dir = createTempDir();
    await newPilet(dir, {
      install: false,
      source: 'piral@latest',
      name: 'testpiralname',
    });
    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.tsx'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeFalsy();

    const packageContent = await JSON.parse(readFileSync(`${dir}/package.json`, 'utf8'));
    expect(packageContent.name).toBe('testpiralname');
  });
});
