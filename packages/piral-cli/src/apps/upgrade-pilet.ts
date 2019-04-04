import { resolve } from 'path';
import { readJson, installPackage, patchPiletPackage, copyPiralFiles, ForceOverwrite } from './common';

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
    const sourceVersion = version;
    console.log(`Updating NPM package to ${sourceName}@${sourceVersion} ...`);

    await installPackage(sourceName, sourceVersion, root, '--no-save', '--no-package-lock');

    console.log(`Taking care of templating ...`);

    const files = await patchPiletPackage(root, sourceName);
    await copyPiralFiles(root, sourceName, files, forceOverwrite);

    console.log(`All done!`);
  } else {
    console.error('Could not find a "piral" section in the "package.json" file. Aborting.');
  }
}
