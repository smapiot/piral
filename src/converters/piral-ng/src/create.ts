import type { PiralPlugin } from 'piral-core';
import { createConverter, NgConverterOptions } from './converter';
import type { PiletNgApi } from './types';

/**
 * Available configuration options for the Angular plugin.
 */
export interface NgConfig extends NgConverterOptions {}

/**
 * Creates the Pilet API extensions for Angular.
 */
export function createNgApi(config: NgConfig = {}): PiralPlugin<PiletNgApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.ng = ({ component, opts }) => convert(component, opts);

    return {
      NgExtension: convert.Extension,
      fromNg(component, opts) {
        return {
          type: 'ng',
          component,
          opts,
        };
      },
    };
  };
}
