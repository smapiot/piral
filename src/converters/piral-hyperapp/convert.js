const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromHyperapp = (root, state, actions) => ({
  type: 'html',
  component: convert(root, state, actions),
});
exports.createHyperappExtension = createExtension;
