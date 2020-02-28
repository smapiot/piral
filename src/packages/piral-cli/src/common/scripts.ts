import { exec } from 'child_process';
import { resolve } from 'path';
import { isWindows } from './info';
import { logInfo } from './log';

export function runScript(script: string, cwd = process.cwd(), output: NodeJS.WritableStream = process.stdout) {
  const bin = resolve('./node_modules/.bin');
  const sep = isWindows ? ';' : ':';
  const env = Object.assign({}, process.env);

  env.PATH = `${bin}${sep}${env.PATH}`;

  return new Promise<void>((resolve, reject) => {
    const opt = { end: false };
    const cp = exec(script, {
      cwd,
      env,
    });

    cp.stdout.pipe(output, opt);

    cp.stderr.on('data', chunk => {
      const content = Buffer.from(chunk).toString('utf8');
      logInfo(content);
    });

    cp.on('error', reject);
    cp.on('close', (code, signal) => (code === 0 ? resolve() : reject(new Error(signal))));
  });
}
