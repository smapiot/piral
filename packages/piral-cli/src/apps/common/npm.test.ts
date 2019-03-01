import { dissectPackageName } from './npm';

describe('NPM Module', () => {
  it('dissects a fully qualified name with latest correctly', () => {
    const [name, version, hadVersion] = dissectPackageName('foo@latest');
    expect(hadVersion).toBe(true);
    expect(version).toBe('latest');
    expect(name).toBe('foo');
  });

  it('dissects a fully qualified name  with a specific version correctly', () => {
    const [name, version, hadVersion] = dissectPackageName('foo@1.2.3');
    expect(hadVersion).toBe(true);
    expect(version).toBe('1.2.3');
    expect(name).toBe('foo');
  });

  it('dissects a simple name correctly', () => {
    const [name, version, hadVersion] = dissectPackageName('foo');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('foo');
  });

  it('dissects a scoped name correctly', () => {
    const [name, version, hadVersion] = dissectPackageName('@foo/bar');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('@foo/bar');
  });

  it('dissects a scoped fully qualified name with latest correctly', () => {
    const [name, version, hadVersion] = dissectPackageName('@foo/bar@latest');
    expect(hadVersion).toBe(true);
    expect(version).toBe('latest');
    expect(name).toBe('@foo/bar');
  });

  it('dissects a scoped fully qualified name  with a specific version correctly', () => {
    const [name, version, hadVersion] = dissectPackageName('@foo/bar@^1.x');
    expect(hadVersion).toBe(true);
    expect(version).toBe('^1.x');
    expect(name).toBe('@foo/bar');
  });
});
