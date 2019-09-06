import { exec } from 'child_process';
import { resolve } from 'path';
import { isWindows } from './info';

export function runScript(script: string, cwd = process.cwd()) {
  const bin = resolve('./node_modules/.bin');
  const sep = isWindows ? ';' : ':';
  const env = Object.assign({}, process.env);

  env.PATH = `${bin}${sep}${env.PATH}`;

  return new Promise((resolve, reject) => {
    const opt = { end: false };
    const cp = exec(script, {
      cwd,
      env,
    });

    cp.stdout.pipe(
      process.stdout,
      opt,
    );

    cp.stdin.pipe(
      process.stdin,
      opt,
    );

    cp.stderr.pipe(
      process.stderr,
      opt,
    );

    cp.on('error', reject);
    cp.on('close', (code, signal) => (code === 0 ? resolve() : reject(new Error(signal))));
  });
}
