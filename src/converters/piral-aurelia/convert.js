const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromAurelia = createConverter();
exports.createAureliaExtension = createExtension;
