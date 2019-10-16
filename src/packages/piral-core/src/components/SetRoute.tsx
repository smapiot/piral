import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useAction } from '../hooks';

export interface SetRoute<T = {}> {
  path: string;
  component: React.ComponentType<RouteComponentProps<T>>;
}

export function SetRoute<T = {}>({ path, component }: SetRoute<T>): React.ReactElement {
  const setRoute = useAction('setRoute');
  React.useEffect(() => component && setRoute(path, component), []);
  // tslint:disable-next-line:no-null-keyword
  return null;
}
