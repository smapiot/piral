import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { createExtension } from './extension';
import type { PiletReact15Api } from './types';

/**
 * Available configuration options for the React 15.x plugin.
 */
export interface React15Config {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates Pilet API extensions for integrating React 15.x.
 */
export function createReact15Api(config: React15Config = {}): PiralPlugin<PiletReact15Api> {
  const { rootName } = config;

  return context => {
    const convert = createConverter();
    context.converters.react15 = ({ root }) => convert(root);

    return {
      fromReact15(root) {
        return {
          type: 'react15',
          root,
        };
      },
      React15Extension: createExtension(rootName),
    };
  };
}
