const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromEmber = (App, opts) => ({
  type: 'html',
  component: convert(App, opts),
});
exports.createEmberExtension = createExtension;
