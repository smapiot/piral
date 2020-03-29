import { join, dirname, basename, resolve } from 'path';
import { LogLevels } from '../types';
import {
  setStandardEnvs,
  postProcess,
  removeDirectory,
  findEntryModule,
  retrievePiletData,
  patchModules,
  setupBundler,
  defaultCacheDir,
  getPiletSchemaVersion,
  setLogLevel,
  progress,
  logDone,
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
  schemaVersion?: 'v0' | 'v1';
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
  const version = getPiletSchemaVersion(schemaVersion);

  const dest = {
    outDir: dirname(resolve(baseDir, target)),
    outFile: basename(target),
  };

  if (fresh) {
    progress('Removing output directory ...');
    await removeDirectory(dest.outDir);
  }

  await removeDirectory(cache);

  if (optimizeModules) {
    progress('Preparing modules ...');
    await patchModules(root, ignored);
  }

  setStandardEnvs({
    production: true,
    piral: appPackage.name,
    root,
  });

  const bundler = setupBundler({
    type: 'pilet',
    externals,
    targetDir,
    entryModule,
    config: {
      ...dest,
      cacheDir: cache,
      watch: false,
      sourceMaps,
      minify,
      scopeHoist,
      contentHash,
      publicUrl: './',
      detailedReport,
      logLevel,
    },
  });

  const bundle = await bundler.bundle();
  await postProcess(bundle, version);
  logDone('Pilet built successfully!');
}
