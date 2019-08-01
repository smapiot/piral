import { PiralCoreApi } from 'piral-core';
import { ngTile, ngPage, ngExtension, ngMenu, ngModal } from './register';
import { PiralNgApi } from './types';

/**
 * Creates a new set of Piral Angular API extensions.
 * @param api The API to extend.
 */
export function createNgApi<T extends PiralCoreApi<any>>(api: T): PiralNgApi {
  let next = ~~(Math.random() * 10000);
  return {
    registerTileNg(id, component, options?) {
      if (typeof id === 'string') {
        ngTile(api, id, component, options);
      } else {
        ngTile(api, `${next++}`, id, component);
      }
    },
    registerPageNg(route, component) {
      ngPage(api, route, component);
    },
    registerExtensionNg(slot, component, defaults) {
      ngExtension(api, slot, component, defaults);
    },
    registerMenuNg(id, component, settings?) {
      if (typeof id === 'string') {
        ngMenu(api, id, component, settings);
      } else {
        ngMenu(api, `${next++}`, id, component);
      }
    },
    registerModalNg(id, component, defaults) {
      ngModal(api, id, component, defaults);
    },
  };
}
