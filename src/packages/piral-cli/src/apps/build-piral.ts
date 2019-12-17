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
  updateExistingJson,
  createFileIfNotExists,
  logDone,
  createPackage,
  copyScaffoldingFiles,
  createDirectory,
  remove,
  declarationFlattening,
  findPackageVersion,
  coreExternals,
  combineApiDeclarations,
  cliVersion,
  postTransform,
  logInfo,
  ParcelConfig,
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
  target: string,
  dependencies: Array<string>,
  entryFiles: string,
  dest: Destination,
  subdir: string,
  config: ParcelConfig,
  transformRoot?: string,
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
      ...config,
      outDir,
      outFile: dest.outFile,
    }),
  );

  extendBundlerForPiral(bundler);
  extendBundlerWithPlugins(bundler);

  const bundle = await bundler.bundle();

  if (transformRoot && config.minify) {
    await postTransform(bundle, transformRoot);
  }

  return outDir;
}

async function generateDeclaration(outDir: string, root: string, name: string, dependencies: Record<string, string>) {
  const declaration = combineApiDeclarations(root, Object.keys(dependencies));
  const result = await declarationFlattening(root, name, declaration);
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
  } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const targetDir = dirname(entryFiles);
  const { name, version, root, dependencies, ...pilets } = await retrievePiletsInfo(entryFiles);
  const { externals } = pilets;
  const dest = getDestination(entryFiles, resolve(baseDir, target));

  if (fresh) {
    await clearCache(root, cacheDir);
  }

  await removeDirectory(dest.outDir);

  // everything except release -> build develop
  if (type !== 'release') {
    logInfo('Starting build ...');

    // we'll need this info for later
    const originalPackageJson = resolve(root, 'package.json');
    const { files: originalFiles = [] } = require(originalPackageJson);
    const appDir = 'app';
    const outDir = await bundleFiles(name, true, targetDir, externals, entryFiles, dest, join('develop', appDir), {
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
        version: await findPackageVersion(targetDir, name),
      })),
    );
    const externalDependencies = externalPackages.reduce(
      (deps, dep) => {
        deps[dep.name] = dep.version;
        return deps;
      },
      {} as Record<string, string>,
    );
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
    await generateDeclaration(outDir, root, name, dependencies.std);
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

    const outDir = await bundleFiles(
      name,
      false,
      targetDir,
      externals,
      entryFiles,
      dest,
      'release',
      {
        cacheDir,
        watch: false,
        sourceMaps,
        contentHash,
        minify,
        scopeHoist,
        detailedReport,
        publicUrl,
        logLevel,
      },
      root,
    );

    logDone(`Files for publication available in "${outDir}".`);
  }
}
