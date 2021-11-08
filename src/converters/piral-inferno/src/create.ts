import type { PiralPlugin } from 'piral-core';
import { createConverter, InfernoConverterOptions } from './converter';
import type { PiletInfernoApi } from './types';

/**
 * Available configuration options for the Inferno plugin.
 */
export interface InfernoConfig extends InfernoConverterOptions {}

/**
 * Creates Pilet API extensions for integrating Inferno.
 */
export function createInfernoApi(config: InfernoConfig = {}): PiralPlugin<PiletInfernoApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.inferno = ({ root }) => convert(root);

    return {
      fromInferno(root) {
        return {
          type: 'inferno',
          root,
        };
      },
      InfernoExtension: convert.Extension,
    };
  };
}
