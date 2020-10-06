const { getCommands, generated, getName } = require('./paths');
const { render } = require('./markdown');
const { generateStandardPage } = require('./pages');

function getRoute(name) {
  return (name && `/tooling/${name}`) || '';
}

function getType(file) {
  if (file.endsWith('-piral.md')) {
    return `Piral CLI - piral`;
  } else if (file.endsWith('-pilet.md')) {
    return `Piral CLI - pilet`;
  } else {
    return `Piral CLI - pb`;
  }
}

module.exports = function () {
  const commands = getCommands();

  const imports = commands.map((file) => {
    const name = getName(file);
    const route = getRoute(name);
    const { mdValue } = render(file, generated);
    const tool = getType(file);
    const pageMeta = {
      link: route,
      source: file,
      title: name,
      tool,
    };

    this.addDependency(file, { includedInParent: true });
    return generateStandardPage(name, pageMeta, `commands-${name}`, file, mdValue, route, name, tool);
  });

  return imports;
};
