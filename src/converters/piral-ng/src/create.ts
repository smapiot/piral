import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { createExtension } from './extension';
import type { PiletNgApi } from './types';

/**
 * Available configuration options for the Angular plugin.
 */
export interface NgConfig {
  /**
   * Defines the name of the extension component.
   * @default extension-component
   */
  selector?: string;
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
  /**
   * Defines how the next ID for mounting is selected.
   * By default a random number is used in conjunction with a `ng-` prefix.
   */
  selectId?(): string;
}

/**
 * Creates the Pilet API extensions for Angular.
 */
export function createNgApi(config: NgConfig = {}): PiralPlugin<PiletNgApi> {
  const { rootName, selector, selectId } = config;

  return (context) => {
    const convert = createConverter(selectId);
    context.converters.ng = ({ component }) => convert(component);

    return {
      NgExtension: createExtension(rootName, selector),
      fromNg(component) {
        return {
          type: 'ng',
          component,
        };
      },
    };
  };
}
