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
  app?: string;
  entry?: string;
  target?: string;
  cacheDir?: string;
  minify?: boolean;
  detailedReport?: boolean;
  logLevel?: LogLevels;
  fresh?: boolean;
  sourceMaps?: boolean;
  contentHash?: boolean;
  scopeHoist?: boolean;
  optimizeModules?: boolean;
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
  optimizeModules: true,
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
