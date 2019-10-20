import * as React from 'react';
import { useAction } from '../hooks';
import { ErrorComponentsState } from '../types';

export interface SetErrorProps<TKey extends keyof ErrorComponentsState> {
  /**
   * The name of the error component to set.
   */
  type: TKey;
  /**
   * The error component to define.
   */
  component: ErrorComponentsState[TKey];
}

export function SetError<TKey extends keyof ErrorComponentsState>({
  type,
  component,
}: SetErrorProps<TKey>): React.ReactElement {
  const setErrorComponent = useAction('setErrorComponent');
  React.useEffect(() => component && setErrorComponent(type, component), []);
  // tslint:disable-next-line:no-null-keyword
  return null;
}
