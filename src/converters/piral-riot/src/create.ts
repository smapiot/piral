import { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { PiletRiotApi } from './types';
import { createExtension } from './extension';

/**
 * Available configuration options for the Riot.js plugin.
 */
export interface RiotConfig {
  /**
   * Defines the name of the Riot extension element.
   * @default riot-extension
   */
  extensionName?: string;
}

/**
 * Creates new Pilet API extensions for integrating Riot.js.
 */
export function createRiotApi(config: RiotConfig = {}): PiralPlugin<PiletRiotApi> {
  const { extensionName } = config;

  return context => {
    const convert = createConverter();
    context.converters.riot = ({ component, captured }) => convert(component, captured);

    return api => ({
      fromRiot(component, captured) {
        return {
          type: 'riot',
          component,
          captured,
        };
      },
      RiotExtension: createExtension(api, extensionName),
    });
  };
}
