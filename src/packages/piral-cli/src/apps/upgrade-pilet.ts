import { resolve } from 'path';
import {
  readJson,
  installPackage,
  checkExistingDirectory,
  patchPiletPackage,
  copyPiralFiles,
  ForceOverwrite,
  logInfo,
  logDone,
  getFileStats,
  readPiralPackage,
  getPiletsInfo,
  runScript,
  installDependencies,
  clearCache,
  getCurrentPackageDetails,
} from '../common';

export interface UpgradePiletOptions {
  version?: string;
  target?: string;
  forceOverwrite?: ForceOverwrite;
}

export const upgradePiletDefaults = {
  version: 'latest',
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
  const valid = await checkExistingDirectory(root);

  if (!valid) {
    throw new Error('The provided target is not a valid. It must be a directory containing a package.json.');
  }

  const pckg = await readJson(root, 'package.json');
  const { devDependencies = {}, piral } = pckg;

  if (piral) {
    const sourceName = piral.name;
    const currentVersion = devDependencies[sourceName];
    const [packageRef, packageVersion] = await getCurrentPackageDetails(baseDir, sourceName, currentVersion, version);
    const originalFiles = await getFileStats(root, sourceName, piral.files);
    const piralInfo = await readPiralPackage(root, sourceName);
    const { preUpgrade, postUpgrade } = getPiletsInfo(piralInfo);

    if (preUpgrade) {
      await runScript(preUpgrade, root);
    }

    logInfo(`Updating NPM package to %s ...`, packageRef);

    await installPackage(packageRef, root, '--no-save', '--no-package-lock');

    logInfo(`Taking care of templating ...`);

    const files = await patchPiletPackage(root, sourceName, packageVersion, piralInfo);
    await copyPiralFiles(root, sourceName, files, forceOverwrite, originalFiles);

    logInfo(`Updating dependencies ...`);

    await installDependencies(root, '--no-package-lock');

    if (postUpgrade) {
      await runScript(postUpgrade, root);
    }

    await clearCache(root);
    logDone(`All done!`);
  } else {
    throw new Error(`Could not find a "piral" section in the "package.json" file. Aborting.`);
  }
}
