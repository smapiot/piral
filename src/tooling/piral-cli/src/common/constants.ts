export const defaultRegistry = 'https://registry.npmjs.org/';
export const filesTar = 'files';
export const filesOnceTar = 'files_once';
export const piralBaseRoot = 'piral-base/lib/types.js';
export const frameworkLibs = ['piral' as const, 'piral-core' as const, 'piral-base' as const];
export const entryModuleExtensions = ['.ts', '.tsx', '.js', '.jsx'];
export const bundlerNames = ['parcel' as const, 'webpack' as const, 'webpack5' as const, 'esbuild' as const];
export const declarationEntryExtensions = ['.html', '.pug', ...entryModuleExtensions];
export const legacyCoreExternals = [
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
