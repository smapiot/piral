const branch = 'documentation';
const repo = 'smapiot/piral';
const docsFolder = 'docs';
const imageBaseUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${docsFolder}`;
const docBaseUrl = `https://github.com/${repo}/tree/${branch}/${docsFolder}`;

export function imgRef(path: string) {
  const relPath = path.replace(/^..\//g, '');
  return `${imageBaseUrl}/${relPath}?sanitize=true`;
}

export function docRef(path: string) {
  return `${docBaseUrl}/${path}`;
}
