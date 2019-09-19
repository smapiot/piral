import { isfunc } from 'react-arbiter';
import { __assign } from 'tslib';
import { withApi } from '../components';
import { createDataOptions, getDataExpiration } from '../utils';
import { PiletApi, PiletMetadata, GlobalStateContext, PiletCoreApi, Extend } from '../types';

export function createCoreApi(api: PiletApi, target: PiletMetadata, context: GlobalStateContext): PiletCoreApi {
  const prefix = target.name;
  return {
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
        component: withApi(context.converters, arg, api, 'page'),
      });
    },
    unregisterPage(route) {
      context.unregisterPage(route);
    },
    registerExtension(name, arg, defaults) {
      context.registerExtension(name, {
        component: withApi(context.converters, arg, api, 'extension'),
        reference: arg,
        defaults,
      });
    },
    unregisterExtension(name, arg) {
      context.unregisterExtension(name, arg);
    },
  };
}

export function initializeApi(target: PiletMetadata, context: GlobalStateContext) {
  return {
    on: context.on,
    off: context.off,
    emit: context.emit,
    meta: {
      ...target,
    },
  } as PiletApi;
}

export function mergeApis(target: PiletMetadata, context: GlobalStateContext, apis: Array<Extend>) {
  const api = initializeApi(target, context);
  const creators = [...apis.filter(isfunc), createCoreApi];
  __assign(api, ...creators.map(c => c(api, target, context)));
  return api;
}
