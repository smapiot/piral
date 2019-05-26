import * as React from 'react';
import { wrapComponent } from 'react-arbiter';
import { ComponentError, ComponentLoader } from './helpers';
import { AnyComponent, PiralApi } from '../types';

export interface ApiForward<TApi> {
  piral: PiralApi<TApi>;
}

export function withApi<TApi, TProps>(component: AnyComponent<TProps & ApiForward<TApi>>, piral: PiralApi<TApi>) {
  return wrapComponent<TProps, ApiForward<TApi>>(component, {
    forwardProps: { piral },
    onError(error) {
      piral.trackError(error, { origin: 'piral-error-boundary' });
    },
    renderChild(child) {
      return <React.Suspense fallback={<ComponentLoader />}>{child}</React.Suspense>;
    },
    renderError(error) {
      return <ComponentError type="feed" error={error} />;
    },
  });
}
