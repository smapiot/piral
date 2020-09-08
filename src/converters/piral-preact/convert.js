const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromPreact = createConverter();
exports.createPreactExtension = createExtension;
