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
} from './common';

export interface BuildPiletOptions {
  entry?: string;
  target?: string;
  detailedReport?: boolean;
  logLevel?: 1 | 2 | 3;
}

export const buildPiletDefaults = {
  entry: './src/index',
  target: './dist/index.js',
  detailedReport: false,
  logLevel: 3 as const,
};

export async function buildPilet(baseDir = process.cwd(), options: BuildPiletOptions = {}) {
  const {
    entry = buildPiletDefaults.entry,
    target = buildPiletDefaults.target,
    detailedReport = buildPiletDefaults.detailedReport,
    logLevel = buildPiletDefaults.logLevel,
  } = options;
  const entryFiles = getFileWithExtension(join(baseDir, entry));
  const targetDir = dirname(entryFiles);
  const packageJson = await findFile(targetDir, 'package.json');

  if (!packageJson) {
    console.error('Cannot find any package.json. You need a valid package.json for your pilet.');
    throw new Error('Invalid pilet.');
  }

  const externals = Object.keys(require(packageJson).peerDependencies);

  await setStandardEnvs({
    production: true,
    target: targetDir,
  });

  modifyBundlerForPilet(Bundler.prototype, externals, targetDir);

  const bundler = new Bundler(
    entryFiles,
    extendConfig({
      outDir: dirname(target),
      outFile: basename(target),
      watch: false,
      minify: true,
      scopeHoist: false,
      contentHash: true,
      detailedReport,
    }),
  );

  extendBundlerForPilet(bundler);

  const bundle = await bundler.bundle();

  await postProcess(bundle);
}
