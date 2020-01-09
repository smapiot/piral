import * as Bundler from 'parcel-bundler';
import { join, dirname, basename, resolve } from 'path';
import {
  extendConfig,
  setStandardEnvs,
  modifyBundlerForPilet,
  extendBundlerForPilet,
  postProcess,
  removeDirectory,
  extendBundlerWithPlugins,
  clearCache,
  findEntryModule,
  retrievePiletData,
  logInfo,
  patchModules,
} from '../common';

export interface BuildPiletOptions {
  app?: string;
  entry?: string;
  target?: string;
  cacheDir?: string;
  minify?: boolean;
  detailedReport?: boolean;
  logLevel?: 1 | 2 | 3;
  fresh?: boolean;
  sourceMaps?: boolean;
  contentHash?: boolean;
  scopeHoist?: boolean;
  optimizeModules?: boolean;
}

export const buildPiletDefaults = {
  entry: './src/index',
  target: './dist/index.js',
  cacheDir: '.cache',
  detailedReport: false,
  minify: true,
  logLevel: 3 as const,
  fresh: false,
  sourceMaps: true,
  contentHash: true,
  scopeHoist: false,
  optimizeModules: true,
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
    app,
  } = options;
  const entryFile = join(baseDir, entry);
  const targetDir = dirname(entryFile);
  const entryModule = await findEntryModule(entryFile, targetDir);
  const { peerDependencies, root, appPackage, ignored } = await retrievePiletData(targetDir, app);
  const externals = Object.keys(peerDependencies);

  await setStandardEnvs({
    production: true,
    piral: appPackage.name,
    target: targetDir,
  });

  const dest = {
    outDir: dirname(resolve(baseDir, target)),
    outFile: basename(target),
  };

  if (fresh) {
    await clearCache(root, cacheDir);
    await removeDirectory(dest.outDir);
  }

  if (optimizeModules) {
    logInfo('Preparing modules ...');
    await patchModules(root, ignored);
  }

  modifyBundlerForPilet(Bundler.prototype, externals, targetDir);

  const bundler = new Bundler(
    entryModule,
    extendConfig({
      ...dest,
      cacheDir,
      watch: false,
      sourceMaps,
      minify,
      scopeHoist,
      contentHash,
      publicUrl: './',
      detailedReport,
      logLevel,
    }),
  );

  extendBundlerForPilet(bundler);
  extendBundlerWithPlugins(bundler);

  const bundle = await bundler.bundle();

  await postProcess(bundle);
}
