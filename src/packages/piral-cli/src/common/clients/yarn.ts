import { resolve } from 'path';
import { log } from '../log';
import { isWindows } from '../info';
import { runScript } from '../scripts';
import { MemoryStream } from '../MemoryStream';

const yarnCommand = isWindows ? 'yarn.cmd' : 'yarn';

function runYarnProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  log('generalDebug_0003', 'Starting the Yarn process ...');
  const cwd = resolve(process.cwd(), target);
  const cmd = [yarnCommand, ...args].join(' ');
  log('generalDebug_0003', `Applying Yarn cmd "${cmd}" in directory "${cwd}".`);
  return runScript(cmd, cwd, output);
}

function convert(flags: Array<string>) {
  return flags.map(flag => {
    switch (flag) {
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

export async function installDependencies(target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runYarnProcess(['install', ...convert(flags)], target, ms);
  log('generalDebug_0003', `Yarn install dependencies result: ${ms.value}`);
  return ms.value;
}

export async function installPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runYarnProcess(['add', packageRef, ...convert(flags)], target, ms);
  log('generalDebug_0003', `Yarn install package result: ${ms.value}`);
  return ms.value;
}
