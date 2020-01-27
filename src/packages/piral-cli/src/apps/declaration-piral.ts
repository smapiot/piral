import { dirname, basename } from 'path';
import { generateDeclaration } from '../declaration';
import { retrievePiletsInfo, retrievePiralRoot, createFileIfNotExists, readText, getEntryFiles } from '../common';

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

export interface DeclarationPiralOptions {
  entry?: string;
  target?: string;
}

export const declarationPiralDefaults = {
  entry: './',
  target: './dist',
};

export async function declarationPiral(baseDir = process.cwd(), options: DeclarationPiralOptions = {}) {
  const { entry = declarationPiralDefaults.entry, target = declarationPiralDefaults.target } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { name, root, dependencies } = await retrievePiletsInfo(entryFiles);
  await createDeclarationFile(target, name, root, entryFiles, dependencies.std);
}
