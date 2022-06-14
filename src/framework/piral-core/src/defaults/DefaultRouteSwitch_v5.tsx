import * as React from 'react';
import { Switch, Route } from 'react-router';
import { RouteSwitchProps } from '../types';

export const DefaultRouteSwitch: React.FC<RouteSwitchProps> = ({ paths, NotFound, ...props }) => {
  return (
    <Switch {...props}>
      {paths.map(({ path, Component }) => (
        <Route exact key={path} path={path} component={Component} />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
};
DefaultRouteSwitch.displayName = 'DefaultRouteSwitch';
