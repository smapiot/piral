import * as Bundler from 'parcel-bundler';
import { join, dirname, basename } from 'path';
import { extendConfig, setStandardEnvs, checkExists, findFile, getPiletsInfo } from './common';

export interface BuildPiralOptions {
  entry?: string;
  target?: string;
  publicUrl?: string;
}

export const buildPiralDefaults = {
  entry: './src/index.html',
  target: './dist/index.html',
  publicUrl: '/',
};

export async function buildPiral(baseDir = process.cwd(), options: BuildPiralOptions = {}) {
  const {
    entry = buildPiralDefaults.entry,
    target = buildPiralDefaults.target,
    publicUrl = buildPiralDefaults.publicUrl,
  } = options;
  const entryFiles = join(baseDir, entry);
  const exists = await checkExists(entryFiles);

  if (!exists) {
    return console.error('The given entry pointing to "%s" does not exist.', entryFiles);
  }

  const packageJson = await findFile(entryFiles, 'package.json');

  if (!packageJson) {
    return console.error('Cannot find any package.json. You need a valid package.json for your Piral instance.');
  }

  const { externals } = getPiletsInfo(packageJson);

  await setStandardEnvs({
    production: true,
    target: dirname(entry),
    dependencies: externals,
  });

  const bundler = new Bundler(
    entryFiles,
    extendConfig({
      outDir: dirname(target),
      outFile: basename(target),
      watch: false,
      minify: true,
      scopeHoist: false,
      contentHash: true,
      publicUrl,
    }),
  );

  await bundler.bundle();
}
