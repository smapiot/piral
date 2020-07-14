import { join, dirname, basename, resolve } from 'path';
import { LogLevels, PiletSchemaVersion } from '../types';
import { callPiletBuild } from '../bundler';
import {
  removeDirectory,
  findEntryModule,
  retrievePiletData,
  defaultCacheDir,
  setLogLevel,
  progress,
  logDone,
  logInfo,
} from '../common';

export interface BuildPiletOptions {
  /**
   * Sets the name of the Piral instance.
   */
  app?: string;

  /**
   * The source index file (e.g. index.tsx) for collecting all the information
   * @example './src/index'
   */
  entry?: string;

  /**
   * The target file of bundling.
   * @example './dist/index.js'
   */
  target?: string;

  /**
   * The cache directory for bundling.
   */
  cacheDir?: string;

  /**
   * States if minifaction or other post-bundle transformations should be performed.
   */
  minify?: boolean;

  /**
   * States if a detailed report should be created.
   */
  detailedReport?: boolean;

  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * States if the target directory should be removed before building.
   */
  fresh?: boolean;

  /**
   * States if source maps should be created for the bundles.
   */
  sourceMaps?: boolean;

  /**
   * States if a content hash should be appended to the side-bundle files
   */
  contentHash?: boolean;

  /**
   * States if tree shaking should be used when creating the bundle.
   * (may reduce bundle size)
   */
  scopeHoist?: boolean;

  /**
   * States if the node modules should be included for target transpilation
   */
  optimizeModules?: boolean;

  /**
   * The schema to be used when bundling the pilets.
   * @example 'v1'
   */
  schemaVersion?: PiletSchemaVersion;
}

export const buildPiletDefaults: BuildPiletOptions = {
  entry: './src/index',
  target: './dist/index.js',
  cacheDir: defaultCacheDir,
  detailedReport: false,
  minify: true,
  logLevel: LogLevels.info,
  fresh: false,
  sourceMaps: true,
  contentHash: true,
  scopeHoist: false,
  optimizeModules: false,
  schemaVersion: 'v1',
};

export async function buildPilet(baseDir = process.cwd(), options: BuildPiletOptions = {}) {
  const {
    entry = buildPiletDefaults.entry,
    target = buildPiletDefaults.target,
    detailedReport = buildPiletDefaults.detailedReport,
    cacheDir = buildPiletDefaults.cacheDir,
    minify = buildPiletDefaults.minify,
    sourceMaps = buildPiletDefaults.sourceMaps,
    contentHash = buildPiletDefaults.contentHash,
    scopeHoist = buildPiletDefaults.scopeHoist,
    logLevel = buildPiletDefaults.logLevel,
    fresh = buildPiletDefaults.fresh,
    optimizeModules = buildPiletDefaults.optimizeModules,
    schemaVersion = buildPiletDefaults.schemaVersion,
    app,
  } = options;
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  const entryFile = join(baseDir, entry);
  const targetDir = dirname(entryFile);
  const entryModule = await findEntryModule(entryFile, targetDir);
  const { peerDependencies, root, appPackage, ignored } = await retrievePiletData(targetDir, app);
  const externals = Object.keys(peerDependencies);
  const cache = resolve(root, cacheDir);
  const outDir = dirname(resolve(baseDir, target));

  if (fresh) {
    progress('Removing output directory ...');
    await removeDirectory(outDir);
  }

  await removeDirectory(cache);

  logInfo('Bundle pilet ...');

  await callPiletBuild({
    root,
    piral: appPackage.name,
    optimizeModules,
    scopeHoist,
    sourceMaps,
    contentHash,
    detailedReport,
    minify,
    cacheDir: cache,
    externals,
    targetDir,
    outFile: basename(target),
    outDir,
    entryModule,
    logLevel,
    version: schemaVersion,
    ignored,
  });

  logDone('Pilet built successfully!');
}
