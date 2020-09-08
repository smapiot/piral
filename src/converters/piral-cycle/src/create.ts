import type { PiralPlugin } from 'piral-core';
import { createExtension } from './extension';
import { createConverter } from './converter';
import type { PiletCycleApi } from './types';

/**
 * Available configuration options for the Cycle.js plugin.
 */
export interface CycleConfig {
  /**
   * The tag name of the root element into which a CycleExtension is rendered.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integration of Cycle.
 */
export function createCycleApi(config: CycleConfig = {}): PiralPlugin<PiletCycleApi> {
  const { rootName } = config;

  return context => {
    const convert = createConverter();
    context.converters.cycle = ({ root }) => convert(root);

    return api => ({
      fromCycle(root) {
        return {
          type: 'cycle',
          root,
        };
      },
      CycleExtension: createExtension(api, rootName),
    });
  };
}
