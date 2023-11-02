import type { PiralPlugin } from 'piral-core';
import { createConverter, ReactConverterOptions } from './converter';
import type { PiletReactApi } from './types';

/**
 * Available configuration options for the React 16+ plugin.
 */
export interface ReactConfig extends ReactConverterOptions {}

/**
 * Creates Pilet API extensions for integrating React 16+.
 */
export function createReactApi(config: ReactConfig = {}): PiralPlugin<PiletReactApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.react = ({ root }) => convert(root);

    return {
      fromReact(root) {
        return {
          type: 'react',
          root,
        };
      },
      ReactExtension: convert.Extension,
    };
  };
}
