import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import type { PiletRiotApi } from './types';

/**
 * Available configuration options for the Riot.js plugin.
 */
export interface RiotConfig {}

/**
 * Creates new Pilet API extensions for integrating Riot.js.
 */
export function createRiotApi(config: RiotConfig = {}): PiralPlugin<PiletRiotApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.riot = ({ component, captured }) => convert(component, captured);

    return {
      fromRiot(component, captured) {
        return {
          type: 'riot',
          component,
          captured,
        };
      },
      RiotExtension: convert.Extension,
    };
  };
}
