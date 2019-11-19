import { resolve } from 'path';
import { createReadStream, existsSync } from 'fs';
import { MemoryStream } from './MemoryStream';
import { isWindows } from './info';
import { inspectPackage } from './inspect';
import { readJson } from './io';
import { runScript } from './scripts';

const npmCommand = isWindows ? 'npm.cmd' : 'npm';

function runNpmProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  const cwd = resolve(process.cwd(), target);
  const cmd = [npmCommand, ...args].join(' ');
  return runScript(cmd, cwd, output);
}

export function isLocalPackage(baseDir: string, fullName: string) {
  if (/^[\.\/\~]/.test(fullName)) {
    return true;
  } else if (fullName.endsWith('.tgz')) {
    return existsSync(resolve(baseDir, fullName));
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

export type PackageType = 'registry' | 'file' | 'git';

const gitPrefix = 'git+';
const filePrefix = 'file:';

/**
 * Looks at the provided package name and normalizes it
 * resulting in the following tuple:
 * [
 *   normalized / real package name,
 *   found package version / version identifier,
 *   indicator if an explicit version was used
 * ]
 * @param fullName The provided package name.
 */
export function dissectPackageName(baseDir: string, fullName: string): [string, string, boolean, PackageType] {
  const gitted = fullName.startsWith(gitPrefix);

  if (gitted || /^(https?|ssh):\/\/.*\.git$/.test(fullName)) {
    const gitUrl = gitted ? fullName : `${gitPrefix}${fullName}`;
    return [gitUrl, 'latest', false, 'git'];
  } else if (isLocalPackage(baseDir, fullName)) {
    const fullPath = resolve(baseDir, fullName);
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

export function combinePackageRef(name: string, version: string, type: PackageType) {
  if (type === 'registry') {
    return `${name}@${version}`;
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

export function getPackageVersion(hadVersion: boolean, sourceName: string, sourceVersion: string, type: PackageType) {
  switch (type) {
    case 'registry':
      return hadVersion && sourceVersion;
    case 'file':
      return `${filePrefix}${sourceName}`;
    case 'git':
      return `${sourceName}`;
  }
}
