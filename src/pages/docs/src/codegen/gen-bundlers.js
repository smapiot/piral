const { generated, getName, getBundlers } = require('./paths');
const { render } = require('./markdown');
const { generateStandardPage } = require('./pages');
const { sep } = require('path');

function getRoute(name) {
  return (name && `/tooling/${name}`) || '';
}

/**
 * Takes a path and seperates it into single parts
 * @param filePath The path in form of a string
 */
function getPathElements(filePath) {

  return filePath.split(sep);
}

module.exports = function() {
  const bundlers = getBundlers();

  const imports = bundlers.map(file => {

    const { mdValue, meta = {} } = render(file, generated);
    const pathElements = getPathElements(file);
    const nameToUse = pathElements[pathElements.length - 2];
    const route = getRoute(nameToUse);
    const pageMeta = {
      ...meta,
      link: route,
      source: file,
    };

    this.addDependency(file, { includedInParent: true });
    return generateStandardPage(nameToUse, pageMeta, `bundlers-${nameToUse}`, file, mdValue, route, nameToUse);
  });
  return imports;
};
