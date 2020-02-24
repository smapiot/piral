import { createPiletPackage, logDone, LogLevels } from '../common';

export interface PackPiletOptions {
  source?: string;
  target?: string;
  logLevel?: LogLevels;
}

export const packPiletDefaults: PackPiletOptions = {
  source: '.',
  target: '.',
  logLevel: LogLevels.info,
};

export async function packPilet(baseDir = process.cwd(), options: PackPiletOptions = {}) {
  const { source = packPiletDefaults.source, target = packPiletDefaults.target } = options;
  await createPiletPackage(baseDir, source, target);
  logDone(`All done!`);
}
