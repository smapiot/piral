const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromRiot = (component, captured) => ({
  type: 'html',
  component: convert(component, captured),
});
exports.createRiotExtension = createExtension;
