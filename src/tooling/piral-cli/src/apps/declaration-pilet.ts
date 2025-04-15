import { dirname, resolve } from 'path';
import { LogLevels } from '../types';
import {
  setLogLevel,
  logDone,
  createPiletDeclaration,
  ForceOverwrite,
  matchAnyPilet,
  retrievePiletData,
  combinePiletExternals,
  ensure,
} from '../common';

export interface DeclarationPiletOptions {
  /**
   * The source index file (e.g. index.tsx) for collecting all the information
   * @example './src/index'
   */
  entry?: string | Array<string>;

  /**
   * The target directory where the d.ts will be created.
   */
  target?: string;

  /**
   * Specifies ff the target d.ts would be overwritten.
   */
  forceOverwrite?: ForceOverwrite;

  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;
}

export const declarationPiletDefaults: DeclarationPiletOptions = {
  entry: './',
  target: './dist',
  forceOverwrite: ForceOverwrite.yes,
  logLevel: LogLevels.info,
};

export async function declarationPilet(baseDir = process.cwd(), options: DeclarationPiletOptions = {}) {
  const {
    entry = declarationPiletDefaults.entry,
    target = declarationPiletDefaults.target,
    forceOverwrite = declarationPiletDefaults.forceOverwrite,
    logLevel = declarationPiletDefaults.logLevel,
  } = options;

  ensure('baseDir', baseDir, 'string');
  ensure('entry', entry, 'string');
  ensure('target', target, 'string');

  const entryList = Array.isArray(entry) ? entry : [entry];
  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);

  const allEntries = await matchAnyPilet(fullBase, entryList);
  const results: Array<boolean> = [];

  for (const item of allEntries) {
    const targetDir = dirname(item);
    const { peerDependencies, peerModules, root, apps, importmap } = await retrievePiletData(targetDir);
    const piralInstances = apps.map((m) => m.appPackage.name);
    const externals = combinePiletExternals(piralInstances, peerDependencies, peerModules, importmap);
    const dest = resolve(root, target);
    results.push(await createPiletDeclaration(piralInstances, root, item, externals, dest, forceOverwrite, logLevel));
  }

  if (results.every(Boolean)) {
    logDone(`Declaration created successfully in "${target}"!`);
  }
}
