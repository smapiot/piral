import * as React from 'react';
import { Route, Switch, RouteComponentProps, SwitchProps } from 'react-router-dom';
import { useGlobalState } from '../hooks';

export interface RoutesProps extends SwitchProps {
  NotFound: React.ComponentType<RouteComponentProps>;
}

export const PiralRoutes: React.FC<RoutesProps> = ({ NotFound, ...props }) => {
  const routes = useGlobalState(s => s.routes);
  const pages = useGlobalState(s => s.registry.pages);

  return (
    <Switch {...props}>
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
