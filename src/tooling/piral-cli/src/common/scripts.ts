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

  if (isWindows) {
    // on windows we sometimes may see a strange behavior,
    // see https://github.com/smapiot/piral/issues/192
    env.PATH = ['%AppData%\\npm', '%ProgramFiles%\\nodejs', '%ProgramFiles(x86)%\\nodejs', env.PATH].join(sep);
  }

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
  // For the moment, it's fixed by simply wrapping each arg in "quotation marks".
  // To ensure that this doesn't conflict with user-provided quotation marks, *one* leading/trailing " ' char
  // is trimmed from each arg. Only one, because multiple are usually deliberate and removing them thus becomes
  // a destructive action (e.g. we wouldn't want to replace "'foo'" with "foo", because one pair of quotes disappears here).
  return args.map(arg => {
    const trimWhiteSpaceAndQuotMarks = /^\s*['"]?(.*?)['"]?\s*$/;
    const match = trimWhiteSpaceAndQuotMarks.exec(arg);
    const sanitizedArg = match[1];
    return `"${sanitizedArg}"`;
  });
}
