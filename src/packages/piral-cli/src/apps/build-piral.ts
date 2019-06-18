import * as Bundler from 'parcel-bundler';
import { dirname, basename, extname } from 'path';
import { extendConfig, setStandardEnvs, retrievePiletsInfo, retrievePiralRoot } from './common';

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
}

export const buildPiralDefaults = {
  entry: './',
  target: './dist',
  publicUrl: '/',
};

export async function buildPiral(baseDir = process.cwd(), options: BuildPiralOptions = {}) {
  const {
    entry = buildPiralDefaults.entry,
    target = buildPiralDefaults.target,
    publicUrl = buildPiralDefaults.publicUrl,
  } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { externals } = await retrievePiletsInfo(entryFiles);

  await setStandardEnvs({
    production: true,
    target: dirname(entryFiles),
    dependencies: externals,
  });

  const bundler = new Bundler(
    entryFiles,
    extendConfig({
      ...getDestination(entryFiles, target),
      watch: false,
      minify: true,
      scopeHoist: false,
      contentHash: true,
      publicUrl,
    }),
  );

  await bundler.bundle();
}
