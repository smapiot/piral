import { dirname, basename, extname, join, resolve } from 'path';
import { LogLevels, PiralBuildType } from '../types';
import { callPiralBuild } from '../bundler';
import {
  retrievePiletsInfo,
  retrievePiralRoot,
  removeDirectory,
  logDone,
  checkCliCompatibility,
  defaultCacheDir,
  progress,
  setLogLevel,
  logReset,
  createEmulatorPackage,
  log,
  logInfo,
  runScript,
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

export interface BuildPiralOptions {
  /**
   * The location of the piral
   */
  entry?: string;

  /**
   * Sets the target directory where the output of the bundling should be placed.
   */
  target?: string;

  /**
   * Sets the cache directory for bundling.
   */
  cacheDir?: string;

  /**
   * Sets the public URL (path) of the bundle.
   */
  publicUrl?: string;

  /**
   * Performs minification or other post-bundle transformations.
   */
  minify?: boolean;

  /**
   * States if a detailed report should be created when building the piral instance.
   */
  detailedReport?: boolean;

  /**
   * Sets the log level to use.
   */
  logLevel?: LogLevels;

  /**
   * Performs a fresh build by removing the target directory first.
   */
  fresh?: boolean;

  /**
   * Selects the target type of the build (e.g. 'release'). "all" builds all target types.
   */
  type?: PiralBuildType;

  /**
   * Create associated source maps for the bundles.
   */
  sourceMaps?: boolean;

  /**
   * Appends a hash to the side-bundle files.
   */
  contentHash?: boolean;

  /**
   * States if tree shaking should be used when creating the bundle.
   * (may reduce bundle size)
   */
  scopeHoist?: boolean;

  /**
   * States if the node modules should be included for target transpilation
   */
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
  optimizeModules: false,
};

async function runLifecycle(root: string, script: string | undefined, type: string) {
  if (script) {
    log('generalDebug_0003', `Running "piral:postbuild" script for type=${type}...`);
    await runScript(script, root);
    log('generalDebug_0003', `Successfully "piral:postbuild" script for type=${type}...`);
  }
}

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
  const { name, root, ignored, externals, scripts } = await retrievePiletsInfo(entryFiles);
  const cache = resolve(root, cacheDir);
  const dest = getDestination(entryFiles, resolve(baseDir, target));

  await checkCliCompatibility(root);

  if (fresh) {
    progress('Removing output directory ...');
    await removeDirectory(dest.outDir);
  }

  // everything except release -> build develop
  if (type !== 'release') {
    progress('Starting build ...');

    // since we create this anyway let's just pretend we want to have it clean!
    await removeDirectory(join(dest.outDir, 'develop'));

    logInfo('Bundle emulator ...');
    const { dir: outDir, name: outFile } = await callPiralBuild({
      root,
      piral: name,
      develop: true,
      optimizeModules,
      scopeHoist,
      sourceMaps,
      contentHash,
      detailedReport,
      minify: false,
      cacheDir: cache,
      externals,
      publicUrl,
      outFile: dest.outFile,
      outDir: join(dest.outDir, 'develop', 'app'),
      entryFiles,
      logLevel,
      ignored,
    });

    // run post piral build script if provided, more specific script takes precedent
    const postBuildScript = scripts['piral:postbuild-develop'] || scripts['piral:postbuild'];
    await runLifecycle(root, postBuildScript, "develop");

    const rootDir = await createEmulatorPackage(root, outDir, outFile);

    logDone(`Development package available in "${rootDir}".`);
    logReset();
  }

  // everything except develop -> build release
  if (type !== 'develop') {
    progress('Starting build ...');

    // since we create this anyway let's just pretend we want to have it clean!
    await removeDirectory(join(dest.outDir, 'release'));

    logInfo('Bundle release ...');
    const { dir: outDir } = await callPiralBuild({
      root,
      piral: name,
      develop: false,
      optimizeModules,
      scopeHoist,
      sourceMaps,
      contentHash,
      detailedReport,
      minify,
      cacheDir: cache,
      externals,
      publicUrl,
      outFile: dest.outFile,
      outDir: join(dest.outDir, 'release'),
      entryFiles,
      logLevel,
      ignored,
    });

    // run post piral build script if provided, more specific script takes precedent
    const postBuildScript = scripts['piral:postbuild-release'] || scripts['piral:postbuild'];
    await runLifecycle(root, postBuildScript, "release");

    logDone(`Files for publication available in "${outDir}".`);
    logReset();
  }
}
