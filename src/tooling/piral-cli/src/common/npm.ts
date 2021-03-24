import { resolve, relative } from 'path';
import { createReadStream, existsSync, access, constants } from 'fs';
import { log, fail } from './log';
import { config } from './config';
import { inspectPackage } from './inspect';
import { coreExternals } from './constants';
import { readJson, checkExists, findFile } from './io';
import { clientTypeKeys } from '../helpers';
import { PackageType, NpmClientType } from '../types';

const gitPrefix = 'git+';
const filePrefix = 'file:';

function isProjectReference(name: string) {
  const target = resolve(name, 'package.json');
  return checkExists(target);
}

export function detectPnpm(root: string) {
  return new Promise((res) => {
    access(resolve(root, 'pnpm-lock.yaml'), constants.F_OK, (noPnpmLock) => {
      res(!noPnpmLock);
    });
  });
}

export function detectNpm(root: string) {
  return new Promise((res) => {
    access(resolve(root, 'package-lock.json'), constants.F_OK, (noPackageLock) => {
      res(!noPackageLock);
    });
  });
}

export async function detectYarn(root: string) {
  return !!(await findFile(root, 'yarn.lock'));
}

export async function getLernaConfigPath(root: string) {
  log('generalDebug_0003', 'Trying to get the configuration file for Lerna ...');
  const file = await findFile(root, 'lerna.json');

  if (file) {
    log('generalDebug_0003', `Found Lerna config in "${file}".`);
    return file;
  }

  return undefined;
}

export async function getLernaNpmClient(root: string): Promise<NpmClientType> {
  const file = await getLernaConfigPath(root);

  if (file) {
    try {
      return require(file).npmClient;
    } catch (err) {
      log('generalError_0002', `Could not read lerna.json: ${err}.`);
    }
  }

  return undefined;
}

/**
 * For details about how this works consult issue
 * https://github.com/smapiot/piral/issues/203
 * @param root The project's root directory.
 */
export async function determineNpmClient(root: string, selected?: NpmClientType): Promise<NpmClientType> {
  if (!selected || !clientTypeKeys.includes(selected)) {
    log('generalDebug_0003', 'No NPM client selected. Checking for lock files ...');
    const [hasNpm, hasYarn, hasPnpm] = await Promise.all([detectNpm(root), detectYarn(root), detectPnpm(root)]);
    const found = +hasNpm + +hasYarn + +hasPnpm;
    log('generalDebug_0003', `Results of the lock file check: NPM = ${hasNpm}, Yarn = ${hasYarn}, Pnpm = ${hasPnpm}`);
    const defaultClient = config.npmClient;

    if (found !== 1) {
      const lernaClient = await getLernaNpmClient(root);

      if (clientTypeKeys.includes(lernaClient)) {
        log('generalDebug_0003', `Found valid NPM client via Lerna: ${lernaClient}.`);
        return lernaClient;
      }
    } else if (hasNpm) {
      log('generalDebug_0003', `Found valid NPM client via lockfile.`);
      return 'npm';
    } else if (hasYarn) {
      log('generalDebug_0003', `Found valid Yarn client via lockfile.`);
      return 'yarn';
    } else if (hasPnpm) {
      log('generalDebug_0003', `Found valid Pnpm client via lockfile.`);
      return 'pnpm';
    }

    if (clientTypeKeys.includes(defaultClient)) {
      log('generalDebug_0003', `Found valid Pnpm client the default client: "${defaultClient}".`);
      return defaultClient;
    }

    log('generalDebug_0003', 'Using the default NPM client.');
    return 'npm';
  }

  return selected;
}

export async function isMonorepoPackageRef(refName: string, root: string): Promise<boolean> {
  const c = require(`./clients/npm`);
  const details = await c.listPackage(refName, root);
  return details?.dependencies?.[refName]?.extraneous ?? false;
}

export type MonorepoKind = 'none' | 'lerna' | 'yarn';

export async function detectMonorepo(root: string): Promise<MonorepoKind> {
  const file = await getLernaConfigPath(root);

  if (file !== undefined) {
    return 'lerna';
  }

  const packageJson = await readJson(root, 'package.json');

  if (Array.isArray(packageJson?.workspaces)) {
    return 'yarn';
  }

  return 'none';
}

export function bootstrapMonorepo(target = '.') {
  const c = require(`./clients/lerna`);
  return c.bootstrap(target);
}

export function installDependencies(client: NpmClientType, target = '.'): Promise<string> {
  const c = require(`./clients/${client}`);
  return c.installDependencies(target);
}

export function installPackage(
  client: NpmClientType,
  packageRef: string,
  target = '.',
  ...flags: Array<string>
): Promise<string> {
  const c = require(`./clients/${client}`);
  return c.installPackage(packageRef, target, ...flags);
}

export function publishPackage(target = '.', file = '*.tgz', flags: Array<string> = []): Promise<string> {
  const c = require(`./clients/npm`);
  return c.publishPackage(target, file, ...flags);
}

export function createPackage(target = '.'): Promise<string> {
  const c = require(`./clients/npm`);
  return c.createPackage(target);
}

export function findTarball(packageRef: string) {
  const c = require(`./clients/npm`);
  return c.findTarball(packageRef);
}

export function findSpecificVersion(packageName: string, version: string): Promise<string> {
  const c = require(`./clients/npm`);
  return c.findSpecificVersion(packageName, version);
}

export function findLatestVersion(packageName: string) {
  return findSpecificVersion(packageName, 'latest');
}

export function isLocalPackage(baseDir: string, fullName: string) {
  log('generalDebug_0003', 'Checking if its a local package ...');

  if (fullName) {
    if (/^[\.\/\~]/.test(fullName)) {
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
  const prefixed = fullName.startsWith(filePrefix);
  const relPath = !prefixed ? fullName : fullName.replace(filePrefix, '');
  const absPath = resolve(basePath, relPath);
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
    const fullPath = resolve(baseDir, fullName);
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
      return [fullName.substr(0, index), fullName.substr(index + 1), true, type];
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
    return `${name}@${version || 'latest'}`;
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

export function makeExternals(externals?: Array<string>) {
  if (externals && Array.isArray(externals)) {
    const [include, exclude] = externals.reduce<[Array<string>, Array<string>]>(
      (prev, curr) => {
        if (typeof curr === 'string') {
          if (curr.startsWith('!')) {
            prev[1].push(curr.substr(1));
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
