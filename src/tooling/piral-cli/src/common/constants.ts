export const defaultRegistry = 'https://registry.npmjs.org/';
export const filesTar = 'files';
export const packageJson = 'package.json';
export const filesOnceTar = 'files_once';
export const piralBaseRoot = 'piral-base/package.json';
export const frameworkLibs = ['piral-native' as const, 'piral' as const, 'piral-core' as const, 'piral-base' as const];
export const piletJsonSchemaUrl = 'https://docs.piral.io/schemas/pilet-v0.json';
export const piralJsonSchemaUrl = 'https://docs.piral.io/schemas/piral-v0.json';
export const entryModuleExtensions = ['.ts', '.tsx', '.js', '.jsx'];
export const bundlerNames = [
  'esbuild' as const,
  'parcel' as const,
  'parcel2' as const,
  'rollup' as const,
  'rspack' as const,
  'webpack' as const,
  'webpack5' as const,
  'vite' as const,
  'xbuild' as const,
];
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
