const { basename, extname } = require('path');
const { getRelativePath } = require('./paths');

const branch = 'documentation';
const repo = 'smapiot/piral';
const docsFolder = 'docs';
const imageBaseUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${docsFolder}`;
const docBaseUrl = `https://github.com/${repo}/tree/${branch}/${docsFolder}`;

function imgRef(path, basePath) {
  const relPath = getRelativePath(path, basePath);
  return `${imageBaseUrl}/${relPath}`;
}

function docRef(path, basePath) {
  const relPath = getRelativePath(path, basePath);
  return `${docBaseUrl}/${relPath}`;
}

function niceName(path) {
  const ext = extname(path);
  const name = basename(path).replace(ext, '');
  return name;
}

module.exports = {
  imgRef,
  docRef,
  niceName,
};
