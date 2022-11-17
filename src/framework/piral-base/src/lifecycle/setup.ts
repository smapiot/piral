import { prepareCleanup } from './cleanup';
import { callfunc, promisify } from '../utils';
import type { PiletApiCreator, SinglePilet, PiletLifecycleHooks, MultiPilet } from '../types';

function logError(name: string, e: Error) {
  console.error(`Error while setting up ${name}.`, e);
}

function withCatch(result: void | Promise<void>, name: string) {
  if (result instanceof Promise) {
    return result.catch((e) => logError(name, e));
  }

  return promisify(result);
}

/**
 * Sets up the given single pilet by calling the exported `setup`
 * function on the pilet with the created API.
 * @param app The pilet's evaluated content.
 * @param apiFactory The API factory to be used in the pilet.
 * @param hooks The API hooks to apply.
 */
export function setupSinglePilet(app: SinglePilet, apiFactory: PiletApiCreator, hooks: PiletLifecycleHooks) {
  const name = app?.name;

  try {
    const api = apiFactory(app);
    callfunc(hooks.setupPilet, app);
    const result = app.setup(api);
    prepareCleanup(app, api, hooks);
    return withCatch(result, name);
  } catch (e) {
    logError(name, e);
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
  const name = app?.name || 'pilet bundle';

  try {
    callfunc(hooks.setupPilet, app);
    const result = app.setup(apiFactory);
    return withCatch(result, name);
  } catch (e) {
    logError(name, e);
  }

  return promisify();
}
