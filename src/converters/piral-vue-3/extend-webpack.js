const { VueLoaderPlugin } = require('vue-loader');

const vueLoader = require.resolve('vue-loader');

module.exports =
  (options = {}) =>
  (config) => {
    config.plugins.push(new VueLoaderPlugin());

    config.module.rules.unshift({
      test: /\.vue$/,
      use: {
        loader: vueLoader,
        options,
      },
    });

    return config;
  };
