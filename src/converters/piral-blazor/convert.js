const { createConverter } = require('./lib/converter');
const { createDependencyLoader } = require('./lib/dependencies');

const convert = createConverter();

const loader = createDependencyLoader(convert);

exports.fromBlazor = convert;
exports.defineBlazorReferences = loader.defineBlazorReferences;
