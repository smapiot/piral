import { resolve } from 'path';
import { createPiletPackage, logDone, setLogLevel, progress } from '../common';
import { LogLevels } from '../types';

export interface PackPiletOptions {
  source?: string;
  target?: string;
  logLevel?: LogLevels;
}

export const packPiletDefaults: PackPiletOptions = {
  /**
   * Sets the source directory for creating the npm package.
   */
  source: '.',

  /**
   * Sets the target directory for storing the tarball.
   */
  target: '.',

  /**
   * Sets the log level to use (1-5).
   */
  logLevel: LogLevels.info,
};

export async function packPilet(baseDir = process.cwd(), options: PackPiletOptions = {}) {
  const {
    source = packPiletDefaults.source,
    target = packPiletDefaults.target,
    logLevel = packPiletDefaults.logLevel,
  } = options;
  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  await createPiletPackage(fullBase, source, target);
  logDone(`Pilet packed successfully!`);
}
