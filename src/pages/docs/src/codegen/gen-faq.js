const { getQuestions, generateFile, getName, generated, generatedName } = require('./paths');
const { docRef, capitalize } = require('./utils');
const { render } = require('./markdown');

function getRoute(name) {
  return (name && `/reference/faq/${name}`) || '';
}

module.exports = function() {
  const questions = getQuestions();

  const imports = questions.map(file => {
    const { mdValue } = render(file, generated);
    const name = getName(file);
    const route = getRoute(name);
    this.addDependency(file, { includedInParent: true });
    generateFile(
      `faq-${name}`,
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
      title: '${capitalize(name)}',
      route: '${route}',
      page: lazy(() => import('./${generatedName}/faq-${name}')),
    }`;
  });

  return imports;
};