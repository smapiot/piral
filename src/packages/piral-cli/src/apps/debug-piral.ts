import { dirname } from 'path';
import { runDebug, retrievePiletsInfo, retrievePiralRoot } from '../common';

export interface DebugPiralOptions {
  entry?: string;
  port?: number;
  publicUrl?: string;
  logLevel?: 1 | 2 | 3;
  fresh?: boolean;
}

export const debugPiralDefaults = {
  entry: './',
  port: 1234,
  publicUrl: '/',
  logLevel: 3 as const,
  fresh: false,
};

export async function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const {
    entry = debugPiralDefaults.entry,
    port = debugPiralDefaults.port,
    publicUrl = debugPiralDefaults.publicUrl,
    logLevel = debugPiralDefaults.logLevel,
    fresh = debugPiralDefaults.fresh,
  } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { externals, name, root } = await retrievePiletsInfo(entryFiles);

  await runDebug(port, entryFiles, {
    publicUrl,
    logLevel,
    fresh,
    root,
    options: {
      target: dirname(entryFiles),
      dependencies: externals,
      piral: name,
    },
  });
}
