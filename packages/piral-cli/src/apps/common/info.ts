const info = require('../../../package.json');

export const cliVersion = info.version;
export const isWindows = process.platform === 'win32';
export const defaultRegistry = 'https://registry.npmjs.org/';
