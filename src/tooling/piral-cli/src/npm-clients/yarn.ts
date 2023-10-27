import { resolve } from 'path';
import { log } from '../common/log';
import { findFile } from '../common/io';
import { runCommand } from '../common/scripts';
import { MemoryStream } from '../common/MemoryStream';

// Helpers:

function runYarnProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  log('generalDebug_0003', 'Starting the Yarn Classic process ...');
  const cwd = resolve(process.cwd(), target);
  return runCommand('yarn', args, cwd, output);
}

function convert(flags: Array<string>) {
  return flags.map((flag) => {
    switch (flag) {
      case '--save-exact':
        return '--exact';
      case '--save-dev':
        return '--dev';
      case '--no-save':
        // unfortunately no (https://github.com/yarnpkg/yarn/issues/1743)
        return '';
      default:
        return flag;
    }
  });
}

// Client interface functions:

export async function installDependencies(target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runYarnProcess(['install', ...convert(flags)], target, ms);
  log('generalDebug_0003', `Yarn Classic install dependencies result: ${ms.value}`);
  return ms.value;
}

export async function uninstallPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runYarnProcess(['remove', packageRef, ...convert(flags)], target, ms);
  log('generalDebug_0003', `Yarn Classic remove package result: ${ms.value}`);
  return ms.value;
}

export async function installPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runYarnProcess(['add', packageRef, ...convert(flags)], target, ms);
  log('generalDebug_0003', `Yarn Classic add package result: ${ms.value}`);
  return ms.value;
}

export async function detectClient(root: string, stopDir = resolve(root, '/')) {
  return !!(await findFile(root, 'yarn.lock', stopDir));
}

export async function initProject(projectName: string, target: string) {}

export async function isProject(root: string, packageRef: string) {
  const details = await listProjects(root);

  if (typeof details === 'object') {
    return typeof details?.[packageRef]?.location === 'string';
  }

  return false;
}

// Functions to exclusively use from yarn client:

export async function listProjects(target: string) {
  const ms = new MemoryStream();

  try {
    await runYarnProcess(['workspaces', 'info'], target, ms);
  } catch (e) {
    log('generalDebug_0003', `yarn workspaces error: ${e}`);
    return {};
  }

  log('generalDebug_0003', `yarn workspaces result: ${ms.value}`);
  return JSON.parse(ms.value);
}
