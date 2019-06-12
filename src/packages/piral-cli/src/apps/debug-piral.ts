import { join, dirname } from 'path';
import { runDebug } from './common';

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

export function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const {
    entry = debugPiralDefaults.entry,
    port = debugPiralDefaults.port,
    publicUrl = debugPiralDefaults.publicUrl,
  } = options;
  const entryFiles = join(baseDir, entry);
  return runDebug(port, entryFiles, publicUrl, {
    target: dirname(entry),
  });
}
