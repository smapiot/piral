import type { PiralPlugin } from 'piral-core';
import { createConverter, AureliaConverterOptions } from './converter';
import type { PiletAureliaApi } from './types';

/**
 * Available configuration options for the Aurelia plugin.
 */
export interface AureliaConfig extends AureliaConverterOptions {}

/**
 * Creates new Pilet API extensions for integrating Aurelia.
 */
export function createAureliaApi(config: AureliaConfig = {}): PiralPlugin<PiletAureliaApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.aurelia = ({ root }) => convert(root);

    return {
      fromAurelia(root) {
        return {
          type: 'aurelia',
          root,
        };
      },
      AureliaExtension: convert.Extension,
    };
  };
}
