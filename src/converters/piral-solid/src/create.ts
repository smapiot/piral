import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import type { PiletSolidApi } from './types';

/**
 * Available configuration options for the Solid plugin.
 */
export interface SolidConfig {}

/**
 * Creates new Pilet API extensions for integration of Solid.
 */
export function createSolidApi(config: SolidConfig = {}): PiralPlugin<PiletSolidApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.solid = ({ root }) => convert(root);

    return {
      fromSolid(root) {
        return {
          type: 'solid',
          root,
        };
      },
      SolidExtension: convert.Extension,
    };
  };
}
