import { dirname, basename } from 'path';
import { generateDeclaration } from '../declaration';
import {
  retrievePiletsInfo,
  retrievePiralRoot,
  createFileIfNotExists,
  readText,
  getEntryFiles,
  coreExternals,
  ForceOverwrite,
  matchFiles,
} from '../common';

export interface DeclarationPiralOptions {
  entry?: string;
  target?: string;
  forceOverwrite?: ForceOverwrite;
}

export const declarationPiralDefaults = {
  entry: './',
  target: './dist',
  forceOverwrite: ForceOverwrite.yes,
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
  } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { name, root, externals } = await retrievePiletsInfo(entryFiles);
  const allowedImports = [...externals, ...coreExternals];
  const appFile = await readText(dirname(entryFiles), basename(entryFiles));
  const entryModules = await getEntryFiles(appFile, dirname(entryFiles));
  const files = await getAllFiles(entryModules);
  const result = generateDeclaration(name, root, files, allowedImports);
  await createFileIfNotExists(target, 'index.d.ts', result, forceOverwrite);
}
