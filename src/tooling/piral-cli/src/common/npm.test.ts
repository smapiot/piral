import { resolve } from 'path';
import {
  dissectPackageName,
  installPackage,
  detectNpm,
  detectPnpm,
  detectYarn,
  isMonorepoPackageRef,
  detectMonorepo,
  bootstrapMonorepo,
  installDependencies,
  createPackage,
  findTarball,
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
} from './npm';

jest.mock('child_process');

jest.mock('../external', () => ({
  rc() {},
  logger: {
    stopSpinner() {},
    verbose() {},
    info() {},
    error() {},
    log() {},
    setOptions() {},
  },
}));

let specialCase = false;
let wrongCase = false;
const jsonValueString = JSON.stringify({ dependencies: { npm: { extraneous: true } } });
const jsonValueStringWrong = JSON.stringify({ dependencies: {} });

jest.mock('./scripts', () => ({
  runCommand: (exe: string, args: Array<string>, cwd: string, output?: NodeJS.WritableStream) => {
    return new Promise<void>((resolve) => {
      output?.write(wrongCase ? jsonValueStringWrong : jsonValueString, () => {});
      resolve();
    });
  },
}));

jest.mock('fs', () => ({
  constants: {
    F_OK: 1,
  },
  createReadStream() {
    return undefined;
  },
  exists: (file: string, cb: (status: boolean) => void) =>
    cb(!file.endsWith('package.json') && !(specialCase && (file.endsWith('lerna.json') || file.endsWith('yarn.lock')))),
  existsSync: (file: string) => {
    return true;
  },
  readFile: (file: string, type: string, callback: (err: NodeJS.ErrnoException, data: string) => void) => {
    return callback(undefined, '');
  },
  realpathSync: () => ({}),
  readFileSync: () => '',
  access: (path: string, mode: number, callback: (err: NodeJS.ErrnoException) => void) => {
    if (path.includes('test')) {
      return callback(undefined);
    } else {
      return callback(new Error('bla'));
    }
  },
}));

