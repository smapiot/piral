import type { PiralPlugin } from 'piral-core';
import { createConverter, GeaConverterOptions } from './converter';
import type { PiletGeaApi } from './types';

/**
 * Available configuration options for the Gea plugin.
 */
export interface GeaConfig extends GeaConverterOptions {}

/**
 * Creates Pilet API extensions for integrating Gea.
 */
export function createGeaApi(config: GeaConfig = {}): PiralPlugin<PiletGeaApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.gea = ({ root }) => convert(root);

    return {
      fromGea(root) {
        return {
          type: 'gea',
          root,
        };
      },
      GeaExtension: convert.Extension,
    };
  };
}
