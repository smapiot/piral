const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromPreact = root => ({
  type: 'html',
  component: convert(root),
});
exports.createPreactExtension = createExtension;
