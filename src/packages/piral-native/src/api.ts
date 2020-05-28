import { Extend, createInstance, PiralConfiguration } from 'piral-core';

function extendPiralApi(customApis: Extend | Array<Extend> = []) {
  return Array.isArray(customApis) ? customApis : [customApis];
}

/**
 * Creates a native Piral instance.
 * @param config The config for creating the piral state.
 */
export function createNativePiral(config: PiralConfiguration = {}) {
  return createInstance({
    ...config,
    extendApi: extendPiralApi(config.extendApi),
  });
}
