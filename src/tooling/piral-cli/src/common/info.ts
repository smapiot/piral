import { cpus } from 'os';

const info = require('../../package.json');

export function findCompatVersion(version: string) {
  // we only care about major and minor
  const [major, minor] = version.split('.');

  if (major === '0') {
    // we keep the leading zero to avoid confusing, e.g., 0.2 with 2.0
    return `${major}.${minor}`;
  }

  return major;
}

export const nodeVersion = process.version.substring(1);
export const cliName = info.name;
export const cliVersion = info.version;
export const compatVersion = findCompatVersion(cliVersion);
export const repositoryUrl = info.repository.url;
export const isWindows = process.platform === 'win32';
export const pathSeparator = isWindows ? ';' : ':';
export const cpuCount = cpus().length;
