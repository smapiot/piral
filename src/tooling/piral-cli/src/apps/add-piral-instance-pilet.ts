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
  readPiralPackage,
  checkAppShellPackage,
  ForceOverwrite,
  copyPiralFiles,
  config,
  getCertificate,
  getAgent,
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
   * Defines a custom certificate for the website emulator.
   */
  cert?: string;

  /**
   * Allow self-signed certificates.
   */
  allowSelfSigned?: boolean;

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
  cert: undefined,
  allowSelfSigned: config.allowSelfSigned,
};

export async function addPiralInstancePilet(baseDir = process.cwd(), options: AddPiralInstancePiletOptions = {}) {
  const {
    npmClient: defaultNpmClient = addPiralInstancePiletDefaults.npmClient,
    logLevel = addPiralInstancePiletDefaults.logLevel,
    source = addPiralInstancePiletDefaults.source,
    selected = addPiralInstancePiletDefaults.selected,
    app = addPiralInstancePiletDefaults.app,
    cert = addPiralInstancePiletDefaults.cert,
    allowSelfSigned = addPiralInstancePiletDefaults.allowSelfSigned,
  } = options;

  ensure('baseDir', baseDir, 'string');
  ensure('source', source, 'string');

  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);
  progress('Reading configuration ...');

  const npmClient = await determineNpmClient(fullBase, defaultNpmClient);
  const allEntries = await matchAnyPilet(fullBase, [source]);
  const ca = await getCertificate(cert);
  const agent = getAgent({ ca, allowSelfSigned });

  const tasks = allEntries.map(async (entryModule) => {
    const targetDir = dirname(entryModule);
    const piletJsonPath = await findFile(targetDir, piletJson);

    if (piletJsonPath) {
      const piletJsonDir = dirname(piletJsonPath);
      const root = await findPiletRoot(piletJsonDir);
      const packageName = await installPiralInstance(app, fullBase, root, npmClient, agent, selected);
      const piralInfo = await readPiralPackage(root, packageName);
      const isEmulator = checkAppShellPackage(piralInfo);

      if (isEmulator) {
        // in the emulator case we get the files (and files_once) from the contained tarballs
        await copyPiralFiles(root, packageName, piralInfo, ForceOverwrite.yes, {});
      }
    } else {
      log('piletJsonNotAvailable_0180', targetDir);
    }
  });

  await Promise.all(tasks);
  logDone(`Added the Piral instance!`);
}
