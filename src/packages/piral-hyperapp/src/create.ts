import { GlobalStateContext } from 'piral-core';
import { mount } from './mount';
import { PiletHyperappApi } from './types';

/**
 * Creates a new set of Piral hyperapp API extensions.
 * @param api The API to extend.
 */
export function createHyperappApi(context: GlobalStateContext): PiletHyperappApi {
  context.converters.hyperapp = component => (el, props, ctx) =>
    mount(el, component.root, props, ctx, component.state, component.actions);
  return {};
}
