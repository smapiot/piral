const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromSvelte = (Component, captured) => ({
  type: 'html',
  component: convert(Component, captured),
});
exports.createSvelteExtension = createExtension;
