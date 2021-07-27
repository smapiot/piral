import type { PiralPlugin } from 'piral-core';
import { createConverter, PreactConverterOptions } from './converter';
import type { PiletPreactApi } from './types';

/**
 * Available configuration options for the Preact plugin.
 */
export interface PreactConfig extends PreactConverterOptions {}

/**
 * Creates new Pilet API extensions for integrating Preact.
 */
export function createPreactApi(config: PreactConfig = {}): PiralPlugin<PiletPreactApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.preact = ({ root }) => convert(root);

    return {
      fromPreact(root) {
        return {
          type: 'preact',
          root,
        };
      },
      PreactExtension: convert.Extension,
    };
  };
}
