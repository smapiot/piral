const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromNgjs = createConverter();
exports.createNgjsExtension = createExtension;
