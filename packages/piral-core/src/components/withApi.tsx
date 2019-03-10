import * as React from 'react';
import { wrapComponent } from 'react-arbiter';
import { useGlobalState } from '../hooks';
import { AnyComponent, PiralApi } from '../types';

interface ComponentErrorProps {
  error: Error;
}

const ComponentError: React.SFC<ComponentErrorProps> = ({ error }) => {
  const { ErrorInfo } = useGlobalState(s => s.app.components);
  return <ErrorInfo type="feed" error={error} />;
};

type ApiForward<TApi> = {
  piral: PiralApi<TApi>;
};

export function withApi<TApi, TProps>(component: AnyComponent<TProps & ApiForward<TApi>>, piral: PiralApi<TApi>) {
  return wrapComponent<TProps, ApiForward<TApi>>(component, {
    forwardProps: { piral },
    onError(error: Error) {
      piral.trackError(error, { origin: 'piral-error-boundary' });
    },
    renderError(error) {
      return <ComponentError error={error} />;
    },
  });
}
