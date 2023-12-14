import type { PiralPlugin } from 'piral-core';
import { createConverter, React15ConverterOptions } from './converter';
import type { PiletReact15Api } from './types';

/**
 * Available configuration options for the React 15.x plugin.
 */
export interface React15Config extends React15ConverterOptions {}

/**
 * Creates Pilet API extensions for integrating React 15.x.
 */
export function createReact15Api(config: React15Config = {}): PiralPlugin<PiletReact15Api> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.react15 = ({ root }) => convert(root);

    return {
      fromReact15(root) {
        return {
          type: 'react15',
          root,
        };
      },
      React15Extension: convert.Extension,
    };
  };
}
