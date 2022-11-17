import { resolve } from 'path';
import { setLogLevel, progress, log, checkCliCompatibility } from '../common';
import { LogLevels } from '../types';

export interface AddPiralInstancePiletOptions {
  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * The name of the Piral instance to add.
   */
  source?: string;

  /**
   * Defines if the provided Piral instance should be selected initially.
   */
  selected?: boolean;
}

export const addPiralInstancePiletDefaults: AddPiralInstancePiletOptions = {
  logLevel: LogLevels.info,
  source: undefined,
  selected: false,
};

export async function addPiralInstancePilet(baseDir = process.cwd(), options: AddPiralInstancePiletOptions = {}) {
  const {
    logLevel = addPiralInstancePiletDefaults.logLevel,
    selected = addPiralInstancePiletDefaults.selected,
    source = addPiralInstancePiletDefaults.source,
  } = options;
  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);
  progress('Reading configuration ...');
}
