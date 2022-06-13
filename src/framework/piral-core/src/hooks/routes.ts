import { useGlobalState } from './globalState';
import { useRouteFilter } from '../../app.codegen';
import { AppPath } from '../types';

export function useRoutes() {
  const routes = useGlobalState((s) => s.routes);
  const pages = useGlobalState((s) => s.registry.pages);
  const paths: Array<AppPath> = [];

  Object.keys(routes).map((path) => paths.push({ path, Component: routes[path] }));
  Object.keys(pages).map((path) => paths.push({ path, Component: pages[path].component }));

  return useRouteFilter(paths);
}
