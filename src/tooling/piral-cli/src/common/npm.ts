import { resolve, relative, dirname } from 'path';
import { createReadStream, existsSync } from 'fs';
import { log, fail } from './log';
import { clients, detectClients, isWrapperClient } from './clients';
import { config } from './config';
import { legacyCoreExternals, frameworkLibs } from './constants';
import { inspectPackage } from './inspect';
import { readJson, checkExists } from './io';
import { clientTypeKeys } from '../helpers';
import { PackageType, NpmClientType } from '../types';

const gitPrefix = 'git+';
const filePrefix = 'file:';
const pathPrefixes = ['/', './', '../', '.\\', '..\\', '~/', '~\\', filePrefix];

function isProjectReference(name: string) {
  const target = resolve(name, 'package.json');
  return checkExists(target);
}

function resolveAbsPath(basePath: string, fullName: string) {
  const prefixed = fullName.startsWith(filePrefix);
  const relPath = !prefixed ? fullName : fullName.replace(filePrefix, '');
  return resolve(basePath, relPath);
}

async function detectMonorepoRoot(root: string): Promise<[] | [string, NpmClientType]> {
  let previous = root;

  do {
    if (await checkExists(resolve(root, 'lerna.json'))) {
      return [root, 'lerna'];
    }

    if (await checkExists(resolve(root, 'rush.json'))) {
      return [root, 'rush'];
    }

    if (await checkExists(resolve(root, 'pnpm-workspace.yaml'))) {
      return [root, 'pnpm'];
    }

    const packageJson = await readJson(root, 'package.json');

    if (Array.isArray(packageJson?.workspaces)) {
      if (await checkExists(resolve(root, 'yarn.lock'))) {
        return [root, 'yarn'];
      }

      return [root, 'npm'];
    }

    previous = root;
    root = dirname(root);
  } while (root !== previous);

  return [];
}

/**
 * For details about how this works consult issue
 * https://github.com/smapiot/piral/issues/203
 * @param root The project's root directory.
 */
export async function determineNpmClient(root: string, selected?: NpmClientType): Promise<NpmClientType> {
  if (!selected || !clientTypeKeys.includes(selected)) {
    log('generalDebug_0003', 'No npm client selected. Checking for lock or config files ...');

    const searchedClients = await detectClients(root);
    const foundClients = searchedClients.filter((m) => m.result);

    log(
      'generalDebug_0003',
      `Results of the lock file check: ${searchedClients.map((m) => `${m.client}=${m.result}`).join(', ')}`,
    );

    const defaultClient = config.npmClient;

    if (foundClients.length > 1) {
      const wrapperClient = foundClients.find((m) => isWrapperClient(m.client));

      if (wrapperClient) {
        const { client } = wrapperClient;
        log('generalDebug_0003', `Found valid wrapper client via lock or config file: "${client}".`);
      }
    }

    if (foundClients.length > 0) {
      const { client } = foundClients[0];

      if (foundClients.length > 1) {
        const clientStr = `"${foundClients.map((m) => m.client).join('", "')}"`;
        log('generalWarning_0001', `Found multiple clients via their lock or config files: ${clientStr}.`);
      }

      log('generalDebug_0003', `Found valid direct client via lock or config file: "${client}".`);
      return client;
    }

    if (clientTypeKeys.includes(defaultClient)) {
      log('generalDebug_0003', `Using the default client: "${defaultClient}".`);
      return defaultClient;
    }

    log('generalDebug_0003', 'Using the default "npm" client.');
    return 'npm';
  }

  return selected;
}

export async function isMonorepoPackageRef(refName: string, root: string): Promise<boolean> {
  const [monorepoRoot, client] = await detectMonorepoRoot(root);

  if (monorepoRoot) {
    const c = clients[client];
    return await c.isProject(monorepoRoot, refName);
  }

  return false;
}

export function installNpmDependencies(client: NpmClientType, target = '.'): Promise<string> {
  const { installDependencies } = clients[client];
  return installDependencies(target);
}

export async function installNpmPackage(
  client: NpmClientType,
  packageRef: string,
  target = '.',
  ...flags: Array<string>
): Promise<string> {
  try {
    const { installPackage } = clients[client];
    return await installPackage(packageRef, target, ...flags);
  } catch (ex) {
    log(
      'generalError_0002',
      `Could not install the package "${packageRef}" using ${client}. Make sure ${client} is correctly installed and accessible: ${ex}`,
    );
    throw ex;
  }
}

