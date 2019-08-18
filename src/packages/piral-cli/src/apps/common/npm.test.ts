import * as cp from 'child_process';
import { dissectPackageName, installPackage } from './npm';

jest.mock('child_process');

describe('NPM Module', () => {
  it('dissects a fully qualified name with latest correctly', () => {
    const [name, version, hadVersion, type] = dissectPackageName(process.cwd(), 'foo@latest');
    expect(hadVersion).toBe(true);
    expect(version).toBe('latest');
    expect(name).toBe('foo');
    expect(type).toBe('registry');
  });

  it('dissects a fully qualified name  with a specific version correctly', () => {
    const [name, version, hadVersion, type] = dissectPackageName(process.cwd(), 'foo@1.2.3');
    expect(hadVersion).toBe(true);
    expect(version).toBe('1.2.3');
    expect(name).toBe('foo');
    expect(type).toBe('registry');
  });

  it('dissects a simple name correctly', () => {
    const [name, version, hadVersion, type] = dissectPackageName(process.cwd(), 'foo');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('foo');
    expect(type).toBe('registry');
  });

  it('dissects a relative file name correctly', () => {
    const [name, version, hadVersion, type] = dissectPackageName('/home/yolo', '../foo/bar');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('/home/foo/bar');
    expect(type).toBe('file');
  });

  it('dissects an absolute file name correctly', () => {
    const [name, version, hadVersion, type] = dissectPackageName('/home/yolo', '/foo/bar');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('/foo/bar');
    expect(type).toBe('file');
  });

  it('dissects a git SSH repo name correctly', () => {
    const [name, version, hadVersion, type] = dissectPackageName(process.cwd(), 'ssh://foo-bar.com/foo.git');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('git+ssh://foo-bar.com/foo.git');
    expect(type).toBe('git');
  });

  it('dissects a git HTTPS repo name correctly', () => {
    const [name, version, hadVersion, type] = dissectPackageName(process.cwd(), 'https://foo-bar.com/foo.git');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('git+https://foo-bar.com/foo.git');
    expect(type).toBe('git');
  });

  it('dissects a scoped name correctly', () => {
    const [name, version, hadVersion, type] = dissectPackageName(process.cwd(), '@foo/bar');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('@foo/bar');
    expect(type).toBe('registry');
  });

  it('dissects a scoped fully qualified name with latest correctly', () => {
    const [name, version, hadVersion, type] = dissectPackageName(process.cwd(), '@foo/bar@latest');
    expect(hadVersion).toBe(true);
    expect(version).toBe('latest');
    expect(name).toBe('@foo/bar');
    expect(type).toBe('registry');
  });

  it('dissects a scoped fully qualified name  with a specific version correctly', () => {
    const [name, version, hadVersion, type] = dissectPackageName(process.cwd(), '@foo/bar@^1.x');
    expect(hadVersion).toBe(true);
    expect(version).toBe('^1.x');
    expect(name).toBe('@foo/bar');
    expect(type).toBe('registry');
  });

  it('installs a package using the NPM command line tool without a target', () => {
    const emitter = jest.fn(() => ({ on: emitter }));
    (cp as any).exec = emitter;
    installPackage('foo', 'latest');
    expect(emitter).toHaveBeenCalledTimes(3);
  });

  it('installs a package using the NPM command line tool without a version', () => {
    const emitter = jest.fn(() => ({ on: emitter }));
    (cp as any).exec = emitter;
    installPackage('foo');
    expect(emitter).toHaveBeenCalledTimes(3);
  });

  it('installs a package using the NPM command line tool with some flag', () => {
    const emitter = jest.fn(() => ({ on: emitter }));
    (cp as any).exec = emitter;
    installPackage('foo', '1.3', '.', '--a=b');
    expect(emitter).toHaveBeenCalledTimes(3);
  });
});
