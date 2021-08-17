import * as TerserPlugin from 'terser-webpack-plugin';
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { PiletSchemaVersion } from 'piral-cli';
import { getRules, getPlugins, extensions, getVariables, DefaultConfiguration } from './common';
import { piletWebpackConfigEnhancer } from '../enhancers/pilet-webpack-config-enhancer';

export async function getPiletConfig(
  template: string,
  dist: string,
  filename: string,
  externals: Array<string>,
  piral: string,
  schema: PiletSchemaVersion,
  develop = false,
  sourceMaps = true,
  contentHash = true,
  minimize = true,
  publicPath = '/',
  progress = false,
): Promise<DefaultConfiguration> {
  const production = !develop;
  const name = process.env.BUILD_PCKG_NAME;
  const version = process.env.BUILD_PCKG_VERSION;

  const enhance = piletWebpackConfigEnhancer({
    name,
    piral,
    version,
    externals,
    schema,
    variables: getVariables(),
  });

  return [
    {
      devtool: sourceMaps ? (develop ? 'cheap-module-source-map' : 'source-map') : false,

      mode: develop ? 'development' : 'production',

      entry: {
        main: [template],
      },

      output: {
        publicPath,
        path: dist,
        filename,
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

      plugins: getPlugins([], progress, production, true),
    },
    enhance,
  ];
}
