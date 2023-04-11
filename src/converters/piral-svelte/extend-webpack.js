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

    if (!config.resolve.conditionNames) {
      config.resolve.conditionNames = ['import', 'module', 'require', 'node'];
    }

    config.resolve.alias.svelte = resolve('node_modules', 'svelte');
    config.resolve.extensions.push('.svelte');
    config.resolve.mainFields.unshift('svelte');
    config.resolve.conditionNames.push('svelte');

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
      (m) => m.test && m.test.toString() === /\.tsx?$/i.toString(),
      (m, all) => {
        const ruleIndex = all.indexOf(m);

        all.splice(
          ruleIndex,
          0,
          {
            test: /\.(html|svelte)$/,
            use: {
              loader: svelteLoader,
              options: {
                emitCss: true,
                ...options,
              },
            },
          },
          {
            test: /node_modules\/svelte\/.*\.mjs$/,
            resolve: {
              fullySpecified: false,
            },
          },
        );
      },
    );

    return config;
  };
