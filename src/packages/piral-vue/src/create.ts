import { PiralCoreApi } from 'piral-core';
import { mount } from './mount';
import { PiralVueApi } from './types';

/**
 * Creates a new set of Piral Vue API extensions.
 * @param api The API to extend.
 */
export function createVueApi<T extends PiralCoreApi<any>>(api: T): PiralVueApi<T> {
  return {
    registerTileVue(id, root, options) {
      api.registerTileX(id, (el, props, ctx) => mount(el, root, props, ctx), options);
    },
    registerPageVue(route, root) {
      api.registerPageX(route, (el, props, ctx) => mount(el, root, props, ctx));
    },
    registerExtensionVue<TOpt>(slot, root, defaults) {
      api.registerExtensionX<TOpt>(slot, (el, props, ctx) => mount(el, root, props, ctx), defaults);
    },
    registerMenuVue(id, root, settings) {
      api.registerMenuX(id, (el, props, ctx) => mount(el, root, props, ctx), settings);
    },
    registerModalVue<TOpt>(id, root, defaults) {
      api.registerModalX<TOpt>(id, (el, props, ctx) => mount(el, root, props, ctx), defaults);
    },
  };
}
