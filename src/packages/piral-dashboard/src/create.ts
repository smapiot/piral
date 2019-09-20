import * as actions from './actions';
import { buildName, ApiExtender, GlobalStateContext, withApi } from 'piral-core';
import { PiletDashboardApi } from './types';

export function createDashboardApi(context: GlobalStateContext): ApiExtender<PiletDashboardApi> {
  context.defineActions(actions);

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
          preferences,
        });
      },
      unregisterTile(name) {
        const id = buildName(prefix, name);
        context.unregisterTile(id);
      },
    };
  };
}
