import { buildName, PiletApi, PiletMetadata, GlobalStateContext, withApi } from 'piral-core';
import { PiletDashboardApi } from './types';

export function createDashboardApi(
  api: PiletApi,
  target: PiletMetadata,
  context: GlobalStateContext,
): PiletDashboardApi {
  let next = 0;
  return {
    registerTile(name, arg, preferences?) {
      if (typeof name !== 'string') {
        preferences = arg;
        arg = name;
        name = next++;
      }

      const id = buildName(target.name, name);
      context.registerTile(id, {
        component: withApi(arg, api, 'tile'),
        preferences,
      });
    },
    unregisterTile(name) {
      const id = buildName(target.name, name);
      context.unregisterTile(id);
    },
  };
}
