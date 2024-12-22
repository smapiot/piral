import { resolve } from 'path';
import { log } from '../common/log';
import { findFile } from '../common/io';
import { runCommand } from '../common/scripts';
import { MemoryStream } from '../common/MemoryStream';

// Helpers:

function runBunProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  log('generalDebug_0003', 'Starting the Bun process ...');
  const cwd = resolve(process.cwd(), target);
  return runCommand('bun', args, cwd, output);
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
  await runBunProcess(['install', ...convert(flags)], target, ms);
  log('generalDebug_0003', `Bun install dependencies result: ${ms.value}`);
  return ms.value;
}

export async function uninstallPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runBunProcess(['remove', packageRef, ...convert(flags)], target, ms);
  log('generalDebug_0003', `Bun remove package result: ${ms.value}`);
  return ms.value;
}

export async function installPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runBunProcess(['add', packageRef, ...convert(flags)], target, ms);
  log('generalDebug_0003', `Bun add package result: ${ms.value}`);
  return ms.value;
}

export async function detectClient(root: string, stopDir = resolve(root, '/')) {
  return !!(await findFile(root, 'bun.lockb', stopDir));
}

export async function initProject(projectName: string, target: string) {}

export async function isProject(root: string, packageRef: string) {
  const details = await listProjects(root);

  if (typeof details === 'object') {
    // TODO this won't work right now
    return typeof details?.[packageRef]?.location === 'string';
  }

  return false;
}

// Functions to exclusively use from Bun client:

export async function listProjects(target: string) {
  const ms = new MemoryStream();

  try {
    await runBunProcess(['pm', 'ls', '--all'], target, ms);
  } catch (e) {
    log('generalDebug_0003', `Bun workspaces error: ${e}`);
    return {};
  }

  log('generalDebug_0003', `Bun workspaces result: ${ms.value}`);
  return ms.value
    .split('\n')
    .filter((m) => m.startsWith('├──'))
    .map((m) => m.replace('├── ', ''));
}
