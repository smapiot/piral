import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import { Html5EntryWebpackPlugin } from 'html5-entry-webpack-plugin';
import { PiralInstanceWebpackPlugin } from 'piral-instance-webpack-plugin';
import { getRules, getPlugins, extensions, getVariables } from './common';

export async function getPiralConfig(
  baseDir: string,
  template: string,
  dist: string,
  externals: Array<string>,
  develop = false,
  sourceMaps = true,
  contentHash = true,
  minimize = true,
  hmr = false,
  publicPath = '/',
  progress = false,
): Promise<webpack.Configuration> {
  const production = !develop;
  const name = process.env.BUILD_PCKG_NAME;
  const version = process.env.BUILD_PCKG_VERSION;
  const defaultMain = hmr ? ['webpack-hot-middleware/client'] : [];

  return {
    devtool: sourceMaps ? (develop ? 'cheap-module-source-map' : 'source-map') : false,

    mode: develop ? 'development' : 'production',

    entry: {
      main: [...defaultMain, template],
    },

    output: {
      publicPath,
      path: dist,
      filename: `index.${contentHash ? '.[hash]' : ''}.js`,
      chunkFilename: contentHash ? '[chunkhash:8].js' : undefined,
    },

    resolve: {
      extensions,
    },

    module: {
      rules: getRules(baseDir),
    },

    optimization: {
      minimize,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            warnings: false,
            ie8: true,
          },
        }),
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
      progress,
      production,
      hmr,
    ),
  };
}
