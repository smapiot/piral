import type { PiletApi, PiletApiCreator, SinglePilet, MultiPilet, Pilet, PiralUnloadPiletEvent } from './types';

/**
 * Sets up the given single pilet by calling the exported `setup`
 * function on the pilet with the created API.
 * @param app The pilet's evaluated content.
 * @param api The generated API for the pilet.
 */
export function setupSinglePilet(app: SinglePilet, api: PiletApi) {
  try {
    const result = app.setup(api);

    if (typeof app.teardown === 'function') {
      const evtName = 'unload-pilet';
      const handler = (e: PiralUnloadPiletEvent) => {
        if (e.name === app.name) {
          api.off(evtName, handler);
          app.teardown(api);
        }
      };
      api.on(evtName, handler);
    }

    return result;
  } catch (e) {
    console.error(`Error while setting up ${app?.name}.`, e);
  }
}

/**
 * Sets up the given multi pilet by calling the exported `setup`
 * function on the pilet with the API factory.
 * @param app The pilet's evaluated content.
 * @param apiFactory The API factory to be used in the bundle.
 */
export function setupMultiPilet(app: MultiPilet, apiFactory: PiletApiCreator) {
  try {
    return app.setup(apiFactory);
  } catch (e) {
    console.error(`Error while setting up ${app?.name}.`, e);
  }
}

/**
 * Sets up the given pilet by calling the exported `setup` function
 * on the pilet.
 * @param app The pilet's evaluated content.
 * @param apiFactory The API factory to be used in the bundle.
 */
export function setupPilet(app: Pilet, apiFactory: PiletApiCreator) {
  if ('bundle' in app) {
    return setupMultiPilet(app, apiFactory);
  } else {
    return setupSinglePilet(app, apiFactory(app));
  }
}
