const { getCodes, getName, generated } = require('./paths');
const { render } = require('./markdown');
const { generateStandardPage } = require('./pages');

function getRoute(name) {
  return (name && `/reference/codes/${name}`) || '';
}

module.exports = function () {
  const codes = getCodes();

  const imports = codes.map((file) => {
    const { mdValue } = render(file, generated);
    const name = getName(file);
    const route = getRoute(name);
    const pageMeta = {
      link: route,
      source: file,
      title: name,
    };

    this.addDependency(file, { includedInParent: true });
    return generateStandardPage(name, pageMeta, `code-${name}`, file, mdValue, route, name);
  });

  return imports;
};
