import { PiletApi, PiletMetadata, GlobalStateContext, withApi, buildName } from 'piral-core';
import { PiletMenuApi } from './types';

export function createMenuApi(api: PiletApi, target: PiletMetadata, context: GlobalStateContext): PiletMenuApi {
  let next = 0;
  return {
    registerMenu(name, arg, settings?) {
      if (typeof name !== 'string') {
        settings = arg;
        arg = name;
        name = next++;
      }

      const id = buildName(target.name, name);
      context.registerMenuItem(id, {
        component: withApi(arg, api, 'menu'),
        settings: {
          type: settings.type || 'general',
        },
      });
    },
    unregisterMenu(name) {
      const id = buildName(target.name, name);
      context.unregisterMenuItem(id);
    },
  };
}
