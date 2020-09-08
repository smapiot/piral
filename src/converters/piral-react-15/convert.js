const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromReact15 = createConverter();
exports.createReact15Extension = createExtension;
