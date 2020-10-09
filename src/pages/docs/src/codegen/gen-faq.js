const { getQuestions, getName, generated, generatedName } = require('./paths');
const { getTitle } = require('./utils');
const { render } = require('./markdown');
const { generateStandardPage } = require('./pages');

function getRoute(name) {
  return (name && `/reference/faq/${name}`) || '';
}

module.exports = function () {
  const questions = getQuestions();

  const imports = questions.map((file) => {
    const { mdValue } = render(file, generated);
    const name = getName(file);
    const route = getRoute(name);
    const title = getTitle(name);
    const pageMeta = {
      link: route,
      source: file,
      title,
    };

    this.addDependency(file, { includedInParent: true });
    return generateStandardPage(name, pageMeta, `faq-${name}`, file, mdValue, route, title);
  });

  return imports;
};
