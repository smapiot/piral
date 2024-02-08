import { join, resolve, relative, basename } from 'path';
import { findDependencyVersion, copyScaffoldingFiles, isValidDependency, flattenExternals } from './package';
import { createPiralStubIndexIfNotExists } from './template';
import { filesTar, filesOnceTar, packageJson, piralJson, emulatorJson } from './constants';
import { cliVersion } from './info';
import { createNpmPackage } from './npm';
import { createPiralDeclaration } from './declaration';
import { ForceOverwrite } from './enums';
import { createTarball } from './archive';
import { createDirectory, removeDirectory, matchFiles, removeAny, getFileNames } from './io';
import { updateExistingJson, readJson, writeJson, createFileIfNotExists } from './io';
import { EmulatorWebsiteManifest, LogLevels, SharedDependency, PiletsInfo, TemplateFileLocation } from '../types';

export async function createEmulatorSources(
  sourceDir: string,
  externals: Array<SharedDependency>,
  targetDir: string,
  targetFile: string,
  logLevel: LogLevels,
) {
  const piralPkg = await readJson(sourceDir, packageJson);
  const piralJsonPkg = await readJson(sourceDir, piralJson);
  const pilets: PiletsInfo = {
    ...piralPkg.pilets,
    ...piralJsonPkg.pilets,
  };
  const files: Array<string | TemplateFileLocation> = pilets.files ?? [];
  const allDeps = {
    ...piralPkg.devDependencies,
    ...piralPkg.dependencies,
  };

  const externalPackages = await Promise.all(
    externals
      .filter((ext) => ext.type === 'local' && isValidDependency(ext.name))
      .map(async (external) => ({
        name: external.name,
        version: await findDependencyVersion(piralPkg, sourceDir, external),
        optional: external.isAsync,
      })),
  );
  const externalDependencies = externalPackages.reduce((deps, dep) => {
    if (!dep.optional) {
      deps[dep.name] = dep.version;
    }

    return deps;
  }, {} as Record<string, string>);

  const importmapEntries = externalPackages.reduce((deps, dep) => {
    if (!dep.optional) {
      deps[dep.name] = dep.name;
    }

    return deps;
  }, {} as Record<string, string>);

  const optionalDependencies = externalPackages.reduce((deps, dep) => {
    if (dep.optional) {
      deps[dep.name] = dep.name;
    }

    return deps;
  }, {} as Record<string, string>);

  const rootDir = resolve(targetDir, '..');
  const appDir = relative(rootDir, targetDir);
  const filesDir = resolve(rootDir, filesTar);
  const filesOnceDir = resolve(rootDir, filesOnceTar);

  const filesMap = files
    .filter((file) => file && (typeof file === 'string' || typeof file === 'object'))
    .map((file) => (typeof file === 'string' ? { from: file, to: file } : file))
    .filter((file) => typeof file.to === 'string' && typeof file.from === 'string')
    .map((file) => ({
      ...file,
      to: file.to.replace(/\\/g, '/'),
      from: join('files', file.to).replace(/\\/g, '/'),
    }));

  // do not modify an existing JSON
  await createFileIfNotExists(rootDir, packageJson, '{}');

  // patch the JSON relevant for the project
  await updateExistingJson(rootDir, packageJson, {
    name: piralPkg.name,
    description: piralPkg.description,
    version: piralPkg.version,
    license: piralPkg.license,
    homepage: piralPkg.homepage,
    keywords: piralPkg.keywords,
    importmap: {
      imports: importmapEntries,
    },
    pilets: {
      ...pilets,
      files: filesMap,
    },
    piralCLI: {
      version: cliVersion,
      generated: true,
    },
    main: `./${join(appDir, 'index.js')}`,
    typings: `./${join(appDir, 'index.d.ts')}`,
    app: `./${join(appDir, 'index.html')}`,
    peerDependencies: {},
    optionalDependencies,
    devDependencies: {
      ...allDeps,
      ...externalDependencies,
    },
    sharedDependencies: flattenExternals(externals, true),
    repository: piralPkg.repository,
    bugs: piralPkg.bugs,
    author: piralPkg.author,
    contributors: piralPkg.contributors,
    engines: piralPkg.engines,
    cpu: piralPkg.cpu,
    publishConfig: piralPkg.publishConfig,
  });

  await Promise.all([createDirectory(filesDir), createDirectory(filesOnceDir)]);

  // for scaffolding we need to keep the files also available in the new package
  await copyScaffoldingFiles(
    sourceDir,
    filesDir,
    files.filter((m) => typeof m === 'string' || !m.once),
  );

  // also to avoid information loss we should store the once-only files separately
  await copyScaffoldingFiles(
    sourceDir,
    filesOnceDir,
    files.filter((m) => typeof m !== 'string' && m.once),
  );

  // we just want to make sure that "files" mentioned in the original package.json are respected in the package
  await copyScaffoldingFiles(sourceDir, rootDir, piralPkg.files ?? []);

  // actually including this one hints that the app shell should have been included - which is forbidden
  await createPiralStubIndexIfNotExists(targetDir, 'index.js', ForceOverwrite.yes, {
    name: piralPkg.name,
    outFile: basename(targetFile),
  });

  // generate the associated index.d.ts
  await createPiralDeclaration(sourceDir, piralPkg.app ?? `./src/index.html`, targetDir, ForceOverwrite.yes, logLevel);

  // since things like .gitignore are not properly treated by npm we pack the files (for standard and once only)
  await Promise.all([
    createTarball(filesDir, rootDir, `${filesTar}.tar`),
    createTarball(filesOnceDir, rootDir, `${filesOnceTar}.tar`),
  ]);

  // ... and remove the directory
  await Promise.all([removeDirectory(filesDir), removeDirectory(filesOnceDir)]);

  return rootDir;
}

