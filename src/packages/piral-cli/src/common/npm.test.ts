import * as cp from 'child_process';
import { Stream } from 'stream';
import { resolve } from 'path';
import { dissectPackageName, installPackage } from './npm';

jest.mock('child_process');
jest.mock('fs', () => ({
  exists: (file: string, cb: (status: boolean) => void) => cb(true),
  readFileSync: () => '',
}));

describe('NPM Module', () => {
  it('dissects a fully qualified name with latest correctly', async () => {
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'foo@latest');
    expect(hadVersion).toBe(true);
    expect(version).toBe('latest');
    expect(name).toBe('foo');
    expect(type).toBe('registry');
  });

  it('dissects a fully qualified name  with a specific version correctly', async () => {
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'foo@1.2.3');
    expect(hadVersion).toBe(true);
    expect(version).toBe('1.2.3');
    expect(name).toBe('foo');
    expect(type).toBe('registry');
  });

  it('dissects a simple name correctly', async () => {
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'foo');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('foo');
    expect(type).toBe('registry');
  });

  it('dissects a relative file name correctly', async () => {
    const [name, version, hadVersion, type] = await dissectPackageName('/home/yolo', '../foo/bar');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe(resolve('/home/yolo', '../foo/bar'));
    expect(type).toBe('file');
  });

  it('dissects an absolute file name correctly', async () => {
    const [name, version, hadVersion, type] = await dissectPackageName('/home/yolo', '/foo/bar');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe(resolve('/home/yolo', '/foo/bar'));
    expect(type).toBe('file');
  });

  it('dissects a git SSH repo name correctly', async () => {
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'ssh://foo-bar.com/foo.git');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('git+ssh://foo-bar.com/foo.git');
    expect(type).toBe('git');
  });

  it('dissects a git HTTPS repo name correctly', async () => {
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'https://foo-bar.com/foo.git');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('git+https://foo-bar.com/foo.git');
    expect(type).toBe('git');
  });

  it('dissects a scoped name correctly', async () => {
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), '@foo/bar');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('@foo/bar');
    expect(type).toBe('registry');
  });

  it('dissects a scoped fully qualified name with latest correctly', async () => {
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), '@foo/bar@latest');
    expect(hadVersion).toBe(true);
    expect(version).toBe('latest');
    expect(name).toBe('@foo/bar');
    expect(type).toBe('registry');
  });

  it('dissects a scoped fully qualified name  with a specific version correctly', async () => {
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), '@foo/bar@^1.x');
    expect(hadVersion).toBe(true);
    expect(version).toBe('^1.x');
    expect(name).toBe('@foo/bar');
    expect(type).toBe('registry');
  });

  it('installs a package using the NPM command line tool without a target', () => {
    const emitter = jest.fn(() => ({ on: emitter, stdout: new Stream(), stdin: new Stream(), stderr: new Stream() }));
    (cp as any).exec = emitter;
    installPackage('npm', 'foo', 'latest');
    expect(emitter).toHaveBeenCalledTimes(3);
  });

  it('installs a package using the NPM command line tool without a version', () => {
    const emitter = jest.fn(() => ({ on: emitter, stdout: new Stream(), stdin: new Stream(), stderr: new Stream() }));
    (cp as any).exec = emitter;
    installPackage('npm', 'foo');
    expect(emitter).toHaveBeenCalledTimes(3);
  });

  it('installs a package using the Yarn command line tool without a version', () => {
    const emitter = jest.fn(() => ({ on: emitter, stdout: new Stream(), stdin: new Stream(), stderr: new Stream() }));
    (cp as any).exec = emitter;
    installPackage('yarn', 'foo');
    expect(emitter).toHaveBeenCalledTimes(3);
  });

  it('installs a package using the Pnpm command line tool without a version', () => {
    const emitter = jest.fn(() => ({ on: emitter, stdout: new Stream(), stdin: new Stream(), stderr: new Stream() }));
    (cp as any).exec = emitter;
    installPackage('pnpm', 'foo');
    expect(emitter).toHaveBeenCalledTimes(3);
  });

  it('installs a package using the NPM command line tool with some flag', () => {
    const emitter = jest.fn(() => ({ on: emitter, stdout: new Stream(), stdin: new Stream(), stderr: new Stream() }));
    (cp as any).exec = emitter;
    installPackage('npm', 'foo', '1.3', '.', '--a=b');
    expect(emitter).toHaveBeenCalledTimes(3);
  });
});
