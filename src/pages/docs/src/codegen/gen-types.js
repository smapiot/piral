const { readFileSync } = require('fs');
const { getCoreTypes, generatedName, generateFile } = require('./paths');

function getRoute(name) {
  return (name && `/types/${name}`) || '';
}

module.exports = function() {
  const files = getCoreTypes();

  const imports = files
    .map(file => {
      const content = readFileSync(file, 'utf8');
      const name = file
        .split('/')
        .pop()
        .replace('.json', '');
      const route = getRoute(name);
      const pageMeta = {
        link: route,
        source: file,
        title: name,
      };

      this.addDependency(file, { includedInParent: true });

      generateFile(
        `types-${name}`,
        `// ${JSON.stringify(pageMeta)}
import * as React from 'react';
import { PageContent, TypeInfo } from '../../scripts/components';

export default () => (
  <PageContent>
    <TypeInfo key="${name}">{${content}}</TypeInfo>
  </PageContent>
);`,
        'jsx',
      );
      return `
      {
        id: '${name}',
        route: '${route}',
        page: lazy(() => import('./${generatedName}/types-${name}')),
      }`;
    });

  return imports;
};
