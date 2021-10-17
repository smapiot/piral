import { resolve } from 'path';
import { removeDirectory } from 'piral-cli/utils';
import type {
  DebugPiletBundlerDefinition,
  DebugPiralBundlerDefinition,
  BuildPiletBundlerDefinition,
  BuildPiralBundlerDefinition,
  WatchPiralBundlerDefinition,
} from 'piral-cli';
import { defaultCacheDir } from './parcel';

// interface BuildDependencyParameters {
//   externals: Array<string>;
//   importmap: Array<SharedDependency>;
//   targetDir: string;
//   entryModule: string;
//   logLevel: LogLevels;
//   version: PiletSchemaVersion;
// }

//TODO
// async function buildDependencies(args: BuildDependencyParameters, cacheDir: string) {
//   for (const dependency of args.importmap) {
//     if (dependency.type === 'local') {
//       await callStatic('build-dependency', {
//         ...args,
//         name: dependency.id,
//         optimizeModules: false,
//         outFile: dependency.ref,
//         entryModule: dependency.entry,
//         importmap: args.importmap.filter((m) => m !== dependency),
//         _: {},
//         cacheDir,
//       } as any);
//     }
//   }
// }

export const debugPiral: DebugPiralBundlerDefinition = {
  flags(argv) {
    return argv
      .boolean('fresh')
      .describe('fresh', 'Resets the cache before starting the debug mode.')
      .default('fresh', false)
      .string('cache-dir')
      .describe('cache-dir', 'Sets the cache directory for bundling.')
      .default('cache-dir', defaultCacheDir)
      .boolean('scope-hoist')
      .describe('scope-hoist', 'Tries to reduce bundle size by introducing tree shaking.')
      .default('scope-hoist', false)
      .boolean('autoinstall')
      .describe('autoinstall', 'Automatically installs missing Node.js packages.')
      .default('autoinstall', true);
  },
  path: resolve(__dirname, 'parcel', 'piral.js'),
  async prepare(args) {
    const { cacheDir = defaultCacheDir, scopeHoist = false, autoInstall = true, fresh = false } = args._;
    const cache = resolve(args.root, cacheDir);

    if (fresh) {
      await removeDirectory(cache);
    }

    return {
      ...args,
      _: {},
      cacheDir: cache,
      scopeHoist,
      autoInstall,
    };
  },
};

export const watchPiral: WatchPiralBundlerDefinition = {
  path: resolve(__dirname, 'parcel', 'piral.js'),
};

export const buildPiral: BuildPiralBundlerDefinition = {
  flags(argv) {
    return argv
      .string('cache-dir')
      .describe('cache-dir', 'Sets the cache directory for bundling.')
      .default('cache-dir', defaultCacheDir)
      .boolean('detailed-report')
      .describe('detailed-report', 'Sets if a detailed report should be created.')
      .default('detailed-report', false)
      .boolean('scope-hoist')
      .describe('scope-hoist', 'Tries to reduce bundle size by introducing tree shaking.')
      .default('scope-hoist', false);
  },
  path: resolve(__dirname, 'parcel', 'piral.js'),
  async prepare(args) {
    const { detailedReport = false, scopeHoist = false, cacheDir = defaultCacheDir } = args._;
    const cache = resolve(args.root, cacheDir);

    await removeDirectory(cache);

    return {
      ...args,
      _: {},
      cacheDir: cache,
      detailedReport,
      scopeHoist,
    };
  },
};

export const debugPilet: DebugPiletBundlerDefinition = {
  flags(argv) {
    return argv
      .string('cache-dir')
      .describe('cache-dir', 'Sets the cache directory for bundling.')
      .default('cache-dir', defaultCacheDir)
      .boolean('fresh')
      .describe('fresh', 'Resets the cache before starting the debug mode.')
      .default('fresh', false)
      .boolean('scope-hoist')
      .describe('scope-hoist', 'Tries to reduce bundle size by introducing tree shaking.')
      .default('scope-hoist', false)
      .boolean('autoinstall')
      .describe('autoinstall', 'Automatically installs missing Node.js packages.')
      .default('autoinstall', true);
  },
  path: resolve(__dirname, 'parcel', 'pilet.js'),
  async prepare(args) {
    const { cacheDir = defaultCacheDir, scopeHoist = false, autoInstall = true, fresh = false } = args._;
    const cache = resolve(args.root, cacheDir);

    if (fresh) {
      await removeDirectory(cache);
    }

    return {
      ...args,
      _: {},
      cacheDir: cache,
      scopeHoist,
      autoInstall,
    };
  },
};

export const buildPilet: BuildPiletBundlerDefinition = {
  flags(argv) {
    return argv
      .string('cache-dir')
      .describe('cache-dir', 'Sets the cache directory for bundling.')
      .default('cache-dir', defaultCacheDir)
      .boolean('detailed-report')
      .describe('detailed-report', 'Sets if a detailed report should be created.')
      .default('detailed-report', false)
      .boolean('scope-hoist')
      .describe('scope-hoist', 'Tries to reduce bundle size by introducing tree shaking.')
      .default('scope-hoist', false);
  },
  path: resolve(__dirname, 'parcel', 'pilet.js'),
  async prepare(args) {
    const { detailedReport = false, cacheDir = defaultCacheDir, scopeHoist = false } = args._;
    const cache = resolve(args.root, cacheDir);

    await removeDirectory(cache);

    return {
      ...args,
      _: {},
      cacheDir: cache,
      detailedReport,
      scopeHoist,
    };
  },
};
