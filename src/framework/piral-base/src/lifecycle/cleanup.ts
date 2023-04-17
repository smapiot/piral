import { callfunc, unregisterModules } from '../utils';
import { SinglePilet, PiletApi, PiralUnloadPiletEvent, PiletLifecycleHooks } from '../types';

const evtName = 'unload-pilet';

/**
 * Cleans up the pilet by destroying the referenced stylesheets and
 * running the cleanup steps incl. deletion of referenced global
 * resources.
 * @param app The pilet to be cleaned up.
 * @param api The api for the pilet to be used.
 * @param hooks The hooks to use in the cleanup process.
 */
export function runCleanup(app: SinglePilet, api: PiletApi, hooks: PiletLifecycleHooks) {
  if (typeof document !== 'undefined') {
    const css = document.querySelector(`link[data-origin=${JSON.stringify(app.name)}]`);
    css?.remove();
  }

  const url = app.basePath;

  callfunc(app.teardown, api);
  callfunc(hooks.cleanupPilet, app);

  // check if this was actually set up using a require reference
  if ('requireRef' in app) {
    const depName = app.requireRef;
    delete globalThis[depName];
  }

  // remove the pilet's evaluated modules from SystemJS (except the shared dependencies)
  if (url) {
    unregisterModules(url, Object.values(app.dependencies));
  }
}

/**
 * Prepares the cleanup of a pilet by wiring up a handler to the
 * unload event.
 * @param app The pilet to be prepared for cleanup.
 * @param api The api for the pilet to be used.
 * @param hooks The hooks to use in the cleanup process.
 */
export function prepareCleanup(app: SinglePilet, api: PiletApi, hooks: PiletLifecycleHooks) {
  const handler = (e: PiralUnloadPiletEvent) => {
    if (e.name === app.name) {
      api.off(evtName, handler);
      runCleanup(app, api, hooks);
    }
  };
  api.on(evtName, handler);
}
