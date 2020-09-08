const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromSolid = createConverter();
exports.createSolidExtension = createExtension;
