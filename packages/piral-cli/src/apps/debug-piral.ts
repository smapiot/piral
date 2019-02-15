import * as Bundler from 'parcel-bundler';
import { join } from 'path';
import { extendConfig } from './common';

export interface DebugPiralOptions {
  entry?: string;
  port?: number;
}

export function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const { entry = './src/index.html', port = 1234 } = options;
  const entryFiles = join(baseDir, entry);

  (async function() {
    const bundler = new Bundler(entryFiles, extendConfig({}));

    await (bundler as any).serve(port);
  })();
}
