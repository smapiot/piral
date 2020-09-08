const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

const convert = createConverter();

exports.fromCycle = main => ({
  type: 'html',
  component: convert(main),
});
exports.createCycleExtension = createExtension;
