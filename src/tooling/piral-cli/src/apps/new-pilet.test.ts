import { describe, it, expect, vitest } from 'vitest';
import { mkdtempSync, existsSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { newPilet } from './new-pilet';

function createTempDir() {
  return mkdtempSync(join(tmpdir(), 'piral-tests-new-pilet-'));
}

vitest.mock('../npm-clients/npm', async () => {
  const original: any = await vitest.importActual('../npm-clients/npm');

  return {
    ...original,
    installDependencies: (...args) => {
      const [dir] = args;
      const npmrc = resolve(dir, '.npmrc');

      if (existsSync(npmrc)) {
        const content = readFileSync(npmrc, 'utf8');

        if (content.startsWith('registry=https://someFakeRegistry.com')) {
          // in case of an invalid entry we fail fast instead of the usual npm timeout
          return new Promise((_, reject) => {
            setTimeout(reject, 1000);
          });
        }
      }

      return original.installDependencies(...args);
    },
    installPackage: (...args) => {
      return original.installPackage(
        ...args,
        '--legacy-peer-deps',
        '--no-package-lock',
        '--no-save',
        '--registry=https://registry.npmjs.org/',
      );
    },
  };
});

const testOptions = {
  timeout: 60000,
};

describe('New Pilet Command', () => {
  it('scaffolding in an empty directory works', testOptions, async () => {
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

  it('command will fail when providing invalid registry', testOptions, async () => {
    // Arrange
    const dir = createTempDir();
    const options = {
      install: true,
      source: 'piral@latest',
      registry: 'https://someFakeRegistry.com',
    };

    let error = false;

    try {
      await newPilet(dir, options);
    } catch {
      error = true;
    }

    expect(error).toBeTruthy();
  });

  it('should scaffold without creating npmrc file', testOptions, async () => {
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

  it('scaffolding with language JS works', testOptions, async () => {
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

  it('should set pilet name if passed as argument', testOptions, async () => {
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
