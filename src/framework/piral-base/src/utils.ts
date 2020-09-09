import type { PiletMetadata, AvailableDependencies, PiletDependencyGetter } from './types';

const defaultGlobalDependencies: AvailableDependencies = {};
const defaultGetDependencies: PiletDependencyGetter = () => false;

export function isfunc(f: any): f is Function {
  return typeof f === 'function';
}

export function createEmptyModule(meta: PiletMetadata) {
  return {
    ...meta,
    setup() {},
  };
}

export function getDependencyResolver(
  globalDependencies = defaultGlobalDependencies,
  getLocalDependencies = defaultGetDependencies,
): PiletDependencyGetter {
  return (target) => {
    return getLocalDependencies(target) || globalDependencies;
  };
}
