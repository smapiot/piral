const vueLoader = require.resolve('vue-loader');

module.exports =
  (options = {}) =>
  (config) => {
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

    config.plugins.push(new VueLoaderPlugin());

    findRule(
      (m) => m.test && m.test.toString() === /\.tsx?$/i.toString(),
      (m, all) => {
        const ruleIndex = all.indexOf(m);

        all.splice(ruleIndex, 0, {
          test: /\.vue$/,
          use: {
            loader: vueLoader,
            options,
          },
        });
      },
    );

    return config;
  };
