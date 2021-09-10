import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { progress, logReset, log } from 'piral-cli/utils';
import { RuleSetRule, ProgressPlugin, WebpackPluginInstance, Configuration } from 'webpack';
import SheetPlugin from './SheetPlugin';

const piletCss = 'main.css';

function getStyleLoaders(production: boolean) {
  if (production) {
    return [MiniCssExtractPlugin.loader];
  } else {
    return [require.resolve('style-loader')];
  }
}

export type ConfigEnhancer = (config: Configuration) => Configuration;

export type DefaultConfiguration = [Configuration, ConfigEnhancer];

export const extensions = ['.ts', '.tsx', '.js', '.json'];

export function getVariables(): Record<string, string> {
  return Object.keys(process.env).reduce((prev, curr) => {
    prev[curr] = process.env[curr];
    return prev;
  }, {});
}

export function getPlugins(plugins: Array<any>, showProgress: boolean, production: boolean, pilet: boolean) {
  const otherPlugins: Array<WebpackPluginInstance> = [
    new MiniCssExtractPlugin({
      filename: pilet ? piletCss : '[name].[fullhash:6].css',
      chunkFilename: '[id].[chunkhash:6].css',
    }) as any,
  ];

  if (showProgress) {
    otherPlugins.push(
      new ProgressPlugin((percent, msg) => {
        if (percent !== undefined) {
          progress(`${~~(percent * 100)}% : ${msg}`);

          if (percent === 1) {
            logReset();
            log('generalInfo_0000', 'Bundling finished.');
          }
        }
      }),
    );
  }

  if (production && pilet) {
    otherPlugins.push(new SheetPlugin(piletCss) as any);
  }

  return plugins.concat(otherPlugins);
}

export function getRules(production: boolean): Array<RuleSetRule> {
  const styleLoaders = getStyleLoaders(production);
  const nodeModules = /node_modules/;
  const babelLoader = {
    loader: require.resolve('babel-loader'),
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
    },
  };
  const tsLoader = {
    loader: require.resolve('ts-loader'),
    options: {
      transpileOnly: true,
    },
  };
  const fileLoader = {
    loader: require.resolve('file-loader'),
    options: {
      esModule: false,
    },
  };

  return [
    {
      test: /\.(png|jpe?g|gif|bmp|avi|mp4|mp3|svg|ogg|webp|woff2?|eot|ttf|wav)$/i,
      use: [fileLoader],
    },
    {
      test: /\.s[ac]ss$/i,
      use: [...styleLoaders, require.resolve('css-loader'), require.resolve('sass-loader')],
    },
    {
      test: /\.css$/i,
      use: [...styleLoaders, require.resolve('css-loader')],
    },
    {
      test: /\.m?jsx?$/i,
      use: [babelLoader],
      exclude: nodeModules,
    },
    {
      test: /\.tsx?$/i,
      use: [babelLoader, tsLoader],
    },
    {
      test: /\.codegen$/i,
      use: [require.resolve('parcel-codegen-loader')],
    },
    {
      test: /\.js$/i,
      use: [require.resolve('source-map-loader')],
      exclude: nodeModules,
      enforce: 'pre',
    },
  ];
}
