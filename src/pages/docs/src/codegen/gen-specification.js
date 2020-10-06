const { getSpecs, generated, getName } = require('./paths');
const { getTitle } = require('./utils');
const { render } = require('./markdown');
const { generateStandardPage } = require('./pages');

function getRoute(name) {
  return (name && `/reference/specifications/${name}`) || '';
}

module.exports = function () {
  const specs = getSpecs();

  const imports = specs.map((file) => {
    const { mdValue, meta = {} } = render(file, generated);
    const title = getTitle(file);
    const name = getName(file);
    const route = getRoute(name);
    const pageMeta = {
      title,
      ...meta,
      link: route,
      source: file,
    };

    this.addDependency(file, { includedInParent: true });
    return generateStandardPage(name, pageMeta, `spec-${name}`, file, mdValue, route, title);
  });

  return imports;
};
