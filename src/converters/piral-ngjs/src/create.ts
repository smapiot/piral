import type { PiralPlugin } from 'piral-core';
import { createConverter, NgjsConverterOptions } from './converter';
import type { PiletNgjsApi } from './types';

/**
 * Available configuration options for the Angular.js plugin.
 */
export interface NgjsConfig extends NgjsConverterOptions {}

/**
 * Creates the Pilet API extensions for Angular.js.
 */
export function createNgjsApi(config: NgjsConfig = {}): PiralPlugin<PiletNgjsApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.ngjs = ({ name, root }) => convert(name, root);

    return {
      NgjsExtension: convert.Extension,
      fromNgjs(name, root) {
        return {
          type: 'ngjs',
          name,
          root,
        };
      },
    };
  };
}
