import { resolve } from 'path';
import { log } from '../log';
import { findFile } from '../io';
import { runCommand } from '../scripts';
import { MemoryStream } from '../MemoryStream';

// Helpers:

function runPnpmProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  log('generalDebug_0003', 'Starting the Pnpm process ...');
  const cwd = resolve(process.cwd(), target);
  return runCommand('pnpm', args, cwd, output);
}

function convert(flags: Array<string>) {
  return flags.map((flag) => {
    switch (flag) {
      case '--no-save':
        // unfortunately no (https://github.com/pnpm/pnpm/issues/1237)
        return '';
      default:
        return flag;
    }
  });
}

// Client interface functions:

export async function installDependencies(target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runPnpmProcess(['install', ...convert(flags)], target, ms);
  log('generalDebug_0003', `Pnpm install dependencies result: ${ms.value}`);
  return ms.value;
}

export async function installPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runPnpmProcess(['add', packageRef, ...convert(flags)], target, ms);
  log('generalDebug_0003', `Pnpm install package result: ${ms.value}`);
  return ms.value;
}

export async function detectClient(root: string) {
  return !!(await findFile(root, 'pnpm-lock.yaml'));
}

export async function initProject(projectName: string, target: string) {}

export async function isProject(root: string, packageRef: string) {
  const projects = await listProjects(root);

  if (Array.isArray(projects)) {
    return projects?.some((p) => p.name === packageRef) ?? false;
  }

  return false;
}

// Functions to exclusively use from pnpm client:

export async function listProjects(target: string) {
  const ms = new MemoryStream();

  try {
    await runPnpmProcess(['list', '--json', '--recursive', '--depth', '0'], target, ms);
  } catch (e) {
    log('generalDebug_0003', `pnpm list error: ${e}`);
    return [];
  }

  log('generalDebug_0003', `pnpm list project result: ${ms.value}`);
  return JSON.parse(ms.value);
}
