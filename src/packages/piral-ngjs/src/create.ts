import { Extend } from 'piral-core';
import { PiletNgjsApi } from './types';

/**
 * Available configuration options for the Angular.js extension.
 */
export interface NgjsConfig {}

/**
 * Creates a new set of Piral Angular.js API extensions.
 */
export function createNgjsApi(config: NgjsConfig = {}): Extend<PiletNgjsApi> {
  const {} = config;

  return context => {
    context.converters.ngjs = ({ component }) => {
      return undefined;
    };

    return api => {
      return {
        NgjsExtension: undefined,
        fromNgjs(component) {
          return {
            type: 'ngjs',
            component,
          };
        },
      };
    };
  };
}
