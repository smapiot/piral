import { resolve, join, extname, basename, dirname, relative } from 'path';
import {
  readJson,
  copy,
  updateExistingJson,
  ForceOverwrite,
  findFile,
  checkExists,
  getHash,
  checkIsDirectory,
  matchFiles,
  getFileNames,
} from './io';
import { Framework } from './framework';
import { logFail, logWarn, logInfo } from './log';
import { cliVersion, coreExternals } from './info';
import { checkAppShellCompatibility } from './compatibility';
import { getDevDependencies, PiletLanguage } from './language';
import { PiletsInfo, TemplateFileLocation } from '../types';

export interface FileInfo {
  path: string;
  hash: string;
  changed: boolean;
}

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
    logWarn(`The version for "${name}" could not be resolved. Using "latest".`);
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
  mirror = false,
): Promise<Array<FileDescriptor>> {
  const { from, to, deep = true } = typeof file === 'string' ? { from: file, to: file, deep: true } : file;
  const sourcePath = resolve(source, from);
  const targetPath = resolve(target, mirror ? from : to);
  const isDirectory = await checkIsDirectory(sourcePath);

  if (isDirectory) {
    const pattern = deep ? '**/*' : '*';
    const files = await matchFiles(sourcePath, pattern);
    return files.map(file => ({
      sourcePath: file,
      targetPath: resolve(targetPath, relative(sourcePath, file)),
    }));
  } else if (globPatternStartIndicators.some(m => from.indexOf(m) !== -1)) {
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
    const tarRoot = resolve(target, mirror ? relRoot : to);

    return files.map(file => ({
      sourcePath: file,
      targetPath: resolve(tarRoot, relative(relRoot, file)),
    }));
  }

  return [
    {
      sourcePath,
      targetPath,
    },
  ];
}

function getFilesOf(root: string, name: string, file: string | TemplateFileLocation) {
  const source = getPiralPath(root, name);
  return getMatchingFiles(source, root, file);
}

export function findPackageRoot(pck: string, baseDir: string) {
  try {
    return require.resolve(`${pck}/package.json`, {
      paths: [baseDir],
    });
  } catch (ex) {
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
      const appPackage = require(path);
      const relPath = appPackage && appPackage.app;
      appPackage.app = relPath && resolve(dirname(path), relPath);
      return appPackage;
    }
  }

  return undefined;
}

export function readPiralPackage(root: string, name: string) {
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

export async function getFileStats(root: string, name: string, files: Array<string | TemplateFileLocation> = []) {
  const results: Array<FileInfo> = [];
  await Promise.all(
    files.map(async file => {
      const subfiles = await getFilesOf(root, name, file);

      for (const subfile of subfiles) {
        const { sourcePath, targetPath } = subfile;
        const sourceHash = await getHash(sourcePath);
        const targetHash = await getHash(targetPath);
        results.push({
          path: targetPath,
          hash: targetHash,
          changed: sourceHash !== targetHash,
        });
      }
    }),
  );
  return results;
}

async function copyFiles(
  subfiles: Array<FileDescriptor>,
  forceOverwrite: ForceOverwrite,
  originalFiles: Array<FileInfo>,
) {
  let result = true;

  for (const subfile of subfiles) {
    const { sourcePath, targetPath } = subfile;
    const exists = await checkExists(sourcePath);

    if (exists) {
      const overwrite = originalFiles.some(m => m.path === targetPath && !m.changed);
      const force = overwrite ? ForceOverwrite.yes : forceOverwrite;
      await copy(sourcePath, targetPath, force);
    } else {
      logFail(`The file "%s" does not exist!`, sourcePath);
      result = false;
    }
  }

  return result;
}

export async function copyScaffoldingFiles(
  source: string,
  target: string,
  files: Array<string | TemplateFileLocation>,
) {
  let result = true;

  for (const file of files) {
    const subfiles = await getMatchingFiles(source, target, file, true);
    const success = await copyFiles(subfiles, ForceOverwrite.yes, []);
    result = success && result;
  }

  return result;
}

export async function copyPiralFiles(
  root: string,
  name: string,
  files: Array<string | TemplateFileLocation>,
  forceOverwrite: ForceOverwrite,
  originalFiles: Array<FileInfo> = [],
) {
  let result = true;

  for (const file of files) {
    const subfiles = await getFilesOf(root, name, file);
    const success = await copyFiles(subfiles, forceOverwrite, originalFiles);
    result = success && result;
  }

  return result;
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

  if (extname(rootDir) !== '.html') {
    const packageName = basename(rootDir) === 'package.json' ? rootDir : join(rootDir, 'package.json');
    const exists = await checkExists(packageName);

    if (!exists) {
      logFail(`Cannot find a valid entry point. Missing package.json in "%s".`, rootDir);
      throw new Error('Invalid Piral instance.');
    }

    const { app } = require(packageName);

    if (!app) {
      logFail(`Cannot find a valid entry point. Missing field "%s" in the "%s".`, 'app', 'package.json');
      throw new Error('Invalid Piral instance.');
    }

    return join(dirname(packageName), app);
  }

  return rootDir;
}

function checkArrayOrUndefined(obj: Record<string, any>, key: string) {
  const items = obj[key];

  if (Array.isArray(items)) {
    return items;
  } else if (items !== undefined) {
    logWarn(`The value of "${key}" should be an array. Found "${typeof items}".`);
  }

  return undefined;
}

export async function findPackageVersion(rootPath: string, packageName: string) {
  try {
    const moduleName = require.resolve(packageName, {
      paths: [rootPath],
    });
    const packageJson = await findFile(moduleName, 'package.json');
    return require(packageJson).version;
  } catch (e) {
    logWarn(`Could not resolve "${packageName}" from "${rootPath}". Taking "latest" version.`);
    return 'latest';
  }
}

export async function retrievePiletsInfo(entryFile: string) {
  const exists = await checkExists(entryFile);

  if (!exists) {
    logFail(`The given entry pointing to "%s" does not exist.`, entryFile);
    throw new Error('Invalid Piral instance.');
  }

  const packageJson = await findFile(entryFile, 'package.json');

  if (!packageJson) {
    logFail('Cannot find any package.json. You need a valid package.json for your Piral instance.');
    throw new Error('Invalid Piral instance.');
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
  const piralDependencies = piralInfo.devDependencies || {};
  const typeDependencies = language !== undefined ? getDevDependencies(language) : {};
  const { externals, ...info } = getPiletsInfo(piralInfo);
  const piral = {
    comment: 'Keep this section to allow running `piral upgrade`.',
    name,
    version: piralInfo.version,
    tooling: cliVersion,
    externals,
    ...info,
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
  return info.files;
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

  return false;
}

export async function retrievePiletData(target: string, app?: string) {
  const packageJson = await findFile(target, 'package.json');

  if (!packageJson) {
    logFail('Cannot find the "%s". You need a valid package.json for your pilet.', 'package.json');
    throw new Error('Invalid pilet.');
  }

  const root = dirname(packageJson);
  const packageContent = require(packageJson);
  const appPackage = findPackage(
    app || (packageContent.piral && packageContent.piral.name) || Object.keys(packageContent.devDependencies),
    target,
  );
  const appFile: string = appPackage && appPackage.app;

  if (!appFile) {
    logFail(
      'Cannot find the Piral instance. Make sure the "%s" of the Piral instance is valid (has an "%s" field).',
      'package.json',
      'app',
    );
    throw new Error('Invalid Piral instance selected.');
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

  for (const file of files) {
    const ext = extname(file);

    if (file === entry || file.replace(ext, '') === entry) {
      return join(target, file);
    }
  }

  return entryFile;
}
