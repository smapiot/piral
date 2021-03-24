import { join, dirname, basename, resolve } from 'path';
import { LogLevels, PiletSchemaVersion } from '../types';
import { callPiletBuild } from '../bundler';
import {
  removeDirectory,
  findEntryModule,
  retrievePiletData,
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
   * States if minifaction or other post-bundle transformations should be performed.
   */
  minify?: boolean;

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
   * Sets the bundler to use for building, if any specific.
   */
  bundlerName?: string;

  /**
   * States if a content hash should be appended to the side-bundle files
   */
  contentHash?: boolean;

  /**
   * States if the node modules should be included for target transpilation
   */
  optimizeModules?: boolean;

  /**
   * The schema to be used when bundling the pilets.
   * @example 'v1'
   */
  schemaVersion?: PiletSchemaVersion;

  /**
   * Additional arguments for a specific bundler.
   */
  _?: Record<string, any>;
}

export const buildPiletDefaults: BuildPiletOptions = {
  entry: './src/index',
  target: './dist/index.js',
  minify: true,
  logLevel: LogLevels.info,
  fresh: false,
  sourceMaps: true,
  contentHash: true,
  optimizeModules: false,
  schemaVersion: 'v1',
};

export async function buildPilet(baseDir = process.cwd(), options: BuildPiletOptions = {}) {
  const {
    entry = buildPiletDefaults.entry,
    target = buildPiletDefaults.target,
    minify = buildPiletDefaults.minify,
    sourceMaps = buildPiletDefaults.sourceMaps,
    contentHash = buildPiletDefaults.contentHash,
    logLevel = buildPiletDefaults.logLevel,
    fresh = buildPiletDefaults.fresh,
    optimizeModules = buildPiletDefaults.optimizeModules,
    schemaVersion = buildPiletDefaults.schemaVersion,
    _ = {},
    bundlerName,
    app,
  } = options;
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  const entryFile = join(baseDir, entry);
  const targetDir = dirname(entryFile);
  const entryModule = await findEntryModule(entryFile, targetDir);
  const { peerDependencies, peerModules, root, appPackage, ignored } = await retrievePiletData(targetDir, app);
  const externals = [...Object.keys(peerDependencies), ...peerModules];
  const outDir = dirname(resolve(baseDir, target));

  if (fresh) {
    progress('Removing output directory ...');
    await removeDirectory(outDir);
  }

  logInfo('Bundle pilet ...');

  await callPiletBuild(
    {
      root,
      piral: appPackage.name,
      optimizeModules,
      sourceMaps,
      contentHash,
      minify,
      externals,
      targetDir,
      outFile: basename(target),
      outDir,
      entryModule,
      logLevel,
      version: schemaVersion,
      ignored,
      _,
    },
    bundlerName,
  );

  logDone('Pilet built successfully!');
}
