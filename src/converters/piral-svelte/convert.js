const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromSvelte = createConverter();
exports.createSvelteExtension = createExtension;
