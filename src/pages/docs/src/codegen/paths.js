const { readdirSync, writeFileSync, mkdirSync, existsSync, readFileSync } = require('fs');
const { resolve, basename, relative, dirname, extname } = require('path');

const readme = 'README.md';
const generatedName = '__generated__';
const categoryPrefix = 'plugin-';
const docs = resolve(__dirname, '../../../../../docs');
const packages = resolve(__dirname, '../../../../packages');
const generated = resolve(__dirname, generatedName);
const tutorials = resolve(docs, 'tutorials');
const questions = resolve(docs, 'questions');
const reference = resolve(docs, 'reference');
const commands = resolve(docs, 'commands');
const types = resolve(docs, 'types');
const specs = resolve(docs, 'specs');

const coreNames = ['piral', 'piral-base', 'piral-core', 'piral-cli', 'piral-ext', 'piral-ssr-utils'];
const coreTypes = coreNames.map(name => `${name}.json`);

function getCategory(keywords) {
  return keywords.filter(keyword => keyword.startsWith(categoryPrefix)).map(keyword => keyword.substr(categoryPrefix.length))[0];
}

function readReadme(dir) {
  const refFormat = /\- \[(.*)\]\((.*)\)/g;
  const readme = readFileSync(resolve(dir, 'README.md'));
  const results = [];

  do {
    const result = refFormat.exec(readme);

    if (!result) {
      break;
    }

    results.push(resolve(dir, result[2]));
  } while (true);

  return results;
}

function getDocsFrom(dir, tester = /\.md$/) {
  return readdirSync(dir)
    .sort()
    .filter(name => tester.test(name) && name !== readme)
    .map(name => resolve(dir, name));
}

function isCoreType(fileName) {
  return coreTypes.some(type => fileName.endsWith(type));
}

function getTutorials() {
  return getDocsFrom(tutorials);
}

function getQuestions() {
  return getDocsFrom(questions);
}

function getReferences() {
  return readReadme(reference);
}

function getCommands() {
  return getDocsFrom(commands);
}

function getSpecs() {
  return getDocsFrom(specs);
}

function getCoreTypes() {
  return getDocsFrom(types, /\.json$/).filter(file => isCoreType(file));
}

function getPluginCategories() {
  return readdirSync(packages)
    .map(pckg => resolve(packages, pckg, 'package.json'))
    .map(packageJson => existsSync(packageJson) && getCategory(require(packageJson).keywords))
    .filter((item, index, self) => item && self.indexOf(item) === index);
}

function getPluginCategory(plugin) {
  return getCategory(plugin.keywords);
}

function getPluginTypes() {
  return getDocsFrom(types, /\.json$/).filter(file => !isCoreType(file));
}

function getPluginImage(name) {
  const rest = name.replace('piral-', '');
  const hasImage = existsSync(resolve(__dirname, '..', 'assets', 'extensions', `${rest}.png`));
  return hasImage ? `extensions/${rest}.png` : 'top-extensions.png';
}

function getDocs() {
  return readReadme(docs);
}

function getName(file) {
  return (file && basename(file).replace(extname(file), '')) || '';
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
  generatedName,
  getTutorials,
  getQuestions,
  getReferences,
  getCommands,
  getPluginCategory,
  getPluginCategories,
  getPluginTypes,
  getPluginImage,
  getSpecs,
  getCoreTypes,
  getDocs,
  getName,
  getRelativePath,
  getAbsolutePath,
  generateFile,
};
