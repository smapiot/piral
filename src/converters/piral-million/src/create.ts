import type { PiralPlugin } from 'piral-core';
import { createConverter, MillionConverterOptions } from './converter';
import type { PiletMillionApi } from './types';

/**
 * Available configuration options for the Million plugin.
 */
export interface MillionConfig extends MillionConverterOptions {}

/**
 * Creates new Pilet API extensions for integrating Million.
 */
export function createMillionApi(config: MillionConfig = {}): PiralPlugin<PiletMillionApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.million = ({ root }) => convert(root);

    return {
      fromMillion(root) {
        return {
          type: 'million',
          root,
        };
      },
      MillionExtension: convert.Extension,
    };
  };
}
