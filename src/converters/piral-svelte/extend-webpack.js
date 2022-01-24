const { resolve } = require('path');

const svelteLoader = require.resolve('svelte-loader');

module.exports =
  (options = {}) =>
  (config) => {
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }

    if (!config.resolve.extensions) {
      config.resolve.extensions = ['.mjs', '.js'];
    }

    if (!config.resolve.mainFields) {
      config.resolve.mainFields = ['browser', 'module', 'main'];
    }

    config.resolve.alias.svelte = resolve('node_modules', 'svelte');
    config.resolve.extensions.push('.svelte');
    config.resolve.mainFields.unshift('svelte');

    config.module.rules.push(
      {
        test: /\.(html|svelte)$/,
        use: svelteLoader,
        options: {
          emitCss: true,
          ...options,
        },
      },
      {
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
    );

    return config;
  };
