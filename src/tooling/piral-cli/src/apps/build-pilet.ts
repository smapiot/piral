import { dirname, basename, resolve, relative } from 'path';
import { LogLevels, PiletBuildType, PiletSchemaVersion } from '../types';
import { callPiletBuild, callPiralBuild } from '../bundler';
import {
  removeDirectory,
  retrievePiletData,
  setLogLevel,
  progress,
  logDone,
  logInfo,
  createPiletDeclaration,
  ForceOverwrite,
  matchAnyPilet,
  fail,
  config,
  log,
  writeJson,
  getPiletSpecMeta,
  getFileNames,
  copy,
  checkAppShellPackage,
  cpuCount,
  concurrentWorkers,
  normalizePublicUrl,
  combinePiletExternals,
  retrievePiletsInfo,
  validateSharedDependencies,
} from '../common';

interface PiletData {
  id: string;
  package: any;
  path: string;
  outFile: string;
  outDir: string;
}

function createMetadata(outDir: string, outFile: string, pilets: Array<PiletData>, publicPath: string) {
  return writeJson(
    outDir,
    outFile,
    pilets.map((p) => ({
      name: p.package.name,
      version: p.package.version,
      link: `${publicPath}${p.id}/${p.outFile}`,
      ...getPiletSpecMeta(p.path, `${publicPath}${p.id}/`),
    })),
  );
}

function copyPilets(outDir: string, pilets: Array<PiletData>) {
  return Promise.all(
    pilets.map(async (p) => {
      const files = await getFileNames(p.outDir);

      for (const file of files) {
        await copy(resolve(p.outDir, file), resolve(outDir, p.id, file), ForceOverwrite.yes);
      }
    }),
  );
}

export interface BuildPiletOptions {
  /**
   * Sets the name of the Piral instance.
   */
  app?: string;

  /**
   * The source index file (e.g. index.tsx) for collecting all the information
   * @example './src/index'
   */
  entry?: string | Array<string>;

  /**
   * The target file of bundling.
   * @example './dist/index.js'
   */
  target?: string;

  /**
   * Sets the public URL (path) of the bundle. Only for release output.
   */
  publicUrl?: string;

  /**
   * States if minifaction or other post-bundle transformations should be performed.
   */
  minify?: boolean;

  /**
   * Indicates if a declaration file should be generated.
   */
  declaration?: boolean;

  /**
   * Sets the maximum number of parallel build processes.
   */
  concurrency?: number;

  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * States if the target directory should be removed before building.
   */
  fresh?: boolean;

  /**
   * States if source maps should be created for the bundles.
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
   * States if a content hash should be appended to the side-bundle files
   */
  contentHash?: boolean;

  /**
   * Selects the target type of the build (e.g. 'release'). "all" builds all target types.
   */
  type?: PiletBuildType;

  /**
   * States if the node modules should be included for target transpilation
   */
  optimizeModules?: boolean;

  /**
   * The schema to be used when bundling the pilets.
   * @example 'v1'
   */
  schemaVersion?: PiletSchemaVersion;

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
    beforeDeclaration?(e: any): Promise<void>;
    afterDeclaration?(e: any): Promise<void>;
    onEnd?(e: any): Promise<void>;
  };
}

export const buildPiletDefaults: BuildPiletOptions = {
  entry: './src/index',
  target: './dist/index.js',
  publicUrl: '/',
  minify: true,
  logLevel: LogLevels.info,
  type: 'default',
  fresh: false,
  sourceMaps: true,
  watch: false,
  contentHash: true,
  optimizeModules: false,
  schemaVersion: undefined,
  concurrency: cpuCount,
  declaration: true,
};