export async function createEmulatorWebsite(
  sourceDir: string,
  externals: Array<SharedDependency>,
  targetDir: string,
  targetFile: string,
  logLevel: LogLevels,
) {
  const piralPkg = await readJson(sourceDir, packageJson);
  const piralJsonPkg = await readJson(sourceDir, piralJson);
  const pilets: PiletsInfo = {
    ...piralPkg.pilets,
    ...piralJsonPkg.pilets,
  };
  const allDeps = {
    ...piralPkg.devDependencies,
    ...piralPkg.dependencies,
  };

  const externalPackages = await Promise.all(
    externals
      .filter((ext) => ext.type === 'local' && isValidDependency(ext.name))
      .map(async (external) => ({
        name: external.name,
        version: await findDependencyVersion(piralPkg, sourceDir, external),
        optional: external.isAsync,
      })),
  );
  const externalDependencies = externalPackages.reduce((deps, dep) => {
    if (!dep.optional) {
      deps[dep.name] = dep.version;
    }

    return deps;
  }, {} as Record<string, string>);

  const importmapEntries = externalPackages.reduce((deps, dep) => {
    if (!dep.optional) {
      deps[dep.name] = dep.name;
    }

    return deps;
  }, {} as Record<string, string>);

  const optionalDependencies = externalPackages.reduce((deps, dep) => {
    if (dep.optional) {
      deps[dep.name] = dep.name;
    }

    return deps;
  }, {} as Record<string, string>);

  const allFiles = await matchFiles(targetDir, '*');
  const data: EmulatorWebsiteManifest = {
    name: piralPkg.name,
    description: piralPkg.description,
    version: piralPkg.version,
    timestamp: new Date().toISOString(),
    scaffolding: {
      pilets,
      cli: cliVersion,
    },
    files: {
      typings: 'index.d.ts',
      main: basename(targetFile),
      app: 'index.html',
      assets: allFiles.map((file) => relative(targetDir, file)),
    },
    importmap: {
      imports: importmapEntries,
    },
    dependencies: {
      optional: optionalDependencies,
      included: {
        ...allDeps,
        ...externalDependencies,
      },
    },
  };

  await writeJson(targetDir, emulatorJson, data, true);

  // generate the associated index.d.ts
  await createPiralDeclaration(sourceDir, piralPkg.app ?? `./src/index.html`, targetDir, ForceOverwrite.yes, logLevel);

  return targetDir;
}

export async function packageEmulator(rootDir: string) {
  // finally package everything up
  await createNpmPackage(rootDir);

  // get all files
  const names = await getFileNames(rootDir);

  // cleanup
  await Promise.all(
    names
      .filter((name) => !name.endsWith('.tgz'))
      .map((name) => resolve(rootDir, name))
      .map((file) => removeAny(file)),
  );
}
