import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useAction, useSetter } from '../hooks';

export interface SetRouteProps<T = {}> {
  /**
   * The path to the route.
   */
  path: string;
  /**
   * The component to render.
   */
  component: React.ComponentType<RouteComponentProps<T>>;
}

export function SetRoute<T = {}>({ path, component }: SetRouteProps<T>): React.ReactElement {
  const setRoute = useAction('setRoute');
  useSetter(() => component && setRoute(path, component));
  // tslint:disable-next-line:no-null-keyword
  return null;
}
