import { PiralCoreApi } from 'piral-core';
import { mount } from './mount';
import { PiralHyperappApi } from './types';

/**
 * Creates a new set of Piral hyperapp API extensions.
 * @param api The API to extend.
 */
export function createHyperappApi<T extends PiralCoreApi<any>>(api: T): PiralHyperappApi<T> {
  return {
    registerTileHyperapp(id, root, state, actions, options) {
      api.registerTileX(id, (el, props, ctx) => mount(el, root, props, ctx, state, actions), options);
    },
    registerPageHyperapp(route, root, state, actions) {
      api.registerPageX(route, (el, props, ctx) => mount(el, root, props, ctx, state, actions));
    },
    registerExtensionHyperapp(slot, root, state, actions, defaults) {
      api.registerExtensionX(slot, (el, props, ctx) => mount(el, root, props as any, ctx, state, actions), defaults);
    },
    registerMenuHyperapp(id, root, state, actions, settings) {
      api.registerMenuX(id, (el, props, ctx) => mount(el, root, props, ctx, state, actions), settings);
    },
    registerModalHyperapp(id, root, state, actions, defaults) {
      api.registerModalX(id, (el, props, ctx) => mount(el, root, props as any, ctx, state, actions), defaults);
    },
  };
}
