import { Extend, createInstance, PiralConfiguration } from 'piral-core';
import { NativeRouter } from 'react-router-native';

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
    state: {
      ...config.state,
      components: {
        LoadingIndicator: () => null,
        Router: NativeRouter,
        ...config.state?.components,
      },
    },
    getDependencies(meta) {
      const deps = config.getDependencies?.(meta) ?? {};
      return {
        'react-native': require('react-native'),
        'react-router-native': require('react-native'),
        ...deps,
      };
    },
    extendApi: extendPiralApi(config.extendApi),
  });
}
