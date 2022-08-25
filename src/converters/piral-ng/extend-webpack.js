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

    function findRule(tester, changer) {
      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((r) => {
            if (r.test && tester(r)) {
              changer(r, rule.oneOf);
            }
          });
        } else if (rule.test && tester(rule)) {
          changer(rule, config.module.rules);
        }
      });
    }

    findRule(
      (m) => m.test.toString() === /\.css$/i.toString(),
      (m) => {
        m.exclude = /\.component.css$/i;
      },
    );

    findRule(
      (m) => m.test && m.test.toString() === /\.css$/i.toString(),
      (m) => {
        m.exclude = /\.component.css$/i;
      },
    );

    findRule(
      (m) => m.test && m.test.toString() === /\.s[ac]ss$/i.toString(),
      (m) => {
        m.exclude = /\.component.s[ac]ss$/i;
      },
    );

    findRule(
      (m) => m.test && m.test.toString() === /\.tsx?$/i.toString(),
      (m, all) => {
        const ruleIndex = all.indexOf(m);

        all.splice(
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
