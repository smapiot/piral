import type { PiralPlugin } from 'piral-core';
import type { PiletNgApi } from './types';
import { createConverter, NgConverterOptions } from './converter';
import { defineModule } from './module';

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
    context.converters.ng = ({ component }) => convert(component);

    return {
      NgExtension: convert.Extension,
      defineNgModule: defineModule,
      fromNg(component) {
        return {
          type: 'ng',
          component,
        };
      },
    };
  };
}
