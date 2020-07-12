const { getCommands, generateFile, generatedName, generated, getName } = require('./paths');
const { docRef } = require('./utils');
const { render } = require('./markdown');

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

module.exports = function() {
  const commands = getCommands();

  const imports = commands
    .map(file => {
      const name = getName(file);
      const route = getRoute(name);
      const { mdValue } = render(file, generated);
      this.addDependency(file, { includedInParent: true });
      const tool = getType(file);

      generateFile(
        `tooling-${name}`,
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
        route: '${route}',
        tool: '${tool}',
        page: lazy(() => import('./${generatedName}/tooling-${name}')),
      }`;
    });

  return imports;
};
