import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { createExtension } from './extension';
import type { PiletInfernoApi } from './types';

/**
 * Available configuration options for the Inferno plugin.
 */
export interface InfernoConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates Pilet API extensions for integrating Inferno.
 */
export function createInfernoApi(config: InfernoConfig = {}): PiralPlugin<PiletInfernoApi> {
  const { rootName } = config;

  return context => {
    const convert = createConverter();
    context.converters.inferno = ({ root }) => convert(root);

    return {
      fromInferno(root) {
        return {
          type: 'inferno',
          root,
        };
      },
      InfernoExtension: createExtension(rootName),
    };
  };
}
