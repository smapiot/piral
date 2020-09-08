const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromNg = createConverter();
exports.createNgExtension = createExtension;
