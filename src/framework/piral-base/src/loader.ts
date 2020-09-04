import { defaultFetchDependency } from './fetch';
import { createEmptyModule, getDependencyResolver } from './utils';
import { compileDependency, includeDependency } from './dependency';
import type {
  AvailableDependencies,
  Pilet,
  PiletApp,
  PiletMetadata,
  PiletDependencyGetter,
  PiletDependencyFetcher,
} from './types';

const inBrowser = typeof document !== 'undefined';

function loadFrom(
  meta: PiletMetadata,
  getDependencies: PiletDependencyGetter,
  loader: (dependencies: AvailableDependencies) => Promise<PiletApp>,
): Promise<Pilet> {
  const dependencies = {
    ...(getDependencies(meta) || {}),
  };
  return loader(dependencies).then(app => ({
    ...app,
    ...meta,
  }));
}

export function createDefaultLoader(
  dependencies?: AvailableDependencies,
  getDependencies?: PiletDependencyGetter,
  fetchDependency?: PiletDependencyFetcher,
) {
  const getDeps = getDependencyResolver(dependencies, getDependencies);
  return getDefaultLoader(getDeps, fetchDependency);
}

export function getDefaultLoader(getDependencies: PiletDependencyGetter, fetchDependency = defaultFetchDependency) {
  return (meta: PiletMetadata): Promise<Pilet> => {
    if (inBrowser && 'requireRef' in meta && meta.requireRef) {
      return loadFrom(meta, getDependencies, deps => includeDependency(meta, deps));
    }

    const { name, link } = meta;

    if (link) {
      return fetchDependency(link).then(content =>
        loadFrom(meta, getDependencies, deps => compileDependency(name, content, link, deps)),
      );
    } else if ('content' in meta && meta.content) {
      return loadFrom(meta, getDependencies, deps => compileDependency(name, meta.content, link, deps));
    } else {
      console.warn('Empty pilet found!', name);
    }

    return Promise.resolve(createEmptyModule(meta));
  };
}
