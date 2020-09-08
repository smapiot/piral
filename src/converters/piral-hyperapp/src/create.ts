import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { createExtension } from './extension';
import type { PiletHyperappApi } from './types';

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
export function createHyperappApi(config: HyperappConfig = {}): PiralPlugin<PiletHyperappApi> {
  const { rootName } = config;

  return context => {
    const convert = createConverter();
    context.converters.hyperapp = ({ root, state, actions }) => convert(root, state, actions);

    return api => {
      return {
        fromHyperapp(root, state, actions) {
          return {
            type: 'hyperapp',
            root,
            state,
            actions,
          };
        },
        HyperappExtension: createExtension(api, rootName),
      };
    };
  };
}
