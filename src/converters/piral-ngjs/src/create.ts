import { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { PiletNgjsApi } from './types';
import { createExtension } from './extension';

/**
 * Available configuration options for the Angular.js plugin.
 */
export interface NgjsConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates the Pilet API extensions for Angular.js.
 */
export function createNgjsApi(config: NgjsConfig = {}): PiralPlugin<PiletNgjsApi> {
  const { rootName } = config;
  const NgjsExtension = createExtension(rootName);

  return (context) => {
    const convert = createConverter();
    context.converters.ngjs = ({ name, root }) => convert(name, root);

    return {
      NgjsExtension,
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
