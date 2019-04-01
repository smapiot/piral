import { resolve } from 'path';
import { readJson, createPackage } from './common';

export interface PackPiletOptions {
  source?: string;
}

export const packPiletDefaults = {
  source: '.',
};

export async function packPilet(baseDir = process.cwd(), options: PackPiletOptions = {}) {
  const { source = packPiletDefaults.source } = options;
  const root = resolve(baseDir, source);
  const pckg = readJson(root, 'package.json');

  await createPackage(root);
  //TODO
}
