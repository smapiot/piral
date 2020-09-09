const { basename, extname, resolve } = require('path');
const { getRelativePath, getAbsolutePath } = require('./paths');

const branch = 'documentation';
const repo = 'smapiot/piral';
const docsFolder = 'docs';
const docBaseUrl = `https://github.com/${repo}/tree/${branch}/${docsFolder}`;
const rootPath = resolve(__dirname, '../../../../../package.json');

function imgRef(path, basePath) {
  return getAbsolutePath(path, basePath);
}

function docRef(path, basePath) {
  const relPath = getRelativePath(path, basePath);
  return `${docBaseUrl}/${relPath}`;
}

function capitalize(str) {
  switch (str) {
    case 'api':
      return 'API';
    case 'cli':
      return 'CLI';
    default:
      return str[0].toUpperCase() + str.substr(1);
  }
}

function getTitle(file) {
  const parts = niceName(file).split('-');
  return parts.map(m => capitalize(m)).join(' ');
}

function niceName(path) {
  const ext = extname(path);
  const name = basename(path).replace(ext, '');
  return name;
}

module.exports = {
  imgRef,
  docRef,
  capitalize,
  niceName,
  getTitle,
  rootPath,
};
