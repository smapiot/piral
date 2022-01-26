import { exec } from 'child_process';
import { resolve } from 'path';
import { log } from './log';
import { isWindows } from './info';
import { MemoryStream } from './MemoryStream';

function resolveWinPath(specialFolder: string, subPath: string): string | undefined {
  const basePath = process.env[specialFolder];

  if (basePath) {
    return resolve(basePath, subPath);
  }

  return undefined;
}

export function runScript(script: string, cwd = process.cwd(), output: NodeJS.WritableStream = process.stdout) {
  const bin = resolve(cwd, './node_modules/.bin');
  const sep = isWindows ? ';' : ':';
  const env = Object.assign({}, process.env);

  log('generalDebug_0003', `Running "${script}" in "${cwd}" ("${bin}").`);

  if (isWindows) {
    // on windows we sometimes may see a strange behavior,
    // see https://github.com/smapiot/piral/issues/192
    const newPaths = [
      resolveWinPath('AppData', 'npm'),
      resolveWinPath('ProgramFiles', 'nodejs'),
      resolveWinPath('ProgramFiles(x86)', 'nodejs'),
      ...(env.Path || env.PATH || '').split(';'),
    ];
    env.PATH = newPaths.filter((path) => path && path.length > 0).join(sep);
  }

  env.PATH = `${bin}${sep}${env.PATH}`;

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
    cp.on('close', (code) => (code === 0 ? resolve() : reject(new Error(error.value))));
  });
}

export function runCommand(exe: string, args: Array<string>, cwd: string, output?: NodeJS.WritableStream) {
  const npmCommand = isWindows ? `${exe}.cmd` : exe;
  const sanitizedArgs = sanitizeCmdArgs(args);
  const cmd = [npmCommand, ...sanitizedArgs].join(' ');
  log('generalDebug_0003', `Applying cmd "${cmd}" in directory "${cwd}".`);
  return runScript(cmd, cwd, output);
}

function sanitizeCmdArgs(args: Array<string>) {
  // Introduced for fixing https://github.com/smapiot/piral/issues/259.
  // If an arg contains a whitespace, it can be incorrectly interpreted as two separate arguments.
  // For the moment, it's fixed by simply wrapping each arg in OS specific quotation marks.
  const quote = isWindows ? '"' : "'";

  return args.map((arg) => {
    let result = arg.trim();

    if (/\s/.test(result)) {
      if (!result.startsWith(quote)) {
        result = `${quote}${result}`;
      }

      if (!result.endsWith(quote)) {
        result = `${result}${quote}`;
      }
    }

    return result;
  });
}
