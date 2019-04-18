import { resolve } from 'path';
import { readJson, createPackage } from './common';

export interface PackPiletOptions {
  source?: string;
  target?: string;
}

export const packPiletDefaults = {
  source: '.',
  target: '.',
};

export async function packPilet(baseDir = process.cwd(), options: PackPiletOptions = {}) {
  const { source = packPiletDefaults.source, target = packPiletDefaults.target } = options;
  const root = resolve(baseDir, source);
  const pckg = await readJson(root, 'package.json');

  if (!pckg) {
    return console.error('No valid package.json found.');
  }

  await createPackage(target, baseDir);
}