export async function buildPilet(baseDir = process.cwd(), options: BuildPiletOptions = {}) {
  const {
    entry = buildPiletDefaults.entry,
    target = buildPiletDefaults.target,
    publicUrl: originalPublicUrl = buildPiletDefaults.publicUrl,
    logLevel = buildPiletDefaults.logLevel,
    minify = buildPiletDefaults.minify,
    sourceMaps = buildPiletDefaults.sourceMaps,
    watch = buildPiletDefaults.watch,
    contentHash = buildPiletDefaults.contentHash,
    fresh = buildPiletDefaults.fresh,
    concurrency = buildPiletDefaults.concurrency,
    optimizeModules = buildPiletDefaults.optimizeModules,
    schemaVersion: originalSchemaVersion = buildPiletDefaults.schemaVersion,
    declaration = buildPiletDefaults.declaration,
    type = buildPiletDefaults.type,
    _ = {},
    hooks = {},
    bundlerName,
    app,
  } = options;
  const publicUrl = normalizePublicUrl(originalPublicUrl);
  const fullBase = resolve(process.cwd(), baseDir);
  const entryList = Array.isArray(entry) ? entry : [entry];
  setLogLevel(logLevel);

  await hooks.onBegin?.({ options, fullBase });
  progress('Reading configuration ...');
  const allEntries = await matchAnyPilet(fullBase, entryList);
  log('generalDebug_0003', `Found the following entries: ${allEntries.join(', ')}`);

  if (allEntries.length === 0) {
    fail('entryFileMissing_0077');
  }

  const pilets = await concurrentWorkers(allEntries, concurrency, async (entryModule) => {
    const targetDir = dirname(entryModule);
    const { peerDependencies, peerModules, root, apps, piletPackage, ignored, importmap, schema } = await retrievePiletData(
      targetDir,
      app,
    );
    const schemaVersion = originalSchemaVersion || schema || config.schemaVersion || 'v2';
    const piralInstances = apps.map(m => m.appPackage.name);
    const externals = combinePiletExternals(piralInstances, peerDependencies, peerModules, importmap);
    const dest = resolve(root, target);
    const outDir = dirname(dest);
    const outFile = basename(dest);

    validateSharedDependencies(importmap);

    if (fresh) {
      progress('Removing output directory ...');
      await removeDirectory(outDir);
    }

    logInfo('Bundle pilet ...');

    await hooks.beforeBuild?.({ root, outDir, importmap, entryModule, schemaVersion, piletPackage });

    await callPiletBuild(
      {
        root,
        piralInstances,
        optimizeModules,
        sourceMaps,
        watch,
        contentHash,
        minify,
        externals,
        targetDir,
        importmap,
        outFile,
        outDir,
        entryModule: `./${relative(root, entryModule)}`,
        logLevel,
        version: schemaVersion,
        ignored,
        _,
      },
      bundlerName,
    );

    await hooks.afterBuild?.({ root, outDir, importmap, entryModule, schemaVersion, piletPackage });

    if (declaration) {
      await hooks.beforeDeclaration?.({ root, outDir, entryModule, piletPackage });
      await createPiletDeclaration(
        piletPackage.name,
        root,
        entryModule,
        externals,
        outDir,
        ForceOverwrite.yes,
        logLevel,
      );
      await hooks.afterDeclaration?.({ root, outDir, entryModule, piletPackage });
    }

    logDone(`Pilet "${piletPackage.name}" built successfully!`);

    return {
      id: piletPackage.name.replace(/[^a-zA-Z0-9\-]/gi, ''),
      root,
      apps,
      outDir,
      outFile,
      path: dest,
      package: piletPackage,
    };
  });

  if (type === 'standalone') {
    const distDir = dirname(resolve(fullBase, target));
    const outDir = resolve(distDir, 'standalone');
    const { apps, root } = pilets[0];

    const { appPackage, appFile } = apps[0];
    const piralInstances = [appPackage.name];
    const isEmulator = checkAppShellPackage(appPackage);

    logInfo('Building standalone solution ...');

    await removeDirectory(outDir);

    progress('Copying files ...');

    await copyPilets(outDir, pilets);

    await createMetadata(outDir, '$pilet-api', pilets, publicUrl);

    if (isEmulator) {
      // in case of an emulator assets are not "seen" by the bundler, so we
      // just copy overthing over - this should work in most cases.
      await copy(dirname(appFile), outDir, ForceOverwrite.yes);
      progress('Optimizing app shell ...');

      // we don't need to care about externals or other things that are already
      // part of the emulator
      await callPiralBuild(
        {
          root,
          piralInstances,
          emulator: false,
          standalone: true,
          optimizeModules: false,
          sourceMaps,
          watch: false,
          contentHash,
          minify,
          externals: [],
          publicUrl,
          outFile: 'index.html',
          outDir,
          entryFiles: appFile,
          logLevel,
          ignored: [],
          _,
        },
        bundlerName,
      );
    } else {
      // in this case we can just do the same steps as if
      const { ignored, externals } = await retrievePiletsInfo(appFile);

      await callPiralBuild(
        {
          root,
          piralInstances,
          emulator: false,
          standalone: true,
          optimizeModules: false,
          sourceMaps,
          watch: false,
          contentHash,
          minify,
          externals: externals.map(m => m.name),
          publicUrl,
          outFile: 'index.html',
          outDir,
          entryFiles: appFile,
          logLevel,
          ignored,
          _,
        },
        bundlerName,
      );
    }

    logDone(`Standalone app available at "${outDir}"!`);
  } else if (type === 'manifest') {
    const manifest = 'pilets.json';
    const outDir = dirname(resolve(fullBase, target));

    logInfo('Building pilet manifest ...');

    progress('Copying files ...');

    await copyPilets(outDir, pilets);

    await createMetadata(outDir, manifest, pilets, publicUrl);

    logDone(`Manifest available at "${outDir}/${manifest}"!`);
  }

  await hooks.onEnd?.({});
}
