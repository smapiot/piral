const { readdirSync, writeFileSync, mkdirSync, existsSync, readFileSync } = require('fs');
const { resolve, basename, relative, dirname } = require('path');

const readme = 'README.md';
const docs = resolve(__dirname, '../../../../../docs');
const generated = resolve(__dirname, '__generated__');
const tutorials = resolve(docs, 'tutorials');
const questions = resolve(docs, 'questions');
const commands = resolve(docs, 'commands');
const types = resolve(docs, 'types');
const specs = resolve(docs, 'specs');

function getDocsFrom(dir, tester = /\.md$/) {
  return readdirSync(dir)
    .sort()
    .filter(name => tester.test(name) && name !== readme)
    .map(name => resolve(dir, name));
}

function getTutorials() {
  return getDocsFrom(tutorials);
}

function getQuestions() {
  return getDocsFrom(questions);
}

function getCommands() {
  return getDocsFrom(commands);
}

function getSpecs() {
  return getDocsFrom(specs);
}

function getTypes() {
  return getDocsFrom(types,  /\.json$/);
}

function getDocs() {
  const refFormat = /\- \[(.*)\]\((.*)\)/g;
  const readme = readFileSync(resolve(docs, 'README.md'));
  const results = [];

  do {
    const result = refFormat.exec(readme);

    if (!result) {
      break;
    }

    results.push(resolve(docs, result[2]));
  } while (true);

  return results;
}

function getName(file) {
  return (file && basename(file).replace(/\.md$/, '')) || '';
}

function generateFile(name, content, type = 'codegen') {
  if (!existsSync(generated)) {
    mkdirSync(generated);
  }

  writeFileSync(resolve(generated, `${name}.${type}`), content, 'utf8');
}

function getAbsolutePath(path, basePath = docs) {
  return resolve(dirname(basePath), path);
}

function getRelativePath(path, basePath = docs) {
  return relative(docs, getAbsolutePath(path, basePath));
}

module.exports = {
  generated,
  getTutorials,
  getQuestions,
  getCommands,
  getSpecs,
  getTypes,
  getDocs,
  getName,
  getRelativePath,
  getAbsolutePath,
  generateFile,
};
