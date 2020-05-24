import { resolve, join, extname, basename, dirname, relative } from 'path';
import { log, fail } from './log';
import { unpackTarball } from './archive';
import { getDevDependencies } from './language';
import { cliVersion, coreExternals } from './info';
import { checkAppShellCompatibility } from './compatibility';
import { getHash, checkIsDirectory, matchFiles, getFileNames } from './io';
import { readJson, copy, updateExistingJson, findFile, checkExists } from './io';
import { PiletLanguage, ForceOverwrite } from './enums';
import { Framework, FileInfo, PiletsInfo, TemplateFileLocation } from '../types';

function getPiralPath(root: string, name: string) {
  return resolve(root, 'node_modules', name);
}

function getDependencyVersion(
  name: string,
  devDependencies: Record<string, string | true>,
  allDependencies: Record<string, string>,
) {
  const version = devDependencies[name];
  const selected = typeof version === 'string' ? version : version === true ? allDependencies[name] : undefined;

  if (!selected) {
    log('cannotResolveVersion_0052', name);
  }

  return selected || 'latest';
}

interface FileDescriptor {
  sourcePath: string;
  targetPath: string;
}

const globPatternStartIndicators = ['*', '?', '[', '!(', '?(', '+(', '@('];

async function getMatchingFiles(
  source: string,
  target: string,
  file: string | TemplateFileLocation,
): Promise<Array<FileDescriptor>> {
  const { from, to, deep = true } = typeof file === 'string' ? { from: file, to: file, deep: true } : file;
  const sourcePath = resolve(source, from);
  const targetPath = resolve(target, to);
  const isDirectory = await checkIsDirectory(sourcePath);

  if (isDirectory) {
    log('generalDebug_0003', `Matching in directory "${sourcePath}".`);
    const pattern = deep ? '**/*' : '*';
    const files = await matchFiles(sourcePath, pattern);
    return files.map(file => ({
      sourcePath: file,
      targetPath: resolve(targetPath, relative(sourcePath, file)),
    }));
  } else if (globPatternStartIndicators.some(m => from.indexOf(m) !== -1)) {
    log('generalDebug_0003', `Matching using glob "${sourcePath}".`);
    const files = await matchFiles(source, from);
    const parts = sourcePath.split('/');

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (globPatternStartIndicators.some(m => part.indexOf(m) !== -1)) {
        parts.splice(i, parts.length - i);
        break;
      }
    }

    const relRoot = parts.join('/');
    const tarRoot = resolve(target, to);

    return files.map(file => ({
      sourcePath: file,
      targetPath: resolve(tarRoot, relative(relRoot, file)),
    }));
  }

  log('generalDebug_0003', `Assume direct path source "${sourcePath}".`);

  return [
    {
      sourcePath,
      targetPath,
    },
  ];
}

export function findPackageRoot(pck: string, baseDir: string) {
  try {
    return require.resolve(`${pck}/package.json`, {
      paths: [baseDir],
    });
  } catch (ex) {
    log('generalDebug_0003', `Could not find the package root in "${baseDir}": ${ex}.`);
    return undefined;
  }
}

function findPackage(pck: string | Array<string>, baseDir: string) {
  if (Array.isArray(pck)) {
    for (const item of pck) {
      const result = findPackage(item, baseDir);

      if (result) {
        return result;
      }
    }
  } else {
    const path = findPackageRoot(pck, baseDir);

    if (path) {
      log('generalDebug_0003', `Following the app package in "${path}" ...`);
      const appPackage = require(path);
      const relPath = appPackage && appPackage.app;
      appPackage.app = relPath && resolve(dirname(path), relPath);
      return appPackage;
    }
  }

  return undefined;
}

export function readPiralPackage(root: string, name: string) {
  log('generalDebug_0003', `Reading the piral package in "${root}" ...`);
  const path = getPiralPath(root, name);
  return readJson(path, 'package.json');
}

export function getPiralPackage(app: string, language: PiletLanguage, version: string, framework: Framework) {
  const typings = framework === 'piral-base' ? {} : undefined;
  return {
    app,
    scripts: {
      start: 'piral debug',
      build: 'piral build',
    },
    pilets: getPiletsInfo({}),
    devDependencies: {
      ...getDevDependencies(language, typings),
      'piral-cli': `${version}`,
    },
  };
}

