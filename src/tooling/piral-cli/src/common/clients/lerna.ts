import { resolve } from 'path';
import { log } from '../log';
import { findFile } from '../io';
import { runCommand } from '../scripts';
import { MemoryStream } from '../MemoryStream';

// Helpers:

function runLernaProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  log('generalDebug_0003', 'Starting the Lerna process ...');
  const cwd = resolve(process.cwd(), target);
  return runCommand('lerna', args, cwd, output);
}

function convert(flags: Array<string>) {
  return flags.map((flag) => {
    switch (flag) {
      case '--save-exact':
        return '--exact';
      case '--save-dev':
        return '--dev';
      case '--no-save':
        // unfortunately no
        return '';
      default:
        return flag;
    }
  });
}

// Client interface functions:

export async function installDependencies(target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runLernaProcess(['bootstrap', ...flags], target, ms);
  log('generalDebug_0003', `Lerna bootstrap result: ${ms.value}`);
  return ms.value;
}

export async function installPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runLernaProcess(['add', packageRef, ...convert(flags)], target, ms);
  log('generalDebug_0003', `Lerna install package result: ${ms.value}`);
  return ms.value;
}

export async function detectClient(root: string) {
  return !!(await findFile(root, 'lerna.json'));
}

export async function initProject(projectName: string, target: string) {}

export async function isProject(root: string, packageRef: string) {
  const projects = await listProjects(root);

  if (Array.isArray(projects)) {
    return projects?.some((p) => p.name === packageRef) ?? false;
  }

  return false;
}

// Functions to exclusively use from lerna client:

export async function listProjects(target: string) {
  const ms = new MemoryStream();

  try {
    await runLernaProcess(['list', '--json', '-p'], target, ms);
  } catch (e) {
    log('generalDebug_0003', `lerna list error: ${e}`);
    return [];
  }

  log('generalDebug_0003', `lerna list project result: ${ms.value}`);
  return JSON.parse(ms.value);
}
