import { Extend } from 'piral-core';
import { mount } from './mount';
import { PiletHyperappApi } from './types';

/**
 * Creates a new set of Piral hyperapp API extensions.
 */
export function createHyperappApi(): Extend<PiletHyperappApi> {
  return context => {
    context.converters.hyperapp = component => (el, props, ctx) =>
      mount(el, component.root, props, ctx, component.state, component.actions);
    return {};
  };
}
