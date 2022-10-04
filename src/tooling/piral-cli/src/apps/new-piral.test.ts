import { mkdtempSync, existsSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { newPiral } from './new-piral';

function createTempDir() {
  return mkdtempSync(join(tmpdir(), 'piral-tests-new-piral-'));
}

jest.mock('../common/clients/npm', () => {
  const original = jest.requireActual('../common/clients/npm');

  return {
    ...original,
    installPackage: (...args) => {
      return original.installPackage(...args, '--no-package-lock', '--no-save');
    },
  };
});

jest.setTimeout(90000);

describe('New Piral Command', () => {
  it('scaffolding in an empty directory works', async () => {
    const dir = createTempDir();
    await newPiral(dir, { install: false });
    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.tsx'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.html'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/mocks/backend.js'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeFalsy();
  });

  it('scaffolding with language JS works', async () => {
    const dir = createTempDir();
    await newPiral(dir, {
      language: 'js',
      install: false,
    });
    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeFalsy();
    expect(existsSync(resolve(dir, 'src/index.jsx'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.html'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/mocks/backend.js'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeFalsy();
  });

  it('scaffolding with custom app name works', async () => {
    const dir = createTempDir();
    await newPiral(dir, {
      name: 'test-name',
      install: false,
    });

    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.tsx'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.html'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/mocks/backend.js'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeFalsy();

    const packageContent = await JSON.parse(readFileSync(`${dir}/package.json`, 'utf8'));
    expect(packageContent.name).toBe('test-name');
  });

  it('scaffolding for piral-core works', async () => {
    const dir = createTempDir();
    await newPiral(dir, {
      framework: 'piral-core',
      install: false,
    });
    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeFalsy();
    expect(existsSync(resolve(dir, 'node_modules/piral-core/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.jsx'))).toBeFalsy();
    expect(existsSync(resolve(dir, 'src/index.tsx'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.html'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/mocks/backend.js'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeFalsy();
  });

  it('scaffolding for piral-base works', async () => {
    const dir = createTempDir();
    await newPiral(dir, {
      framework: 'piral-base',
      install: false,
    });
    expect(existsSync(resolve(dir, 'node_modules/piral/package.json'))).toBeFalsy();
    expect(existsSync(resolve(dir, 'node_modules/piral-core/package.json'))).toBeFalsy();
    expect(existsSync(resolve(dir, 'node_modules/piral-base/package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'package.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'tsconfig.json'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.jsx'))).toBeFalsy();
    expect(existsSync(resolve(dir, 'src/index.ts'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/index.html'))).toBeTruthy();
    expect(existsSync(resolve(dir, 'src/mocks/backend.js'))).toBeTruthy();
    expect(existsSync(resolve(dir, '.npmrc'))).toBeFalsy();
  });
});
