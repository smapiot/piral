import { dirname } from 'path';
import { runDebug, retrievePiletsInfo, retrievePiralRoot } from '../common';

export interface DebugPiralOptions {
  entry?: string;
  port?: number;
  publicUrl?: string;
  logLevel?: 1 | 2 | 3;
}

export const debugPiralDefaults = {
  entry: './',
  port: 1234,
  publicUrl: '/',
  logLevel: 3 as const,
};

export async function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const {
    entry = debugPiralDefaults.entry,
    port = debugPiralDefaults.port,
    publicUrl = debugPiralDefaults.publicUrl,
    logLevel = debugPiralDefaults.logLevel,
  } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { externals } = await retrievePiletsInfo(entryFiles);
  return runDebug(port, entryFiles, {
    publicUrl,
    logLevel,
    options: {
      target: dirname(entryFiles),
      dependencies: externals,
    },
  });
}
