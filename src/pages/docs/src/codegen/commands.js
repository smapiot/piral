const { resolve } = require('path');
const { render, generated, generateStandardPage, getName, getDocsFrom } = require('piral-docs-tools');

function getCommands(docsFolder) {
  const commands = resolve(docsFolder, 'commands');
  return getDocsFrom(commands);
}

function getRoute(basePath, name) {
  return (name && `${basePath}/${name}`) || '';
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

module.exports = function (basePath, docsFolder, options) {
  const commands = getCommands(docsFolder);

  const imports = commands.map((file) => {
    const name = getName(file);
    const route = getRoute(basePath, name);
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
