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
  app?: string;

  /**
   * Sets the source directory for adding the Piral instance.
   */
  source?: string;

  /**
   * Defines if the provided Piral instance should be selected initially.
   */
  selected?: boolean;
}

export const addPiralInstancePiletDefaults: AddPiralInstancePiletOptions = {
  logLevel: LogLevels.info,
  app: undefined,
  source: '.',
  selected: false,
};

export async function addPiralInstancePilet(baseDir = process.cwd(), options: AddPiralInstancePiletOptions = {}) {
  const {
    logLevel = addPiralInstancePiletDefaults.logLevel,
    source = addPiralInstancePiletDefaults.source,
    selected = addPiralInstancePiletDefaults.selected,
    app = addPiralInstancePiletDefaults.app,
  } = options;
  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);
  progress('Reading configuration ...');


}
