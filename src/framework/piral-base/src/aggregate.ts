import { isfunc } from './utils';
import { inspectPilet } from './inspect';
import type { PiralLoadingHooks, Pilet, PiletApiCreator } from './types';

export function checkCreateApi(createApi: PiletApiCreator) {
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
 * @param hooks The API hooks to apply.
 * @returns The integrated pilets.
 */
export function runPilets(createApi: PiletApiCreator, pilets: Array<Pilet>, hooks: PiralLoadingHooks) {
  const promises: Array<Promise<void> | void> = [];

  if (Array.isArray(pilets)) {
    for (const pilet of pilets) {
      const [, , setupPilet] = inspectPilet(pilet);
      const wait = setupPilet(pilet, createApi, hooks);
      promises.push(wait);
    }
  }

  return Promise.all(promises).then(() => pilets);
}

/**
 * Sets up an evaluated pilet to become an integrated pilet.
 * @param createApi The function to create an API object for the pilet.
 * @param pilet The available evaluated pilet.
 * @param hooks The API hooks to apply.
 * @returns The integrated pilet.
 */
export function runPilet(createApi: PiletApiCreator, pilet: Pilet, hooks: PiralLoadingHooks) {
  const [, , setupPilet] = inspectPilet(pilet);
  const wait = setupPilet(pilet, createApi, hooks);
  return wait.then(() => pilet);
}
