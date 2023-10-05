// Unfortunately `require`d:
// * exports are otherwise potentially converted by, e.g., Parcel (see #385)
const ptr = require('path-to-regexp');

export function createRouteMatcher(path: string): RegExp {
  return ptr(path);
}
