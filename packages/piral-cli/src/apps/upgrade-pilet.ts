import { resolve } from 'path';
import { readJson, installPackage, patchPiletPackage, copyPiralFiles } from './common';

export interface UpgradePiletOptions {
  version?: string;
  target?: string;
}

export const upgradePiletDefaults = {
  version: 'latest',
  target: '.',
};

export async function upgradePilet(baseDir = process.cwd(), options: UpgradePiletOptions = {}) {
  const { version = upgradePiletDefaults.version, target = upgradePiletDefaults.target } = options;
  const root = resolve(baseDir, target);
  const pckg = readJson(root, 'package.json');
  const piralInfo = pckg.piral;

  if (piralInfo) {
    const sourceName = piralInfo.name;
    const sourceVersion = version;
    console.log(`Updating NPM package to ${sourceName}@${sourceVersion} ...`);

    await installPackage(sourceName, sourceVersion, root, '--no-save', '--no-package-lock');

    console.log(`Taking care of templating ...`);

    const files = patchPiletPackage(root, sourceName);
    copyPiralFiles(root, sourceName, files);

    console.log(`All done!`);
  } else {
    console.error('Could not find a "piral" section in the "package.json" file. Aborting.');
  }
}
