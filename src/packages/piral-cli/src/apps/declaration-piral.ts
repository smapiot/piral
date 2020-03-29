import { dirname, basename, resolve } from 'path';
import { generateDeclaration } from 'dets';
import { LogLevels, ForceOverwrite } from '../types';
import {
  retrievePiletsInfo,
  retrievePiralRoot,
  createFileIfNotExists,
  readText,
  getEntryFiles,
  coreExternals,
  matchFiles,
  setLogLevel,
  logDone,
  progress,
} from '../common';

const piralBaseRoot = 'piral-base/lib/types';

function findPiralBaseApi(root: string) {
  try {
    return require
      .resolve(piralBaseRoot, {
        paths: [root],
      })
      ?.replace(/\.js$/, '.d.ts');
  } catch {
    return undefined;
  }
}

function findDeclaredTypings(root: string) {
  try {
    const { typings } = require(resolve(root, 'package.json'));

    if (typings) {
      return [resolve(root, typings)];
    }
  } catch {}

  return [];
}

export interface DeclarationPiralOptions {
  entry?: string;
  target?: string;
  forceOverwrite?: ForceOverwrite;
  logLevel?: LogLevels;
}

export const declarationPiralDefaults: DeclarationPiralOptions = {
  entry: './',
  target: './dist',
  forceOverwrite: ForceOverwrite.yes,
  logLevel: LogLevels.info,
};

async function getAllFiles(entryModules: Array<string>) {
  const files: Array<string> = [];
  const pattern = '**/+(*.ts|*.tsx|*.js|*.jsx)';
  const allFiles = await Promise.all(entryModules.map(m => matchFiles(dirname(m), pattern)));

  for (const found of allFiles) {
    files.push(...found.filter(file => !files.includes(file)));
  }

  return files;
}

export async function declarationPiral(baseDir = process.cwd(), options: DeclarationPiralOptions = {}) {
  const {
    entry = declarationPiralDefaults.entry,
    target = declarationPiralDefaults.target,
    forceOverwrite = declarationPiralDefaults.forceOverwrite,
    logLevel = declarationPiralDefaults.logLevel,
  } = options;
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { name, root, externals } = await retrievePiletsInfo(entryFiles);
  const allowedImports = [...externals, ...coreExternals];
  const appFile = await readText(dirname(entryFiles), basename(entryFiles));
  const entryModules = await getEntryFiles(appFile, dirname(entryFiles));
  const files = await getAllFiles(entryModules);

  progress('Bundling declaration file ...');
  const result = generateDeclaration({
    name,
    root,
    files,
    types: findDeclaredTypings(root),
    apis: [
      {
        file: findPiralBaseApi(root),
        name: 'PiletApi',
      },
    ],
    imports: allowedImports,
  });

  progress('Writing declaration file ...');
  await createFileIfNotExists(target, 'index.d.ts', result, forceOverwrite);
  logDone(`Declaration created successfully in "${target}"!`);
}
