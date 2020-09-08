const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromNg = component => ({
  type: 'html',
  component: convert(component),
});
exports.createNgExtension = createExtension;
