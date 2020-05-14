import * as React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router';
import { useGlobalState } from '../hooks';

export interface RoutesProps {
  NotFound: React.ComponentType<RouteComponentProps>;
}

export const PiralRoutes: React.FC<RoutesProps> = ({ NotFound }) => {
  const routes = useGlobalState(s => s.routes);
  const pages = useGlobalState(s => s.registry.pages);

  return (
    <Switch>
      {Object.keys(routes).map(url => (
        <Route exact key={url} path={url} component={routes[url]} />
      ))}
      {Object.keys(pages).map(url => (
        <Route exact key={url} path={url} component={pages[url].component} />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
};
PiralRoutes.displayName = 'Routes';
