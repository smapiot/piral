import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import type { PiletMithrilApi } from './types';

/**
 * Available configuration options for the Mithril.js plugin.
 */
export interface MithrilConfig {}

/**
 * Creates new Pilet API extensions for integrating Mithril.js.
 */
export function createMithrilApi(config: MithrilConfig = {}): PiralPlugin<PiletMithrilApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.mithril = ({ component, captured }) => convert(component, captured);

    return {
      fromMithril(component, captured) {
        return {
          type: 'mithril',
          component,
          captured,
        };
      },
      MithrilExtension: convert.Extension,
    };
  };
}
