import { PiletApi } from 'piral-core';
import { mount } from './mount';
import { PiralHyperappApi } from './types';

/**
 * Creates a new set of Piral hyperapp API extensions.
 * @param api The API to extend.
 */
export function createHyperappApi(api: PiletApi): PiralHyperappApi {
  return {
    registerTileHyperapp(id, root, state, actions, options?) {
      if (typeof id === 'string') {
        api.registerTileX(id, (el, props, ctx) => mount(el, root, props, ctx, state, actions), options);
      } else {
        api.registerTileX((el, props, ctx) => mount(el, id, props, ctx, root, state), actions);
      }
    },
    registerPageHyperapp(route, root, state, actions) {
      api.registerPageX(route, (el, props, ctx) => mount(el, root, props, ctx, state, actions));
    },
    registerExtensionHyperapp(slot, root, state, actions, defaults) {
      api.registerExtensionX(slot, (el, props, ctx) => mount(el, root, props as any, ctx, state, actions), defaults);
    },
    registerMenuHyperapp(id, root, state, actions, settings?) {
      if (typeof id === 'string') {
        api.registerMenuX(id, (el, props, ctx) => mount(el, root, props, ctx, state, actions), settings);
      } else {
        api.registerMenuX((el, props, ctx) => mount(el, id, props, ctx, root, state), actions);
      }
    },
    registerModalHyperapp(id, root, state, actions, defaults) {
      api.registerModalX(id, (el, props, ctx) => mount(el, root, props as any, ctx, state, actions), defaults);
    },
  };
}
