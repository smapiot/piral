import type { PiletBuildHandler, PiletSchemaVersion, SharedDependency } from 'piral-cli';
import { BuildOptions } from 'esbuild';
import { basename, extname } from 'path';
import { createCommonConfig } from './common';
import { runEsbuild } from './bundler-run';
import { piletPlugin } from '../plugins/pilet';
import { extendConfig } from '../helpers';

function nameOf(path: string) {
  const file = basename(path);
  const ext = extname(file);
  return file.substr(0, file.length - ext.length);
}

function createConfig(
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
  const name = nameOf(filename);
  const external = [...externals, ...importmap.map((m) => m.name)];
  const entryPoints = {
    [name]: entryModule,
  };
  importmap.forEach((dep) => {
    entryPoints[nameOf(dep.ref)] = dep.entry;
  });

  return {
    ...config,
    entryPoints,
    publicPath: './',
    splitting: true,
    external,
    format: 'esm',
    plugins: [...config.plugins, piletPlugin({ importmap })],
  };
}

const handler: PiletBuildHandler = {
  create(options) {
    const baseConfig = createConfig(
      options.entryModule,
      options.outDir,
      options.outFile,
      options.externals,
      options.importmap,
      options.version,
      options.develop,
      options.sourceMaps,
      options.contentHash,
      options.minify,
    );
    const config = extendConfig(baseConfig, options.root);
    return runEsbuild(config, options.logLevel, options.watch);
  },
};

export const create = handler.create;
