import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { html5EntryWebpackConfigEnhancer } from '../enhancers/html5-entry-webpack-config-enhancer';
import { piralInstanceWebpackConfigEnhancer } from '../enhancers/piral-instance-webpack-config-enhancer';
import { getRules, getPlugins, extensions, getVariables, getHmrEntry } from './common';

export async function getPiralConfig(
  baseDir: string,
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
): Promise<webpack.Configuration> {
  const production = !develop;
  const name = process.env.BUILD_PCKG_NAME;
  const version = process.env.BUILD_PCKG_VERSION;

  const enhance = (options) =>
    [
      html5EntryWebpackConfigEnhancer({}),
      piralInstanceWebpackConfigEnhancer({
        name,
        version,
        externals,
        variables: getVariables(),
      }),
    ].reduceRight((acc, val) => val(acc), options);

  return enhance({
    devtool: sourceMaps ? (develop ? 'cheap-module-source-map' : 'source-map') : false,

    mode: develop ? 'development' : 'production',

    entry: [...getHmrEntry(hmr), template],

    output: {
      publicPath,
      path: dist,
      filename: `index.${contentHash ? '[contenthash].' : ''}js`,
      chunkFilename: contentHash ? '[chunkhash:8].js' : undefined,
    },

    resolve: {
      extensions,
    },

    module: {
      rules: getRules(baseDir, production, false),
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

    plugins: getPlugins([], progress, production, hmr),
  });
}
