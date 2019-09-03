import { PiletApi } from 'piral-core';
import { mount } from './mount';
import { PiralVueApi } from './types';

/**
 * Creates a new set of Piral Vue API extensions.
 * @param api The API to extend.
 */
export function createVueApi(api: PiletApi): PiralVueApi {
  return {
    registerTileVue(id, root, options?) {
      if (typeof id === 'string') {
        api.registerTileX(id, (el, props, ctx) => mount(el, root, props, ctx), options);
      } else {
        api.registerTileX((el, props, ctx) => mount(el, id, props, ctx), root);
      }
    },
    registerPageVue(route, root) {
      api.registerPageX(route, (el, props, ctx) => mount(el, root, props, ctx));
    },
    registerExtensionVue<TOpt>(slot, root, defaults) {
      api.registerExtensionX<TOpt>(slot, (el, props, ctx) => mount(el, root, props, ctx), defaults);
    },
    registerMenuVue(id, root, settings?) {
      if (typeof id === 'string') {
        api.registerMenuX(id, (el, props, ctx) => mount(el, root, props, ctx), settings);
      } else {
        api.registerMenuX((el, props, ctx) => mount(el, id, props, ctx), root);
      }
    },
    registerModalVue<TOpt>(id, root, defaults) {
      api.registerModalX<TOpt>(id, (el, props, ctx) => mount(el, root, props, ctx), defaults);
    },
  };
}
