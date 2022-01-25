import { prepareCleanup } from './cleanup';
import { callfunc, promisify } from '../utils';
import type { PiletApiCreator, SinglePilet, PiletLifecycleHooks, MultiPilet } from '../types';

/**
 * Sets up the given single pilet by calling the exported `setup`
 * function on the pilet with the created API.
 * @param app The pilet's evaluated content.
 * @param apiFactory The API factory to be used in the pilet.
 * @param hooks The API hooks to apply.
 */
export function setupSinglePilet(app: SinglePilet, apiFactory: PiletApiCreator, hooks: PiletLifecycleHooks) {
  try {
    const api = apiFactory(app);
    callfunc(hooks.setupPilet, app);
    const result = app.setup(api);
    prepareCleanup(app, api, hooks);
    return promisify(result);
  } catch (e) {
    console.error(`Error while setting up pilet "${app?.name}".`, e);
  }

  return promisify();
}

/**
 * Sets up the given multi pilet by calling the exported `setup`
 * function on the pilet with the API factory.
 * @param app The pilet's evaluated content.
 * @param apiFactory The API factory to be used in the bundle.
 * @param hooks The API hooks to apply.
 */
export function setupPiletBundle(app: MultiPilet, apiFactory: PiletApiCreator, hooks: PiletLifecycleHooks) {
  try {
    callfunc(hooks.setupPilet, app);
    const result = app.setup(apiFactory);
    return promisify(result);
  } catch (e) {
    console.error(`Error while setting up pilet bundle.`, e);
  }

  return promisify();
}
