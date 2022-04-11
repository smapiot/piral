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

/**
 * Use this function to create a function to return from your webpack
 * configuration module. The created function can be used to conveniently
 * override and etend the original configuration.
 * @typedef OverrideOptions
 * @property {any=} tsLoaderOptions The new options for the ts-loader
 * @property {any=} babelLoaderOptions The new options for the babel-loader
 * @property {any=} cssLoaderOptions The new options for the css-loader
 * @property {any=} sassLoaderOptions The new options for the sass-loader
 * @property {boolean=} checkTypes Determines the value of the transpileOnly option in ts-loader
 * @property {boolean=} noPresets Determines if presets should be set to undefined in babel-loader
 * @property {Array<{ name: string, rule: any }>=} updateRules Overrides the rules determined by its loader name with the provided rule
 * @property {Array<string>=} removeRules Removes the rules determined by its loader name
 * @property {Array<any>=} rules Inserts the given rules in the beginning
 * @property {Array<{ type: any, plugin: any }>=} updatePlugins Overrides the plugins determined by its class reference (instance) with the provided plugin
 * @property {Array<any>=} removePlugins Removes the plugins determined by its class reference (instance)
 * @property {Array<any>=} plugins Inserts the given plugins in the end
 * @param {OverrideOptions} override
 * @returns {(config: webpack.Configuration) => webpack.Configuration}
 */
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

      if ('updateRules' in override && Array.isArray(override.updateRules)) {
        override.updateRules.forEach((def) => {
          if (typeof def.name === 'string' && def.rule) {
            changeRule(config, def.name, def.rule);
          }
        });
      }

      if ('removeRules' in override && Array.isArray(override.removeRules)) {
        override.removeRules.forEach((rule) => changeRule(config, rule, () => undefined));
      }

      if ('rules' in override && Array.isArray(override.rules)) {
        config.module.rules.push(...override.rules);
      }

      if ('updatePlugins' in override && Array.isArray(override.updatePlugins)) {
        override.updatePlugins.forEach((def) => {
          if (def.type && def.rule) {
            changePlugin(config, def.type, def.plugin);
          }
        });
      }

      if ('removePlugins' in override && Array.isArray(override.removePlugins)) {
        override.removePlugins.forEach((plugin) => changePlugin(config, plugin, () => undefined));
      }

      if ('plugins' in override && Array.isArray(override.plugins)) {
        config.plugins.push(...override.plugins);
      }

      if ('change' in override && typeof override.change === 'function') {
        config = override.change(config);
      }
    }

    return config;
  };
};
