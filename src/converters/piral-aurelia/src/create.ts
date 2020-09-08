import type { PiralPlugin } from 'piral-core';
import { createExtension } from './extension';
import { createConverter } from './converter';
import type { PiletAureliaApi } from './types';

/**
 * Available configuration options for the Aurelia plugin.
 */
export interface AureliaConfig {
  /**
   * Defines the name of the root element.
   * @default span
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integrating Aurelia.
 */
export function createAureliaApi(config: AureliaConfig = {}): PiralPlugin<PiletAureliaApi> {
  const { rootName } = config;

  return context => {
    const convert = createConverter();
    context.converters.aurelia = ({ root }) => convert(root);

    return api => {
      const AureliaExtension = createExtension(api, rootName);

      return {
        fromAurelia(root) {
          return {
            type: 'aurelia',
            root,
          };
        },
        AureliaExtension,
      };
    };
  };
}
