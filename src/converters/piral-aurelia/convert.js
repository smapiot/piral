const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromAurelia = root => ({
  type: 'html',
  component: convert(root),
});
exports.createAureliaExtension = createExtension;
