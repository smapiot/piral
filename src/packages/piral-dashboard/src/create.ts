import { buildName, PiletApi, PiletMetadata, GlobalStateContext, AnyComponent, withApi, markReact } from 'piral-core';
import { PiletDashboardApi, TileComponentProps, TilePreferences } from './types';

function addTile(
  context: GlobalStateContext,
  api: PiletApi,
  id: string,
  arg: AnyComponent<TileComponentProps>,
  preferences: TilePreferences = {},
) {
  context.registerTile(id, {
    component: withApi(arg, api, 'tile') as any,
    preferences,
  });
}

export function createDashboardApi(
  api: PiletApi,
  target: PiletMetadata,
  context: GlobalStateContext,
): PiletDashboardApi {
  let next = 0;
  return {
    registerTileX(name, arg, preferences?) {
      if (typeof name !== 'string') {
        preferences = arg;
        arg = name;
        name = '123';
      }

      const id = buildName(target.name, name);
      addTile(context, api, id, arg, preferences);
    },
    registerTile(name, arg, preferences?) {
      if (typeof name !== 'string') {
        preferences = arg;
        arg = name;
        name = next++;
      }

      const id = buildName(target.name, name);
      markReact(arg, `Tile:${name}`);
      addTile(context, api, id, arg, preferences);
    },
    unregisterTile(name) {
      const id = buildName(target.name, name);
      context.unregisterTile(id);
    },
  };
}
