import { describe, it, expect } from 'vitest';
import { mkdtempSync, existsSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { packPilet } from './pack-pilet';

function createTempDir() {
  return mkdtempSync(join(tmpdir(), 'piral-tests-pack-pilet-'));
}

describe('Pack Pilet Command', () => {
  it('can pack a standard npm package to a specified target', async () => {
    const dir = createTempDir();
    const target = 'foo.tgz';
    const packageJson = resolve(dir, 'package.json');
    writeFileSync(
      packageJson,
      JSON.stringify({
        name: 'my-pilet',
        version: '1.0.0',
      }),
      'utf8',
    );

    await packPilet(dir, {
      target,
    });

    expect(existsSync(resolve(dir, target))).toBeTruthy();
  });

  it('can pack a standard npm package to a the default target using the process directory', async () => {
    const originalDir = process.cwd();
    const dir = createTempDir();
    const packageJson = resolve(dir, 'package.json');
    writeFileSync(
      packageJson,
      JSON.stringify({
        name: 'my-pilet',
        version: '1.0.0',
      }),
      'utf8',
    );

    await packPilet(dir);

    expect(existsSync(resolve(dir, 'my-pilet-1.0.0.tgz'))).toBeTruthy();
  });

  it('will fail if the source does not exist', async () => {
    const dir = createTempDir();
    const packageJson = resolve(dir, 'package.json');
    writeFileSync(
      packageJson,
      JSON.stringify({
        name: 'my-pilet',
        version: '1.0.0',
      }),
      'utf8',
    );

    await expect(
      packPilet(dir, {
        source: 'foo',
        logLevel: 2,
      }),
    ).rejects.toThrowError();

    expect(existsSync(resolve(dir, 'my-pilet-1.0.0.tgz'))).toBeFalsy();
  });

  it('will fail if no version is given', async () => {
    const dir = createTempDir();
    const packageJson = resolve(dir, 'package.json');
    writeFileSync(
      packageJson,
      JSON.stringify({
        name: 'my-pilet',
      }),
      'utf8',
    );

    await expect(packPilet(dir)).rejects.toThrowError();

    expect(existsSync(resolve(dir, 'my-pilet-1.0.0.tgz'))).toBeFalsy();
  });
});
