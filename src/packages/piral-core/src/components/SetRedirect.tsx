import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { useAction, useSetter } from '../hooks';

export interface SetRedirectProps {
  /**
   * The path of the seen route.
   */
  from: string;
  /**
   * The path of the target route.
   */
  to: string;
}

export function SetRedirect({ from, to }: SetRedirectProps): React.ReactElement {
  const setRoute = useAction('setRoute');
  useSetter(() => setRoute(from, () => <Redirect to={to} />));
  // tslint:disable-next-line:no-null-keyword
  return null;
}
