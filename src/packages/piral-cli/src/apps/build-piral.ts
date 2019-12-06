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
  detailedReport: boolean,
  publicUrl: string,
  logLevel: 1 | 2 | 3,
  dest: Destination,
  subdir: string,
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
      outDir,
      outFile: dest.outFile,
      watch: false,
      minify: true,
      scopeHoist: false,
      contentHash: true,
      detailedReport,
      publicUrl,
      logLevel,
    }),
  );

  extendBundlerForPiral(bundler);
  extendBundlerWithPlugins(bundler);

  await bundler.bundle();
  return outDir;
}

async function generateDeclaration(outDir: string, root: string, name: string, dependencies: Record<string, string>) {
  const declaration = combineApiDeclarations(root, Object.keys(dependencies));
  const result = await declarationFlattening(outDir, name, declaration);
  await createFileIfNotExists(outDir, 'index.d.ts', result);
}

export type PiralBuildType = 'all' | 'release' | 'develop';

export interface BuildPiralOptions {
  entry?: string;
  target?: string;
  publicUrl?: string;
  detailedReport?: boolean;
  logLevel?: 1 | 2 | 3;
  fresh?: boolean;
  type?: PiralBuildType;
}

export const buildPiralDefaults = {
  entry: './',
  target: './dist',
  publicUrl: '/',
  detailedReport: false,
  logLevel: 3 as const,
  fresh: false,
  type: 'all' as const,
};

export async function buildPiral(baseDir = process.cwd(), options: BuildPiralOptions = {}) {
  const {
    entry = buildPiralDefaults.entry,
    target = buildPiralDefaults.target,
    publicUrl = buildPiralDefaults.publicUrl,
    detailedReport = buildPiralDefaults.detailedReport,
    logLevel = buildPiralDefaults.logLevel,
    fresh = buildPiralDefaults.fresh,
    type = buildPiralDefaults.type,
  } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const targetDir = dirname(entryFiles);
  const { name, version, root, dependencies, ...pilets } = await retrievePiletsInfo(entryFiles);
  const { externals } = pilets;
  const dest = getDestination(entryFiles, resolve(baseDir, target));

  if (fresh) {
    await clearCache(root);
  }

  await removeDirectory(dest.outDir);

  // everything except release -> build develop
  if (type !== 'release') {
    const appDir = 'app';
    const outDir = await bundleFiles(
      name,
      true,
      targetDir,
      externals,
      entryFiles,
      detailedReport,
      publicUrl,
      logLevel,
      dest,
      join('develop', appDir),
    );
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
    const files = pilets.files.map(file =>
      typeof file === 'string'
        ? join('files', file)
        : {
            ...file,
            from: join('files', file.from),
          },
    );
    await createFileIfNotExists(rootDir, 'package.json', '{}');
    await updateExistingJson(rootDir, 'package.json', {
      name,
      version,
      pilets: {
        ...pilets,
        files,
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
    await copyScaffoldingFiles(root, filesDir, pilets.files);
    await createFileIfNotExists(outDir, 'index.js', 'throw new Error("This file should not be included anywhere.");');
    await generateDeclaration(outDir, root, name, dependencies.std);
    await createPackage(rootDir);
    await Promise.all([removeDirectory(outDir), removeDirectory(filesDir), remove(resolve(rootDir, 'package.json'))]);
    logDone(`Development package available in "${rootDir}".\n`);
  }

  // everything except develop -> build release
  if (type !== 'develop') {
    const outDir = await bundleFiles(
      name,
      false,
      targetDir,
      externals,
      entryFiles,
      detailedReport,
      publicUrl,
      logLevel,
      dest,
      'release',
    );
    logDone(`Files for publication available in "${outDir}".\n`);
  }
}
