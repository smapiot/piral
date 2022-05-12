import { join, resolve, relative } from 'path';
import { findDependencyVersion, copyScaffoldingFiles, isValidDependency } from './package';
import { createFileFromTemplateIfNotExists } from './template';
import { filesTar, filesOnceTar } from './constants';
import { cliVersion } from './info';
import { createNpmPackage, makeExternals } from './npm';
import { createPiralDeclaration } from './declaration';
import { ForceOverwrite } from './enums';
import { createTarball } from './archive';
import { LogLevels, TemplateFileLocation } from '../types';
import {
  createDirectory,
  removeDirectory,
  createFileIfNotExists,
  updateExistingJson,
  getFileNames,
  removeAny,
} from './io';

const packageJson = 'package.json';

export async function createEmulatorSources(
  sourceDir: string,
  targetDir: string,
  targetFile: string,
  logLevel: LogLevels,
) {
  const piralPkg = require(resolve(sourceDir, packageJson));
  const files: Array<string | TemplateFileLocation> = piralPkg.pilets?.files ?? [];
  const allDeps = {
    ...piralPkg.devDependencies,
    ...piralPkg.dependencies,
  };
  const allExternals = makeExternals(sourceDir, allDeps, piralPkg.pilets?.externals);

  const externalPackages = await Promise.all(
    allExternals.filter(isValidDependency).map(async (name) => ({
      name,
      version: await findDependencyVersion(piralPkg, sourceDir, name),
    })),
  );
  const externalDependencies = externalPackages.reduce((deps, dep) => {
    deps[dep.name] = dep.version;
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

  // patch the JSON relevant for th eproject
  await updateExistingJson(rootDir, packageJson, {
    name: piralPkg.name,
    description: piralPkg.description,
    version: piralPkg.version,
    license: piralPkg.license,
    homepage: piralPkg.homepage,
    keywords: piralPkg.keywords,
    pilets: {
      ...piralPkg.pilets,
      files: filesMap,
    },
    piralCLI: {
      version: cliVersion,
      generated: true,
    },
    main: `./${appDir}/index.js`,
    typings: `./${appDir}/index.d.ts`,
    app: `./${appDir}/index.html`,
    peerDependencies: {},
    devDependencies: {
      ...allDeps,
      ...externalDependencies,
    },
    sharedDependencies: allExternals,
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
  await createFileFromTemplateIfNotExists('piral', targetDir, 'index.js', ForceOverwrite.yes, {
    name: piralPkg.name,
    outFile: targetFile,
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
