import { isfunc, PiletApiCreator } from 'piral-base';
import { __assign } from 'tslib';
import { withApi } from '../state';
import { ExtensionSlot } from '../components';
import { createDataOptions, getDataExpiration, renderInDom } from '../utils';
import { PiletApi, PiletMetadata, GlobalStateContext, PiletCoreApi, Extend, ApiExtender } from '../types';

export function createCoreApi(context: GlobalStateContext): ApiExtender<PiletCoreApi> {
  return (api, target) => {
    const pilet = target.name;
    return {
      getData(name) {
        return context.readDataValue(name);
      },
      setData(name, value, options) {
        const { target = 'memory', expires } = createDataOptions(options);
        const expiration = getDataExpiration(expires);
        return context.tryWriteDataItem(name, value, pilet, target, expiration);
      },
      registerPage(route, arg, meta) {
        context.registerPage(route, {
          pilet,
          meta,
          component: withApi(context.converters, arg, api, 'page'),
        });
      },
      unregisterPage(route) {
        context.unregisterPage(route);
      },
      registerExtension(name, arg, defaults) {
        context.registerExtension(name as string, {
          pilet,
          component: withApi(context.converters, arg, api, 'extension'),
          reference: arg,
          defaults,
        });
      },
      unregisterExtension(name, arg) {
        context.unregisterExtension(name as string, arg);
      },
      renderHtmlExtension(element, props) {
        renderInDom(context, element, ExtensionSlot, props);
      },
      Extension: ExtensionSlot,
    };
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

export function mergeApis(api: PiletApi, extenders: Array<ApiExtender<Partial<PiletApi>>>, target: PiletMetadata) {
  const frags = extenders.map(extender => extender(api, target));
  __assign(api, ...frags);
  return api;
}

export function createExtenders(context: GlobalStateContext, apis: Array<Extend>) {
  const creators: Array<Extend> = [...apis.filter(isfunc), createCoreApi];
  return creators.map(c => {
    const ctx = c(context);

    if (isfunc(ctx)) {
      return ctx;
    } else {
      return () => ({
        ...ctx,
      });
    }
  });
}

export function defaultApiCreator(context: GlobalStateContext, apis: Array<Extend>): PiletApiCreator {
  const extenders = createExtenders(context, apis);
  return target => {
    const api = initializeApi(target, context);
    context.apis[target.name] = api;
    return mergeApis(api, extenders, target);
  };
}
