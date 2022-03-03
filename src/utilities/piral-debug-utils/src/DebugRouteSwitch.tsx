import * as React from 'react';
import { Switch, Route } from 'react-router';

const debugRouteCache = {
  active: 0,
  paths: [],
  refresh: undefined,
};

export function freezeRouteRefresh() {
  debugRouteCache.active++;

  return () => {
    debugRouteCache.active--;

    if (!debugRouteCache.active) {
      debugRouteCache.refresh?.((s: number) => s + 1);
    }
  };
}

export interface DebugRouteSwitch {
  NotFound: React.ComponentType;
  paths: Array<{
    path: string;
    Component: React.ComponentType;
  }>;
}

export const DebugRouteSwitch: React.FC<DebugRouteSwitch> = ({ paths, NotFound }) => {
  const [_, triggerChange] = React.useState(0);

  React.useEffect(() => {
    debugRouteCache.refresh = triggerChange;
    return () => {
      debugRouteCache.refresh = undefined;
    };
  }, []);

  if (!debugRouteCache.active) {
    debugRouteCache.paths = paths;
  }

  return (
    <Switch>
      {debugRouteCache.paths.map(({ path, Component }) => (
        <Route exact key={path} path={path} component={Component} />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
};