async function getAvailableFiles(root: string, name: string) {
  const source = getPiralPath(root, name);
  log('generalDebug_0003', `Checking if "files.tar" exists in "${source}" ...`);
  const exists = await checkExists(resolve(source, 'files.tar'));

  if (exists) {
    await unpackTarball(source, 'files.tar');
  }

  log('generalDebug_0003', `Get matching files from "${source}".`);
  const base = resolve(source, 'files');
  const files = await matchFiles(base, '**/*');
  return files.map(file => ({
    sourcePath: file,
    targetPath: resolve(root, relative(base, file)),
  }));
}

export async function getFileStats(root: string, name: string) {
  const files = await getAvailableFiles(root, name);
  return await Promise.all(
    files.map(async file => {
      const { sourcePath, targetPath } = file;
      const sourceHash = await getHash(sourcePath);
      log('generalDebug_0003', `Obtained hash from "${sourcePath}": ${sourceHash}`);
      const targetHash = await getHash(targetPath);
      log('generalDebug_0003', `Obtained hash from "${targetPath}": ${targetHash}`);
      return {
        path: targetPath,
        hash: targetHash,
        changed: sourceHash !== targetHash,
      };
    }),
  );
}

async function copyFiles(
  subfiles: Array<FileDescriptor>,
  forceOverwrite: ForceOverwrite,
  originalFiles: Array<FileInfo>,
) {
  for (const subfile of subfiles) {
    const { sourcePath, targetPath } = subfile;
    const exists = await checkExists(sourcePath);

    if (exists) {
      const overwrite = originalFiles.some(m => m.path === targetPath && !m.changed);
      const force = overwrite ? ForceOverwrite.yes : forceOverwrite;
      await copy(sourcePath, targetPath, force);
    } else {
      fail('cannotFindFile_0046', sourcePath);
    }
  }
}

export async function copyScaffoldingFiles(
  source: string,
  target: string,
  files: Array<string | TemplateFileLocation>,
) {
  log('generalDebug_0003', `Copying the scaffolding files ...`);

  for (const file of files) {
    const subfiles = await getMatchingFiles(source, target, file);
    await copyFiles(subfiles, ForceOverwrite.yes, []);
  }
}

export async function copyPiralFiles(
  root: string,
  name: string,
  forceOverwrite: ForceOverwrite,
  originalFiles: Array<FileInfo>,
) {
  log('generalDebug_0003', `Copying the Piral files ...`);
  const files = await getAvailableFiles(root, name);
  await copyFiles(files, forceOverwrite, originalFiles);
}

export function getPiletsInfo(piralInfo: any): PiletsInfo {
  const {
    files = [],
    externals = [],
    scripts = {},
    validators = {},
    devDependencies = {},
    preScaffold = '',
    postScaffold = '',
    preUpgrade = '',
    postUpgrade = '',
  } = piralInfo.pilets || {};

  return {
    files,
    externals,
    scripts,
    validators,
    devDependencies,
    preScaffold,
    postScaffold,
    preUpgrade,
    postUpgrade,
  };
}

export async function retrievePiralRoot(baseDir: string, entry: string) {
  const rootDir = join(baseDir, entry);
  log('generalDebug_0003', `Retrieving Piral root from "${rootDir}" ...`);

  if (extname(rootDir) !== '.html') {
    const packageName = basename(rootDir) === 'package.json' ? rootDir : join(rootDir, 'package.json');
    log('generalDebug_0003', `Trying to get entry point from "${packageName}".`);
    const exists = await checkExists(packageName);

    if (!exists) {
      fail('entryPointMissing_0070', rootDir);
    }

    const { app } = require(packageName);

    if (!app) {
      fail('entryPointMissing_0071');
    }

    log('generalDebug_0003', `Found app entry point in "${app}".`);
    return join(dirname(packageName), app);
  }

  log('generalDebug_0003', `Found app entry point in "${rootDir}".`);
  return rootDir;
}

function checkArrayOrUndefined(obj: Record<string, any>, key: string) {
  const items = obj[key];

  if (Array.isArray(items)) {
    return items;
  } else if (items !== undefined) {
    log('expectedArray_0072', key, typeof items);
  }

  return undefined;
}

export async function findPackageVersion(rootPath: string, packageName: string): Promise<string> {
  try {
    log('generalDebug_0003', `Finding the version of "${packageName}" in "${rootPath}".`);
    const moduleName = require.resolve(packageName, {
      paths: [rootPath],
    });
    const packageJson = await findFile(moduleName, 'package.json');
    return require(packageJson).version;
  } catch (e) {
    log('cannotResolveDependency_0053', packageName, rootPath);
    return 'latest';
  }
}

