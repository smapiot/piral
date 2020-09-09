import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { createExtension } from './extension';
import type { PiletPreactApi } from './types';

/**
 * Available configuration options for the Preact plugin.
 */
export interface PreactConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integrating Preact.
 */
export function createPreactApi(config: PreactConfig = {}): PiralPlugin<PiletPreactApi> {
  const { rootName } = config;

  return context => {
    const convert = createConverter();
    context.converters.preact = ({ root }) => convert(root);

    return {
      fromPreact(root) {
        return {
          type: 'preact',
          root,
        };
      },
      PreactExtension: createExtension(rootName),
    };
  };
}
