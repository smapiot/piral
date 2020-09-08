const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromInferno = createConverter();
exports.createInfernoExtension = createExtension;
