function changeLoader(config, name, cb) {
  config.module.rules.forEach((rule) => {
    (rule.use || [])
      .filter((m) => m && typeof m === 'object')
      .forEach((m, i) => {
        if (m === name) {
          rule.use[i] = cb({ loader: m });
        } else if (m.loader === name) {
          rule.use[i] = cb(m);
        }
      });
  });
}

function changeLoaderOptions(config, name, options) {
  changeLoader(config, name, (rule) => (rule.options = options));
}

module.exports = function (override) {
  return (config) => {
    if (override && typeof override === 'object') {
      if ('fileLoaderOptions' in override) {
        changeLoaderOptions(config, 'file-loader', override.fileLoaderOptions);
      }

      if ('tsLoaderOptions' in override) {
        changeLoaderOptions(config, 'ts-loader', override.tsLoaderOptions);
      }

      if ('babelLoaderOptions' in override) {
        changeLoaderOptions(config, 'babel-loader', override.babelLoaderOptions);
      }

      if ('cssLoaderOptions' in override) {
        changeLoaderOptions(config, 'css-loader', override.cssLoaderOptions);
      }

      if ('sassLoaderOptions' in override) {
        changeLoaderOptions(config, 'sass-loader', override.sassLoaderOptions);
      }

      if (override.checkTypes === true) {
        changeLoader(
          config,
          'ts-loader',
          (rule) =>
            (rule.options = {
              ...rule.options,
              transpileOnly: false,
            }),
        );
      }

      if (override.noPresets === true) {
        changeLoader(
          config,
          'babel-loader',
          (rule) =>
            (rule.options = {
              ...rule.options,
              presets: undefined,
            }),
        );
      }

      if ('change' in override && typeof override.change === 'function') {
        config = override.change(config);
      }

      if ('rules' in override && Array.isArray(override.rules)) {
        config.module.rules.push(...rules);
      }

      if ('plugins' in override && Array.isArray(override.plugins)) {
        config.plugins.push(...plugins);
      }
    }

    return config;
  };
};
