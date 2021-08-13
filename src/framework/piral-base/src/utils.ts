import type { PiletMetadata } from './types';

export function isfunc(f: any): f is Function {
  return typeof f === 'function';
}

export function createEmptyModule(meta: PiletMetadata) {
  return {
    ...meta,
    setup() {},
  };
}

export function getBasePath(link: string) {
  if (link) {
    const idx = link.lastIndexOf('/');
    return link.substr(0, idx + 1);
  }

  return link;
}

export function setBasePath(meta: PiletMetadata, link: string) {
  meta.basePath = getBasePath(link);
  return link;
}
