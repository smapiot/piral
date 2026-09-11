const { CopyRspackPlugin } = require('@rspack/core');

const { resolve } = require('path');

const sassLoader = require.resolve('sass-loader');
const angularResourceLoader = require.resolve('./angular-resource-loader');

module.exports =
  (options = {}) =>
  (config) => {
    const {
      patterns = [{ from: resolve(process.cwd(), 'src/assets'), noErrorOnMissing: true }],
      ngOptions = {},
    } = options;
    const jitMode = ngOptions.jitMode ?? true;

    if (!jitMode) {
      // Angular AOT relies on @ngtools/webpack's AngularWebpackPlugin, which reaches into
      // webpack-only compiler internals (e.g. resolverFactory) that Rspack does not provide.
      // There is no drop-in AOT compiler for Rspack yet, so only JIT builds are supported here.
      // For AOT with Rspack use a dedicated Angular/Rspack builder, e.g. `@nx/angular-rspack`.
      throw new Error('piral-ng/extend-rspack only supports jitMode: true (AOT is not supported with Rspack).');
    }

    // piral-cli-rspack nests all its rules in a single top-level `oneOf` array, with separate
    // (non-merged) entries for `.ts` and `.tsx` - not a combined `/\.tsx?$/` pattern
    const oneOf = config.module.rules.find((rule) => Array.isArray(rule.oneOf))?.oneOf;

    if (!oneOf) {
      throw new Error(
        'piral-ng/extend-rspack could not find the expected module.rules[].oneOf array - is this an unsupported Rspack config?',
      );
    }

    oneOf.forEach((rule) => {
      const test = rule.test?.toString();

      // exclude component-scoped styles from the regular (global) stylesheet handling,
      // they are inlined into the component as raw text below instead
      if (test === /\.css$/i.toString()) {
        rule.exclude = /\.component.css$/i;
      } else if (test === /\.s[ac]ss$/i.toString()) {
        rule.exclude = /\.component.s[ac]ss$/i;
      } else if (test === /\.ts$/.toString() || test === /\.tsx$/.toString()) {
        // Angular's JIT mode only needs TypeScript's decorator/metadata transform - no
        // Angular-specific compiler is required, so Rspack's native SWC loader handles it
        delete rule.loader;
        delete rule.options;
        rule.use = [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: test === /\.tsx$/.toString(),
                  decorators: true,
                  // Angular puts decorators before `export`, e.g. `@Component() export class`
                  decoratorsBeforeExport: true,
                },
                transform: {
                  legacyDecorator: true,
                  decoratorMetadata: true,
                  useDefineForClassFields: false,
                },
              },
            },
          },
          // loaders run right-to-left, so this rewrites templateUrl/styleUrls to require()
          // calls before the SWC loader compiles the result
          angularResourceLoader,
        ];
      }
    });

    // Angular templates/styles are consumed as plain strings - Rspack's built-in asset/source
    // type exports the raw content without any loader; unshifted so it runs before the catch-all rule
    oneOf.unshift(
      {
        test: /\.component.html$/i,
        type: 'asset/source',
      },
      {
        test: /\.component.css$/i,
        type: 'asset/source',
      },
      {
        // sass-loader compiles to CSS first, asset/source then exports the result as a string
        test: /\.component.s[ac]ss$/i,
        use: [sassLoader],
        type: 'asset/source',
      },
    );

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
        const compilerEntry = entry['angular-compiler'];

        if (typeof coreEntry !== 'undefined') {
          const compilerDependency = resolve(__dirname, 'core-dynamic.js');
          coreEntry.import = [compilerDependency, ...coreEntry.import];
        }

        if (typeof compilerEntry !== 'undefined') {
          const compilerDependency = resolve(__dirname, 'compiler-dynamic.js');
          compilerEntry.import = [compilerDependency, ...compilerEntry.import];
        }

        // if @angular/core / @angular/compiler aren't split into their own shared-dependency
        // entries (e.g. a plain pilet build), make sure @angular/compiler still loads before
        // any Angular code runs - otherwise JIT compilation fails at runtime
        if (typeof coreEntry === 'undefined' && typeof compilerEntry === 'undefined') {
          const compilerDependency = resolve(__dirname, 'core-dynamic.js');

          Object.values(entry).forEach((e) => {
            if (e && Array.isArray(e.import)) {
              e.import = [compilerDependency, ...e.import];
            }
          });
        }
      },
    });

    config.plugins.push(
      new CopyRspackPlugin({
        patterns,
      }),
    );

    return config;
  };

