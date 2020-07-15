const { readFileSync } = require('fs');
const { getCoreTypes } = require('./paths');
const { generateCustomPage } = require('./pages');

function getRoute(name) {
  return (name && `/types/${name}`) || '';
}

module.exports = function() {
  const files = getCoreTypes();

  const imports = files.map(file => {
    const body = readFileSync(file, 'utf8');
    const name = file
      .split('\\')
      .join('/')
      .split('/')
      .pop()
      .replace('.json', '');
    const route = getRoute(name);
    const pageMeta = {
      link: route,
      source: file,
      title: name,
    };
    const imports = `
      import { TypeInfo } from '../../scripts/components';
    `;
    const content = `
      <TypeInfo key="${name}">{${body}}</TypeInfo>
    `;

    this.addDependency(file, { includedInParent: true });
    return generateCustomPage(name, pageMeta, `types-${name}`, imports, '', content, route, name);
  });

  return imports;
};
