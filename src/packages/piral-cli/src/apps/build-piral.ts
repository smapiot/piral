import { dirname, basename, extname, join, resolve, relative } from 'path';
import { declarationPiral } from './declaration-piral';
import { ParcelConfig, ForceOverwrite, LogLevels } from '../types';
import {
  setStandardEnvs,
  retrievePiletsInfo,
  retrievePiralRoot,
  removeDirectory,
  updateExistingJson,
  createFileIfNotExists,
  logDone,
  createPackage,
  copyScaffoldingFiles,
  createDirectory,
  remove,
  findPackageVersion,
  coreExternals,
  cliVersion,
  checkCliCompatibility,
  patchModules,
  setupBundler,
  defaultCacheDir,
  createFileFromTemplateIfNotExists,
  gatherJsBundles,
  createContextLogger,
  logProgress,
  setLogLevel,
  logReset,
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

export type PiralBuildType = 'all' | 'release' | 'develop';

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
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { name, version, root, dependencies, ignored, files: scaffoldFiles, ...pilets } = await retrievePiletsInfo(
    entryFiles,
  );
  const { externals } = pilets;
  const cache = resolve(root, cacheDir);
  const dest = getDestination(entryFiles, resolve(baseDir, target));
  const logger = createContextLogger();

  await checkCliCompatibility(root);

  if (fresh) {
    logProgress('Removing output directory ...');
    await removeDirectory(dest.outDir);
  }

  if (optimizeModules) {
    logProgress('Preparing modules ...');
    await patchModules(root, ignored);
  }

  // everything except release -> build develop
  if (type !== 'release') {
    logProgress('Starting build ...');

    // we'll need this info for later
    const appDir = 'app';
    const originalPackageJson = resolve(root, 'package.json');
    const { files: originalFiles = [] } = require(originalPackageJson);
    const { outDir, outFile } = await bundleFiles(name, true, root, externals, entryFiles, dest, 'develop', appDir, {
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
    const allExternals = [...externals, ...coreExternals];
    const externalPackages = await Promise.all(
      allExternals.map(async name => ({
        name,
        version: await findPackageVersion(dirname(entryFiles), name),
      })),
    );
    const externalDependencies = externalPackages.reduce((deps, dep) => {
      deps[dep.name] = dep.version;
      return deps;
    }, {} as Record<string, string>);
    const rootDir = resolve(outDir, '..');
    const filesDir = resolve(rootDir, 'files');

    await createFileIfNotExists(rootDir, 'package.json', '{}');
    await updateExistingJson(rootDir, 'package.json', {
      name,
      version,
      pilets,
      piralCLI: {
        version: cliVersion,
        generated: true,
      },
      main: `${appDir}/index.js`,
      typings: `${appDir}/index.d.ts`,
      app: `${appDir}/index.html`,
      peerDependencies: {},
      devDependencies: {
        ...dependencies.dev,
        ...dependencies.std,
        ...externalDependencies,
      },
    });

    await createDirectory(filesDir);

    // for scaffolding we need to keep the files also available in the new package
    await copyScaffoldingFiles(root, filesDir, scaffoldFiles, logger.notify);

    // we just want to make sure that "files" mentioned in the original package.json are respected in the package
    await copyScaffoldingFiles(root, rootDir, originalFiles, logger.notify);

    // actually including this one hints that the app shell should have been included - which is forbidden
    await createFileFromTemplateIfNotExists('other', 'piral', outDir, 'index.js', ForceOverwrite.yes, {
      name,
      outFile,
    });

    await declarationPiral(baseDir, {
      entry,
      target: outDir,
    });

    await createPackage(rootDir);
    await Promise.all([removeDirectory(outDir), removeDirectory(filesDir), remove(resolve(rootDir, 'package.json'))]);

    logDone(`Development package available in "${rootDir}".`);
    logReset();
  }

  // everything except develop -> build release
  if (type !== 'develop') {
    logProgress('Starting build ...');

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

  logger.summary();
  logger.throwIfError();
}
