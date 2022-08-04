import * as React from 'react';
import { NativeRouter } from 'react-router-native';
import { createInstance, PiralConfiguration, RouterProps } from 'piral-core';

const Router: React.FC<RouterProps> = ({ children }) => (
  <NativeRouter>
    {children}
  </NativeRouter>
);

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
        Router,
        ...config.state?.components,
      },
    },
  });
}
