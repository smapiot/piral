import * as React from 'react';
import { Route, Switch, RouteComponentProps, SwitchProps } from 'react-router';
import { useGlobalState } from '../hooks';

/**
 * The props used by the PiralRoutes component.
 */
export interface RoutesProps extends SwitchProps {
  /**
   * Sets the component for showing the not found page.
   */
  NotFound: React.ComponentType<RouteComponentProps>;
}

/**
 * The component for defining the exclusive routes to be used.
 */
export const PiralRoutes: React.FC<RoutesProps> = ({ NotFound, ...props }) => {
  const routes = useGlobalState((s) => s.routes);
  const pages = useGlobalState((s) => s.registry.pages);

  return (
    <Switch {...props}>
      {Object.keys(routes).map((url) => (
        <Route exact key={url} path={url} component={routes[url]} />
      ))}
      {Object.keys(pages).map((url) => (
        <Route exact key={url} path={url} component={pages[url].component} />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
};
PiralRoutes.displayName = 'Routes';
