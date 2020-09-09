import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { createExtension } from './extension';
import type { PiletElmApi } from './types';

/**
 * Available configuration options for the Elm plugin.
 */
export interface ElmConfig {
  /**
   * Defines the name of the extension component.
   * @default elm-extension
   */
  selector?: string;
}

/**
 * Creates new Pilet API extensions for integration of Elm.
 */
export function createElmApi(config: ElmConfig = {}): PiralPlugin<PiletElmApi> {
  const { selector } = config;

  return (context) => {
    const convert = createConverter();
    context.converters.elm = ({ main, captured }) => convert(main, captured);

    createExtension(selector);

    return {
      fromElm(main, captured) {
        return {
          type: 'elm',
          captured,
          main,
        };
      },
      ElmExtension: selector,
    };
  };
}
