import { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { PiletSolidApi } from './types';

/**
 * Available configuration options for the Solid plugin.
 */
export interface SolidConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integration of Solid.
 */
export function createSolidApi(config: SolidConfig = {}): PiralPlugin<PiletSolidApi> {
  const { rootName = 'slot' } = config;

  return context => {
    const convert = createConverter();
    context.converters.solid = ({ root }) => convert(root);

    return api => ({
      fromSolid(root) {
        return {
          type: 'solid',
          root,
        };
      },
      SolidExtension(props) {
        const element = document.createElement(rootName);
        setTimeout(() => api.renderHtmlExtension(element, props), 0);
        return element as any;
      },
    });
  };
}
