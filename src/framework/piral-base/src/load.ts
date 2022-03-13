import { isfunc, promisify } from './utils';
import type { PiletRequester, PiletLoader, PiletEntries, Pilet } from './types';

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
export function loadMetadata(fetchPilets: PiletRequester): Promise<PiletEntries> {
  if (checkFetchPilets(fetchPilets)) {
    return fetchPilets().then((pilets) => {
      if (!Array.isArray(pilets)) {
        throw new Error('The fetched pilets metadata is not an array.');
      }

      return pilets.map((meta) => ({ ...meta }));
    });
  }

  return promisify<PiletEntries>([]);
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
