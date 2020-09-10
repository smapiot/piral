const { generated, getName, getBundlers } = require('./paths');
const { render } = require('./markdown');
const { generateStandardPage } = require('./pages');

function getRoute(name) {
  return (name && `/bundlers/${name}`) || '';
}

module.exports = function() {
  const bundlers = getBundlers();

  const imports = bundlers.map(file => {
    const name = getName(file);
    const route = getRoute(name);
    const { mdValue, meta = {} } = render(file, generated);
    const pageMeta = {
      ...meta,
      link: route,
      source: file,
    };

    this.addDependency(file, { includedInParent: true });
    return generateStandardPage(name, pageMeta, `bundlers-${name}`, file, mdValue, route, meta.title);
  });
  return imports;
};
