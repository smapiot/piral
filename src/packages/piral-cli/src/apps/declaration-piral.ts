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

export async function declarationPiral(baseDir = process.cwd(), options: DeclarationPiralOptions = {}) {
  const {
    entry = declarationPiralDefaults.entry,
    target = declarationPiralDefaults.target,
    forceOverwrite = declarationPiralDefaults.forceOverwrite,
  } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { name, root, dependencies } = await retrievePiletsInfo(entryFiles);
  const allowedImports = [...Object.keys(dependencies.std), ...coreExternals];
  const appFile = await readText(dirname(entryFiles), basename(entryFiles));
  const entryModules = await getEntryFiles(appFile, dirname(entryFiles));
  const result = generateDeclaration(name, root, entryModules, allowedImports);
  await createFileIfNotExists(target, 'index.d.ts', result, forceOverwrite);
}
