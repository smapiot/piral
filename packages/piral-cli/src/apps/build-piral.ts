import * as Bundler from 'parcel-bundler';
import { join, dirname, basename } from 'path';
import { extendConfig, setStandardEnvs, checkExists } from './common';

export interface BuildPiralOptions {
  entry?: string;
  target?: string;
}

export const buildPiralDefaults = {
  entry: './src/index.html',
  target: './dist/index.html',
};

export async function buildPiral(baseDir = process.cwd(), options: BuildPiralOptions = {}) {
  const { entry = buildPiralDefaults.entry, target = buildPiralDefaults.target } = options;
  const entryFiles = join(baseDir, entry);
  const exists = await checkExists(entryFiles);

  if (!exists) {
    return console.error('The given entry pointing to "%s" does not exist.', entryFiles);
  }

  await setStandardEnvs({
    production: true,
    target: dirname(entry),
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
    }),
  );

  await bundler.bundle();
}
