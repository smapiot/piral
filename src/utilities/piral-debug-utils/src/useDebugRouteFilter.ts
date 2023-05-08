import { useState, useEffect } from 'react';
import { debugRouteCache } from './routeRefresh';
import { RouteRegistration } from './types';

export function useDebugRouteFilter(paths: Array<RouteRegistration>) {
  const [_, triggerChange] = useState(0);

  useEffect(() => {
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
