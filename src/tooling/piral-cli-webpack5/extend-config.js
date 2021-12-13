function changePlugin(config, classRef, cb) {
  config.module.plugins = config.module.plugins
    .map((plugin) => {
      if (plugin instanceof classRef) {
        return cb(plugin);
      }

      return plugin;
    })
    .filter(Boolean);
}

function changeRule(config, name, cb) {
  const loaderPath = require.resolve(name);
  config.module.rules = config.module.rules
    .map((rule) => {
      const uses = rule.use || [];

      if (uses.some((m) => m && (m === loaderPath || (typeof m === 'object' && m.loader === loaderPath)))) {
        return cb(rule);
      }

      return rule;
    })
    .filter(Boolean);
}

function changeLoader(config, name, cb) {
  const loaderPath = require.resolve(name);

  changeRule(config, name, (rule) => {
    rule.use = rule.use.map((m) => {
      if (m === loaderPath) {
        return cb({ loader: m });
      } else if (m.loader === loaderPath) {
        return cb(m);
      } else {
        return m;
      }
    });

    return rule;
  });
}

function changeLoaderOptions(config, name, options) {
  changeLoader(config, name, (rule) => {
    rule.options = options;
    return rule;
  });
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

      if ('rules' in override && Array.isArray(override.rules)) {
        config.module.rules.push(...override.rules);
      }

      if ('removeRules' in override && Array.isArray(override.removeRules)) {
        override.removeRules.forEach((rule) => changeRule(config, rule, () => undefined));
      }

      if ('plugins' in override && Array.isArray(override.plugins)) {
        config.plugins.push(...override.plugins);
      }

      if ('removePlugins' in override && Array.isArray(override.removePlugins)) {
        override.removePlugins.forEach((plugin) => changePlugin(config, plugin, () => undefined));
      }

      if ('change' in override && typeof override.change === 'function') {
        config = override.change(config);
      }
    }

    return config;
  };
};
