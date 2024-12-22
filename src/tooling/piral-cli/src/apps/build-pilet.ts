import { dirname, resolve } from 'path';
import { LogLevels, PiletBuildType, PiletSchemaVersion } from '../types';
import { callPiralBuild } from '../bundler';
import {
  removeDirectory,
  setLogLevel,
  progress,
  logDone,
  logInfo,
  ForceOverwrite,
  matchAnyPilet,
  fail,
  log,
  writeJson,
  getPiletSpecMeta,
  getFileNames,
  copy,
  checkAppShellPackage,
  cpuCount,
  concurrentWorkers,
  normalizePublicUrl,
  retrievePiletsInfo,
  flattenExternals,
  triggerBuildPilet,
  readText,
  writeText,
  ensure,
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

  ensure('baseDir', baseDir, 'string');
  ensure('publicUrl', originalPublicUrl, 'string');
  ensure('entry', entry, 'string');
  ensure('_', _, 'object');
  ensure('hooks', hooks, 'object');
  ensure('target', target, 'string');

  const publicUrl = normalizePublicUrl(originalPublicUrl);
  const fullBase = resolve(process.cwd(), baseDir);
  const entryList = Array.isArray(entry) ? entry : [entry];
  const manifest = 'pilets.json';
  setLogLevel(logLevel);

  await hooks.onBegin?.({ options, fullBase });
  progress('Reading configuration ...');
  const allEntries = await matchAnyPilet(fullBase, entryList);
  log('generalDebug_0003', `Found the following entries: ${allEntries.join(', ')}`);

  if (allEntries.length === 0) {
    fail('entryFileMissing_0077');
  }

  const pilets = await concurrentWorkers(allEntries, concurrency, async (entryModule) => {
    const { piletPackage, root, outDir, apps, outFile, dest } = await triggerBuildPilet({
      _,
      app,
      bundlerName,
      contentHash,
      entryModule,
      fresh,
      logLevel,
      minify,
      optimizeModules,
      originalSchemaVersion,
      sourceMaps,
      target,
      watch,
      hooks,
      declaration,
    });

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
    const outFile = 'index.html';
    const { apps, root } = pilets[0];

    if (apps.length === 0) {
      fail('appInstancesNotGiven_0012');
    }

    const { appPackage, appFile } = apps[0];
    const piralInstances = [appPackage.name];
    const isEmulator = checkAppShellPackage(appPackage);

    logInfo('Building standalone solution ...');

    await removeDirectory(outDir);

    progress('Copying files ...');

    await copyPilets(outDir, pilets);

    await createMetadata(outDir, manifest, pilets, publicUrl);

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
          outFile,
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
          externals: flattenExternals(externals),
          publicUrl,
          outFile,
          outDir,
          entryFiles: appFile,
          logLevel,
          ignored,
          _,
        },
        bundlerName,
      );
    }

    const html = await readText(outDir, outFile);
    const newHtml = html.replace(
      '<script', // place the assignment before the first seen script
      `<script>window['dbg:pilet-api']=${JSON.stringify(publicUrl + manifest)};</script><script`,
    );
    await writeText(outDir, outFile, newHtml);

    logDone(`Standalone app available at "${outDir}"!`);
  } else if (type === 'manifest') {
    const outDir = dirname(resolve(fullBase, target));

    logInfo('Building pilet manifest ...');

    progress('Copying files ...');

    await copyPilets(outDir, pilets);

    await createMetadata(outDir, manifest, pilets, publicUrl);

    logDone(`Manifest available at "${outDir}/${manifest}"!`);
  }

  await hooks.onEnd?.({});
}
