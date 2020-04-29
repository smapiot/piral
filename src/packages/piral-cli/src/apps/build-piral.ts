import { dirname, basename, extname, join, resolve, relative } from 'path';
import { ParcelConfig, LogLevels, PiralBuildType } from '../types';
import {
  setStandardEnvs,
  retrievePiletsInfo,
  retrievePiralRoot,
  removeDirectory,
  logDone,
  checkCliCompatibility,
  patchModules,
  setupBundler,
  defaultCacheDir,
  gatherJsBundles,
  progress,
  setLogLevel,
  logReset,
  createEmulatorPackage,
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

async function bundleFiles(
  piral: string,
  develop: boolean,
  root: string,
  dependencies: Array<string>,
  entryFiles: string,
  dest: Destination,
  category: string,
  dir: string,
  config: ParcelConfig,
) {
  const subDir = join(dest.outDir, category);
  const outDir = join(subDir, dir);

  // since we create this anyway let's just pretend we want to have it clean!
  await removeDirectory(subDir);

  // using different environment variables requires clearing the cache
  await removeDirectory(config.cacheDir);

  setStandardEnvs({
    production: true,
    root,
    debugPiral: develop,
    debugPilet: develop,
    piral,
    dependencies,
  });

  const bundler = setupBundler({
    type: 'piral',
    entryFiles,
    config: {
      ...config,
      outDir,
      outFile: dest.outFile,
    },
  });

  const bundle = await bundler.bundle();
  const [file] = gatherJsBundles(bundle);
  return {
    outDir,
    outFile: relative(outDir, (file && file.src) || outDir),
  };
}

export interface BuildPiralOptions {
  entry?: string;
  target?: string;
  cacheDir?: string;
  publicUrl?: string;
  minify?: boolean;
  detailedReport?: boolean;
  logLevel?: LogLevels;
  fresh?: boolean;
  type?: PiralBuildType;
  sourceMaps?: boolean;
  contentHash?: boolean;
  scopeHoist?: boolean;
  optimizeModules?: boolean;
}

export const buildPiralDefaults: BuildPiralOptions = {
  entry: './',
  target: './dist',
  publicUrl: '/',
  cacheDir: defaultCacheDir,
  detailedReport: false,
  logLevel: LogLevels.info,
  fresh: false,
  minify: true,
  type: 'all',
  sourceMaps: true,
  contentHash: true,
  scopeHoist: false,
  optimizeModules: true,
};

export async function buildPiral(baseDir = process.cwd(), options: BuildPiralOptions = {}) {
  const {
    entry = buildPiralDefaults.entry,
    target = buildPiralDefaults.target,
    publicUrl = buildPiralDefaults.publicUrl,
    detailedReport = buildPiralDefaults.detailedReport,
    logLevel = buildPiralDefaults.logLevel,
    cacheDir = buildPiralDefaults.cacheDir,
    minify = buildPiralDefaults.minify,
    sourceMaps = buildPiralDefaults.sourceMaps,
    contentHash = buildPiralDefaults.contentHash,
    scopeHoist = buildPiralDefaults.scopeHoist,
    fresh = buildPiralDefaults.fresh,
    type = buildPiralDefaults.type,
    optimizeModules = buildPiralDefaults.optimizeModules,
  } = options;
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { name, root, ignored, externals } = await retrievePiletsInfo(entryFiles);
  const cache = resolve(root, cacheDir);
  const dest = getDestination(entryFiles, resolve(baseDir, target));

  await checkCliCompatibility(root);

  if (fresh) {
    progress('Removing output directory ...');
    await removeDirectory(dest.outDir);
  }

  if (optimizeModules) {
    progress('Preparing modules ...');
    await patchModules(root, ignored);
  }

  // everything except release -> build develop
  if (type !== 'release') {
    progress('Starting build ...');

    // we'll need this info for later
    const { outDir, outFile } = await bundleFiles(name, true, root, externals, entryFiles, dest, 'develop', 'app', {
      cacheDir: cache,
      watch: false,
      sourceMaps,
      contentHash,
      minify,
      scopeHoist,
      detailedReport,
      publicUrl,
      logLevel,
    });
    const rootDir = await createEmulatorPackage(root, outDir, outFile);

    logDone(`Development package available in "${rootDir}".`);
    logReset();
  }

  // everything except develop -> build release
  if (type !== 'develop') {
    progress('Starting build ...');

    const { outDir } = await bundleFiles(name, false, root, externals, entryFiles, dest, 'release', '.', {
      cacheDir: cache,
      watch: false,
      sourceMaps,
      contentHash,
      minify,
      scopeHoist,
      detailedReport,
      publicUrl,
      logLevel,
    });

    logDone(`Files for publication available in "${outDir}".`);
    logReset();
  }
}
