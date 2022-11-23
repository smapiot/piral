import { dirname, resolve } from 'path';
import { setLogLevel, progress, log, matchAnyPilet, findFile, readJson, writeJson, logDone, findPiletRoot } from '../common';
import { LogLevels } from '../types';

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
}

export const removePiralInstancePiletDefaults: RemovePiralInstancePiletOptions = {
  logLevel: LogLevels.info,
  app: undefined,
  source: '.',
};

export async function removePiralInstancePilet(baseDir = process.cwd(), options: RemovePiralInstancePiletOptions = {}) {
  const {
    logLevel = removePiralInstancePiletDefaults.logLevel,
    source = removePiralInstancePiletDefaults.source,
    app = removePiralInstancePiletDefaults.app,
  } = options;
  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);
  progress('Reading configuration ...');

  const allEntries = await matchAnyPilet(fullBase, [source]);

  const tasks = allEntries.map(async (entryModule) => {
    const targetDir = dirname(entryModule);
    const piletJson = 'pilet.json';
    const packageJson = 'package.json';
    const piletJsonPath = await findFile(targetDir, piletJson);

    if (piletJsonPath) {
      const piletJsonDir = dirname(piletJsonPath);
      const oldContent = await readJson(piletJsonDir, piletJson);
      const root = await findPiletRoot(piletJsonDir);
      const packageData = await readJson(root, packageJson);

      if ('dependencies' in packageData && app in packageData.dependencies) {
        packageData.dependencies[app] = undefined;
      }

      if ('devDependencies' in packageData && app in packageData.devDependencies) {
        packageData.devDependencies[app] = undefined;
      }

      if ('peerDependencies' in packageData && app in packageData.peerDependencies) {
        packageData.peerDependencies[app] = undefined;
      }

      await writeJson(root, packageJson, packageData, true);

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
    } else {
      log('piletJsonNotAvailable_0180', targetDir);
    }
  });

  await Promise.all(tasks);

  logDone(`Removed the Piral instance!`);
}
