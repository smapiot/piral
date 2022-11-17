import { resolve } from 'path';
import { setLogLevel, progress, log, checkCliCompatibility } from '../common';
import { LogLevels } from '../types';

export interface RemovePiralInstancePiletOptions {
  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * The name of the Piral instance to remove.
   */
  source?: string;
}

export const removePiralInstancePiletDefaults: RemovePiralInstancePiletOptions = {
  logLevel: LogLevels.info,
  source: undefined,
};

export async function removePiralInstancePilet(baseDir = process.cwd(), options: RemovePiralInstancePiletOptions = {}) {
  const { logLevel = removePiralInstancePiletDefaults.logLevel, source = removePiralInstancePiletDefaults.source } =
    options;
  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);
  progress('Reading configuration ...');
}
