const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromElm = createConverter();
exports.createElmExtension = createExtension;
