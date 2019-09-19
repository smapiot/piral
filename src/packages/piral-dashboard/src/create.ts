import * as actions from './actions';
import { buildName, PiletApi, PiletMetadata, GlobalStateContext, withApi } from 'piral-core';
import { PiletDashboardApi } from './types';

export function createDashboardApi(
  api: PiletApi,
  target: PiletMetadata,
  context: GlobalStateContext,
): PiletDashboardApi {
  const prefix = target.name;
  let next = 0;
  context.withActions(actions);

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
        preferences,
      });
    },
    unregisterTile(name) {
      const id = buildName(prefix, name);
      context.unregisterTile(id);
    },
  };
}
