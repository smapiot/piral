import type { PiletBuildHandler, PiletSchemaVersion, SharedDependency } from 'piral-cli';
import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { resolve, join } from 'path';
import { PiletWebpackPlugin } from 'pilet-webpack-plugin';
import { runWebpack } from './bundler-run';
import { getRules, getPlugins, extensions, getVariables } from './common';
import { defaultWebpackConfig } from '../constants';
import { extendConfig } from '../helpers';

async function getConfig(
  template: string,
  dist: string,
  filename: string,
  externals: Array<string>,
  importmap: Array<SharedDependency> = [],
  piral: string,
  schema: PiletSchemaVersion,
  develop = false,
  sourceMaps = true,
  contentHash = true,
  minimize = true,
): Promise<webpack.Configuration> {
  const production = !develop;
  const name = process.env.BUILD_PCKG_NAME;
  const version = process.env.BUILD_PCKG_VERSION;
  const entry = filename.replace(/\.js$/i, '');

  return {
    devtool: sourceMaps ? (develop ? 'cheap-module-source-map' : 'source-map') : false,

    mode: develop ? 'development' : 'production',

    entry: {
      [entry]: [join(__dirname, '..', 'set-path'), template],
    },

    output: {
      publicPath: './',
      path: dist,
      filename: '[name].js',
      chunkFilename: contentHash ? '[chunkhash:8].js' : undefined,
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
            output: {
              comments: /^@pilet/,
            },
            mangle: {
              reserved: ['__bundleUrl__'],
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
    },

    plugins: getPlugins(
      [
        new PiletWebpackPlugin({
          name,
          piral,
          version,
          externals,
          importmap,
          schema,
          variables: getVariables(),
        }),
      ],
      production,
      entry,
    ),
  };
}

const handler: PiletBuildHandler = {
  async create(options) {
    const otherConfigPath = resolve(options.root, defaultWebpackConfig);
    const baseConfig = await getConfig(
      options.entryModule,
      options.outDir,
      options.outFile,
      options.externals,
      options.importmap,
      options.piral,
      options.version,
      options.develop,
      options.sourceMaps,
      options.contentHash,
      options.minify,
    );
    const wpConfig = extendConfig(baseConfig, otherConfigPath, {
      watch: options.watch,
    });

    return runWebpack(wpConfig, options.logLevel);
  },
};

export const create = handler.create;
