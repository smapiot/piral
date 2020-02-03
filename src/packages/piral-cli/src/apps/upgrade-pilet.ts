import { resolve } from 'path';
import {
  readJson,
  installPackage,
  checkExistingDirectory,
  patchPiletPackage,
  copyPiralFiles,
  ForceOverwrite,
  logInfo,
  getFileStats,
  readPiralPackage,
  getPiletsInfo,
  runScript,
  installDependencies,
  getCurrentPackageDetails,
  checkAppShellPackage,
  defaultCacheDir,
  removeDirectory,
  createContextLogger,
} from '../common';

export interface UpgradePiletOptions {
  version?: string;
  target?: string;
  forceOverwrite?: ForceOverwrite;
}

export const upgradePiletDefaults = {
  version: undefined,
  target: '.',
  forceOverwrite: ForceOverwrite.no,
};

export async function upgradePilet(baseDir = process.cwd(), options: UpgradePiletOptions = {}) {
  const {
    version = upgradePiletDefaults.version,
    target = upgradePiletDefaults.target,
    forceOverwrite = upgradePiletDefaults.forceOverwrite,
  } = options;
  const root = resolve(baseDir, target);
  const cache = resolve(root, defaultCacheDir);
  const valid = await checkExistingDirectory(root);

  if (!valid) {
    throw new Error('The provided target is not a valid. It must be a directory containing a package.json.');
  }

  const pckg = await readJson(root, 'package.json');
  const { devDependencies = {}, piral } = pckg;

  if (piral && typeof piral === 'object') {
    const logger = createContextLogger();
    const sourceName = piral.name;

    if (!sourceName || typeof sourceName !== 'string') {
      throw new Error(`Missing "name" <string> in the "piral" section of the "package.json" file. Aborting.`);
    }

    const currentVersion = devDependencies[sourceName];

    if (!currentVersion || typeof currentVersion !== 'string') {
      throw new Error(`Invalid reference to the Piral instance in the "package.json" file. Aborting.`);
    }

    const [packageRef, packageVersion] = await getCurrentPackageDetails(baseDir, sourceName, currentVersion, version);
    const originalFiles = await getFileStats(root, sourceName);

    logInfo(`Updating NPM package to %s ...`, packageRef);

    await installPackage(packageRef, root, '--no-save', '--no-package-lock');

    const piralInfo = await readPiralPackage(root, sourceName);

    checkAppShellPackage(piralInfo);

    const { preUpgrade, postUpgrade } = getPiletsInfo(piralInfo);

    if (preUpgrade) {
      logInfo(`Running preUpgrade script ...`);
      await runScript(preUpgrade, root);
    }

    logInfo(`Taking care of templating ...`);

    await patchPiletPackage(root, sourceName, packageVersion, piralInfo);
    await copyPiralFiles(root, sourceName, forceOverwrite, originalFiles, logger.notify);

    logInfo(`Updating dependencies ...`);
    await installDependencies(root, '--no-package-lock');

    if (postUpgrade) {
      logInfo(`Running postUpgrade script ...`);
      await runScript(postUpgrade, root);
    }

    await removeDirectory(cache);
    logger.summary();
    logger.throwIfError();
  } else {
    throw new Error(`Could not find a "piral" section in the "package.json" file. Aborting.`);
  }
}
