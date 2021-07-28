export const defaultRegistry = 'https://registry.npmjs.org/';
export const filesTar = 'files';
export const filesOnceTar = 'files_once';
export const piralBaseRoot = 'piral-base/lib/types';
export const entryModuleExtensions = ['.ts', '.tsx', '.js', '.jsx'];
export const declarationEntryExtensions = ['.html', '.pug', ...entryModuleExtensions];
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
