import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import { Html5EntryWebpackPlugin } from 'html5-entry-webpack-plugin';
import { PiralInstanceWebpackPlugin } from 'piral-instance-webpack-plugin';
import { getRules, getPlugins, extensions, getVariables, getPackageData } from './common';

export async function getPiralConfig(
  baseDir: string,
  template: string,
  dist: string,
  develop = false,
  sourceMaps = true,
  contentHash = true,
  minimize = true,
  hmr = false,
  publicPath = '/',
  progress = false,
): Promise<webpack.Configuration> {
  const production = !develop;
  const piralPkg = getPackageData();
  const defaultMain = hmr ? ['webpack-hot-middleware/client?name=piral'] : [];

  function getFileName() {
    const name = contentHash ? '[hash]' : develop ? 'dev' : 'prod';
    return `index.${name}.js`;
  }

  return {
    devtool: sourceMaps ? (develop ? 'cheap-module-source-map' : 'source-map') : false,

    mode: develop ? 'development' : 'production',

    entry: {
      main: [...defaultMain, template],
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
          },
        }),
      ],
    },

    plugins: getPlugins(
      [
        new Html5EntryWebpackPlugin(),
        new PiralInstanceWebpackPlugin(piralPkg, {
          variables: getVariables(),
        }),
      ],
      progress,
      production,
      hmr,
    ),
  };
}
