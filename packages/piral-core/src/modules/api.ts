import { ArbiterModuleMetadata, wrapElement } from 'react-arbiter';
import { localizeLocal } from './localize';
import { withFeed, withApi } from '../components';
import { createFeedOptions, createDataOptions, getDataExpiration } from '../utils';
import {
  LocalizationMessages,
  FeedResolver,
  FeedConnectorOptions,
  FeedConnector,
  PageComponentProps,
  AnyComponent,
  PortalApi,
  TileComponentProps,
  ExtensionComponentProps,
  MenuComponentProps,
  ModalComponentProps,
  MenuSettings,
  TilePreferences,
  SeverityLevel,
  PortalContainer,
} from '../types';

function buildName(prefix: string, name: string | number) {
  return `${prefix}://${name}`;
}

export function createApi<TApi>(target: ArbiterModuleMetadata, { events, context, extendApi }: PortalContainer<TApi>) {
  let translations: LocalizationMessages = {};
  let feeds = 0;
  const prefix = target.name;
  const meta = {
    name: target.name,
    version: target.version,
    dependencies: target.dependencies,
    hash: target.hash,
  };
  const api = extendApi(
    {
      ...events,
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

        return component => withFeed(options, component);
      },
      provideTranslations(messages) {
        translations = messages;
      },
      translate(tag, variables) {
        return localizeLocal(translations, tag, variables);
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
          name,
          options,
          close() {
            context.closeModal(dialog);
          },
        };
        context.openModal(dialog);
        return dialog.close;
      },
      registerPage(route: string, arg: AnyComponent<PageComponentProps<PortalApi<TApi>>>) {
        context.registerPage(route, {
          component: withApi(arg, api),
        });
      },
      unregisterPage(route) {
        context.unregisterPage(route);
      },
      registerTile(
        name: string,
        arg: AnyComponent<TileComponentProps<PortalApi<TApi>>>,
        preferences: TilePreferences = {},
      ) {
        const id = buildName(prefix, name);
        context.registerTile(id, {
          component: withApi(arg, api),
          preferences,
        });
      },
      unregisterTile(name) {
        const id = buildName(prefix, name);
        context.unregisterTile(id);
      },
      registerExtension(name: string, arg: AnyComponent<ExtensionComponentProps<PortalApi<TApi>>>) {
        context.registerExtension(name, {
          component: withApi(arg, api),
          reference: arg,
        });
      },
      unregisterExtension(name: string, arg: AnyComponent<ExtensionComponentProps<PortalApi<TApi>>>) {
        context.unregisterExtension(name, arg);
      },
      registerMenu(name: string, arg: AnyComponent<MenuComponentProps<PortalApi<TApi>>>, settings: MenuSettings = {}) {
        const id = buildName(prefix, name);
        context.registerMenuItem(id, {
          component: withApi(arg, api),
          settings: {
            type: settings.type || 'general',
          },
        });
      },
      unregisterMenu(name) {
        const id = buildName(prefix, name);
        context.unregisterMenuItem(id);
      },
      registerModal<TOpts>(name: string, arg: AnyComponent<ModalComponentProps<PortalApi<TApi>, TOpts>>) {
        const id = buildName(prefix, name);
        context.registerModal(id, {
          component: withApi(arg, api),
        });
      },
      unregisterModal(name) {
        const id = buildName(prefix, name);
        context.unregisterModal(id);
      },
      pluginMeta() {
        return meta;
      },
    },
    target,
  );
  return api;
}
