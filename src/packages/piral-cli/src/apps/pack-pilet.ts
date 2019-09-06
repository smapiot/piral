import { createPiletPackage, logDone } from '../common';

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
  await createPiletPackage(baseDir, source, target);
  logDone(`All done!`);
}
