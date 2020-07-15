const { generateFile, generatedName } = require('./paths');
const { docRef } = require('./utils');

function generatePage(name, meta, targetFile, head, body, route, title, section = '', link = '') {
  generateFile(
    targetFile,
    `// ${JSON.stringify(meta)}
import * as React from 'react';
${head}

export default () => (
  ${body}
);`,
    'jsx',
  );

  return `
  {
    id: '${name}',
    route: '${route}',
    title: '${title}',
    link: '${link || route}',
    section: '${section}',
    page: lazy(() => import('./${generatedName}/${targetFile}.jsx')),
  }`;
}

function generateCustomPage(name, meta, targetFile, imports, declarations, content, route, title, section = '', link = '') {
  const head = `
    import { PageContent } from '../../scripts/components';
    ${imports}

    ${declarations}
  `;
  const body = `
    <PageContent>
      ${content}
    </PageContent>
  `;
  return generatePage(name, meta, targetFile, head, body, route, title, section, link);
}

function generateStandardPage(name, meta, targetFile, sourceFile, mdValue, route, title, section = '', link = '') {
  const imports = `
    import { Markdown } from '../../scripts/components';
  `;
  const declarations = `
    const link = "${docRef(sourceFile)}";
    const html = ${mdValue};
  `;
  const content = `
    <Markdown content={html} link={link} />
  `;
  return generateCustomPage(name, meta, targetFile, imports, declarations, content, route, title, section, link);
}

module.exports = {
  generatePage,
  generateCustomPage,
  generateStandardPage,
};
