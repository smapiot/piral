import { spawn } from 'child_process';
import { resolve } from 'path';
import { isWindows } from './info';

const npmCommand = isWindows ? 'npm.cmd' : 'npm';

function runNpmProcess(args: Array<string>, target: string) {
  const cwd = resolve(process.cwd(), target);
  return new Promise((resolve, reject) => {
    spawn(npmCommand, args, { cwd })
      .on('error', reject)
      .on('end', resolve);
  });
}

export function installPackage(name: string, version = 'latest', target = '.', ...flags: Array<string>) {
  return runNpmProcess([`${name}@${version}`, ...flags], target);
}

export function dissectPackageName(fullName: string): [string, string, boolean] {
  const index = fullName.indexOf('@', 1);

  if (index !== -1) {
    return [fullName.substr(0, index), fullName.substr(index + 1), true];
  }

  return [fullName, 'latest', false];
}
