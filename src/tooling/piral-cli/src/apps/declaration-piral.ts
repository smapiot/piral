import { resolve } from 'path';
import { setLogLevel, logDone, createPiralDeclaration, ForceOverwrite, ensure } from '../common';
import { LogLevels } from '../types';

export interface DeclarationPiralOptions {
  /**
   * The entry of the piral solution.
   */
  entry?: string;

  /**
   * The target directory where the d.ts will be created.
   */
  target?: string;

  /**
   * Specifies ff the target d.ts would be overwrwitten.
   */
  forceOverwrite?: ForceOverwrite;

  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;
}

export const declarationPiralDefaults: DeclarationPiralOptions = {
  entry: './',
  target: './dist',
  forceOverwrite: ForceOverwrite.yes,
  logLevel: LogLevels.info,
};

export async function declarationPiral(baseDir = process.cwd(), options: DeclarationPiralOptions = {}) {
  const {
    entry = declarationPiralDefaults.entry,
    target = declarationPiralDefaults.target,
    forceOverwrite = declarationPiralDefaults.forceOverwrite,
    logLevel = declarationPiralDefaults.logLevel,
  } = options;

  ensure('baseDir', baseDir, 'string');
  ensure('entry', entry, 'string');
  ensure('target', target, 'string');

  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);

  if (await createPiralDeclaration(fullBase, entry, target, forceOverwrite, logLevel)) {
    logDone(`Declaration created successfully in "${target}"!`);
  }
}
