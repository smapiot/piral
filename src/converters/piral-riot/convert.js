const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromRiot = createConverter();
exports.createRiotExtension = createExtension;
