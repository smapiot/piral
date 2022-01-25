import { Dict, GlobalState } from 'piral-core';
import { DefaultTile, DefaultContainer } from './default';
import { Dashboard } from './Dashboard';
import { InitialTile, TilePreferences, TileRegistration } from './types';

export function getPreferences(defaultPreferences: TilePreferences, customPreferences: TilePreferences = {}) {
  return {
    ...defaultPreferences,
    ...customPreferences,
  };
}

export function getTiles(items: Array<InitialTile>, defaultPreferences: TilePreferences) {
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

export function withTiles(tiles: Dict<TileRegistration>) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    components: {
      DashboardTile: DefaultTile,
      DashboardContainer: DefaultContainer,
      ...state.components,
    },
    registry: {
      ...state.registry,
      tiles,
    },
  });
}

export function withRoutes(routes: Array<string>) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    routes: {
      ...state.routes,
      ...routes.reduce((newRoutes, route) => {
        newRoutes[route] = Dashboard;
        return newRoutes;
      }, {}),
    },
  });
}
