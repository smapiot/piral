import { isfunc } from './utils';
import { setupPilet } from './setup';
import { GenericPilet, GenericPiletApiCreator } from './types';

function checkCreateApi<TApi>(createApi: GenericPiletApiCreator<TApi>) {
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
export function createPilets<TApi>(createApi: GenericPiletApiCreator<TApi>, pilets: Array<GenericPilet<TApi>>) {
  if (checkCreateApi(createApi)) {
    for (const pilet of pilets) {
      const api = createApi(pilet);
      setupPilet(pilet, api);
    }
  }

  return pilets;
}

/**
 * Sets up an evaluated pilet to become an integrated pilet.
 * @param createApi The function to create an API object for the pilet.
 * @param pilet The available evaluated pilet.
 * @returns The integrated pilet.
 */
export function createPilet<TApi>(createApi: GenericPiletApiCreator<TApi>, pilet: GenericPilet<TApi>) {
  if (checkCreateApi(createApi)) {
    const api = createApi(pilet);
    setupPilet(pilet, api);
  }

  return pilet;
}
