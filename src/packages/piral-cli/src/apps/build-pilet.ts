import * as Bundler from 'parcel-bundler';
import { join, dirname, basename, resolve } from 'path';
import {
  extendConfig,
  setStandardEnvs,
  findFile,
  modifyBundlerForPilet,
  extendBundlerForPilet,
  postProcess,
  getFileWithExtension,
  removeDirectory,
  extendBundlerWithPlugins,
  clearCache,
  postTransform,
} from '../common';

export interface BuildPiletOptions {
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
  } = options;
  const entryFiles = getFileWithExtension(join(baseDir, entry));
  const targetDir = dirname(entryFiles);
  const packageJson = await findFile(targetDir, 'package.json');

  if (!packageJson) {
    throw new Error(`Cannot find the "package.json". You need a valid package.json for your pilet.`);
  }

  const root = dirname(packageJson);
  const externals = Object.keys(require(packageJson).peerDependencies);

  await setStandardEnvs({
    production: true,
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

  modifyBundlerForPilet(Bundler.prototype, externals, targetDir);

  const bundler = new Bundler(
    entryFiles,
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

  if (minify) {
    await postTransform(bundle, root);
  }
}
