const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromReact15 = root => ({
  type: 'html',
  component: convert(root),
});
exports.createReact15Extension = createExtension;
