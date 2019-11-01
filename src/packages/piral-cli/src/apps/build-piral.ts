import * as Bundler from 'parcel-bundler';
import { dirname, basename, extname, join, resolve } from 'path';
import {
  extendConfig,
  setStandardEnvs,
  retrievePiletsInfo,
  retrievePiralRoot,
  extendBundlerForPiral,
  modifyBundlerForPiral,
  removeDirectory,
  extendBundlerWithPlugins,
  clearCache,
  mergeWithJson,
  createFileIfNotExists,
  logDone,
  createPackage,
  copyScaffoldingFiles,
  createDirectory,
  remove,
} from '../common';

interface Destination {
  outDir: string;
  outFile: string;
}

function getDestination(entryFiles: string, target: string): Destination {
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

async function build(
  piral: string,
  develop: boolean,
  target: string,
  dependencies: Array<string>,
  entryFiles: string,
  detailedReport: boolean,
  publicUrl: string,
  logLevel: 1 | 2 | 3,
  dest: Destination,
  subdir: string,
) {
  const outDir = join(dest.outDir, subdir);

  await setStandardEnvs({
    production: true,
    target,
    develop,
    piral,
    dependencies,
  });

  modifyBundlerForPiral(Bundler.prototype, target);

  const bundler = new Bundler(
    entryFiles,
    extendConfig({
      outDir,
      outFile: dest.outFile,
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
  return outDir;
}

export type PiralBuildType = 'all' | 'release' | 'develop';

export interface BuildPiralOptions {
  entry?: string;
  target?: string;
  publicUrl?: string;
  detailedReport?: boolean;
  logLevel?: 1 | 2 | 3;
  fresh?: boolean;
  type?: PiralBuildType;
}

export const buildPiralDefaults = {
  entry: './',
  target: './dist',
  publicUrl: '/',
  detailedReport: false,
  logLevel: 3 as const,
  fresh: false,
  type: 'all' as const,
};

export async function buildPiral(baseDir = process.cwd(), options: BuildPiralOptions = {}) {
  const {
    entry = buildPiralDefaults.entry,
    target = buildPiralDefaults.target,
    publicUrl = buildPiralDefaults.publicUrl,
    detailedReport = buildPiralDefaults.detailedReport,
    logLevel = buildPiralDefaults.logLevel,
    fresh = buildPiralDefaults.fresh,
    type = buildPiralDefaults.type,
  } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const targetDir = dirname(entryFiles);
  const { name, version, root, dependencies, ...pilets } = await retrievePiletsInfo(entryFiles);
  const { externals } = pilets;
  const dest = getDestination(entryFiles, target);

  if (fresh) {
    await clearCache(root);
  }

  await removeDirectory(dest.outDir);

  // everything except release -> build develop
  if (type !== 'release') {
    const appDir = 'app';
    const outDir = await build(
      name,
      true,
      targetDir,
      externals,
      entryFiles,
      detailedReport,
      publicUrl,
      logLevel,
      dest,
      join('develop', appDir),
    );
    const rootDir = resolve(outDir, '..');
    const filesDir = resolve(rootDir, 'files');
    const files = pilets.files.map(file =>
      typeof file === 'string'
        ? join('files', file)
        : {
            ...file,
            from: join('files', file.from),
          },
    );
    await createFileIfNotExists(rootDir, 'package.json', '{}');
    await mergeWithJson(rootDir, 'package.json', {
      name,
      version,
      pilets: {
        ...pilets,
        files,
      },
      main: `${appDir}/index.js`,
      typings: `${appDir}/index.d.ts`,
      app: `${appDir}/index.html`,
      devDependencies: {
        ...dependencies.dev,
        ...dependencies.std,
      },
    });
    await createDirectory(filesDir);
    await copyScaffoldingFiles(rootDir, filesDir, pilets.files);
    await createPackage(rootDir);
    await Promise.all([
      removeDirectory(outDir),
      removeDirectory(filesDir),
      remove(resolve(rootDir, 'package.json')),
    ]);
    logDone(`Development package available in "${rootDir}".`);
  }

  // everything except develop -> build release
  if (type !== 'develop') {
    const outDir = await build(
      name,
      false,
      targetDir,
      externals,
      entryFiles,
      detailedReport,
      publicUrl,
      logLevel,
      dest,
      'release',
    );
    logDone(`Files for publication available in "${outDir}".`);
  }
}
