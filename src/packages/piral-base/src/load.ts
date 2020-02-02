import { isfunc, createEmptyModule, getDependencyResolver } from './utils';
import { defaultFetchDependency } from './fetch';
import { compileDependency } from './dependency';
import {
  PiletMetadata,
  Pilet,
  PiletDependencyGetter,
  PiletRequester,
  PiletDependencyFetcher,
  AvailableDependencies,
} from './types';

function loadFromContent(
  meta: PiletMetadata,
  content: string,
  getDependencies: PiletDependencyGetter,
  link?: string,
): Promise<Pilet> {
  const dependencies = {
    ...(getDependencies(meta) || {}),
  };
  return compileDependency(meta.name, content, link, dependencies).then(app => ({
    ...app,
    ...meta,
  }));
}

function checkFetchPilets(fetchPilets: PiletRequester) {
  if (!isfunc(fetchPilets)) {
    console.error('Could not get the pilets. Provide a valid `fetchPilets` function.');
    return false;
  }

  return true;
}

/**
 * Loads the given raw pilet content by resolving its dependencies and
 * evaluating the content.
 * @param meta The raw pilet content as received from the server.
 * @param fetchDependency The function to resolve a dependency.
 * @param dependencies The already evaluated global dependencies.
 * @returns A promise leading to the pilet content which has the metadata and a `setup` function.
 */
export function loadPilet(
  meta: PiletMetadata,
  getDependencies: PiletDependencyGetter,
  fetchDependency = defaultFetchDependency,
): Promise<Pilet> {
  const { link, content } = meta;
  const retrieve = link ? fetchDependency(link) : content ? Promise.resolve(content) : undefined;

  if (retrieve) {
    return retrieve.then(content => loadFromContent(meta, content, getDependencies, link));
  } else {
    console.warn('Empty pilet found!', meta.name);
  }

  return Promise.resolve(createEmptyModule(meta));
}

/**
 * Loads the pilets metadata and puts them in the cache, if provided.
 * @param fetchPilets The function to resolve the pilets.
 * @param cache The optional cache to use initially and update later.
 */
export function loadMetadata(fetchPilets: PiletRequester) {
  if (checkFetchPilets(fetchPilets)) {
    return fetchPilets();
  }

  return Promise.resolve([]);
}

/**
 * Loads the pilets by first getting them, then evaluating the raw content.
 * @param fetchPilets The function to resolve the pilets.
 * @param fetchDependency A function to fetch the dependencies. By default, `fetch` is used.
 * @param dependencies The availablly global dependencies, if any.
 * @returns A promise leading to the evaluated pilets.
 */
export function loadPilets(
  fetchPilets: PiletRequester,
  fetchDependency?: PiletDependencyFetcher,
  globalDependencies?: AvailableDependencies,
  getLocalDependencies?: PiletDependencyGetter,
): Promise<Array<Pilet>> {
  const getDependencies = getDependencyResolver(globalDependencies, getLocalDependencies);

  return loadMetadata(fetchPilets).then(pilets =>
    Promise.all(pilets.map(m => loadPilet(m, getDependencies, fetchDependency))),
  );
}
