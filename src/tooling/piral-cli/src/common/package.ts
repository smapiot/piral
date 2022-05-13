import { resolve, join, extname, basename, dirname, relative } from 'path';
import { log, fail } from './log';
import { cliVersion } from './info';
import { unpackTarball } from './archive';
import { getDependencies, getDevDependencies } from './language';
import { SourceLanguage, ForceOverwrite } from './enums';
import { checkAppShellCompatibility } from './compatibility';
import { deepMerge } from './merge';
import { computeHash } from './hash';
import { applyTemplate } from './template';
import { isGitPackage, isLocalPackage, makeGitUrl, makeFilePath, makePiletExternals, makeExternals } from './npm';
import { filesTar, filesOnceTar, declarationEntryExtensions, bundlerNames } from './constants';
import { getHash, checkIsDirectory, matchFiles } from './io';
import { readJson, copy, updateExistingJson, findFile, checkExists } from './io';
import { Framework, FileInfo, PiletsInfo, TemplateFileLocation, SharedDependency, PackageData } from '../types';

function appendBundler(devDependencies: Record<string, string>, bundler: string, version: string) {
  if (bundler && bundler !== 'none') {
    if (bundlerNames.includes(bundler as any)) {
      devDependencies[`piral-cli-${bundler}`] = version;
    } else if (!isValidDependency(bundler)) {
      //Error case - print warning and ignore
      log('generalWarning_0001', `The provided bundler name "${bundler}" does not refer to a valid package name.'`);
    } else {
      const sep = bundler.indexOf('@', 1);
      const name = bundler.substring(0, sep !== -1 ? sep : bundler.length);
      const version = sep !== -1 ? bundler.substring(sep + 1) : 'latest';
      devDependencies[name] = version;
    }
  }
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
  template: boolean;
}

const globPatternStartIndicators = ['*', '?', '[', '!(', '?(', '+(', '@('];

async function getMatchingFiles(
  source: string,
  target: string,
  file: string | TemplateFileLocation,
): Promise<Array<FileDescriptor>> {
  const {
    from,
    to,
    deep = true,
    template = false,
  } = typeof file === 'string' ? { from: file, to: file, deep: true } : file;
  const sourcePath = resolve(source, from);
  const targetPath = resolve(target, to);
  const isDirectory = await checkIsDirectory(sourcePath);

  if (isDirectory) {
    log('generalDebug_0003', `Matching in directory "${sourcePath}".`);
    const pattern = deep ? '**/*' : '*';
    const files = await matchFiles(sourcePath, pattern);
    return files.map((file) => ({
      sourcePath: file,
      targetPath: resolve(targetPath, relative(sourcePath, file)),
      template,
    }));
  } else if (globPatternStartIndicators.some((m) => from.indexOf(m) !== -1)) {
    log('generalDebug_0003', `Matching using glob "${sourcePath}".`);
    const files = await matchFiles(source, from);
    const parts = sourcePath.split('/');

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (globPatternStartIndicators.some((m) => part.indexOf(m) !== -1)) {
        parts.splice(i, parts.length - i);
        break;
      }
    }

    const relRoot = parts.join('/');
    const tarRoot = resolve(target, to);

    return files.map((file) => ({
      sourcePath: file,
      targetPath: resolve(tarRoot, relative(relRoot, file)),
      template,
    }));
  }

  log('generalDebug_0003', `Assume direct path source "${sourcePath}".`);

  return [
    {
      sourcePath,
      targetPath,
      template,
    },
  ];
}