export async function retrievePiletsInfo(entryFile: string) {
  const exists = await checkExists(entryFile);

  if (!exists) {
    fail('entryPointDoesNotExist_0073', entryFile);
  }

  const packageJson = await findFile(entryFile, 'package.json');

  if (!packageJson) {
    fail('packageJsonMissing_0074');
  }

  const packageInfo = require(packageJson);

  return {
    ...getPiletsInfo(packageInfo),
    name: packageInfo.name,
    version: packageInfo.version,
    dependencies: {
      std: packageInfo.dependencies || {},
      dev: packageInfo.devDependencies || {},
      peer: packageInfo.peerDependencies || {},
    },
    ignored: checkArrayOrUndefined(packageInfo, 'preservedDependencies'),
    root: dirname(packageJson),
  };
}

function isValidDependency(name: string) {
  // super simple check at the moment
  // just to filter out things like "redux-saga/effects"
  return name.indexOf('/') === -1 || name.indexOf('@') === 0;
}

export async function patchPiletPackage(
  root: string,
  name: string,
  version: string,
  piralInfo: any,
  language?: PiletLanguage,
) {
  log('generalDebug_0003', `Patching the package.json in "${root}" ...`);
  const piralDependencies = piralInfo.devDependencies || {};
  const typeDependencies = language !== undefined ? getDevDependencies(language) : {};
  const { externals, ...info } = getPiletsInfo(piralInfo);
  const piral = {
    comment: 'Keep this section to use the Piral CLI.',
    name,
  };
  const allExternals = [...externals, ...coreExternals];
  const scripts = {
    start: 'pilet debug',
    build: 'pilet build',
    upgrade: 'pilet upgrade',
    ...info.scripts,
  };
  const peerDependencies = {
    ...allExternals.reduce((deps, name) => {
      deps[name] = '*';
      return deps;
    }, {}),
    [name]: `*`,
  };
  const devDependencies = {
    ...Object.keys(typeDependencies).reduce((deps, name) => {
      deps[name] = piralDependencies[name] || typeDependencies[name];
      return deps;
    }, {}),
    ...Object.keys(info.devDependencies).reduce((deps, name) => {
      deps[name] = getDependencyVersion(name, info.devDependencies, piralDependencies);
      return deps;
    }, {}),
    ...allExternals.filter(isValidDependency).reduce((deps, name) => {
      deps[name] = piralDependencies[name] || 'latest';
      return deps;
    }, {}),
    [name]: `${version || piralInfo.version}`,
    'piral-cli': `^${cliVersion}`,
  };
  await updateExistingJson(root, 'package.json', {
    piral,
    devDependencies,
    peerDependencies,
    scripts,
  });
  log('generalDebug_0003', `Succesfully patched the package.json.`);
}

/**
 * Returns true if its an emulator package, otherwise it has to be a "raw" app shell.
 */
export function checkAppShellPackage(appPackage: any) {
  const { piralCLI = { generated: false, version: cliVersion } } = appPackage;

  if (piralCLI.generated) {
    checkAppShellCompatibility(piralCLI.version);
    return true;
  }

  log('generalDebug_0003', `Missing "piralCLI" section. Assume raw app shell.`);
  return false;
}

export async function retrievePiletData(target: string, app?: string) {
  const packageJson = await findFile(target, 'package.json');

  if (!packageJson) {
    fail('packageJsonMissing_0075');
  }

  const root = dirname(packageJson);
  const packageContent = require(packageJson);
  const appPackage = findPackage(
    app || (packageContent.piral && packageContent.piral.name) || Object.keys(packageContent.devDependencies),
    target,
  );
  const appFile: string = appPackage && appPackage.app;

  if (!appFile) {
    fail('appInstanceInvalid_0011');
  }

  const emulator = checkAppShellPackage(appPackage);

  return {
    dependencies: packageContent.dependencies || {},
    devDependencies: packageContent.devDependencies || {},
    peerDependencies: packageContent.peerDependencies || {},
    ignored: checkArrayOrUndefined(packageContent, 'preservedDependencies'),
    appFile,
    appPackage,
    emulator,
    root,
  };
}

export async function findEntryModule(entryFile: string, target: string) {
  const entry = basename(entryFile);
  const files = await getFileNames(target);
  log('generalDebug_0003', `Found ${files.length} potential entry points in "${target}".`);

  for (const file of files) {
    const ext = extname(file);

    if (file === entry || file.replace(ext, '') === entry) {
      return join(target, file);
    }
  }

  return entryFile;
}
