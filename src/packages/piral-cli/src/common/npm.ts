import { resolve } from 'path';
import { createReadStream, existsSync } from 'fs';
import { log, fail } from './log';
import { isWindows } from './info';
import { runScript } from './scripts';
import { inspectPackage } from './inspect';
import { readJson, checkExists } from './io';
import { MemoryStream } from './MemoryStream';
import { PackageType } from '../types';

const npmCommand = isWindows ? 'npm.cmd' : 'npm';

function runNpmProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  log('generalDebug_0003', 'Starting the NPM process ...');
  const cwd = resolve(process.cwd(), target);
  const cmd = [npmCommand, ...args].join(' ');
  log('generalDebug_0003', `Applying NPM cmd "${cmd}" in directory "${cwd}".`);
  return runScript(cmd, cwd, output);
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

export function installDependencies(target = '.', ...flags: Array<string>) {
  return runNpmProcess(['install', ...flags], target);
}

export function installPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  return runNpmProcess(['install', packageRef, ...flags], target);
}

export function createPackage(target = '.', ...flags: Array<string>) {
  return runNpmProcess(['pack', ...flags], target);
}

export async function findLatestVersion(packageName: string) {
  const ms = new MemoryStream();
  await runNpmProcess(['show', packageName, 'version'], '.', ms);
  return ms.value;
}

export function makeGitUrl(fullName: string) {
  const gitted = fullName.startsWith(gitPrefix);
  return gitted ? fullName : `${gitPrefix}${fullName}`;
}

const gitPrefix = 'git+';
const filePrefix = 'file:';

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
): Promise<[string, undefined | string]> {
  log('generalDebug_0003', `Checking package details in "${baseDir}" ...`);

  if (isLocalPackage(baseDir, desired)) {
    const fullPath = resolve(baseDir, desired);
    const exists = await checkExists(fullPath);

    if (!exists) {
      throw new Error(`Could not find "${fullPath}" for upgrading. Aborting.`);
    }

    return [fullPath, getFilePackageVersion(fullPath)];
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

export function combinePackageRef(name: string, version: string, type: PackageType) {
  if (type === 'registry') {
    return `${name}@${version || 'latest'}`;
  }

  return name;
}

export async function getPackageName(root: string, name: string, type: PackageType) {
  switch (type) {
    case 'file':
      const p = resolve(process.cwd(), name);
      const s = createReadStream(p);
      const i = await inspectPackage(s);
      return i.name;
    case 'git':
      const pj = await readJson(root, 'package.json');
      const dd = pj.devDependencies || {};
      return Object.keys(dd).filter(dep => dd[dep] === name)[0];
    case 'registry':
      return name;
  }
}

export function getFilePackageVersion(sourceName: string) {
  return `${filePrefix}${sourceName}`;
}

export function getGitPackageVersion(sourceName: string) {
  return `${sourceName}`;
}

export function getPackageVersion(hadVersion: boolean, sourceName: string, sourceVersion: string, type: PackageType) {
  switch (type) {
    case 'registry':
      return hadVersion && sourceVersion;
    case 'file':
      return getFilePackageVersion(sourceName);
    case 'git':
      return getGitPackageVersion(sourceName);
  }
}
