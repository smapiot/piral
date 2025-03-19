import { Agent } from 'https';
import { resolve, join, extname, basename, dirname, relative } from 'path';
import { log, fail } from './log';
import { cliVersion } from './info';
import { unpackTarball } from './archive';
import { ForceOverwrite } from './enums';
import { checkAppShellCompatibility } from './compatibility';
import { deepMerge } from './merge';
import { onlyUnique } from './utils';
import { readImportmap } from './importmap';
import { getHash, checkIsDirectory, matchFiles } from './io';
import { readJson, copy, updateExistingJson, findFile, checkExists } from './io';
import { isGitPackage, isLocalPackage, makeGitUrl, makeFilePath, tryResolvePackage, isNpmPackage } from './npm';
import { makePiletExternals, makeExternals, findPackageRoot, findSpecificVersion, makeNpmAlias } from './npm';
import { scaffoldFromEmulatorWebsite, updateFromEmulatorWebsite } from './website';
import { getDependencies, getDependencyPackages, getDevDependencies } from './language';
import { getDevDependencyPackages, getFrameworkDependencies } from './language';
import { piralJsonSchemaUrl, filesTar, filesOnceTar, bundlerNames, packageJson } from './constants';
import { frameworkLibs, declarationEntryExtensions, piralJson, piletJson } from './constants';
import { satisfies } from './version';
import { getModulePath } from '../external';
import { PiletsInfo, SharedDependency, PiletDefinition, AppDefinition, NpmClient } from '../types';
import { SourceLanguage, PiralInstancePackageData, PiralInstanceDetails } from '../types';
import { Framework, FileInfo, TemplateFileLocation, PiletPackageData, PiralPackageData } from '../types';

export interface PiralInstanceData {
  packageName: Framework;
  language: SourceLanguage;
  reactVersion: number;
  reactRouterVersion: number;
}

