import * as actions from './actions';
import { ComponentType } from 'react';
import { swap } from '@dbeining/react-atom';
import { buildName, withApi, Extend, Dict } from 'piral-core';
import { DefaultTile, DefaultDashboard } from './default';
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
 * Available configuration options for the dashboard extension.
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
      component,
      preferences: getPreferences(defaultPreferences, preferences),
    };
  }

  return tiles;
}

/**
 * Creates a new Piral API extension for activating dashboard support.
 */
export function createDashboardApi(config: DashboardConfig = {}): Extend<PiletDashboardApi> {
  const { tiles = [], defaultPreferences = {} } = config;

  return context => {
    context.defineActions(actions);

    swap(context.state, state => ({
      ...state,
      components: {
        ...state.components,
        Tile: DefaultTile,
        Dashboard: DefaultDashboard,
      },
      registry: {
        ...state.registry,
        tiles: getTiles(tiles, defaultPreferences),
      },
    }));

    return (api, target) => {
      const prefix = target.name;
      let next = 0;

      return {
        registerTile(name, arg, preferences?) {
          if (typeof name !== 'string') {
            preferences = arg;
            arg = name;
            name = next++;
          }

          const id = buildName(prefix, name);
          context.registerTile(id, {
            component: withApi(context.converters, arg, api, 'tile'),
            preferences: getPreferences(defaultPreferences, preferences),
          });
        },
        unregisterTile(name) {
          const id = buildName(prefix, name);
          context.unregisterTile(id);
        },
      };
    };
  };
}
