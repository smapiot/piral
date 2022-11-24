import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useGlobalStateContext, useSetter } from '../hooks';

/**
 * The props for the SetRoute component.
 */
export interface SetRouteProps<T extends { [K in keyof T]?: string } = {}> {
  /**
   * The path to the route.
   */
  path: string;
  /**
   * The component to render.
   */
  component: React.ComponentType<RouteComponentProps<T>>;
}

/**
 * The component capable of setting a global route at mounting.
 */
export function SetRoute<T extends { [K in keyof T]?: string } = {}>({
  path,
  component,
}: SetRouteProps<T>): React.ReactElement {
  const { setRoute } = useGlobalStateContext();
  useSetter(() => component && setRoute(path, component));
  // tslint:disable-next-line:no-null-keyword
  return null;
}
