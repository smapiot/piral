import { DeclOptions, generateDeclaration, createExcludePlugin, Logger } from 'dets';
import { dirname, basename, resolve, extname } from 'path';
import { progress, log, logWarn, logVerbose, logInfo } from './log';
import { ForceOverwrite } from './enums';
import { retrievePiralRoot, retrievePiletsInfo } from './package';
import { entryModuleExtensions, piralBaseRoot } from './constants';
import { readText, getEntryFiles, matchFiles, createFileIfNotExists } from './io';
import { LogLevels } from '../types';

function findPiralBaseApi(root: string) {
  try {
    const file = require
      .resolve(piralBaseRoot, {
        paths: [root],
      })
      ?.replace(/\.js$/, '.d.ts');
    return [
      {
        file,
        name: 'PiletApi',
      },
    ];
  } catch (err) {
    log('generalError_0002', `Could not find the root API of "piral-base" from "${root}": ${err}`);
    return [];
  }
}

function findDeclaredTypings(root: string) {
  try {
    const { typings, extraTypes } = require(resolve(root, 'package.json'));

    if (extraTypes) {
      if (typeof extraTypes === 'string') {
        return [resolve(root, extraTypes)];
      } else if (Array.isArray(extraTypes)) {
        return extraTypes.filter((types) => typeof types === 'string').map((types) => resolve(root, types));
      }
    }

    if (typings) {
      return [resolve(root, typings)];
    }
  } catch {}

  return [];
}

async function getAllFiles(entryModules: Array<string>) {
  const files: Array<string> = [];
  const pattern = '**/+(*.ts|*.tsx|*.js|*.jsx)';
  const allFiles = await Promise.all(entryModules.map((m) => matchFiles(dirname(m), pattern)));

  for (const found of allFiles) {
    files.push(...found.filter((file) => !files.includes(file)));
  }

  return files;
}

async function getEntryModules(entryFiles: string) {
  if (!entryModuleExtensions.includes(extname(entryFiles).toLowerCase())) {
    const appFile = await readText(dirname(entryFiles), basename(entryFiles));
    const entryModules = await getEntryFiles(appFile, dirname(entryFiles));
    return entryModules;
  }

  return [entryFiles];
}

function createLogger(): Logger {
  return {
    error(message) {
      throw new Error(message);
    },
    info(message) {
      logInfo(message);
    },
    verbose(message) {
      logVerbose(message);
    },
    warn(message) {
      logWarn(message);
    },
  };
}

async function createDeclarationFile(
  options: DeclOptions,
  source: string,
  target: string,
  forceOverwrite: ForceOverwrite,
) {
  progress('Bundling declaration file ...');

  try {
    const result = generateDeclaration(options);

    progress('Writing declaration file ...');
    await createFileIfNotExists(target, 'index.d.ts', result, forceOverwrite);
  } catch (ex) {
    log('declarationCouldNotBeGenerated_0076', source, ex);
  }
}

export async function createPiletDeclaration(
  name: string,
  root: string,
  entry: string,
  allowedImports: Array<string>,
  target: string,
  forceOverwrite: ForceOverwrite,
  logLevel: LogLevels,
) {
  const files = await getAllFiles([entry]);
  const types = findDeclaredTypings(root);
  const options: DeclOptions = {
    name,
    root,
    files,
    types: [...types, ...files],
    plugins: [createExcludePlugin([name])],
    apis: [],
    imports: allowedImports,
    logLevel,
    logger: createLogger(),
  };
  return await createDeclarationFile(options, root, target, forceOverwrite);
}

export async function createPiralDeclaration(
  baseDir: string,
  entry: string,
  target: string,
  forceOverwrite: ForceOverwrite,
  logLevel: LogLevels,
) {
  progress('Reading configuration ...');
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { name, root, externals } = await retrievePiletsInfo(entryFiles);
  const entryModules = await getEntryModules(entryFiles);
  const files = await getAllFiles(entryModules);
  const options: DeclOptions = {
    name,
    root,
    files,
    types: findDeclaredTypings(root),
    apis: findPiralBaseApi(root),
    imports: externals,
    logLevel,
    logger: createLogger(),
  };

  if (options.apis.length) {
    return await createDeclarationFile(options, baseDir, target, forceOverwrite);
  }

  log('declarationCouldNotBeGenerated_0076', baseDir, 'The main Pilet API interface could not be found.');
}
