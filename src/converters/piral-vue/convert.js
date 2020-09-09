const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromVue = (root, captured) => ({
  type: 'html',
  component: convert(root, captured),
});
exports.createVueExtension = createExtension;
