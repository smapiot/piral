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

export const nodeVersion = process.version.substr(1);
export const cliVersion = info.version;
export const compatVersion = findCompatVersion(cliVersion);
export const repositoryUrl = info.repository.url;
export const isWindows = process.platform === 'win32';
export const defaultCacheDir = '.cache';
export const pathSeparator = isWindows ? ';' : ':';
export const defaultRegistry = 'https://registry.npmjs.org/';
export const debugPiletApi = '/$pilet-api';
export const coreExternals = [
  '@dbeining/react-atom',
  '@libre/atom',
  'history',
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  'tslib',
  'path-to-regexp',
];
