const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromSolid = root => ({
  type: 'html',
  component: convert(root),
});
exports.createSolidExtension = createExtension;
