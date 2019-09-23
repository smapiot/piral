import * as actions from './actions';
import { withApi, buildName, Extend } from 'piral-core';
import { PiletMenuApi } from './types';

/**
 * Creates a new set of Piral API extensions for integration of menu items.
 */
export function createMenuApi(): Extend<PiletMenuApi> {
  return context => {
    context.defineActions(actions);

    return (api, target) => {
      const prefix = target.name;
      let next = 0;

      return {
        registerMenu(name, arg, settings?) {
          if (typeof name !== 'string') {
            settings = arg;
            arg = name;
            name = next++;
          } else if (settings === undefined) {
            settings = {};
          }

          const id = buildName(prefix, name);
          context.registerMenuItem(id, {
            component: withApi(context.converters, arg, api, 'menu'),
            settings: {
              type: settings.type || 'general',
            },
          });
        },
        unregisterMenu(name) {
          const id = buildName(prefix, name);
          context.unregisterMenuItem(id);
        },
      };
    };
  };
}
