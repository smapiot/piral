import { describe, it, expect, vitest } from 'vitest';
import { resolve } from 'path';
import { clients } from '../npm-clients';
import {
  dissectPackageName,
  installNpmPackage,
  isMonorepoPackageRef,
  installNpmDependencies,
  createNpmPackage,
  findNpmTarball,
  findSpecificVersion,
  findLatestVersion,
  isLocalPackage,
  makeGitUrl,
  makeFilePath,
  getCurrentPackageDetails,
  isLinkedPackage,
  combinePackageRef,
  getPackageName,
  getFilePackageVersion,
  getGitPackageVersion,
  getPackageVersion,
  isGitPackage,
  makeExternals,
  findPackageRoot,
  determineNpmClient,
} from './npm';

vitest.mock('child_process');

vitest.mock('../external', async () => ({
  ...((await vitest.importActual('../external')) as any),
  rc() {},
  ora() {
    return {
      succeed(msg) {
        console.warn(msg);
      },
      warn(msg) {
        console.warn(msg);
      },
      info(msg) {
        console.info(msg);
      },
      fail(msg) {
        console.error(msg);
      },
    };
  },
  getModulePath(root, moduleName) {
    return require.resolve(moduleName, {
      paths: [root],
    });
  },
}));

let specialCase = false;
let shouldFind = true;
let wrongCase = false;
const jsonValueString = JSON.stringify([{ name: 'npm' }]);
const jsonValueStringWrong = JSON.stringify([]);

vitest.mock('./scripts', () => ({
  runCommand: (exe: string, args: Array<string>, cwd: string, output?: NodeJS.WritableStream) => {
    return new Promise<void>((resolve) => {
      output?.write(wrongCase ? jsonValueStringWrong : jsonValueString, () => {});
      resolve();
    });
  },
}));

vitest.mock('fs', async () => {
  const fs = (await vitest.importActual('fs')) as any;
  return {
    ...fs,
    exists: (file: string, cb: (status: boolean) => void) =>
      cb(
        shouldFind &&
          !file.endsWith('package.json') &&
          !(specialCase && (file.endsWith('lerna.json') || file.endsWith('yarn.lock'))),
      ),
    existsSync: (file: string) => {
      return true;
    },
    readFile: (
      file: string,
      type: string,
      callback: (err: NodeJS.ErrnoException | undefined, data: string) => void,
    ) => {
      if (fs.existsSync(file)) {
        return fs.readFile(file, type, callback);
      }

      return callback(undefined, '');
    },
    realpathSync: () => ({}),
    readFileSync: () => '',
  };
});

