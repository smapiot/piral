import * as React from 'react';
import { RouteComponentProps, SwitchProps } from 'react-router';
import { useGlobalState } from '../hooks';
import { createRouteMatcher } from '../utils';
import { RouteSwitchProps } from '../types';

import { useRouteFilter } from '../../app.codegen';

function useShellRoutes() {
  const routes = useGlobalState((s) => s.routes);
  return React.useMemo(
    () =>
      Object.entries(routes).map(([path, Component]) => ({
        path,
        Component,
        meta: Component?.meta || {},
        matcher: createRouteMatcher(path),
      })),
    [routes],
  );
}

function usePiletRoutes() {
  const pages = useGlobalState((s) => s.registry.pages);
  return React.useMemo(
    () =>
      Object.entries(pages).map(([path, entry]) => ({
        path,
        Component: entry.component,
        meta: entry.meta,
        matcher: createRouteMatcher(path),
      })),
    [pages],
  );
}

function useRoutes() {
  const shellRoutes = useShellRoutes();
  const piletRoutes = usePiletRoutes();
  return useRouteFilter([...shellRoutes, ...piletRoutes]);
}

/**
 * The props used by the PiralRoutes component.
 */
export interface RoutesProps extends SwitchProps {
  /**
   * Sets the component for showing the not found page.
   */
  NotFound: React.ComponentType<RouteComponentProps>;
  /**
   * Sets the component for actually switching the routes.
   */
  RouteSwitch: React.ComponentType<RouteSwitchProps>;
}

/**
 * The component for defining the exclusive routes to be used.
 */
export const PiralRoutes: React.FC<RoutesProps> = ({ NotFound, RouteSwitch, ...props }) => {
  const paths = useRoutes();
  return <RouteSwitch NotFound={NotFound} paths={paths} {...props} />;
};
PiralRoutes.displayName = 'Routes';
