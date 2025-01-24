import * as React from 'react';
//@ts-ignore
import { Switch, Route, useParams, useLocation } from 'wouter';
import type { RouteSwitchProps } from '../types';

function getHistory(navigate: any): any {
  return {
    push(path: string, state: any) {
      navigate(path, { replace: false, state });
    },
    replace(path: string, state: any) {
      navigate(path, { replace: true, state });
    },
  };
}

interface RouteContentWrapperProps {
  Component: RouteSwitchProps['paths'][0]['Component'];
}

const RouteContentWrapper: React.FC<RouteContentWrapperProps> = ({ Component }) => {
  const params = useParams();
  const [pathname, navigate] = useLocation();
  return (
    <Component
      history={getHistory(navigate)}
      location={{ hash: location.hash, pathname, search: location.search, state: undefined }}
      match={{ params, isExact: true, path: pathname, url: location.href }}
    />
  );
};

export const DefaultRouteSwitch: React.FC<RouteSwitchProps> = ({ paths, NotFound, ...props }) => {
  return (
    <Switch {...props}>
      {paths.map(({ path, Component }) => (
        <Route key={path} path={path}>
          <RouteContentWrapper Component={Component} />
        </Route>
      ))}
      <Route>
        <RouteContentWrapper Component={NotFound} />
      </Route>
    </Switch>
  );
};
DefaultRouteSwitch.displayName = 'DefaultRouteSwitch';
