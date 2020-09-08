const { createConverter } = require('./lib/converter');
const { createExtension } = require('./lib/extension');

exports.fromVue = createConverter();
exports.createVueExtension = createExtension;
