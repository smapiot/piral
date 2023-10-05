import * as React from 'react';
import { RouteComponentProps, SwitchProps } from 'react-router';
import { useGlobalState } from '../hooks';
import { createRouteMatcher } from '../utils';
import { RouteSwitchProps } from '../types';
import { useRouteFilter } from '../../app.codegen';

function useRoutes() {
  const routes = useGlobalState((s) => s.routes);
  const pages = useGlobalState((s) => s.registry.pages);

  return useRouteFilter([
    ...Object.entries(routes).map(([path, Component]) => ({
      path,
      Component,
      meta: {},
      matcher: createRouteMatcher(path),
    })),
    ...Object.entries(pages).map(([path, entry]) => ({
      path,
      Component: entry.component,
      meta: entry.meta,
      matcher: createRouteMatcher(path),
    })),
  ]);
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
