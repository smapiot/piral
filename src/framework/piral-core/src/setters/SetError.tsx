import * as React from 'react';
import { useGlobalStateContext, useSetter } from '../hooks';
import { ErrorComponentsState } from '../types';

/**
 * The props for the SetError component.
 */
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

/**
 * The component capable of setting a globally defined error handler component at mounting.
 */
export function SetError<TKey extends keyof ErrorComponentsState>({
  type,
  component,
}: SetErrorProps<TKey>): React.ReactElement {
  const { setErrorComponent } = useGlobalStateContext();
  useSetter(() => component && setErrorComponent(type, component));
  // tslint:disable-next-line:no-null-keyword
  return null;
}
