import { resolve } from 'path';
import {
  readJson,
  installPackage,
  patchPiletPackage,
  copyPiralFiles,
  ForceOverwrite,
  logInfo,
  logDone,
  logFail,
} from './common';

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
  const pckg = await readJson(root, 'package.json');
  const piralInfo = pckg.piral;

  if (piralInfo) {
    const sourceName = piralInfo.name;
    logInfo(`Updating NPM package to %s ...`, `${sourceName}@${version}`);

    await installPackage(sourceName, version, root, '--no-save', '--no-package-lock');

    logInfo(`Taking care of templating ...`);

    const files = await patchPiletPackage(root, sourceName);
    await copyPiralFiles(root, sourceName, files, forceOverwrite);

    logDone(`All done!`);
  } else {
    logFail('Could not find a "%s" section in the "%s" file. Aborting.', 'piral', 'package.json');
    throw new Error('Invalid pilet.');
  }
}
