import type { PiralBuildHandler } from 'piral-cli';
import { BuildOptions } from 'esbuild';
import { createCommonConfig } from './common';
import { runEsbuild } from './bundler-run';
import { htmlPlugin } from '../plugins/html';
import { extendConfig } from '../helpers';

function createConfig(
  entryFile: string,
  outdir: string,
  externals: Array<string>,
  development: boolean,
  sourcemap: boolean,
  contentHash: boolean,
  minify: boolean,
  publicPath: string,
  hmr = false,
): BuildOptions {
  const config = createCommonConfig(outdir, development, sourcemap, contentHash, minify);

  if (hmr) {
    config.banner = {
      js: `(() => new WebSocket(location.origin.replace('http', 'ws')+"/$events").onmessage = () => location.reload())();`,
    };
  }

  return {
    ...config,
    entryPoints: [entryFile],
    publicPath,
    define: {
      ...config.define,
      'process.env.DEBUG_PIRAL': JSON.stringify(process.env.DEBUG_PIRAL || ''),
      'process.env.DEBUG_PILET': JSON.stringify(process.env.DEBUG_PILET || ''),
      'process.env.SHARED_DEPENDENCIES': JSON.stringify(externals.join(',')),
    },
    plugins: [...config.plugins, htmlPlugin()],
  };
}

const handler: PiralBuildHandler = {
  create(options) {
    const baseConfig = createConfig(
      options.entryFiles,
      options.outDir,
      options.externals,
      options.emulator,
      options.sourceMaps,
      options.contentHash,
      options.minify,
      options.publicUrl,
      options.hmr,
    );
    const config = extendConfig(baseConfig, options.root);
    return runEsbuild(config, options.logLevel, options.watch);
  },
};

export const create = handler.create;
