import { createConverter, NgConverterOptions } from './converter';
import type { PiralPlugin } from 'piral-core';
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
    context.converters.ng = ({ component, moduleRef }) => convert(component, moduleRef);

    return (api) => {
      return {
        NgExtension: convert.Extension,
        defineNgModule(ngModule, opts) {
          return convert.defineModule(api, ngModule, opts);
        },
        fromNg(component, moduleRef) {
          return {
            type: 'ng',
            component,
            moduleRef,
          };
        },
      };
    };
  };
}
