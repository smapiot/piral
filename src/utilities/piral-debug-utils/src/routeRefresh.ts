export const debugRouteCache = {
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
