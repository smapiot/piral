export const debugRouteCache = {
  active: 0,
  paths: [],
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
