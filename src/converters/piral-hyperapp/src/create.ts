import type { PiralPlugin } from 'piral-core';
import { createConverter, HyperappConverterOptions } from './converter';
import type { PiletHyperappApi } from './types';

/**
 * Available configuration options for the Hyperapp plugin.
 */
export interface HyperappConfig extends HyperappConverterOptions {}

/**
 * Creates new Pilet API extensions for the Hyperapp integration.
 */
export function createHyperappApi(config: HyperappConfig = {}): PiralPlugin<PiletHyperappApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.hyperapp = ({ root, state, actions }) => convert(root, state, actions);

    return {
      fromHyperapp(root, state, actions) {
        return {
          type: 'hyperapp',
          root,
          state,
          actions,
        };
      },
      HyperappExtension: convert.Extension,
    };
  };
}
