import { Extend } from 'piral-core';
import { createHyperappElement } from './mount';
import { createConverter } from './converter';
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
    const convert = createConverter();
    context.converters.hyperapp = ({ root, state, actions }) => convert(root, state, actions);

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
