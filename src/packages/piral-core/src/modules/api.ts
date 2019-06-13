import { ArbiterModuleMetadata, wrapElement, isfunc } from 'react-arbiter';
import { withFeed, withApi, withForm } from '../components';
import { createFeedOptions, createDataOptions, getDataExpiration } from '../utils';
import {
  FeedResolver,
  FeedConnectorOptions,
  FeedConnector,
  PageComponentProps,
  AnyComponent,
  PiralApi,
  TileComponentProps,
  ExtensionComponentProps,
  MenuComponentProps,
  ModalComponentProps,
  MenuSettings,
  TilePreferences,
  SeverityLevel,
  PiralContainer,
  GlobalStateContext,
} from '../types';

function buildName(prefix: string, name: string | number) {
  return `${prefix}://${name}`;
}

function markReact<T>(arg: React.ComponentType<T>, displayName: string) {
  if (!arg.displayName) {
    arg.displayName = displayName;
  }
}

function addPage<TApi>(
  context: GlobalStateContext,
  api: PiralApi<TApi>,
  route: string,
  arg: AnyComponent<PageComponentProps<PiralApi<TApi>>>,
) {
  context.registerPage(route, {
    component: withApi(arg, api) as any,
  });
}

function addTile<TApi>(
  context: GlobalStateContext,
  api: PiralApi<TApi>,
  id: string,
  arg: AnyComponent<TileComponentProps<PiralApi<TApi>>>,
  preferences: TilePreferences = {},
) {
  context.registerTile(id, {
    component: withApi(arg, api) as any,
    preferences,
  });
}

function addExtension<TApi, T>(
  context: GlobalStateContext,
  api: PiralApi<TApi>,
  name: string,
  arg: AnyComponent<ExtensionComponentProps<PiralApi<TApi>, T>>,
) {
  context.registerExtension(name, {
    component: withApi(arg, api) as any,
    reference: arg,
  });
}

function addMenu<TApi>(
  context: GlobalStateContext,
  api: PiralApi<TApi>,
  id: string,
  arg: AnyComponent<MenuComponentProps<PiralApi<TApi>>>,
  settings: MenuSettings = {},
) {
  context.registerMenuItem(id, {
    component: withApi(arg, api) as any,
    settings: {
      type: settings.type || 'general',
    },
  });
}

function addModal<TApi, TOpts>(
  context: GlobalStateContext,
  api: PiralApi<TApi>,
  id: string,
  arg: AnyComponent<ModalComponentProps<PiralApi<TApi>, TOpts>>,
) {
  context.registerModal(id, {
    component: withApi(arg, api) as any,
  });
}

export function createApi<TApi>(
  target: ArbiterModuleMetadata,
  { events, context, extendApi }: PiralContainer<TApi>,
): PiralApi<TApi> {
  let feeds = 0;
  const prefix = target.name;
  const noop = () => {};
  const api = extendApi(
    {
      ...events,
      meta: {
        name: target.name,
        version: target.version,
        dependencies: target.dependencies,
        hash: target.hash,
      },
      getData(name) {
        return context.readDataValue(name);
      },
      setData(name, value, options) {
        const { target = 'memory', expires } = createDataOptions(options);
        const expiration = getDataExpiration(expires);
        const result = context.tryWriteDataItem(name, value, prefix, target, expiration);

        if (result && target !== 'memory') {
          events.emit('store', {
            name,
            target,
            value,
            owner: prefix,
            expires: expiration,
          });
        }
      },
      createConnector<TData, TItem>(
        resolver: FeedResolver<TData> | FeedConnectorOptions<TData, TItem>,
      ): FeedConnector<TData> {
        const id = buildName(prefix, feeds++);
        const options = createFeedOptions(id, resolver);
        context.createFeed(options.id);

        if (options.immediately) {
          context.loadFeed(options);
        }

        return component => withFeed(component, options) as any;
      },
      createForm(options) {
        return component => withForm(component, options);
      },
      trackEvent(name, properties = {}, measurements = {}) {
        events.emit('track', {
          type: 'event',
          name,
          properties,
          measurements,
        });
      },
      trackError(error, properties = {}, measurements = {}, severityLevel = SeverityLevel.Information) {
        events.emit('track', {
          type: 'error',
          error,
          properties,
          measurements,
          severityLevel,
        });
      },
      trackFrame(name) {
        events.emit('track', {
          type: 'start-frame',
          name,
        });
        return (properties = {}, measurements = {}) =>
          events.emit('track', {
            type: 'end-frame',
            name,
            properties,
            measurements,
          });
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
      registerTileX(name, arg, preferences) {
        const id = buildName(prefix, name);
        addTile(context, api, id, arg, preferences);
      },
      registerTile(name, arg, preferences) {
        const id = buildName(prefix, name);
        markReact(arg, `Tile:${name}`);
        addTile(context, api, id, arg, preferences);
      },
      unregisterTile(name) {
        const id = buildName(prefix, name);
        context.unregisterTile(id);
      },
      registerExtensionX(name, arg) {
        addExtension(context, api, name, arg);
      },
      registerExtension(name, arg) {
        markReact(arg, `Extension:${name}`);
        addExtension(context, api, name, arg);
      },
      unregisterExtension(name, arg) {
        context.unregisterExtension(name, arg);
      },
      registerMenuX(name, arg, settings) {
        const id = buildName(prefix, name);
        addMenu(context, api, id, arg, settings);
      },
      registerMenu(name, arg, settings) {
        const id = buildName(prefix, name);
        markReact(arg, `Menu:${name}`);
        addMenu(context, api, id, arg, settings);
      },
      unregisterMenu(name) {
        const id = buildName(prefix, name);
        context.unregisterMenuItem(id);
      },
      registerModalX(name, arg) {
        const id = buildName(prefix, name);
        addModal(context, api, id, arg);
      },
      registerModal(name, arg) {
        const id = buildName(prefix, name);
        markReact(arg, `Modal:${name}`);
        addModal(context, api, id, arg);
      },
      unregisterModal(name) {
        const id = buildName(prefix, name);
        context.unregisterModal(id);
      },
      registerSearchProvider(name, provider, settings = {}) {
        const id = buildName(prefix, name);
        const { onlyImmediate = false, onCancel, onClear } = settings;
        context.registerSearchProvider(id, {
          onlyImmediate,
          cancel: isfunc(onCancel) ? onCancel : noop,
          clear: isfunc(onClear) ? onClear : noop,
          search(q) {
            return provider(q, api);
          },
        });
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
