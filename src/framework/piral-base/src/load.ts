import { isfunc } from './utils';
import { includeScriptDependency } from './dependency';
import type { Pilet, PiletRequester, PiletLoader, PiletMetadata, PiletApp, PiletUmdMetadata } from './types';

const depContext = {};

function loadSharedDependencies(sharedDependencies: Record<string, string> | undefined) {
  if (sharedDependencies && typeof sharedDependencies === 'object') {
    const sharedDependencyNames = Object.keys(sharedDependencies);

    return Promise.all(
      sharedDependencyNames.map((name) => {
        return depContext[name] || (depContext[name] = includeScriptDependency(sharedDependencies[name]));
      }),
    );
  }

  return Promise.resolve();
}

function checkFetchPilets(fetchPilets: PiletRequester) {
  if (!isfunc(fetchPilets)) {
    console.error('Could not get the pilets. Provide a valid `fetchPilets` function.');
    return false;
  }

  return true;
}

/**
 * Loads the pilets metadata and puts them in the cache, if provided.
 * @param fetchPilets The function to resolve the pilets.
 * @param cache The optional cache to use initially and update later.
 */
export function loadMetadata(fetchPilets: PiletRequester): Promise<Array<PiletMetadata>> {
  if (checkFetchPilets(fetchPilets)) {
    return fetchPilets().then((pilets) => {
      if (!Array.isArray(pilets)) {
        throw new Error('The fetched pilets metadata is not an array.');
      }

      return pilets.map((meta) => ({ ...meta }));
    });
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
export function loadPilets(fetchPilets: PiletRequester, loadPilet: PiletLoader): Promise<Array<Pilet>> {
  return loadMetadata(fetchPilets).then((pilets) => Promise.all(pilets.map(loadPilet)));
}

/**
 * Loads a pilet from the specified metadata and loader function.
 * @param meta The metadata of the pilet.
 * @param loadPilet The loader function derived for the pilet.
 * @returns The evaluated pilet, which can then be integrated.
 */
export function loadFrom(meta: PiletMetadata, loadPilet: () => Promise<PiletApp>): Promise<Pilet> {
  return loadSharedDependencies(meta.dependencies)
    .then(loadPilet)
    .then((app: any) => ({
      ...app,
      ...meta,
    }));
}
