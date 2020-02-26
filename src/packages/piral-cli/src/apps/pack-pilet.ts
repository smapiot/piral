import { createPiletPackage, logDone, LogLevels, setLogLevel } from '../common';

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
  const {
    source = packPiletDefaults.source,
    target = packPiletDefaults.target,
    logLevel = packPiletDefaults.logLevel,
  } = options;
  setLogLevel(logLevel);
  await createPiletPackage(baseDir, source, target);
  logDone(`All done!`);
}