export function initNpmProject(client: NpmClientType, projectName: string, target: string) {
  const { initProject } = clients[client];
  return initProject(projectName, target);
}

export function publishNpmPackage(target = '.', file = '*.tgz', flags: Array<string> = []): Promise<string> {
  const { publishPackage } = clients.npm;
  return publishPackage(target, file, ...flags);
}

export function createNpmPackage(target = '.'): Promise<string> {
  const { createPackage } = clients.npm;
  return createPackage(target);
}

export function findNpmTarball(packageRef: string): Promise<string> {
  const { findTarball } = clients.npm;
  return findTarball(packageRef);
}

export function findSpecificVersion(packageName: string, version: string): Promise<string> {
  const { findSpecificVersion } = clients.npm;
  return findSpecificVersion(packageName, version);
}

export function findLatestVersion(packageName: string) {
  const { findSpecificVersion } = clients.npm;
  return findSpecificVersion(packageName, 'latest');
}

export function isLocalPackage(baseDir: string, fullName: string) {
  log('generalDebug_0003', 'Checking if its a local package ...');

  if (fullName) {
    if (pathPrefixes.some((prefix) => fullName.startsWith(prefix))) {
      log('generalDebug_0003', 'Found a local package by name.');
      return true;
    } else if (fullName.endsWith('.tgz')) {
      log('generalDebug_0003', ' Verifying if local path exists ...');

      if (existsSync(resolve(baseDir, fullName))) {
        log('generalDebug_0003', 'Found a potential local package by path.');
        return true;
      }
    }

    return fullName.startsWith(filePrefix);
  }

  return false;
}

export function isGitPackage(fullName: string) {
  log('generalDebug_0003', 'Checking if its a Git package ...');

  if (fullName) {
    const gitted = fullName.startsWith(gitPrefix);

    if (gitted || /^(https?|ssh):\/\/.*\.git$/.test(fullName)) {
      log('generalDebug_0003', 'Found a Git package by name.');
      return true;
    }
  }

  return false;
}

export function makeGitUrl(fullName: string) {
  const gitted = fullName.startsWith(gitPrefix);
  return gitted ? fullName : `${gitPrefix}${fullName}`;
}

export function makeFilePath(basePath: string, fullName: string) {
  const absPath = resolveAbsPath(basePath, fullName);
  return `${filePrefix}${absPath}`;
}

/**
 * Looks at the provided package name and normalizes it
 * resulting in the following tuple:
 * [
 *   normalized / real package name,
 *   found package version / version identifier,
 *   indicator if an explicit version was used,
 *   the used package type
 * ]
 * @param baseDir The base directory of the current operation.
 * @param fullName The provided package name.
 */
export async function dissectPackageName(
  baseDir: string,
  fullName: string,
): Promise<[string, string, boolean, PackageType]> {
  if (isGitPackage(fullName)) {
    const gitUrl = makeGitUrl(fullName);
    return [gitUrl, 'latest', false, 'git'];
  } else if (isLocalPackage(baseDir, fullName)) {
    const fullPath = resolveAbsPath(baseDir, fullName);
    const exists = await checkExists(fullPath);

    if (!exists) {
      fail('scaffoldPathDoesNotExist_0030', fullPath);
    }

    const isReference = await isProjectReference(fullPath);

    if (isReference) {
      fail('projectReferenceNotSupported_0032', fullPath);
    }

    return [fullPath, 'latest', false, 'file'];
  } else {
    const index = fullName.indexOf('@', 1);
    const type = 'registry';

    if (index !== -1) {
      return [fullName.substring(0, index), fullName.substring(index + 1), true, type];
    }

    return [fullName, 'latest', false, type];
  }
}

/**
 * Looks at the current package name / version and
 * normalizes it resulting in the following tuple:
 * [
 *   normalized / real package name,
 *   found package version / version identifier,
 * ]
 * @param baseDir The base directory of the current operation.
 * @param sourceName The used package name.
 * @param sourceVersion The used package version.
 * @param desired The desired package version.
 */
