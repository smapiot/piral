import type { PiletBuildHandler } from 'piral-cli';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import type { PiletSchemaVersion, SharedDependency } from 'piral-cli';
import { getRules, getPlugins, extensions, getVariables, DefaultConfiguration } from './common';
import { piletWebpackConfigEnhancer } from '../enhancers/pilet-webpack-config-enhancer';
import { resolve } from 'path';
import { runWebpack } from './bundler-run';
import { defaultWebpackConfig } from '../constants';
import { extendConfig } from '../helpers';

async function getConfig(
  template: string,
  dist: string,
  filename: string,
  externals: Array<string>,
  importmap: Array<SharedDependency> = [],
  piralInstances: Array<string>,
  schema: PiletSchemaVersion,
  develop = false,
  sourceMaps = true,
  contentHash = true,
  minimize = true,
): Promise<DefaultConfiguration> {
  const production = !develop;
  const name = process.env.BUILD_PCKG_NAME;
  const version = process.env.BUILD_PCKG_VERSION;
  const entry = filename.replace(/\.js$/i, '');

  const enhance = piletWebpackConfigEnhancer({
    name,
    piralInstances,
    version,
    entry,
    externals,
    importmap,
    schema,
    filename,
    variables: getVariables(),
  });

  return [
    {
      devtool: sourceMaps ? (develop ? 'cheap-module-source-map' : 'source-map') : false,

      mode: develop ? 'development' : 'production',

      target: 'web',

      entry: {
        [entry]: [template],
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
          new CssMinimizerPlugin(),
        ],
      },

      plugins: getPlugins([], production, entry),
    },
    enhance,
  ];
}

const handler: PiletBuildHandler = {
  async create(options) {
    const { config = defaultWebpackConfig } = options.args._;
    const otherConfigPath = resolve(options.root, config);
    const baseConfig = await getConfig(
      options.entryModule,
      options.outDir,
      options.outFile,
      options.externals,
      options.importmap,
      options.piralInstances,
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
