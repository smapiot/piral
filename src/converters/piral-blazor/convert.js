const { createConverter } = require('./lib/converter');
const { createDependencyLoader } = require('./lib/dependencies');

const convert = createConverter();
const loader = createDependencyLoader(convert);

exports.fromBlazor = (moduleName, dependency, args) => ({
  type: 'html',
  component: convert(moduleName, dependency, args),
});
exports.defineBlazorReferences = loader.defineBlazorReferences;
