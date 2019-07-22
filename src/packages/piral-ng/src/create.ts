import { PiralCoreApi } from 'piral-core';
import { ngTile, ngPage, ngExtension, ngMenu, ngModal } from './register';
import { PiralNgApi } from './types';

/**
 * Creates a new set of Piral Angular API extensions.
 * @param api The API to extend.
 */
export function createNgApi<T extends PiralCoreApi<any>>(api: T): PiralNgApi {
  return {
    registerTileNg(id, component, options) {
      ngTile(api, id, component, options);
    },
    registerPageNg(route, component) {
      ngPage(api, route, component);
    },
    registerExtensionNg(slot, component, defaults) {
      ngExtension(api, slot, component, defaults);
    },
    registerMenuNg(id, component, settings) {
      ngMenu(api, id, component, settings);
    },
    registerModalNg(id, component, defaults) {
      ngModal(api, id, component, defaults);
    },
  };
}
