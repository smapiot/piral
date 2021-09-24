import { cleanup } from './cleanup';
import { callfunc } from '../utils';
import type { PiletApiCreator, SinglePilet, PiralUnloadPiletEvent, PiralLoadingHooks } from '../types';

/**
 * Sets up the given single pilet by calling the exported `setup`
 * function on the pilet with the created API.
 * @param app The pilet's evaluated content.
 * @param apiFactory The API factory to be used in the pilet.
 * @param hooks The API hooks to apply.
 */
export function setupSinglePilet(app: SinglePilet, apiFactory: PiletApiCreator, hooks: PiralLoadingHooks) {
  try {
    const api = apiFactory(app);
    callfunc(hooks.setupPilet, app);
    const result = app.setup(api);
    const evtName = 'unload-pilet';
    const handler = (e: PiralUnloadPiletEvent) => {
      if (e.name === app.name) {
        api.off(evtName, handler);
        callfunc(app.teardown, api);
        callfunc(hooks.cleanupPilet, app);
        cleanup(app);
      }
    };
    api.on(evtName, handler);
    return result;
  } catch (e) {
    console.error(`Error while setting up pilet "${app?.name}".`, e);
  }
}
