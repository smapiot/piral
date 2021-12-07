import type { PiralBuildHandler } from 'piral-cli';
import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { getFreePort } from 'piral-cli/utils';
import { resolve } from 'path';
import { runWebpack } from './bundler-run';
import { getRules, getPlugins, extensions, getVariables, DefaultConfiguration } from './common';
import { html5EntryWebpackConfigEnhancer } from '../enhancers/html5-entry-webpack-config-enhancer';
import { piralInstanceWebpackConfigEnhancer } from '../enhancers/piral-instance-webpack-config-enhancer';
import { hmrWebpackConfigEnhancer } from '../enhancers/hmr-webpack-config-enhancer';
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
): Promise<DefaultConfiguration> {
  const production = !develop;
  const name = process.env.BUILD_PCKG_NAME;
  const version = process.env.BUILD_PCKG_VERSION;

  const enhance = (options: webpack.Configuration) =>
    [
      hmrWebpackConfigEnhancer({ port: hmr }),
      html5EntryWebpackConfigEnhancer({}),
      piralInstanceWebpackConfigEnhancer({
        name,
        version,
        externals,
        variables: getVariables(),
      }),
    ].reduceRight((acc, val) => val(acc), options);

  return [
    {
      devtool: sourceMaps ? (develop ? 'cheap-module-source-map' : 'source-map') : false,

      mode: develop ? 'development' : 'production',

      entry: [template],

      output: {
        publicPath,
        path: dist,
        filename: `index.${contentHash ? '[contenthash:6].' : ''}js`,
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

      plugins: getPlugins([], production, false),
    },
    enhance,
  ];
}

const handler: PiralBuildHandler = {
  async create(options) {
    const otherConfigPath = resolve(options.root, defaultWebpackConfig);
    const hmrPort = options.hmr ? await getFreePort(62123) : 0;
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
