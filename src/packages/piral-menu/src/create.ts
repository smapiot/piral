import { PiletApi, PiletMetadata, GlobalStateContext, AnyComponent, withApi, buildName, markReact } from 'piral-core';
import { PiletMenuApi, MenuComponentProps, MenuSettings } from './types';

function addMenu(
  context: GlobalStateContext,
  api: PiletApi,
  id: string,
  arg: AnyComponent<MenuComponentProps>,
  settings: MenuSettings = {},
) {
  context.registerMenuItem(id, {
    component: withApi(arg, api, 'menu') as any,
    settings: {
      type: settings.type || 'general',
    },
  });
}

export function createMenuApi(api: PiletApi, target: PiletMetadata, context: GlobalStateContext): PiletMenuApi {
  let next = 0;
  return {
    registerMenuX(name, arg, settings?) {
      if (typeof name !== 'string') {
        settings = arg;
        arg = name;
        name = next++;
      }

      const id = buildName(target.name, name);
      addMenu(context, api, id, arg, settings);
    },
    registerMenu(name, arg, settings?) {
      if (typeof name !== 'string') {
        settings = arg;
        arg = name;
        name = next++;
      }

      const id = buildName(target.name, name);
      markReact(arg, `Menu:${name}`);
      addMenu(context, api, id, arg, settings);
    },
    unregisterMenu(name) {
      const id = buildName(target.name, name);
      context.unregisterMenuItem(id);
    },
  };
}
