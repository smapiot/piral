import * as Bundler from 'parcel-bundler';
import { dirname, basename, extname } from 'path';
import {
  extendConfig,
  setStandardEnvs,
  retrievePiletsInfo,
  retrievePiralRoot,
  extendBundlerForPiral,
  modifyBundlerForPiral,
} from './common';

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
}

export const buildPiralDefaults = {
  entry: './',
  target: './dist',
  publicUrl: '/',
  detailedReport: false,
  logLevel: 3 as const,
};

export async function buildPiral(baseDir = process.cwd(), options: BuildPiralOptions = {}) {
  const {
    entry = buildPiralDefaults.entry,
    target = buildPiralDefaults.target,
    publicUrl = buildPiralDefaults.publicUrl,
    detailedReport = buildPiralDefaults.detailedReport,
    logLevel = buildPiralDefaults.logLevel,
  } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const targetDir = dirname(entryFiles);
  const { externals } = await retrievePiletsInfo(entryFiles);

  await setStandardEnvs({
    production: true,
    target: targetDir,
    dependencies: externals,
  });

  modifyBundlerForPiral(Bundler.prototype, targetDir);

  const bundler = new Bundler(
    entryFiles,
    extendConfig({
      ...getDestination(entryFiles, target),
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

  await bundler.bundle();
}
