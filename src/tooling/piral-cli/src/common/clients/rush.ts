import { resolve } from 'path';
import { log } from '../log';
import { findFile } from '../io';
import { runCommand } from '../scripts';
import { MemoryStream } from '../MemoryStream';

// Helpers:

function runRushProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  log('generalDebug_0003', 'Starting the Rush process ...');
  const cwd = resolve(process.cwd(), target);
  return runCommand('rush', args, cwd, output);
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
  await runRushProcess(['update', ...convert(flags)], target, ms);
  log('generalDebug_0003', `Rush install dependencies result: ${ms.value}`);
  return ms.value;
}

export async function installPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runRushProcess(['add', '--package', packageRef, ...convert(flags)], target, ms);
  log('generalDebug_0003', `Rush install package result: ${ms.value}`);
  return ms.value;
}

export async function detectClient(root: string) {
  return !!(await findFile(root, 'rush.json'));
}
