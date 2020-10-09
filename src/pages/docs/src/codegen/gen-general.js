const { getDocs, getName, generated } = require('./paths');
const { capitalize } = require('./utils');
const { render } = require('./markdown');
const { generateStandardPage } = require('./pages');

function getRoute(name) {
  return (name && `/reference/documentation/${name}`) || '';
}

module.exports = function () {
  const docs = getDocs();

  const imports = docs.map((file) => {
    const name = getName(file);
    const route = getRoute(name);
    const { mdValue, meta = {} } = render(file, generated);
    const pageMeta = {
      title: capitalize(name),
      ...meta,
      link: route,
      source: file,
    };

    this.addDependency(file, { includedInParent: true });
    return generateStandardPage(name, pageMeta, `ref-${name}`, file, mdValue, route, pageMeta.title);
  });

  return imports;
};
