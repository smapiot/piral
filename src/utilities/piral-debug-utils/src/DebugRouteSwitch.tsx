import * as React from 'react';
import { RouteRegistration } from './types';

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

export function useDebugRouteHandling(paths: Array<RouteRegistration>) {
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

  return debugRouteCache.paths;
}
