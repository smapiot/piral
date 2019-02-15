import * as React from 'react';
import { wrapComponent } from 'react-arbiter';
import { useGlobalState } from '../hooks';
import { AnyComponent, PortalApi } from '../types';

interface ComponentErrorProps {
  error: Error;
}

const ComponentError: React.SFC<ComponentErrorProps> = ({ error }) => {
  const { ErrorInfo } = useGlobalState(s => s.app.components);
  return <ErrorInfo type="feed" error={error} />;
};

export function withApi<TApi, TProps>(
  component: AnyComponent<TProps & { portal: PortalApi<TApi> }>,
  api: PortalApi<TApi>,
) {
  return wrapComponent<TProps & { portal: TApi }, 'portal'>(component, {
    forwardProps: {
      portal: api as any,
    },
    onError(error: Error) {
      api.trackError(error, { origin: 'portal-error-boundary' });
    },
    renderError(error) {
      return <ComponentError error={error} />;
    },
  }) as React.ComponentType<TProps>;
}
