import { join, resolve } from 'path';
import { LogLevels, PiralBuildType } from '../types';
import {
  retrievePiletsInfo,
  retrievePiralRoot,
  removeDirectory,
  checkCliCompatibility,
  progress,
  setLogLevel,
  logReset,
  normalizePublicUrl,
  getDestination,
  validateSharedDependencies,
  allName,
  emulatorPackageName,
  emulatorName,
  emulatorWebsiteName,
  emulatorSourcesName,
  releaseName,
  triggerBuildEmulator,
  triggerBuildShell,
  ensure,
} from '../common';

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
   * Sets the public URL (path) of the bundle. Only for release output.
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
   * States if the build should run continuously and re-build when files change.
   */
  watch?: boolean;

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

  /**
   * Hooks to be triggered at various stages.
   */
  hooks?: {
    onBegin?(e: any): Promise<void>;
    beforeBuild?(e: any): Promise<void>;
    afterBuild?(e: any): Promise<void>;
    beforeEmulator?(e: any): Promise<void>;
    afterEmulator?(e: any): Promise<void>;
    beforePackage?(e: any): Promise<void>;
    afterPackage?(e: any): Promise<void>;
    onEnd?(e: any): Promise<void>;
  };
}

export const buildPiralDefaults: BuildPiralOptions = {
  entry: './',
  target: './dist',
  publicUrl: '/',
  logLevel: LogLevels.info,
  fresh: false,
  minify: true,
  type: allName,
  subdir: true,
  sourceMaps: true,
  watch: false,
  contentHash: true,
  optimizeModules: false,
};

export async function buildPiral(baseDir = process.cwd(), options: BuildPiralOptions = {}) {
  const {
    entry = buildPiralDefaults.entry,
    target = buildPiralDefaults.target,
    publicUrl: originalPublicUrl = buildPiralDefaults.publicUrl,
    logLevel = buildPiralDefaults.logLevel,
    minify = buildPiralDefaults.minify,
    sourceMaps = buildPiralDefaults.sourceMaps,
    watch = buildPiralDefaults.watch,
    contentHash = buildPiralDefaults.contentHash,
    subdir = buildPiralDefaults.subdir,
    fresh = buildPiralDefaults.fresh,
    type = buildPiralDefaults.type,
    optimizeModules = buildPiralDefaults.optimizeModules,
    _ = {},
    hooks = {},
    bundlerName,
  } = options;

  ensure('baseDir', baseDir, 'string');
  ensure('publicUrl', originalPublicUrl, 'string');
  ensure('entry', entry, 'string');
  ensure('_', _, 'object');
  ensure('hooks', hooks, 'object');
  ensure('target', target, 'string');

  const publicUrl = normalizePublicUrl(originalPublicUrl);
  const fullBase = resolve(process.cwd(), baseDir);
  const useSubdir = type === 'all' || subdir;
  setLogLevel(logLevel);

  await hooks.onBegin?.({ options, fullBase });
  progress('Reading configuration ...');
  const entryFiles = await retrievePiralRoot(fullBase, entry);
  const {
    name,
    root,
    ignored,
    externals,
    scripts,
    emulator = emulatorPackageName,
  } = await retrievePiletsInfo(entryFiles);
  const piralInstances = [name];
  const dest = getDestination(entryFiles, resolve(fullBase, target));

  await checkCliCompatibility(root);

  validateSharedDependencies(externals);

  if (fresh) {
    progress('Removing output directory ...');
    await removeDirectory(dest.outDir);
  }

  // either take the explicit type or find out the implicit / default one
  const emulatorType = type === allName || type === emulatorName ? emulator : type.replace(`${emulatorName}-`, '');

  // only applies to an explicit emulator target (e.g., "emulator-website") or to "all" / "emulator" with the setting from the piral.json
  if ([emulatorSourcesName, emulatorPackageName, emulatorWebsiteName].includes(emulatorType)) {
    const targetDir = useSubdir ? join(dest.outDir, emulatorName) : dest.outDir;

    await triggerBuildEmulator({
      root,
      logLevel,
      bundlerName,
      emulatorType,
      hooks,
      targetDir,
      ignored,
      externals,
      entryFiles,
      piralInstances,
      optimizeModules,
      sourceMaps,
      watch,
      scripts,
      contentHash,
      outFile: dest.outFile,
      _,
    });

    logReset();
  }

  // either 'release' or 'all'
  if (type === releaseName || type === allName) {
    const targetDir = useSubdir ? join(dest.outDir, releaseName) : dest.outDir;

    await triggerBuildShell({
      targetDir,
      logLevel,
      bundlerName,
      contentHash,
      externals,
      ignored,
      minify,
      optimizeModules,
      publicUrl,
      outFile: dest.outFile,
      root,
      sourceMaps,
      watch,
      hooks,
      entryFiles,
      piralInstances,
      scripts,
      _,
    });

    logReset();
  }

  await hooks.onEnd?.({ root });
}
