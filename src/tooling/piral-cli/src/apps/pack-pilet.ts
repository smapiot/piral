import { resolve } from 'path';
import { createPiletPackage, logDone, setLogLevel, progress, ensure } from '../common';
import { LogLevels } from '../types';

export interface PackPiletOptions {
  /**
   * Sets the source directory for creating the npm package.
   */
  source?: string;

  /**
   * Sets the target directory for storing the tarball.
   */
  target?: string;

  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;
}

export const packPiletDefaults: PackPiletOptions = {
  source: '.',
  target: '.',
  logLevel: LogLevels.info,
};

export async function packPilet(baseDir = process.cwd(), options: PackPiletOptions = {}) {
  const {
    source = packPiletDefaults.source,
    target = packPiletDefaults.target,
    logLevel = packPiletDefaults.logLevel,
  } = options;

  ensure('baseDir', baseDir, 'string');
  ensure('source', source, 'string');
  ensure('target', target, 'string');

  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  await createPiletPackage(fullBase, source, target);
  logDone(`Pilet packed successfully!`);
}
