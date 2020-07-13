const { generated, getName, getTools } = require('./paths');
const { render } = require('./markdown');
const { generateStandardPage } = require('./pages');

function getRoute(name) {
  return (name && `/tooling/${name}`) || '';
}

module.exports = function() {
  const tools = getTools();

  const imports = tools.map(file => {
    const name = getName(file);
    const route = getRoute(name);
    const { mdValue, meta = {} } = render(file, generated);
    const pageMeta = {
      ...meta,
      link: route,
      source: file,
    };

    this.addDependency(file, { includedInParent: true });
    return generateStandardPage(name, pageMeta, `tools-${name}`, file, mdValue, route, meta.title);
  });

  return imports;
};
