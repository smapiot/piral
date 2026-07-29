import type { RouteRegistration } from './types';

export const debugRouteCache = {
  active: 0,
  paths: [] as Array<RouteRegistration>,
};

export function freezeRouteRefresh() {
  debugRouteCache.active++;

  return () => {
    debugRouteCache.active--;

    if (!debugRouteCache.active) {
      window.dispatchEvent(new CustomEvent('pilets-reloaded'));
    }
  };
}
