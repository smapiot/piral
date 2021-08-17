import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { getRules, getPlugins, extensions, getVariables, DefaultConfiguration } from './common';
import { html5EntryWebpackConfigEnhancer } from '../enhancers/html5-entry-webpack-config-enhancer';
import { piralInstanceWebpackConfigEnhancer } from '../enhancers/piral-instance-webpack-config-enhancer';
import { hmrWebpackConfigEnhancer } from '../enhancers/hmr-webpack-config-enhancer';

export async function getPiralConfig(
  template: string,
  dist: string,
  externals: Array<string>,
  develop = false,
  sourceMaps = true,
  contentHash = true,
  minimize = true,
  publicPath = '/',
  hmr = 0,
  progress = false,
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

      plugins: getPlugins([], progress, production, false),
    },
    enhance,
  ];
}
