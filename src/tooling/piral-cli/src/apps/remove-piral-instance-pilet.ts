import { dirname, resolve } from 'path';
import { LogLevels, NpmClientType } from '../types';
import {
  setLogLevel,
  progress,
  log,
  matchAnyPilet,
  findFile,
  readJson,
  writeJson,
  logDone,
  findPiletRoot,
  determineNpmClient,
  uninstallNpmPackage,
  piletJson,
  ensure,
} from '../common';

export interface RemovePiralInstancePiletOptions {
  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * The name of the Piral instance to remove.
   */
  app?: string;

  /**
   * Sets the source directory for adding the Piral instance.
   */
  source?: string;

  /**
   * The npm client to be used when scaffolding.
   * @example 'yarn'
   */
  npmClient?: NpmClientType;
}

export const removePiralInstancePiletDefaults: RemovePiralInstancePiletOptions = {
  logLevel: LogLevels.info,
  app: undefined,
  source: '.',
  npmClient: undefined,
};

export async function removePiralInstancePilet(baseDir = process.cwd(), options: RemovePiralInstancePiletOptions = {}) {
  const {
    npmClient: defaultNpmClient = removePiralInstancePiletDefaults.npmClient,
    logLevel = removePiralInstancePiletDefaults.logLevel,
    source = removePiralInstancePiletDefaults.source,
    app = removePiralInstancePiletDefaults.app,
  } = options;

  ensure('baseDir', baseDir, 'string');
  ensure('source', source, 'string');
  ensure('app', app, 'string');

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
      const oldContent = await readJson(piletJsonDir, piletJson);
      const root = await findPiletRoot(piletJsonDir);

      if ('piralInstances' in oldContent && app in oldContent.piralInstances) {
        const newContent = {
          ...oldContent,
          piralInstances: {
            ...oldContent.piralInstances,
            [app]: undefined,
          },
        };

        await writeJson(piletJsonDir, piletJson, newContent, true);
      }

      await uninstallNpmPackage(npmClient, app, root);
    } else {
      log('piletJsonNotAvailable_0180', targetDir);
    }
  });

  await Promise.all(tasks);

  logDone(`Removed the Piral instance!`);
}
