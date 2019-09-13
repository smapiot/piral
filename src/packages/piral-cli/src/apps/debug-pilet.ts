import { join, dirname, relative } from 'path';
import { runDebug, retrievePiletData } from '../common';

export interface DebugPiletOptions {
  entry?: string;
  port?: number;
  app?: string;
  logLevel?: 1 | 2 | 3;
  fresh?: boolean;
}

export const debugPiletDefaults = {
  entry: './src/index',
  port: 1234,
  logLevel: 3 as const,
  fresh: false,
};

export async function debugPilet(baseDir = process.cwd(), options: DebugPiletOptions = {}) {
  const {
    entry = debugPiletDefaults.entry,
    port = debugPiletDefaults.port,
    logLevel = debugPiletDefaults.logLevel,
    fresh = debugPiletDefaults.fresh,
    app,
  } = options;
  const entryFile = join(baseDir, entry);
  const target = dirname(entryFile);
  const { peerDependencies, root, coreFile, appFile, appPackage } = await retrievePiletData(target, app);
  const externals = Object.keys(peerDependencies);

  await runDebug(port, appFile, {
    source: entryFile,
    logLevel,
    fresh,
    root,
    options: {
      target,
      pilet: relative(dirname(coreFile), entryFile),
      piral: appPackage.name,
      dependencies: externals,
    },
  });
}
