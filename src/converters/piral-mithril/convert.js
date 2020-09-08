const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromMithril = createConverter();
exports.createMithrilExtension = createExtension;
