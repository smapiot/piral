const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromInferno = root => ({
  type: 'html',
  component: convert(root),
});
exports.createInfernoExtension = createExtension;
