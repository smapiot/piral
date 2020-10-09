const { getTutorials, getName, generated } = require('./paths');
const { render } = require('./markdown');
const { docRef } = require('./utils');
const { generatePage } = require('./pages');

function getRoute(name) {
  return (name && `/guidelines/tutorials/${name}`) || '';
}

module.exports = function () {
  const files = getTutorials();

  const imports = files.map((file) => {
    const name = getName(file);
    const route = getRoute(name);
    const { mdValue, meta = {} } = render(file, generated);
    const pageMeta = {
      link: route,
      source: file,
      ...meta,
    };
    const head = `
      import { Tutorial, Markdown } from '../../scripts/components';

      const link = "${docRef(file)}";
      const html = ${mdValue};
    `;
    const body = `
      <Tutorial meta={${JSON.stringify(meta)}}>
        <Markdown content={html} link={link} />
      </Tutorial>
    `;

    this.addDependency(file, { includedInParent: true });
    return generatePage(name, pageMeta, `tutorial-${name}`, head, body, route, meta.title, meta.section);
  });

  return imports;
};
