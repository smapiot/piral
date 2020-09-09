const { getSpecs, generated, getName } = require('./paths');
const { getTitle } = require('./utils');
const { render } = require('./markdown');
const { generateStandardPage } = require('./pages');

function getRoute(name) {
  return (name && `/reference/specifications/${name}`) || '';
}

module.exports = function() {
  const specs = getSpecs();

  const imports = specs.map(file => {
    const { mdValue } = render(file, generated);
    const title = getTitle(file);
    const name = getName(file);
    const route = getRoute(name);
    const pageMeta = {
      link: route,
      source: file,
      title,
    };

    this.addDependency(file, { includedInParent: true });
    return generateStandardPage(name, pageMeta, `spec-${name}`, file, mdValue, route, title);
  });

  return imports;
};
