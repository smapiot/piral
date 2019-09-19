import { withApi } from '../components';
import { createDataOptions, getDataExpiration, markReact } from '../utils';
import {
  PageComponentProps,
  AnyComponent,
  ExtensionComponentProps,
  PiralContainer,
  GlobalStateContext,
  PiletApi,
  PiletMetadata,
} from '../types';

function addPage(context: GlobalStateContext, api: PiletApi, route: string, arg: AnyComponent<PageComponentProps>) {
  context.registerPage(route, {
    component: withApi(arg, api, 'page') as any,
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

export function createCoreApi(target: PiletMetadata, { events, context, extendApi }: PiralContainer): PiletApi {
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
    },
    target,
  );
  return api;
}
