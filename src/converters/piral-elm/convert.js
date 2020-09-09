const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromElm = (main, captured) => ({
  type: 'html',
  component: convert(main, captured),
});
exports.createElmExtension = createExtension;
