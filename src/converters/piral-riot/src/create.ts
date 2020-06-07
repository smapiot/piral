import { Extend } from 'piral-core';
import { createConverter } from './converter';
import { PiletRiotApi } from './types';

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
export function createRiotApi(config: RiotConfig = {}): Extend<PiletRiotApi> {
  const { extensionName = 'riot-extension' } = config;

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
      RiotExtension: {
        name: extensionName,
        template() {
          return {
            mount(element, scope) {
              api.renderHtmlExtension(element, scope.props);
            },
            update() {},
            unmount() {},
            createDOM() {
              return this;
            },
            clone() {
              return this;
            },
          };
        },
      },
    });
  };
}
