import { resolve } from 'path';
import { removeDirectory } from 'piral-cli/utils';
import {
  DebugPiletBundlerDefinition,
  DebugPiralBundlerDefinition,
  BuildPiletBundlerDefinition,
  BuildPiralBundlerDefinition,
  WatchPiralBundlerDefinition,
} from 'piral-cli';
import { callDynamic, callStatic, defaultCacheDir } from './parcel';

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
      .default('scope-hoist', true)
      .boolean('autoinstall')
      .describe('autoinstall', 'Automatically installs missing Node.js packages.')
      .default('autoinstall', true);
  },
  async run(args) {
    const { cacheDir = defaultCacheDir, scopeHoist = false, autoInstall = true, fresh = false } = args._;
    const cache = resolve(args.root, cacheDir);

    if (fresh) {
      await removeDirectory(cache);
    }

    const bundler = await callDynamic('debug-piral', {
      ...args,
      _: {},
      cacheDir: cache,
      scopeHoist,
      autoInstall,
    });

    return bundler;
  },
};

export const watchPiral: WatchPiralBundlerDefinition = {
  async run(args) {
    const bundler = await callStatic('debug-mono-piral', args);
    return bundler;
  },
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
      .default('scope-hoist', true);
  },
  async run(args) {
    const { detailedReport = false, scopeHoist = false, cacheDir = defaultCacheDir } = args._;
    const cache = resolve(args.root, cacheDir);

    await removeDirectory(cache);

    const bundler = await callStatic('build-piral', {
      ...args,
      _: {},
      cacheDir: cache,
      detailedReport,
      scopeHoist,
    });

    return bundler.bundle;
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
      .default('scope-hoist', true)
      .boolean('autoinstall')
      .describe('autoinstall', 'Automatically installs missing Node.js packages.')
      .default('autoinstall', true);
  },
  async run(args) {
    const { cacheDir = defaultCacheDir, scopeHoist = false, autoInstall = true, fresh = false } = args._;
    const cache = resolve(args.root, cacheDir);

    if (fresh) {
      await removeDirectory(cache);
    }

    const bundler = await callDynamic('debug-pilet', {
      ...args,
      _: {},
      cacheDir: cache,
      scopeHoist,
      autoInstall,
    });

    return bundler;
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
      .default('scope-hoist', true);
  },
  async run(args) {
    const { detailedReport = false, cacheDir = defaultCacheDir, scopeHoist = false } = args._;
    const cache = resolve(args.root, cacheDir);

    await removeDirectory(cache);

    const bundler = await callStatic('build-pilet', {
      ...args,
      _: {},
      cacheDir: cache,
      detailedReport,
      scopeHoist,
    });

    return bundler.bundle;
  },
};
