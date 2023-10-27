import ptr from 'path-to-regexp';

export function createRouteMatcher(path: string): RegExp {
  return ptr(path);
}
