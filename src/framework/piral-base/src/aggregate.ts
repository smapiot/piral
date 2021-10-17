import { isfunc } from './utils';
import { setupPilet } from './setup';
import type { Pilet, PiletApiCreator } from './types';

function checkCreateApi(createApi: PiletApiCreator) {
  if (!isfunc(createApi)) {
    console.warn('Invalid `createApi` function. Skipping pilet installation.');
    return false;
  }

  return true;
}

/**
 * Sets up the evaluated pilets to become integrated pilets.
 * @param createApi The function to create an API object for a pilet.
 * @param pilets The available evaluated app pilets.
 * @returns The integrated pilets.
 */
export function createPilets(createApi: PiletApiCreator, pilets: Array<Pilet>) {
  const promises: Array<Promise<void> | void> = [];

  if (checkCreateApi(createApi) && Array.isArray(pilets)) {
    for (const pilet of pilets) {
      promises.push(setupPilet(pilet, createApi));
    }
  }

  return Promise.all(promises).then(() => pilets);
}

/**
 * Sets up an evaluated pilet to become an integrated pilet.
 * @param createApi The function to create an API object for the pilet.
 * @param pilet The available evaluated pilet.
 * @returns The integrated pilet.
 */
export function createPilet(createApi: PiletApiCreator, pilet: Pilet) {
  const promises: Array<Promise<void> | void> = [];

  if (checkCreateApi(createApi)) {
    promises.push(setupPilet(pilet, createApi));
  }

  return Promise.all(promises).then(() => pilet);
}