async function appendBundler(devDependencies: Record<string, string>, bundler: string, proposedVersion: string) {
  if (bundler && bundler !== 'none') {
    if (isValidDependency(bundler)) {
      const sep = bundler.indexOf('@', 1);
      const hasVersion = sep !== -1;
      const proposedName = bundler.substring(0, hasVersion ? sep : bundler.length);
      const givenVersion = hasVersion ? bundler.substring(sep + 1) : proposedVersion;
      const name = bundlerNames.includes(proposedName as any) ? `piral-cli-${bundler}` : proposedName;
      const versions = new Set([
        givenVersion,
        givenVersion.includes('-beta.') && 'next',
        givenVersion.includes('-alpha.') && 'canary',
        givenVersion.includes('.') && givenVersion.split('.').slice(0, 2).join('.'),
        'latest',
      ]);

      for (const version of versions) {
        if (version) {
          const isAvailable = await findSpecificVersion(name, version);

          // only if something was returned we know that the version exists; so we can take it.
          if (isAvailable) {
            devDependencies[name] = version;
            return;
          }
        }
      }

      log('generalWarning_0001', `Could not find a valid version for the provided bundler "${bundler}".'`);
    } else {
      //Error case - print warning and ignore
      log('generalWarning_0001', `The provided bundler name "${bundler}" does not refer to a valid package name.'`);
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
    return files.map((file) => ({
      sourcePath: file,
      targetPath: resolve(targetPath, relative(sourcePath, file)),
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

export function getPiralPath(root: string, name: string) {
  const path = findPackageRoot(name, root);

  if (!path) {
    fail('invalidPiralReference_0043');
  }

  return dirname(path);
}

async function loadPiralInstance(root: string, details?: PiralInstanceDetails): Promise<PiralInstancePackageData> {
  log('generalDebug_0003', `Following the app package in "${root}" ...`);
  const appPackage = await readJson(root, packageJson);
  const relPath = appPackage.app;
  appPackage.app = relPath && resolve(root, relPath);
  appPackage.root = root;
  appPackage.port = details?.port || 0;
  return appPackage;
}

export async function findPiralInstance(
  proposedApp: string,
  rootDir: string,
  details: PiralInstanceDetails,
  agent: Agent,
  interactive = false,
) {
  const path = findPackageRoot(proposedApp, rootDir);
  const url = details?.url;

  if (path) {
    const root = dirname(path);

    if (url) {
      log('generalDebug_0003', `Updating the emulator from remote "${url}" ...`);
      await updateFromEmulatorWebsite(root, url, agent, interactive);
    }

    return await loadPiralInstance(root, details);
  } else if (url) {
    log('generalDebug_0003', `Piral instance not installed yet - trying from remote "${url}" ...`);
    const emulator = await scaffoldFromEmulatorWebsite(rootDir, url, agent);
    return await loadPiralInstance(emulator.path, details);
  }

  fail('appInstanceNotFound_0010', proposedApp);
}

export async function findPiralInstances(
  proposedApps: Array<string>,
  piletPackage: PiletPackageData,
  piletDefinition: undefined | PiletDefinition,
  rootDir: string,
  agent: Agent,
  interactive?: boolean,
) {
  if (proposedApps) {
    // do nothing
  } else if (piletDefinition) {
    const availableApps = Object.keys(piletDefinition.piralInstances || {});
    proposedApps = availableApps.filter((m) => piletDefinition.piralInstances[m].selected);

    if (proposedApps.length === 0) {
      proposedApps = availableApps.slice(0, 1);
    }
  } else {
    proposedApps = [piletPackage.piral?.name].filter(Boolean);
  }

  if (proposedApps.length > 0) {
    return Promise.all(
      proposedApps.map((proposedApp) =>
        findPiralInstance(proposedApp, rootDir, piletDefinition?.piralInstances?.[proposedApp], agent, interactive),
      ),
    );
  }

  return [];
}

export function readPiralPackage(root: string, name: string): Promise<PiralPackageData> {
  log('generalDebug_0003', `Reading the piral package in "${root}" ...`);
  const path = getPiralPath(root, name);
  return readJson(path, packageJson);
}

export async function patchPiralPackage(
  root: string,
  app: string,
  data: PiralInstanceData,
  version: string,
  bundler?: string,
) {
  log('generalDebug_0003', `Patching the ${packageJson} in "${root}" ...`);
  const pkg = await getPiralPackage(app, data, version, bundler);

  await updateExistingJson(root, packageJson, pkg);
  log('generalDebug_0003', `Succesfully patched the ${packageJson}.`);

  await updateExistingJson(root, piralJson, {
    $schema: piralJsonSchemaUrl,
    isolation: 'modern',
    pilets: getPiletsInfo({}),
  });
  log('generalDebug_0003', `Succesfully patched the pilet.json.`);
}

export async function getPiralPackage(app: string, data: PiralInstanceData, version: string, bundler?: string) {
  const framework = data.packageName;
  const devDependencies = {
    ...getDevDependencies(
      data.language,
      getDevDependencyPackages(framework, data.reactVersion, data.reactRouterVersion),
    ),
    'piral-cli': `${version}`,
  };
  const dependencies = {
    ...getFrameworkDependencies(framework, version),
    ...getDependencies(data.language, getDependencyPackages(framework, data.reactVersion, data.reactRouterVersion)),
  };

  await appendBundler(devDependencies, bundler, version);

  return {
    app,
    scripts: {
      start: 'piral debug',
      build: 'piral build',
      postinstall: 'piral declaration',
    },
    types: 'dist/index.d.ts',
    importmap: {
      imports: {},
      inherit: [
        'piral-base', // this we take in any case
        framework !== 'piral-base' && 'piral-core', // this we take unless we selected piral-base, then obviously core is not invited to the party
        framework === 'piral' && 'piral', // this we take only if we selected piral
      ].filter(Boolean),
    },
    dependencies,
    devDependencies,
  };
}

async function getAvailableFiles(root: string, name: string, dirName: string): Promise<Array<FileDescriptor>> {
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
  }));
}

export async function getFileStats(root: string, name: string) {
  const files = await getAvailableFiles(root, name, filesTar);

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
    const { sourcePath, targetPath } = subfile;
    const exists = await checkExists(sourcePath);

    if (exists) {
      const overwrite = originalFiles.some((m) => m.path === targetPath && !m.changed);
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
  const packageTarget = resolve(root, packageJson);

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
    const { version } = require(`${packageName}/${packageJson}`);
    return version;
  } catch {
    return undefined;
  }
}

export async function copyPiralFiles(
  root: string,
  name: string,
  piralInfo: PiralPackageData,
  forceOverwrite: ForceOverwrite,
  variables: Record<string, string>,
  originalFiles?: Array<FileInfo>,
) {
  log('generalDebug_0003', `Copying the Piral files ...`);
  const files = await getAvailableFiles(root, name, filesTar);

  if (originalFiles === undefined) {
    const initialFiles = await getAvailableFiles(root, name, filesOnceTar);
    files.push(...initialFiles);
    originalFiles = [];
  }

  await extendPackageOverridesFromTemplateFragment(root, piralInfo, files);
  await copyFiles(files, forceOverwrite, originalFiles, variables);
}

export function getPiletsInfo(piralInfo: Partial<PiralPackageData>): PiletsInfo {
  const {
    files = [],
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
    const packageName = basename(rootDir) === packageJson ? rootDir : join(rootDir, packageJson);
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

export async function findDependencyVersion(
  pckg: Record<string, any>,
  rootPath: string,
  dependency: SharedDependency,
): Promise<string> {
  const { devDependencies = {}, dependencies = {} } = pckg;
  const packageName = dependency.name;
  const desiredVersion = dependencies[packageName] ?? devDependencies[packageName];
  const [parent] = dependency.parents || [];

  if (desiredVersion) {
    if (isNpmPackage(desiredVersion)) {
      return desiredVersion;
    } else if (isGitPackage(desiredVersion)) {
      return makeGitUrl(desiredVersion);
    } else if (isLocalPackage(rootPath, desiredVersion)) {
      return makeFilePath(rootPath, desiredVersion);
    }
  }

  if (parent) {
    // in case the dependency came from another package (= parent)
    // we should start the lookup in its directory (pnpm issue)
    const parentPath = tryResolvePackage(parent, rootPath);

    if (parentPath) {
      rootPath = dirname(parentPath);
    }
  }

  const version = await findPackageVersion(rootPath, packageName);

  if (dependency.alias) {
    return makeNpmAlias(dependency.alias, version);
  }

  return version;
}

export async function findPackageVersion(rootPath: string, packageName: string | Array<string>): Promise<string> {
  const packages = Array.isArray(packageName) ? packageName : [packageName];

  for (const pckg of packages) {
    try {
      log('generalDebug_0003', `Finding the version of "${packageName}" in "${rootPath}".`);
      const moduleName = getModulePath(rootPath, pckg);
      const packageJsonPath = await findFile(moduleName, packageJson);
      const root = dirname(packageJsonPath);
      const { version } = await readJson(root, packageJson);
      return version;
    } catch {}
  }

  log('cannotResolveDependency_0053', packages, rootPath);
  return 'latest';
}

export function flattenExternals(dependencies: Array<SharedDependency>, disableAsync = false) {
  const getName = (dep: SharedDependency) => `${dep.name}${dep.isAsync && !disableAsync ? '?' : ''}`;
  return dependencies.map(getName).filter(onlyUnique);
}

export async function retrieveExternals(root: string, packageInfo: any): Promise<Array<SharedDependency>> {
  const importmap = await readImportmap(root, packageInfo, 'exact', 'host');

  if (importmap.length === 0) {
    const allDeps = {
      ...packageInfo.devDependencies,
      ...packageInfo.dependencies,
    };
    const deps = packageInfo.pilets?.externals;
    const externals = await makeExternals(root, allDeps, deps);
    return externals.map((ext) => ({
      id: ext,
      name: ext,
      entry: ext,
      type: 'local',
      ref: undefined,
      requireId: ext,
    }));
  }

  return importmap;
}

export async function retrievePiletsInfo(entryFile: string) {
  const exists = await checkExists(entryFile);

  if (!exists) {
    fail('entryPointDoesNotExist_0073', entryFile);
  }

  const packageJsonPath = await findFile(entryFile, packageJson);

  if (!packageJsonPath) {
    fail('packageJsonMissing_0074');
  }

  const root = dirname(packageJsonPath);
  const packageInfo = await readJson(root, packageJson);
  const piralJsonPkg = await readJson(root, piralJson);
  const pilets: PiletsInfo = {
    ...getPiletsInfo(packageInfo),
    ...piralJsonPkg.pilets,
  };
  const externals = await retrieveExternals(root, packageInfo);
  const dependencies = {
    std: packageInfo.dependencies || {},
    dev: packageInfo.devDependencies || {},
    peer: packageInfo.peerDependencies || {},
  };
  const framework = frameworkLibs.find((lib) => lib in dependencies.std || lib in dependencies.dev);

  return {
    ...pilets,
    externals,
    name: packageInfo.name,
    version: packageInfo.version,
    emulator: piralJsonPkg.emulator,
    shared: piralJsonPkg.shared,
    framework,
    dependencies,
    scripts: packageInfo.scripts,
    ignored: checkArrayOrUndefined(packageInfo, 'preservedDependencies'),
    root,
  };
}

// This is an ugly workaround for having *some* packages that
// are not only suitable as shared dependencies, but actually encouraged
const toleratedDependencies = ['piral-ng-common'];

export function validateSharedDependencies(externals: Array<SharedDependency>) {
  // See #591 - we should warn in case somebody shared piral packages
  for (const external of externals) {
    const name = external.name;

    if (
      external.type === 'local' &&
      name.startsWith('piral-') &&
      name.indexOf('/') === -1 &&
      !toleratedDependencies.includes(name)
    ) {
      log('invalidSharedDependency_0029', name);
    }
  }
}

export function isValidDependency(name: string) {
  // super simple check at the moment
  // just to filter out things like "redux-saga/effects" and "@scope/redux-saga/effects"
  return name.indexOf('/') === -1 || (name.indexOf('@') === 0 && name.split('/').length < 3);
}

export async function patchPiletPackage(
  root: string,
  piralInfo: PiralPackageData,
  fromEmulator: boolean,
  client: NpmClient,
  newInfo?: { language: SourceLanguage; bundler: string },
) {
  log('generalDebug_0003', `Patching the ${packageJson} in "${root}" ...`);
  const pkg = await getPiletPackage(root, piralInfo, fromEmulator, client, newInfo);
  await updateExistingJson(root, packageJson, pkg);
  log('generalDebug_0003', `Succesfully patched the ${packageJson}.`);
}

function isWebsiteCompatible(version: string) {
  return satisfies(version, '>=1.4.0');
}

async function getExistingDependencies(client: NpmClient): Promise<Array<string>> {
  if (client.monorepo) {
    const existingData = await readJson(client.monorepo, packageJson);
    return [
      ...Object.keys(existingData.devDependencies || {}),
      ...Object.keys(existingData.dependencies || {}),
    ];
  }

  return [];
}

async function getPiletPackage(
  root: string,
  piralInfo: PiralPackageData,
  fromEmulator: boolean,
  client: NpmClient,
  newInfo?: { language: SourceLanguage; bundler: string },
) {
  const { piralCLI = { version: cliVersion } } = piralInfo;
  const { packageOverrides, ...info } = getPiletsInfo(piralInfo);
  const existingData = newInfo ? {} : await readJson(root, packageJson);
  const existingDependencies = await getExistingDependencies(client)
  const piralDependencies = {
    ...piralInfo.devDependencies,
    ...piralInfo.dependencies,
  };
  const toolVersion = piralCLI.version;
  const typeDependencies = newInfo ? getDevDependencies(newInfo.language) : {};
  const scripts = newInfo
    ? {
        start: 'pilet debug',
        build: 'pilet build',
        upgrade: 'pilet upgrade',
        postinstall: isWebsiteCompatible(toolVersion) ? 'pilet declaration' : undefined,
        ...info.scripts,
      }
    : info.scripts;
  const allExternals = await makePiletExternals(root, piralDependencies, fromEmulator, piralInfo);
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
      const existingDeps = existingData.devDependencies;
      const shouldSpecify = newInfo || (existingDeps && name in existingDeps);

      if (shouldSpecify) {
        deps[name] = piralDependencies[name] || tryFindPackageVersion(name) || 'latest';
      }

      return deps;
    }, {}),
    ['piral-cli']: toolVersion,
  };
  const dependencies: Record<string, string> = {
    ['piral-cli']: undefined,
  };

  if (newInfo) {
    await appendBundler(devDependencies, newInfo.bundler, toolVersion);
  }

  for (const name of existingDependencies) {
    delete devDependencies[name];
    delete dependencies[name];
  }

  return deepMerge(packageOverrides, {
    importmap: {
      imports: {},
      inherit: [],
    },
    devDependencies,
    dependencies,
    scripts,
  });
}

/**
 * Returns true if its an emulator package, otherwise it has to be a "raw" app shell.
 */
export function checkAppShellPackage(appPackage: PiralPackageData) {
  const { piralCLI = { generated: false, version: cliVersion } } = appPackage;

  if (piralCLI.generated) {
    checkAppShellCompatibility(piralCLI.version);
    return true;
  }

  log('generalDebug_0003', `Missing "piralCLI" section. Assume raw app shell.`);
  return false;
}

export function combinePiletExternals(
  appShells: Array<string>,
  peerDependencies: Record<string, string>,
  peerModules: Array<string>,
  importmap: Array<SharedDependency>,
) {
  const externals = [...Object.keys(peerDependencies), ...peerModules, ...appShells];

  for (let i = importmap.length; i--; ) {
    const entry = importmap[i];

    // if the entry has no parents, i.e., it was explicitly mentioned in the importmap
    // then keep it in the importmap (=> prefer the distributed approach, which will always work)
    if (Array.isArray(entry.parents)) {
      // only accept entry as a centrally shared dependency if the entry appears in all
      // mentioned / referenced app shells
      // in other cases (e.g., if one app shell does not share this) use the distributed
      // mechanism to ensure that the dependency can also be resolved in this shell
      if (appShells.every((app) => entry.parents.includes(app))) {
        externals.push(entry.name);
        importmap.splice(i, 1);
      }
    }
  }

  return externals;
}

export async function findPiletRoot(proposedRoot: string) {
  const packageJsonPath = await findFile(proposedRoot, packageJson);

  if (!packageJsonPath) {
    fail('packageJsonMissing_0075');
  }

  return dirname(packageJsonPath);
}

export async function retrievePiletData(target: string, app?: string, agent?: Agent, interactive?: boolean) {
  const piletJsonPath = await findFile(target, piletJson);
  const proposedRoot = piletJsonPath ? dirname(piletJsonPath) : target;
  const root = await findPiletRoot(proposedRoot);
  const piletPackage = await readJson(root, packageJson);
  const piletDefinition: PiletDefinition = piletJsonPath && (await readJson(proposedRoot, piletJson));
  const appPackages = await findPiralInstances(app && [app], piletPackage, piletDefinition, root, agent, interactive);
  const apps: Array<AppDefinition> = [];

  for (const appPackage of appPackages) {
    const appFile: string = appPackage?.app;
    const appRoot: string = appPackage?.root;
    const appPort = appPackage?.port;

    if (!appFile || !appRoot) {
      fail('appInstanceInvalid_0011');
    }

    const emulator = checkAppShellPackage(appPackage);
    apps.push({
      appPackage,
      appFile,
      appRoot,
      emulator,
      appPort,
    });
  }

  const importmap = await readImportmap(root, piletPackage, piletDefinition?.importmapVersions, 'remote');

  return {
    dependencies: piletPackage.dependencies || {},
    devDependencies: piletPackage.devDependencies || {},
    peerDependencies: piletPackage.peerDependencies || {},
    peerModules: piletPackage.peerModules || [],
    ignored: checkArrayOrUndefined(piletPackage, 'preservedDependencies'),
    schema: piletDefinition?.schemaVersion,
    importmap,
    apps,
    piletPackage,
    root,
  };
}
