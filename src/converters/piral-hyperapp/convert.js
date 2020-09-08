const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromHyperapp = createConverter();
exports.createHyperappExtension = createExtension;
