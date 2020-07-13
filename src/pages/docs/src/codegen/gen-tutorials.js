const { getTutorials, getName, generateFile, generated, generatedName } = require('./paths');
const { render } = require('./markdown');
const { docRef } = require('./utils');

function getRoute(name) {
  return (name && `/guidelines/tutorials/${name}`) || '';
}

module.exports = function() {
  const files = getTutorials();

  const imports = files
    .map((file, i) => {
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
        `tutorial-${name}`,
        `// ${JSON.stringify(pageMeta)}
import * as React from 'react';
import { Tutorial, Markdown } from '../../scripts/components';

const link = "${docRef(file)}";
const html = ${mdValue};

export default () => (
  <Tutorial meta={${JSON.stringify(meta)}}>
    <Markdown content={html} link={link} />
  </Tutorial>
);`,
        'jsx',
      );
      return `
      {
        id: '${name}',
        title: '${meta.title || ''}',
        route: '${route}',
        section: '${meta.section || ''}',
        page: lazy(() => import('./${generatedName}/tutorial-${name}')),
      }`;
    });

  return imports;
};
