import { PiletApi, PiletMetadata, GlobalStateContext } from 'piral-core';
import { mount } from './mount';
import { PiletVueApi } from './types';

/**
 * Creates a new set of Piral Vue API extensions.
 * @param api The API to extend.
 */
export function createVueApi(_api: PiletApi, _target: PiletMetadata, context: GlobalStateContext): PiletVueApi {
  context.converters.vue = ({ root }) =>  (el, props, ctx) => mount(el, root, props, ctx);
  return {};
}
