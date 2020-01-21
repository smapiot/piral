import { dirname, basename, extname, join, resolve } from 'path';
import { generateDeclaration } from '../declaration';
import {
  setStandardEnvs,
  retrievePiletsInfo,
  retrievePiralRoot,
  removeDirectory,
  clearCache,
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
  logInfo,
  ParcelConfig,
  checkCliCompatibility,
  patchModules,
  readText,
  getEntryFiles,
  setupBundler,
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
  subdir: string,
  config: ParcelConfig,
) {
  const outDir = join(dest.outDir, subdir);

  // since we create this anyway let's just pretend we want to have it clean!
  await removeDirectory(outDir);

  // using different environment variables requires clearing the cache
  await clearCache(root, config.cacheDir);

  setStandardEnvs({
    production: true,
    root,
    develop,
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

  await bundler.bundle();
  return outDir;
}

async function createDeclarationFile(
  outDir: string,
  name: string,
  root: string,
  app: string,
  dependencies: Record<string, string>,
) {
  const allowedImports = Object.keys(dependencies);
  const appFile = await readText(dirname(app), basename(app));
  const entryFiles = await getEntryFiles(appFile, dirname(app));
  const result = generateDeclaration(name, root, entryFiles, allowedImports);
  await createFileIfNotExists(outDir, 'index.d.ts', result);
}

export type PiralBuildType = 'all' | 'release' | 'develop';

export interface BuildPiralOptions {
  entry?: string;
  target?: string;
  cacheDir?: string;
  publicUrl?: string;
  minify?: boolean;
  detailedReport?: boolean;
  logLevel?: 1 | 2 | 3;
  fresh?: boolean;
  type?: PiralBuildType;
  sourceMaps?: boolean;
  contentHash?: boolean;
  scopeHoist?: boolean;
  optimizeModules?: boolean;
}

export const buildPiralDefaults = {
  entry: './',
  target: './dist',
  publicUrl: '/',
  cacheDir: '.cache',
  detailedReport: false,
  logLevel: 3 as const,
  fresh: false,
  minify: true,
  type: 'all' as const,
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
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { name, version, root, dependencies, ignored, ...pilets } = await retrievePiletsInfo(entryFiles);
  const { externals } = pilets;
  const dest = getDestination(entryFiles, resolve(baseDir, target));

  await checkCliCompatibility(root);

  if (fresh) {
    await removeDirectory(dest.outDir);
  }

  if (optimizeModules) {
    logInfo('Preparing modules ...');
    await patchModules(root, cacheDir, ignored);
  }

  // everything except release -> build develop
  if (type !== 'release') {
    logInfo('Starting build ...');

    // we'll need this info for later
    const originalPackageJson = resolve(root, 'package.json');
    const { files: originalFiles = [] } = require(originalPackageJson);
    const appDir = 'app';
    const outDir = await bundleFiles(name, true, root, externals, entryFiles, dest, join('develop', appDir), {
      cacheDir,
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
    const files = pilets.files
      .map(file => (typeof file === 'string' ? { from: file, to: file } : file))
      .map(file => ({
        ...file,
        from: join('files', file.from),
      }));
    await createFileIfNotExists(rootDir, 'package.json', '{}');
    await updateExistingJson(rootDir, 'package.json', {
      name,
      version,
      pilets: {
        ...pilets,
        files,
      },
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
    await copyScaffoldingFiles(root, filesDir, pilets.files);
    // we just want to make sure that "files" mentioned in the original package.json are respected in the package
    await copyScaffoldingFiles(root, rootDir, originalFiles);
    // actually including this one hints that the app shell should have been included - which is forbidden
    await createFileIfNotExists(outDir, 'index.js', 'throw new Error("This file should not be included anywhere.");');
    await createDeclarationFile(outDir, name, root, entryFiles, dependencies.std);
    await createPackage(rootDir);
    await Promise.all([removeDirectory(outDir), removeDirectory(filesDir), remove(resolve(rootDir, 'package.json'))]);

    logDone(`Development package available in "${rootDir}".`);
  }

  if (type === 'all') {
    // Just have some space between the two builds
    logInfo('\n\n\n\n\n\n');
  }

  // everything except develop -> build release
  if (type !== 'develop') {
    logInfo('Starting build ...');

    const outDir = await bundleFiles(name, false, root, externals, entryFiles, dest, 'release', {
      cacheDir,
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
  }
}
