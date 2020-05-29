import { exec } from 'child_process';
import { resolve } from 'path';
import { log } from './log';
import { isWindows } from './info';
import { MemoryStream } from './MemoryStream';

export function runScript(script: string, cwd = process.cwd(), output: NodeJS.WritableStream = process.stdout) {
  const bin = resolve('./node_modules/.bin');
  const sep = isWindows ? ';' : ':';
  const env = Object.assign({}, process.env);

  env.PATH = `${bin}${sep}${env.PATH}`;
  log('generalDebug_0003', `Running "${script}" in "${cwd}" ("${bin}").`);

  return new Promise<void>((resolve, reject) => {
    const error = new MemoryStream();
    const opt = { end: false };
    const cp = exec(script, {
      cwd,
      env,
    });

    cp.stdout.pipe(output, opt);
    cp.stderr.pipe(error, opt);

    cp.on('error', () => reject(new Error(error.value)));
    cp.on('close', code => (code === 0 ? resolve() : reject(new Error(error.value))));
  });
}

export function runCommand(npmCommand: string, args: Array<string>, cwd: string, output?: NodeJS.WritableStream) {
  const cmd = [npmCommand, ...args].join(' ');
  log('generalDebug_0003', `Applying cmd "${cmd}" in directory "${cwd}".`);
  return runScript(cmd, cwd, output);
}

export async function runShell(exe: string, args: Array<string>, cwd: string, output?: NodeJS.WritableStream) {
  const exeCmd = isWindows ? `${exe}.cmd` : exe;

  try {
    return await runCommand(exeCmd, args, cwd, output);
  } catch (ex) {
    // on windows we sometimes may see a strange behavior,
    // see https://github.com/smapiot/piral/issues/192
    if (isWindows) {
      log('generalDebug_0003', `Checking on Windows where to find "${exe}".`);
      const ms = new MemoryStream();
      await runScript(`where.exe ${exe}`, cwd, ms);
      const [path] = ms.value.split('\n').filter(m => m.endsWith('.cmd'));
      log('generalDebug_0003', `Found "${path}" for "${exe}".`);

      if (path) {
        log('generalDebug_0003', `Retrying with "${path}" in directory "${cwd}".`);
        return await runCommand(path, args, cwd, output);
      }
    }

    throw ex;
  }
}
