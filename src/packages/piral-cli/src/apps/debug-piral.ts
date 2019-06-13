import { join, dirname } from 'path';
import { runDebug, retrievePiletsInfo } from './common';

export interface DebugPiralOptions {
  entry?: string;
  port?: number;
  publicUrl?: string;
}

export const debugPiralDefaults = {
  entry: './src/index.html',
  port: 1234,
  publicUrl: '/',
};

export async function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const {
    entry = debugPiralDefaults.entry,
    port = debugPiralDefaults.port,
    publicUrl = debugPiralDefaults.publicUrl,
  } = options;
  const entryFiles = join(baseDir, entry);
  const { externals } = await retrievePiletsInfo(entryFiles);
  return runDebug(port, entryFiles, {
    publicUrl,
    options: {
      target: dirname(entry),
      dependencies: externals,
    },
  });
}
