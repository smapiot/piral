const { resolve } = require('path');
const { render, generated, generateStandardPage, getName, getDocsFrom } = require('@pidoc/core');

function getCommands(docsFolder, locale) {
  const commands = resolve(docsFolder, 'commands');
  return getDocsFrom(commands, locale);
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

exports.find = function (basePath, docsFolder, options) {
  const commands = getCommands(docsFolder, options.locale);
  return commands.map((file) => {
    const name = getName(file);
    const route = getRoute(basePath, name);
    return {
      name,
      route,
      file,
    };
  });
};

exports.build = function (entry, options) {
  const { name, file, route } = entry;
  const { mdValue } = render(file, generated);
  const tool = getType(file);
  const pageMeta = {
    link: route,
    source: file,
    title: name,
    tool,
  };
  return generateStandardPage(name, pageMeta, `commands-${name}`, file, mdValue, route, name, tool);
};