describe('npm Module', () => {
  it('findPackageRoot correctly resolves the package root of parcel-bundler', () => {
    const dir = process.cwd();
    const version = findPackageRoot('webpack', dir);
    expect(version).toBe(resolve(dir, 'node_modules', 'webpack', 'package.json'));
  });

  it('findPackageRoot returns undefined for invalid package', () => {
    const dir = process.cwd();
    const version = findPackageRoot('foo-bar-not-exist', dir);
    expect(version).toBeUndefined();
  });

  it('dissects a fully qualified name with latest correctly', async () => {
    wrongCase = false;
    const client = await determineNpmClient(process.cwd());
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'foo@latest', client);
    expect(hadVersion).toBe(true);
    expect(version).toBe('latest');
    expect(name).toBe('foo');
    expect(type).toBe('registry');
  });

  it('dissects a fully qualified name  with a specific version correctly', async () => {
    wrongCase = false;
    const client = await determineNpmClient(process.cwd());
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'foo@1.2.3', client);
    expect(hadVersion).toBe(true);
    expect(version).toBe('1.2.3');
    expect(name).toBe('foo');
    expect(type).toBe('registry');
  });

  it('dissects a simple name correctly', async () => {
    wrongCase = false;
    const client = await determineNpmClient(process.cwd());
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'foo', client);
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('foo');
    expect(type).toBe('registry');
  });

  it('dissects a relative file name correctly', async () => {
    wrongCase = false;
    const client = await determineNpmClient(process.cwd());
    const [name, version, hadVersion, type] = await dissectPackageName('/home/yolo', '../foo/bar', client);
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe(resolve('/home/yolo', '../foo/bar'));
    expect(type).toBe('file');
  });

  it('dissects an absolute file name correctly', async () => {
    wrongCase = false;
    const client = await determineNpmClient(process.cwd());
    const [name, version, hadVersion, type] = await dissectPackageName('/home/yolo', '/foo/bar', client);
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe(resolve('/home/yolo', '/foo/bar'));
    expect(type).toBe('file');
  });

  it('dissects a git SSH repo name correctly', async () => {
    wrongCase = false;
    const client = await determineNpmClient(process.cwd());
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'ssh://foo-bar.com/foo.git', client);
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('git+ssh://foo-bar.com/foo.git');
    expect(type).toBe('git');
  });

  it('dissects a git HTTPS repo name correctly', async () => {
    wrongCase = false;
    const client = await determineNpmClient(process.cwd());
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'https://foo-bar.com/foo.git', client);
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('git+https://foo-bar.com/foo.git');
    expect(type).toBe('git');
  });

  it('dissects a scoped name correctly', async () => {
    wrongCase = false;
    const client = await determineNpmClient(process.cwd());
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), '@foo/bar', client);
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('@foo/bar');
    expect(type).toBe('registry');
  });

  it('dissects a scoped fully qualified name with latest correctly', async () => {
    wrongCase = false;
    const client = await determineNpmClient(process.cwd());
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), '@foo/bar@latest', client);
    expect(hadVersion).toBe(true);
    expect(version).toBe('latest');
    expect(name).toBe('@foo/bar');
    expect(type).toBe('registry');
  });

  it('dissects a scoped fully qualified name  with a specific version correctly', async () => {
    wrongCase = false;
    const client = await determineNpmClient(process.cwd());
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), '@foo/bar@^1.x', client);
    expect(hadVersion).toBe(true);
    expect(version).toBe('^1.x');
    expect(name).toBe('@foo/bar');
    expect(type).toBe('registry');
  });

  it('installs a package using the npm command line tool without a target', async () => {
    wrongCase = false;
    await installNpmPackage({ direct: 'npm' }, 'foo', 'latest').then((result) =>
      expect(result).toEqual(jsonValueString),
    );
    wrongCase = true;
    await installNpmPackage({ direct: 'npm' }, 'foo', 'latest').then((result) =>
      expect(result).not.toEqual(jsonValueString),
    );
  });

  it('installs a package using the npm command line tool without a version', async () => {
    wrongCase = false;
    await installNpmPackage({ direct: 'npm' }, 'foo').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installNpmPackage({ direct: 'npm' }, 'foo').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('installs a package using the Yarn command line tool without a version', async () => {
    wrongCase = false;
    await installNpmPackage({ direct: 'yarn' }, 'foo').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installNpmPackage({ direct: 'yarn' }, 'foo').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('installs a package using the Pnpm command line tool without a version', async () => {
    wrongCase = false;
    await installNpmPackage({ direct: 'pnpm' }, 'foo').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installNpmPackage({ direct: 'pnpm' }, 'foo').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('installs a package using the npm command line tool with some flag', async () => {
    wrongCase = false;
    await installNpmPackage({ direct: 'pnpm' }, 'foo', '1.3', '.', '--a=b').then((result) =>
      expect(result).toEqual(jsonValueString),
    );
    wrongCase = true;
    await installNpmPackage({ direct: 'pnpm' }, 'foo', '1.3', '.', '--a=b').then((result) =>
      expect(result).not.toEqual(jsonValueString),
    );
  });

  it('detectNpm finds package-lock.json', async () => {
    shouldFind = true;
    await clients.npm.detectClient('test').then((result) => expect(result).toBeTruthy());
    shouldFind = false;
    await clients.npm.detectClient('toast').then((result) => expect(result).toBeFalsy());
    shouldFind = true;
  });

  it('detectPnpm finds pnpm-lock.yaml', async () => {
    shouldFind = true;
    await clients.pnpm.detectClient('test').then((result) => expect(result).toBeTruthy());
    shouldFind = false;
    await clients.pnpm.detectClient('toast').then((result) => expect(result).toBeFalsy());
    shouldFind = true;
  });

  it('detectYarn finds yarn.lock', async () => {
    shouldFind = true;
    await clients.yarn.detectClient('test').then((result) => expect(result).toBeTruthy());
    shouldFind = false;
    specialCase = true;
    await clients.yarn.detectClient('toast').then((result) => expect(result).toBeFalsy());
    shouldFind = true;
    specialCase = false;
  });

  it('uses npm to verify whether a particular package is included in monorepo package', async () => {
    wrongCase = false;
    await isMonorepoPackageRef('npm', await determineNpmClient('./')).then((result) => expect(result).toBeTruthy());
    wrongCase = true;
    await isMonorepoPackageRef('npm', await determineNpmClient('./')).then((result) => expect(result).toBeFalsy());
  });

  it('verifies whether lerna bootstrap ran', async () => {
    wrongCase = false;
    await clients.lerna.installDependencies().then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await clients.lerna.installDependencies().then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('install dependencies with npm client', async () => {
    wrongCase = false;
    await installNpmDependencies({ direct: 'npm' }).then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installNpmDependencies({ direct: 'npm' }).then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('install dependencies with pnpm client', async () => {
    wrongCase = false;
    await installNpmDependencies({ direct: 'pnpm' }).then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installNpmDependencies({ direct: 'pnpm' }).then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('install dependencies with yarn client', async () => {
    wrongCase = false;
    await installNpmDependencies({ direct: 'yarn' }).then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installNpmDependencies({ direct: 'yarn' }).then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('create npm package', async () => {
    wrongCase = false;
    await createNpmPackage().then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await createNpmPackage().then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('find npm tarball', async () => {
    wrongCase = false;
    await findNpmTarball('foo').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await findNpmTarball('foo').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('find latest version', async () => {
    wrongCase = false;
    await findLatestVersion('foo').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await findLatestVersion('foo').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('find specific version', async () => {
    wrongCase = false;
    await findSpecificVersion('foo', '1.0.0').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await findSpecificVersion('foo', '1.0.0').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('check if package from full file is local', () => {
    const result = isLocalPackage('./', 'file://foo.tgz');
    expect(result).toBeTruthy();
  });

  it('check if package from current dir is local', () => {
    const result = isLocalPackage('./', './');
    expect(result).toBeTruthy();
  });

  it('check if package from file is local', () => {
    const result = isLocalPackage('./', 'foo.tgz');
    expect(result).toBeTruthy();
  });

  it('check if package from nothing is not local', () => {
    const result = isLocalPackage('./', '');
    expect(result).toBeFalsy();
  });

  it('check if package from tilde version is not local', () => {
    const result = isLocalPackage('./', '~12.2.2');
    expect(result).toBeFalsy();
  });

  it('check if package from caret version is not local', () => {
    const result = isLocalPackage('./', '^12.2.2');
    expect(result).toBeFalsy();
  });

  it('check if package from star version is not local', () => {
    const result = isLocalPackage('./', '*');
    expect(result).toBeFalsy();
  });

  it('check if package from greater than is not local', () => {
    const result = isLocalPackage('./', '>=1.0.0');
    expect(result).toBeFalsy();
  });

  it('check if package from home dir is local', () => {
    const result = isLocalPackage('./', '~/foo/bar');
    expect(result).toBeTruthy();
  });

  it('check if package from zero is not local', () => {
    const result = isLocalPackage('./', '.0');
    expect(result).toBeFalsy();
  });

  it('check if package from absolute dir is local', () => {
    const result = isLocalPackage('./', '/0');
    expect(result).toBeTruthy();
  });

  it('check if package is coming from git', () => {
    let result = isGitPackage('https://.foo.git');
    expect(result).toBeTruthy();
    result = isGitPackage('git+');
    expect(result).toBeTruthy();
    result = isGitPackage('');
    expect(result).toBeFalsy();
  });

  it('makeGitUrl returns valid git url', () => {
    let result = makeGitUrl('git+https://.foo.git');
    expect(result).toEqual('git+https://.foo.git');
    result = makeGitUrl('https://.foo.git');
    expect(result).toEqual('git+https://.foo.git');
  });

  it('makeFilePath returns valid file path', () => {
    let result = makeFilePath('/', 'file:/foo.tgz');
    expect(result).toEqual('file:/foo.tgz');
    result = makeFilePath(resolve('./test', ''), 'foo.tgz');
    const path = resolve('./test', 'foo.tgz');
    expect(result).toEqual(`file:${path}`);
  });

  it('verify whether package is linked', () => {
    const target = process.cwd();
    let result = isLinkedPackage('foo', 'registry', false, target);
    expect(result).toBeFalsy();
    result = isLinkedPackage('foo', 'file', false, target);
    expect(result).toBeFalsy();
    result = isLinkedPackage('foo', 'git', false, target);
    expect(result).toBeFalsy();
  });

  it('combine package refernce', () => {
    let result = combinePackageRef('foo', '1.0.0', 'registry');
    expect(result).toBe('foo@1.0.0');
    result = combinePackageRef('foo', '', 'registry');
    expect(result).toBe('foo@latest');
    result = combinePackageRef('foo', '', 'file');
    expect(result).toBe('foo');
    result = combinePackageRef('foo', '', 'git');
    expect(result).toBe('foo');
  });

  it('retrieve package name', async () => {
    let result = getPackageName('./', 'foo', 'file');
    expect(result).toBeInstanceOf(Promise);
    await result.then((message) => expect(message).toBeUndefined());
    result = getPackageName('./', 'foo', 'git');
    expect(result).toBeInstanceOf(Promise);
    await result.then((message) => expect(message).toBeUndefined());
    result = getPackageName('./', 'foo', 'registry');
    expect(result).toBeInstanceOf(Promise);
    await result.then((name) => expect(name).toEqual('foo'));
  });

  it('gets path to file package', () => {
    const result = getFilePackageVersion('./test/foo.tgz', './');
    expect(result).toEqual('file:test/foo.tgz');
  });

  it('gets path to git package', () => {
    const result = getGitPackageVersion('git+https://.foo.git');
    expect(result).toEqual('git+https://.foo.git');
  });

  it('get version of package', () => {
    let result = getPackageVersion(true, 'foo', '1.0.0', 'registry', './');
    expect(result).toEqual('1.0.0');
    result = getPackageVersion(false, 'foo', '1.0.0', 'registry', './');
    expect(result).toBeFalsy();
    result = getPackageVersion(true, './foo.tgz', '', 'file', './');
    expect(result).toEqual('file:foo.tgz');
    result = getPackageVersion(true, 'git+https://.foo.git', '', 'git', '');
    expect(result).toEqual('git+https://.foo.git');
  });

  it('gets path to git package', async () => {
    const result = getCurrentPackageDetails('./', './foo.tgz', '', 'file://foo.tgz', './');
    await result.then(([path, version]) => {
      expect(path).not.toBeUndefined();
    });
    const result2 = getCurrentPackageDetails('./', './foo.tgz', '', 'git+https://.foo.git', './');
    await result2.then(([path, version]) => {
      expect(path).not.toBeUndefined();
    });
    const result3 = getCurrentPackageDetails('./', './foo.tgz', '1.0.0', 'latest', './');
    await result3.then(([path, version]) => {
      expect(path).toEqual('./foo.tgz@latest');
      expect(version).toEqual('latest');
    });
  });

  it('makeExternals without externals returns coreExternals', async () => {
    const externals = await makeExternals(process.cwd(), { piral: '*' }, []);
    expect(externals).toEqual(['react', 'react-dom', 'react-router', 'react-router-dom', 'tslib']);
  });

  it('makeExternals with no externals returns coreExternals', async () => {
    const externals = await makeExternals(process.cwd(), { piral: '*' }, []);
    expect(externals).toEqual(['react', 'react-dom', 'react-router', 'react-router-dom', 'tslib']);
  });

  it('makeExternals with exclude coreExternals returns empty set', async () => {
    const externals = await makeExternals(process.cwd(), { piral: '*' }, ['!*']);
    expect(externals).toEqual([]);
  });

  it('makeExternals with externals concats coreExternals', async () => {
    const externals = await makeExternals(process.cwd(), { piral: '*' }, ['foo', 'bar']);
    expect(externals).toEqual(['foo', 'bar', 'react', 'react-dom', 'react-router', 'react-router-dom', 'tslib']);
  });

  it('makeExternals with external duplicate only reflects coreExternals', async () => {
    const externals = await makeExternals(process.cwd(), { piral: '*' }, ['react', 'foo']);
    expect(externals).toEqual(['react', 'foo', 'react-dom', 'react-router', 'react-router-dom', 'tslib']);
  });

  it('makeExternals with explicit include and exclude', async () => {
    const externals = await makeExternals(process.cwd(), { piral: '*' }, ['react', 'react-calendar', '!tslib']);
    expect(externals).toEqual(['react', 'react-calendar', 'react-dom', 'react-router', 'react-router-dom']);
  });

  it('makeExternals with all exclude and explicit include', async () => {
    const externals = await makeExternals(process.cwd(), { piral: '*' }, ['react', 'react-router-dom', '!*']);
    expect(externals).toEqual(['react', 'react-router-dom']);
  });
});
