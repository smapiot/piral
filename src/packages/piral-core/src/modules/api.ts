import { ArbiterModuleMetadata, wrapElement } from 'react-arbiter';
import { localizeLocal } from './localize';
import { withFeed, withApi, withForm } from '../components';
import { createFeedOptions, createDataOptions, getDataExpiration } from '../utils';
import {
  LocalizationMessages,
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
} from '../types';

function buildName(prefix: string, name: string | number) {
  return `${prefix}://${name}`;
}

export function createApi<TApi>(
  target: ArbiterModuleMetadata,
  { events, context, extendApi }: PiralContainer<TApi>,
): PiralApi<TApi> {
  let translations: LocalizationMessages = {};
  let feeds = 0;
  const prefix = target.name;
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
      registerPage(route: string, arg: AnyComponent<PageComponentProps<PiralApi<TApi>>>) {
        context.registerPage(route, {
          component: withApi(arg, api) as any,
        });
      },
      unregisterPage(route) {
        context.unregisterPage(route);
      },
      registerTile(
        name: string,
        arg: AnyComponent<TileComponentProps<PiralApi<TApi>>>,
        preferences: TilePreferences = {},
      ) {
        const id = buildName(prefix, name);
        context.registerTile(id, {
          component: withApi(arg, api) as any,
          preferences,
        });
      },
      unregisterTile(name) {
        const id = buildName(prefix, name);
        context.unregisterTile(id);
      },
      registerExtension(name: string, arg: AnyComponent<ExtensionComponentProps<PiralApi<TApi>>>) {
        context.registerExtension(name, {
          component: withApi(arg, api) as any,
          reference: arg,
        });
      },
      unregisterExtension(name, arg) {
        context.unregisterExtension(name, arg);
      },
      registerMenu(name: string, arg: AnyComponent<MenuComponentProps<PiralApi<TApi>>>, settings: MenuSettings = {}) {
        const id = buildName(prefix, name);
        context.registerMenuItem(id, {
          component: withApi(arg, api) as any,
          settings: {
            type: settings.type || 'general',
          },
        });
      },
      unregisterMenu(name) {
        const id = buildName(prefix, name);
        context.unregisterMenuItem(id);
      },
      registerModal<TOpts>(name: string, arg: AnyComponent<ModalComponentProps<PiralApi<TApi>, TOpts>>) {
        const id = buildName(prefix, name);
        context.registerModal(id, {
          component: withApi(arg, api) as any,
        });
      },
      unregisterModal(name) {
        const id = buildName(prefix, name);
        context.unregisterModal(id);
      },
      registerSearchProvider(name, provider) {
        const id = buildName(prefix, name);
        context.registerSearchProvider(id, {
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
