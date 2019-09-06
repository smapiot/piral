import { ArbiterModuleMetadata, wrapElement, isfunc } from 'react-arbiter';
import { withFeed, withApi, withForm, withPiletState } from '../components';
import { createFeedOptions, createDataOptions, getDataExpiration } from '../utils';
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
  SearchProvider,
  SearchSettings,
} from '../types';

const noop = () => {};

function buildName(prefix: string, name: string | number) {
  return `${prefix}://${name}`;
}

function markReact<T>(arg: React.ComponentType<T>, displayName: string) {
  if (arg && !arg.displayName) {
    arg.displayName = displayName;
  }
}

function addPage<TApi>(
  context: GlobalStateContext,
  api: TApi,
  route: string,
  arg: AnyComponent<PageComponentProps<TApi>>,
) {
  context.registerPage(route, {
    component: withApi(arg, api, 'page') as any,
  });
}

function addTile<TApi>(
  context: GlobalStateContext,
  api: TApi,
  id: string,
  arg: AnyComponent<TileComponentProps<TApi>>,
  preferences: TilePreferences = {},
) {
  context.registerTile(id, {
    component: withApi(arg, api, 'tile') as any,
    preferences,
  });
}

function addExtension<TApi, T>(
  context: GlobalStateContext,
  api: TApi,
  name: string,
  arg: AnyComponent<ExtensionComponentProps<TApi, T>>,
  defaults?: T,
) {
  context.registerExtension(name, {
    component: withApi(arg, api, 'extension') as any,
    reference: arg,
    defaults,
  });
}

function addMenu<TApi>(
  context: GlobalStateContext,
  api: TApi,
  id: string,
  arg: AnyComponent<MenuComponentProps<TApi>>,
  settings: MenuSettings = {},
) {
  context.registerMenuItem(id, {
    component: withApi(arg, api, 'menu') as any,
    settings: {
      type: settings.type || 'general',
    },
  });
}

function addModal<TApi, TOpts>(
  context: GlobalStateContext,
  api: TApi,
  id: string,
  arg: AnyComponent<ModalComponentProps<TApi, TOpts>>,
  defaults?: TOpts,
) {
  context.registerModal(id, {
    component: withApi(arg, api, 'modal') as any,
    defaults,
  });
}

function addSearchProvider<TApi>(
  context: GlobalStateContext,
  api: TApi,
  id: string,
  provider: SearchProvider<TApi>,
  settings: SearchSettings,
) {
  const { onlyImmediate = false, onCancel, onClear } = settings;
  context.registerSearchProvider(id, {
    onlyImmediate,
    cancel: isfunc(onCancel) ? onCancel : noop,
    clear: isfunc(onClear) ? onClear : noop,
    search(q) {
      return provider(q, api);
    },
  });
}

export function createCoreApi<TApi>(
  target: ArbiterModuleMetadata,
  { events, context, extendApi }: PiralContainer<TApi>,
): TApi {
  let feeds = 0;
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
      createConnector(resolver) {
        const id = buildName(prefix, feeds++);
        const options = createFeedOptions(id, resolver);
        context.createFeed(options.id);

        if (options.immediately) {
          context.loadFeed(options);
        }

        return component => withFeed(component, options) as any;
      },
      createState(options) {
        const actions = {};
        const id = buildName(prefix, feeds++);
        const cb = dispatch => context.replaceState(id, dispatch);
        context.createState(id, options.state);
        Object.keys(options.actions).forEach(key => {
          const action = options.actions[key];
          actions[key] = (...args) => action.call(api, cb, ...args);
        });
        return component => withPiletState(component, id, actions) as any;
      },
      createForm(options) {
        return component => withForm(component, options);
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
      registerSearchProvider(name, provider, settings?) {
        if (typeof name !== 'string') {
          settings = provider;
          provider = name;
          name = next++;
        }

        const id = buildName(prefix, name);
        addSearchProvider(context, api, id, provider, settings || {});
      },
      unregisterSearchProvider(name) {
        const id = buildName(prefix, name);
        context.unregisterSearchProvider(id);
      },
    },
    target,
  );
  return api;
}
