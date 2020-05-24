import { setLogLevel, logDone, createDeclaration, ForceOverwrite } from '../common';
import { LogLevels } from '../types';

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

export async function declarationPiral(baseDir = process.cwd(), options: DeclarationPiralOptions = {}) {
  const {
    entry = declarationPiralDefaults.entry,
    target = declarationPiralDefaults.target,
    forceOverwrite = declarationPiralDefaults.forceOverwrite,
    logLevel = declarationPiralDefaults.logLevel,
  } = options;
  setLogLevel(logLevel);
  await createDeclaration(baseDir, entry, target, forceOverwrite);
  logDone(`Declaration created successfully in "${target}"!`);
}
