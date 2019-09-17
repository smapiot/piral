import { wrapElement } from 'react-arbiter';
import { withApi } from '../components';
import { createDataOptions, getDataExpiration, buildName } from '../utils';
import {
  PageComponentProps,
  AnyComponent,
  TileComponentProps,
  ExtensionComponentProps,
  MenuComponentProps,
  ModalComponentProps,
  MenuSettings,
  TilePreferences,
  PiralContainer,
  GlobalStateContext,
  PiletApi,
  PiletMetadata,
} from '../types';

function markReact<T>(arg: React.ComponentType<T>, displayName: string) {
  if (arg && !arg.displayName) {
    arg.displayName = displayName;
  }
}

function addPage(context: GlobalStateContext, api: PiletApi, route: string, arg: AnyComponent<PageComponentProps>) {
  context.registerPage(route, {
    component: withApi(arg, api, 'page') as any,
  });
}

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

function addExtension<T>(
  context: GlobalStateContext,
  api: PiletApi,
  name: string,
  arg: AnyComponent<ExtensionComponentProps<T>>,
  defaults?: T,
) {
  context.registerExtension(name, {
    component: withApi(arg, api, 'extension') as any,
    reference: arg,
    defaults,
  });
}

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

function addModal<TOpts>(
  context: GlobalStateContext,
  api: PiletApi,
  id: string,
  arg: AnyComponent<ModalComponentProps<TOpts>>,
  defaults?: TOpts,
) {
  context.registerModal(id, {
    component: withApi(arg, api, 'modal') as any,
    defaults,
  });
}

export function createCoreApi(target: PiletMetadata, { events, context, extendApi }: PiralContainer): PiletApi {
  let next = 0;
  const prefix = target.name;
  const api = extendApi(
    {
      ...events,
      meta: {
        name: target.name,
        version: target.version,
        hash: target.hash,
        link: target.link,
        custom: target.custom,
      },
      getData(name) {
        return context.readDataValue(name);
      },
      setData(name, value, options) {
        const { target = 'memory', expires } = createDataOptions(options);
        const expiration = getDataExpiration(expires);
        return context.tryWriteDataItem(name, value, prefix, target, expiration);
      },
      showNotification(content, options = {}) {
        const notification = {
          id: `${~~(Math.random() * 10000)}`,
          content: wrapElement(content),
          options,
          close() {
            context.closeNotification(notification);
          },
        };
        context.openNotification(notification);

        if (typeof options.autoClose === 'number' && options.autoClose > 0) {
          setTimeout(notification.close, options.autoClose);
        }

        return notification.close;
      },
      showModal(name, options) {
        const dialog = {
          name: buildName(prefix, name),
          options,
          close() {
            context.closeModal(dialog);
          },
        };
        context.openModal(dialog);
        return dialog.close;
      },
      registerPageX(route, arg) {
        addPage(context, api, route, arg);
      },
      registerPage(route, arg) {
        markReact(arg, `Page:${route}`);
        addPage(context, api, route, arg);
      },
      unregisterPage(route) {
        context.unregisterPage(route);
      },
      registerTileX(name, arg, preferences?) {
        if (typeof name !== 'string') {
          preferences = arg;
          arg = name;
          name = '123';
        }

        const id = buildName(prefix, name);
        addTile(context, api, id, arg, preferences);
      },
      registerTile(name, arg, preferences?) {
        if (typeof name !== 'string') {
          preferences = arg;
          arg = name;
          name = next++;
        }

        const id = buildName(prefix, name);
        markReact(arg, `Tile:${name}`);
        addTile(context, api, id, arg, preferences);
      },
      unregisterTile(name) {
        const id = buildName(prefix, name);
        context.unregisterTile(id);
      },
      registerExtensionX(name, arg, defaults) {
        addExtension(context, api, name, arg, defaults);
      },
      registerExtension(name, arg, defaults) {
        markReact(arg, `Extension:${name}`);
        addExtension(context, api, name, arg, defaults);
      },
      unregisterExtension(name, arg) {
        context.unregisterExtension(name, arg);
      },
      registerMenuX(name, arg, settings?) {
        if (typeof name !== 'string') {
          settings = arg;
          arg = name;
          name = next++;
        }

        const id = buildName(prefix, name);
        addMenu(context, api, id, arg, settings);
      },
      registerMenu(name, arg, settings?) {
        if (typeof name !== 'string') {
          settings = arg;
          arg = name;
          name = next++;
        }

        const id = buildName(prefix, name);
        markReact(arg, `Menu:${name}`);
        addMenu(context, api, id, arg, settings);
      },
      unregisterMenu(name) {
        const id = buildName(prefix, name);
        context.unregisterMenuItem(id);
      },
      registerModalX(name, arg, defaults) {
        const id = buildName(prefix, name);
        addModal(context, api, id, arg, defaults);
      },
      registerModal(name, arg, defaults) {
        const id = buildName(prefix, name);
        markReact(arg, `Modal:${name}`);
        addModal(context, api, id, arg, defaults);
      },
      unregisterModal(name) {
        const id = buildName(prefix, name);
        context.unregisterModal(id);
      },
    },
    target,
  );
  return api;
}