export function getPiralPath(root: string, name: string) {
  try {
    const path = require.resolve(`${name}/package.json`, {
      paths: [root],
    });
    return dirname(path);
  } catch (ex) {
    log('generalDebug_0003', `Could not resolve the Piral path of "${name}" in "${root}": ${ex}.`);
    fail('invalidPiralReference_0043');
  }
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

export function readPiralPackage(root: string, name: string): Promise<PackageData> {
  log('generalDebug_0003', `Reading the piral package in "${root}" ...`);
  const path = getPiralPath(root, name);
  return readJson(path, 'package.json');
}

export function getPiralPackage(
  app: string,
  language: SourceLanguage,
  version: string,
  framework: Framework,
  bundler?: string,
) {
  // take default packages only if piral-core
  const packages = framework !== 'piral-core' ? {} : undefined;
  // take default dev packages only if not piral-base
  const typings = framework === 'piral-base' ? {} : undefined;
  const devDependencies = {
    ...getDevDependencies(language, typings),
    'piral-cli': `${version}`,
  };
  const dependencies = {
    ...getDependencies(language, packages),
  };

  appendBundler(devDependencies, bundler, version);

  return {
    app,
    scripts: {
      start: 'piral debug',
      build: 'piral build',
    },
    pilets: getPiletsInfo({}),
    dependencies,
    devDependencies,
  };
}

async function getAvailableFiles(
  root: string,
  name: string,
  dirName: string,
  fileMap: Array<TemplateFileLocation>,
): Promise<Array<FileDescriptor>> {
  const source = getPiralPath(root, name);
  const tgz = `${dirName}.tar`;
  log('generalDebug_0003', `Checking if "${tgz}" exists in "${source}" ...`);
  const exists = await checkExists(resolve(source, tgz));

  if (exists) {
    await unpackTarball(source, tgz);
  }

  log('generalDebug_0003', `Get matching files from "${source}".`);
  const base = resolve(source, dirName);
  const files = await matchFiles(base, '**/*');

  return files.map((file) => ({
    sourcePath: file,
    targetPath: resolve(root, relative(base, file)),
    template: fileMap.find((m) => resolve(source, m.from) === file)?.template || false,
  }));
}

export async function getFileStats(root: string, name: string, fileMap: Array<TemplateFileLocation> = []) {
  const files = await getAvailableFiles(root, name, filesTar, fileMap);

  return await Promise.all(
    files.map(async (file) => {
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
  variables?: Record<string, string>,
) {
  for (const subfile of subfiles) {
    const { sourcePath, targetPath, template } = subfile;
    const exists = await checkExists(sourcePath);

    if (exists) {
      const overwrite = originalFiles.some((m) => m.path === targetPath && !m.changed);
      const force = overwrite ? ForceOverwrite.yes : forceOverwrite;
      const written = await copy(sourcePath, targetPath, force);

      if (written && template && variables) {
        await applyTemplate(targetPath, variables);
      }
    } else {
      fail('cannotFindFile_0046', sourcePath);
    }
  }
}

export async function copyScaffoldingFiles(
  source: string,
  target: string,
  files: Array<string | TemplateFileLocation>,
  piralInfo?: any,
  variables?: Record<string, string>,
) {
  log('generalDebug_0003', `Copying the scaffolding files ...`);
  const allFiles: Array<FileDescriptor> = [];

  for (const file of files) {
    const subfiles = await getMatchingFiles(source, target, file);
    allFiles.push(...subfiles);
  }

  if (piralInfo) {
    await extendPackageOverridesFromTemplateFragment(target, piralInfo, allFiles);
  }

  await copyFiles(allFiles, ForceOverwrite.yes, [], variables);
}

async function extendPackageOverridesFromTemplateFragment(root: string, piralInfo: any, files: Array<FileDescriptor>) {
  const packageTarget = resolve(root, 'package.json');

  for (let i = files.length; i--; ) {
    const file = files[i];

    if (file.targetPath === packageTarget) {
      const fragment = await readJson(dirname(file.sourcePath), basename(file.sourcePath));
      files.splice(i, 1);

      if (!piralInfo.pilets) {
        piralInfo.pilets = {};
      }

      if (!piralInfo.pilets.packageOverrides) {
        piralInfo.pilets.packageOverrides = {};
      }

      piralInfo.pilets.packageOverrides = {
        ...piralInfo.pilets.packageOverrides,
        ...fragment,
      };
    }
  }
}

function isTemplateFileLocation(item: string | TemplateFileLocation): item is TemplateFileLocation {
  return typeof item === 'object';
}

function tryFindPackageVersion(packageName: string): string {
  try {
    const { version } = require(`${packageName}/package.json`);
    return version;
  } catch {
    return undefined;
  }
}

export async function copyPiralFiles(
  root: string,
  name: string,
  piralInfo: PackageData,
  forceOverwrite: ForceOverwrite,
  variables: Record<string, string>,
  originalFiles?: Array<FileInfo>,
) {
  log('generalDebug_0003', `Copying the Piral files ...`);
  const { files: _files } = getPiletsInfo(piralInfo);
  const fileMap = _files.filter(isTemplateFileLocation);
  const files = await getAvailableFiles(root, name, filesTar, fileMap);

  if (originalFiles === undefined) {
    const initialFiles = await getAvailableFiles(root, name, filesOnceTar, fileMap);
    files.push(...initialFiles);
    originalFiles = [];
  }

  await extendPackageOverridesFromTemplateFragment(root, piralInfo, files);
  await copyFiles(files, forceOverwrite, originalFiles, variables);
}

export function getPiletsInfo(piralInfo: Partial<PackageData>): PiletsInfo {
  const {
    files = [],
    externals = [],
    scripts = {},
    template = 'default',
    validators = {},
    devDependencies = {},
    preScaffold = '',
    postScaffold = '',
    preUpgrade = '',
    postUpgrade = '',
    packageOverrides = {},
  } = piralInfo.pilets || {};

  return {
    files,
    externals,
    scripts,
    template,
    validators,
    devDependencies,
    preScaffold,
    postScaffold,
    preUpgrade,
    postUpgrade,
    packageOverrides,
  };
}

export async function retrievePiralRoot(baseDir: string, entry: string) {
  const rootDir = join(baseDir, entry);
  log('generalDebug_0003', `Retrieving Piral root from "${rootDir}" ...`);

  if (!declarationEntryExtensions.includes(extname(rootDir).toLowerCase())) {
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

export function findDependencyVersion(
  pckg: Record<string, any>,
  rootPath: string,
  packageName: string,
): Promise<string> {
  const { devDependencies = {}, dependencies = {} } = pckg;
  const desiredVersion = dependencies[packageName] ?? devDependencies[packageName];

  if (desiredVersion) {
    if (isGitPackage(desiredVersion)) {
      return Promise.resolve(makeGitUrl(desiredVersion));
    } else if (isLocalPackage(rootPath, desiredVersion)) {
      return Promise.resolve(makeFilePath(rootPath, desiredVersion));
    }
  }

  return findPackageVersion(rootPath, packageName);
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

  const root = dirname(packageJson);
  const packageInfo = require(packageJson);
  const allDeps = {
    ...packageInfo.devDependencies,
    ...packageInfo.dependencies,
  };
  const info = getPiletsInfo(packageInfo);
  const externals = makeExternals(root, allDeps, info.externals);

  return {
    ...info,
    externals,
    name: packageInfo.name,
    version: packageInfo.version,
    dependencies: {
      std: packageInfo.dependencies || {},
      dev: packageInfo.devDependencies || {},
      peer: packageInfo.peerDependencies || {},
    },
    scripts: packageInfo.scripts,
    ignored: checkArrayOrUndefined(packageInfo, 'preservedDependencies'),
    root,
  };
}

export function isValidDependency(name: string) {
  // super simple check at the moment
  // just to filter out things like "redux-saga/effects" and "@scope/redux-saga/effects"
  return name.indexOf('/') === -1 || (name.indexOf('@') === 0 && name.split('/').length < 3);
}

export async function patchPiletPackage(
  root: string,
  name: string,
  version: string,
  piralInfo: PackageData,
  fromEmulator: boolean,
  newInfo?: { language: SourceLanguage; bundler: string },
) {
  log('generalDebug_0003', `Patching the package.json in "${root}" ...`);
  const { externals, packageOverrides, ...info } = getPiletsInfo(piralInfo);
  const piral = {
    comment: 'Keep this section to use the Piral CLI.',
    name,
  };
  const piralDependencies = {
    ...piralInfo.devDependencies,
    ...piralInfo.dependencies,
  };
  const typeDependencies = newInfo ? getDevDependencies(newInfo.language) : {};
  const scripts = newInfo
    ? {
        start: 'pilet debug',
        build: 'pilet build',
        upgrade: 'pilet upgrade',
        ...info.scripts,
      }
    : info.scripts;
  const peerModules = [];
  const allExternals = makePiletExternals(root, piralDependencies, externals, fromEmulator, piralInfo);
  const peerDependencies = {
    ...allExternals.reduce((deps, name) => {
      const valid = isValidDependency(name);
      deps[name] = valid ? '*' : undefined;

      if (!valid) {
        peerModules.push(name);
      }

      return deps;
    }, {}),
    [name]: `*`,
  };
  const devDependencies: Record<string, string> = {
    ...Object.keys(typeDependencies).reduce((deps, name) => {
      deps[name] = piralDependencies[name] || typeDependencies[name];
      return deps;
    }, {}),
    ...Object.keys(info.devDependencies).reduce((deps, name) => {
      deps[name] = getDependencyVersion(name, info.devDependencies, piralDependencies);
      return deps;
    }, {}),
    ...allExternals.filter(isValidDependency).reduce((deps, name) => {
      const version = piralDependencies[name] || tryFindPackageVersion(name);

      if (version || newInfo) {
        // set only if we have an explicit version or we are in the scaffolding case
        deps[name] = version || 'latest';
      }

      return deps;
    }, {}),
    [name]: `${version || piralInfo.version}`,
  };

  if (newInfo) {
    const bundler = newInfo.bundler;
    const version = `^${cliVersion}`;
    devDependencies['piral-cli'] = version;
    appendBundler(devDependencies, bundler, version);
  }

  const packageContent = deepMerge(packageOverrides, {
    piral,
    devDependencies,
    peerDependencies,
    peerModules,
    dependencies: {
      [name]: undefined,
    },
    scripts,
  });

  await updateExistingJson(root, 'package.json', packageContent);
  log('generalDebug_0003', `Succesfully patched the package.json.`);
}

/**
 * Returns true if its an emulator package, otherwise it has to be a "raw" app shell.
 */
export function checkAppShellPackage(appPackage: PackageData) {
  const { piralCLI = { generated: false, version: cliVersion } } = appPackage;

  if (piralCLI.generated) {
    checkAppShellCompatibility(piralCLI.version);
    return true;
  }

  log('generalDebug_0003', `Missing "piralCLI" section. Assume raw app shell.`);
  return false;
}

function tryResolve(baseDir: string, name: string) {
  try {
    return require.resolve(name, {
      paths: [baseDir],
    });
  } catch (ex) {
    log('generalDebug_0003', `Could not resolve the package "${name}" in "${baseDir}": ${ex}`);
    return undefined;
  }
}

interface Importmap {
  imports: Record<string, string>;
}

function normalizeDepName(s: string) {
  return (s.startsWith('@') ? s.substring(1) : s).replace(/[\/\.]/g, '-').replace(/(\-)+/, '-');
}

async function resolveImportmap(dir: string, importmap: Importmap) {
  const dependencies: Array<SharedDependency> = [];
  const sharedImports = importmap?.imports;

  if (typeof sharedImports === 'object' && sharedImports) {
    for (const depName of Object.keys(sharedImports)) {
      const url = sharedImports[depName];
      const assetName = normalizeDepName(depName);

      if (typeof url !== 'string') {
      } else if (/^https?:\/\//.test(url)) {
        const hash = computeHash(url).substring(0, 7);

        dependencies.push({
          id: `${depName}@${hash}`,
          entry: url,
          name: depName,
          ref: url,
          type: 'remote',
        });
      } else if (url === depName) {
        const entry = tryResolve(dir, depName);

        if (entry) {
          const packageJson = await findFile(dirname(entry), 'package.json');
          const details = require(packageJson);

          dependencies.push({
            id: `${depName}@${details.version}`,
            entry,
            ref: `${assetName}.js`,
            name: depName,
            type: 'local',
          });
        }
      } else {
        const entry = resolve(dir, url);
        const exists = await checkExists(entry);

        if (exists) {
          const packageJson = await findFile(dirname(entry), 'package.json');

          if (packageJson) {
            const details = require(packageJson);

            dependencies.push({
              id: `${depName}@${details.version}`,
              entry,
              name: depName,
              ref: `${assetName}.js`,
              type: 'local',
            });
          } else {
            const hash = await getHash(entry);

            dependencies.push({
              id: `${depName}@${hash}`,
              entry,
              name: depName,
              ref: `${assetName}.js`,
              type: 'local',
            });
          }
        }
      }
    }
  }

  return dependencies;
}

export async function readImportmap(dir: string, packageDetails: any) {
  const importmap = packageDetails.importmap;

  if (typeof importmap === 'string') {
    const content = await readJson(dir, importmap);
    const baseDir = dirname(resolve(dir, importmap));
    return resolveImportmap(baseDir, content);
  }

  return resolveImportmap(dir, importmap);
}

export async function retrievePiletData(target: string, app?: string) {
  const packageJson = await findFile(target, 'package.json');

  if (!packageJson) {
    fail('packageJsonMissing_0075');
  }

  const root = dirname(packageJson);
  const piletPackage = require(packageJson);
  const appPackage = findPackage(
    app || (piletPackage.piral && piletPackage.piral.name) || Object.keys(piletPackage.devDependencies),
    target,
  );
  const appFile: string = appPackage && appPackage.app;

  if (!appFile) {
    fail('appInstanceInvalid_0011');
  }

  const emulator = checkAppShellPackage(appPackage);
  const importmap = await readImportmap(root, piletPackage);

  return {
    dependencies: piletPackage.dependencies || {},
    devDependencies: piletPackage.devDependencies || {},
    peerDependencies: piletPackage.peerDependencies || {},
    peerModules: piletPackage.peerModules || [],
    ignored: checkArrayOrUndefined(piletPackage, 'preservedDependencies'),
    importmap,
    appFile,
    piletPackage,
    appPackage,
    emulator,
    root,
  };
}
