import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import type { PiletLitElApi } from './types';

/**
 * Available configuration options for the LitElement plugin.
 */
export interface LitElConfig {}

/**
 * Creates new Pilet API extensions for integration of LitElement.
 */
export function createLitElApi(config: LitElConfig = {}): PiralPlugin<PiletLitElApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.litel = ({ elementName }) => convert(elementName);

    return {
      fromLitEl(elementName) {
        return {
          type: 'litel',
          elementName,
        };
      },
      LitElExtension: convert.Extension,
    };
  };
}
