import { withApi } from '../components';
import { createDataOptions, getDataExpiration } from '../utils';
import { PiralContainer, PiletApi, PiletMetadata } from '../types';

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
      registerPage(route, arg) {
        context.registerPage(route, {
          component: withApi(arg, api, 'page'),
        });
      },
      unregisterPage(route) {
        context.unregisterPage(route);
      },
      registerExtension(name, arg, defaults) {
        context.registerExtension(name, {
          component: withApi(arg, api, 'extension'),
          reference: arg,
          defaults,
        });
      },
      unregisterExtension(name, arg) {
        context.unregisterExtension(name, arg);
      },
    },
    target,
  );
  return api;
}