describe('NPM Module', () => {
  it('dissects a fully qualified name with latest correctly', async () => {
    wrongCase = false;
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'foo@latest');
    expect(hadVersion).toBe(true);
    expect(version).toBe('latest');
    expect(name).toBe('foo');
    expect(type).toBe('registry');
  });

  it('dissects a fully qualified name  with a specific version correctly', async () => {
    wrongCase = false;
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'foo@1.2.3');
    expect(hadVersion).toBe(true);
    expect(version).toBe('1.2.3');
    expect(name).toBe('foo');
    expect(type).toBe('registry');
  });

  it('dissects a simple name correctly', async () => {
    wrongCase = false;
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'foo');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('foo');
    expect(type).toBe('registry');
  });

  it('dissects a relative file name correctly', async () => {
    wrongCase = false;
    const [name, version, hadVersion, type] = await dissectPackageName('/home/yolo', '../foo/bar');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe(resolve('/home/yolo', '../foo/bar'));
    expect(type).toBe('file');
  });

  it('dissects an absolute file name correctly', async () => {
    wrongCase = false;
    const [name, version, hadVersion, type] = await dissectPackageName('/home/yolo', '/foo/bar');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe(resolve('/home/yolo', '/foo/bar'));
    expect(type).toBe('file');
  });

  it('dissects a git SSH repo name correctly', async () => {
    wrongCase = false;
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'ssh://foo-bar.com/foo.git');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('git+ssh://foo-bar.com/foo.git');
    expect(type).toBe('git');
  });

  it('dissects a git HTTPS repo name correctly', async () => {
    wrongCase = false;
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), 'https://foo-bar.com/foo.git');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('git+https://foo-bar.com/foo.git');
    expect(type).toBe('git');
  });

  it('dissects a scoped name correctly', async () => {
    wrongCase = false;
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), '@foo/bar');
    expect(hadVersion).toBe(false);
    expect(version).toBe('latest');
    expect(name).toBe('@foo/bar');
    expect(type).toBe('registry');
  });

  it('dissects a scoped fully qualified name with latest correctly', async () => {
    wrongCase = false;
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), '@foo/bar@latest');
    expect(hadVersion).toBe(true);
    expect(version).toBe('latest');
    expect(name).toBe('@foo/bar');
    expect(type).toBe('registry');
  });

  it('dissects a scoped fully qualified name  with a specific version correctly', async () => {
    wrongCase = false;
    const [name, version, hadVersion, type] = await dissectPackageName(process.cwd(), '@foo/bar@^1.x');
    expect(hadVersion).toBe(true);
    expect(version).toBe('^1.x');
    expect(name).toBe('@foo/bar');
    expect(type).toBe('registry');
  });

  it('installs a package using the NPM command line tool without a target', async () => {
    wrongCase = false;
    await installPackage('npm', 'foo', 'latest').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installPackage('npm', 'foo', 'latest').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('installs a package using the NPM command line tool without a version', async () => {
    wrongCase = false;
    await installPackage('npm', 'foo').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installPackage('npm', 'foo').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('installs a package using the Yarn command line tool without a version', async () => {
    wrongCase = false;
    await installPackage('yarn', 'foo').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installPackage('yarn', 'foo').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('installs a package using the Pnpm command line tool without a version', async () => {
    wrongCase = false;
    await installPackage('pnpm', 'foo').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installPackage('pnpm', 'foo').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('installs a package using the NPM command line tool with some flag', async () => {
    wrongCase = false;
    await installPackage('npm', 'foo', '1.3', '.', '--a=b').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installPackage('npm', 'foo', '1.3', '.', '--a=b').then((result) =>
      expect(result).not.toEqual(jsonValueString),
    );
  });

  it('detectNpm finds package-lock.json', async () => {
    await detectNpm('test').then((result) => expect(result).toBeTruthy());
    await detectNpm('toast').then((result) => expect(result).toBeFalsy());
  });

  it('detectPnpm finds nppm-lock.yaml', async () => {
    await detectPnpm('test').then((result) => expect(result).toBeTruthy());
    await detectPnpm('toast').then((result) => expect(result).toBeFalsy());
  });

  it('detectYarn finds yarn.lock', async () => {
    await detectYarn('test').then((result) => expect(result).toBeTruthy());
    specialCase = true;
    await detectYarn('toast').then((result) => expect(result).toBeFalsy());
    specialCase = false;
  });

  it('uses npm to verify whether a particular package is included in monorepo package', async () => {
    wrongCase = false;
    await isMonorepoPackageRef('npm', './').then((result) => expect(result).toBeTruthy());
    wrongCase = true;
    await isMonorepoPackageRef('npm', './').then((result) => expect(result).toBeFalsy());
  });

  it('verifies whether lerna config path is valid', async () => {
    wrongCase = false;
    await detectMonorepo('./').then((result) => {
      expect(result).toBe('lerna');
    });
    wrongCase = true;
    specialCase = true;
    await detectMonorepo('./').then((result) => {
      expect(result).toBe('none');
    });
    specialCase = false;
  });

  it('verifies whether lerna bootstrap ran', async () => {
    wrongCase = false;
    await bootstrapMonorepo().then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await bootstrapMonorepo().then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('install dependencies with npm client', async () => {
    wrongCase = false;
    await installDependencies('npm').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installDependencies('npm').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('install dependencies with pnpm client', async () => {
    wrongCase = false;
    await installDependencies('pnpm').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installDependencies('pnpm').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('install dependencies with yarn client', async () => {
    wrongCase = false;
    await installDependencies('yarn').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await installDependencies('yarn').then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('create npm package', async () => {
    wrongCase = false;
    await createPackage().then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await createPackage().then((result) => expect(result).not.toEqual(jsonValueString));
  });

  it('find npm tarball', async () => {
    wrongCase = false;
    await findTarball('foo').then((result) => expect(result).toEqual(jsonValueString));
    wrongCase = true;
    await findTarball('foo').then((result) => expect(result).not.toEqual(jsonValueString));
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

  it('check if package is local', () => {
    let result = isLocalPackage('./', 'file://foo.tgz');
    expect(result).toBeTruthy();
    result = isLocalPackage('./', './');
    expect(result).toBeTruthy();
    result = isLocalPackage('./', 'foo.tgz');
    expect(result).toBeTruthy();
    result = isLocalPackage('./', null);
    expect(result).toBeFalsy();
  });

  it('check if package is coming from git', () => {
    let result = isGitPackage('https://.foo.git');
    expect(result).toBeTruthy();
    result = isGitPackage('git+');
    expect(result).toBeTruthy();
    result = isGitPackage(null);
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
    let result = isLinkedPackage('foo', 'registry', false);
    expect(result).toBeFalsy();
    result = isLinkedPackage('foo', 'file', false);
    expect(result).toBeFalsy();
    result = isLinkedPackage('foo', 'git', false);
    expect(result).toBeFalsy();
  });

  it('combine package refernce', () => {
    let result = combinePackageRef('foo', '1.0.0', 'registry');
    expect(result).toBe('foo@1.0.0');
    result = combinePackageRef('foo', null, 'registry');
    expect(result).toBe('foo@latest');
    result = combinePackageRef('foo', null, 'file');
    expect(result).toBe('foo');
    result = combinePackageRef('foo', null, 'git');
    expect(result).toBe('foo');
  });

  it('retrieve package name', () => {
    let result = getPackageName('./', 'foo', 'file');
    expect(result).toBeInstanceOf(Promise);
    result.then((message) => expect(message).toBeUndefined());
    result = getPackageName('./', 'foo', 'git');
    expect(result).toBeInstanceOf(Promise);
    result.then((message) => expect(message).toBeUndefined());
    result = getPackageName('./', 'foo', 'registry');
    expect(result).toBeInstanceOf(Promise);
    result.then((name) => expect(name).toEqual('foo'));
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
    result = getPackageVersion(true, './foo.tgz', null, 'file', './');
    expect(result).toEqual('file:foo.tgz');
    result = getPackageVersion(true, 'git+https://.foo.git', null, 'git', null);
    expect(result).toEqual('git+https://.foo.git');
  });

  it('gets path to git package', () => {
    const result = getCurrentPackageDetails('./', './foo.tgz', null, 'file://foo.tgz', './');
    result.then(([path, version]) => {
      expect(path).not.toBeUndefined();
    });
    const result2 = getCurrentPackageDetails('./', './foo.tgz', null, 'git+https://.foo.git', './');
    result2.then(([path, version]) => {
      expect(path).not.toBeUndefined();
    });
    const result3 = getCurrentPackageDetails('./', './foo.tgz', '1.0.0', 'latest', './');
    result3.then(([path, version]) => {
      expect(path).toEqual('./foo.tgz@latest');
      expect(version).toEqual('latest');
    });
  });

  it('makeExternals without externals returns coreExternals', () => {
    const externals = makeExternals();
    expect(externals).toEqual([
      '@dbeining/react-atom',
      '@libre/atom',
      'history',
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'tslib',
      'path-to-regexp',
    ]);
  });

  it('makeExternals with no externals returns coreExternals', () => {
    const externals = makeExternals([]);
    expect(externals).toEqual([
      '@dbeining/react-atom',
      '@libre/atom',
      'history',
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'tslib',
      'path-to-regexp',
    ]);
  });

  it('makeExternals with exclude coreExternals returns empty set', () => {
    const externals = makeExternals(['!*']);
    expect(externals).toEqual([]);
  });

  it('makeExternals with externals concats coreExternals', () => {
    const externals = makeExternals(['foo', 'bar']);
    expect(externals).toEqual([
      'foo',
      'bar',
      '@dbeining/react-atom',
      '@libre/atom',
      'history',
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'tslib',
      'path-to-regexp',
    ]);
  });

  it('makeExternals with external duplicate only reflects coreExternals', () => {
    const externals = makeExternals(['react', 'foo']);
    expect(externals).toEqual([
      'react',
      'foo',
      '@dbeining/react-atom',
      '@libre/atom',
      'history',
      'react-dom',
      'react-router',
      'react-router-dom',
      'tslib',
      'path-to-regexp',
    ]);
  });

  it('makeExternals with explicit include and exclude', () => {
    const externals = makeExternals(['react', 'react-calendar', '!history']);
    expect(externals).toEqual([
      'react',
      'react-calendar',
      '@dbeining/react-atom',
      '@libre/atom',
      'react-dom',
      'react-router',
      'react-router-dom',
      'tslib',
      'path-to-regexp',
    ]);
  });

  it('makeExternals with all exclude and explicit include', () => {
    const externals = makeExternals(['react', 'react-router-dom', '!*']);
    expect(externals).toEqual(['react', 'react-router-dom']);
  });
});
