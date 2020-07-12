const { getSpecs, generateFile, generatedName, generated, getName } = require('./paths');
const { docRef, getTitle } = require('./utils');
const { render } = require('./markdown');

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
    this.addDependency(file, { includedInParent: true });

    generateFile(
      `spec-${name}`,
      `// ${route}
import * as React from 'react';
import { PageContent, Markdown } from '../../scripts/components';

const link = "${docRef(file)}";
const html = ${mdValue};

export default () => (
  <PageContent>
    <Markdown content={html} link={link} />
  </PageContent>
);`,
      'jsx',
    );

    return `
    {
      id: '${name}',
      title: '${title}',
      route: '${route}',
      page: lazy(() => import('./${generatedName}/spec-${name}')),
    }`;
  });

  return imports;
};