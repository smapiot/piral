import { join, resolve, relative } from 'path';
import { findDependencyVersion, copyScaffoldingFiles, isValidDependency } from './package';
import { createFileFromTemplateIfNotExists } from './template';
import { coreExternals, cliVersion, filesTar, filesOnceTar } from './info';
import { createPackage } from './npm';
import { createDeclaration } from './declaration';
import { ForceOverwrite } from './enums';
import { createTarball } from './archive';
import { TemplateFileLocation } from '../types';
import {
  createDirectory,
  removeDirectory,
  createFileIfNotExists,
  updateExistingJson,
  getFileNames,
  removeAny,
} from './io';

const packageJson = 'package.json';

export async function createEmulatorPackage(sourceDir: string, targetDir: string, targetFile: string) {
  const piralPkg = require(resolve(sourceDir, packageJson));
  const externals: Array<string> = piralPkg.pilets?.externals ?? [];
  const files: Array<string | TemplateFileLocation> = piralPkg.pilets?.files ?? [];
  const allExternals = [...externals, ...coreExternals];

  const externalPackages = await Promise.all(
    allExternals.filter(isValidDependency).map(async name => ({
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
    .map(file => (typeof file === 'string' ? { from: file, to: file } : file))
    .map(file => ({
      ...file,
      to: file.to.replace(/\\/g, '/'),
      from: join('files', file.from).replace(/\\/g, '/'),
    }));

  // do not modify an existing JSON
  await createFileIfNotExists(rootDir, packageJson, '{}');

  // patch the JSON relevant for th eproject
  await updateExistingJson(rootDir, packageJson, {
    name: piralPkg.name,
    version: piralPkg.version,
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
      ...piralPkg.devDependencies,
      ...piralPkg.dependencies,
      ...externalDependencies,
    },
  });

  await Promise.all([createDirectory(filesDir), createDirectory(filesOnceDir)]);

  // for scaffolding we need to keep the files also available in the new package
  await copyScaffoldingFiles(
    sourceDir,
    filesDir,
    files.filter(m => typeof m === 'string' || !m.once),
  );

  // also to avoid information loss we should store the once-only files separately
  await copyScaffoldingFiles(
    sourceDir,
    filesOnceDir,
    files.filter(m => typeof m !== 'string' && m.once),
  );

  // we just want to make sure that "files" mentioned in the original package.json are respected in the package
  await copyScaffoldingFiles(sourceDir, rootDir, piralPkg.files ?? []);

  // actually including this one hints that the app shell should have been included - which is forbidden
  await createFileFromTemplateIfNotExists('other', 'piral', targetDir, 'index.js', ForceOverwrite.yes, {
    name: piralPkg.name,
    outFile: targetFile,
  });

  // generate the associated index.d.ts
  await createDeclaration(sourceDir, piralPkg.app ?? `./src/index.html`, targetDir, ForceOverwrite.yes);

  // since things like .gitignore are not properly treated by NPM we pack the files (for standard and once only)
  await Promise.all([
    createTarball(filesDir, rootDir, `${filesTar}.tar`),
    createTarball(filesOnceDir, rootDir, `${filesOnceTar}.tar`),
  ]);

  // ... and remove the directory
  await Promise.all([removeDirectory(filesDir), removeDirectory(filesOnceDir)]);

  // finally package everything up
  await createPackage(rootDir);

  // get all files
  const names = await getFileNames(rootDir);

  // cleanup
  await Promise.all(
    names
      .filter(name => !name.endsWith('.tgz'))
      .map(name => resolve(rootDir, name))
      .map(file => removeAny(file)),
  );

  return rootDir;
}
