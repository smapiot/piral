import type { PiralPlugin } from 'piral-core';
import { createConverter, ElmConverterOptions } from './converter';
import type { PiletElmApi } from './types';

/**
 * Available configuration options for the Elm plugin.
 */
export interface ElmConfig extends ElmConverterOptions {}

/**
 * Creates new Pilet API extensions for integration of Elm.
 */
export function createElmApi(config: ElmConfig = {}): PiralPlugin<PiletElmApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.elm = ({ main, captured }) => convert(main, captured);

    return {
      fromElm(main, captured) {
        return {
          type: 'elm',
          captured,
          main,
        };
      },
      ElmExtension: convert.Extension,
    };
  };
}
