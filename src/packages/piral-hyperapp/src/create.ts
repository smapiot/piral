import { Extend } from 'piral-core';
import { mount, createElement } from './mount';
import { PiletHyperappApi } from './types';

/**
 * Available configuration options for the Hyperapp extension.
 */
export interface HyperappConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates a new set of Piral hyperapp API extensions.
 */
export function createHyperappApi(config: HyperappConfig = {}): Extend<PiletHyperappApi> {
  const { rootName = 'slot' } = config;

  return context => {
    context.converters.hyperapp = component => {
      return (el, props, ctx) => {
        return mount(el, component.root, props, ctx, component.state, component.actions);
      };
    };

    return api => {
      const HyperappExtension = props =>
        createElement(rootName, {
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
