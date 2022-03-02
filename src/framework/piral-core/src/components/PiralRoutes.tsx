import * as React from 'react';
import { RouteComponentProps, SwitchProps } from 'react-router';
import { useGlobalState } from '../hooks';
import { RouteSwitchProps } from '../types';

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
  const routes = useGlobalState((s) => s.routes);
  const pages = useGlobalState((s) => s.registry.pages);
  const paths = [];

  Object.keys(routes).map((path) => paths.push({ path, Component: routes[path] }));
  Object.keys(pages).map((path) => paths.push({ path, Component: pages[path].component }));

  return <RouteSwitch NotFound={NotFound} paths={paths} {...props} />;
};
PiralRoutes.displayName = 'Routes';
