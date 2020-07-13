const { getSamples, getName, generateFile, generated, generatedName } = require('./paths');
const { render } = require('./markdown');
const { docRef } = require('./utils');

function getRoute(name) {
  return (name && `/guidelines/examples/${name}`) || '';
}

module.exports = function() {
  const files = getSamples();

  const imports = files
    .map(file => {
      const name = getName(file);
      const route = getRoute(name);
      const { mdValue, meta = {} } = render(file, generated);
      const pageMeta = {
        link: route,
        source: file,
        ...meta,
      };

      this.addDependency(file, { includedInParent: true });

      generateFile(
        `sample-${name}`,
        `// ${JSON.stringify(pageMeta)}
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
        title: '${meta.title || ''}',
        route: '${route}',
        page: lazy(() => import('./${generatedName}/sample-${name}')),
      }`;
    });

  return imports;
};
