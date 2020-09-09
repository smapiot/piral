const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/converter');

const convert = createConverter();

exports.fromLitel = elementName => ({
  type: 'html',
  component: convert(elementName),
});
exports.createLitElExtension = createExtension;
