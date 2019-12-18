const info = require('../../package.json');

export function findCompatVersion(version: string) {
  const [significant] = version.split('.').filter(m => m !== '0');
  return significant;
}

export const nodeVersion = process.version.substr(1);
export const cliVersion = info.version;
export const compatVersion = findCompatVersion(cliVersion);
export const isWindows = process.platform === 'win32';
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
