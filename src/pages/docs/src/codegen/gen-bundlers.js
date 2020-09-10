const { generated, getName, getBundlers } = require('./paths');
const { render } = require('./markdown');
const { generateStandardPage } = require('./pages');

function getRoute(name) {
  return (name && `/bundlers/${name}`) || '';
}

module.exports = function() {
  const bundlers = getBundlers();

  const imports = bundlers.map(file => {

    const { mdValue, meta = {} } = render(file, generated);
    const nameToUse = meta.title.split(' ')[0];
    const name = getName(file);
    const route = getRoute(nameToUse);
    const pageMeta = {
      ...meta,
      link: route,
      source: file,
    };

    this.addDependency(file, { includedInParent: true });
    return generateStandardPage(nameToUse, pageMeta, `bundlers-${nameToUse}`, file, mdValue, route, meta.title);
  });
  return imports;
};
