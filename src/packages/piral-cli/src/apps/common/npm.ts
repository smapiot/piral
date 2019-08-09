import { exec } from 'child_process';
import { resolve } from 'path';
import { createReadStream } from 'fs';
import { isWindows } from './info';
import { inspectPackage } from './inspect';

const npmCommand = isWindows ? 'npm.cmd' : 'npm';

function runNpmProcess(args: Array<string>, target: string) {
  const cwd = resolve(process.cwd(), target);
  const cmd = [npmCommand, ...args].join(' ');
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd })
      .on('error', reject)
      .on('close', resolve);
  });
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

export type PackageType = 'registry' | 'file' | 'git';

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
export function dissectPackageName(fullName: string): [string, string, boolean, PackageType] {
  const localFile = fullName.startsWith('/') || fullName.startsWith('.');
  const type = localFile ? 'file' : 'registry';

  if (!localFile) {
    const index = fullName.indexOf('@', 1);

    if (index !== -1) {
      return [fullName.substr(0, index), fullName.substr(index + 1), true, type];
    }
  }

  return [fullName, 'latest', false, type];
}

export function combinePackageRef(name: string, version: string, type: PackageType) {
  switch (type) {
    case 'file':
    case 'git':
      return name;
    case 'registry':
      return `${name}@${version}`;
  }
}

export async function getPackageName(name: string, type: PackageType) {
  switch (type) {
    case 'file':
      const p = resolve(process.cwd(), name);
      const s = createReadStream(p);
      const i = await inspectPackage(s);
      return i.name;
    case 'git': //TODO
    case 'registry':
      return name;
  }
}

export function getPackageVersion(hadVersion: boolean, sourceName: string, sourceVersion: string, type: PackageType) {
  switch (type) {
    case 'registry':
      return hadVersion && sourceVersion;
    case 'file':
      return `file:${sourceName}`;
    case 'git':
      return `${sourceName}`;
  }
}
