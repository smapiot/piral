import * as actions from './actions';
import { ComponentType } from 'react';
import { buildName, withApi, PiralPlugin, Dict } from 'piral-core';
import { DefaultTile, DefaultContainer } from './default';
import { PiletDashboardApi, TilePreferences, BareTileComponentProps, TileRegistration } from './types';

export interface InitialTile {
  /**
   * Defines the component to be used for the tile.
   */
  component: ComponentType<BareTileComponentProps>;
  /**
   * Optionally sets the preferences for the tile.
   */
  preferences?: TilePreferences;
}

/**
 * Available configuration options for the dashboard plugin.
 */
export interface DashboardConfig {
  /**
   * Sets the tiles to be given by the app shell.
   * @default []
   */
  tiles?: Array<InitialTile>;
  /**
   * Sets the default preferences to be used.
   * @default {}
   */
  defaultPreferences?: TilePreferences;
}

function getPreferences(defaultPreferences: TilePreferences, customPreferences: TilePreferences = {}) {
  return {
    ...defaultPreferences,
    ...customPreferences,
  };
}

function getTiles(items: Array<InitialTile>, defaultPreferences: TilePreferences) {
  const tiles: Dict<TileRegistration> = {};
  let i = 0;

  for (const { component, preferences } of items) {
    tiles[`global-${i++}`] = {
      pilet: undefined,
      component,
      preferences: getPreferences(defaultPreferences, preferences),
    };
  }

  return tiles;
}

/**
 * Creates the Pilet API extension for activating dashboard support.
 */
export function createDashboardApi(config: DashboardConfig = {}): PiralPlugin<PiletDashboardApi> {
  const { tiles = [], defaultPreferences = {} } = config;

  return (context) => {
    context.defineActions(actions);

    context.dispatch((state) => ({
      ...state,
      components: {
        DashboardTile: DefaultTile,
        DashboardContainer: DefaultContainer,
        ...state.components,
      },
      registry: {
        ...state.registry,
        tiles: getTiles(tiles, defaultPreferences),
      },
    }));

    return (api, target) => {
      const pilet = target.name;
      let next = 0;

      return {
        registerTile(name, arg, preferences?) {
          if (typeof name !== 'string') {
            preferences = arg;
            arg = name;
            name = next++;
          }

          const id = buildName(pilet, name);
          context.registerTile(id, {
            pilet,
            component: withApi(context, arg, api, 'tile'),
            preferences: getPreferences(defaultPreferences, preferences),
          });
          return () => api.unregisterTile(name);
        },
        unregisterTile(name) {
          const id = buildName(pilet, name);
          context.unregisterTile(id);
        },
      };
    };
  };
}
