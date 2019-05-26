const imageBaseUrl = 'https://raw.githubusercontent.com/smapiot/piral/master/docs';
const docBaseUrl = 'https://github.com/smapiot/piral/tree/master/docs';

export function imgRef(path: string) {
  return `${imageBaseUrl}/${path}?sanitize=true`;
}

export function docRef(path: string) {
  return `${docBaseUrl}/${path}`;
}
