const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/converter');

exports.fromLitel = createConverter();
exports.createLitElExtension = createExtension;
