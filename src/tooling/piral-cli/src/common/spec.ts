import { existsSync, readFileSync, statSync } from 'fs';
import { computeHash, computeIntegrity } from './hash';

const checkV1 = /^\/\/\s*@pilet\s+v:1\s*\(([A-Za-z0-9\_\:\-]+)\)/;
const checkV2 = /^\/\/\s*@pilet\s+v:2\s*(?:\(([A-Za-z0-9\_\:\-]+),\s*(.*)\))?/;
const isUrl = /^https?:\/\//;

function getDependencies(deps: string, basePath: string) {
  try {
    const depMap = JSON.parse(deps);

    if (depMap && typeof depMap === 'object') {
      return Object.keys(depMap).reduce((obj, depName) => {
        const depUrl = depMap[depName];

        if (typeof depUrl === 'string') {
          const url = isUrl.test(depUrl) ? depUrl : `${basePath}${depUrl}`;
          obj[depName] = url;
        }

        return obj;
      }, {});
    }
  } catch {}

  return {};
}

export function getPiletSpecMeta(target: string, basePath: string) {
  if (existsSync(target) && statSync(target).isFile()) {
    const content = readFileSync(target, 'utf8');

    if (checkV1.test(content)) {
      // uses single argument; requireRef (required)
      const [, requireRef] = checkV1.exec(content);
      return {
        spec: 'v1',
        requireRef,
        integrity: computeIntegrity(content),
      };
    } else if (checkV2.test(content)) {
      // uses two arguments; requireRef and dependencies as JSON (required)
      const [, requireRef, plainDependencies] = checkV2.exec(content);
      return {
        spec: 'v2',
        requireRef,
        dependencies: getDependencies(plainDependencies, basePath),
      };
    } else {
      return {
        spec: 'v0',
        hash: computeHash(content),
        noCache: true,
      };
    }
  }

  return {};
}
