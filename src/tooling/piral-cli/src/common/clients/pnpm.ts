import { resolve } from 'path';
import { log } from '../log';
import { runCommand } from '../scripts';
import { MemoryStream } from '../MemoryStream';

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
