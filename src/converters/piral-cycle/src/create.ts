import type { PiralPlugin } from 'piral-core';
import { createConverter, CycleConverterOptions } from './converter';
import type { PiletCycleApi } from './types';

/**
 * Available configuration options for the Cycle.js plugin.
 */
export interface CycleConfig extends CycleConverterOptions {}

/**
 * Creates new Pilet API extensions for integration of Cycle.
 */
export function createCycleApi(config: CycleConfig = {}): PiralPlugin<PiletCycleApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.cycle = ({ root }) => convert(root);

    return {
      fromCycle(root) {
        return {
          type: 'cycle',
          root,
        };
      },
      CycleExtension: convert.Extension,
    };
  };
}
