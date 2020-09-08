const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromEmber = createConverter();
exports.createEmberExtension = createExtension;
