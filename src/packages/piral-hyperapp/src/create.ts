import { Extend } from 'piral-core';
import { mountHyperapp, createHyperappElement } from './mount';
import { PiletHyperappApi } from './types';

/**
 * Available configuration options for the Hyperapp plugin.
 */
export interface HyperappConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for the Hyperapp integration.
 */
export function createHyperappApi(config: HyperappConfig = {}): Extend<PiletHyperappApi> {
  const { rootName = 'slot' } = config;

  return context => {
    context.converters.hyperapp = component => ({
      mount(el, props, ctx) {
        mountHyperapp(el, component.root, props, ctx, component.state, component.actions);
      },
      update(el, props, ctx) {
        mountHyperapp(el, component.root, props, ctx, component.state, component.actions);
      },
      unmount(el) {
        el.innerHTML = '';
      },
    });

    return api => {
      const HyperappExtension = props =>
        createHyperappElement(rootName, {
          oncreate(element: HTMLElement) {
            api.renderHtmlExtension(element, props);
          },
        });

      return {
        fromHyperapp(root, state, actions) {
          return {
            type: 'hyperapp',
            root,
            state,
            actions,
          };
        },
        HyperappExtension,
      };
    };
  };
}