export async function getCurrentPackageDetails(
  baseDir: string,
  sourceName: string,
  sourceVersion: string,
  desired: string,
  root: string,
): Promise<[string, undefined | string]> {
  log('generalDebug_0003', `Checking package details in "${baseDir}" ...`);

  if (isLocalPackage(baseDir, desired)) {
    const fullPath = resolve(baseDir, desired);
    const exists = await checkExists(fullPath);

    if (!exists) {
      fail('upgradePathDoesNotExist_0031', fullPath);
    }

    const isReference = await isProjectReference(fullPath);

    if (isReference) {
      fail('projectReferenceNotSupported_0032', fullPath);
    }

    return [fullPath, getFilePackageVersion(fullPath, root)];
  } else if (isGitPackage(desired)) {
    const gitUrl = makeGitUrl(desired);
    return [gitUrl, getGitPackageVersion(gitUrl)];
  } else if (sourceVersion && sourceVersion.startsWith('file:')) {
    log('localeFileForUpgradeMissing_0050');
  } else if (sourceVersion && sourceVersion.startsWith('git+')) {
    if (desired === 'latest') {
      const gitUrl = desired;
      return [gitUrl, getGitPackageVersion(gitUrl)];
    } else {
      log('gitLatestForUpgradeMissing_0051');
    }
  }

  return [combinePackageRef(sourceName, desired, 'registry'), desired];
}

export function isLinkedPackage(name: string, type: PackageType, hadVersion: boolean) {
  if (type === 'registry' && !hadVersion) {
    try {
      require.resolve(`${name}/package.json`);
      return true;
    } catch {}
  }

  return false;
}

export function combinePackageRef(name: string, version: string, type: PackageType) {
  if (type === 'registry') {
    const tag = version || 'latest';
    return `${name}@${tag}`;
  }

  return name;
}

export async function getPackageName(root: string, name: string, type: PackageType) {
  switch (type) {
    case 'file':
      const originalPackageJson = await readJson(name, 'package.json');

      if (!originalPackageJson.name) {
        const p = resolve(process.cwd(), name);
        const s = createReadStream(p);
        const i = await inspectPackage(s);
        return i.name;
      }

      return originalPackageJson.name;
    case 'git':
      const pj = await readJson(root, 'package.json');
      const dd = pj.devDependencies || {};
      return Object.keys(dd).filter((dep) => dd[dep] === name)[0];
    case 'registry':
      return name;
  }
}

export function getFilePackageVersion(sourceName: string, root: string) {
  const path = relative(root, sourceName);
  return `${filePrefix}${path}`;
}

export function getGitPackageVersion(sourceName: string) {
  return `${sourceName}`;
}

export function getPackageVersion(
  hadVersion: boolean,
  sourceName: string,
  sourceVersion: string,
  type: PackageType,
  root: string,
) {
  switch (type) {
    case 'registry':
      return hadVersion && sourceVersion;
    case 'file':
      return getFilePackageVersion(sourceName, root);
    case 'git':
      return getGitPackageVersion(sourceName);
  }
}

function getExternalsFrom(root: string, packageName: string): Array<string> | undefined {
  try {
    const target = require.resolve(`${packageName}/package.json`, {
      paths: [root],
    });
    return require(target).sharedDependencies;
  } catch (err) {
    log('generalError_0002', `Could not get externals from "${packageName}": "${err}`);
    return undefined;
  }
}

function getCoreExternals(root: string, dependencies: Record<string, string>): Array<string> {
  for (const frameworkLib of frameworkLibs) {
    if (dependencies[frameworkLib]) {
      const deps = getExternalsFrom(root, frameworkLib);

      if (deps) {
        return deps;
      }
    }
  }

  log('frameworkLibMissing_0078', frameworkLibs);
  return [];
}

export function makePiletExternals(
  root: string,
  dependencies: Record<string, string>,
  externals: Array<string>,
  fromEmulator: boolean,
  piralInfo: any,
): Array<string> {
  if (fromEmulator) {
    const { sharedDependencies = mergeExternals(externals, legacyCoreExternals) } = piralInfo;
    return sharedDependencies;
  } else {
    return makeExternals(root, dependencies, externals);
  }
}

export function mergeExternals(customExternals?: Array<string>, coreExternals: Array<string> = []) {
  if (customExternals && Array.isArray(customExternals)) {
    const [include, exclude] = customExternals.reduce<[Array<string>, Array<string>]>(
      (prev, curr) => {
        if (typeof curr === 'string') {
          if (curr.startsWith('!')) {
            prev[1].push(curr.substring(1));
          } else {
            prev[0].push(curr);
          }
        }

        return prev;
      },
      [[], []],
    );
    const all = exclude.includes('*') ? include : [...include, ...coreExternals];
    return all.filter((m, i, arr) => !exclude.includes(m) && arr.indexOf(m) === i);
  }

  return coreExternals;
}

export function makeExternals(root: string, dependencies: Record<string, string>, externals?: Array<string>) {
  const coreExternals = getCoreExternals(root, dependencies);
  return mergeExternals(externals, coreExternals);
}
