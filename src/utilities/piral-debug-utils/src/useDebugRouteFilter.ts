import { useState, useEffect } from 'react';
import { debugRouteCache } from './routeRefresh';
import { RouteRegistration } from './types';

export function useDebugRouteFilter(paths: Array<RouteRegistration>) {
  const [_, triggerChange] = useState(0);

  useEffect(() => {
    const handler = () => {
      triggerChange(s => s + 1);
    };
    window.addEventListener('pilets-reloaded', handler);
    return () => {
      window.removeEventListener('pilets-reloaded', handler);
    };
  }, []);

  if (!debugRouteCache.active) {
    debugRouteCache.paths = paths;
  }

  return debugRouteCache.paths;
}
