import { dirname, basename, extname, join, resolve } from 'path';
import { callPiralBuild } from '../bundler';
import { LogLevels, PiralBuildType } from '../types';
import {
  retrievePiletsInfo,
  retrievePiralRoot,
  removeDirectory,
  logDone,
  checkCliCompatibility,
  progress,
  setLogLevel,
  logReset,
  createEmulatorSources,
  log,
  logInfo,
  runScript,
  packageEmulator,
} from '../common';

const releaseName = 'release';
const emulatorName = 'emulator';
const emulatorSourcesName = 'emulator-sources';

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
   * Sets the public URL (path) of the bundle.
   */
  publicUrl?: string;

  /**
   * Performs minification or other post-bundle transformations.
   */
  minify?: boolean;

  /**
   * Sets the log level to use.
   */
  logLevel?: LogLevels;

  /**
   * Places the build's output in an appropriate subdirectory (e.g., "emulator").
   */
  subdir?: boolean;

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
   * Sets the bundler to use for building, if any specific.
   */
  bundlerName?: string;

  /**
   * Appends a hash to the side-bundle files.
   */
  contentHash?: boolean;

  /**
   * States if the node modules should be included for target transpilation
   */
  optimizeModules?: boolean;

  /**
   * Additional arguments for a specific bundler.
   */
  _?: Record<string, any>;
}

export const buildPiralDefaults: BuildPiralOptions = {
  entry: './',
  target: './dist',
  publicUrl: '/',
  logLevel: LogLevels.info,
  fresh: false,
  minify: true,
  type: 'all',
  subdir: true,
  sourceMaps: true,
  contentHash: true,
  optimizeModules: false,
};

async function runLifecycle(root: string, scripts: Record<string, string>, type: string) {
  const script = scripts?.[type];

  if (script) {
    log('generalDebug_0003', `Running "${type}" ("${script}") ...`);
    await runScript(script, root);
    log('generalDebug_0003', `Finished running "${type}".`);
  } else {
    log('generalDebug_0003', `No script for "${type}" found ...`);
  }
}

export async function buildPiral(baseDir = process.cwd(), options: BuildPiralOptions = {}) {
  const {
    entry = buildPiralDefaults.entry,
    target = buildPiralDefaults.target,
    publicUrl = buildPiralDefaults.publicUrl,
    logLevel = buildPiralDefaults.logLevel,
    minify = buildPiralDefaults.minify,
    sourceMaps = buildPiralDefaults.sourceMaps,
    contentHash = buildPiralDefaults.contentHash,
    subdir = buildPiralDefaults.subdir,
    fresh = buildPiralDefaults.fresh,
    type = buildPiralDefaults.type,
    optimizeModules = buildPiralDefaults.optimizeModules,
    _ = {},
    bundlerName,
  } = options;
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  const useSubdir = type === 'all' || subdir;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { name, root, ignored, externals, scripts } = await retrievePiletsInfo(entryFiles);
  const dest = getDestination(entryFiles, resolve(baseDir, target));

  await checkCliCompatibility(root);

  if (fresh) {
    progress('Removing output directory ...');
    await removeDirectory(dest.outDir);
  }

  // everything except release -> build emulator
  if (type !== releaseName) {
    const targetDir = useSubdir ? join(dest.outDir, emulatorName) : dest.outDir;
    progress('Starting emulator build ...');

    // since we create this anyway let's just pretend we want to have it clean!
    await removeDirectory(targetDir);

    logInfo(`Bundle ${emulatorName} ...`);
    const { dir: outDir, name: outFile } = await callPiralBuild(
      {
        root,
        piral: name,
        emulator: true,
        optimizeModules,
        sourceMaps,
        contentHash,
        minify: false,
        externals,
        publicUrl,
        outFile: dest.outFile,
        outDir: join(targetDir, 'app'),
        entryFiles,
        logLevel,
        ignored,
        _,
      },
      bundlerName,
    );

    await runLifecycle(root, scripts, 'piral:postbuild');
    await runLifecycle(root, scripts, `piral:postbuild-${emulatorName}`);

    const rootDir = await createEmulatorSources(root, outDir, outFile, logLevel);

    if (type !== emulatorSourcesName) {
      await packageEmulator(rootDir);
      logDone(`Emulator sources available in "${rootDir}".`);
    } else {
      logDone(`Emulator package available in "${rootDir}".`);
    }

    logReset();
  }

  // everything except emulator and emulator-soruces -> build release
  if (type !== emulatorName && type !== emulatorSourcesName) {
    const targetDir = useSubdir ? join(dest.outDir, releaseName) : dest.outDir;
    progress('Starting release build ...');

    // since we create this anyway let's just pretend we want to have it clean!
    await removeDirectory(targetDir);

    logInfo(`Bundle ${releaseName} ...`);
    const { dir: outDir } = await callPiralBuild(
      {
        root,
        piral: name,
        emulator: false,
        optimizeModules,
        sourceMaps,
        contentHash,
        minify,
        externals,
        publicUrl,
        outFile: dest.outFile,
        outDir: targetDir,
        entryFiles,
        logLevel,
        ignored,
        _,
      },
      bundlerName,
    );

    await runLifecycle(root, scripts, 'piral:postbuild');
    await runLifecycle(root, scripts, `piral:postbuild-${releaseName}`);

    logDone(`Files for publication available in "${outDir}".`);
    logReset();
  }
}
