const { getDocs, getReferences, getName, generated } = require('./paths');
const { capitalize } = require('./utils');
const { render } = require('./markdown');
const { generateStandardPage } = require('./pages');

function getRoute(name) {
  return (name && `/reference/documentation/${name}`) || '';
}

module.exports = function() {
  const docs = [...getDocs(), ...getReferences()];

  const imports = docs.map(file => {
    const name = getName(file);
    const route = getRoute(name);
    const title = capitalize(name);
    const { mdValue } = render(file, generated);
    const pageMeta = {
      link: route,
      source: file,
      title,
    };

    this.addDependency(file, { includedInParent: true });
    return generateStandardPage(name, pageMeta, `ref-${name}`, file, mdValue, route, title);
  });

  return imports;
};
