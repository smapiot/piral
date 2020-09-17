import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { createExtension } from './extension';
import type { PiletLitElApi } from './types';

/**
 * Available configuration options for the LitElement plugin.
 */
export interface LitElConfig {
  /**
   * Defines the name of the extension component.
   * @default litel-extension
   */
  selector?: string;
}

/**
 * Creates new Pilet API extensions for integration of LitElement.
 */
export function createLitElApi(config: LitElConfig = {}): PiralPlugin<PiletLitElApi> {
  const { selector } = config;

  return (context) => {
    const convert = createConverter();
    context.converters.litel = ({ elementName }) => convert(elementName);

    createExtension(selector);

    return {
      fromLitEl(elementName) {
        return {
          type: 'litel',
          elementName,
        };
      },
      LitElExtension: selector,
    };
  };
}
