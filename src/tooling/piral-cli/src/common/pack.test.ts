import { createPiletPackage } from './pack';
import { resolve } from 'path';

let json: any = {};

jest.mock('./io', () => ({
  readJson: jest.fn(() => json),
  removeDirectory: jest.fn(() => Promise.resolve()),
  makeTempDir: jest.fn(() => Promise.resolve('')),
  copy: jest.fn(() => Promise.resolve()),
  checkExists: jest.fn(() => Promise.resolve(true)),
  createDirectory: jest.fn(() => Promise.resolve()),
}));

jest.mock('./archive', () => ({
  createTgz: jest.fn(() => Promise.resolve()),
}));

describe('Pack Module', () => {
  it('createPilePackage without package json', async () => {
    json = null;
    expect.assertions(1);
    await expect(createPiletPackage('./', '', '')).rejects.toEqual(
      Error('[0020] No valid package.json could be found.'),
    );
  });

  it('createPilePackage without package json name', async () => {
    json = {};
    expect.assertions(1);
    await expect(createPiletPackage('./', '', '')).rejects.toEqual(
      Error('[0021] Cannot pack the pilet - missing name.'),
    );
  });

  it('createPilePackage without package json version', async () => {
    json = { name: 'Test' };
    expect.assertions(1);
    await expect(createPiletPackage('./', '', '')).rejects.toEqual(
      Error('[0022] Cannot pack the pilet - missing version.'),
    );
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
