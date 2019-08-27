import * as Bundler from 'parcel-bundler';
import { dirname, basename, extname } from 'path';
import {
  extendConfig,
  setStandardEnvs,
  retrievePiletsInfo,
  retrievePiralRoot,
  extendBundlerForPiral,
  modifyBundlerForPiral,
  removeDirectory,
  extendBundlerWithPlugins,
} from '../common';

function getDestination(entryFiles: string, target: string) {
  const isdir = extname(target) !== '.html';

  if (isdir) {
    return {
      outDir: target,
      outFile: basename(entryFiles),
    };
  } else {
    return {
      outDir: dirname(target),
      outFile: basename(target),
    };
  }
}

export interface BuildPiralOptions {
  entry?: string;
  target?: string;
  publicUrl?: string;
  detailedReport?: boolean;
  logLevel?: 1 | 2 | 3;
  fresh?: boolean;
}

export const buildPiralDefaults = {
  entry: './',
  target: './dist',
  publicUrl: '/',
  detailedReport: false,
  logLevel: 3 as const,
  fresh: false,
};

export async function buildPiral(baseDir = process.cwd(), options: BuildPiralOptions = {}) {
  const {
    entry = buildPiralDefaults.entry,
    target = buildPiralDefaults.target,
    publicUrl = buildPiralDefaults.publicUrl,
    detailedReport = buildPiralDefaults.detailedReport,
    logLevel = buildPiralDefaults.logLevel,
    fresh = buildPiralDefaults.fresh,
  } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const targetDir = dirname(entryFiles);
  const { externals } = await retrievePiletsInfo(entryFiles);

  await setStandardEnvs({
    production: true,
    target: targetDir,
    dependencies: externals,
  });

  const dest = getDestination(entryFiles, target);

  if (fresh) {
    await removeDirectory(dest.outDir);
  }

  modifyBundlerForPiral(Bundler.prototype, targetDir);

  const bundler = new Bundler(
    entryFiles,
    extendConfig({
      ...dest,
      watch: false,
      minify: true,
      scopeHoist: false,
      contentHash: true,
      detailedReport,
      publicUrl,
      logLevel,
    }),
  );

  extendBundlerForPiral(bundler);
  extendBundlerWithPlugins(bundler);

  await bundler.bundle();
}
