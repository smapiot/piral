import { resolve } from 'path';
import { log } from '../log';
import { runCommand } from '../scripts';
import { MemoryStream } from '../MemoryStream';

function runLernaProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  log('generalDebug_0003', 'Starting the Lerna process ...');
  const cwd = resolve(process.cwd(), target);
  return runCommand('lerna', args, cwd, output);
}

export async function bootstrap(target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runLernaProcess(['bootstrap', ...flags], target, ms);
  log('generalDebug_0003', `Lerna bootstrap result: ${ms.value}`);
  return ms.value;
}
