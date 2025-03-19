import { describe, it, expect, vitest } from 'vitest';
import { createPiletPackage } from './pack';
import { resolve } from 'path';

let json: any = {};

vitest.mock('./io', () => ({
  readJson: vitest.fn(() => json),
  removeDirectory: vitest.fn(() => Promise.resolve()),
  checkIsDirectory: vitest.fn(() => false),
  makeTempDir: vitest.fn(() => Promise.resolve('')),
  copy: vitest.fn(() => Promise.resolve()),
  checkExists: vitest.fn(() => Promise.resolve(true)),
  createDirectory: vitest.fn(() => Promise.resolve()),
}));

vitest.mock('./archive', () => ({
  createTgz: vitest.fn(() => Promise.resolve()),
}));

describe('Pack Module', () => {
  it('createPilePackage without package json', async () => {
    json = null;
    expect.assertions(1);
    await expect(createPiletPackage('./', '', '')).rejects.toThrow('[0020] No valid package.json could be found.');
  });

  it('createPilePackage without package json name', async () => {
    json = {};
    expect.assertions(1);
    await expect(createPiletPackage('./', '', '')).rejects.toThrow('[0021] Cannot pack the pilet - missing name.');
  });

  it('createPilePackage without package json version', async () => {
    json = { name: 'Test' };
    expect.assertions(1);
    await expect(createPiletPackage('./', '', '')).rejects.toThrow('[0022] Cannot pack the pilet - missing version.');
  });

  it('createPilePackage source = target', async () => {
    json = { name: 'foo', version: '1.0.0' };
    const path = resolve('./', 'foo-1.0.0.tgz');
    await expect(createPiletPackage('./', '', '')).resolves.toEqual(path);
  });

  it('createPilePackage source <> target', async () => {
    json = { name: 'foo', version: '1.0.0' };
    const path = resolve('./', 'test', 'foo-1.0.0.tgz');
    await expect(createPiletPackage('./', '', 'test')).resolves.toEqual(path);
  });
});
