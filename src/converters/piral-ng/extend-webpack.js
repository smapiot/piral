const CopyPlugin = require('copy-webpack-plugin');

const { AngularWebpackPlugin } = require('@ngtools/webpack');
const { resolve } = require('path');

const ngtoolsLoader = require.resolve('@ngtools/webpack');
const toStringLoader = require.resolve('to-string-loader');
const cssLoader = require.resolve('css-loader');
const sassLoader = require.resolve('sass-loader');
const htmlLoader = require.resolve('html-loader');

module.exports =
  (options = {}) =>
  (config) => {
    const {
      patterns = [{ from: resolve(process.cwd(), 'src/assets'), noErrorOnMissing: true }],
      ngOptions = {},
      compilerOptions = {},
    } = options;
    const cssLoaderNoModule = `${cssLoader}?esModule=false`;
    const htmlLoaderNoModule = {
      loader: htmlLoader,
      options: {
        esModule: false,
      },
    };

    config.module.rules
      .filter((m) => m.test.toString() === /\.css$/i.toString())
      .forEach((m) => {
        m.exclude = /\.component.css$/i;
      });

    config.module.rules
      .filter((m) => m.test.toString() === /\.s[ac]ss$/i.toString())
      .forEach((m) => {
        m.exclude = /\.component.s[ac]ss$/i;
      });

    const ruleIndex = config.module.rules.findIndex((m) => m.test.toString() === /\.tsx?$/i.toString());

    config.module.rules.splice(
      ruleIndex,
      1,
      {
        test: /\.[jt]sx?$/,
        loader: ngtoolsLoader,
      },
      {
        test: /\.component.html$/i,
        use: [toStringLoader, htmlLoaderNoModule],
      },
      {
        test: /\.component.css$/i,
        use: [toStringLoader, cssLoaderNoModule],
      },
      {
        test: /\.component.s[ac]ss$/i,
        use: [toStringLoader, cssLoaderNoModule, sassLoader],
      },
    );

    config.plugins.push(
      new AngularWebpackPlugin({
        tsconfig: resolve(process.cwd(), 'tsconfig.json'),
        jitMode: true,
        ...ngOptions,
        compilerOptions: {
          ...compilerOptions,
          compilationMode: 'partial',
        },
      }),
      new CopyPlugin({
        patterns,
      }),
    );

    return config;
  };
