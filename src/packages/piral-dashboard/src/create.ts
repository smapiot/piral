import * as actions from './actions';
import { swap } from '@dbeining/react-atom';
import { buildName, withApi, Extend } from 'piral-core';
import { PiletDashboardApi } from './types';

/**
 * Creates a new Piral API extension for activating dashboard support.
 */
export function createDashboardApi(): Extend<PiletDashboardApi> {
  return context => {
    context.defineActions(actions);

    swap(context.state, state => ({
      ...state,
      components: {
        ...state.components,
        tiles: {},
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
            preferences,
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
