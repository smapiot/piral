import { resolve, relative, dirname } from 'path';
import { createReadStream, existsSync } from 'fs';
import { log, fail } from './log';
import { config } from './config';
import { legacyCoreExternals, frameworkLibs, defaultRegistry, packageJson } from './constants';
import { inspectPackage } from './inspect';
import { readJson, checkExists } from './io';
import { clients, detectDirectClients, detectWrapperClients, isDirectClient, isWrapperClient } from '../npm-clients';
import { clientTypeKeys } from '../helpers';
import { getModulePath } from '../external';
import { PackageType, NpmClientType, NpmClient, NpmDirectClientType, NpmWapperClientType } from '../types';

const gitPrefix = 'git+';
const filePrefix = 'file:';
const npmPrefix = 'npm:';
const pathPrefixes = ['/', './', '../', '.\\', '..\\', '~/', '~\\', filePrefix];

function isProjectReference(name: string) {
  const target = resolve(name, packageJson);
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

    const pj = await readJson(root, packageJson);

    if (Array.isArray(pj?.workspaces)) {
      if (await checkExists(resolve(root, '.pnp.cjs'))) {
        return [root, 'pnp'];
      }

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

async function determineWrapperClient(root: string): Promise<NpmWapperClientType | undefined> {
  const searchedClients = await detectWrapperClients(root);
  const foundClients = searchedClients.filter((m) => m.result).map((m) => m.client);

  if (foundClients.length > 0) {
    const [client] = foundClients;

    if (foundClients.length > 1) {
      log(
        'generalWarning_0001',
        `Found multiple clients via their lock or config files: "${foundClients.join('", "')}".`,
      );
    }

    log('generalDebug_0003', `Found valid direct client via lock or config file: "${client}".`);
    return client;
  }

  const defaultClient = config.npmClient;

  if (isWrapperClient(defaultClient)) {
    log('generalDebug_0003', `Using the default client: "${defaultClient}".`);
    return defaultClient;
  }

  return undefined;
}

async function determineDirectClient(root: string): Promise<NpmDirectClientType> {
  const searchedClients = await detectDirectClients(root);
  const foundClients = searchedClients.filter((m) => m.result).map((m) => m.client);

  if (foundClients.length > 0) {
    const [client] = foundClients;

    if (foundClients.length > 1) {
      log(
        'generalWarning_0001',
        `Found multiple clients via their lock or config files: "${foundClients.join('", "')}".`,
      );
    }

    log('generalDebug_0003', `Found valid direct client via lock or config file: "${client}".`);
    return client;
  }

  const defaultClient = config.npmClient;

  if (isDirectClient(defaultClient)) {
    log('generalDebug_0003', `Using the default client: "${defaultClient}".`);
    return defaultClient;
  }

  log('generalDebug_0003', 'Using the fallback "npm" client.');
  return 'npm';
}

async function getMonorepo(root: string, client: NpmClientType): Promise<string> {
  const [path, retrieved] = await detectMonorepoRoot(root);

  if (path && retrieved === client) {
    return path;
  }

  return undefined;
}

/**
 * For details about how this works consult issue
 * https://github.com/smapiot/piral/issues/203
 * @param root The project's root directory.
 * @param selected The proposed ("selected") npm client.
 */
export async function determineNpmClient(root: string, selected?: NpmClientType): Promise<NpmClient> {
  if (!selected || !clientTypeKeys.includes(selected)) {
    log('generalDebug_0003', 'No npm client selected. Checking for lock or config files ...');
    const [direct, wrapper] = await Promise.all([determineDirectClient(root), determineWrapperClient(root)]);
    return {
      direct,
      wrapper,
      monorepo: await getMonorepo(root, wrapper || direct),
    };
  } else if (isDirectClient(selected)) {
    return {
      proposed: selected,
      direct: selected,
      monorepo: await getMonorepo(root, selected),
    };
  } else {
    return {
      proposed: selected,
      direct: await determineDirectClient(root),
      wrapper: selected,
      monorepo: await getMonorepo(root, selected),
    };
  }
}

export async function isMonorepoPackageRef(refName: string, client: NpmClient): Promise<boolean> {
  if (client.monorepo) {
    const clientName = client.wrapper || client.direct;
    const clientApi = clients[clientName];
    return await clientApi.isProject(client.monorepo, refName);
  }

  return false;
}

export function installNpmDependencies(client: NpmClient, target = '.'): Promise<string> {
  const { installDependencies } = clients[client.direct];
  return installDependencies(target);
}

export async function installNpmPackageFromOptionalRegistry(
  packageRef: string,
  target: string,
  registry: string,
): Promise<void> {
  const client = await determineNpmClient(target, 'npm');

  try {
    await installNpmPackage(client, packageRef, target, '--registry', registry);
  } catch (e) {
    if (registry === defaultRegistry) {
      throw e;
    }

    await installNpmPackage(client, packageRef, target, '--registry', defaultRegistry);
  }
}

export async function uninstallNpmPackage(
  client: NpmClient,
  packageRef: string,
  target = '.',
  ...flags: Array<string>
): Promise<string> {
  const name = client.direct;

  try {
    const { uninstallPackage } = clients[name];
    return await uninstallPackage(packageRef, target, ...flags);
  } catch (ex) {
    log(
      'generalError_0002',
      `Could not uninstall the package "${packageRef}" using ${name}. Make sure ${name} is correctly installed and accessible: ${ex}`,
    );
    throw ex;
  }
}

export async function installNpmPackage(
  client: NpmClient,
  packageRef: string,
  target = '.',
  ...flags: Array<string>
): Promise<string> {
  const name = client.direct;

  try {
    const { installPackage } = clients[name];
    return await installPackage(packageRef, target, ...flags);
  } catch (ex) {
    log(
      'generalError_0002',
      `Could not install the package "${packageRef}" using ${name}. Make sure ${name} is correctly installed and accessible: ${ex}`,
    );
    throw ex;
  }
}

export function initNpmProject(client: NpmClient, projectName: string, target: string) {
  const { initProject } = clients[client.wrapper || client.direct];
  return initProject(projectName, target);
}

export function publishNpmPackage(
  target = '.',
  file = '*.tgz',
  flags: Array<string> = [],
  interactive = false,
): Promise<string> {
  const { publishPackage, loginUser } = clients.npm;
  return publishPackage(target, file, ...flags).catch((err) => {
    if (!interactive) {
      throw err;
    }

    return loginUser().then(() => publishNpmPackage(target, file, flags, false));
  });
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

export function isNpmPackage(fullName: string) {
  log('generalDebug_0003', 'Checking if its an npm alias ...');

  if (fullName) {
    const npmed = fullName.startsWith(npmPrefix);

    if (npmed && fullName.substring(npmPrefix.length + 1).indexOf('@') !== -1) {
      log('generalDebug_0003', 'Found an npm package alias by name.');
      return true;
    }
  }

  return false;
}

export function makeNpmAlias(name: string, version: string) {
  return `${npmPrefix}${name}@${version}`;
}

export function isGitPackage(fullName: string) {
  log('generalDebug_0003', 'Checking if its a git package ...');

  if (fullName) {
    const gitted = fullName.startsWith(gitPrefix);

    if (gitted || /^(https?|ssh):\/\/.*\.git$/.test(fullName)) {
      log('generalDebug_0003', 'Found a git package by name.');
      return true;
    }
  }

  return false;
}

export function isRemotePackage(fullName: string) {
  log('generalDebug_0003', 'Checking if its a remote package ...');

  if (fullName && /^https?:\/\/.*/.test(fullName)) {
    log('generalDebug_0003', 'Found a remote package by name.');
    return true;
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
 * @param client The used npm client.
 */
export async function dissectPackageName(
  baseDir: string,
  fullName: string,
  client: NpmClient,
): Promise<[string, string, boolean, PackageType]> {
  if (isGitPackage(fullName)) {
    const gitUrl = makeGitUrl(fullName);
    return [gitUrl, 'latest', false, 'git'];
  } else if (isRemotePackage(fullName)) {
    return [fullName, 'latest', false, 'remote'];
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
  } else if (await isMonorepoPackageRef(fullName, client)) {
    return [fullName, '*', false, 'monorepo'];
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

function tryResolve(packageName: string, baseDir = process.cwd()) {
  try {
    return getModulePath(baseDir, packageName);
  } catch {
    return undefined;
  }
}

export function tryResolvePackage(name: string, baseDir: string = undefined) {
  const path = baseDir ? tryResolve(name, baseDir) : tryResolve(name);
  const root = baseDir || process.cwd();

  if (!path) {
    log('generalDebug_0003', `Could not resolve the package "${name}" in "${root}".`);
  } else {
    log('generalVerbose_0004', `Resolved the package "${name}" (from "${root}") to be "${path}".`);
  }

  return path;
}

export function findPackageRoot(pck: string, baseDir: string) {
  return tryResolvePackage(`${pck}/${packageJson}`, baseDir);
}

export function isLinkedPackage(name: string, type: PackageType, hadVersion: boolean, target: string) {
  if (type === 'monorepo') {
    return true;
  } else if (type === 'registry' && !hadVersion) {
    const root = findPackageRoot(name, target);
    return typeof root === 'string';
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

export async function getPackageName(root: string, name: string, type: PackageType): Promise<string> {
  switch (type) {
    case 'file':
      const originalPackageJson = await readJson(name, packageJson);

      if (!originalPackageJson.name) {
        const p = resolve(process.cwd(), name);

        try {
          const s = createReadStream(p);
          const i = await inspectPackage(s);
          return i.name;
        } catch (err) {
          log('generalError_0002', `Could not open package tarball at "${p}": "${err}`);
          return undefined;
        }
      }

      return originalPackageJson.name;
    case 'git':
      const pj = await readJson(root, packageJson);
      const dd = pj.devDependencies || {};
      return Object.keys(dd).filter((dep) => dd[dep] === name)[0];
    case 'monorepo':
    case 'registry':
      return name;
    case 'remote':
      throw new Error('Cannot get the package name for a remote package!');
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
    case 'monorepo':
      return sourceVersion;
    case 'registry':
      return hadVersion && sourceVersion;
    case 'file':
      return getFilePackageVersion(sourceName, root);
    case 'git':
      return getGitPackageVersion(sourceName);
  }
}

async function getExternalsFrom(root: string, packageName: string): Promise<Array<string> | undefined> {
  try {
    const target = getModulePath(root, `${packageName}/${packageJson}`);
    const dir = dirname(target);
    const { sharedDependencies } = await readJson(dir, packageJson);
    return sharedDependencies;
  } catch (err) {
    log('generalError_0002', `Could not get externals from "${packageName}": "${err}`);
    return undefined;
  }
}

async function getCoreExternals(root: string, dependencies: Record<string, string>): Promise<Array<string>> {
  for (const frameworkLib of frameworkLibs) {
    if (dependencies[frameworkLib]) {
      const deps = await getExternalsFrom(root, frameworkLib);

      if (deps) {
        return deps;
      }
    }
  }

  log('frameworkLibMissing_0078', frameworkLibs);
  return [];
}

export async function makePiletExternals(
  root: string,
  dependencies: Record<string, string>,
  fromEmulator: boolean,
  piralInfo: any,
): Promise<Array<string>> {
  if (fromEmulator) {
    const { sharedDependencies = legacyCoreExternals } = piralInfo;
    return sharedDependencies;
  } else {
    return await getCoreExternals(root, dependencies);
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

export async function makeExternals(root: string, dependencies: Record<string, string>, externals: Array<string>) {
  const coreExternals = await getCoreExternals(root, dependencies);
  return mergeExternals(externals, coreExternals);
}
