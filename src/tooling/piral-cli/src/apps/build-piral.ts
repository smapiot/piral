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
  logInfo,
  readJson,
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
  optimizeModules: false,
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

  const pckg = await readJson(root, 'package.json');
  const { postPiralBuildDevelop, postPiralBuildRelease } = pckg.scripts;

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

    // run post piral build script if provided
    if (postPiralBuildDevelop) {
      progress(`Running 'postPiralBuildDevelop' script ...`);
      logInfo(`Run: ${postPiralBuildDevelop}`);
      await runScript(postPiralBuildDevelop, root);
      logInfo(`Successfully ran 'postPiralBuildDevelop' script.`);
    }

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

    // run post piral build script if provided
    if (postPiralBuildRelease) {
      progress(`Running 'postPiralBuildRelease' script ...`);
      logInfo(`Run: ${postPiralBuildRelease}`);
      await runScript(postPiralBuildRelease, root);
      logInfo(`Successfully ran 'postPiralBuildRelease' script.`);
    }

    logDone(`Files for publication available in "${outDir}".`);
    logReset();
  }
}
