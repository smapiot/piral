import * as React from 'react';
import { wrapComponent } from 'react-arbiter';
import { ComponentError, ComponentLoader } from './helpers';
import { convertComponent } from '../utils';
import { AnyComponent, Errors, ComponentConverters } from '../types';

export interface ApiForward<TApi> {
  piral: TApi;
}

export function withApi<TApi, TProps>(
  converters: ComponentConverters<TProps & ApiForward<TApi>>,
  Component: AnyComponent<TProps & ApiForward<TApi>>,
  piral: TApi,
  errorType: keyof Errors,
) {
  const component = convertComponent(converters, Component, errorType);
  return wrapComponent<TProps, ApiForward<TApi>>(component, {
    forwardProps: { piral },
    onError(error) {
      console.error(piral, error);
    },
    renderChild(child) {
      return <React.Suspense fallback={<ComponentLoader />}>{child}</React.Suspense>;
    },
    renderError(error, props) {
      return <ComponentError type={errorType} error={error} {...props} />;
    },
  });
}
