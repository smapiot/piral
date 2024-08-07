import { dirname, resolve } from 'path';
import { LogLevels, NpmClientType } from '../types';
import {
  setLogLevel,
  progress,
  log,
  matchAnyPilet,
  findFile,
  logDone,
  installPiralInstance,
  determineNpmClient,
  findPiletRoot,
  piletJson,
  ensure,
} from '../common';

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

  /**
   * The npm client to be used when scaffolding.
   * @example 'yarn'
   */
  npmClient?: NpmClientType;
}

export const addPiralInstancePiletDefaults: AddPiralInstancePiletOptions = {
  logLevel: LogLevels.info,
  app: undefined,
  source: '.',
  selected: false,
  npmClient: undefined,
};

export async function addPiralInstancePilet(baseDir = process.cwd(), options: AddPiralInstancePiletOptions = {}) {
  const {
    npmClient: defaultNpmClient = addPiralInstancePiletDefaults.npmClient,
    logLevel = addPiralInstancePiletDefaults.logLevel,
    source = addPiralInstancePiletDefaults.source,
    selected = addPiralInstancePiletDefaults.selected,
    app = addPiralInstancePiletDefaults.app,
  } = options;

  ensure('baseDir', baseDir, 'string');
  ensure('source', source, 'string');

  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);
  progress('Reading configuration ...');

  const npmClient = await determineNpmClient(fullBase, defaultNpmClient);
  const allEntries = await matchAnyPilet(fullBase, [source]);

  const tasks = allEntries.map(async (entryModule) => {
    const targetDir = dirname(entryModule);
    const piletJsonPath = await findFile(targetDir, piletJson);

    if (piletJsonPath) {
      const piletJsonDir = dirname(piletJsonPath);
      const root = await findPiletRoot(piletJsonDir);
      await installPiralInstance(app, fullBase, root, npmClient, selected);
    } else {
      log('piletJsonNotAvailable_0180', targetDir);
    }
  });

  await Promise.all(tasks);
  logDone(`Added the Piral instance!`);
}
