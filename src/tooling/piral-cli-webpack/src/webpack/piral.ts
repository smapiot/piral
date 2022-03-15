import type { PiralBuildHandler } from 'piral-cli';
import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { Html5EntryWebpackPlugin } from 'html5-entry-webpack-plugin';
import { PiralInstanceWebpackPlugin } from 'piral-instance-webpack-plugin';
import { resolve } from 'path';
import { getFreePort } from 'piral-cli/utils';
import { getRules, getPlugins, extensions, getVariables, getHmrEntry } from './common';
import { runWebpack } from './bundler-run';
import { defaultWebpackConfig } from '../constants';
import { extendConfig } from '../helpers';

async function getConfig(
  template: string,
  dist: string,
  externals: Array<string>,
  develop = false,
  sourceMaps = true,
  contentHash = true,
  minimize = true,
  publicPath = '/',
  hmr = 0,
): Promise<webpack.Configuration> {
  const production = !develop;
  const name = process.env.BUILD_PCKG_NAME;
  const version = process.env.BUILD_PCKG_VERSION;

  return {
    devtool: sourceMaps ? (develop ? 'cheap-module-source-map' : 'source-map') : false,

    mode: develop ? 'development' : 'production',

    entry: {
      main: [...getHmrEntry(hmr), template],
    },

    output: {
      publicPath,
      path: dist,
      filename: `index.${contentHash ? '[hash:6].' : ''}js`,
      chunkFilename: contentHash ? '[chunkhash:6].js' : undefined,
    },

    resolve: {
      extensions,
    },

    module: {
      rules: getRules(production),
    },

    optimization: {
      minimize,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            ie8: true,
          },
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
    },

    plugins: getPlugins(
      [
        new Html5EntryWebpackPlugin(),
        new PiralInstanceWebpackPlugin({
          name,
          version,
          externals,
          variables: getVariables(),
        }),
      ],
      production,
      undefined,
      hmr,
    ),
  };
}

const handler: PiralBuildHandler = {
  async create(options) {
    const hmrPort = options.hmr ? await getFreePort(62123) : 0;
    const otherConfigPath = resolve(options.root, defaultWebpackConfig);
    const baseConfig = await getConfig(
      options.entryFiles,
      options.outDir,
      options.externals,
      options.emulator,
      options.sourceMaps,
      options.contentHash,
      options.minify,
      options.publicUrl,
      hmrPort,
    );
    const wpConfig = extendConfig(baseConfig, otherConfigPath, {
      watch: options.watch,
    });

    return runWebpack(wpConfig, options.logLevel);
  },
};

export const create = handler.create;
