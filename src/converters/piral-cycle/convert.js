const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromCycle = createConverter();
exports.createCycleExtension = createExtension;
