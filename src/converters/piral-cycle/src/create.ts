import { Extend } from 'piral-core';
import { createConverter } from './converter';
import { PiletCycleApi } from './types';

/**
 * Available configuration options for the Cycle.js plugin.
 */
export interface CycleConfig {
}

/**
 * Creates new Pilet API extensions for integration of Cycle.
 */
export function createCycleApi(config: CycleConfig = {}): Extend<PiletCycleApi> {
  const { } = config;

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
    });
  };
}
