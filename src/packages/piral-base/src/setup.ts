import { GenericPilet } from './types';

/**
 * Sets up the given pilet by calling the exported `setup` function
 * on the pilet.
 * @param app The pilet's evaluated content.
 * @param api The generated API for the pilet.
 */
export function setupPilet<TApi>(app: GenericPilet<TApi>, api: TApi) {
  try {
    return app.setup(api);
  } catch (e) {
    console.error(`Error while setting up ${app && app.name}.`, e);
  }
}
