import * as actions from './actions';
import { buildName, withApi, PiralPlugin, withRootExtension, withAll } from 'piral-core';
import { Dashboard } from './Dashboard';
import { InitialTile, PiletDashboardApi, TilePreferences } from './types';
import { getPreferences, getTiles, withRoutes, withTiles } from './helpers';

/**
 * Available configuration options for the dashboard plugin.
 */
export interface DashboardConfig {
  /**
   * Sets the routes where a dashboard should be displayed.
   * @default ['/']
   */
  routes?: Array<string>;
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

/**
 * Creates the Pilet API extension for activating dashboard support.
 */
export function createDashboardApi(config: DashboardConfig = {}): PiralPlugin<PiletDashboardApi> {
  const { tiles = [], defaultPreferences = {}, routes = ['/'] } = config;

  return (context) => {
    context.defineActions(actions);

    context.dispatch(
      withAll(
        withTiles(getTiles(tiles, defaultPreferences)),
        withRootExtension('piral-dashboard', Dashboard),
        withRoutes(routes),
      ),
    );

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
