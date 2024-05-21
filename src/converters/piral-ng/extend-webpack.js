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
    const cssLoaderNoModule = {
      loader: cssLoader,
      options: {
        esModule: false,
        sourceMap: false,
      },
    };
    const htmlLoaderNoModule = {
      loader: htmlLoader,
      options: {
        esModule: false,
      },
    };
    const jitMode = ngOptions.jitMode ?? true;

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
            test: /\.mjs$/,
            loader: ngtoolsLoader,
            resolve: { fullySpecified: false },
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

    if (jitMode) {
      // The job of this plugin is 
      // (1)
      // to make @angular/core depend on @angular/compiler - this way @angular/compiler
      // does not need to be loaded separately and @angular/compiler is present *before*
      // @angular/core; this is only required in jit mode - as otherwise everything should
      // be pre-compiled.
      // (2)
      // to introduce a dynamic version of the window.ng global, which supports running
      // with multiple versions of Angular.
      config.plugins.push({
        apply(compiler) {
          const { entry } = compiler.options;
          const coreEntry = entry['angular-core'];

          if (typeof coreEntry !== 'undefined') {
            const compilerDependency = resolve(__dirname, 'core-dynamic.js');
            coreEntry.import = [compilerDependency, ...coreEntry.import];
          }

          const compilerEntry = entry['angular-compiler'];

          if (typeof compilerEntry !== 'undefined') {
            const compilerDependency = resolve(__dirname, 'compiler-dynamic.js');
            compilerEntry.import = [compilerDependency, ...compilerEntry.import];
          }
        },
      });
    }

    config.plugins.push(
      new AngularWebpackPlugin({
        tsconfig: resolve(process.cwd(), 'tsconfig.json'),
        ...ngOptions,
        jitMode,
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
