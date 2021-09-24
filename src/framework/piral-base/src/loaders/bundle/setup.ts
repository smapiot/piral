import { callfunc } from '../../utils';
import type { PiletApiCreator, MultiPilet, PiralLoadingHooks } from '../../types';

/**
 * Sets up the given multi pilet by calling the exported `setup`
 * function on the pilet with the API factory.
 * @param app The pilet's evaluated content.
 * @param apiFactory The API factory to be used in the bundle.
 * @param hooks The API hooks to apply.
 */
export function setupPiletBundle(app: MultiPilet, apiFactory: PiletApiCreator, hooks: PiralLoadingHooks) {
  try {
    callfunc(hooks.setupPilet, app);
    return app.setup(apiFactory);
  } catch (e) {
    console.error(`Error while setting up pilet bundle.`, e);
  }
}
