import { BuildOptions } from 'esbuild';
import { basename, extname } from 'path';
import { piletPlugin } from '../plugins/pilet';
import type { PiletSchemaVersion, SharedDependency } from 'piral-cli';
import { createCommonConfig } from './common';

function nameOf(path: string) {
  const file = basename(path);
  const ext = extname(file);
  return file.substr(0, file.length - ext.length);
}

export function createConfig(
  entryModule: string,
  outdir: string,
  filename: string,
  externals: Array<string>,
  importmap: Array<SharedDependency> = [],
  schema: PiletSchemaVersion,
  development = false,
  sourcemap = true,
  contentHash = true,
  minify = true,
): BuildOptions {
  if (schema !== 'v2') {
    throw new Error('The provided schema version is not supported. Only "v2" works with esbuild.');
  }

  const config = createCommonConfig(outdir, development, sourcemap, contentHash, minify);
  const deps = JSON.stringify(
    importmap.reduce((obj, dep) => {
      obj[dep.id] = dep.ref;
      return obj;
    }, {}),
  );
  const external = [...externals, ...importmap.map((m) => m.name)];
  const name = nameOf(filename);
  const entryPoints = {
    [name]: entryModule,
  };

  return {
    ...config,
    entryPoints,
    publicPath: './',
    splitting: true,
    external,
    format: 'esm',
    plugins: [...config.plugins, piletPlugin({ deps })],
  };
}
