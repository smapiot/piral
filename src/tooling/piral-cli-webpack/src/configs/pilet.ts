import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import { PiletWebpackPlugin } from 'pilet-webpack-plugin';
import { join } from 'path';
import { getRules, getPlugins, extensions, getVariables, getPackageData } from './common';

export async function getPiletConfig(
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
  const piletPkg = {
    ...getPackageData(),
    externals,
  };
  const defaultMain = hmr ? [`webpack-hot-middleware/client?name=pilet-${piletPkg.name}`] : [];

  function getFileName() {
    const name = contentHash ? 'index.[hash]' : 'index';
    return `${name}.js`;
  }

  return {
    devtool: sourceMaps ? (develop ? 'cheap-module-source-map' : 'source-map') : false,

    mode: develop ? 'development' : 'production',

    entry: {
      main: [...defaultMain, join(__dirname, '..', 'set-path'), template],
    },

    output: {
      publicPath,
      path: dist,
      filename: getFileName(),
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
            output: {
              comments: /^@pilet/,
            },
          },
        }),
      ],
    },

    plugins: getPlugins(
      [
        new PiletWebpackPlugin(piletPkg, {
          variables: getVariables(),
        }),
      ],
      progress,
      production,
      hmr,
    ),
  };
}
