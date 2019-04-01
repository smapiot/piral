import * as Bundler from 'parcel-bundler';
import { join, dirname, basename } from 'path';
import { extendConfig, setStandardEnvs, findFile, modifyBundler, extendBundler, postProcess } from './common';

export interface BuildPiletOptions {
  entry?: string;
  target?: string;
}

export const buildPiletDefaults = {
  entry: './src/index',
  target: './dist/index.js',
};

export async function buildPilet(baseDir = process.cwd(), options: BuildPiletOptions = {}) {
  const { entry = buildPiletDefaults.entry, target = buildPiletDefaults.target } = options;
  const entryFiles = join(baseDir, entry);
  const targetDir = dirname(entry);
  const packageJson = findFile(targetDir, 'package.json');

  if (!packageJson) {
    return console.error('Cannot find any package.json. You need a valid package.json for your pilet.');
  }

  const externals = Object.keys(require(packageJson).peerDependencies);

  setStandardEnvs({
    production: true,
    target: targetDir,
  });

  modifyBundler(Bundler.prototype, externals);

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

  extendBundler(bundler);

  const bundle = await bundler.bundle();

  await postProcess(bundle);
}
