import { isfunc, PiletApiCreator, initializeApi, mergeApis } from 'piral-base';
import { __assign } from 'tslib';
import { createCoreApi } from './core';
import { GlobalStateContext, PiralPlugin } from '../types';

export function createExtenders(context: GlobalStateContext, apis: Array<PiralPlugin>) {
  const creators: Array<PiralPlugin> = [createCoreApi, ...apis.filter(isfunc)];
  return creators.map((c) => {
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

export function defaultApiFactory(context: GlobalStateContext, apis: Array<PiralPlugin>): PiletApiCreator {
  const extenders = createExtenders(context, apis);
  return (target) => {
    const api = initializeApi(target, context);
    context.apis[target.name] = api;
    return mergeApis(api, extenders, target);
  };
}
