const { generated, getName, getBundlers } = require('./paths');
const { render } = require('./markdown');
const { generateStandardPage, generatePage } = require('./pages');
const { docRef } = require('./utils');
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
    const name = pathElements[pathElements.length - 2];
    const route = getRoute(name);
    const pageMeta = {
      ...meta,
      link: route,
      source: file,
    };

    const content = [
      '`',
      mdValue.substr(mdValue.indexOf('</h1>') + 5),
    ].join('');

    const head = `
      import { PageContent, Markdown, } from '../../scripts/components';

      const link = "${docRef(file)}";
      const html = ${content};
    `;

    const body = `
      <PageContent>
        <h1>${name}</h1>
        <Markdown content={html} link={link} />
      </PageContent>
    `;

    this.addDependency(file, { includedInParent: true });
    return generatePage(name, pageMeta, `bundlers-${name}`, head, body, route, name);
  });
  return imports;
};
