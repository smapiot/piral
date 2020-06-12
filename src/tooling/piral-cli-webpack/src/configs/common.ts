import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import { progress, logReset, log } from 'piral-cli/utils';
import { RuleSetRule, ProgressPlugin, optimize } from 'webpack';

export const extensions = ['.ts', '.tsx', '.js', '.json'];

export function getPackageData() {
  return {
    name: process.env.BUILD_PCKG_NAME,
    version: process.env.BUILD_PCKG_VERSION,
  };
}

export function getVariables(): Record<string, string> {
  return [
    'NODE_ENV',
    'BUILD_TIME',
    'BUILD_TIME_FULL',
    'BUILD_PCKG_VERSION',
    'BUILD_PCKG_NAME',
    'SHARED_DEPENDENCIES',
  ].reduce((prev, curr) => {
    prev[curr] = process.env[curr];
    return prev;
  }, {});
}

export function getPlugins(plugins: Array<any>, showProgress: boolean, production: boolean) {
  const otherPlugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
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

  if (production) {
    otherPlugins.push(new optimize.OccurrenceOrderPlugin(true));
  }

  return plugins.concat(otherPlugins);
}

export function getStyleLoader() {
  return process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader;
}

export function getRules(baseDir: string): Array<RuleSetRule> {
  const styleLoader = getStyleLoader();
  const nodeModules = resolve(baseDir, 'node_modules');

  return [
    {
      test: /\.(png|jpe?g|gif|bmp|avi|mp4|mp3|svg|ogg|webp|woff2?|eot|ttf|wav)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            esModule: false,
          },
        },
      ],
    },
    {
      test: /\.s[ac]ss$/i,
      use: [styleLoader, 'css-loader', 'sass-loader'],
    },
    {
      test: /\.css$/i,
      use: [styleLoader, 'css-loader'],
    },
    {
      test: /\.m?jsx?$/i,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      ],
      exclude: nodeModules,
    },
    {
      test: /\.tsx?$/i,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    },
    {
      test: /\.codegen$/i,
      use: ['parcel-codegen-loader'],
    },
    {
      test: /\.js$/i,
      use: ['source-map-loader'],
      exclude: nodeModules,
      enforce: 'pre',
    },
  ];
}
