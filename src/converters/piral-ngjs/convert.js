const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromNgjs = (name, root) => ({
  type: 'html',
  component: convert(name, root),
});
exports.createNgjsExtension = createExtension;
