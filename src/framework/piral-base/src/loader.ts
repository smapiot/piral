import { defaultFetchDependency } from './fetch';
import { createEmptyModule, getDependencyResolver } from './utils';
import { compileDependency, includeDependency, includeBundle } from './dependency';
import type {
  AvailableDependencies,
  Pilet,
  PiletMetadata,
  PiletDependencyGetter,
  PiletDependencyFetcher,
  DefaultLoaderConfig,
  PiletApp,
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
  return loader(dependencies).then((app: any) => ({
    ...app,
    ...meta,
  }));
}

export function createDefaultLoader(
  dependencies?: AvailableDependencies,
  getDependencies?: PiletDependencyGetter,
  fetchDependency?: PiletDependencyFetcher,
  config?: DefaultLoaderConfig,
) {
  const getDeps = getDependencyResolver(dependencies, getDependencies);
  return getDefaultLoader(getDeps, fetchDependency, config);
}

export function getDefaultLoader(
  getDependencies: PiletDependencyGetter,
  fetchDependency = defaultFetchDependency,
  config: DefaultLoaderConfig = {},
) {
  return (meta: PiletMetadata): Promise<Pilet> => {
    if (inBrowser && 'requireRef' in meta && meta.requireRef) {
      return loadFrom(meta, getDependencies, (deps) => includeDependency(meta, deps, config.crossOrigin));
    } else if (inBrowser && 'bundle' in meta && meta.bundle) {
      return loadFrom(meta, getDependencies, (deps) => includeBundle(meta, deps, config.crossOrigin));
    }

    const { name, link } = meta;

    if (link) {
      return fetchDependency(link).then((content) =>
        loadFrom(meta, getDependencies, (deps) => compileDependency(name, content, link, deps)),
      );
    } else if ('content' in meta && meta.content) {
      return loadFrom(meta, getDependencies, (deps) => compileDependency(name, meta.content, link, deps));
    } else {
      console.warn('Empty pilet found!', name, link);
    }

    return Promise.resolve(createEmptyModule(meta));
  };
}
