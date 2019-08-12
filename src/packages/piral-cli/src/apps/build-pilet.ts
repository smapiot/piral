import * as Bundler from 'parcel-bundler';
import { join, dirname, basename } from 'path';
import {
  extendConfig,
  setStandardEnvs,
  findFile,
  modifyBundlerForPilet,
  extendBundlerForPilet,
  postProcess,
  getFileWithExtension,
  logFail,
  removeDirectory,
  extendBundlerWithPlugins,
} from './common';

export interface BuildPiletOptions {
  entry?: string;
  target?: string;
  detailedReport?: boolean;
  logLevel?: 1 | 2 | 3;
  fresh?: boolean;
}

export const buildPiletDefaults = {
  entry: './src/index',
  target: './dist/index.js',
  detailedReport: false,
  logLevel: 3 as const,
  fresh: false,
};

export async function buildPilet(baseDir = process.cwd(), options: BuildPiletOptions = {}) {
  const {
    entry = buildPiletDefaults.entry,
    target = buildPiletDefaults.target,
    detailedReport = buildPiletDefaults.detailedReport,
    logLevel = buildPiletDefaults.logLevel,
    fresh = buildPiletDefaults.fresh,
  } = options;
  const entryFiles = getFileWithExtension(join(baseDir, entry));
  const targetDir = dirname(entryFiles);
  const packageJson = await findFile(targetDir, 'package.json');

  if (!packageJson) {
    logFail('Cannot find the "%s". You need a valid package.json for your pilet.', 'package.json');
    throw new Error('Invalid pilet.');
  }

  const externals = Object.keys(require(packageJson).peerDependencies);

  await setStandardEnvs({
    production: true,
    target: targetDir,
  });

  const dest = {
    outDir: dirname(target),
    outFile: basename(target),
  };

  if (fresh) {
    await removeDirectory(dest.outDir);
  }

  modifyBundlerForPilet(Bundler.prototype, externals, targetDir);

  const bundler = new Bundler(
    entryFiles,
    extendConfig({
      ...dest,
      watch: false,
      minify: true,
      scopeHoist: false,
      contentHash: true,
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
