export const defaultRegistry = 'https://registry.npmjs.org/';
export const filesTar = 'files';
export const appName = 'piral';
export const packageJson = 'package.json';
export const piralJson = 'piral.json';
export const piletJson = 'pilet.json';
export const filesOnceTar = 'files_once';
export const piralBaseRoot = 'piral-base/package.json';
export const defaultSchemaVersion = 'v2';
export const allName = 'all';
export const releaseName = 'release';
export const emulatorJson = 'emulator.json';
export const emulatorName = 'emulator';
export const emulatorPackageName = 'package';
export const emulatorSourcesName = 'sources';
export const emulatorWebsiteName = 'website';
export const frameworkLibs = ['piral' as const, 'piral-core' as const, 'piral-base' as const];
export const piletJsonSchemaUrl = 'https://docs.piral.io/schemas/pilet-v0.json';
export const piralJsonSchemaUrl = 'https://docs.piral.io/schemas/piral-v0.json';
export const entryModuleExtensions = ['.ts', '.tsx', '.js', '.jsx'];
export const bundlerNames = [
  'bun' as const,
  'esbuild' as const,
  'parcel' as const,
  'parcel2' as const,
  'rollup' as const,
  'rspack' as const,
  'webpack' as const,
  'webpack5' as const,
  'vite' as const,
  'vite5' as const,
  'vite6' as const,
  'xbuild' as const,
  'netpack' as const,
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
