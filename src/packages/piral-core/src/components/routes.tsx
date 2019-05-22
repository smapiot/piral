import * as React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { useGlobalState } from '../hooks';

export interface RoutesProps {
  Home: React.ComponentType<RouteComponentProps>;
  NotFound: React.ComponentType<RouteComponentProps>;
}

export const Routes: React.SFC<RoutesProps> = ({ Home, NotFound }) => {
  const { pages, routes } = useGlobalState(s => ({
    pages: s.components.pages,
    routes: s.app.routes,
  }));

  return (
    <Switch>
      <Route exact path="/" component={Home} />
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
Routes.displayName = 'Routes';

export default Routes;
