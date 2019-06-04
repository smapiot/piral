import { join, dirname } from 'path';
import { runDebug } from './common';

export interface DebugPiralOptions {
  entry?: string;
  port?: number;
}

export const debugPiralDefaults = {
  entry: './src/index.html',
  port: 1234,
};

export function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const { entry = debugPiralDefaults.entry, port = debugPiralDefaults.port } = options;
  const entryFiles = join(baseDir, entry);
  return runDebug(port, entryFiles, {
    target: dirname(entry),
  });
}
