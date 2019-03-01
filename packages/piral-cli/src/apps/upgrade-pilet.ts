import { resolve, join } from 'path';
import { readJson } from './common';

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
  const src = join(root, 'src');
  const pckg = readJson(root, 'package.json');
  const piralInfo = pckg.piral;

  if (piralInfo) {
    //TODO
  } else {
    console.error('Could not find a "piral" section in the "package.json" file. Aborting.');
  }
}
